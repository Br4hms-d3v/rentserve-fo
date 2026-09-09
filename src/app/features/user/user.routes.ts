import { Routes } from '@angular/router';
import { UserEdit } from './user-edit/user-edit';
import { authGuard } from '../../core/services/authGuard';
import { UserProfile } from './user-profile/user-profile';
import { UserPassword } from './user-password/user-password';
import { UserDelete } from './user-delete/user-delete';

export const user_routes: Routes = [
  {
    path: 'profile',
    component: UserProfile,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'edit',
        pathMatch: 'full',
      },
      {
        path: 'edit',
        component: UserEdit,
        canActivate: [authGuard],
      },
      {
        path: 'password',
        component: UserPassword,
        canActivate: [authGuard],
      },
      {
        path: 'delete',
        component: UserDelete,
        canActivate: [authGuard],
      },
    ],
  },
];
