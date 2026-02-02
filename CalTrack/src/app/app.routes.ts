import { Routes } from '@angular/router';
import { Home } from './home/home';
import { UserDashboardComponent } from './user-dashboard/user-dashboard';
import { CheckGoals } from './check-goals/check-goals';
import { CheckUsers } from './check-users/check-users';
import { LogCalComponent } from './log-cal/log-cal';
import { NutriDashboard } from './nutri-dashboard/nutri-dashboard';
import { SignUpComponent } from './sign-up/sign-up';
import { GestionAlimentos } from './gestion-alimentos/gestion-alimentos';
import { VerUsuarios } from './ver-usuarios/ver-usuarios';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'nutri-dashboard', component: NutriDashboard },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'check-goals', component:CheckGoals},
  { path: 'check-users', component:CheckUsers},
  { path: 'log-cal', component:LogCalComponent}
];
