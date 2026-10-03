import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
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
  TuiDropdown, TuiError,
  TuiFilterByInputPipe,
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
    NgClass,
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
  ],
  templateUrl: './user-material-create.html',
  styleUrl: './user-material-create.less',
})
export class UserMaterialCreate implements OnInit {
  private readonly _materialService = inject(MaterialService); // Get a list of all materials
  private userMaterialService = inject(UserMaterialService); // Call the service to create a new usermaterial
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _router = inject(Router); // Tool to navigate

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

  protected createUserMaterialForm = new FormGroup({
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
      validators: [Validators.required],
    }),

    state: new FormControl<State | null>(null, {
      validators: [Validators.required],
    }),

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
    this._materialService.getMaterials().subscribe({
      next: (listMat) => (this.materialsList = listMat),
      error: () => (this.messageError = 'Aucun matériel trouvé'),
    });
  }

  protected onMaterialSelected(material: MaterialModel | null): void {
    // The combobox can emit a string while typing.
    const selected = material && typeof material === 'object' ? material : null;

    this.createUserMaterialForm.patchValue(
      {
        materialId: selected?.id ?? null,
        materialName: selected?.nameMaterial ?? '',
      },
      { emitEvent: false },
    );
  }

  protected createUserMaterial() {
    if (this.createUserMaterialForm.invalid) {
      this.createUserMaterialForm.markAllAsTouched();
      this.messageError = 'Formulaire vide';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    const raw = this.createUserMaterialForm.getRawValue();

    // Sécurité : on ne s'appuie que sur l'objet sélectionné
    if (!raw.material || typeof raw.material !== 'object') {
      this.createUserMaterialForm.controls.material.setErrors({ required: true });
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

    this.userMaterialService.createUserMaterial(form, raw.pictures).subscribe({
      next: () => {
        this.messageSuccess = 'Matériel créé avec succès';
        this.isSuccess.set(true);
        this.show.set(true);
        this.createUserMaterialForm.reset({ priceHourMaterial: 1.0, isAvailable: true });
        this.rejected = [];
        this._router.navigate(['/user-material','my-user-material']).then();
      },
      error: (error) => {
        this.messageError = 'Erreur lors de la création';
        this.isSuccess.set(false);
        this.show.set(true);
        if (this.pictures.length == 0) {
          this.messageError = 'Vous devez ajouter les photos';
          this.isSuccess.set(false);
          this.show.set(true);
        }
      },
    });
  }

  onBack(){
    this.createUserMaterialForm.reset();
    this.rejected = [];

  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
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
  }
}

export function maxFilesLength(maxLength: number): ValidatorFn {
  return ({ value }: AbstractControl) =>
    value.length > maxLength
      ? {
          maxLength: new TuiValidationError('Erreur: La limite est de 6 images'),
        }
      : null;
}
