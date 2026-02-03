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
    this.router.navigate(['/ver-usuarios'], { queryParams: { userId: patientId } });
  }

async loadPatientsData() {
    const { data: assignments, error: assignError } = await supabase
      .from('nutritionist_users')
      .select(`
        user_id,
        users (
          id, firstName, firstLastName, age, height,
          users_weight (
            weight,
            date
          )
        )
      `)
      .eq('nutritionist_id', this.nutriId);

    if (assignError || !assignments) {
      console.error('Error obteniendo pacientes:', assignError);
      return;
    }
    this.patients = assignments.map((a: any) => {
      const user = a.users;
      const weights = user.users_weight || [];
      const latestRecord = weights.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

      return {
        ...user,
        // Si no tiene registros en la tabla nueva, podrías poner 0 o null
        weight: latestRecord ? latestRecord.weight : 0 
      };
    }).filter(u => u !== null);

    if (this.patients.length === 0) {
      this.cdr.detectChanges();
      return;
    }
    this.cdr.detectChanges();
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
  goToAddNutri() { 
    this.router.navigate(['/app-sing-up-nutri']); 
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}