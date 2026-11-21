
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../auth/service/auth-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { MaterialService } from '../service/material-service';
import { MaterialModel } from '../model/Material';

import {
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiIcon,
  TuiInput,
  TuiLabel,
  TuiLink,
  TuiOption,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';

import { TuiCardMedium } from '@taiga-ui/layout';
import { TuiBreadcrumbs, TuiPagination } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiPopout } from '@taiga-ui/experimental';

import { MaterialById } from '../material-by-id/material-by-id';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [
    RouterLink,
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiIcon,
    TuiInput,
    TuiLabel,
    TuiLink,
    TuiOption,
    TuiTextfield,
    TuiTitle,
    TuiCardMedium,
    TuiBreadcrumbs,
    TuiPagination,
    TuiItem,
    TuiPopout,
    MaterialById,
  ],
  templateUrl: './material-list.html',
  styleUrl: './material-list.less',
})
export class MaterialList implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly materialService = inject(MaterialService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Thème clair / sombre
  readonly isDarkMode = signal(false);

  // Utilisateur et autorisations
  role: string | undefined;

  // Liste des matériels
  materialsList: MaterialModel[] = [];
  searchedMaterial: MaterialModel[] = [];

  // Gestion des erreurs
  messageError = '';

  // Menu déroulant et fenêtre de détails
  openMaterialId: number | null = null;
  readonly open = signal(false);

  // Fil d'Ariane
  readonly links = [
    {
      caption: 'Accueil',
      routerLink: '/dashboard',
    },
    {
      caption: 'Matériels',
      routerLink: '/material/all-materials',
    },
  ];

  // Recherche et tri
  sortDescending = false;
  searchMaterial = '';

  // Pagination
  index = 0;
  length = 0;
  size = 40;

  ngOnInit(): void {
    this.currentUser();
    this.getMaterials();
    this.changeTheme();
  }

  /**
   * Charge la liste des matériels.
   */
  protected getMaterials(): void {
    this.materialService.getMaterials().subscribe({
      next: (allMaterials) => {
        this.materialsList = allMaterials.map((material) => ({
          id: material.id,
          nameMaterial: material.nameMaterial,
        }));

        this.messageError = '';
        this.applyFilterAndSort();
        this.cdr.detectChanges();
      },

      error: (error) => {
        this.messageError =
          error?.error?.message ??
          'Une erreur est survenue lors du chargement des matériels.';

        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Filtre la liste en fonction du texte saisi.
   */
  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchMaterial = input.value.toLowerCase().trim();
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
   * Applique la recherche et le tri.
   */
  private applyFilterAndSort(): void {
    this.searchedMaterial = this.materialsList.filter((material) =>
      (material.nameMaterial ?? '')
        .toLowerCase()
        .includes(this.searchMaterial),
    );

    this.searchedMaterial.sort((a, b) => {
      const nameA = (a.nameMaterial ?? '').toLowerCase();
      const nameB = (b.nameMaterial ?? '').toLowerCase();

      return this.sortDescending
        ? nameB.localeCompare(nameA)
        : nameA.localeCompare(nameB);
    });

    this.index = 0;
    this.updatePagination();
  }

  /**
   * Retourne les matériels de la page courante.
   */
  protected get paginatedMaterials(): MaterialModel[] {
    const start = this.index * this.size;

    return this.searchedMaterial.slice(start, start + this.size);
  }

  /**
   * Calcule le nombre de pages.
   */
  protected updatePagination(): void {
    this.length = Math.ceil(
      this.searchedMaterial.length / this.size,
    );
  }

  /**
   * Ouvre ou ferme le menu d'actions d'une carte.
   */
  protected toggleDropdown(id: number): void {
    this.openMaterialId = this.openMaterialId === id ? null : id;
  }

  /**
   * Ouvre la fenêtre de détails d'un matériel.
   */
  protected openDetailPopout(id: number): void {
    this.openMaterialId = id;
    this.open.set(true);
  }

  /**
   * Ferme la fenêtre de détails.
   */
  protected closeDetailPopOut(observer?: { complete: () => void }): void {
    this.open.set(false);

    if (observer) {
      observer.complete();
    }

    this.openMaterialId = null;
  }

  /**
   * Récupère le rôle de l'utilisateur connecté.
   */
  protected currentUser(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.role = user?.role;
    });
  }

  /**
   * Synchronise le thème avec le ThemeService.
   */
  protected changeTheme(): void {
    this.isDarkMode.set(this.themeService.isDarkMode());

    this.themeService.darkMode$.subscribe((mode: boolean) => {
      this.isDarkMode.set(mode);
    });
  }
}
