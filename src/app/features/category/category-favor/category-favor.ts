import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TuiButton, TuiDialog, TuiInput, TuiTextfield } from '@taiga-ui/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiPagination } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';

import { CategoryModel } from '../model/Category';
import { AuthService } from '../../auth/service/auth-service';
import { CategoryService } from '../service/category-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { CategoryDelete } from '../category-delete/category-delete';

@Component({
  selector: 'app-category-favor',
  imports: [
    TuiInput,
    TuiTable,
    TuiTextfield,
    TuiButton,
    TuiPagination,
    RouterLink,
    CategoryDelete,
    TuiDialog,
  ],
  templateUrl: './category-favor.html',
  styleUrl: './category-favor.less',
})
export class CategoryFavor implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  isDarkMode = false;
  role: string | undefined;
  protected messageError = '';

  categoriesFavour: CategoryModel[] = [];

  // Filtrage
  searchTerm = '';
  filteredCategoriesFavour: CategoryModel[] = [];

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 10;

  // Dialogue de suppression
  protected open = signal<boolean>(false);
  protected selectId!: number;

  constructor(
    private readonly _authService: AuthService,
    private readonly _categoryService: CategoryService,
    private readonly themeService: ThemeService,
    private readonly _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this._authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      if (user) {
        this.role = user.role;
      }
    });

    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
      });
  }

  protected loadCategories(): void {
    this._categoryService
      .getCategoriesFavor()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categoriesFav) => {
          this.categoriesFavour = categoriesFav.map((category, index) => ({
            position: index + 1,
            id: category.id,
            nameCategory: category.nameCategory,
          }));

          this.filteredCategoriesFavour = [...this.categoriesFavour];
          this.index = 0;
          this.updatePagination();

          this._cdr.detectChanges();
        },

        error: (error) => {
          this.messageError =
            error?.error?.message ?? 'Erreur lors du chargement des catégories de services';
        },
      });
  }

  protected onFilter(categoryWord: Event): void {
    const input = categoryWord.target as HTMLInputElement;

    this.searchTerm = input.value.toLowerCase().trim();

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

  protected updatePagination(): void {
    this.length = Math.ceil(this.filteredCategoriesFavour.length / this.size);
  }

  protected openDialogDelete(id: number): void {
    this.selectId = id;
    this.open.set(true);
  }

  protected onDelete(): void {
    this.open.set(false);
    this.loadCategories();
  }
}
