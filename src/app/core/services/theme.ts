import { inject, Injectable, signal } from '@angular/core';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private readonly darkTheme = inject(TUI_DARK_MODE);

  private readonly darkMode = new BehaviorSubject<boolean>(false);
  public readonly darkMode$ = this.darkMode.asObservable();

  toggleTheme() {
    this.darkMode.next(!this.darkMode.value);
  }

  isDarkMode() {
    return this.darkMode.value;
  }
}
