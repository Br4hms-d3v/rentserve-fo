import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReviewUserMaterial } from '../../../review/review-user-material/review-user-material';
import { UserMaterialService } from '../../../userMaterial/service/user-material-service';
import { ThemeService } from '../../../../core/services/ThemeService';
import { UserMaterialDetailModel } from '../../../userMaterial/model/user-material-detail';

@Component({
  selector: 'app-user-material-detail',
  imports: [ReviewUserMaterial],
  templateUrl: './user-material-detail.html',
  styleUrl: './user-material-detail.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMaterialDetail implements OnInit {
  private readonly _userMaterialService = inject(UserMaterialService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _themeService = inject(ThemeService);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _destroyRef = inject(DestroyRef);

  isDarkMode = false;

  userMaterialDetail: UserMaterialDetailModel | null = null;

  userMaterialId!: number;

  ngOnInit(): void {
    this.userMaterialId = Number(this._route.snapshot.paramMap.get('id'));

    this.changeTheme();

    if (!Number.isInteger(this.userMaterialId) || this.userMaterialId <= 0) {
      console.error('Identifiant du matériel invalide.');
      return;
    }

    this.userMaterialOwner();
  }

  protected userMaterialOwner(): void {
    this._userMaterialService
      .getUserMaterialDetail(this.userMaterialId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (result: UserMaterialDetailModel) => {
          this.userMaterialDetail = result;

          this._cdr.markForCheck();
        },

        error: (err) => {
          console.error(
            'Erreur lors du chargement du matériel :',
            err.error?.message ?? err.message,
          );
        },
      });
  }

  private changeTheme(): void {
    this.isDarkMode = this._themeService.isDarkMode();

    this._themeService.darkMode$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;

        this._cdr.markForCheck();
      });
  }
}
