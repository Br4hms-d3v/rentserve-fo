import { Routes } from '@angular/router';
import { ReviewUserMaterial } from './review-user-material/review-user-material';
import { authGuard } from '../../core/services/authGuard';

export const review_routes: Routes = [
  { path: 'review-by-user-material', component: ReviewUserMaterial, canActivate: [authGuard] },
]
