import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TuiBreadcrumbs, TuiPagination } from '@taiga-ui/kit';
import {
  TuiButton,
  TuiDataListComponent,
  TuiDropdown,
  TuiInputDirective,
  TuiLabel,
  TuiLink,
  TuiOption,
  TuiTextfieldComponent,
  TuiTitle,
} from '@taiga-ui/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiItem } from '@taiga-ui/cdk';
import { MaterialService } from '../service/material-service';
import { AuthService } from '../../auth/service/auth-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { MaterialModel } from '../model/Material';
import { MaterialById } from '../material-by-id/material-by-id';
import { TuiCardMedium } from '@taiga-ui/layout';
import { TuiPopout } from '@taiga-ui/experimental';

@Component({
  selector: 'app-material-list-by-category',
  imports: [
    TuiBreadcrumbs,
    TuiLink,
    NgClass,
    RouterLink,
    TuiItem,
    MaterialById,
    TuiButton,
    TuiCardMedium,
    TuiDataListComponent,
    TuiInputDirective,
    TuiLabel,
    TuiOption,
    TuiPagination,
    TuiPopout,
    TuiTextfieldComponent,
    TuiTitle,
    TuiDropdown,
  ],
  templateUrl: './material-list-by-category.html',
  styleUrl: './material-list-by-category.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialListByCategory implements OnInit {
  private readonly _authService = inject(AuthService); // Call the service to get the role
  private readonly _materialService = inject(MaterialService); // Call the service to get a list of materials by category
  private readonly _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _cdr = inject(ChangeDetectorRef); // Check if something change on the page
  private readonly _route = inject(ActivatedRoute); // Get the name of Category (by url)s

  isDarkMode = false; // Change theme from light to dark
  role: string | undefined; // Get a role for display authorization
  categorySelected!: string;
  protected open = signal(false);
  materialsList: MaterialModel[] = [];
  protected messageError = '';
  openMaterialId: number | null = null;

  // Breadcrumbs
  protected links = [
    {
      caption: "Page d\'accueil",
      routerLink: '/dashboard',
    },
    {
      caption: 'Liste materiels',
    },
  ];

  // Filter
  protected sortDescending = false;
  protected searchMaterial = '';

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 40;
  searchedMaterial: MaterialModel[] = [];

  ngOnInit() {
    this.getRoute();
    this.currentUser();
    this.getMaterialsByNameOfCategory();
    this.changeTheme();
  }

  getRoute() {
    this._route.params.subscribe((params) => {
      this.categorySelected = params['nameCategory'];
      // console.log(this.categorySelected);
    });
  }

  currentUser() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.role = user.role;
      }
    });
  }

  protected getMaterialsByNameOfCategory() {
    this._materialService.getListMaterialsByNameCategory(this.categorySelected).subscribe({
      next: (allMaterialsByCategory) => {
        this.materialsList = allMaterialsByCategory.map((material) => ({
          id: material.id,
          nameMaterial: material.nameMaterial,
        }));

        this.applyFilterAndSort();
        this._cdr.detectChanges();
      },

      error: (error) => {
        if (this.materialsList.length === 0) {
          this.messageError = 'La liste des matériaux est vide';
        }

        this.messageError = error?.error?.message ?? 'Erreur lors du chargement des matériaux';
      },
    });
  }

  private applyFilterAndSort() {
    this.searchedMaterial = this.materialsList.filter((material) =>
      material.nameMaterial?.toLowerCase().includes(this.searchMaterial),
    );

    this.searchedMaterial.sort((a, b) => {
      const nameA = a.nameMaterial?.toLowerCase() ?? '';
      const nameB = b.nameMaterial?.toLowerCase() ?? '';

      return this.sortDescending ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
    });

    this.index = 0;
    this.updatePagination();
  }

  protected updatePagination() {
    this.length = Math.ceil(this.searchedMaterial.length / this.size);
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }

  protected onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchMaterial = input.value.toLowerCase().trim();
    this.applyFilterAndSort();
  }

  protected onSort() {
    this.sortDescending = !this.sortDescending;
    this.applyFilterAndSort();
  }

  protected get paginatedMaterials(): MaterialModel[] {
    const start = this.index * this.size;
    return this.searchedMaterial.slice(start, start + this.size);
  }

  openDetailPopout(id: number) {
    this.openMaterialId = null;
    this.openMaterialId = id;
    this.open.set(true);
  }

  closeDetailPopOut() {
    this.open.set(false);
    this.openMaterialId = null;
  }

  toggleDropdown(id: number) {
    this.openMaterialId = this.openMaterialId === id ? null : id;
  }
}
