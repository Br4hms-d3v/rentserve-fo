import {
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../core/services/ThemeService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, NgClass],
  templateUrl: './footer.html',
  styleUrl: './footer.less',
})
export class Footer implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() companyName = 'RentServe';
  @Input() companyAddress = 'Adresse du siège social, Belgique';
  @Input() companyEmail = 'rentServe@e-company.be';
  @Input() companyPhone = '+32 000 00 00 00';
  @Input() companyNumber = 'BE 0000.000.000';
  @Input() vatNumber = 'BE 0000.000.000';

  readonly currentYear = new Date().getFullYear();
  protected isDarkMode = false;

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();

    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
        this.cdr.markForCheck();
      });
  }
  scrollToTop(): void {
    this.document.defaultView?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
