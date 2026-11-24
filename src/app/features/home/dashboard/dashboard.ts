import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

import { ThemeService } from '../../../core/services/ThemeService';
import { CategoryMaterial } from '../../category/category-material/category-material';
import { CategoryFavor } from '../../category/category-favor/category-favor';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-dashboard',
  imports: [CategoryMaterial, CategoryFavor, TranslocoPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly themeService = inject(ThemeService);

  readonly isDarkMode = toSignal(this.themeService.darkMode$, {
    initialValue: this.themeService.isDarkMode(),
  });
}
