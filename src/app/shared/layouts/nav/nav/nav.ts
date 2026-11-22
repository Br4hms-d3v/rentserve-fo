import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TuiButton, TuiClose, TuiIcon, TuiPopup, TuiTitle } from '@taiga-ui/core';
import { TuiDrawer } from '@taiga-ui/kit';
import { TuiHeader } from '@taiga-ui/layout';

import { ThemeService } from '../../../../core/services/ThemeService';
import { AuthService } from '../../../../features/auth/service/auth-service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    TuiButton,
    TuiDrawer,
    TuiPopup,
    TuiHeader,
    TuiTitle,
    TuiClose,
    TuiIcon,
    TranslocoPipe,
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly openDrawer = signal(false);
  protected readonly isAuthenticated = signal(false);

  protected isDarkMode = false;
  protected firstname: string | null = null;
  protected userId: number | undefined;

  ngOnInit(): void {
    // Theme synchronization
    this.isDarkMode = this.themeService.isDarkMode();

    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
        this.cdr.markForCheck();
      });

    // Authenticated user synchronization
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      if (user) {
        this.isAuthenticated.set(true);
        this.firstname = user.firstName;
        this.userId = user.id;
      } else {
        this.isAuthenticated.set(false);
        this.firstname = null;
        this.userId = undefined;
        this.openDrawer.set(false);
      }

      this.cdr.markForCheck();
    });
  }

  // Close account drawer
  protected onClose(): void {
    this.openDrawer.set(false);
  }

  // Logout
  protected logout(): void {
    this.onClose();

    this.authService.logout();

    this.isAuthenticated.set(false);
    this.firstname = null;
    this.userId = undefined;

    this.cdr.markForCheck();

    void this.router.navigate(['/']);
  }
}
