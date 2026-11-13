import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import { TuiButton, TuiIcon, TuiNotificationTemplate } from '@taiga-ui/core';
import { TuiItem } from '@taiga-ui/cdk';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FavorService } from '../service/favor-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-favor-delete',
  imports: [TuiBreadcrumbs, TuiItem, RouterLink, TuiButton, TuiNotificationTemplate, TuiIcon],
  templateUrl: './favor-delete.html',
  styleUrl: './favor-delete.less',
})
export class FavorDelete implements OnInit {
  private favorService = inject(FavorService); // Service to call delete favor
  private readonly _route = inject(ActivatedRoute); // Get the id of the favor (by url)s
  private readonly _router = inject(Router); // Tool to navigate
  private readonly _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly cdr = inject(ChangeDetectorRef); // Checks if something has changed in the HTML
  private readonly destroyRef = inject(DestroyRef);

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected readonly isDeleting = signal(false);
  protected messageError = '';
  protected messageSuccess = '';
  protected title = 'Suppression du service';
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

  ngOnInit(): void {
    this.favorId = Number(this._route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(this.favorId) || this.favorId <= 0) {
      this.handleError('Identifiant du service invalide.');
      return;
    }

    this.getFavor();
    this.changeTheme();
  }

  protected getFavor() {
    this.favorService.getFavor(this.favorId).subscribe({
      next: (data) => {
        this.favorId = data.id;
        this.nameFavor = data.nameFavor;
        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error(error);
      },
    });
  }

  protected deleteFavor(): void {
    if (this.isDeleting() || !this.nameFavor) {
      return;
    }

    this.isDeleting.set(true);

    this.favorService
      .deleteFavor(this.favorId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageSuccess = 'Le service a été supprimé avec succès.';

          this.isSuccess.set(true);
          this.show.set(true);
          this.isDeleting.set(false);

          setTimeout(() => {
            this._router.navigate(['/favor/all-favour']);
          }, 2000);
        },

        error: () => {
          this.isDeleting.set(false);

          this.handleError('Une erreur est survenue lors de la suppression du service.');
        },
      });
  }

  changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode();

    this._themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
      });
  }

  private handleError(message: string): void {
    this.messageError = message;
    this.messageSuccess = '';

    this.isSuccess.set(false);
    this.show.set(true);
  }
}
