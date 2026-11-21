import { Component, inject, OnInit, signal } from '@angular/core';
import { MaterialService } from '../service/material-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { CategoryService } from '../../category/service/category-service';
import { TuiBreadcrumbs, TuiDataListWrapper, TuiSwitch } from '@taiga-ui/kit';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiButton,
  TuiDropdown,
  TuiFilterByInputPipe, TuiIcon,
  TuiInput,
  TuiNotification,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiItem } from '@taiga-ui/cdk';
import { MaterialDetailModel } from '../model/material-detail';
import { MaterialForm } from '../model/material-form';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-material-edit',
  imports: [
    TuiBreadcrumbs,
    RouterLink,
    ReactiveFormsModule,
    TuiTextfield,
    TuiDataListWrapper,
    TuiInput,
    TuiFilterByInputPipe,
    TuiDropdown,
    TuiItem,
    TuiSwitch,
    TuiButton,
    TuiNotification,
    TuiIcon,
  ],
  templateUrl: './material-edit.html',
  styleUrl: './material-edit.less',
})
export class MaterialEdit implements OnInit {
  private materialService = inject(MaterialService); // Service to call update and get material
  private themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _categoryService = inject(CategoryService); // Service to call list of category
  private readonly _router = inject(Router); // Tool to navigate
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error

  materialId!: number;
  materialModel!: MaterialDetailModel;
  categoriesList: string[] = []; // Get a list of categories
  protected messageError = '';
  protected messageSuccess = '';
  title = 'Modification';

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
      caption: 'modifier un materiel',
    },
  ];

  ngOnInit() {
    this.getRoute();
    this.getMaterial();
    this.getCategories();
    this.changeTheme();
  }

  protected editMaterialForm = new FormGroup({
    category: new FormControl('', Validators.required),
    nameMaterial: new FormControl('', Validators.required),
    isAvailable: new FormControl<boolean>(false, Validators.required),
  });

  getRoute() {
    this._route.params.subscribe((params) => {
      this.materialId = params['id'];
      // console.log(this.materialId);
    });
  }

  getMaterial() {
    this.materialService.getMaterial(this.materialId).subscribe({
      next: (data) => {
        this.materialModel = data;
        this.editMaterialForm.get('category')?.patchValue(this.materialModel.nameCategory);
        this.editMaterialForm.get('nameMaterial')?.patchValue(this.materialModel.nameMaterial);
        this.editMaterialForm.get('isAvailable')?.patchValue(this.materialModel.isAvailable);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  protected onSubmitEditMaterial() {
    this.editMaterialForm.markAllAsTouched();

    if (this.editMaterialForm.invalid) {
      this.messageError = 'Veuillez renseigner correctement tous les champs obligatoires.';

      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    this.materialService
      .editMaterial(this.materialId, this.editMaterialForm.getRawValue() as MaterialForm)
      .subscribe({
        next: (data) => {
          this.editMaterialForm.patchValue(data);

          this.messageSuccess = 'Les modifications ont été enregistrées avec succès.';

          this.isSuccess.set(true);
          this.show.set(true);

          setTimeout(() => {
            this._router.navigate(['/material/all-materials']);
          }, 2000);
        },
        error: (err) => {
          this.messageError =
            err.error?.message ?? 'Une erreur est survenue lors de la modification du matériel.';

          this.isSuccess.set(false);
          this.show.set(true);
        },
      });
  }

  protected getCategories() {
    this._categoryService.getCategories().subscribe({
      next: (listCat) => {
        this.categoriesList = listCat
          .map((category) => category.nameCategory)
          .sort((a, b) => a.localeCompare(b, 'fr'));
      },

      error: (err) => {
        if (!typeof err.error) {
          this.messageError = err.error.message;
        } else if (err.error?.message) {
          this.messageError = err.error.message;
        } else {
          this.messageError = "Erreur d'inscription";
        }
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this.themeService.isDarkMode(); // Get current theme
    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
