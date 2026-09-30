import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserFavorService } from '../service/user-favor-service';
import { TuiButton, TuiNotificationTemplate } from '@taiga-ui/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-favor-delete',
  imports: [TuiButton, TuiNotificationTemplate, NgClass],
  templateUrl: './user-favor-delete.html',
  styleUrl: './user-favor-delete.less',
})
export class UserFavorDelete implements OnInit {
  private readonly _userFavorService = inject(UserFavorService); // Call the service tot delete the favor
  private readonly _route = inject(ActivatedRoute); // Get the id of user favor (by url)s
  private readonly _router = inject(Router); // Tool to navigate
  private readonly _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error

  userFavorId!: number;
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit() {
    this.userFavorId = Number(this._route.snapshot.paramMap.get('id'));
    this.changeTheme();
  }

  goBack() {
    this._router.navigate(['/user-favor', 'my-user-favor']);
  }

  onDelete() {
    this._userFavorService.deleteUserFavor(this.userFavorId).subscribe({
      next: () => {
        this.messageSuccess = 'La suppression du service a été supprimé avec succès';
        this.isSuccess.set(true);
        this.show.set(true);
        setTimeout(() => {
          this._router.navigate(['/userFavor', 'my-user-favor']);
        }, 2000);
      },
      error: (err) => {
        this.messageError = 'Erreur lors de la suppression du servie !';
        this.isSuccess.set(false);
        this.show.set(true);
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
