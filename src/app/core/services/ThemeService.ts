import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkMode.asObservable();

  /**
   * Switch dark mode on or off
   */
  toggleTheme() {
    this.darkMode.next(!this.darkMode.value);
  }
  /**
   * Check if dark mode is active
   * @returns true if dark mode, false if light mode
   */
  isDarkMode() {
    return this.darkMode.value;
  }
}
