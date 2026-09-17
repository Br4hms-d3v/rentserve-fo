import { Routes } from '@angular/router';
import { authGuard } from '../../core/services/authGuard';
import { FavorList } from './favor-list/favor-list';
import { FavorEdit } from './favor-edit/favor-edit';
import { FavorCreate } from './favor-create/favor-create';
import { FavorDelete } from './favor-delete/favor-delete';
import { FavorListByCategory } from './favor-list-by-category/favor-list-by-category';

export const favor_routes: Routes = [
  { path: 'all-favour', component: FavorList, canActivate: [authGuard] },
  { path: ':id/edit', component: FavorEdit, canActivate: [authGuard] },
  { path: 'create/new-favor', component: FavorCreate, canActivate: [authGuard] },
  { path: ':id/delete-favor', component: FavorDelete, canActivate: [authGuard] },
  { path: 'list/:nameCategory', component: FavorListByCategory, canActivate: [authGuard] },
];
