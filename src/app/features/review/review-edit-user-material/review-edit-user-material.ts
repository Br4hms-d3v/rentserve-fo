import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import {
  TuiButton,
  TuiDialogContext,
  TuiIcon,
  TuiLabel,
  TuiNotificationTemplate,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiRating, TuiTextarea } from '@taiga-ui/kit';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { ReviewService } from '../service/review-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { ReviewByIdModel } from '../model/review-by-id';
import { ReviewEditUserMaterialForm } from '../model/review-edit-userMaterial-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

@Component({
  selector: 'app-review-edit-user-material',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiRating,
    TuiTextarea,
    TuiButton,
    TuiLabel,
    TuiIcon,
    TuiNotificationTemplate,
  ],
  templateUrl: './review-edit-user-material.html',
  styleUrl: './review-edit-user-material.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewEditUserMaterial implements OnInit {
  private readonly context =
    inject<TuiDialogContext<void, { reviewId: number }>>(POLYMORPHEUS_CONTEXT);
  private readonly reviewService = inject(ReviewService); // Call the service to display comments
  private themeService = inject(ThemeService); // Call the service to change color theme
  private readonly destroyRef = inject(DestroyRef);

  protected readonly reviewId = this.context.data.reviewId;
  protected readonly isDarkMode = signal(false); // Change theme from light to dark
  protected readonly isSaving = signal(false);

  reviewByIdModel!: ReviewByIdModel;
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected messageError = '';
  protected messageSuccess = '';

  protected readonly editReviewUserMaterialForm = new FormGroup({
    comment: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    rating: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(5)],
    }),

    isActive: new FormControl(true, {
      nonNullable: true,
    }),
  });

  ngOnInit() {
    this.changeTheme();
    this.getReviewById();
  }

  protected getReviewById(): void {
    this.reviewService
      .getReviewById(this.reviewId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (review) => {
          this.reviewByIdModel = review;

          this.editReviewUserMaterialForm.patchValue({
            comment: review.comment,
            rating: review.rating,
            isActive: true,
          });
        },

        error: (error) => {
          console.error('Erreur lors du chargement de l’avis :', error);

          this.messageError = 'Impossible de charger votre avis. Veuillez réessayer.';

          this.isSuccess.set(false);
          this.show.set(true);
        },
      });
  }

  protected onEditReview(): void {
    if (this.editReviewUserMaterialForm.invalid || this.isSaving()) {
      this.editReviewUserMaterialForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);

    const formValue: ReviewEditUserMaterialForm = {
      ...this.editReviewUserMaterialForm.getRawValue(),
      isActive: true,
    };

    this.reviewService
      .updateReviewUserMaterial(this.reviewId, formValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSaving.set(false);

          this.messageSuccess = 'Votre avis a été mis à jour avec succès.';

          this.isSuccess.set(true);
          this.show.set(true);

          timer(1500)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.context.completeWith();
            });
        },

        error: (error) => {
          console.error('Erreur lors de la modification :', error);

          this.isSaving.set(false);

          this.messageError =
            'Une erreur est survenue lors de la mise à jour de votre avis. Veuillez réessayer.';

          this.isSuccess.set(false);
          this.show.set(true);
        },
      });
  }
  private changeTheme(): void {
    this.isDarkMode.set(this.themeService.isDarkMode());

    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode.set(mode);
      });
  }
}
