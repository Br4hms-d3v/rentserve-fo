import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth-service';
import { UserMaterialService } from '../service/user-material-service';
import { UserMaterialModel } from '../model/userMaterial';
import { TuiTable, TuiTablePagination } from '@taiga-ui/addon-table';
import { TuiStatus } from '@taiga-ui/kit';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';

@Component({
  selector: 'app-user-material-user',
  imports: [
    TuiTable,
    TuiStatus,
    TuiButton,
    NgOptimizedImage,
    TuiTablePagination,
    FormsModule,
    TuiIcon,
    RouterLink,
    NgClass,
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
  protected showNameMaterialSearch = false;
  protected nameMaterialSearch = '';

  // Pagination
  protected page = 0;
  protected size = 5;
  protected total = 0;
  protected sizeOptions = [5, 25, 50];

  ngOnInit() {
    this.getIdUser();
  }

  protected getIdUser() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        // console.log(this.userId);
        this.getUserMaterialById();
      }
    });
    this.changeTheme();
  }

  protected getUserMaterialById() {
    this._userMaterialService.getUserMaterialByUser(this.userId).subscribe({
      next: (userMaterials) => {
        this.userMaterialList = userMaterials;
        this.total = userMaterials.length;
        this._cdr.detectChanges();
        // console.log(this.userMaterialList);
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }

  protected paginatedUserMaterialList(): UserMaterialModel[] {
    const search = this.nameMaterialSearch.trim().toLowerCase();

    const filteredMaterials = this.userMaterialList.filter((userMaterial) =>
      userMaterial.nameMaterial.nameMaterial.toLowerCase().includes(search),
    );

    this.total = filteredMaterials.length;
    const start = this.page * this.size;
    return filteredMaterials.slice(start, start + this.size);
  }

  protected NameMaterialSearch() {
    this.showNameMaterialSearch = !this.showNameMaterialSearch;

    if (!this.showNameMaterialSearch) {
      this.nameMaterialSearch = '';
    }

    this.page = 0;
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
