import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserFavorService } from '../service/user-favor-service';
import { UserFavorDetailModel } from '../model/user-favor-detail';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-favor-detail',
  imports: [NgClass],
  templateUrl: './user-favor-detail.html',
  styleUrl: './user-favor-detail.less',
})
export class UserFavorDetail implements OnInit {
  private readonly _userFavorService = inject(UserFavorService); // Get detail about user favor from owner
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _cdr = inject(ChangeDetectorRef);
  private _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  userFavorDetail!: UserFavorDetailModel;
  userFavorId!: number;

  ngOnInit() {
    this.userFavorId = Number(this._route.snapshot.paramMap.get('id'));
    this.userFavorOwner();
    this.changeTheme();
  }

  protected userFavorOwner() {
    this._userFavorService.getUserFavorDetail(this.userFavorId).subscribe({
      next: (result) => {
        this.userFavorDetail = result;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
