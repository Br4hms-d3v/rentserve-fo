import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiClose, TuiDialogService, TuiPopup, TuiTitle } from '@taiga-ui/core';
import { ThemeService } from '../../../../core/services/ThemeService';

import { AuthService } from '../../../../features/auth/service/auth-service';
import { FormControl } from '@angular/forms';
import { TuiDrawer } from '@taiga-ui/kit';
import { TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-nav',
  imports: [NgClass, RouterLink, TuiButton, TuiDrawer, TuiPopup, TuiClose, TuiHeader, TuiTitle],
  templateUrl: './nav.html',
  styleUrl: './nav.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly control = new FormControl('Some value');
  protected readonly openDrawer = signal(false);

  protected readonly isAuthenticated = signal(false);
  isDarkMode = false;
  protected firstname: string | null | undefined;
  protected userId: number | undefined;

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.darkMode$.subscribe((mode) => (this.isDarkMode = mode));

    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.isAuthenticated.set(true);
        // console.log(this.isAuthenticated);
        this.firstname = user.firstName;
        this.userId = user.id;
      } else {
        this.isAuthenticated.set(false);
        this.firstname = null;
        this.userId = undefined;
      }
    });
  }

  logout() {
    this._authService.logout();
    this.openDrawer.set(false);
    this.router.navigate(['/']);
    this.isAuthenticated.set(false);
  }

  public onClose(): void {
    if (this.control.pristine) {
      this.openDrawer.set(false);

      return;
    }
  }
}
