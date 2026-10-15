import { Routes } from '@angular/router';
import { authGuard } from '../../core/services/authGuard';
import { RentalCreate } from './rental-create/rental-create';

export const rental_routes: Routes = [
  { path: 'new-rental/:id', component: RentalCreate, canActivate: [authGuard] },
];
