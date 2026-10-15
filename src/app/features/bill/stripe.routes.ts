import { Routes } from '@angular/router';
import { authGuard } from '../../core/services/authGuard';
import { PaymentSuccessComponent } from './payment-success-component/payment-success-component';

export const stripe_routes: Routes = [
  // {  path: 'payment/success', component: PaymentSuccessComponent, canActivate: [authGuard] }
];
