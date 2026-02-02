import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../supabase';

interface Meal {
  id: number;
  name: string;
  kcal: number;
  weight: number;
}

interface TodayMealRow {
  kcal: number;
  meals: {
    name: string;
  } | null;
}



@Component({
  selector: 'app-log-cal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-cal.html',
  styleUrls: ['./log-cal.css']
})
export class LogCalComponent implements AfterViewInit {

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  userId!: number;

  meals: Meal[] = [];
  selectedMeal: Meal | null = null;
  selectedMealName = '';

  weight = 0;
  calculatedCalories = 0;

  todayMeals: { name: string; kcal: number }[] = [];

  loading = false;

  // -----------------------
  async ngAfterViewInit() {
    this.userId = Number(localStorage.getItem('userId'));
    await this.loadMeals();
    await this.loadTodayMeals();
  }

  // -----------------------
  async loadMeals() {
    const { data, error } = await supabase
      .from('meals')
      .select('id, name, kcal, weight')
      .order('name');

    if (error) {
      console.error(error);
      return;
    }

    this.meals = data as Meal[];
  }

  // -----------------------
  onMealSelected() {
    this.selectedMeal = this.meals.find(
      m => m.name.toLowerCase() === this.selectedMealName.toLowerCase()
    ) ?? null;

    this.calculateCalories();
  }

  // -----------------------
  calculateCalories() {
    if (!this.selectedMeal || !this.weight) {
      this.calculatedCalories = 0;
      return;
    }

    this.calculatedCalories = Math.round(
      (this.selectedMeal.kcal / this.selectedMeal.weight) * this.weight
    );
  }

  // -----------------------
  async logMeal() {
    if (!this.selectedMeal || this.loading) return;

    this.loading = true;

    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('users_meals')
      .insert({
        user_id: this.userId,
        meal_id: this.selectedMeal.id,
        date: today,
        kcal: this.calculatedCalories
      });

    this.loading = false;

    if (error) {
      console.error('Insert failed:', error);
      return;
    }

    // reset form
    this.weight = 0;
    this.calculatedCalories = 0;
    this.selectedMealName = '';
    this.selectedMeal = null;

    await this.loadTodayMeals();
  }

  // -----------------------
  async loadTodayMeals() {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('users_meals')
      .select(`
        kcal,
        meals!inner (
          name
        )
      `)

      .eq('user_id', this.userId)
      .eq('date', today)
      .order('id', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const rows = data as unknown as TodayMealRow[];

    this.todayMeals = rows.map(m => ({
      name: m.meals?.name ?? 'Unknown',
      kcal: m.kcal
    }));



    this.cdr.detectChanges();
  }

  // -----------------------
  goToUserDashboard() {
    this.router.navigate(['/user-dashboard']);
  }

  goToGoals() {
    this.router.navigate(['/check-goals']);
  }

  goToLogCal() {
    this.router.navigate(['/log-cal']);
  }

  logout() {
    localStorage.clear();
    location.href = '/';
  }
}
