import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiButton,
  TuiDropdown,
  TuiIcon,
  TuiInput,
  TuiNotification,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TuiDataListWrapper,
  TuiFluidTypography,
  TuiInputNumber,
  TuiSwitch,
  TuiTextarea,
} from '@taiga-ui/kit';
import { UserMaterialService } from '../service/user-material-service';
import { UserMaterialDetailModel } from '../model/user-material-detail';
import { MaterialService } from '../../material/service/material-service';
import { State } from '../enum/state';
import { UserMaterialEditForm } from '../model/user-material-edit-form';
import { MaterialModel } from '../../material/model/Material';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-material-edit',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TuiTextfield,
    TuiInput,
    TuiTextarea,
    TuiFluidTypography,
    TuiInputNumber,
    TuiSwitch,
    TuiDataListWrapper,
    TuiNotification,
    TuiButton,
    TuiDropdown,
    TuiIcon,
  ],
  templateUrl: './user-material-edit.html',
  styleUrl: './user-material-edit.less',
})
export class UserMaterialEdit implements OnInit {
  private readonly _userMaterialService = inject(UserMaterialService); // Get detail and update user material
  private readonly _materialService = inject(MaterialService); // Service to call list materials
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _destroyRef = inject(DestroyRef);

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected readonly filteredMaterials = signal<string[]>([]); // Contains a list of filtered strings, initially empty

  private isInitializing = false;
  userMaterialId!: number;
  materialsList: string[] = [];
  materialsModels: MaterialModel[] = [];
  userMaterialModel!: UserMaterialDetailModel;
  title = 'Modification Material';
  protected messageError = '';
  protected messageSuccess = '';

  protected editUserMaterialForm = new FormGroup({
    materialId: new FormControl<number | null>(null, {
      validators: Validators.required,
    }),

    materialName: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),

    descriptionMaterial: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),

    priceHourMaterial: new FormControl(1.0, {
      nonNullable: true,
      validators: [Validators.min(1.0), Validators.required],
    }),

    isAvailable: new FormControl(false, {
      nonNullable: true,
    }),

    state: new FormControl<State>(State.GOOD_STATE, {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  ngOnInit(): void {
    this.userMaterialId = Number(this._route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.userMaterialId) || this.userMaterialId <= 0) {
      this.messageError = 'Identifiant du matériel invalide.';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    this.changeTheme();
    this.getUserMaterial();
    this.getMaterials();

    this.editUserMaterialForm.controls.materialName.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => {
        this.onMaterialNameChange(value ?? '');
      });
  }

  protected getUserMaterial(): void {
    this._userMaterialService
      .getUserMaterialDetail(this.userMaterialId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (userMaterial) => {
          this.userMaterialModel = userMaterial;
          this.isInitializing = true;
          this.editUserMaterialForm.patchValue({
            materialId: userMaterial.material.id,
            materialName: userMaterial.material.nameMaterial,
            descriptionMaterial: userMaterial.descriptionMaterial,
            priceHourMaterial: userMaterial.priceHourMaterial,
            isAvailable: userMaterial.isAvailable,
            state: userMaterial.state,
          });
          this.isInitializing = false;
        },

        error: (err) => {
          console.error('Erreur lors du chargement du matériel :', err);
          this.messageError = 'Impossible de récupérer les informations du matériel.';
          this.isSuccess.set(false);
          this.show.set(true);
        },
      });
  }

  protected getMaterials(): void {
    this._materialService
      .getMaterials()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (listMaterials) => {
          this.materialsModels = listMaterials;
          this.materialsList = listMaterials
            .map((material) => material.nameMaterial)
            .sort((a, b) => a.localeCompare(b, 'fr'));
          this.filteredMaterials.set(this.materialsList);
        },

        error: (err) => {
          console.error('Erreur lors de la récupération des matériels :', err);
        },
      });
  }

  // Clear the field when clicked to show the full list.
  protected onMaterialNameFocus(): void {
    this.filteredMaterials.set(this.materialsList);
  }

  private onMaterialNameChange(value: string): void {
    if (this.isInitializing) {
      return;
    }
    const search = value.trim().toLowerCase();

    this.filteredMaterials.set(
      search
        ? this.materialsList.filter((name) => name.toLowerCase().startsWith(search))
        : this.materialsList,
    );

    const matched = this.materialsModels.find(
      (material) => material.nameMaterial.trim().toLowerCase() === search,
    );

    this.editUserMaterialForm.controls.materialId.setValue(matched?.id ?? null, {
      emitEvent: false,
    });
  }

  protected updateUserMaterial(): void {
    this.editUserMaterialForm.markAllAsTouched();

    if (this.editUserMaterialForm.invalid) {
      this.messageError = 'Veuillez vérifier les informations renseignées.';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    const formValue = this.editUserMaterialForm.getRawValue();

    const payload: UserMaterialEditForm = {
      materialId: formValue.materialId!,
      descriptionMaterial: formValue.descriptionMaterial,
      priceHourMaterial: formValue.priceHourMaterial,
      isAvailable: formValue.isAvailable,
      state: formValue.state,
    };

    this._userMaterialService
      .editUserMaterial(this.userMaterialId, payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.isSuccess.set(true);
          this.messageSuccess = 'Les modifications ont été enregistrées avec succès.';
          this.show.set(true);
          this.getUserMaterial();
        },

        error: (err) => {
          console.error('Erreur lors de la modification du matériel :', err);
          this.isSuccess.set(false);
          this.messageError =
            err.error?.message ?? 'Une erreur est survenue lors de la modification du matériel.';
          this.show.set(true);
        },
      });
  }

  protected changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode();
    this._themeService.darkMode$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
      });
  }
}
