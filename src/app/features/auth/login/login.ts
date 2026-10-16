import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiButton,
  TuiIcon,
  TuiInput,
  TuiLabel,
  TuiNotification,
  TuiTextfield,
} from '@taiga-ui/core';
import { Router } from '@angular/router';

import { AuthService } from '../service/auth-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { LoginModel } from '../model/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiIcon,
    TuiInput,
    TuiLabel,
    TuiTextfield,
    TuiNotification,
  ],
  templateUrl: './login.html',
  styleUrl: './login.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  protected isDarkMode = false;

  protected readonly show = signal(false);
  protected readonly isSuccess = signal(false);
  protected readonly showPassword = signal(false);

  protected messageError = '';
  protected titleError = '';

  protected readonly loginForm = new FormGroup({
    pseudo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

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

  protected onSubmitLogin(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.show.set(false);

    const credentials: LoginModel = this.loginForm.getRawValue();

    this.authService
      .login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.titleError = 'Connexion impossible';
          this.messageError = "Le nom d'utilisateur ou le mot de passe est incorrect.";

          this.isSuccess.set(false);
          this.show.set(true);
          this.cdr.markForCheck();
        },
      });
  }
}
