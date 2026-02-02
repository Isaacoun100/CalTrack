import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { supabase } from '../supabase';

@Component({
  selector: 'app-nutri-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nutri-dashboard.html',
  styleUrls: ['./nutri-dashboard.css'] 
})
export class NutriDashboardComponent implements OnInit {

  nutriId: number | null = Number(localStorage.getItem('nutri_id')) || null;
  recentPatientMeals: { patientName: string; mealName: string; kcal: number }[] = [];
  totalGlobalCalories = 0;
  patients: any[] = []; 

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    if (!this.nutriId) {
      this.router.navigate(['']);
      return;
    }
    await this.loadPatientsData();
  }

  // logica para el IMC
  
  calculateIMC(weight: number, heightCm: number): number {
    if (!weight || !heightCm) return 0;
    return weight / (heightCm * heightCm);
  }

  getIMCCategory(imc: number): string {
    if (imc <= 0) return 'Sin datos';
    if (imc < 18.5) return 'Bajo Peso';
    if (imc < 25) return 'Normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  getIMCClass(imc: number): string {
    if (imc <= 0) return 'badge bg-secondary';
    if (imc >= 18.5 && imc < 25) return 'badge bg-success';
    if (imc >= 25 && imc < 30) return 'badge bg-warning text-dark';
    return 'badge bg-danger';
  }

  viewDetails(patientId: number) {
    // Redirige a la vista de metas/detalles usando el ID del paciente
    this.router.navigate(['/check-goals'], { queryParams: { userId: patientId } });
  }

  async loadPatientsData() {
    const { data: assignments, error: assignError } = await supabase
      .from('nutritionist_users')
      .select(`
        user_id,
        users (*) 
      `)
      .eq('nutritionist_id', this.nutriId);

    if (assignError || !assignments) {
      console.error('Error obteniendo pacientes:', assignError);
      return;
    }
    this.patients = assignments.map(a => a.users).filter(u => u !== null);
    if (this.patients.length === 0) return;
    const patientIds = this.patients.map(p => p.id);
    const { data, error } = await supabase
      .from('users_meals')
      .select(`
        kcal,
        users!inner ( firstName, firstLastName ),
        meals ( name )
      `)
      .in('user_id', patientIds)
      .order('date', { ascending: false })
      .limit(10);
      this.cdr.detectChanges();

    if (!error && data) {
      this.recentPatientMeals = data.map((row: any) => ({
        patientName: `${row.users?.firstName} ${row.users?.firstLastName}`,
        mealName: row.meals?.name ?? 'Comida desconocida',
        kcal: Number(row.kcal || 0)
      }));
      
      this.totalGlobalCalories = this.recentPatientMeals.reduce((sum, m) => sum + m.kcal, 0);
    }
  }

  goToDashboard(){
    this.router.navigate(['/nutri-dashboard']);
  }
  goToGestAlimentos(){
    this.router.navigate(['/gestion-alimentos'])
  }
  goToVerUsuarios(){
    this.router.navigate(['/ver-usuarios'])
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}