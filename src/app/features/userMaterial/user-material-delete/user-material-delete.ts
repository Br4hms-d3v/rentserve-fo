import { Component, inject, OnInit, signal } from '@angular/core';
import { UserMaterialService } from '../service/user-material-service';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiButton, TuiNotificationTemplate } from '@taiga-ui/core';
import { ThemeService } from '../../../core/services/ThemeService';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-material-delete',
  imports: [TuiButton, TuiNotificationTemplate, NgClass],
  templateUrl: './user-material-delete.html',
  styleUrl: './user-material-delete.less',
})
export class UserMaterialDelete implements OnInit {
  private readonly _userMaterialService = inject(UserMaterialService); // call the service to delete the user material
  private readonly _route = inject(ActivatedRoute); // Get the id of user material (by url)s
  private readonly _router = inject(Router); // Tool to navigate
  private readonly _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error

  userMaterialId!: number;
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit() {
    this.userMaterialId = Number(this._route.snapshot.paramMap.get('id'));
    this.changeTheme();
  }

  goBack() {
    this._router.navigate(['/user-material', 'my-user-material']);
  }

  onDelete() {
    this._userMaterialService.deleteUserMaterial(this.userMaterialId).subscribe({
      next: () => {
        this.messageSuccess = 'La suppression du matériel a été supprimé avec succès ';
        this.isSuccess.set(true);
        this.show.set(true);
        setTimeout(() => {
          this._router.navigate(['/user-material', 'my-user-material']);
        }, 2000);
      },
      error: (err) => {
        this.messageError = 'Erreur lors de la suppression !';
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
