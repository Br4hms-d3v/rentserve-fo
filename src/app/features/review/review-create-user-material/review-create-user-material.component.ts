import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  TuiButton,
  TuiDialogContext,
  TuiLabel,
  TuiNotificationTemplate,
  TuiTextfield,
} from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { NgClass } from '@angular/common';
import { ReviewService } from '../service/review-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { TuiRating, TuiTextarea } from '@taiga-ui/kit';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-create-user-marterial',
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
  templateUrl: './review-create-user-material.component.html',
  styleUrl: './review-create-user-material.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCreateUserMaterial implements OnInit {
  private readonly context =
    inject<TuiDialogContext<void, { userMaterialId: number }>>(POLYMORPHEUS_CONTEXT);
  private readonly _reviewService = inject(ReviewService); // Call the service to display comments
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _router = inject(Router); // Tool to navigate

  protected userMaterialId: number = this.context.data.userMaterialId;
  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit() {
    this.changeTheme();
  }

  protected createReviewUserMaterialForm = new FormGroup({
    userMaterialID: new FormControl<number>(Number(this.userMaterialId), {
      nonNullable: true,
    }),
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

  submitReview() {
    console.log('1. Clic sur Enregistrer');

    if (this.createReviewUserMaterialForm.invalid) {
      this.createReviewUserMaterialForm.markAsTouched();
      this.show.set(true);
      this.isSuccess.set(false);
      this.messageError = 'Le formulaire est vide';
      this.messageSuccess = '';
      return;
    }

    this._reviewService
      .createNewReviewUserMaterial(this.createReviewUserMaterialForm.getRawValue())
      .subscribe({
        next: (newReview) => {
          // console.log(newReview);
          this.messageSuccess = 'Votre commentaire est enregistré';
          this.messageError = '';
          this.isSuccess.set(true);
          this.show.set(true);
          this.context.completeWith();
        },
        error: (error) => {
          // console.log(error);
          this.messageSuccess = '';
          this.messageError = 'Erreur lors de la sauvegarde du commentaire';
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
