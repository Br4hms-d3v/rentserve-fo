import { Component, inject, signal } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { UserService } from '../service/user-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserRoleForm } from '../model/userRoleForm';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiButton,
  TuiDataList,
  TuiDialogContext,
  TuiDropdown,
  TuiNotificationTemplate,
  TuiOption,
  TuiTextfield,
} from '@taiga-ui/core';
import { Role } from '../enum/role';
import { TuiChevron, TuiDataListWrapper, TuiSelect } from '@taiga-ui/kit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-role',
  imports: [
    ReactiveFormsModule,
    TuiTextfield,
    TuiChevron,
    TuiSelect,
    TuiDropdown,
    TuiDataListWrapper,
    TuiButton,
    TuiNotificationTemplate,
  ],
  templateUrl: './user-role.html',
  styleUrl: './user-role.less',
})
export class UserRole {
  private readonly context = inject<TuiDialogContext<boolean>>(POLYMORPHEUS_CONTEXT);
  private _userService = inject(UserService); // Call the service to get a list of users
  private themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _router = inject(Router); // Tool to navigate

  // The user transit from userList
  user = (this.context as any).data;

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected messageError = '';
  protected messageSuccess = '';

  protected readonly roles = Object.values(Role);

  protected editUserRoleForm = new FormGroup({
    role: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected updateUSerRole(): void {
    if (this.editUserRoleForm.invalid) {
      this.editUserRoleForm.markAllAsTouched();
      this.messageError = 'Veuillez sélectionner un rôle.';
      return;
    }

    this.messageError = '';

    this._userService
      .updateUserRole(this.user.id, <UserRoleForm>this.editUserRoleForm.value)
      .subscribe({
        next: (userRole) => {
          // console.log(userRole);
          this.messageSuccess = this.user.name + ' est devenu modérateur';
          this.messageError = '';
          this.isSuccess.set(true);
          this.show.set(true);
          setTimeout(() => {
            this.context.completeWith?.(true);
          }, 2000);

          // Tu peux fermer la modal ici après le succès.
        },
        error: () => {
          this.messageError = 'Une erreur est survenue lors de la mise à jour du rôle.';
          this.messageSuccess = '';
          this.isSuccess.set(false);
          this.show.set(true);
        },
      });
  }
}
