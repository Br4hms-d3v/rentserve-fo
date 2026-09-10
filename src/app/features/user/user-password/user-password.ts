import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { UserService } from '../service/user-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiInputDirective, TuiLabel, TuiTextfieldComponent } from '@taiga-ui/core';

@Component({
  selector: 'app-user-password',
  imports: [
    NgClass,
    ReactiveFormsModule,
    TuiInputDirective,
    TuiLabel,
    TuiTextfieldComponent,
    TuiButton,
  ],
  templateUrl: './user-password.html',
  styleUrl: './user-password.less',
})
export class UserPassword implements OnInit {
  private readonly userService = inject(UserService); // Get the data and edit the user
  private _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error

  title = 'Changer le mot de passe';

  ngOnInit() {}

  protected changePasswordForm = new FormGroup({});

  changePassword() {}
}
