import { Routes } from '@angular/router';
import { UserMaterialUser } from './user-material-user/user-material-user';
import { authGuard } from '../../core/services/authGuard';

export const user_material_routes: Routes = [
  { path: 'my-user-material', component: UserMaterialUser, canActivate: [authGuard] },
];
