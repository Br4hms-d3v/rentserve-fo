import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/service/auth-service';
import { UserMaterialService } from '../../../userMaterial/service/user-material-service';
import { UserMaterialModel } from '../../../userMaterial/model/userMaterial';
import { TuiTable, TuiTablePagination } from '@taiga-ui/addon-table';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../core/services/ThemeService';

@Component({
  selector: 'app-user-material-user',
  imports: [
    TuiTable,
    TuiButton,
    NgOptimizedImage,
    TuiTablePagination,
    FormsModule,
    TuiIcon,
    RouterLink,
  ],
  templateUrl: './user-material-user.html',
  styleUrl: './user-material-user.less',
})
export class UserMaterialUser implements OnInit {
  private readonly _authService = inject(AuthService); // Get the id from user connected
  private readonly _userMaterialService = inject(UserMaterialService); // Get all materials from user ID
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _cdr = inject(ChangeDetectorRef);

  isDarkMode = false; // Change theme from light to dark
  protected userId!: number;
  userMaterialList: UserMaterialModel[] = [];
  protected messageSuccess = '';
  protected messageError = '';

  // Search
  protected nameMaterialSearch = '';

  // Pagination
  protected page = 0;
  protected size = 5;
  protected total = 0;
  protected sizeOptions = [5, 25, 50];

  ngOnInit() {
    this.getIdUser();
    this.changeTheme();
  }

  protected getIdUser(): void {
    this._authService.currentUser$.subscribe({
      next: (user) => {
        if (user) {
          this.userId = user.id;
          this.getUserMaterialById();
        }
      },
    });
  }

  protected getUserMaterialById(): void {
    this._userMaterialService.getUserMaterialByUser(this.userId).subscribe({
      next: (userMaterials) => {
        this.userMaterialList = userMaterials;

        this.total = userMaterials.length;
        this.page = 0;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error(
          'Erreur lors de la récupération des matériels :',
          err.error?.message ?? err.message,
        );

        this.messageError = 'Impossible de récupérer vos matériels.';
      },
    });
  }

  protected paginatedUserMaterialList(): UserMaterialModel[] {
    const search = this.nameMaterialSearch.trim().toLocaleLowerCase('fr');

    const filteredMaterials = this.userMaterialList.filter((userMaterial) =>
      userMaterial.nameMaterial.nameMaterial.toLocaleLowerCase('fr').includes(search),
    );

    // Mise à jour du nombre de résultats.
    this.total = filteredMaterials.length;

    // Sécurité si le nombre de résultats diminue.
    const maxPage = Math.max(0, Math.ceil(this.total / this.size) - 1);

    if (this.page > maxPage) {
      this.page = maxPage;
    }

    const start = this.page * this.size;

    return filteredMaterials.slice(start, start + this.size);
  }

  protected getAvailableCount(): number {
    return this.userMaterialList.filter((material) => material.isAvailable === true).length;
  }

  protected changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode();

    this._themeService.darkMode$.subscribe({
      next: (mode: boolean) => {
        this.isDarkMode = mode;
        this._cdr.markForCheck();
      },
    });
  }
}
