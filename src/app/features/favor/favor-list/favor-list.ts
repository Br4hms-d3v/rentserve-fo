import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../auth/service/auth-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { FavorService } from '../service/favor-service';
import { FavorModel } from '../model/favor';

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

import { TuiBreadcrumbs, TuiPagination } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiCardMedium } from '@taiga-ui/layout';
import { TuiPopout } from '@taiga-ui/experimental';

import { FavorById } from '../favor-by-id/favor-by-id';

@Component({
  selector: 'app-favor-list',
  standalone: true,
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
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
    FavorById,
  ],
  templateUrl: './favor-list.html',
  styleUrl: './favor-list.less',
})
export class FavorList implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly favorService = inject(FavorService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  // Thème
  readonly isDarkMode = signal(false);

  // Utilisateur et autorisations
  role: string | undefined;

  // Données
  favoursList: FavorModel[] = [];
  searchedFavor: FavorModel[] = [];

  // Erreurs
  protected messageError = '';

  // Fenêtre de détails
  readonly open = signal(false);
  openFavorId: number | null = null;

  // Menu déroulant
  openDropdownFavorId: number | null = null;

  // Fil d'Ariane
  protected readonly links = [
    {
      caption: 'Accueil',
      routerLink: '/dashboard',
    },
    {
      caption: 'Services',
      routerLink: '/favor/all-favors',
    },
  ];

  // Recherche et tri
  protected sortDescending = false;
  protected searchFavor = '';

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 40;

  ngOnInit(): void {
    this.currentUser();
    this.getFavour();
    this.changeTheme();
  }

  /**
   * Récupère le rôle de l'utilisateur connecté.
   */
  protected currentUser(): void {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      this.role = user?.role;
    });
  }

  /**
   * Charge les services.
   */
  protected getFavour(): void {
    this.favorService.getFavour().subscribe({
      next: (allFavours) => {
        this.favoursList = allFavours.map((favor) => ({
          id: favor.id,
          nameFavor: favor.nameFavor,
        }));

        this.messageError = '';
        this.applyFilterAndSort();
        this.cdr.detectChanges();
      },

      error: (error) => {
        this.messageError =
          error?.error?.message ?? 'Une erreur est survenue lors du chargement des services.';

        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Recherche les services par nom.
   */
  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchFavor = input.value.toLowerCase().trim();
    this.applyFilterAndSort();
  }

  /**
   * Inverse le sens du tri alphabétique.
   */
  protected onSort(): void {
    this.sortDescending = !this.sortDescending;
    this.applyFilterAndSort();
  }

  /**
   * Applique le filtre et le tri.
   */
  private applyFilterAndSort(): void {
    this.searchedFavor = this.favoursList.filter((favor) =>
      (favor.nameFavor ?? '').toLowerCase().includes(this.searchFavor),
    );

    this.searchedFavor.sort((a, b) => {
      const nameA = (a.nameFavor ?? '').toLowerCase();
      const nameB = (b.nameFavor ?? '').toLowerCase();

      return this.sortDescending ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
    });

    this.index = 0;
    this.updatePagination();
  }

  /**
   * Retourne les services de la page courante.
   */
  protected paginatedFavor(): FavorModel[] {
    const start = this.index * this.size;

    return this.searchedFavor.slice(start, start + this.size);
  }

  /**
   * Actualise le nombre de pages.
   */
  protected updatePagination(): void {
    this.length = Math.ceil(this.searchedFavor.length / this.size);
  }

  /**
   * Ouvre ou ferme le menu d'un service.
   */
  protected toggleDropdown(id: number): void {
    this.openDropdownFavorId = this.openDropdownFavorId === id ? null : id;
  }

  /**
   * Affiche les détails d'un service.
   */
  protected openDetailPopout(id: number): void {
    this.openDropdownFavorId = null;
    this.openFavorId = id;
    this.open.set(true);
  }

  /**
   * Ferme la fenêtre de détails.
   */
  protected closeDetailPopOut(): void {
    this.open.set(false);
    this.openFavorId = null;
  }

  /**
   * Synchronise le thème de l'application.
   */
  protected changeTheme(): void {
    this.isDarkMode.set(this.themeService.isDarkMode());

    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode.set(mode);
      });
  }
}
