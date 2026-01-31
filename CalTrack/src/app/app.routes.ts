import { Routes } from '@angular/router';
import { Home } from './home/home';
import { UserDashboardComponent } from './user-dashboard/user-dashboard';
import { NutriDashboard } from './nutri-dashboard/nutri-dashboard';
import { SignUpComponent } from './sign-up/sign-up';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'nutri-dashboard', component: NutriDashboard },
  { path: 'sign-up', component: SignUpComponent }
];
