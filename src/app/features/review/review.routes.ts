import { Routes } from '@angular/router';
import { ReviewUserMaterial } from './review-user-material/review-user-material';
import { authGuard } from '../../core/services/authGuard';
import { ReviewDeleteUserMaterial } from './review-delete-user-material/review-delete-user-material';
import { ReviewEditUserMaterial } from './review-edit-user-material/review-edit-user-material';

export const review_routes: Routes = [
  { path: 'review-by-user-material', component: ReviewUserMaterial, canActivate: [authGuard] },
  { path: 'new-review/:id', component: ReviewUserMaterial, canActivate: [authGuard] },
  { path: 'review-delete/:id', component: ReviewDeleteUserMaterial, canActivate: [authGuard] },
  { path: 'review-edit/:id', component: ReviewEditUserMaterial, canActivate: [authGuard] },
]
