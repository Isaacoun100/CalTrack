import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../supabase';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  username = '';
  password = '';
  errorMessage = '';
  loading = false;
  showPassword = false;

  constructor(private router: Router) {}

  async login() {
    this.errorMessage = '';
    this.loading = true;

    // 🔎 Check USERS first
    const userRes = await supabase
      .from('users')
      .select('*')
      .eq('username', this.username)
      .eq('password', this.password)
      .maybeSingle();

    if (userRes.data) {
      this.loading = false;
      this.router.navigate(['/user-dashboard']);
      return;
    }

    // 🔎 Then check NUTRITIONISTS
    const nutriRes = await supabase
      .from('nutritionists')
      .select('*')
      .eq('username', this.username)
      .eq('password', this.password)
      .maybeSingle();

    this.loading = false;

    if (nutriRes.data) {
      this.router.navigate(['/nutri-dashboard']);
      return;
    }

    this.errorMessage = 'Invalid username or password';
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
