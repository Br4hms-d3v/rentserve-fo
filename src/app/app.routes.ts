import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren:() => import('./features/home/home.routes').then((r) => r.home_routes)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((r) => r.auth_routes)
  },
];
