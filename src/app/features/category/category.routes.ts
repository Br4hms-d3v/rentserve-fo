import { Routes } from '@angular/router';
import { CategoryMaterialEdit } from './category-material-edit/category-material-edit';
import { authGuard } from '../../core/services/authGuard';

export const category_routes: Routes = [
  { path: ':id/edit-category', component: CategoryMaterialEdit, canActivate: [authGuard] },
];
