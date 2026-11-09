import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map, pairwise } from 'rxjs';
import { TuiTabs } from '@taiga-ui/kit';
import { ThemeService } from '../../../core/services/ThemeService';
import { AuthService } from '../../auth/service/auth-service';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-user-profile',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TuiTabs, TuiIcon],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() userId!: string;

  isDarkMode = false;
  role: string | undefined;

  ngOnInit(): void {
    // Récupération du rôle utilisateur
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      this.role = user?.role;
      this.cdr.markForCheck();
    });

    // Récupération du thème initial
    this.isDarkMode = this.themeService.isDarkMode();

    // Surveillance des changements du thème
    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
        this.cdr.markForCheck();
      });
  }

  protected readonly direction = toSignal(
    inject(Router).events.pipe(
      filter((event): event is NavigationStart => event instanceof NavigationStart),
      map((event) => {
        const route = event.url.split('/').filter(Boolean).at(-1);

        return (
          {
            edit: 0,
            password: 1,
            delete: 2,
            'list-user': 3,
          }[route ?? 'edit'] ?? 0
        );
      }),
      pairwise(),
      map(([previous, current]) => current - previous),
    ),
    { initialValue: 1 },
  );
}
