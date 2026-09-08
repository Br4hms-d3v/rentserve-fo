import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiBreadcrumbs, TuiDataListWrapperComponent, TuiSwitch } from '@taiga-ui/kit';
import {
  TuiButton,
  TuiDropdown,
  TuiFilterByInputPipe,
  TuiInputDirective,
  TuiLabel,
  TuiNotification,
  TuiNotificationTemplate,
  TuiTextfieldComponent,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { TuiItem } from '@taiga-ui/cdk';
import { FavorService } from '../service/favor-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { CategoryService } from '../../category/service/category-service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavorForm } from '../model/FavorForm';

@Component({
  selector: 'app-favor-create',
  imports: [
    NgClass,
    ReactiveFormsModule,
    RouterLink,
    TuiBreadcrumbs,
    TuiItem,
    TuiButton,
    TuiDataListWrapperComponent,
    TuiFilterByInputPipe,
    TuiDropdown,
    TuiInputDirective,
    TuiLabel,
    TuiNotificationTemplate,
    TuiSwitch,
    TuiTextfieldComponent,
    TuiTextfieldOptionsDirective,
    TuiNotification,
  ],
  templateUrl: './favor-create.html',
  styleUrl: './favor-create.less',
})
export class FavorCreate implements OnInit {
  private favorService = inject(FavorService); // Service call to create a new favor
  private _categoryService = inject(CategoryService); // Service to call list of category
  private themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
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
      caption: 'Liste des services',
      routerLink: '/favor/all-favour',
    },
    {
      caption: 'Création du service',
    },
  ];

  ngOnInit() {
    this.getCategories();
    this.changeTheme();
  }

  protected newFavorForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    nameFavor: new FormControl('', [Validators.required]),
    isAvailable: new FormControl<boolean>(false, [Validators.required]),
  });

  protected getCategories() {
    this._categoryService.getCategories().subscribe({
      next: (listCat) => {
        this.categoriesList = listCat
          .map((category) => category.nameCategory)
          .sort((a, b) => a.localeCompare(b, 'fr'));
      },

      error: () => {
        if (this.categoriesList.length == 0) {
          this.messageError = 'Aucune catégorie trouvée';
        }
      },
    });
  }

  onSubmitNewFavor() {
    if (this.newFavorForm.invalid) {
      this.messageSuccess = 'Le formulaire ne dois pas être vide';
      this.isSuccess.set(false);
      this.show.set(true);
    }

    this.favorService.createFavor(<FavorForm>this.newFavorForm.value).subscribe({
      next: () => {
        this.messageSuccess = 'Votre service a bien été sauvegardé';
        this.isSuccess.set(true);
        this.show.set(true);
      },

      error: (err) => {
        this.messageError = err.error?.message ?? "Erreur lors de l'enregistrement du service";
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this.themeService.isDarkMode(); // Get current theme
    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
