import { Routes } from '@angular/router';
import { UserMaterialUser } from './user-material-user/user-material-user';
import { authGuard } from '../../core/services/authGuard';
import { UserMaterialDetail } from './user-material-detail/user-material-detail';
import { UserMaterialDelete } from './user-material-delete/user-material-delete';
import { UserMaterialEdit } from './user-material-edit/user-material-edit';

export const user_material_routes: Routes = [
  { path: 'my-user-material', component: UserMaterialUser, canActivate: [authGuard] },
  { path: 'user-material-detail/:id', component: UserMaterialDetail, canActivate: [authGuard] },
  { path: 'delete-my-material/:id', component: UserMaterialDelete, canActivate: [authGuard] },
  { path: 'edit-my-material/:id', component: UserMaterialEdit, canActivate: [authGuard] },
];
