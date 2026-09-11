import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { UserService } from '../service/user-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiButton,
  TuiIcon,
  TuiInput,
  TuiInputDirective,
  TuiLabel,
  TuiNotificationTemplate,
  TuiTextfieldComponent,
} from '@taiga-ui/core';
import { AuthService } from '../../auth/service/auth-service';
import { ChangePasswordForm } from '../model/changePassword';

@Component({
  selector: 'app-user-password',
  imports: [
    NgClass,
    ReactiveFormsModule,
    TuiInputDirective,
    TuiLabel,
    TuiInput,
    TuiTextfieldComponent,
    TuiButton,
    TuiNotificationTemplate,
    TuiIcon,
  ],
  templateUrl: './user-password.html',
  styleUrl: './user-password.less',
})
export class UserPassword implements OnInit {
  private readonly _authService = inject(AuthService); // Get the id from user connected
  private readonly userService = inject(UserService); // Get the data and edit the user
  private _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error

  title = 'Changer le mot de passe';
  protected userId!: number;
  protected userEmail!: string;
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit() {
    this.getIdUser();
    this.changeTheme();
  }

  protected changePasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    comparePassword: new FormControl('', [Validators.required]),
  });

  protected getIdUser() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.userEmail = user.email;
      }
    });
  }

  changePassword() {
    if (this.changePasswordForm.invalid) {
      this.messageError = 'Le formulaire est vide';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    if (
      this.changePasswordForm.value.email !== this.userEmail ||
      this.changePasswordForm.value.email == null
    ) {
      // console.log(this.userEmail);
      // console.log(this.changePasswordForm.value.email);
      this.messageError = 'Votre adresse email est erronée';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    if (this.changePasswordForm.value.password !== this.changePasswordForm.value.comparePassword) {
      this.messageError = 'Le mot de passe doit être identique';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    this.userService
      .changePassword(this.userId, <ChangePasswordForm>this.changePasswordForm.value)
      .subscribe({
        next: (userData) => {
          this.messageSuccess = 'Le mot de passe à bien été mise à jour';
          this.isSuccess.set(true);
          this.show.set(true);
        },

        error: () => {
          this.messageError =
            "Une erreur s'est produite lors de la modification de votre mot de passe.";
          this.isSuccess.set(false);
          this.show.set(true);
        },
      });
  }

  reset() {
    this.changePasswordForm.reset();
    this.messageSuccess = 'La modificiation a bien été annulée';
    this.isSuccess.set(true);
    this.show.set(true);
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
