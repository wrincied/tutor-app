import { ApplicationConfig, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
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
      captureReferralFromLocation();
    }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, emailVerificationInterceptor])),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
  ],
};
