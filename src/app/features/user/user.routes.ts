import { Routes } from '@angular/router';
import { UserEdit } from './user-edit/user-edit';
import { authGuard } from '../../core/services/authGuard';
import { UserProfile } from './user-profile/user-profile';
import { UserPassword } from './user-password/user-password';
import { UserDelete } from './user-delete/user-delete';
import { UserList } from './user-list/user-list';
import { UserRole } from './user-role/user-role';

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
      {
        path: 'list-user',
        component: UserList,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'edit-role/:id',
    component: UserRole,
    canActivate: [authGuard],
  }
];
