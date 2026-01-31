import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { supabase } from '../supabase';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent implements OnInit {

  userId: number | null = Number(localStorage.getItem('user_id')) || null;

  meals: { name: string; kcal: number }[] = [];

  totalCalories = 0;

  constructor(private router: Router) {}

  async ngOnInit() {
    if (!this.userId) {
      this.router.navigate(['']);
      return;
    }

    await this.loadMeals();
  }

  logout() {
    localStorage.removeItem('user_id');
    this.router.navigate(['']);
  }

  async loadMeals() {
    const { data, error } = await supabase
      .from('users_meals')
      .select(`
        kcal,
        meals ( name )
      `)
      .eq('user_id', this.userId);

    if (error) {
      console.error('Failed loading meals:', error);
      return;
    }

    this.meals = (data ?? []).map((row: any) => ({
      name: row.meals?.name ?? 'Unknown meal',
      kcal: Number(row.kcal)
    }));

    this.totalCalories = this.meals.reduce(
      (sum, m) => sum + m.kcal,
      0
    );
  }
}
