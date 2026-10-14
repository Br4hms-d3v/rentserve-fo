import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { NgClass } from '@angular/common';
import { TuiTable } from '@taiga-ui/addon-table';
import { ReviewService } from '../service/review-service';
import { ReviewUserMaterialModel } from '../model/reviewUserMaterial';
import { TuiPagination, TuiRating, TuiRatingContext } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { PolymorpheusComponent, PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { TuiButton, TuiDialogService } from '@taiga-ui/core';
import { AuthService } from '../../auth/service/auth-service';
import { ReviewCreateUserMaterial } from '../review-create-user-material/review-create-user-material.component';
import { ReviewDeleteUserMaterial } from '../review-delete-user-material/review-delete-user-material';
import { ReviewEditUserMaterial } from '../review-edit-user-material/review-edit-user-material';

@Component({
  selector: 'app-review-user-material',
  imports: [NgClass, TuiTable, TuiRating, FormsModule, TuiButton, TuiPagination],
  templateUrl: './review-user-material.html',
  styleUrl: './review-user-material.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewUserMaterial implements OnInit {
  private readonly _reviewService = inject(ReviewService); // Call the service to display comments
  private readonly _authService = inject(AuthService); // Call the service auth to get the pseudo
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _cdr = inject(ChangeDetectorRef);
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly dialogs = inject(TuiDialogService); // Call Service to display modal

  isDarkMode = false; // Change theme from light to dark
  title = 'Commentaires';
  userMaterialId!: number;
  currentUserId!: number;
  protected reviewUserMaterialModel: ReviewUserMaterialModel[] = [];
  protected readonly Math = Math;
  @Input() showCreateButton = true; // Display the button write a com

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 7;

  ngOnInit() {
    this.getRoute();
    this.currentUser();
    this.userMaterialReviews();
    this.changeTheme();
  }

  getRoute() {
    this._route.params.subscribe((params) => {
      this.userMaterialId = params['id'];
    });
  }
  currentUser() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserId = user.id;
      }
    });
  }

  protected userMaterialReviews(): void {
    this._reviewService.getReviewUserMaterial(this.userMaterialId).subscribe({
      next: (reviews) => {
        this.reviewUserMaterialModel = reviews.sort(
          (a, b) => new Date(b.id).getTime() - new Date(a.id).getTime(),
        );
        this.length = reviews.length;
        this.index = 0;
        this._cdr.detectChanges();
      },
    });
  }

  // Star for rating
  protected readonly icon: PolymorpheusContent<TuiRatingContext> = ({ filled }) =>
    filled ? '@tui.star-filled' : '@tui.star';

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }

  protected createReview() {
    this.dialogs
      .open(new PolymorpheusComponent(ReviewCreateUserMaterial), {
        label: 'Nouveau commentaire',
        size: 'l',
        data: { userMaterialId: this.userMaterialId },
      })
      .subscribe({
        complete: () => {
          this.userMaterialReviews();
        },
      });
  }

  protected onEditReview(reviewId: number) {
    this.dialogs
      .open(new PolymorpheusComponent(ReviewEditUserMaterial), {
        label: 'Modifier votre commentaire',
        size: 'l',
        data: { reviewId },
      })
      .subscribe({
        complete: () => {
          this.userMaterialReviews();
        },
      });
  }

  protected onDeleteReview(reviewId: number) {
    this.dialogs
      .open(new PolymorpheusComponent(ReviewDeleteUserMaterial), {
        label: 'Confirmer la suppression',
        size: 's',
        data: { reviewId },
      })
      .subscribe({
        complete: () => {
          this.userMaterialReviews();
        },
      });
  }
}
