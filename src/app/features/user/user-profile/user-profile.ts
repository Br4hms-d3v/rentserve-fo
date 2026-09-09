import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
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

@Component({
  selector: 'app-user-profile',
  imports: [NgClass, RouterLink, RouterLinkActive, RouterOutlet, TuiSlides, TuiTabs],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile {
  @Input() userId!: string;
  isDarkMode = false; // Change theme from light to dark

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
}
