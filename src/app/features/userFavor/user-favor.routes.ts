import { Route } from '@angular/router';
import { UserFavorUser } from './user-favor-user/user-favor-user';
import { authGuard } from '../../core/services/authGuard';

export const user_favor_routes: Route[] = [
  { path: 'my-user-favor', component: UserFavorUser, canActivate: [authGuard] },
];
