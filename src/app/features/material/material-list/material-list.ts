import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { MaterialService } from '../service/material-service';
import { MaterialModel } from '../model/Material';
import {
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiIcon,
  TuiOption,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiCardMedium } from '@taiga-ui/layout';
import { TuiPagination } from '@taiga-ui/kit';

@Component({
  selector: 'app-material-list',
  imports: [
    TuiTextfield,
    TuiIcon,
    TuiButton,
    TuiCardMedium,
    TuiTitle,
    TuiDropdown,
    TuiDataList,
    TuiOption,
    TuiPagination,
  ],
  templateUrl: './material-list.html',
  styleUrl: './material-list.less',
})
export class MaterialList implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _themeService = inject(ThemeService);
  private readonly _materialService = inject(MaterialService);
  private readonly _cdr = inject(ChangeDetectorRef);

  materialsList: MaterialModel[] = [];
  protected messageError = '';
  private sortDescending = false;

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 40;

  ngOnInit() {
    this.getMaterials();
  }

  protected getMaterials() {
    this._materialService.getMaterials().subscribe({
      next: (allMaterials) => {
        const mappedMaterials = allMaterials.map((material) => ({
          id: material.id,
          nameMaterial: material.nameMaterial,
        }));

        this.materialsList = mappedMaterials;
        this.length = Math.ceil(this.materialsList.length / this.size);

        this._cdr.detectChanges();
      },

      error: (error) => {
        if (this.materialsList.length === 0) {
          this.messageError = 'la liste des matériaux est vide';
        }

        this.messageError = error?.error?.message ?? 'Erreur lors du chargement des matériaux';
      },
    });
  }

  onSort() {
    this.sortDescending = !this.sortDescending;
    this.materialsList.sort((a, b) => {
      const nameA = a.nameMaterial?.toLowerCase() ?? '';
      const nameB = b.nameMaterial?.toLowerCase() ?? '';

      return this.sortDescending ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
    });

    this.index = 0;
    this._cdr.detectChanges();
  }

  protected get paginatedMaterials(): MaterialModel[] {
    const start = this.index * this.size;
    return this.materialsList.slice(start, start + this.size);
  }
}
