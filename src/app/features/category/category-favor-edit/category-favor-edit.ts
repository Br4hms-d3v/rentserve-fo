import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import {
  TuiButton,
  TuiInputDirective,
  TuiLabel,
  TuiLink,
  TuiNotificationTemplate,
  TuiTextfieldComponent,
} from '@taiga-ui/core';
import { TuiItem } from '@taiga-ui/cdk';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../service/category-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { CategoryDetailModel } from '../model/categoryDetail';
import { CategoryForm } from '../model/category-form';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-category-favor-edit',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TuiBreadcrumbs,
    TuiButton,
    TuiInputDirective,
    TuiLabel,
    TuiLink,
    TuiNotificationTemplate,
    TuiTextfieldComponent,
    TuiItem,
    RouterLink,
    NgClass,
  ],
  templateUrl: './category-favor-edit.html',
  styleUrl: './category-favor-edit.less',
})
export class CategoryFavorEdit implements OnInit {
  private readonly _categoryService = inject(CategoryService); // Call the service to get the id of category and update the category
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _router = inject(Router); // Tool to navigate
  private themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error

  categoryId!: number;
  categoryModel!: CategoryDetailModel;
  title = 'Modifier la catégorie';
  protected messageError = '';
  protected messageSuccess = '';

  // Breadcrumbs
  protected links = [
    {
      caption: "Page d\'accueil",
      routerLink: '/dashboard',
    },
    {
      caption: 'Modification catégorie',
    },
  ];

  ngOnInit() {
    this.getRoute();
    this.getCategory();
    this.changeTheme();
  }

  protected editCategoryFavorForm = new FormGroup({
    nameCategory: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
  });

  getRoute() {
    this._route.params.subscribe((params) => {
      this.categoryId = params['id'];
      // console.log(this.categoryId);
    });
  }

  protected getCategory() {
    this._categoryService.getCategory(this.categoryId).subscribe({
      next: (categoryName) => {
        this.categoryModel = categoryName;

        this.editCategoryFavorForm.get('nameCategory')?.patchValue(this.categoryModel.nameCategory);
      },
      error: () => {
        this.messageError = 'Impossible de récupérer les informations de la catégorie.';

        this.messageSuccess = '';
        this.isSuccess.set(false);
        this.show.set(true);
      },
    });
  }

  protected onSubmitEditCategoryFavor() {
    this.editCategoryFavorForm.markAllAsTouched();

    if (this.editCategoryFavorForm.invalid) {
      this.messageError = 'Veuillez renseigner le nom de la catégorie.';

      this.messageSuccess = '';
      this.isSuccess.set(false);
      this.show.set(true);

      return;
    }

    const categoryData: CategoryForm = {
      nameCategory: this.editCategoryFavorForm.controls.nameCategory.value.trim(),
    };

    this._categoryService.editCategory(this.categoryId, categoryData).subscribe({
      next: (nameCategoryData) => {
        this.editCategoryFavorForm.patchValue(nameCategoryData);

        this.messageSuccess = 'La catégorie a été modifiée avec succès.';

        this.messageError = '';
        this.isSuccess.set(true);
        this.show.set(true);

        setTimeout(() => {
          this._router.navigate(['/dashboard']);
        }, 2000);
      },

      error: (error: { error?: { message?: string } }) => {
        this.messageError =
          error.error?.message ??
          'Une erreur est survenue lors de la modification de la catégorie.';

        this.messageSuccess = '';
        this.isSuccess.set(false);
        this.show.set(true);
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this.themeService.isDarkMode(); // Get current theme
    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
