import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError, TuiInput } from '@taiga-ui/core';
import { TuiInputDate } from '@taiga-ui/kit';

@Component({
  selector: 'app-registration',
  imports: [
    ReactiveFormsModule,
    TuiError,
    TuiButton,
    TuiInput,
    TuiInputDate,

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
