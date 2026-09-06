import { Routes } from '@angular/router';
import { authGuard } from '../../core/services/authGuard';
import { FavorList } from './favor-list/favor-list';

export const favor_routes: Routes = [
  { path: 'all-favour', component: FavorList, canActivate: [authGuard] },
];
