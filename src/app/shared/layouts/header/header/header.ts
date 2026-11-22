import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { TuiButton, TuiDataList, TuiDropdown } from '@taiga-ui/core';

import { TranslocoModule } from '@jsverse/transloco';
import { Subscription } from 'rxjs';

import { ThemeService } from '../../../../core/services/ThemeService';

import { LanguageService, AppLanguage } from '../../../../core/services/languageService';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TuiButton, TuiDropdown, TuiDataList, TranslocoModule],
  templateUrl: './header.html',
  styleUrl: './header.less',
})
export class Header implements OnInit, OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);

  isDarkMode = false;
  dropdownOpen = false;

  // Current selected language
  readonly selectedLanguage = this.languageService.selectedLanguage;

  private sub?: Subscription;

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();

    this.sub = this.themeService.darkMode$.subscribe((mode: boolean) => {
      this.isDarkMode = mode;
    });
  }

  // Toggle dark/light theme
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Change application language
  selectLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
    this.dropdownOpen = false;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
