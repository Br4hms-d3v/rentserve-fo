import { Component, OnDestroy, OnInit } from '@angular/core';
import { TuiButton, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../core/services/ThemeService';

@Component({
  selector: 'app-header',
  imports: [CommonModule, TuiButton, TuiDropdown, TuiDataList],
  templateUrl: './header.html',
  styleUrl: './header.less',
})
export class Header implements OnInit, OnDestroy {
  isDarkMode = false;
  selectedLanguage = 'fr';
  dropdownOpen = false;
  private sub!: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();
    this.sub = this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode));
  }

  toggleTheme() {
    this.themeService.toggleTheme(); // ← appelle le service, plus la variable locale
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.dropdownOpen = false; // close immediately after selected
  }
}
