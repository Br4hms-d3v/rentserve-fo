import { Component, OnInit, signal } from '@angular/core';
import { TuiButton, TuiIcon, TuiInput, TuiNotification } from '@taiga-ui/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { LoginModel } from '../model/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TuiIcon, TuiInput, TuiButton, TuiNotification],
  templateUrl: './login.html',
  styleUrl: './login.less',
})
export class Login implements OnInit {
  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for succes or Red error
  protected messageError = '';
  titleError = '';

  constructor(
    private readonly _authService: AuthService, // Service to call login from Backend
    private themeService: ThemeService, // Call the service to change color theme
    private readonly _router: Router, // Tool to navigate
  ) {}

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode(); // Get current theme
    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }

  protected loginForm = new FormGroup({
    pseudo: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    password: new FormControl('', Validators.required),
  });

  protected onSubmitLogin() {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid) {
      return;
    }

    this._authService.login(<LoginModel>this.loginForm.value).subscribe({
      next: (user) => {
        this._router.navigate(['/dashboard']).then();
      },
      error: (error) => {
        this.messageError = "Le mot de passe ou le nom d'utilisateur est érroné"
        this.titleError = "Un problème est survenu";
        this.isSuccess.set(false);
        this.show.set(true);
      },
    });
  }
}
