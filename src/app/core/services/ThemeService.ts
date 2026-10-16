import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly darkMode = new BehaviorSubject<boolean>(false);

  readonly darkMode$ = this.darkMode.asObservable();

  toggleTheme(): void {
    this.setDarkMode(!this.darkMode.value);
  }

  isDarkMode(): boolean {
    return this.darkMode.value;
  }

  private setDarkMode(enabled: boolean): void {
    this.darkMode.next(enabled);

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
    }
  }
}
