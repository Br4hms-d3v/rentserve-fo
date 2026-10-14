import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { NgClass } from '@angular/common';
import { TuiTable } from '@taiga-ui/addon-table';
import { ReviewService } from '../service/review-service';
import { ReviewUserMaterialModel } from '../model/reviewUserMaterial';
import { TuiPagination, TuiRating, TuiRatingContext } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-review-user-material',
  imports: [NgClass, TuiTable, TuiRating, FormsModule, TuiButton, TuiPagination],
  templateUrl: './review-user-material.html',
  styleUrl: './review-user-material.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewUserMaterial implements OnInit {
  private readonly _reviewService = inject(ReviewService);
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _cdr = inject(ChangeDetectorRef);
  private _themeService = inject(ThemeService); // Call the service to change color theme

  isDarkMode = false; // Change theme from light to dark
  title = 'Commentaires';
  userMaterialId!: number;
  protected reviewUserMaterialModel: ReviewUserMaterialModel[] = [];

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 10;

  ngOnInit() {
    this.getRoute();
    this.userMaterialReviews();
    this.changeTheme();
  }

  getRoute() {
    this._route.params.subscribe((params) => {
      this.userMaterialId = params['id'];
    });
  }

  protected userMaterialReviews(): void {
    this._reviewService.getReviewUserMaterial(this.userMaterialId).subscribe({
      next: (reviews) => {
        this.reviewUserMaterialModel = reviews.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        this.length = reviews.length;
        this.index = 0;
        this._cdr.detectChanges();
      },
    });
  }

  protected readonly icon: PolymorpheusContent<TuiRatingContext> = ({ filled }) =>
    filled ? '@tui.star-filled' : '@tui.star';

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode(); // Get current theme
    this._themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }

  protected readonly Math = Math;
}
