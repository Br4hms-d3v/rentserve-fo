import { Routes } from '@angular/router';
import { authGuard } from '../../core/services/authGuard';
import { FavorList } from './favor-list/favor-list';
import { FavorEdit } from './favor-edit/favor-edit';
import { FavorCreate } from './favor-create/favor-create';

export const favor_routes: Routes = [
  { path: 'all-favour', component: FavorList, canActivate: [authGuard] },
  { path: ':id/edit', component: FavorEdit, canActivate: [authGuard] },
  { path: 'create/new-favor', component: FavorCreate, canActivate: [authGuard] },
];
