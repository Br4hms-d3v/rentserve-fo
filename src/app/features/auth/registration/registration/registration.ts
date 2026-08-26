import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiButton,
  TuiCalendar,
  TuiDropdown,
  TuiError,
  TuiIcon,
  TuiInput,
  TuiNotification,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiInputDate } from '@taiga-ui/kit';
import { AuthService } from '../../service/auth-service';
import { RegistrationModel } from '../../model/registration';
import { ThemeService } from '../../../../core/services/ThemeService';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [
    ReactiveFormsModule,
    NgClass,
    TuiTextfield,
    TuiCalendar,
    TuiDropdown,
    TuiError,
    TuiButton,
    TuiInput,
    TuiInputDate,
    TuiIcon,
    TuiNotification,
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registration implements OnInit {
  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for succes or Red error
  protected messageError = '';
  protected messageSuccess = '';

  constructor(
    private readonly _authService: AuthService,
    private themeService: ThemeService,
  ) {}

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode(); // Get current theme
    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
  /**
   * This is a Form with validators
   * @protected the data
   */
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

  /**
   * Register a user after fill the form
   * @protected
   */
  protected onSubmitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this._authService.register(<RegistrationModel>this.registerForm.value).subscribe({
      next: () => {
        this.messageError = '';
        this.messageSuccess = 'Veuillez vérifier votre boite email pour activer votre compte';
        this.registerForm.clearAsyncValidators();
        this.registerForm.reset();
        this.isSuccess.set(true);
        this.show.set(true);
      },
      error: (err) => {
        // console.log(err.error.message);

        if (!typeof err.error) {
          this.messageError = err.error.message;
        } else if (err.error?.message) {
          this.messageError = err.error.message;
        } else {
          this.messageError = "Erreur d'inscription";
        }
        this.isSuccess.set(false);
        this.show.set(true);
      },
    });
    const formValue = this.registerForm.value;
    // console.log('Formulaire valide, envoie: ', formValue);
  }
}
