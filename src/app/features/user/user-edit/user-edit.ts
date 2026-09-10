import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiButton,
  TuiCalendar,
  TuiDropdown,
  TuiInputDirective,
  TuiLabel, TuiNotificationTemplate,
  TuiTextfieldComponent,
} from '@taiga-ui/core';
import { TuiInputDateDirective } from '@taiga-ui/kit';
import { AuthService } from '../../auth/service/auth-service';
import { UserService } from '../service/user-service';
import { UserModel } from '../model/user';
import { UserForm } from '../model/userForm';

@Component({
  selector: 'app-user-edit',
  imports: [
    NgClass,
    ReactiveFormsModule,
    TuiButton,
    TuiCalendar,
    TuiInputDateDirective,
    TuiInputDirective,
    TuiLabel,
    TuiTextfieldComponent,
    TuiDropdown,
    TuiNotificationTemplate,
  ],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.less',
})
export class UserEdit implements OnInit {
  private readonly _AuthService = inject(AuthService); // Get the id from user connected
  private readonly userService = inject(UserService);

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error

  protected userId!: number;
  protected userToken!: string;
  userModel!: UserModel;
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit() {
    this.getIdUser();
    this.getUserDetail();
  }

  protected editUserForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    birthdate: new FormControl<Date | null>(null, [Validators.required]),
    pseudo: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
  });

  protected getIdUser() {
    this._AuthService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.userToken = user.token;
        // console.log(this.userId);
      }
    });
  }

  protected getUserDetail() {
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.userModel = user;
        // console.log(this.userModel);
        this.editUserForm.get('name')?.patchValue(this.userModel.name);
        this.editUserForm.get('firstName')?.patchValue(this.userModel.firstName);
        this.editUserForm.get('birthdate')?.patchValue(this.userModel.birthdate);
        this.editUserForm.get('pseudo')?.patchValue(this.userModel.pseudo);
        this.editUserForm.get('email')?.patchValue(this.userModel.email);
        this.editUserForm.get('street')?.patchValue(this.userModel.street);
        this.editUserForm.get('city')?.patchValue(this.userModel.city);
        this.editUserForm.get('zipCode')?.patchValue(this.userModel.zipCode);
      },
    });
  }

  protected updateUser() {
    this.editUserForm.markAllAsTouched();

    if (this.editUserForm.invalid) {
      this.messageError = 'Le formulaire est invalide';
      this.isSuccess.set(false);
      this.show.set(true);
    }

    this.userService.editUser(this.userId, <UserForm>this.editUserForm.value).subscribe({
      next: (userData) => {
        this.editUserForm.patchValue(userData);
        this.messageSuccess = 'La mise à jour a été effectué avec succès ';
      },
    });
  }
}
