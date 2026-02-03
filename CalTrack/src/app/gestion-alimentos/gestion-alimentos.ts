import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';
import { supabase } from '../supabase';

@Component({
  selector: 'app-gestion-alimentos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gestion-alimentos.html',
  styleUrls: ['./gestion-alimentos.css']
})
export class GestionAlimentosComponent implements OnInit {
  nutriId: number | null = Number(localStorage.getItem('nutri_id')) || null
  alimentos: any[] = [];
  editando: boolean = false;
  idEnEdicion: number | null = null;
  
  // Modelo para el nuevo alimento
  nuevoAlimento = {
    name: '',
    kcal: 0,
    weight: 0
  };

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    if (!this.nutriId) {
      this.router.navigate(['']);
      return;
    }
    await this.loadAlimentos();
  }

  async loadAlimentos() {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('name', { ascending: true });

    if (!error) 
      this.alimentos = data || [];
    this.cdr.detectChanges();
  }

async guardarAlimento() {
    if (!this.nuevoAlimento.name || this.nuevoAlimento.kcal <= 0) {
      alert('Datos inválidos');
      return;
    }

    if (this.editando && this.idEnEdicion) {
      // update
      const { error } = await supabase
        .from('meals')
        .update(this.nuevoAlimento)
        .eq('id', this.idEnEdicion);

      if (!error) alert('Alimento actualizado');
    } else {
      // insert
      const { error } = await supabase
        .from('meals')
        .insert([this.nuevoAlimento]);
      
      if (!error) alert('Alimento creado');
    }

    this.cancelarEdicion();
    await this.loadAlimentos();
  }
  prepararEdicion(alimento: any) {
      this.editando = true;
      this.idEnEdicion = alimento.id;
      // Clonamos el objeto para no editar la tabla en vivo antes de guardar
      this.nuevoAlimento = { 
        name: alimento.name, 
        kcal: alimento.kcal, 
        weight: alimento.weight 
      };
      this.cdr.detectChanges();
    }

  cancelarEdicion() {
    this.editando = false;
    this.idEnEdicion = null;
    this.nuevoAlimento = { name: '', kcal: 0, weight: 0 };
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
    window.location.href = '/';
  }
}