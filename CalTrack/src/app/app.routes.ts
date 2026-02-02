import { Routes } from '@angular/router';
import { Home } from './home/home';
import { UserDashboard } from './user-dashboard/user-dashboard';
import { NutriDashboardComponent } from './nutri-dashboard/nutri-dashboard';
import { SignUpComponent } from './sign-up/sign-up';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'user-dashboard', component: UserDashboard },
  { path: 'nutri-dashboard', component: NutriDashboardComponent },
  { path: 'sign-up', component: SignUpComponent }
];
