import { Component, inject, signal } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { UserService } from '../service/user-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserRoleForm } from '../model/userRoleForm';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiButton,
  TuiDialogContext,
  TuiDropdown, TuiIcon,
  TuiNotificationTemplate,
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
    TuiIcon,
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

  protected readonly roles = [Role.MEMBER, Role.MODERATOR];

  protected editUserRoleForm = new FormGroup({
    role: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected updateUserRole(): void {
    if (this.editUserRoleForm.invalid) {
      this.editUserRoleForm.markAllAsTouched();
      this.messageError = 'Veuillez sélectionner un rôle.';
      return;
    }

    this.messageError = '';
    this.messageSuccess = '';

    const formValue = this.editUserRoleForm.getRawValue();

    this._userService.updateUserRole(this.user.id, formValue as UserRoleForm).subscribe({
      next: () => {
        this.messageSuccess = `Le rôle de ${this.user.name} a été mis à jour avec succès.`;

        this.messageError = '';
        this.isSuccess.set(true);
        this.show.set(true);

        setTimeout(() => {
          this.context.completeWith?.(true);
        }, 2000);
      },

      error: () => {
        this.messageError = 'Impossible de mettre à jour le rôle. Veuillez réessayer.';

        this.messageSuccess = '';
        this.isSuccess.set(false);
        this.show.set(true);
      },
    });
  }
}
