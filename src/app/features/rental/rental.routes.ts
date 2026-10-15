import { Routes } from '@angular/router';
import { authGuard } from '../../core/services/authGuard';
import { RentalCreate } from './rental-create/rental-create';
import { RentalNotPaid } from './rental-not-paid/rental-not-paid';

export const rental_routes: Routes = [
  { path: 'new-rental/:id', component: RentalCreate, canActivate: [authGuard] },
  { path: 'basket/:id', component: RentalNotPaid, canActivate: [authGuard] },
];
