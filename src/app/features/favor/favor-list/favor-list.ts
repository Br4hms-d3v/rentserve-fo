import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../auth/service/auth-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { FavorService } from '../service/favor-service';
import { FavorModel } from '../model/favor';
import { NgClass } from '@angular/common';
import { TuiBreadcrumbs, TuiPagination } from '@taiga-ui/kit';
import {
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiInput,
  TuiLabel,
  TuiLink,
  TuiOption,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiCardMedium } from '@taiga-ui/layout';
import { TuiPopout } from '@taiga-ui/experimental';

@Component({
  selector: 'app-favor-list',
  imports: [
    NgClass,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    RouterLink,
    TuiTextfield,
    TuiLabel,
    TuiInput,
    TuiButton,
    TuiCardMedium,
    TuiDataList,
    TuiOption,
    TuiPagination,
    TuiPopout,
    TuiTitle,
    TuiDropdown,
  ],
  templateUrl: './favor-list.html',
  styleUrl: './favor-list.less',
})
export class FavorList implements OnInit {
  private readonly _authService = inject(AuthService); // Call the service auth to get the role
  private readonly _themeService = inject(ThemeService); // Call the service theme to change color
  private readonly _favorService = inject(FavorService); // Call the service favor to get a list of all favour
  private readonly _cdr = inject(ChangeDetectorRef); // Detect

  isDarkMode = false; // Change theme from light to dark
  role: string | undefined; // Get a role for display authorization
  favoursList: FavorModel[] = [];
  openFavorId: number | null = null;

  // Breadcrumbs
  protected links = [
    {
      caption: "Page d\'accueil",
      routerLink: '/dashboard',
    },
    {
      caption: 'Liste des services',
    },
  ];

  // Filter
  private sortDescending = false;
  protected searchFavor = '';

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 40;
  searchedFavor: FavorModel[] = [];

  // PopOut
  protected open = signal(false);

  ngOnInit() {
    this.currentUser();
    this.getFavour();
    this.changeTheme();
  }

  currentUser() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.role = user.role;
      }
    });
  }

  protected getFavour() {
    this._favorService.getFavour().subscribe({
      next: (allFavours) => {
        this.favoursList = allFavours.map((favor) => ({
          id: favor.id,
          nameFavor: favor.nameFavor,
        }));

        this.applyFilterAndSort();
        this._cdr.detectChanges();
      },
    });
  }

  applyFilterAndSort() {
    this.searchedFavor = this.favoursList.filter((favor) =>
      favor.nameFavor?.toLowerCase().includes(this.searchFavor),
    );

    this.searchedFavor.sort((a, b) => {
      const nameA = a.nameFavor?.toLowerCase() ?? '';
      const nameB = a.nameFavor?.toLowerCase() ?? '';

      return this.sortDescending ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
    });

    this.index = 0;
    this.updatePagination();
  }

  protected paginatedFavor() {
    const start = this.index * this.size;
    return this.searchedFavor.slice(start, start + this.size);
  }

  protected updatePagination() {
    this.length = Math.ceil(this.searchedFavor.length / this.size);
  }

  protected onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchFavor = input.value.toLowerCase().trim();
    this.applyFilterAndSort();
  }

  protected onSort() {
    this.sortDescending = !this.sortDescending;
    this.applyFilterAndSort();
  }

  openDetailPopout(id: number) {
    this.openFavorId = id;
    this.open.set(true);
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
