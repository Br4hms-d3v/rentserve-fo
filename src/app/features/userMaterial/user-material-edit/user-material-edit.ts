import { Component, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiInput, TuiTextfield } from '@taiga-ui/core';
import { TuiFluidTypography, TuiInputNumber, TuiSwitch, TuiTextarea } from '@taiga-ui/kit';
import { UserMaterialService } from '../service/user-material-service';
import { UserMaterialDetailModel } from '../model/user-material-detail';
import { State } from '../enum/state';

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
  ],
  templateUrl: './user-material-edit.html',
  styleUrl: './user-material-edit.less',
})
export class UserMaterialEdit implements OnInit {
  private readonly _userMaterialService = inject(UserMaterialService); // Get detail and update user material
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  userMaterialId!: number;
  userMaterialModel!: UserMaterialDetailModel;

  ngOnInit() {
    this.userMaterialId = Number(this._route.snapshot.paramMap.get('id'));
    this.getUserMaterial();
  }

  protected editUserMaterialForm = new FormGroup({
    material: new FormControl('', Validators.required),
    descriptionMaterial: new FormControl('', Validators.required),
    priceHourMaterial: new FormControl<number>(1.0, [Validators.min(1.0), Validators.required]),
    isAvailable: new FormControl<boolean>(false, [Validators.required]),
    state: new FormControl<State>(State.GOOD_STATE, [Validators.required]),
  });

  getUserMaterial() {
    this._userMaterialService.getUserMaterialDetail(this.userMaterialId).subscribe({
      next: (userMaterial) => {
        this.userMaterialModel = userMaterial;

        this.editUserMaterialForm.get('material')?.patchValue(this.userMaterialModel.material.nameMaterial);
        this.editUserMaterialForm.get('descriptionMaterial')?.patchValue(this.userMaterialModel.descriptionMaterial);
        this.editUserMaterialForm.get('priceHourMaterial')?.patchValue(this.userMaterialModel.priceHourMaterial);
        this.editUserMaterialForm.get('isAvailable')?.patchValue(this.userMaterialModel.isAvailable);
        this.editUserMaterialForm.get('state')?.patchValue(this.userMaterialModel.state);
      },
    });
  }
}
