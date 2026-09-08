import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { TuiHeader } from '@taiga-ui/layout';
import { TuiTitle } from '@taiga-ui/core';
import { NgClass } from '@angular/common';
import { ThemeService } from '../../../core/services/ThemeService';
import { FavorDetailModel } from '../model/favorlDetail';
import { FavorService } from '../service/favor-service';

@Component({
  selector: 'app-favor-by-id',
  imports: [NgClass, TuiHeader, TuiTitle],
  templateUrl: './favor-by-id.html',
  styleUrl: './favor-by-id.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavorById implements OnInit {
  private themeService = inject(ThemeService); // Call the service to change color themeService
  private readonly _favorService = inject(FavorService); // Call the service favor to get details on favor
  private readonly _cdr = inject(ChangeDetectorRef); // Check if there is any change on the page

  //Get data id from FavorList
  @Input() favorId!: number;
  favor?: FavorDetailModel;
  isDarkMode = false; // Change theme from light to dark

  ngOnInit() {
    this.getFavorById();
    this.changeTheme();
  }

  private getFavorById() {
    this._favorService.getFavor(this.favorId).subscribe({
      next: (data) => {
        this.favor = data;
        this._cdr.detectChanges();
      },
      error: (error) => {
        console.log('Erreur lors de la récupération: ', error);
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this.themeService.isDarkMode(); // Get current theme
    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
