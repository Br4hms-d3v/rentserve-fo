import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiButton,
  TuiCalendar,
  TuiDropdown,
  TuiInput,
  TuiNotification,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiInputDate } from '@taiga-ui/kit';
import { AuthService } from '../../service/auth-service';
import { RegistrationModel } from '../../model/registration';
import { ThemeService } from '../../../../core/services/ThemeService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-registration',
  imports: [
    ReactiveFormsModule,
    TuiTextfield,
    TuiCalendar,
    TuiDropdown,
    TuiButton,
    TuiInput,
    TuiInputDate,
    TuiNotification,
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registration implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected readonly showPassword = signal(false);

  protected messageError = '';
  protected messageSuccess = '';

  protected togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  constructor(
    private readonly _authService: AuthService,
    private themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();

    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
        this.cdr.markForCheck();
      });
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
  protected onSubmitRegister(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      return;
    }

    this.show.set(false);

    this._authService
      .register(this.registerForm.getRawValue() as RegistrationModel)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageError = '';
          this.messageSuccess =
            'Votre inscription a été enregistrée. Veuillez consulter votre boîte e-mail pour activer votre compte.';

          this.registerForm.reset();
          this.showPassword.set(false);
          this.isSuccess.set(true);
          this.show.set(true);
          this.cdr.markForCheck();
        },

        error: (err) => {
          this.messageSuccess = '';

          this.messageError =
            typeof err?.error?.message === 'string'
              ? err.error.message
              : "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";

          this.isSuccess.set(false);
          this.show.set(true);
          this.cdr.markForCheck();
        },
      });
  }
}
