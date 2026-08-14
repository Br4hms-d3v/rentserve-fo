import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiInputDate, TuiPassword } from '@taiga-ui/kit';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiError,
    TuiButton,
    TuiTextfield,
    TuiInputDate,
    TuiPassword,
    TuiIcon,
    TuiFieldErrorPipe,
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.less',
})
export class Registration {
  isDarkMode = false;
  message = '';
  messageSuccess = '';

  protected registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    pseudo: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    birthdate: new FormControl<Date | null>(null, Validators.required),
    street: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required),
  });

  protected onSubmitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      console.log(this.registerForm.value);
    }
  }
}
