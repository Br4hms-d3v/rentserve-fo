import { Component } from '@angular/core';
import { TuiButton, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, TuiButton, TuiDropdown, TuiDataList],
  templateUrl: './header.html',
  styleUrl: './header.less',
})
export class Header {
  isDarkMode = false;
  selectedLanguage = 'fr';
  dropdownOpen = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.dropdownOpen = false; // close immediately after selected
  }
}
