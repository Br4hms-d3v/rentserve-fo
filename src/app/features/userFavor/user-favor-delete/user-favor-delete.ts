import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserFavorService } from '../service/user-favor-service';
import { TuiButton, TuiIcon, TuiNotificationTemplate } from '@taiga-ui/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-favor-delete',
  imports: [TuiButton, TuiNotificationTemplate, TuiIcon],
  templateUrl: './user-favor-delete.html',
  styleUrl: './user-favor-delete.less',
})
export class UserFavorDelete implements OnInit {
  private readonly userFavorService = inject(UserFavorService); // Call the service tot delete the favor
  private readonly _route = inject(ActivatedRoute); // Get the id of user favor (by url)s
  private readonly _router = inject(Router); // Tool to navigate
  private readonly themeService = inject(ThemeService); // Call the service to change color theme

  protected readonly isDarkMode = toSignal(this.themeService.darkMode$, {
    initialValue: this.themeService.isDarkMode(),
  });
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected readonly isDeleting = signal(false);

  userFavorId!: number;
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit(): void {
    this.userFavorId = Number(this._route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(this.userFavorId) || this.userFavorId <= 0) {
      this.messageError = 'Identifiant du service invalide.';
      this.isSuccess.set(false);
      this.show.set(true);
    }
  }

  goBack() {
    this._router.navigate(['/user-favor', 'my-user-favor']);
  }

  onDelete(): void {
    if (this.isDeleting() || !Number.isInteger(this.userFavorId) || this.userFavorId <= 0) {
      console.error('Identifiant invalide :', this.userFavorId);
      return;
    }

    this.isDeleting.set(true);
    this.show.set(false);

    console.log('Suppression du service ID :', this.userFavorId);

    this.userFavorService.deleteUserFavor(this.userFavorId).subscribe({
      next: (response) => {
        console.log('Suppression réussie :', response);

        this.messageSuccess = 'Votre service a été supprimé avec succès.';

        this.isSuccess.set(true);
        this.isDeleting.set(false);
        this.show.set(true);

        setTimeout(() => {
          this._router.navigate(['/user-favor', 'my-user-favor']);
        }, 2000);
      },

      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
        console.error('HTTP Status :', err.status);
        console.error('Erreur API :', err.error);

        this.messageError = `Échec de la suppression (HTTP ${err.status || 'inconnu'}).`;

        this.isSuccess.set(false);
        this.isDeleting.set(false);
        this.show.set(true);
      },
    });
  }

}
