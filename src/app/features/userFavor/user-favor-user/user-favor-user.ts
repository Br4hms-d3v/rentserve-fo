import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiStatus } from '@taiga-ui/kit';
import {
  TuiTableDirective,
  TuiTablePagination,
  TuiTableTbody,
  TuiTableTd,
  TuiTableTh,
} from '@taiga-ui/addon-table';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/service/auth-service';
import { UserFavorService } from '../service/user-favor-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserFavorModel } from '../model/userFavor';

@Component({
  selector: 'app-user-favor-user',
  imports: [
    NgClass,
    TuiButton,
    NgOptimizedImage,
    ReactiveFormsModule,
    TuiIcon,
    TuiStatus,
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
  private readonly _authService = inject(AuthService); // Get the id from user connected
  private readonly _userFavorService = inject(UserFavorService); // Get all favour from user ID
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _cdr = inject(ChangeDetectorRef);

  isDarkMode = false; // Change theme from light to dark
  protected userID!: number;
  userFavorList: UserFavorModel[] = [];

  // Search
  protected showNameFavorSearch = false;
  protected nameFavorSearch = '';
  // Pagination
  protected page = 0;
  protected size = 5;
  protected total = 0;
  protected sizeOptions = [5, 25, 50];

  ngOnInit() {
    this.getUserID();
    this.changeTheme();
  }

  protected getUserID() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userID = user.id;
        this.getUserFavorById();
      }
    });
  }

  protected getUserFavorById() {
    this._userFavorService.getUserFavorByUser(this.userID).subscribe({
      next: (userFavour) => {
        this.userFavorList = userFavour;
        this.total = userFavour.length;
        this._cdr.detectChanges();
        // console.log(this.userFavorList);
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }

  protected paginatedUserFavorList(): UserFavorModel[] {
    const search = this.nameFavorSearch.trim().toLowerCase();

    const filteredFavour = this.userFavorList.filter((userFavor) =>
      userFavor.nameFavor.nameFavor.toLowerCase().includes(search),
    );

    this.total = filteredFavour.length;
    const start = this.page * this.size;
    return filteredFavour.slice(start, start + this.size);
  }

  protected NameFavorSearch() {
    this.showNameFavorSearch = !this.showNameFavorSearch;

    if (!this.showNameFavorSearch) {
      this.nameFavorSearch = '';
    }

    this.page = 0;
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
