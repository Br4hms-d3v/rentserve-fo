import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import {
  TuiTableDirective,
  TuiTablePagination,
  TuiTableTbody,
  TuiTableTd,
  TuiTableTh,
} from '@taiga-ui/addon-table';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/service/auth-service';
import { UserFavorService } from '../../../userFavor/service/user-favor-service';
import { ThemeService } from '../../../../core/services/ThemeService';
import { UserFavorModel } from '../../../userFavor/model/userFavor';

@Component({
  selector: 'app-user-favor-user',
  imports: [
    TuiButton,
    NgOptimizedImage,
    TuiIcon,
    TuiTableDirective,
    TuiTablePagination,
    TuiTableTbody,
    TuiTableTd,
    TuiTableTh,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './user-favor-user.html',
  styleUrl: './user-favor-user.less',
})
export class UserFavorUser implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _userFavorService = inject(UserFavorService);
  private readonly _themeService = inject(ThemeService);
  private readonly _cdr = inject(ChangeDetectorRef);

  isDarkMode = false;
  protected userID!: number;
  userFavorList: UserFavorModel[] = [];
  protected messageSuccess = '';
  protected messageError = '';
  protected nameFavorSearch = '';

  protected page = 0;
  protected size = 5;
  protected total = 0;
  protected sizeOptions = [5, 25, 50];

  ngOnInit(): void {
    this.getUserID();
    this.changeTheme();
  }

  protected getUserID(): void {
    this._authService.currentUser$.subscribe({
      next: (user) => {
        if (user) {
          this.userID = user.id;
          this.getUserFavorById();
        }
      },
    });
  }

  protected getUserFavorById(): void {
    this._userFavorService.getUserFavorByUser(this.userID).subscribe({
      next: (userFavour) => {
        this.userFavorList = userFavour;

        this.total = userFavour.length;
        this.page = 0;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error(
          'Erreur lors de la récupération des services :',
          err.error?.message ?? err.message,
        );

        this.messageError = 'Impossible de récupérer vos services.';
      },
    });
  }

  protected paginatedUserFavorList(): UserFavorModel[] {
    const search = this.nameFavorSearch.trim().toLocaleLowerCase('fr');

    // Filtrage des services par nom.
    const filteredFavour = this.userFavorList.filter((userFavor) =>
      userFavor.nameFavor.nameFavor.toLocaleLowerCase('fr').includes(search),
    );

    // Mise à jour du nombre de résultats.
    this.total = filteredFavour.length;

    // Vérification de la page actuelle.
    const maxPage = Math.max(0, Math.ceil(this.total / this.size) - 1);

    if (this.page > maxPage) {
      this.page = maxPage;
    }

    // Pagination.
    const start = this.page * this.size;

    return filteredFavour.slice(start, start + this.size);
  }

  protected getAvailableCount(): number {
    return this.userFavorList.filter((userFavor) => userFavor.isAvailable === true).length;
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
