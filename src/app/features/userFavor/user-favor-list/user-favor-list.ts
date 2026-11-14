import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserFavorService } from '../service/user-favor-service';
import { UserFavorModel } from '../model/userFavor';
import { TuiBreadcrumbs, TuiPagination } from '@taiga-ui/kit';
import { TuiButton, TuiIcon, TuiLink } from '@taiga-ui/core';
import { TuiItem } from '@taiga-ui/cdk';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-user-favor-list',
  imports: [
    RouterLink,
    TuiButton,
    TuiBreadcrumbs,
    TuiLink,
    TuiPagination,
    TuiItem,
    TuiIcon,
    DecimalPipe,
  ],
  templateUrl: './user-favor-list.html',
  styleUrl: './user-favor-list.less',
})
export class UserFavorList implements OnInit {
  private readonly _userFavorService = inject(UserFavorService); // Call the service to display a list of user favor by the name favor
  private readonly _route = inject(ActivatedRoute); // Get the id of the favor (by url)s
  private readonly _themeService = inject(ThemeService); // Call the service to change color
  private readonly _cdr = inject(ChangeDetectorRef);

  readonly isDarkMode = signal(false); // Change theme from light to dark
  nameFavor!: string;
  protected userFavourByFavor: UserFavorModel[] = [];
  protected sortDescending = false;
  messageError = '';

  // Breadcrumbs
  protected links = [
    {
      caption: "Page d\'accueil",
      routerLink: '/dashboard',
    },
    {
      caption: 'Service',
      routerLink: '/favor/all-favour',
    },
    {
      caption: 'list de services',
    },
  ];

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 32;

  ngOnInit(): void {
    this.nameFavor = String(this._route.snapshot.paramMap.get('nameFavor'));

    this.getUserFavorByFavor();

    this.changeTheme();
  }

  protected getUserFavorByFavor(): void {
    this._userFavorService.getUserFavorByFavor(this.nameFavor).subscribe({
      next: (userFavourList) => {
        this.userFavourByFavor = userFavourList ?? [];
        this.messageError = '';
        this.index = 0;
        this.updatePagination();
        this._cdr.detectChanges();
      },

      error: () => {
        this.userFavourByFavor = [];
        this.messageError = 'Impossible de charger les services. Veuillez réessayer.';
        this.length = 0;
        this.index = 0;
        this._cdr.detectChanges();
      },
    });
  }

  protected get searchedUserFavour(): UserFavorModel[] {
    return [...this.userFavourByFavor].sort((a, b) => {
      const comparison = Number(a.priceHourFavor) - Number(b.priceHourFavor);
      return this.sortDescending ? -comparison : comparison;
    });
  }

  protected paginatedUserFavour(): UserFavorModel[] {
    const start = this.index * this.size;
    return this.searchedUserFavour.slice(start, start + this.size);
  }

  protected onSort(): void {
    this.sortDescending = !this.sortDescending;
    this.index = 0;
    this.updatePagination();
  }

  private updatePagination(): void {
    this.length = Math.ceil(this.searchedUserFavour.length / this.size);
  }

  protected changeTheme(): void {
    this.isDarkMode.set(this._themeService.isDarkMode());
    this._themeService.darkMode$.subscribe((mode: boolean) => {
      this.isDarkMode.set(mode);
    });
  }
}
