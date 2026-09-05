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
import { TuiButton, TuiNotificationTemplate } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-material-delete',
  imports: [
    TuiBreadcrumbs,
    NgClass,
    RouterLink,
    TuiItem,
    TuiButton,
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

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected messageError = '';
  protected messageSuccess = '';
  title = 'Suppression du matériel';
  materialId!: number;
  nameMaterial!: string;

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

  ngOnInit() {
    this.materialId = Number(this._route.snapshot.paramMap.get('id'));
    this.getMaterial();
    this.changeTheme();
  }

  getMaterial() {
    this.materialService.getMaterial(this.materialId).subscribe({
      next: (data) => {
        this.materialId = data.id;
        this.nameMaterial = data.nameMaterial;

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  deleteMaterial() {
    this.materialService.deleteMaterial(this.materialId).subscribe({
      next: () => {
        this.messageSuccess = 'Le matériel a bien été supprimé';
        this.isSuccess.set(true);
        this.show.set(true);

        setTimeout(() => {
          this._router.navigate(['/material/all-materials']);
        }, 2000);
      },
      error: () => {
        this.messageError = 'Impossible de supprimer le matériel';
        this.isSuccess.set(false);
        this.show.set(true);
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode();
    this._themeService.darkMode$.subscribe((mode: boolean) => {
      this.isDarkMode = mode;
      this.cdr.markForCheck();
    });
  }
}
