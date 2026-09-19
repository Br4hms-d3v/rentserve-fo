import { Routes } from '@angular/router';
import { CategoryMaterialEdit } from './category-material-edit/category-material-edit';
import { authGuard } from '../../core/services/authGuard';
import { CategoryFavorEdit } from './category-favor-edit/category-favor-edit';

export const category_routes: Routes = [
  { path: ':id/edit-category', component: CategoryMaterialEdit, canActivate: [authGuard] },
  { path: ':id/edit-favor', component: CategoryFavorEdit, canActivate: [authGuard] },
];
