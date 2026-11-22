import { Injectable, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import {
  TUI_FRENCH_LANGUAGE,
  TUI_DUTCH_LANGUAGE,
  TUI_ENGLISH_LANGUAGE,
  TUI_GERMAN_LANGUAGE,
} from '@taiga-ui/i18n';

export type AppLanguage = 'fr' | 'nl' | 'en' | 'de';

const LANGUAGES = {
  fr: TUI_FRENCH_LANGUAGE,
  nl: TUI_DUTCH_LANGUAGE,
  en: TUI_ENGLISH_LANGUAGE,
  de: TUI_GERMAN_LANGUAGE,
};

const LOCALES: Record<AppLanguage, string> = {
  fr: 'fr-BE',
  nl: 'nl-BE',
  en: 'en-GB',
  de: 'de-DE',
};

@Injectable({
  providedIn: 'root',
})
export class LanguageState {
  readonly selectedLanguage = signal<AppLanguage>('fr');
  readonly locale = signal<string>('fr-BE');
  readonly tuiLanguage = signal(TUI_FRENCH_LANGUAGE);
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translocoService = inject(TranslocoService);
  private readonly languageState = inject(LanguageState);

  readonly selectedLanguage = this.languageState.selectedLanguage;
  readonly locale = this.languageState.locale;
  readonly tuiLanguage = this.languageState.tuiLanguage;

  initialize(): void {
    const savedLanguage =
      typeof localStorage !== 'undefined' ? localStorage.getItem('app-language') : null;

    const language: AppLanguage =
      savedLanguage === 'fr' ||
      savedLanguage === 'nl' ||
      savedLanguage === 'en' ||
      savedLanguage === 'de'
        ? savedLanguage
        : 'fr';

    this.setLanguage(language);
  }

  setLanguage(language: AppLanguage): void {
    this.selectedLanguage.set(language);
    this.locale.set(LOCALES[language]);
    this.tuiLanguage.set(LANGUAGES[language]);

    this.translocoService.setActiveLang(language);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('app-language', language);
    }
  }
}
