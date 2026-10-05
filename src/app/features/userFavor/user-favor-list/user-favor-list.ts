import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserFavorService } from '../service/user-favor-service';
import { UserFavorModel } from '../model/userFavor';
import { TuiBreadcrumbs, TuiPagination } from '@taiga-ui/kit';
import { TuiButton, TuiLink } from '@taiga-ui/core';
import { TuiCardMedium } from '@taiga-ui/layout';
import { NgClass } from '@angular/common';
import { TuiItem } from '@taiga-ui/cdk';

@Component({
  selector: 'app-user-favor-list',
  imports: [
    TuiBreadcrumbs,
    TuiButton,
    TuiCardMedium,
    TuiLink,
    TuiPagination,
    NgClass,
    TuiItem,
    RouterLink,
  ],
  templateUrl: './user-favor-list.html',
  styleUrl: './user-favor-list.less',
})
export class UserFavorList implements OnInit {
  private readonly _userFavorService = inject(UserFavorService); // Call the service to display a list of user favor by the name favor
  private readonly _route = inject(ActivatedRoute); // Get the id of the favor (by url)s
  private readonly _themeService = inject(ThemeService); // Call the service to change color
  private readonly _cdr = inject(ChangeDetectorRef);

  isDarkMode = false; // Change theme from light to dark
  nameFavor!: string;
  protected userFavourByFavor: UserFavorModel[] = [];
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

  ngOnInit() {
    this.nameFavor = String(this._route.snapshot.paramMap.get('nameFavor'));
    this.getUserFavorByFavor();
    this.changeTheme();
  }

  protected getUserFavorByFavor() {
    this._userFavorService.getUserFavorByFavor(this.nameFavor).subscribe({
      next: (userFavourList) => {
        this.userFavourByFavor = userFavourList;
        this.length = userFavourList.length;
        this.length = Math.ceil(userFavourList.length / this.size);
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.messageError = 'La liste est vide';
        this.length = 0;
        // console.log(err);
      },
    });
  }

  protected paginatedUserFavour() {
    const start = this.index * this.size;
    return this.userFavourByFavor.slice(start, start + this.size);
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
