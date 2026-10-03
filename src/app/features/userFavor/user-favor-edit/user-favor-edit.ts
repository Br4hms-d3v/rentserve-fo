import { Component, inject, OnInit, signal } from '@angular/core';
import { UserFavorService } from '../service/user-favor-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { FavorModel } from '../../favor/model/favor';
import { UserFavorDetailModel } from '../model/user-favor-detail';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiButton,
  TuiDropdown,
  TuiInputDirective,
  TuiLabel,
  TuiNotificationTemplate,
  TuiTextfieldComponent,
} from '@taiga-ui/core';
import {
  TuiDataListWrapperComponent,
  TuiFluidTypography,
  TuiInputNumberDirective,
  TuiSwitch,
  TuiTextareaComponent,
  TuiTextareaDirective,
} from '@taiga-ui/kit';
import { NgClass } from '@angular/common';
import { FavorService } from '../../favor/service/favor-service';
import { UserFavorEditForm } from '../model/user-favor-edit-form';

@Component({
  selector: 'app-user-favor-edit',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiDataListWrapperComponent,
    TuiFluidTypography,
    TuiInputDirective,
    TuiInputNumberDirective,
    TuiLabel,
    TuiNotificationTemplate,
    TuiSwitch,
    TuiTextareaComponent,
    TuiTextareaDirective,
    TuiTextfieldComponent,
    RouterLink,
    NgClass,
    TuiDropdown,
  ],
  templateUrl: './user-favor-edit.html',
  styleUrl: './user-favor-edit.less',
})
export class UserFavorEdit implements OnInit {
  private readonly _userFavorService = inject(UserFavorService); // Get detail and update user favor
  private readonly _favorService = inject(FavorService); // Service to call list favour
  private readonly _route = inject(ActivatedRoute); // Get the id of the favor (by url)s
  private _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected readonly filteredFavour = signal<string[]>([]); // Contains a list of filtered strings, initially empty

  private isInitializing = false;
  userFavorId!: number;
  favourList: string[] = [];
  favourModels: FavorModel[] = [];
  userFavorModel!: UserFavorDetailModel;
  title = 'Modification Service';
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit() {
    this.userFavorId = Number(this._route.snapshot.params['id']);

    this.getUserFavor();
    this.getFavor();
    this.changeTheme();

    this.editUserFavorForm.controls.favorName.valueChanges.subscribe((value) => {
      this.onFavorNameChange(value ?? '');
    });
  }

  protected editUserFavorForm = new FormGroup({
    favorId: new FormControl<number | null>(null, {
      validators: Validators.required,
    }),

    favorName: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),

    descriptionFavor: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),

    priceHourFavor: new FormControl(5.0, {
      nonNullable: true,
      validators: [Validators.min(5.0), Validators.required],
    }),

    isAvailable: new FormControl(false, {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  protected updateUserFavor() {
    this.editUserFavorForm.markAsTouched();

    if (this.editUserFavorForm.invalid) {
      this.messageError = 'Le formulaire est vide';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    const formValue = this.editUserFavorForm.getRawValue();

    const payload: UserFavorEditForm = {
      favorId: formValue.favorId!,
      descriptionFavor: formValue.descriptionFavor,
      priceHourFavor: formValue.priceHourFavor,
      isAvailable: formValue.isAvailable,
    };

    this._userFavorService.editUserFavor(this.userFavorId, payload).subscribe({
      next: (data) => {
        this.editUserFavorForm.patchValue(data);
        this.getFavor();

        this.isSuccess.set(true);
        this.show.set(true);
        this.messageSuccess = 'Le service est bien à jour';
      },
    });
  }

  onFavorNameFocus() {
    this.filteredFavour.set(this.favourList);
  }

  private onFavorNameChange(value: string) {
    if (this.isInitializing) {
      return;
    }

    const search = value.toLowerCase();

    this.filteredFavour.set(
      search
        ? this.favourList.filter((name) => name.toLowerCase().startsWith(search))
        : this.favourList,
    );

    const matched = this.favourModels.find(
      (favor) => favor.nameFavor.trim().toLowerCase() === search,
    );

    this.editUserFavorForm.controls.favorId.setValue(matched?.id ?? null, {
      emitEvent: false,
    });
  }

  getUserFavor() {
    this._userFavorService.getUserFavorDetail(this.userFavorId).subscribe({
      next: (userFavor) => {
        this.userFavorModel = userFavor;
        this.isInitializing = true;
        this.editUserFavorForm.patchValue({
          favorId: userFavor.id,
          favorName: userFavor.favor.nameFavor,
          descriptionFavor: userFavor.descriptionFavor,
          priceHourFavor: userFavor.priceHourFavor,
          isAvailable: userFavor.isAvailable,
        });
        this.isInitializing = false;
      },
    });
  }

  getFavor() {
    this._favorService.getFavour().subscribe({
      next: (listFavour) => {
        this.favourModels = listFavour;
        this.favourList = listFavour
          .map((favor) => favor.nameFavor)
          .sort((a, b) => a.localeCompare(b, 'fr'));
        this.filteredFavour.set(this.favourList);
      },
      error: (err) => console.error('Erreur récupération du service:', err),
    });
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
