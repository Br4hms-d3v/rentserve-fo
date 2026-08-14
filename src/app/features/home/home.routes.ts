import { Routes } from '@angular/router';
import { Home } from './home/home/home';

export const home_routes: Routes = [
  { path: '', redirectTo: 'rent-serve', pathMatch: 'full' },
  { path: 'rent-serve', component: Home },
];
