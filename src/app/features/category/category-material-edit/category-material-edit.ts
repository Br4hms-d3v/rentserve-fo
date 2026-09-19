import { Component, inject, OnInit, signal } from '@angular/core';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';
import {
  TuiButton,
  TuiInput,
  TuiLink,
  TuiNotificationTemplate,
  TuiTextfield,
} from '@taiga-ui/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../service/category-service';
import { CategoryDetailModel } from '../model/categoryDetail';
import { ThemeService } from '../../../core/services/ThemeService';
import { CategoryForm } from '../model/category-form';

@Component({
  selector: 'app-category-material-edit',
  imports: [
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    RouterLink,
    NgClass,
    ReactiveFormsModule,
    TuiTextfield,
    TuiInput,
    TuiButton,
    TuiNotificationTemplate,
  ],
  templateUrl: './category-material-edit.html',
  styleUrl: './category-material-edit.less',
})
export class CategoryMaterialEdit implements OnInit {
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _categoryService = inject(CategoryService); // Call the service to get the id of category and update the category
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

  protected editCategoryForm = new FormGroup({
    nameCategory: new FormControl('', Validators.required),
  });

  getRoute() {
    this._route.params.subscribe((params) => {
      this.categoryId = params['id'];
      // console.log(this.categoryId);
    });
  }

  getCategory() {
    this._categoryService.getCategory(this.categoryId).subscribe({
      next: (categoryName) => {
        this.categoryModel = categoryName;
        this.editCategoryForm.get('nameCategory')?.patchValue(this.categoryModel.nameCategory);
      },
    });
  }

  onSubmitEditCategory() {
    this.editCategoryForm.markAllAsTouched();
    if (this.editCategoryForm.invalid) {
      this.messageError = 'Le formulaire est invalide';
      this.isSuccess.set(false);
      this.show.set(true);
    }

    this._categoryService
      .editCategory(this.categoryId, <CategoryForm>this.editCategoryForm.value)
      .subscribe({
        next: (nameCategoryData) => {
          this.editCategoryForm.patchValue(nameCategoryData);
          this.messageSuccess = 'La mise à jour a été effectué avec succès.';
          this.isSuccess.set(true);
          this.show.set(true);

          setTimeout(() => {
            this._router.navigate(['/dashboard']);
          }, 2000);
        },
        error: (error) => {
          if (!typeof error.error) {
            this.messageError = error.error.message;
            this.isSuccess.set(false);
            this.show.set(true);
          } else if (error.error?.message) {
            this.messageError = error.error.message;
            this.isSuccess.set(false);
            this.show.set(true);
          } else {
            this.messageError = 'Erreur lors de la mise à jour de la catégorie';
            this.isSuccess.set(false);
            this.show.set(true);
          }
        },
      });
  }

  changeTheme() {
    this.isDarkMode = this.themeService.isDarkMode(); // Get current theme
    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
