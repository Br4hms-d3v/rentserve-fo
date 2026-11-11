import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  DOCUMENT,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TuiIcon } from '@taiga-ui/core';
import { ThemeService } from '../../../core/services/ThemeService';
import { MaterialService } from '../service/material-service';
import { MaterialDetailModel } from '../model/material-detail';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-material-by-id',
  imports: [TuiIcon],
  templateUrl: './material-by-id.html',
  styleUrl: './material-by-id.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialById implements OnChanges {
  private readonly themeService = inject(ThemeService);
  private readonly materialService = inject(MaterialService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  @Input() materialId!: number;

  material?: MaterialDetailModel;

  isDarkMode = this.themeService.isDarkMode();

  constructor() {
    this.themeService.darkMode$
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;

        // Synchronisation du thème global
        const root = this.document.documentElement;

        root.classList.toggle('dark-mode', mode);
        root.classList.toggle('light-mode', !mode);

        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['materialId'] && this.materialId) {
      this.getMaterialById();
    }
  }

  private getMaterialById(): void {
    this.materialService
      .getMaterial(this.materialId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.material = data;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Erreur lors de la récupération du matériau :', error);
        },
      });
  }
}
