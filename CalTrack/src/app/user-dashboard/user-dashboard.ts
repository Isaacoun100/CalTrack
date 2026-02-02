import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { supabase } from '../supabase';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent implements AfterViewInit {

  userId!: number; // now comes from localStorage

  totalCalories = 0;
  meals: any[] = [];

  weeklyLabels: string[] = [];
  weeklyCalories: number[] = [];
  sidebarOpen = true;

  constructor( 
    private cdr: ChangeDetectorRef,
    private router: Router
  ){}


  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }


  async ngAfterViewInit() {

    this.userId = Number(localStorage.getItem('user_id'));

    // GET LOGGED USER
    const storedId = localStorage.getItem('userId');

    if (!storedId) {
      console.warn('No user logged in');
      return;
    }

    this.userId = Number(storedId);

    await this.loadTodayCalories();
    await this.loadRecentMeals();
    await this.loadWeeklyChart();
  }

  // -------------------------
  // TOTAL KCAL TODAY
  // -------------------------
  async loadTodayCalories() {
    const today = new Date().toLocaleDateString('en-CA');

    const { data } = await supabase
      .from('users_meals')
      .select('kcal')
      .eq('user_id', this.userId)
      .eq('date', today);

    this.totalCalories =
      data?.reduce((sum, m) => sum + Number(m.kcal || 0), 0) || 0;
  }

  // -------------------------
  // LAST 10 MEALS
  // -------------------------
  async loadRecentMeals() {
    const { data } = await supabase
      .from('users_meals')
      .select(`
        date,
        kcal,
        meals!inner (
          name
        )
      `)
      .eq('user_id', this.userId)
      .order('date', { ascending: false })
      .limit(10);

    this.meals = (data || []).map((m: any) => ({
      name: m.meals?.name || 'Unknown meal',
      kcal: m.kcal,
      date: m.date
    }));

    this.cdr.detectChanges();
  }


  // -------------------------
  // WEEKLY CHART
  // -------------------------
  async loadWeeklyChart() {
    const start = new Date();
    start.setDate(start.getDate() - 6);

    const startDate = start.toISOString().split('T')[0];

    const { data } = await supabase
      .from('users_meals')
      .select('date, kcal')
      .eq('user_id', this.userId)
      .gte('date', startDate)
      .order('date');

    if (!data || data.length === 0) {
      this.renderChart([], []);
      return;
    }

    const dailyTotals: Record<string, number> = {};

    for (const row of data) {
      dailyTotals[row.date] =
        (dailyTotals[row.date] || 0) + Number(row.kcal);
    }

    this.weeklyLabels = Object.keys(dailyTotals);
    this.weeklyCalories = Object.values(dailyTotals);

    this.renderChart(this.weeklyLabels, this.weeklyCalories);
  }

  renderChart(labels: string[], values: number[]) {
    const ctx = document.getElementById('weeklyChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Calories',
          data: values,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
  
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
