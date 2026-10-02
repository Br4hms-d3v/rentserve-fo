import { Route } from '@angular/router';
import { UserFavorUser } from './user-favor-user/user-favor-user';
import { authGuard } from '../../core/services/authGuard';
import { UserFavorDetail } from './user-favor-detail/user-favor-detail';
import { UserFavorDelete } from './user-favor-delete/user-favor-delete';
import { UserFavorEdit } from './user-favor-edit/user-favor-edit';

export const user_favor_routes: Route[] = [
  { path: 'my-user-favor', component: UserFavorUser, canActivate: [authGuard] },
  { path: 'user-favor-detail/:id', component: UserFavorDetail, canActivate: [authGuard] },
  { path: 'delete-my-favor/:id', component: UserFavorDelete, canActivate: [authGuard] },
  { path: 'edit-my-favor/:id', component: UserFavorEdit, canActivate: [authGuard] },
];
