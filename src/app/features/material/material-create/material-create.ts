import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  TuiButton,
  TuiDropdown,
  TuiFilterByInputPipe,
  TuiIcon,
  TuiInput,
  TuiNotification,
  TuiTextfield,
} from '@taiga-ui/core';
import { MaterialService } from '../service/material-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../category/service/category-service';
import { MaterialForm } from '../model/material-form';
import { TuiBreadcrumbs, TuiDataListWrapper, TuiSwitch } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-material-create',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TuiBreadcrumbs,
    TuiTextfield,
    TuiInput,
    TuiDropdown,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiItem,
    TuiSwitch,
    TuiButton,
    TuiIcon,
    TuiNotification,
  ],
  templateUrl: './material-create.html',
  styleUrl: './material-create.less',
})
export class MaterialCreate implements OnInit {
  private materialService = inject(MaterialService);
  private themeService = inject(ThemeService);
  private readonly _categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for succes or Red error
  categoriesList: string[] = []; // Get a list of categories
  protected messageError = '';
  protected messageSuccess = '';
  title = 'Nouveau materiel';

  // Breadcrumbs
  protected links = [
    {
      caption: "Page d\'accueil",
      routerLink: '/dashboard',
    },
    {
      caption: 'Liste materiels',
      routerLink: '/material/all-materials',
    },
    {
      caption: 'Créer un materiel',
      routerLink: '/material/create/new-material',
    },
  ];

  protected readonly newMaterialForm = new FormGroup({
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    nameMaterial: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    isAvailable: new FormControl(false, {
      nonNullable: true,
    }),
  });

  ngOnInit() {
    this.getCategories();
    this.changeTheme();
  }

  private changeTheme(): void {
    this.isDarkMode = this.themeService.isDarkMode();

    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
      });
  }

  protected getCategories(): void {
    this._categoryService.getCategories().subscribe({
      next: (listCat) => {
        this.categoriesList = listCat
          .map((category) => category.nameCategory)
          .sort((a, b) => a.localeCompare(b, 'fr'));
      },

      error: () => {
        this.categoriesList = [];
        this.messageError = 'Impossible de récupérer la liste des catégories.';
      },
    });
  }

  protected onSubmitNewMaterial(): void {
    if (this.newMaterialForm.invalid) {
      this.newMaterialForm.markAllAsTouched();
      return;
    }

    const materialData = this.newMaterialForm.getRawValue() as MaterialForm;

    this.materialService.createMaterial(materialData).subscribe({
      next: () => {
        this.isSuccess.set(true);

        this.messageSuccess = 'Le matériel a été enregistré avec succès.';

        this.messageError = '';

        this.show.set(true);

        this.newMaterialForm.reset({
          category: '',
          nameMaterial: '',
          isAvailable: false,
        });
      },

      error: (err) => {
        this.isSuccess.set(false);

        this.messageError =
          err.error?.message ?? "Une erreur est survenue lors de l'enregistrement du matériel.";

        this.messageSuccess = '';

        this.show.set(true);
      },
    });
  }
}
