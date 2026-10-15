import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { TuiArcChart } from '@taiga-ui/addon-charts';
import { tuiSum } from '@taiga-ui/cdk';
import { ThemeService } from '../../../core/services/ThemeService';
import { EarnService } from '../service/earn-service';
import { ActivatedRoute } from '@angular/router';
import { TuiSensitive, TuiSwitch } from '@taiga-ui/kit';
import { TuiLabel } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-earn-this-month',
  imports: [NgClass, TuiArcChart, DecimalPipe, TuiSensitive, TuiLabel, TuiSwitch, FormsModule],
  templateUrl: './earn-this-month.html',
  styleUrl: './earn-this-month.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarnThisMonth implements OnInit {
  private _earnService = inject(EarnService); // Call the service to get earn this month
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _cdr = inject(ChangeDetectorRef); // Check if there is any change on the page

  userId!: number;
  isDarkMode = false; // Change theme from light to dark
  salary = 0; // current money earn
  readonly maxSalary = 7896; // maximum to earn
  protected sensitive = true;

  ngOnInit() {
    this.getRoute();
  }

  getRoute() {
    this._route.params.subscribe((params) => {
      this.userId = params['id'];
    });
    this.myEarnThisMonth();
  }

  protected myEarnThisMonth() {
    this._earnService.getEarnThisMonth(this.userId).subscribe({
      next: (earnAmount) => {
        this.salary = Number(earnAmount.totalEarned) || 0;
        // console.log(this.salary);
        this._cdr.detectChanges();
      },
    });
  }

  get percentage(): number {
    return Math.min((this.salary / this.maxSalary) * 100, 100);
  }

  get remainingPercentage(): number {
    return 100 - this.percentage;
  }

  get remainingSalary(): number {
    return Math.max(this.maxSalary - this.salary, 0);
  }
  protected readonly value = [4500, 2500];
}
