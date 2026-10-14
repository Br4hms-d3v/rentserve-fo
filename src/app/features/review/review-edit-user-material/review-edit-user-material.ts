import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  TuiButton,
  TuiDialogContext,
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

@Component({
  selector: 'app-review-edit-user-material',
  imports: [
    NgClass,
    TuiTextfield,
    TuiRating,
    FormsModule,
    ReactiveFormsModule,
    TuiTextarea,
    TuiButton,
    TuiLabel,
    TuiNotificationTemplate,
  ],
  templateUrl: './review-edit-user-material.html',
  styleUrl: './review-edit-user-material.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewEditUserMaterial implements OnInit {
  private readonly context =
    inject<TuiDialogContext<void, { reviewId: number }>>(POLYMORPHEUS_CONTEXT);
  private readonly _reviewService = inject(ReviewService); // Call the service to display comments
  private _themeService = inject(ThemeService); // Call the service to change color theme

  protected readonly reviewId = this.context.data.reviewId;
  isDarkMode = false; // Change theme from light to dark
  reviewByIdModel!: ReviewByIdModel;
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit() {
    this.changeTheme();
    this.getReviewById();
  }

  protected editReviewUserMaterialForm = new FormGroup({
    comment: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    rating: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(5)],
    }),
    isActive: new FormControl(true, {
      nonNullable: true,
    }),
  });

  protected getReviewById() {
    this._reviewService.getReviewById(this.context.data.reviewId).subscribe({
      next: (review) => {
        this.reviewByIdModel = review;
        this.editReviewUserMaterialForm.get('comment')?.patchValue(this.reviewByIdModel.comment);
        this.editReviewUserMaterialForm.get('rating')?.patchValue(this.reviewByIdModel.rating);
        this.editReviewUserMaterialForm.get('isActive')?.patchValue(true);
      },
    });
  }

  onEditReview(): void {
    if (this.editReviewUserMaterialForm.invalid) {
      this.editReviewUserMaterialForm.markAllAsTouched();
      return;
    }

    const formValue: ReviewEditUserMaterialForm = {
      ...this.editReviewUserMaterialForm.getRawValue(),
      isActive: true,
    };

    this._reviewService.updateReviewUserMaterial(this.reviewId, formValue).subscribe({
      next: () => {
        this.editReviewUserMaterialForm.patchValue({
          isActive: true,
        });

        this.messageSuccess = 'La mise à jour a été effectuée avec succès.';
        this.isSuccess.set(true);
        this.show.set(true);
        setTimeout(() => {
          this.context.completeWith();
        }, 1500);
      },
      error: (error) => {
        console.error(error);
        this.messageError = 'Erreur lors de la mise à jour !';
        this.isSuccess.set(false);
        this.show.set(true);
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
