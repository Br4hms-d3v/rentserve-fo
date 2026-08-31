import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../auth/service/auth-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { MaterialService } from '../service/material-service';
import { MaterialModel } from '../model/Material';
import {
  TuiButton,
  TuiDataList,
  TuiDialogService,
  TuiDropdown,
  TuiOption,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiCardMedium } from '@taiga-ui/layout';
import { TuiPagination } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { TuiPopout } from '@taiga-ui/experimental';
import { MaterialById } from '../material-by-id/material-by-id';

@Component({
  selector: 'app-material-list',
  imports: [
    RouterLink,
    TuiTextfield,
    TuiButton,
    TuiCardMedium,
    TuiTitle,
    TuiDropdown,
    TuiDataList,
    TuiOption,
    TuiPagination,
    TuiPopout,
    MaterialById,
  ],
  templateUrl: './material-list.html',
  styleUrl: './material-list.less',
})
export class MaterialList implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _themeService = inject(ThemeService);
  private readonly _materialService = inject(MaterialService);
  private readonly _cdr = inject(ChangeDetectorRef);

  role: string | undefined;
  materialsList: MaterialModel[] = [];
  protected messageError = '';
  openMaterialId: number | null = null;
  private readonly dialog = inject(TuiDialogService);

  // Filter
  private sortDescending = false;
  protected searchMaterial = '';

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 40;
  searchedMaterial: MaterialModel[] = [];

  ngOnInit() {
    this.currentUser();
    this.getMaterials();
  }

  protected getMaterials() {
    this._materialService.getMaterials().subscribe({
      next: (allMaterials) => {
        this.materialsList = allMaterials.map((material) => ({
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

  protected onSort() {
    this.sortDescending = !this.sortDescending;
    this.applyFilterAndSort();
  }

  protected onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchMaterial = input.value.toLowerCase().trim();
    this.applyFilterAndSort();
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

  protected get paginatedMaterials(): MaterialModel[] {
    const start = this.index * this.size;
    return this.searchedMaterial.slice(start, start + this.size);
  }

  protected updatePagination() {
    this.length = Math.ceil(this.searchedMaterial.length / this.size);
  }

  protected readonly open = signal(false);

  openDetailPopout(id: number): void {
    this.openMaterialId = id;
    this.open.set(true);
  }

  currentUser() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.role = user.role;
      }
    });
  }
}
