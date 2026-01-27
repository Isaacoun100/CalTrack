import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {
    this.http.get<any>('clients.json').subscribe(data => {

      const nutri = data.nutritionist.find(
        (n: any) => n.username === this.username && n.password === this.password
      );

      if (nutri) {
        this.router.navigate(['/nutri-dashboard']);
        return;
      }

      const user = data.users.find(
        (u: any) => u.username === this.username && u.password === this.password
      );

      if (user) {
        this.router.navigate(['/user-dashboard']);
        return;
      }

      this.errorMessage = 'Invalid username or password';
    });
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
