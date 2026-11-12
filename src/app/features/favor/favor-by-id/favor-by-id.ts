import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { TuiHeader } from '@taiga-ui/layout';
import { TuiIcon, TuiTitle } from '@taiga-ui/core';
import { ThemeService } from '../../../core/services/ThemeService';
import { FavorDetailModel } from '../model/favorlDetail';
import { FavorService } from '../service/favor-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-favor-by-id',
  imports: [TuiHeader, TuiTitle, TuiIcon],
  templateUrl: './favor-by-id.html',
  styleUrl: './favor-by-id.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavorById implements OnInit {
  private themeService = inject(ThemeService); // Call the service to change color themeService
  private readonly _favorService = inject(FavorService); // Call the service favor to get details on favor
  private readonly _cdr = inject(ChangeDetectorRef); // Check if there is any change on the page
  private readonly destroyRef = inject(DestroyRef);

  //Get data id from FavorList
  @Input() favorId!: number;
  favor?: FavorDetailModel;
  isDarkMode = false; // Change theme from light to dark

  ngOnInit() {
    this.getFavorById();
    this.changeTheme();
  }

  private getFavorById(): void {
    this._favorService
      .getFavor(this.favorId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.favor = data;
          this._cdr.detectChanges();
        },

        error: (error) => {
          console.error('Erreur lors de la récupération des informations de la faveur :', error);
        },
      });
  }

  private changeTheme(): void {
    this.isDarkMode = this.themeService.isDarkMode();

    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
      });
  }
}
