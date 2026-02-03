import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../supabase';

@Component({
  selector: 'app-sign-up-nutri',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app-sign-up-nutri.html',
  styleUrls: ['./app-sign-up-nutri.css'] 
})
export class SignUpNutriComponent {

  errorMessage = '';
  
  nutri = {
    firstName: '',
    firstLastName: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async createNutri() {
    if (!this.nutri.firstName || !this.nutri.email || !this.nutri.password) {
      this.errorMessage = 'Por favor rellene los campos obligatorios';
      return;
    }

    const { error } = await supabase
      .from('nutritionists')
      .insert([{
        firstName: this.nutri.firstName,
        firstLastName: this.nutri.firstLastName,
        username: this.nutri.email,
        password: this.nutri.password
      }]);

    if (error) {
      this.errorMessage = error.message;
      this.cdr.detectChanges();
    } else {
      alert('¡Registro exisoso!');
      this.router.navigate(['/ver-usuarios']);
    }
  }
  cancel() {
    this.router.navigate(['/ver-usuarios']);
  }
}