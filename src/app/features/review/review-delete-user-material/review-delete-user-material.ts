import { Component, inject, OnInit, signal } from '@angular/core';
import {
  TuiButton,
  TuiDialogContext,
  TuiDialogService,
  TuiNotificationTemplate,
} from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { ReviewService } from '../service/review-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-review-delete',
  imports: [TuiButton, TuiNotificationTemplate, NgClass],
  templateUrl: './review-delete-user-material.html',
  styleUrl: './review-delete-user-material.less',
})
export class ReviewDeleteUserMaterial implements OnInit {
  private readonly _reviewService = inject(ReviewService); // Call the service to display comments
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly dialogs = inject(TuiDialogService); // Call Service to display modal
  private readonly context =
    inject<TuiDialogContext<void, { reviewId: number }>>(POLYMORPHEUS_CONTEXT);

  protected readonly reviewId = this.context.data.reviewId;
  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit() {
    this.changeTheme();
  }

  onDelete() {
    this._reviewService.deleteReviewUserMaterial(this.reviewId).subscribe({
      next: () => {
        this.messageSuccess = 'Votre commentaire a bien été supprimé';
        this.messageError = '';
        this.isSuccess.set(true);
        this.show.set(true);
        this.context.completeWith();
      },
      error: (error) => {
        console.log(error);
        // console.error('Erreur lors de la suppression du commentaire');
        this.messageSuccess = '';
        this.messageError = 'Erreur lors de la suppression';
        this.isSuccess.set(false);
        this.show.set(true);
      },
    });
  }

  onBack() {
    this.context.completeWith();
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
