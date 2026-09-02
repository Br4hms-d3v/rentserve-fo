import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  TuiButton,
  TuiDropdown,
  TuiFilterByInputPipe,
  TuiInput,
  TuiNotification,
} from '@taiga-ui/core';
import { MaterialService } from '../service/material-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../category/service/category-service';
import { MaterialForm } from '../model/material-form';
import { TuiBreadcrumbs, TuiDataListWrapper, TuiSwitch } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';

@Component({
  selector: 'app-material-create',
  imports: [
    TuiBreadcrumbs,
    RouterLink,
    ReactiveFormsModule,
    TuiDropdown,
    TuiFilterByInputPipe,
    TuiInput,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiItem,
    TuiSwitch,
    TuiButton,
    TuiNotification,
  ],
  templateUrl: './material-create.html',
  styleUrl: './material-create.less',
})
export class MaterialCreate implements OnInit {
  private materialService = inject(MaterialService);
  private themeService = inject(ThemeService);
  private readonly _categoryService = inject(CategoryService);

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

  ngOnInit() {
    this.getCategories();
    this.isDarkMode = this.themeService.isDarkMode(); // Get current theme
    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }

  protected newMaterialForm = new FormGroup({
    category: new FormControl('', Validators.required),
    nameMaterial: new FormControl('', Validators.required),
    isAvailable: new FormControl<boolean>(false, Validators.required),
  });

  protected getCategories() {
    this._categoryService.getCategories().subscribe({
      next: (listCat) => {
        this.categoriesList = listCat
          .map((category) => category.nameCategory)
          .sort((a, b) => a.localeCompare(b, 'fr'));
      },

      error: (err) => {
        if (this.categoriesList.length == 0) {
          this.messageError = 'Aucune catégorie trouvée';
        }
      },
    });
  }

  onSubmitNewMaterial() {
    this.materialService.createMaterial(<MaterialForm>this.newMaterialForm.value).subscribe({
      next: () => {
        this.messageSuccess = '';
        this.messageError = 'hh';
        this.isSuccess.set(true);
        this.show.set(true);
      },
      error: (err) => {
        if (!typeof err.error) {
          this.messageError = err.error.message;
        } else if (err.error?.message) {
          this.messageError = err.error.message;
        } else {
          this.messageError = "Erreur d'inscription";
        }
        this.isSuccess.set(false);
        this.show.set(true);
      },
    });
  }
}
