import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiNotificationTemplate } from '@taiga-ui/core';
import { UserMaterialModel } from '../../userMaterial/model/userMaterial';
import { UserFavorModel } from '../../userFavor/model/userFavor';
import { ThemeService } from '../../../core/services/ThemeService';
import { RentalService } from '../service/rental-service';
import { ActivatedRoute } from '@angular/router';
import { RentalCreateForm } from '../model/rentalCreateForm';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-rental-create',
  imports: [NgClass, ReactiveFormsModule, TuiButton, FormsModule, TuiNotificationTemplate],
  templateUrl: './rental-create.html',
  styleUrl: './rental-create.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RentalCreate implements OnInit {
  private _authService = inject(AuthService);
  private readonly _rentalService = inject(RentalService);
  private readonly _themeService = inject(ThemeService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);

  isDarkMode = false;
  userMaterialId!: number;
  userId!: number;
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for succes or Red error
  protected messageError = '';
  protected messageSuccess = '';

  // Bornes au format "YYYY-MM-DD" (attendu par <input type="date">)
  protected readonly min = this.toIsoDate(new Date());
  protected readonly max = this.toIsoDate(this.addDays(new Date(), 90));

  protected readonly rentalCreateForm = new FormGroup({
    dateStart: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    dateEnd: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    startTime: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    endTime: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  });

  ngOnInit() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });

    this.getRoute();
    this.changeTheme();
  }

  getRoute() {
    this._route.params
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((params) => (this.userMaterialId = params['id']));
  }

  changeTheme() {
    this.isDarkMode = this._themeService.isDarkMode();
    this._themeService.darkMode$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((mode: boolean) => (this.isDarkMode = mode));
  }

  rentalCreate() {
    if (this.rentalCreateForm.invalid) {
      this.rentalCreateForm.markAllAsTouched();
      return;
    }

    // Déjà au bon format : "YYYY-MM-DD" et "HH:mm"
    const payload: RentalCreateForm = {
      ...this.rentalCreateForm.getRawValue(),
      userMaterial: { id: Number(this.userMaterialId) } as UserMaterialModel,
      userFavor: { id: null } as unknown as UserFavorModel,
    };

    this._rentalService
      .rentalCreate(Number(this.userId), payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) =>{
          // console.log(response);
          this.messageError = '';
          this.messageSuccess = "Votre location sauvegardé";
          this.isSuccess.set(true);
          this.show.set(true);
        },
        error: (err) => {
          // console.log(err)
          this.messageError = "Un erreur s'est produit";
          this.messageSuccess = '';
          this.isSuccess.set(false);
          this.show.set(true);
        },

      });
  }

  private toIsoDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  private addDays(d: Date, days: number): Date {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + days);
    return copy;
  }
}
