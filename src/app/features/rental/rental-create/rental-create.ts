import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { TuiButton } from '@taiga-ui/core';
import { TuiIcon } from '@taiga-ui/core';
import { TuiNotificationTemplate } from '@taiga-ui/core';
import { RentalCreateForm } from '../model/rentalCreateForm';
import { UserMaterialModel } from '../../userMaterial/model/userMaterial';
import { AuthService } from '../../auth/service/auth-service';
import { RentalService } from '../service/rental-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { ActivatedRoute } from '@angular/router';
import { UserFavorModel } from '../../userFavor/model/userFavor';

@Component({
  selector: 'app-rental-create',
  imports: [ReactiveFormsModule, TuiButton, TuiIcon, TuiNotificationTemplate],
  templateUrl: './rental-create.html',
  styleUrl: './rental-create.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RentalCreate implements OnInit {
  // =========================================
  // INJECTIONS
  // =========================================

  private readonly _authService = inject(AuthService);
  private readonly _rentalService = inject(RentalService);
  private readonly _themeService = inject(ThemeService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);

  // =========================================
  // SIGNALS
  // =========================================

  readonly isDarkMode = signal(false);

  protected readonly show = signal(false);
  protected readonly isSuccess = signal(false);
  protected readonly isSubmitting = signal(false);

  protected readonly messageError = signal('');
  protected readonly messageSuccess = signal('');

  // =========================================
  // USER AND MATERIAL
  // =========================================

  userMaterialId!: number;
  userId!: number;

  // =========================================
  // DATE LIMITS
  // =========================================

  protected readonly min = this.toIsoDate(new Date());

  protected readonly max = this.toIsoDate(this.addDays(new Date(), 90));

  // =========================================
  // FORM VALIDATION
  // =========================================

  private readonly rentalPeriodValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const dateStart = control.get('dateStart')?.value;
    const dateEnd = control.get('dateEnd')?.value;
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    // Ne pas valider tant que tous les champs ne sont pas remplis.
    // Les validateurs required gèrent les champs obligatoires.
    if (!dateStart || !dateEnd || !startTime || !endTime) {
      return null;
    }

    // Format ISO : YYYY-MM-DDTHH:mm
    const start = `${dateStart}T${startTime}`;
    const end = `${dateEnd}T${endTime}`;

    // La fin doit être strictement postérieure au début.
    if (end <= start) {
      return { invalidRentalPeriod: true };
    }

    return null;
  };

  // =========================================
  // REACTIVE FORM
  // =========================================

  protected readonly rentalCreateForm = new FormGroup(
    {
      dateStart: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      dateEnd: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      startTime: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      endTime: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    {
      validators: [this.rentalPeriodValidator],
    },
  );

  // =========================================
  // INITIALIZATION
  // =========================================

  ngOnInit(): void {
    this.getCurrentUser();
    this.getRoute();
    this.changeTheme();
  }

  // =========================================
  // CURRENT USER
  // =========================================

  private getCurrentUser(): void {
    this._authService.currentUser$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });
  }

  // =========================================
  // ROUTE PARAMETERS
  // =========================================

  private getRoute(): void {
    this._route.params.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((params) => {
      this.userMaterialId = Number(params['id']);
    });
  }

  // =========================================
  // THEME MANAGEMENT
  // =========================================

  private changeTheme(): void {
    // Récupérer le thème actuel.
    this.isDarkMode.set(this._themeService.isDarkMode());
    // Observer les changements de thème.
    this._themeService.darkMode$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode.set(mode);
      });
  }

  // =========================================
  // CREATE RENTAL
  // =========================================

  rentalCreate(): void {
    // Éviter les doubles soumissions.
    if (this.isSubmitting()) {
      return;
    }
    // Vérifier la validité du formulaire.
    if (this.rentalCreateForm.invalid) {
      this.rentalCreateForm.markAllAsTouched();
      return;
    }

    // Vérifier la disponibilité des identifiants.
    if (
      !Number.isFinite(this.userId) ||
      !Number.isFinite(this.userMaterialId) ||
      this.userId <= 0 ||
      this.userMaterialId <= 0
    ) {
      this.messageSuccess.set('');
      this.messageError.set("Impossible d'identifier l'utilisateur ou le matériel.");
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    // Préparer la requête.
    const payload: RentalCreateForm = {
      ...this.rentalCreateForm.getRawValue(),
      userMaterial: {
        id: this.userMaterialId,
      } as UserMaterialModel,
      userFavor: {
        id: null,
      } as unknown as UserFavorModel,
    };
    // Préparer l'interface.
    this.isSubmitting.set(true);
    this.show.set(false);
    this.messageError.set('');
    this.messageSuccess.set('');

    // Envoyer la requête.
    this._rentalService
      .rentalCreate(this.userId, payload)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        // Toujours réactiver le bouton à la fin.
        finalize(() => {
          this.isSubmitting.set(false);
        }),
      )
      .subscribe({
        // Succès
        next: () => {
          this.messageError.set('');
          this.messageSuccess.set('Votre location a été enregistrée avec succès.');
          this.isSuccess.set(true);
          this.show.set(true);
        },
        // Erreur
        error: () => {
          this.messageSuccess.set('');
          this.messageError.set(
            "Une erreur est survenue lors de l'enregistrement de votre location.",
          );
          this.isSuccess.set(false);
          this.show.set(true);
        },
      });
  }

  // =========================================
  // RESET FORM
  // =========================================

  protected resetForm(): void {
    this.rentalCreateForm.reset({
      dateStart: '',
      dateEnd: '',
      startTime: '',
      endTime: '',
    });
    this.show.set(false);
    this.messageError.set('');
    this.messageSuccess.set('');
  }

  // =========================================
  // DATE HELPERS
  // =========================================

  private toIsoDate(date: Date): string {
    const pad = (value: number): string => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  private addDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }
}
