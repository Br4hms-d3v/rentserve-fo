import { Component, OnInit } from '@angular/core';
import { TuiButton, TuiIcon, TuiInput } from '@taiga-ui/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { LoginModel } from '../model/login';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TuiIcon, TuiInput, TuiButton],
  templateUrl: './login.html',
  styleUrl: './login.less',
})
export class Login implements OnInit {
  isDarkMode = false; // Change theme from light to dark
  protected messageError = '';
  protected messageSuccess = '';

  constructor(
    private readonly _authService: AuthService, // Service to call login from Backend
    private themeService: ThemeService, // Call the service to change color theme
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
      next:(user) => {
        this.messageSuccess = "BonCode";
        console.log(this.messageSuccess)
      },
      error: (error) => {
        this.messageError = "mot de passe faux";
        console.log(this.messageError);
      }
    })
  }
}
