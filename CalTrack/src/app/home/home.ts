import { Component, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async login() {
    this.errorMessage = '';
    this.loading = true;

    const [userRes, nutriRes] = await Promise.all([
      supabase
        .from('users')
        .select('id')
        .eq('username', this.username)
        .eq('password', this.password)
        .limit(1)
        .maybeSingle(),
      supabase
        .from('nutritionists')
        .select('id')
        .eq('username', this.username)
        .eq('password', this.password)
        .limit(1)
        .maybeSingle()
    ]);

    this.loading = false;

    if (userRes.data) {
      if (userRes.data) {
        localStorage.setItem('user_id', userRes.data.id);
        this.router.navigate(['/user-dashboard']);
        return;
      }

      return;
    }

    if (nutriRes.data) {
      this.router.navigate(['/nutri-dashboard']);
      return;
    }

    this.errorMessage = 'Invalid username or password';
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}