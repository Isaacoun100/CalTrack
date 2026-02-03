import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from '../supabase';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

interface WeightRow {
  weight: number;
  date: string;
}

@Component({
  selector: 'app-check-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './check-goals.html',
  styleUrls: ['./check-goals.css']
})
export class CheckGoals implements AfterViewInit {

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  userId!: number;

  weight = 0;
  loading = false;

  dailyGoal = 0;

  weights: WeightRow[] = [];

  chart!: Chart;

  // ------------------------
  async ngAfterViewInit() {
    this.userId = Number(localStorage.getItem('userId'));

    await this.loadGoal();
    await this.loadWeights();

    this.renderChart();
  }

  // ------------------------
  async loadGoal() {
    const { data, error } = await supabase
      .from('goals')
      .select('daily_kcal_limit')
      .eq('user_id', this.userId)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      this.dailyGoal = Number(data.daily_kcal_limit);
    }
  }

  // ------------------------
  async saveWeight() {
    if (!this.weight || this.loading) return;

    this.loading = true;

    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('users_weight')
      .insert({
        user_id: this.userId,
        weight: this.weight,
        date: today
      });

    this.loading = false;

    if (error) {
      console.error(error);
      return;
    }

    this.weight = 0;

    await this.loadWeights();
    this.updateChart();
  }

  // ------------------------
  async loadWeights() {
    const { data, error } = await supabase
      .from('users_weight')
      .select('weight, date')
      .eq('user_id', this.userId)
      .order('date');

    if (error) {
      console.error(error);
      return;
    }

    this.weights = data as WeightRow[];

    this.cdr.detectChanges();
  }

  // ------------------------
  renderChart() {
    const ctx = document.getElementById('weightChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.weights.map(w => w.date),
        datasets: [{
          label: 'Weight (kg)',
          data: this.weights.map(w => w.weight),
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }

  // ------------------------
  updateChart() {
    if (!this.chart) {
      this.renderChart();
      return;
    }

    this.chart.data.labels = this.weights.map(w => w.date);
    this.chart.data.datasets[0].data = this.weights.map(w => w.weight);
    this.chart.update();
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
