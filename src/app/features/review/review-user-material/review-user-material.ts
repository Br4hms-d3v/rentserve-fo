import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { TuiTable } from '@taiga-ui/addon-table';
import { ReviewService } from '../service/review-service';
import { ReviewUserMaterialModel } from '../model/reviewUserMaterial';
import { TuiPagination, TuiRating, TuiRatingContext } from '@taiga-ui/kit';
import { PolymorpheusComponent, PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { TuiButton, TuiDialogService, TuiIcon } from '@taiga-ui/core';
import { AuthService } from '../../auth/service/auth-service';
import { ReviewCreateUserMaterial } from '../review-create-user-material/review-create-user-material.component';
import { ReviewDeleteUserMaterial } from '../review-delete-user-material/review-delete-user-material';
import { ReviewEditUserMaterial } from '../review-edit-user-material/review-edit-user-material';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-review-user-material',
  imports: [TuiButton, TuiPagination, TuiRating, TuiTable, TuiIcon, FormsModule],
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
  private readonly destroyRef = inject(DestroyRef);

  isDarkMode = false;

  title = 'Commentaires';

  userMaterialId!: number;
  currentUserId!: number;

  protected reviewUserMaterialModel: ReviewUserMaterialModel[] = [];

  protected readonly Math = Math;

  @Input() showCreateButton = true;

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 6;

  ngOnInit(): void {
    this.getRoute();
    this.currentUser();
    this.changeTheme();
  }

  private getRoute(): void {
    this._route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.userMaterialId = Number(params['id']);

      if (Number.isFinite(this.userMaterialId)) {
        this.userMaterialReviews();
      }
    });
  }

  private currentUser(): void {
    this._authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      if (user) {
        this.currentUserId = user.id;
        this._cdr.markForCheck();
      }
    });
  }

  protected userMaterialReviews(): void {
    this._reviewService
      .getReviewUserMaterial(this.userMaterialId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (reviews) => {
          this.reviewUserMaterialModel = [...reviews].sort((a, b) => b.id - a.id);

          this.length = reviews.length;
          this.index = 0;

          this._cdr.markForCheck();
        },

        error: (error) => {
          console.error('Erreur lors du chargement des commentaires :', error);
          this._cdr.markForCheck();
        },
      });
  }

  // Icons star
  protected readonly icon: PolymorpheusContent<TuiRatingContext> = ({ filled }) =>
    filled ? '@tui.star-filled' : '@tui.star';

  private changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode();

    this._themeService.darkMode$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((mode) => {
      this.isDarkMode = mode;
      this._cdr.markForCheck();
    });
  }

  protected createReview(): void {
    this.dialogs
      .open(new PolymorpheusComponent(ReviewCreateUserMaterial), {
        label: 'Nouveau commentaire',
        size: 'l',
        data: {
          userMaterialId: this.userMaterialId,
        },
      })
      .subscribe({
        complete: () => this.userMaterialReviews(),
      });
  }

  protected onEditReview(reviewId: number): void {
    this.dialogs
      .open(new PolymorpheusComponent(ReviewEditUserMaterial), {
        label: 'Modifier votre commentaire',
        size: 'l',
        data: { reviewId },
      })
      .subscribe({
        complete: () => this.userMaterialReviews(),
      });
  }

  protected onDeleteReview(reviewId: number): void {
    this.dialogs
      .open(new PolymorpheusComponent(ReviewDeleteUserMaterial), {
        label: 'Confirmer la suppression',
        size: 's',
        data: { reviewId },
      })
      .subscribe({
        complete: () => this.userMaterialReviews(),
      });
  }
}
