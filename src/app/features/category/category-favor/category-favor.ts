import { Component, OnInit } from '@angular/core';
import { CategoryModel } from '../model/Category';
import { AuthService } from '../../auth/service/auth-service';
import { CategoryService } from '../service/category-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { TuiButton, TuiInput, TuiTextfield } from '@taiga-ui/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiPagination } from '@taiga-ui/kit';

@Component({
  selector: 'app-category-favor',
  imports: [TuiInput, TuiTable, TuiTextfield, TuiButton, TuiPagination],
  templateUrl: './category-favor.html',
  styleUrl: './category-favor.less',
})
export class CategoryFavor implements OnInit {
  isDarkMode = false;
  role: string | undefined;
  protected messageError = '';
  categoriesFavour: CategoryModel[] = [];

  //Filter
  searchTerm = '';
  filteredCategoriesFavour: CategoryModel[] = [];

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 10;

  constructor(
    private _authService: AuthService,
    private _categoryService: CategoryService,
    private _themeService: ThemeService,
  ) {}

  ngOnInit() {
    this.loadCategories();

    this._authService._currentUser.subscribe((user) => {
      if (user) {
        this.role = user.role;
      }
    });
  }

  protected loadCategories() {
    this._categoryService.getCategoriesFavor().subscribe({
      next: (categoriesFav) => {
        this.categoriesFavour = categoriesFav.map((category, index) => ({
          position: index + 1,
          id: category.id,
          nameCategory: category.nameCategory,
        }));

        // All categories are in this table filter
        this.filteredCategoriesFavour = [...this.categoriesFavour];
        this.updatePagination();

        // Calculate the length for the size of table
        this.length = Math.ceil(this.categoriesFavour.length / this.size);
      },

      error: (error) => {
        if (this.categoriesFavour.length == 0) {
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
    this.filteredCategoriesFavour = this.categoriesFavour.filter((category) =>
      category.nameCategory?.toLowerCase().includes(this.searchTerm),
    );

    this.index = 0;
    this.updatePagination();
  }

  protected get paginatedCategoriesFavours(): CategoryModel[] {
    const start = this.index * this.size;
    return this.filteredCategoriesFavour.slice(start, start + this.size);
  }

  // Change the size of pagination
  updatePagination() {
    this.length = Math.ceil(this.filteredCategoriesFavour.length / this.size);
  }
}
