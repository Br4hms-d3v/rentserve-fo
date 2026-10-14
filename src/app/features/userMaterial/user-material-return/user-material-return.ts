import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  TuiButton,
  TuiInput,
  TuiLabel,
  TuiNotificationTemplate,
  TuiTextfield,
} from '@taiga-ui/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiChevron,
  TuiDataListWrapperComponent,
  TuiSelectDirective,
  TuiSwitch,
} from '@taiga-ui/kit';
import { State } from '../enum/state';
import { UserMaterialService } from '../service/user-material-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserMaterialReturnForm } from '../model/user-material-return-form';

@Component({
  selector: 'app-user-material-return',
  imports: [
    NgClass,
    TuiLabel,
    TuiTextfield,
    TuiButton,
    TuiInput,
    ReactiveFormsModule,
    TuiChevron,
    TuiDataListWrapperComponent,
    TuiSelectDirective,
    TuiSwitch,
    TuiNotificationTemplate,
  ],
  templateUrl: './user-material-return.html',
  styleUrl: './user-material-return.less',
})
export class UserMaterialReturn implements OnInit {
  private userMaterialService = inject(UserMaterialService); // Call the service to create a new usermaterial
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _router = inject(Router); // Tool to navigate
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s

  isDarkMode = false; // Change theme from light to dark
  userMaterialId!: number;
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected messageError = '';
  protected messageSuccess = '';

  protected readonly states = Object.values(State);

  ngOnInit() {
    this.getRoute();
    this.changeTheme();
  }

  getRoute() {
    this._route.params.subscribe((params) => {
      this.userMaterialId = params['id'];
    });
  }

  protected returnUserMaterialForm = new FormGroup({
    isAvailable: new FormControl(true, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    state: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  protected returnUserMaterial() {
    if (this.returnUserMaterialForm.invalid) {
      this.returnUserMaterialForm.markAllAsTouched();
      this.messageError = 'Formulaire vide';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    this.userMaterialService
      .returnUserMaterial(
        this.userMaterialId,
        <UserMaterialReturnForm>this.returnUserMaterialForm.value,
      )
      .subscribe({
        next: (result) => {
          this.returnUserMaterialForm.patchValue(result);
          this.messageSuccess = 'Le matériel est denouveau disponible';
          this.messageError = '';
          this.show.set(true);
          this.isSuccess.set(true);
          setTimeout(() => {
            this._router.navigate(['/user-material', 'my-user-material']);
          }, 2000);
        },
        error: (error) => {
          this.messageSuccess = '';
          this.messageError = 'La mise à jour a échoué';
          this.show.set(true);
          this.isSuccess.set(false);
        },
      });
  }

  onBack() {
    this.returnUserMaterialForm.reset();
    this._router.navigate(['/user-material', 'my-user-material']);
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
