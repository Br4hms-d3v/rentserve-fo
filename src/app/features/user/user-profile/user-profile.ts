import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map, pairwise } from 'rxjs';
import { NgClass } from '@angular/common';
import { TuiSlides } from '@taiga-ui/layout';
import { TuiTabs } from '@taiga-ui/kit';
import { ThemeService } from '../../../core/services/ThemeService';

@Component({
  selector: 'app-user-profile',
  imports: [NgClass, RouterLink, RouterLinkActive, RouterOutlet, TuiSlides, TuiTabs],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile implements OnInit{
  private _themeService = inject(ThemeService); // Call the service to change color theme

  @Input() userId!: string;
  isDarkMode = false; // Change theme from light to dark

  ngOnInit(): void {
    this.changeTheme();
  }

  protected readonly direction = toSignal(
    inject(Router).events.pipe(
      filter((event) => event instanceof NavigationStart),
      map(({ url }) => {
        const route = url.split('/').at(-1);

        return (
          {
            edit: 0,
            password: 1,
            delete: 2,
          }[route ?? 'edit'] ?? 0
        );
      }),
      pairwise(),
      map(([prev, next]) => next - prev),
    ),
    { initialValue: 1 },
  );

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
