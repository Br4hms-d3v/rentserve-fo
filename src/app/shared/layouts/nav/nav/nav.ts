import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiDataList, TuiDialogService, TuiDropdown } from '@taiga-ui/core';
import { Theme } from '../../../../core/services/theme';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, RouterLink, TuiButton, TuiDropdown, TuiDataList],
  templateUrl: './nav.html',
  styleUrl: './nav.less',
})
export class Nav implements OnInit {
  private readonly authService = inject(Auth);
  private readonly themeService = inject(Theme);
  private readonly router = inject(Router);
  private readonly dialogs = inject(TuiDialogService);

  isAuthenticated = false;
  isDarkMode = false;
  firstname: string | null | undefined;
  userId: number | undefined;

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.darkMode$.subscribe((mode) => (this.isDarkMode = mode));

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.isAuthenticated = !!user;
        this.firstname = user.firstName;
        this.userId = user.id;
      } else {
        this.isAuthenticated = false;
        this.firstname = null;
        this.userId = undefined;
      }
    });
  }

  /**
   * Logout and redirect to home
   */
  logout() {}
}
