import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TuiButton, TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { Subscription } from 'rxjs';

import { ThemeService } from '../../../../core/services/ThemeService';

type Language = 'fr' | 'nl' | 'en' | 'de';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TuiButton, TuiDropdown, TuiDataList],
  templateUrl: './header.html',
  styleUrl: './header.less',
})
export class Header implements OnInit, OnDestroy {
  isDarkMode = false;
  selectedLanguage: Language = 'fr';
  dropdownOpen = false;

  private sub?: Subscription;

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();

    this.sub = this.themeService.darkMode$.subscribe((mode: boolean) => {
      this.isDarkMode = mode;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  selectLanguage(lang: Language): void {
    this.selectedLanguage = lang;
    this.dropdownOpen = false;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
