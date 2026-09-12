import { ApplicationConfig, PLATFORM_ID, provideAppInitializer, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { emailVerificationInterceptor } from './core/interceptors/email-verification.interceptor';
import { provideI18nInitializer } from './core/services/i18n.service';
import { captureReferralFromLocation } from './core/utils/referral-capture';
import { environment } from '@environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideI18nInitializer(),
    provideAppInitializer(() => {
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        captureReferralFromLocation();
      }
    }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, emailVerificationInterceptor])),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAnalytics(() => {
      // Analytics is browser-only; skip during prerender/SSR.
      if (!isPlatformBrowser(inject(PLATFORM_ID))) {
        return null as never;
      }
      return getAnalytics();
    }),
    provideAuth(() => getAuth()),
    provideClientHydration(withEventReplay()),
  ],
};
