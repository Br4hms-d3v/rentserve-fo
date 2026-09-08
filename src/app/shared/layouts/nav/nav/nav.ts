import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiDataList, TuiDialogService, TuiDropdown, TuiOption } from '@taiga-ui/core';
import { ThemeService } from '../../../../core/services/ThemeService';

import { TuiChevron } from '@taiga-ui/kit';
import { AuthService } from '../../../../features/auth/service/auth-service';

@Component({
  selector: 'app-nav',
  imports: [
    CommonModule,
    RouterLink,
    TuiButton,
    TuiDropdown,
    TuiDataList,
    TuiOption,
    TuiDataList,
    TuiChevron,
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.less',
})
export class Nav implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  protected isOpen = false;
  protected isAuthenticated = false;
  isDarkMode = false;
  protected firstname: string | null | undefined;
  protected userId: number | undefined;

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.darkMode$.subscribe((mode) => (this.isDarkMode = mode));

    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        // console.log(this.isAuthenticated);
        this.firstname = user.firstName;
        this.userId = user.id;
      } else {
        this.isAuthenticated = false;
        this.firstname = null;
        this.userId = undefined;
      }
    });
  }

  logout() {
    this._authService.logout();
    this.router.navigate(['/']);
    this.isAuthenticated = false;
  }
}
