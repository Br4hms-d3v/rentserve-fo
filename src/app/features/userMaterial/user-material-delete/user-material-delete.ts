import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UserMaterialService } from '../service/user-material-service';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiButton, TuiIcon, TuiNotificationTemplate } from '@taiga-ui/core';
import { ThemeService } from '../../../core/services/ThemeService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

@Component({
  selector: 'app-user-material-delete',
  imports: [TuiButton, TuiNotificationTemplate, TuiIcon],
  templateUrl: './user-material-delete.html',
  styleUrl: './user-material-delete.less',
})
export class UserMaterialDelete implements OnInit {
  private readonly _userMaterialService = inject(UserMaterialService); // call the service to delete the user material
  private readonly _route = inject(ActivatedRoute); // Get the id of user material (by url)s
  private readonly _router = inject(Router); // Tool to navigate
  private readonly _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _destroyRef = inject(DestroyRef);

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected readonly isDeleting = signal(false);

  userMaterialId!: number;
  protected messageError = '';
  protected messageSuccess = '';

  ngOnInit(): void {
    const id = Number(this._route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this._router.navigate(['/user-material', 'my-user-material']);
      return;
    }

    this.userMaterialId = id;
    this.changeTheme();
  }

  goBack() {
    this._router.navigate(['/user-material', 'my-user-material']);
  }

  protected onDelete(): void {
    // Prevent multiple requests
    if (this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);

    this.messageError = '';
    this.messageSuccess = '';

    this._userMaterialService
      .deleteUserMaterial(this.userMaterialId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.messageSuccess = 'Votre matériel a été supprimé avec succès.';

          this.isSuccess.set(true);
          this.isDeleting.set(false);
          this.show.set(true);

          // Redirect after successful deletion
          timer(2000)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
              this._router.navigate(['/user-material', 'my-user-material']);
            });
        },

        error: () => {
          this.messageError =
            'Une erreur est survenue lors de la suppression de votre matériel. Veuillez réessayer.';

          this.isSuccess.set(false);
          this.isDeleting.set(false);
          this.show.set(true);
        },
      });
  }

  changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode();
    this._themeService.darkMode$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
      });
  }
}
