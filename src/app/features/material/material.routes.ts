import { Routes } from '@angular/router';
import { MaterialList } from './material-list/material-list';
import { authGuard } from '../../core/services/authGuard';
import { MaterialEdit } from './material-edit/material-edit';
import { MaterialCreate } from './material-create/material-create';

export const material_routes: Routes = [
  {path: 'all-materials', component: MaterialList, canActivate: [authGuard]},
  {path: ':id/edit', component: MaterialEdit, canActivate: [authGuard]},
  {path: 'create/new-material', component: MaterialCreate, canActivate: [authGuard]},
]
