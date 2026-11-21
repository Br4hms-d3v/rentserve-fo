import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

import { ThemeService } from '../../../core/services/ThemeService';
import { CategoryMaterial } from '../../category/category-material/category-material';
import { CategoryFavor } from '../../category/category-favor/category-favor';

@Component({
  selector: 'app-dashboard',
  imports: [CategoryMaterial, CategoryFavor],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isDarkMode = toSignal(this.themeService.darkMode$, {
    initialValue: this.themeService.isDarkMode(),
  });

}
