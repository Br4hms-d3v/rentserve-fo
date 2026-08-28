import { Component, OnInit } from '@angular/core';
import { TuiButton, TuiInput, TuiTextfield } from '@taiga-ui/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiPagination } from '@taiga-ui/kit';
import { CategoryService } from '../service/category-service';
import { AuthService } from '../../auth/service/auth-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { CategoryModel } from '../model/Category';

@Component({
  selector: 'app-category-material',
  imports: [TuiInput, TuiTable, TuiTextfield, TuiButton, TuiPagination],
  templateUrl: './category-material.html',
  styleUrl: './category-material.less',
})
export class CategoryMaterial implements OnInit {
  isDarkMode = false; // Get a false for change theme
  role: string | undefined; // Get the role to display some infos
  protected messageError = '';
  categoriesMaterials: CategoryModel[] = [];

  //Filter
  searchTerm = '';
  filteredCategoriesMaterials: CategoryModel[] = [];

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 10;

  constructor(
    private readonly _authService: AuthService,
    private readonly _categoryService: CategoryService,
    private themeService: ThemeService,
  ) {}

  ngOnInit() {
    this.loadCategories();

    this._authService._currentUser.subscribe((user) => {
      if (user) {
        this.role = user.role;
      }
    });

    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }

  protected loadCategories() {
    this._categoryService.getCategoriesMaterial().subscribe({
      next: (categoriesMat) => {
        this.categoriesMaterials = categoriesMat.map((category, index) => ({
          position: index + 1,
          id: category.id,
          nameCategory: category.nameCategory,
        }));

        // All categories are in this table filter
        this.filteredCategoriesMaterials = [...this.categoriesMaterials];
        this.updatePagination();

        // Calculate the length for the size of table
        this.length = Math.ceil(this.categoriesMaterials.length / this.size);
      },

      error: (error) => {
        if (this.categoriesMaterials.length == 0) {
          this.messageError = 'La liste est vide';
        }
        this.messageError = error?.error?.message ?? 'Erreur lors du chargement des catégories';
      },
    });
  }

  protected onFilter(categoryWord: Event) {
    // Take the value from the input $event
    const input = categoryWord.target as HTMLInputElement;
    // Change the word to lowerCase and delete the space
    this.searchTerm = input.value.toLowerCase().trim();

    // Make a new list for category and check if the word exist
    this.filteredCategoriesMaterials = this.categoriesMaterials.filter((category) =>
      category.nameCategory?.toLowerCase().includes(this.searchTerm),
    );

    this.index = 0;
    this.updatePagination();
  }

  protected get paginatedCategoriesMaterials(): CategoryModel[] {
    const start = this.index * this.size;
    return this.filteredCategoriesMaterials.slice(start, start + this.size);
  }

  // Change the size of pagination
  updatePagination() {
    this.length = Math.ceil(this.filteredCategoriesMaterials.length / this.size);
  }
}
