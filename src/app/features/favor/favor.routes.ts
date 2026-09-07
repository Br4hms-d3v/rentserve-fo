import { Routes } from '@angular/router';
import { authGuard } from '../../core/services/authGuard';
import { FavorList } from './favor-list/favor-list';
import { FavorEdit } from './favor-edit/favor-edit';

export const favor_routes: Routes = [
  { path: 'all-favour', component: FavorList, canActivate: [authGuard] },
  { path: ':id/edit', component: FavorEdit, canActivate: [authGuard] },
];
