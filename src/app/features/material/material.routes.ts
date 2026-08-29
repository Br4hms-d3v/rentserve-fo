import { Routes } from '@angular/router';
import { MaterialList } from './material-list/material-list';
import { authGuard } from '../../core/services/authGuard';

export const material_routes: Routes = [
  {path: 'all-materials', component: MaterialList, canActivate: [authGuard]}
]
