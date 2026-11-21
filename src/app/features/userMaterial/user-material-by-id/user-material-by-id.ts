import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { UserMaterialService } from '../service/user-material-service';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/ThemeService';
import { UserMaterialDetailModel } from '../model/user-material-detail';
import { ReviewUserMaterial } from '../../review/review-user-material/review-user-material';
import { RentalCreate } from '../../rental/rental-create/rental-create';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-material-by-id',
  imports: [ReviewUserMaterial, RentalCreate],
  templateUrl: './user-material-by-id.html',
  styleUrl: './user-material-by-id.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMaterialById {
  private readonly _userMaterialService = inject(UserMaterialService);
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _cdr = inject(ChangeDetectorRef);
  private _themeService = inject(ThemeService); // Call the service to change color theme
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isDarkMode = signal(false); // Change theme from light to dark
  userMaterialDetail: UserMaterialDetailModel | null = null;
  userMaterialId!: number;

  ngOnInit() {
    this.userMaterialId = Number(this._route.snapshot.paramMap.get('id'));
    this.userMaterialById();
    this.changeTheme();
  }

  protected userMaterialById() {
    this._userMaterialService.getUserMaterialById(this.userMaterialId).subscribe({
      next: (result) => {
        this.userMaterialDetail = result;
        // console.log(this.userMaterialDetail);
        this._cdr.detectChanges();
      },
    });
  }

  private changeTheme(): void {
    this.isDarkMode.set(this._themeService.isDarkMode());

    this._themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode.set(mode);
      });
  }
}
