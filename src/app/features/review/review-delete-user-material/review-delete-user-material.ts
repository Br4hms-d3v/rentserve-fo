import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  TuiButton,
  TuiDialogContext,
  TuiIcon,
  TuiNotificationTemplate,
} from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { ReviewService } from '../service/review-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-review-delete',
  imports: [TuiButton, TuiNotificationTemplate, TuiIcon],
  templateUrl: './review-delete-user-material.html',
  styleUrl: './review-delete-user-material.less',
})
export class ReviewDeleteUserMaterial implements OnInit {
  private readonly _reviewService = inject(ReviewService); // Call the service to display comments
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly destroyRef = inject(DestroyRef);
  private readonly context =
    inject<TuiDialogContext<void, { reviewId: number }>>(POLYMORPHEUS_CONTEXT);

  protected readonly reviewId = this.context.data.reviewId;
  protected readonly isDarkMode = signal(false); // Change theme from light to dark
  protected readonly isDeleting = signal(false);
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit() {
    this.changeTheme();
  }

  protected onDelete(): void {
    if (this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);

    this._reviewService
      .deleteReviewUserMaterial(this.reviewId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isDeleting.set(false);

          this.messageSuccess = 'Votre commentaire a été supprimé avec succès.';

          this.messageError = '';

          this.isSuccess.set(true);
          this.show.set(true);

          // Fermer le dialogue après l'affichage
          // de la notification de succès.
          timer(1500)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.context.completeWith();
            });
        },

        error: (error: any) => {
          console.error('Erreur lors de la suppression du commentaire :', error);

          this.isDeleting.set(false);

          this.messageSuccess = '';

          this.messageError = 'Une erreur est survenue lors de la suppression. Veuillez réessayer.';

          this.isSuccess.set(false);
          this.show.set(true);
        },
      });
  }

  protected onBack(): void {
    if (this.isDeleting()) {
      return;
    }
    this.context.completeWith();
  }

  private changeTheme(): void {
    this.isDarkMode.set(this._themeService.isDarkMode());

    this._themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode.set(mode);
      });
  }
}
