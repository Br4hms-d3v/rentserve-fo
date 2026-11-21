import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { MaterialService } from '../service/material-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon, TuiLink, TuiNotificationTemplate } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-material-delete',
  imports: [
    TuiBreadcrumbs,
    RouterLink,
    TuiItem,
    TuiButton,
    TuiIcon,
    TuiLink,
    TuiNotificationTemplate,
    FormsModule,
  ],
  templateUrl: './material-delete.html',
  styleUrl: './material-delete.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialDelete implements OnInit {
  private materialService = inject(MaterialService); // Service to call delete material
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _router = inject(Router); // Tool to navigate
  private readonly _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly cdr = inject(ChangeDetectorRef); // Checks if something has changed in the HTML

  private readonly destroy$ = new Subject<void>();
  protected isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected readonly isDeleting = signal(false);
  protected messageError = '';
  protected messageSuccess = '';
  protected title = 'Suppression du matériel';
  protected materialId!: number;
  protected nameMaterial!: string;

  // Breadcrumbs
  protected links = [
    {
      caption: "Page d\'accueil",
      routerLink: '/dashboard',
    },
    {
      caption: 'Liste materiels',
      routerLink: '/material/all-materials',
    },
    {
      caption: 'Suppression matériel',
    },
  ];

  ngOnInit(): void {
    this.materialId = Number(this._route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(this.materialId) || this.materialId <= 0) {
      this.messageError = 'Identifiant du matériel invalide.';
      this.isSuccess.set(false);
      this.show.set(true);
      return;
    }

    this.getMaterial();
    this.changeTheme();
  }

  protected getMaterial(): void {
    this.materialService
      .getMaterial(this.materialId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.nameMaterial = data.nameMaterial;
          this.cdr.markForCheck();
        },

        error: () => {
          this.messageError = 'Impossible de récupérer les informations du matériel.';

          this.isSuccess.set(false);
          this.show.set(true);
          this.cdr.markForCheck();
        },
      });
  }

  protected deleteMaterial(): void {
    if (this.isDeleting() || !this.nameMaterial) {
      return;
    }

    this.isDeleting.set(true);

    this.materialService
      .deleteMaterial(this.materialId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageSuccess = 'Le matériel a été supprimé avec succès.';

          this.isSuccess.set(true);
          this.show.set(true);
          this.isDeleting.set(false);

          this.cdr.markForCheck();

          setTimeout(() => {
            this._router.navigate(['/material/all-materials']);
          }, 2000);
        },

        error: () => {
          this.messageError = 'Une erreur est survenue lors de la suppression du matériel.';

          this.isSuccess.set(false);
          this.show.set(true);
          this.isDeleting.set(false);

          this.cdr.markForCheck();
        },
      });
  }

  changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode();

    this._themeService.darkMode$.pipe(takeUntil(this.destroy$)).subscribe((mode: boolean) => {
      this.isDarkMode = mode;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
