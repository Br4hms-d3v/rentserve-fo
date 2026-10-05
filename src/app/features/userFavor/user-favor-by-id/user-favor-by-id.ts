import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserFavorService } from '../service/user-favor-service';
import { UserFavorDetailModel } from '../model/user-favor-detail';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-favor-by-id',
  imports: [NgClass],
  templateUrl: './user-favor-by-id.html',
  styleUrl: './user-favor-by-id.less',
})
export class UserFavorById {
  private readonly _userFavorService = inject(UserFavorService); // Get userFavor by id
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _cdr = inject(ChangeDetectorRef);
  private _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  userFavorDetail: UserFavorDetailModel | null = null;
  userFavorId!: number;

  ngOnInit(): void {
    this.userFavorId = Number(this._route.snapshot.paramMap.get('id'));
    this.userFavorById();
    this.changeTheme();
  }

  protected userFavorById() {
    this._userFavorService.getUserFavorById(this.userFavorId).subscribe({
      next: (result) => {
        this.userFavorDetail = result;
        this._cdr.detectChanges();
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
