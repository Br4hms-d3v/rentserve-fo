import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  TuiButton,
  TuiIcon,
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-material-return',
  imports: [
    TuiIcon,
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
  private readonly destroyRef = inject(DestroyRef);

  isDarkMode = false; // Change theme from light to dark
  userMaterialId!: number;
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected messageError = '';
  protected messageSuccess = '';

  protected readonly states = Object.values(State);

  protected readonly returnUserMaterialForm = new FormGroup({
    isAvailable: new FormControl(true, {
      nonNullable: true,
      validators: [Validators.required],
    }),

    state: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    this.getRoute();
    this.changeTheme();
  }

  private getRoute(): void {
    this._route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.userMaterialId = Number(params['id']);
    });
  }

  protected returnUserMaterial(): void {
    // Vérification du formulaire
    if (this.returnUserMaterialForm.invalid) {
      this.returnUserMaterialForm.markAllAsTouched();
      this.messageError = 'Veuillez renseigner tous les champs obligatoires.';
      this.messageSuccess = '';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    // Vérification de l'identifiant
    if (!Number.isInteger(this.userMaterialId) || this.userMaterialId <= 0) {
      this.messageError = "Impossible d'identifier le matériel concerné.";
      this.messageSuccess = '';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    const formValue = this.returnUserMaterialForm.value as UserMaterialReturnForm;

    this.userMaterialService
      .returnUserMaterial(this.userMaterialId, formValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.returnUserMaterialForm.patchValue(result);
          this.messageSuccess = 'Le retour du matériel a bien été enregistré.';
          this.messageError = '';
          this.isSuccess.set(true);
          this.show.set(true);

          setTimeout(() => {
            this._router.navigate(['/user-material', 'my-user-material']);
          }, 2000);
        },

        error: () => {
          this.messageSuccess = '';
          this.messageError =
            'Une erreur est survenue lors de la mise à jour du matériel. Veuillez réessayer.';
          this.isSuccess.set(false);
          this.show.set(true);
        },
      });
  }

  protected onBack(): void {
    this.returnUserMaterialForm.reset({
      isAvailable: true,
      state: '',
    });
    this._router.navigate(['/user-material', 'my-user-material']);
  }

  private changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode();

    this._themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
      });
  }
}
