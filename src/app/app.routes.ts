import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then((r) => r.home_routes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((r) => r.auth_routes),
  },
  {
    path: 'material',
    loadChildren: () => import('./features/material/material.routes').then((r) => r.material_routes),
  },
  {
    path: 'favor',
    loadChildren: () => import('./features/favor/favor.routes').then((r) => r.favor_routes),
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.routes').then((r) => r.user_routes),
  },
  {
    path: 'category', loadChildren: () => import('./features/category/category.routes').then((r) => r.category_routes),
  },
  {
    path: 'user-material', loadChildren: () => import('./features/userMaterial/user-material.routes').then((r) => r.user_material_routes),
  },
  {
    path: 'user-favor', loadChildren: () => import('./features/userFavor/user-favor.routes').then((r) => r.user_favor_routes),
  },
  {
    path: 'review', loadChildren: () => import('./features/review/review.routes').then((r) => r.review_routes),
  },
  {
    path: 'earn', loadChildren: () => import('./features/earn/earn.routes').then((r) => r.earn_routes),
  },
  {
    path: 'rental', loadChildren: () => import('./features/rental/rental.routes').then((r) => r.rental_routes)
  }
];
