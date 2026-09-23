import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UserMaterialService } from '../service/user-material-service';
import { UserMaterialDetailModel } from '../model/user-material-detail';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-material-detail',
  imports: [NgClass],
  templateUrl: './user-material-detail.html',
  styleUrl: './user-material-detail.less',
})
export class UserMaterialDetail implements OnInit {
  private readonly _userMaterialService = inject(UserMaterialService);
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _cdr = inject(ChangeDetectorRef);
  private _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  userMaterialDetail: UserMaterialDetailModel | null = null;
  userMaterialId!: number;

  ngOnInit() {
    this.userMaterialId = Number(this._route.snapshot.paramMap.get('id'));
    this.userMaterialOwner();
    this.changeTheme();
  }

  protected userMaterialOwner() {
    this._userMaterialService.getUserMaterialDetail(this.userMaterialId).subscribe({
      next: (result) => {
        this.userMaterialDetail = result;

        this._cdr.detectChanges();
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
