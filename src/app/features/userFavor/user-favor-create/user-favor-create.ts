import { Component, inject, OnInit, signal } from '@angular/core';
import { FavorService } from '../../favor/service/favor-service';
import { UserFavorService } from '../service/user-favor-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { Router, RouterLink } from '@angular/router';
import { FavorModel } from '../../favor/model/favor';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserFavorCreateForm } from '../model/user-favor-create-form';
import { TuiChevron, TuiComboBoxDirective, TuiDataListWrapperComponent, TuiFile, TuiFileRejectedPipe, tuiFilesAccepted,
  TuiFilesComponent, TuiInputFiles, TuiInputFilesDirective, TuiInputNumberDirective, TuiSwitch,
  TuiTextareaComponent, TuiTextareaDirective
} from '@taiga-ui/kit';
import { maxLength } from '@angular/forms/signals';
import { TuiValidationError } from '@taiga-ui/cdk';
import { AsyncPipe, NgClass } from '@angular/common';
import { TuiButton,
  TuiDropdown, TuiErrorComponent, TuiErrorDirective, TuiFilterByInputPipe, TuiLabel, TuiNotificationTemplate,
  TuiTextfieldComponent
} from '@taiga-ui/core';

@Component({
  selector: 'app-user-favor-create',
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    TuiButton,
    TuiChevron,
    TuiComboBoxDirective,
    TuiDataListWrapperComponent,
    TuiErrorComponent,
    TuiErrorDirective,
    TuiFile,
    TuiFileRejectedPipe,
    TuiFilesComponent,
    TuiFilterByInputPipe,
    TuiInputFiles,
    TuiInputFilesDirective,
    TuiInputNumberDirective,
    TuiLabel,
    TuiNotificationTemplate,
    TuiSwitch,
    TuiTextareaComponent,
    TuiTextareaDirective,
    TuiTextfieldComponent,
    NgClass,
    TuiDropdown,
    RouterLink,
  ],
  templateUrl: './user-favor-create.html',
  styleUrl: './user-favor-create.less',
})
export class UserFavorCreate implements OnInit {
  private readonly _favorService = inject(FavorService); // Get a list of all favour
  private userFavorService = inject(UserFavorService); // Call the service to create a new userFavor
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _router = inject(Router); // Tool to navigate

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  title = 'Ajouter mon service';
  favourList: FavorModel[] = []; // Get a list of Favour
  protected readonly stringify = (favor: FavorModel): string => favor.nameFavor;
  protected rejected: readonly File[] = []; // Tab for reject picture
  protected pictures: File[] = []; // Tab for pictures
  protected messageError = '';
  protected messageSuccess = '';

  protected createUserFavorForm = new FormGroup({
    favor: new FormControl<FavorModel | null>(null, Validators.required),
    favorId: new FormControl<number | null>(null),

    favorName: new FormControl('', {
      nonNullable: true,
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

    pictures: new FormControl<File[]>([], {
      nonNullable: true,
      validators: [maxFilesLength(6)],
    }),
  });

  constructor() {
    this.createUserFavorForm.controls.favor.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((favor) => this.onFavorSelected(favor));
  }

  ngOnInit() {
    this.getFavour();
    this.changeTheme();
  }

  protected getFavour() {
    this._favorService.getFavour().subscribe({
      next: (listFav) => (this.favourList = listFav),
      error: () => (this.messageError = 'Aucun service trouvé'),
    });
  }

  protected onFavorSelected(favor: FavorModel | null): void {
    // The combobox can emit a string while typing.
    const selected = favor && typeof favor === 'object' ? favor : null;

    this.createUserFavorForm.patchValue(
      {
        favorId: selected?.id ?? null,
        favorName: selected?.nameFavor ?? '',
      },
      { emitEvent: false },
    );
  }

  protected createUserFavor() {
    if (this.createUserFavorForm.invalid) {
      this.createUserFavorForm.markAllAsTouched();
      this.messageError = 'Formulaire vide';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    const raw = this.createUserFavorForm.getRawValue();

    // Security: select only the favor selected
    if (!raw.favor || typeof raw.favor !== 'object') {
      this.createUserFavorForm.controls.favor.setErrors({ required: true });
      return;
    }

    const form: UserFavorCreateForm = {
      favorId: raw.favor.id,
      favorName: raw.favor.nameFavor,
      descriptionFavor: raw.descriptionFavor,
      priceHourFavor: raw.priceHourFavor,
      isAvailable: raw.isAvailable,
    };

    this.userFavorService.createUserFavor(form, raw.pictures).subscribe({
      next: () => {
        this.messageSuccess = 'Le service a bien été créée';
        this.show.set(true);
        this.createUserFavorForm.reset({ priceHourFavor: 5.0, isAvailable: true });
        this.rejected = [];
        this._router.navigate(['user-favor', 'my-user-favor']).then();
      },
      error: () => {
        this.messageError = 'Erreur lors de la création de votre service';
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

  onBack() {
    this.createUserFavorForm.reset();
    this.rejected = [];
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }

  // Picture
  protected readonly accepted$ = this.createUserFavorForm.controls.pictures.valueChanges.pipe(
    startWith(this.createUserFavorForm.controls.pictures.value),
    map(() => tuiFilesAccepted(this.createUserFavorForm.controls.pictures)),
  );

  protected onReject(files: readonly File[]) {
    this.rejected = Array.from(new Set(this.rejected.concat(files)));
  }

  protected onRemove(file: File) {
    this.rejected = this.rejected.filter((rejected) => rejected !== file);
    const pictures = this.createUserFavorForm.controls.pictures.value ?? [];
    this.createUserFavorForm.controls.pictures.setValue(
      pictures.filter((current) => current !== file),
    );
  }
}

export function maxFilesLength(MaxLength: number) {
  return ({ value }: AbstractControl) =>
    value.length > maxLength
      ? {
          maxLength: new TuiValidationError('Erreur: La limite est de 6 images'),
        }
      : null;
}
