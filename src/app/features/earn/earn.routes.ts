import { Routes } from '@angular/router';
import { EarnThisMonth } from './earn-this-month/earn-this-month';
import { authGuard } from '../../core/services/authGuard';

export const earn_routes: Routes = [
  {path: 'my-earn-this-month/:id', component: EarnThisMonth, canActivate:[authGuard]},
]
