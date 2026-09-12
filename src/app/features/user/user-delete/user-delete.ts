import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TuiButton, TuiDialog, TuiIcon, TuiInput, TuiNotificationTemplate } from '@taiga-ui/core';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/service/auth-service';
import { UserService } from '../service/user-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserDeleteForm } from '../model/userDeleteForm';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-delete',
  imports: [
    NgClass,
    TuiAutoFocus,
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

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error

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

  protected getIdUser() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });
  }

  onDeleteAccount() {
    if (this.deleteUserForm.invalid) {
      this.messageError = 'Le formulaire est vide';
      this.isSuccess.set(false);
      this.show.set(true);
      this.openDialog = false;
      return;
    }

    this.userService.delete(this.userId, <UserDeleteForm>this.deleteUserForm.value).subscribe({
      next: () => {
        this.messageSuccess = 'La suppression de votre compte a été effectuée avec succès.';
        this.isSuccess.set(true);
        this.show.set(true);
        this.openDialog = false;
        setTimeout(() => {
          this._authService.logout();
          this._router.navigate(['/']);
        }, 2000);
      },
      error: () => {
        this.messageError = "Une erreur s'est produite lors de la suppression de votre compte";
        this.isSuccess.set(false);
        this.show.set(true);
        this.deleteUserForm.reset();
        this.openDialog = false;
      },
    });
  }

  changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
