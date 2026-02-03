import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.html'] 
})
export class ForgotPassword {
  email = '';
  code = '';
  step = 1; 

  constructor(private router: Router) {}

  sendEmail() {
    if (this.email) {
      this.step = 2;
    }
  }

  verifyCode() {
    // Simulación: Volver al login
    alert('Código verificado (Simulación). Redirigiendo al inicio...');
    this.router.navigate(['/']);
  }

  backToLogin() {
    this.router.navigate(['/']);
  }
}