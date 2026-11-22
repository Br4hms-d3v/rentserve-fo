import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  isDevMode,
  provideAppInitializer,
} from '@angular/core';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import localeFr from '@angular/common/locales/fr';
import localeNl from '@angular/common/locales/nl';
import localeEn from '@angular/common/locales/en-GB';
import localeDe from '@angular/common/locales/de';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { provideTaiga } from '@taiga-ui/core';
import { TUI_LANGUAGE } from '@taiga-ui/i18n';

import { provideTransloco } from '@jsverse/transloco';

import { routes } from './app.routes';
import { LanguageState, LanguageService } from './core/services/languageService';

import { TranslocoHttpLoader } from './core/i18n/transloco-http-loader';

// Register Angular locales
registerLocaleData(localeFr, 'fr-BE');
registerLocaleData(localeNl, 'nl-BE');
registerLocaleData(localeEn, 'en-GB');
registerLocaleData(localeDe, 'de-DE');

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideTaiga(),
    provideHttpClient(),

    // Transloco
    provideTransloco({
      config: {
        availableLangs: ['fr', 'nl', 'en', 'de'],
        defaultLang: 'fr',
        fallbackLang: 'fr',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),

    // Angular default locale
    {
      provide: LOCALE_ID,
      useValue: 'fr-BE',
    },

    // Taiga UI language
    {
      provide: TUI_LANGUAGE,
      useFactory: () => inject(LanguageState).tuiLanguage,
    },

    // Initialize language service at application startup
    provideAppInitializer(() => {
      inject(LanguageService);
    }),
  ],
};
