import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MaterialService } from '../service/material-service';
import { MaterialDetailModel } from '../model/material-detail';
import { TuiHeader } from '@taiga-ui/layout';
import { TuiTitle } from '@taiga-ui/core';
import { ThemeService } from '../../../core/services/ThemeService';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-material-by-id',
  imports: [TuiHeader, TuiTitle, NgClass],
  templateUrl: './material-by-id.html',
  styleUrl: './material-by-id.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialById implements OnChanges {
  private themeService = inject(ThemeService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Get data id from MaterialList
  @Input() materialId!: number;
  material?: MaterialDetailModel;
  isDarkMode = false; // Change theme from light to dark

  private readonly _materialService = inject(MaterialService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['materialId']) {
      this.getMaterialById();
    }
    this.getChangeTheme();
  }

  private getMaterialById() {
    this._materialService.getMaterial(this.materialId).subscribe({
      next: (data) => {
        // console.log('material reçu :', data);
        this.material = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du material :', error);
      },
    });
  }

  getChangeTheme() {
    this.isDarkMode = this.themeService.isDarkMode(); // Get current theme
    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
