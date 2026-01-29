import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../supabase';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css']
})
export class SignUpComponent {

  showPassword = false;
  errorMessage = '';

  user = {
    firstName: '',
    firstLastName: '',
    secondLastName: '',
    height: null,
    weight: null,
    age: null,
    phoneNumber: '',
    username: '',
    password: ''
  };

  constructor(private router: Router) {}

  navigateToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['']);
  }

  async createUser(formData: any) {
    const { error } = await supabase
      .from('users')
      .insert([{
        firstName: formData.firstName,
        firstLastName: formData.firstLastName,
        secondLastName: formData.secondLastName,
        height: formData.height,
        weight: formData.weight,
        age: formData.age,
        phoneNumber: formData.phoneNumber,
        username: formData.username,
        password: formData.password
      }]);

    if (error) {
      if (error.code === '23505') {
        this.errorMessage = 'Email already exists';
      } else {
        this.errorMessage = 'Something went wrong';
        console.error(error);
      }
    } else {
      this.router.navigate(['']);
    }
  }
}
