import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDropdown, TuiInput, TuiNotification, TuiTextfield } from '@taiga-ui/core';
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

@Component({
  selector: 'app-user-material-edit',
  imports: [
    NgClass,
    ReactiveFormsModule,
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
  ],
  templateUrl: './user-material-edit.html',
  styleUrl: './user-material-edit.less',
})
export class UserMaterialEdit implements OnInit {
  private readonly _userMaterialService = inject(UserMaterialService); // Get detail and update user material
  private readonly _materialService = inject(MaterialService); // Service to call list materials
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected readonly filteredMaterials = signal<string[]>([]); // Contains a list of filtered strings, initially empty

  private isInitializing = false;
  userMaterialId!: number;
  materialsList: string[] = [];
  materialsModels: MaterialModel[] = [];
  userMaterialModel!: UserMaterialDetailModel;
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit() {
    this.userMaterialId = Number(this._route.snapshot.paramMap.get('id'));
    this.getUserMaterial();
    this.getMaterials();
    this.getStates();

    this.editUserMaterialForm.controls.materialName.valueChanges.subscribe((value) => {
      this.onMaterialNameChange(value ?? '');
    });
  }

  protected editUserMaterialForm = new FormGroup({
    materialId: new FormControl<number | null>(null, Validators.required),
    materialName: new FormControl<string>('', Validators.required),
    descriptionMaterial: new FormControl('', Validators.required),
    priceHourMaterial: new FormControl<number>(1.0, [Validators.min(1.0), Validators.required]),
    isAvailable: new FormControl<boolean>(false, [Validators.required]),
    state: new FormControl<State>(State.GOOD_STATE, [Validators.required]),
  });

  protected getUserMaterial() {
    this._userMaterialService.getUserMaterialDetail(this.userMaterialId).subscribe({
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
    });
  }

  protected getMaterials() {
    this._materialService.getMaterials().subscribe({
      next: (listMaterials) => {
        this.materialsModels = listMaterials;
        this.materialsList = listMaterials
          .map((material) => material.nameMaterial)
          .sort((a, b) => a.localeCompare(b, 'fr'));
        this.filteredMaterials.set(this.materialsList);
      },
      error: (err) => console.error('Erreur récupération matériels:', err),
    });
  }

  // Clear the field when clicked to show the full list.
  protected onMaterialNameFocus(): void {
    this.filteredMaterials.set(this.materialsList);
  }

  private onMaterialNameChange(value: string): void {
    if (this.isInitializing) return;

    const search = value.trim().toLowerCase();

    // "Starts with" filter (not "contains")
    this.filteredMaterials.set(
      search
        ? this.materialsList.filter((name) => name.toLowerCase().startsWith(search))
        : this.materialsList,
    );

    // Sync materialId when the text exactly matches an existing material
    const matched = this.materialsModels.find(
      (material) => material.nameMaterial.toLowerCase() === value.toLowerCase(),
    );
    this.editUserMaterialForm.controls.materialId.setValue(matched ? matched.id : null, {
      emitEvent: false,
    });
  }

  protected updateUserMaterial() {
    this.editUserMaterialForm.markAllAsTouched();

    if (this.editUserMaterialForm.invalid) {
      this.messageError = 'Le formulaire est invalide';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    const { materialName, ...payload } = this.editUserMaterialForm.getRawValue();

    this._userMaterialService
      .editUserMaterial(this.userMaterialId, payload as UserMaterialEditForm)
      .subscribe({
        next: (data) => {
          this.editUserMaterialForm.patchValue(data);
          this.getUserMaterial();
          this.isSuccess.set(true);
          this.show.set(true);
          this.messageSuccess = 'Matériel modifié avec succès';
        },
        error: (err) => {
          this.isSuccess.set(false);
          this.show.set(true);
          this.messageError = err.error?.message ?? 'Erreur lors de la modification';
        },
      });
    // console.log(this.editUserMaterialForm.getRawValue());
  }

  protected getStates() {}
}
