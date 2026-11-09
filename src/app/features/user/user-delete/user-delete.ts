import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TuiButton, TuiDialog, TuiIcon, TuiInput, TuiNotificationTemplate } from '@taiga-ui/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/service/auth-service';
import { UserService } from '../service/user-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserDeleteForm } from '../model/userDeleteForm';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-delete',
  imports: [
    NgClass,
    TuiButton,
    TuiDialog,
    TuiInput,
    ReactiveFormsModule,
    TuiIcon,
    TuiNotificationTemplate,
  ],
  templateUrl: './user-delete.html',
  styleUrl: './user-delete.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDelete implements OnInit {
  private readonly _authService = inject(AuthService); // Get the id from user connected
  private readonly userService = inject(UserService); // Get the data and edit the user
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly isLoading = signal(false);

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  dialogClass = 'red-dialog';

  title = 'Suppression du compte';
  protected userId!: number;
  protected openDialog = false;
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit(): void {
    this.getIdUser();
    this.changeTheme();
  }

  protected deleteUserForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  protected getIdUser(): void {
    this._authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });
  }

  onDeleteAccount(): void {
    if (this.isLoading()) {
      return;
    }

    if (!this.userId) {
      this.messageError = 'Impossible d’identifier votre compte. Veuillez vous reconnecter.';

      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    if (this.deleteUserForm.invalid) {
      this.deleteUserForm.markAllAsTouched();

      this.messageError = 'Veuillez saisir une adresse e-mail valide et votre mot de passe.';

      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    this.isLoading.set(true);

    this.userService
      .delete(this.userId, this.deleteUserForm.getRawValue() as UserDeleteForm)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageSuccess = 'Votre compte a été supprimé avec succès.';

          this.isSuccess.set(true);
          this.show.set(true);
          this.isLoading.set(false);

          setTimeout(() => {
            this._authService.logout();
            this._router.navigate(['/']);
          }, 2000);
        },

        error: () => {
          this.messageError =
            'Une erreur est survenue lors de la suppression de votre compte. Vérifiez vos informations et réessayez.';

          this.isSuccess.set(false);
          this.show.set(true);
          this.isLoading.set(false);
        },
      });
  }

  changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode();

    this._themeService.darkMode$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((mode) => {
      this.isDarkMode = mode;
    });
  }
}
