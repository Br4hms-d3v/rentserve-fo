import { provideTaiga } from '@taiga-ui/core';
import { provideAnimations } from '@angular/platform-browser/animations';

import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';

import { registerLocaleData } from '@angular/common';

import localeFr from '@angular/common/locales/fr';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Register French locale
registerLocaleData(localeFr, 'fr-FR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideTaiga(),

    {
      provide: LOCALE_ID,
      useValue: 'fr-FR',
    },
  ],
};
