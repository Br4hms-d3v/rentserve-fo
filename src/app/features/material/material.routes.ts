import { Routes } from '@angular/router';
import { MaterialList } from './material-list/material-list';
import { authGuard } from '../../core/services/authGuard';
import { MaterialEdit } from './material-edit/material-edit';
import { MaterialCreate } from './material-create/material-create';
import { MaterialDelete } from './material-delete/material-delete';
import { MaterialListByCategory } from './material-list-by-category/material-list-by-category';

export const material_routes: Routes = [
  { path: 'all-materials', component: MaterialList, canActivate: [authGuard] },
  { path: ':id/edit', component: MaterialEdit, canActivate: [authGuard] },
  { path: 'create/new-material', component: MaterialCreate, canActivate: [authGuard] },
  { path: ':id/delete-material', component: MaterialDelete, canActivate: [authGuard] },
  { path: 'list/:nameCategory', component: MaterialListByCategory, canActivate: [authGuard] },
];
