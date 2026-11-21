import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TuiArcChart } from '@taiga-ui/addon-charts';
import { ThemeService } from '../../../core/services/ThemeService';
import { EarnService } from '../service/earn-service';
import { ActivatedRoute } from '@angular/router';
import { TuiSensitive, TuiSwitch } from '@taiga-ui/kit';
import { TuiIcon, TuiLabel } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-earn-this-month',
  imports: [TuiArcChart, DecimalPipe, TuiSensitive, TuiLabel, TuiSwitch, TuiIcon, FormsModule],
  templateUrl: './earn-this-month.html',
  styleUrl: './earn-this-month.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarnThisMonth implements OnInit {
  private _earnService = inject(EarnService); // Call the service to get earn this month
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _cdr = inject(ChangeDetectorRef); // Check if there is any change on the page
  private readonly _destroyRef = inject(DestroyRef);

  protected userId!: number;
  protected isDarkMode = false; // Change theme from light to dark
  protected salary = 0; // current money earn
  protected readonly maxSalary = 7896; // maximum to earn
  protected sensitive = true;
  protected readonly value = [4500, 2500];

  protected readonly currentMonth = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  ngOnInit() {
    this.getRoute();
    this.changeTheme();
  }

  private getRoute(): void {
    this._route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        filter((id) => Number.isInteger(id) && id > 0),
        distinctUntilChanged(),
        switchMap((userId) => {
          this.userId = userId;
          return this._earnService.getEarnThisMonth(userId);
        }),
        catchError((error) => {
          console.error('Unable to retrieve monthly earnings:', error);

          this.salary = 0;
          return of(null);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((earnAmount) => {
        if (earnAmount) {
          this.salary = Number(earnAmount.totalEarned) || 0;
        }
      });
  }

  protected get percentage(): number {
    return this.maxSalary > 0 ? Math.min((this.salary / this.maxSalary) * 100, 100) : 0;
  }

  protected get remainingPercentage(): number {
    return 100 - this.percentage;
  }

  protected get remainingSalary(): number {
    return Math.max(this.maxSalary - this.salary, 0);
  }

  private changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode();

    this._themeService.darkMode$
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this._destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
      });
  }
}
