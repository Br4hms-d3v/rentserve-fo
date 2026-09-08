import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import { TuiButton, TuiNotificationTemplate } from '@taiga-ui/core';
import { NgClass } from '@angular/common';
import { TuiItem } from '@taiga-ui/cdk';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FavorService } from '../service/favor-service';
import { ThemeService } from '../../../core/services/ThemeService';

@Component({
  selector: 'app-favor-delete',
  imports: [NgClass, TuiBreadcrumbs, TuiItem, RouterLink, TuiButton, TuiNotificationTemplate],
  templateUrl: './favor-delete.html',
  styleUrl: './favor-delete.less',
})
export class FavorDelete implements OnInit {
  private favorService = inject(FavorService); // Service to call delete favor
  private readonly _route = inject(ActivatedRoute); // Get the id of the favor (by url)s
  private readonly _router = inject(Router); // Tool to navigate
  private readonly _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected messageError = '';
  protected messageSuccess = '';
  title = 'Suppression du service';
  favorId!: number;
  nameFavor!: string;

  // Breadcrumbs
  protected links = [
    {
      caption: "Page d\'accueil",
      routerLink: '/dashboard',
    },
    {
      caption: 'Liste des services',
      routerLink: '/favor/all-favour',
    },
    {
      caption: 'Suppression du service',
    },
  ];

  ngOnInit() {
    this.favorId = Number(this._route.snapshot.paramMap.get('id'));
    this.getFavor();
    this.changeTheme();
  }

  getFavor() {
    this.favorService.getFavor(this.favorId).subscribe({
      next: (data) => {
        this.favorId = data.id;
        this.nameFavor = data.nameFavor;
      },

      error: (error) => {
        console.error(error);
      },
    });
  }

  deleteFavor() {
    this.favorService.deleteFavor(this.favorId).subscribe({
      next: () => {
        this.messageSuccess = 'Le service a bien été supprimé';
        this.isSuccess.set(true);
        this.show.set(true);

        setTimeout(() => {
          this._router.navigate(['/favor/all-favour']);
        }, 2000);
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
