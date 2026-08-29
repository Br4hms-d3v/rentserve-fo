import { Routes } from '@angular/router';
import { Home } from './home/home/home';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from '../../core/services/authGuard';

export const home_routes: Routes = [
  { path: '', redirectTo: 'rent-serve', pathMatch: 'full' },
  { path: 'rent-serve', component: Home },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
];
