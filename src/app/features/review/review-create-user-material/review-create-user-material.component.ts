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
import { ReviewService } from '../service/review-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { TuiRating, TuiTextarea } from '@taiga-ui/kit';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-review-create-user-marterial',
  imports: [
    ReactiveFormsModule,
    TuiTextfield,
    TuiRating,
    TuiTextarea,
    TuiButton,
    TuiLabel,
    TuiNotificationTemplate,
    TuiIcon,
  ],
  templateUrl: './review-create-user-material.component.html',
  styleUrl: './review-create-user-material.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCreateUserMaterial implements OnInit {
  private readonly context =
    inject<TuiDialogContext<void, { userMaterialId: number }>>(POLYMORPHEUS_CONTEXT);
  private readonly reviewService = inject(ReviewService); // Call the service to display comments
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly destroyRef = inject(DestroyRef);

  protected userMaterialId: number = this.context.data.userMaterialId;
  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected messageError = '';
  protected messageSuccess = '';
  protected isSubmitting = false;

  protected readonly createReviewUserMaterialForm = new FormGroup({
    userMaterialID: new FormControl<number>(Number(this.userMaterialId), {
      nonNullable: true,
    }),

    comment: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(500)],
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
  }

  protected submitReview(): void {
    if (this.isSubmitting) {
      return;
    }

    if (this.createReviewUserMaterialForm.invalid) {
      this.createReviewUserMaterialForm.markAllAsTouched();

      this.isSuccess.set(false);
      this.show.set(false);
      this.messageError = 'Veuillez compléter le formulaire et attribuer une note.';
      this.messageSuccess = '';
      this.show.set(true);
      return;
    }

    this.isSubmitting = true;

    this.reviewService
      .createNewReviewUserMaterial(this.createReviewUserMaterialForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.messageSuccess = 'Votre avis a été enregistré avec succès.';
          this.messageError = '';
          this.isSuccess.set(true);
          // Closes the window and triggers the parent refresh.
          this.context.completeWith();
        },

        error: () => {
          this.isSubmitting = false;
          this.messageSuccess = '';
          this.messageError =
            'Une erreur est survenue lors de l’enregistrement de votre avis. Veuillez réessayer.';
          this.isSuccess.set(false);
          this.show.set(true);
        },
      });
  }

  private changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode();
    this._themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
      });
  }
}
