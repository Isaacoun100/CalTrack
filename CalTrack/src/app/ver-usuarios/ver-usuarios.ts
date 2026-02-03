import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { supabase } from '../supabase';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-ver-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ver-usuarios.html',
  styleUrl: './ver-usuarios.css',
})
export class VerUsuarios implements OnInit {
  nutriId: number | null = Number(localStorage.getItem('nutri_id')) || null;
  patients: any[] = [];
  selectedPatient: any = null;
  weightChart: any;
  kcalChart: any;
  nuevaMeta = {
    daily_kcal_limit: 0,
    start_date: new Date().toISOString().split('T')[0]
  };

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    if (!this.nutriId) {
      this.router.navigate(['']);
      return;
    }
    await this.loadPatients();
  }

  async loadPatients() {
    const { data, error } = await supabase
      .from('nutritionist_users')
      .select('users (*)')
      .eq('nutritionist_id', this.nutriId);

    if (!error) {
      this.patients = data.map(d => d.users);
      this.cdr.detectChanges();
    }
  }

  async selectPatient(patient: any) {
    this.selectedPatient = patient;
    this.cdr.detectChanges();
    await this.loadPatientData(patient.id);
  }

  async loadPatientData(userId: number) {
    const { data: weightData } = await supabase
      .from('users_weight')
      .select('weight, date')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    const { data: kcalData } = await supabase
      .from('users_meals')
      .select('date, kcal')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    this.renderCharts(weightData || [], kcalData || []);
  }

  renderCharts(weights: any[], meals: any[]) {
    if (this.weightChart) this.weightChart.destroy();
    if (this.kcalChart) this.kcalChart.destroy();

    this.weightChart = new Chart('weightChart', {
      type: 'line',
      data: {
        labels: weights.map(w => w.date),
        datasets: [{ label: 'Peso (kg)', data: weights.map(w => w.weight), borderColor: '#6b6b6b' }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            suggestedMin: Math.min(...weights.map(w => w.weight)) - 15,
            suggestedMax: Math.max(...weights.map(w => w.weight)) + 15
        }


        }
      }
    });

    const dailyKcal: any = {};
    meals.forEach(m => dailyKcal[m.date] = (dailyKcal[m.date] || 0) + m.kcal);

    this.kcalChart = new Chart('kcalChart', {
      type: 'bar',
      data: {
        labels: Object.keys(dailyKcal),
        datasets: [{ label: 'Kcal Consumidas', data: Object.values(dailyKcal), backgroundColor: '#6b6b6b', borderColor: '#666666', borderWidth: 1 }]
      }
    });
  }

  async asignarMeta() {
    if (this.nuevaMeta.daily_kcal_limit <= 0) return alert('Ingrese un límite válido');

    const { error } = await supabase
      .from('goals') 
      .insert([{
        user_id: this.selectedPatient.id,
        assigned_by: this.nutriId,
        daily_kcal_limit: this.nuevaMeta.daily_kcal_limit,
        start_date: this.nuevaMeta.start_date,
        is_active: true
      }]);

    if (!error) {
      alert('Meta asignada con éxito');
      this.nuevaMeta.daily_kcal_limit = 0;
    } else {
      console.error(error);
    }
  }
  goToDashboard() { this.router.navigate(['/nutri-dashboard']); }
  goToGestAlimentos() { this.router.navigate(['/gestion-alimentos']); }
  goToVerUsuarios() { this.router.navigate(['/ver-usuarios']); }
  goToAddNutri() { this.router.navigate(['/app-sing-up-nutri']); } 
  logout() { localStorage.clear(); this.router.navigate(['']); }
}