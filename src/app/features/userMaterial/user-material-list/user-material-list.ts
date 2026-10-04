import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserMaterialService } from '../service/user-material-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiBreadcrumbs, TuiPagination } from '@taiga-ui/kit';
import { TuiButton, TuiLink } from '@taiga-ui/core';
import { NgClass } from '@angular/common';
import { TuiItem } from '@taiga-ui/cdk';
import { UserMaterialModel } from '../model/userMaterial';
import { TuiCard } from '@taiga-ui/layout';

@Component({
  selector: 'app-user-material-list',
  imports: [
    TuiBreadcrumbs,
    TuiLink,
    TuiPagination,
    NgClass,
    TuiItem,
    RouterLink,
    TuiCard,
    TuiButton,
  ],
  templateUrl: './user-material-list.html',
  styleUrl: './user-material-list.less',
})
export class UserMaterialList implements OnInit {
  private readonly _userMaterialService = inject(UserMaterialService); // call the service to display user material from name material
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _themeService = inject(ThemeService); // Call the service to change color
  private readonly _cdr = inject(ChangeDetectorRef);

  isDarkMode = false; // Change theme from light to dark
  nameMaterial!: string;
  protected userMaterialsByMaterial: UserMaterialModel[] = [];
  messageError = '';

  // Breadcrumbs
  protected links = [
    {
      caption: "Page d\'accueil",
      routerLink: '/dashboard',
    },
    {
      caption: 'materiels',
      routerLink: '/material/all-materials',
    },
    {
      caption: 'list des materiels',
    },
  ];

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 32;

  ngOnInit() {
    this.nameMaterial = String(this._route.snapshot.paramMap.get('nameMaterial'));
    this.getUserMaterialByMaterial();
    this.changeTheme();
  }

  protected getUserMaterialByMaterial() {
    this._userMaterialService.getUserMaterialByMaterial(this.nameMaterial).subscribe({
      next: (userMaterialsList) => {
        this.userMaterialsByMaterial = userMaterialsList;
        this.length = userMaterialsList.length;
        this.length = Math.ceil(this.userMaterialsByMaterial.length / this.size);
        this._cdr.detectChanges();
      },
      error: (error) => {
        this.messageError = 'la liste est vide';
        this.length = 0;
      },
    });
  }

  protected paginatedUserMaterials(): UserMaterialModel[] {
    const start = this.index * this.size;
    return this.userMaterialsByMaterial.slice(start, start + this.size);
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
