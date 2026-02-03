import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from '../supabase';

@Component({
  selector: 'app-nutri-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // 👈 ADD THIS
  templateUrl: './nutri-dashboard.html',
  styleUrls: ['./nutri-dashboard.css']
})
export class NutriDashboardComponent implements OnInit {

  nutriId: number | null = Number(localStorage.getItem('nutri_id')) || null;
  recentPatientMeals: { patientName: string; mealName: string; kcal: number }[] = [];
  totalGlobalCalories = 0;
  patients: any[] = []; 
  availableUsers: any[] = [];
  selectedUserId: number | null = null;
  assigning = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    if (!this.nutriId) {
      this.router.navigate(['']);
      return;
    }
    await this.loadPatientsData();
    await this.loadPatientsData();
    await this.loadAvailableUsers();

  }

  async loadAvailableUsers() {
    // Get all assigned user ids
    const { data: assigned } = await supabase
      .from('nutritionist_users')
      .select('user_id');

    const assignedIds = assigned?.map(a => a.user_id) || [];

    let query = supabase.from('users').select('id, firstName, firstLastName');

    if (assignedIds.length > 0) {
      query = query.not('id', 'in', `(${assignedIds.join(',')})`);
    }

    const { data, error } = await query.order('firstName');

    if (error) {
      console.error(error);
      this.cdr.detectChanges();
      return;
    }
    
    this.cdr.detectChanges();
    this.availableUsers = data || [];
  }

  async unassignUser(userId: number) {
    if (!this.nutriId) return;

    const confirmed = confirm('¿Seguro que quieres desasignar este usuario?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('nutritionist_users')
      .delete()
      .eq('nutritionist_id', this.nutriId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error desasignando usuario:', error);
      return;
    }

    // refresh table instantly
    await this.loadPatientsData();
    await this.loadAvailableUsers();
    this.cdr.detectChanges();
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

  async assignUser() {
    if (!this.selectedUserId || !this.nutriId) return;

    this.assigning = true;

    const { error } = await supabase
      .from('nutritionist_users')
      .insert({
        nutritionist_id: this.nutriId,
        user_id: this.selectedUserId
      });

    this.assigning = false;

    if (error) {
      console.error('Assign failed:', error);
      return;
    }

    this.selectedUserId = null;

    await this.loadPatientsData();
    await this.loadAvailableUsers();
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