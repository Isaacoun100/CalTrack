import { Routes } from '@angular/router';
import { Home } from './home/home';
import { UserDashboardComponent } from './user-dashboard/user-dashboard';
import { CheckGoals } from './check-goals/check-goals';
import { CheckUsers } from './check-users/check-users';
import { LogCal } from './log-cal/log-cal';
import { NutriDashboard } from './nutri-dashboard/nutri-dashboard';
import { SignUpComponent } from './sign-up/sign-up';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'nutri-dashboard', component: NutriDashboard },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'check-goals', component:CheckGoals},
  { path: 'check-users', component:CheckUsers},
  { path: 'log-cal', component:LogCal}
];
