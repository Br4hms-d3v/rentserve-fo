
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiButton,
  TuiCalendar,
  TuiDropdown,
  TuiInput,
  TuiNotification,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiInputDate } from '@taiga-ui/kit';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../service/auth-service';
import { RegistrationModel } from '../../model/registration';
import { ThemeService } from '../../../../core/services/ThemeService';

@Component({
  selector: 'app-registration',
  standalone: true,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registration implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  isDarkMode = false;

  protected readonly show = signal(false);
  protected readonly isSuccess = signal(false);
  protected readonly showPassword = signal(false);

  protected messageError = '';
  protected messageSuccess = '';

  constructor(
    private readonly _authService: AuthService,
    private readonly themeService: ThemeService,
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

  protected togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', Validators.required),
    pseudo: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    birthdate: new FormControl<Date | null>(
      null,
      Validators.required,
    ),
    street: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required),
  });

  protected onSubmitRegister(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      return;
    }

    this.show.set(false);

    this._authService
      .register(
        this.registerForm.getRawValue() as RegistrationModel,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageError = '';
          this.messageSuccess =
            'Veuillez vérifier votre boîte e-mail pour activer votre compte.';

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
