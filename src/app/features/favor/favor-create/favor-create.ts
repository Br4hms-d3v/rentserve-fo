import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiBreadcrumbs, TuiDataListWrapperComponent, TuiSwitch } from '@taiga-ui/kit';
import {
  TuiButton,
  TuiDropdown,
  TuiFilterByInputPipe,
  TuiIcon,
  TuiInputDirective,
  TuiLink,
  TuiNotification,
  TuiNotificationTemplate,
  TuiTextfieldComponent,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { TuiItem } from '@taiga-ui/cdk';
import { FavorService } from '../service/favor-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { CategoryService } from '../../category/service/category-service';
import { FavorForm } from '../model/FavorForm';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-favor-create',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TuiBreadcrumbs,
    TuiItem,
    TuiButton,
    TuiDataListWrapperComponent,
    TuiFilterByInputPipe,
    TuiDropdown,
    TuiInputDirective,
    TuiNotificationTemplate,
    TuiSwitch,
    TuiTextfieldComponent,
    TuiTextfieldOptionsDirective,
    TuiNotification,
    TuiIcon,
    TuiLink,
  ],
  templateUrl: './favor-create.html',
  styleUrl: './favor-create.less',
})
export class FavorCreate implements OnInit {
  private favorService = inject(FavorService); // Service call to create a new favor
  private categoryService = inject(CategoryService); // Service to call list of category
  private themeService = inject(ThemeService); // Call the service to change color theme
  private destroyRef = inject(DestroyRef);

  isDarkMode = false; // Change theme from light to dark
  isSubmitting = false;
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

  protected newFavorForm = new FormGroup({
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    nameFavor: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),

    isAvailable: new FormControl(false, {
      nonNullable: true,
    }),
  });

  ngOnInit() {
    this.getCategories();
    this.changeTheme();
  }

  protected getCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (listCat) => {
          this.categoriesList = listCat
            .map((category) => category.nameCategory)
            .sort((a, b) => a.localeCompare(b, 'fr'));
        },

        error: () => {
          this.categoriesList = [];
          this.messageError = 'Impossible de récupérer la liste des catégories.';
          this.isSuccess.set(false);
          this.show.set(true);
        },
      });
  }

  protected onSubmitNewFavor(): void {
    // Prevent duplicate submissions
    if (this.isSubmitting) {
      return;
    }

    // Validate form
    if (this.newFavorForm.invalid) {
      this.newFavorForm.markAllAsTouched();
      this.messageError = 'Veuillez remplir correctement tous les champs obligatoires.';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    this.isSubmitting = true;
    const favorData = this.newFavorForm.getRawValue() as FavorForm;

    this.favorService
      .createFavor(favorData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageSuccess = 'Votre service a été enregistré avec succès.';
          this.messageError = '';
          this.isSuccess.set(true);
          this.show.set(true);

          this.newFavorForm.reset({
            category: '',
            nameFavor: '',
            isAvailable: false,
          });
          this.isSubmitting = false;
        },

        error: (err) => {
          this.messageError =
            err.error?.message ?? "Une erreur est survenue lors de l'enregistrement du service.";
          this.isSuccess.set(false);
          this.show.set(true);
          this.isSubmitting = false;
        },
      });
  }

  protected changeTheme(): void {
    this.isDarkMode = this.themeService.isDarkMode();

    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
      });
  }
}
