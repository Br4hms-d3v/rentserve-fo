import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  TuiChevron,
  TuiComboBox,
  TuiDataListWrapperComponent,
  TuiFiles,
  tuiFilesAccepted,
  TuiInputNumberDirective,
  TuiSelect,
  TuiSwitch,
  TuiTextareaComponent,
  TuiTextareaDirective,
} from '@taiga-ui/kit';
import {
  TuiButton,
  TuiDropdown,
  TuiError,
  TuiFilterByInputPipe,
  TuiIcon,
  TuiLabel,
  TuiNotificationTemplate,
  TuiTextfieldComponent,
} from '@taiga-ui/core';
import { State } from '../enum/state';
import { map, startWith } from 'rxjs';
import { UserMaterialService } from '../service/user-material-service';
import { MaterialService } from '../../material/service/material-service';
import { UserMaterialCreateForm } from '../model/user-material-create-form';
import { MaterialModel } from '../../material/model/Material';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TuiValidationError } from '@taiga-ui/cdk';
import { ThemeService } from '../../../core/services/ThemeService';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-material-create',
  imports: [
    ReactiveFormsModule,
    TuiLabel,
    TuiTextfieldComponent,
    TuiSwitch,
    TuiTextareaComponent,
    TuiTextareaDirective,
    TuiInputNumberDirective,
    TuiFiles,
    AsyncPipe,
    TuiDataListWrapperComponent,
    TuiFilterByInputPipe,
    TuiDropdown,
    TuiChevron,
    TuiComboBox,
    TuiButton,
    TuiNotificationTemplate,
    TuiSelect,
    TuiError,
    RouterLink,
    TuiIcon,
  ],
  templateUrl: './user-material-create.html',
  styleUrl: './user-material-create.less',
})
export class UserMaterialCreate implements OnInit {
  private readonly _materialService = inject(MaterialService); // Get a list of all materials
  private userMaterialService = inject(UserMaterialService); // Call the service to create a new usermaterial
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _router = inject(Router); // Tool to navigate
  private readonly destroyRef = inject(DestroyRef);

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  title = 'Ajouter mon matériel';
  materialsList: MaterialModel[] = []; // Get a list of material
  protected readonly stringify = (material: MaterialModel): string => material.nameMaterial;
  protected readonly states = Object.values(State);
  protected rejected: readonly File[] = []; // Tab for reject picture
  protected pictures: File[] = []; // Tab for pictures
  protected messageError = '';
  protected messageSuccess = '';

  protected readonly createUserMaterialForm = new FormGroup({
    material: new FormControl<MaterialModel | null>(null, Validators.required),

    materialId: new FormControl<number | null>(null),

    materialName: new FormControl('', {
      nonNullable: true,
    }),

    descriptionMaterial: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    priceHourMaterial: new FormControl(1.0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1.0)],
    }),

    isAvailable: new FormControl(true, {
      nonNullable: true,
    }),

    state: new FormControl<State | null>(null, Validators.required),

    pictures: new FormControl<File[]>([], {
      nonNullable: true,
      validators: [maxFilesLength(6)],
    }),
  });

  constructor() {
    this.createUserMaterialForm.controls.material.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((material) => this.onMaterialSelected(material));
  }

  ngOnInit() {
    this.getMaterials();
    this.changeTheme();
  }

  protected getMaterials(): void {
    this._materialService
      .getMaterials()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (materials) => {
          this.materialsList = materials;
        },

        error: () => {
          this.notifyError('Impossible de récupérer la liste des matériels.');
        },
      });
  }

  protected onMaterialSelected(material: MaterialModel | null): void {
    const selected = material && typeof material === 'object' ? material : null;

    this.createUserMaterialForm.patchValue(
      {
        materialId: selected?.id ?? null,

        materialName: selected?.nameMaterial ?? '',
      },
      {
        emitEvent: false,
      },
    );
  }

  protected createUserMaterial(): void {
    if (this.createUserMaterialForm.invalid) {
      this.createUserMaterialForm.markAllAsTouched();

      this.notifyError('Veuillez renseigner tous les champs obligatoires.');

      return;
    }

    const raw = this.createUserMaterialForm.getRawValue();

    if (!raw.material || typeof raw.material !== 'object') {
      this.createUserMaterialForm.controls.material.setErrors({ required: true });

      this.notifyError('Veuillez sélectionner un matériel dans la liste.');

      return;
    }

    const form: UserMaterialCreateForm = {
      materialId: raw.material.id,

      materialName: raw.material.nameMaterial,

      descriptionMaterial: raw.descriptionMaterial,

      priceHourMaterial: raw.priceHourMaterial,

      isAvailable: raw.isAvailable,

      state: raw.state!,
    };

    this.userMaterialService
      .createUserMaterial(form, raw.pictures)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notifySuccess('Votre matériel a été ajouté avec succès.');

          this.resetForm();

          this._router.navigate(['/user-material', 'my-user-material']);
        },

        error: () => {
          this.notifyError('Une erreur est survenue lors de la création du matériel.');
        },
      });
  }

  protected onBack(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.createUserMaterialForm.reset({
      material: null,
      materialId: null,
      materialName: '',
      descriptionMaterial: '',
      priceHourMaterial: 1.0,
      isAvailable: true,
      state: null,
      pictures: [],
    });
    this.rejected = [];
    this.pictures = [];
    this.createUserMaterialForm.markAsPristine();
    this.createUserMaterialForm.markAsUntouched();
  }

  private changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode();

    this._themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
      });
  }

  private notifySuccess(message: string): void {
    this.messageSuccess = message;
    this.messageError = '';
    this.isSuccess.set(true);
    this.show.set(true);
  }

  private notifyError(message: string): void {
    this.messageError = message;
    this.messageSuccess = '';
    this.isSuccess.set(false);
    this.show.set(true);
  }

  // Picture
  protected readonly accepted$ = this.createUserMaterialForm.controls.pictures.valueChanges.pipe(
    startWith(this.createUserMaterialForm.controls.pictures.value),
    map(() => tuiFilesAccepted(this.createUserMaterialForm.controls.pictures)),
  );

  protected onReject(files: readonly File[]): void {
    this.rejected = Array.from(new Set(this.rejected.concat(files)));
  }

  protected onRemove(file: File): void {
    this.rejected = this.rejected.filter((rejected) => rejected !== file);
    const pictures = this.createUserMaterialForm.controls.pictures.value ?? [];
    this.createUserMaterialForm.controls.pictures.setValue(
      pictures.filter((current) => current !== file),
    );
    this.createUserMaterialForm.controls.pictures.updateValueAndValidity();
  }
}

export function maxFilesLength(maxLength: number): ValidatorFn {
  return ({ value }: AbstractControl) => {
    if (!Array.isArray(value)) {
      return null;
    }
    return value.length > maxLength
      ? {
          maxLength: new TuiValidationError(
            `Vous pouvez ajouter un maximum de ${maxLength} images.`,
          ),
        }
      : null;
  };
}
