import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UserMaterialService } from '../service/user-material-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserMaterialDetailModel } from '../model/user-material-detail';
import { NgClass } from '@angular/common';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import { TuiLink } from '@taiga-ui/core';
import { TuiItem } from '@taiga-ui/cdk';

@Component({
  selector: 'app-user-material-by-id',
  imports: [NgClass, TuiBreadcrumbs, TuiLink, TuiItem, RouterLink],
  templateUrl: './user-material-by-id.html',
  styleUrl: './user-material-by-id.less',
})
export class UserMaterialById {
  private readonly _userMaterialService = inject(UserMaterialService);
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _cdr = inject(ChangeDetectorRef);
  private _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  userMaterialDetail: UserMaterialDetailModel | null = null;
  userMaterialId!: number;

  ngOnInit() {
    this.userMaterialId = Number(this._route.snapshot.paramMap.get('id'));
    this.userMaterialById();
    this.changeTheme();
  }

  protected userMaterialById() {
    this._userMaterialService.getUserMaterialById(this.userMaterialId).subscribe({
      next: (result) => {
        this.userMaterialDetail = result;
        // console.log(this.userMaterialDetail);
        this._cdr.detectChanges();
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
