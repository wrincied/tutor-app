import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, map, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { localeUrlTree } from '../i18n/locale-routing';
import { asUrlLang } from '../i18n/locale-url';
import { I18nService } from '../services/i18n.service';

function redirectOnProfileError(err: unknown, router: Router, lang: string, fallback: string) {
  if (err instanceof HttpErrorResponse && err.status === 401) {
    return of(localeUrlTree(router, lang, '/login'));
  }
  return of(localeUrlTree(router, lang, fallback));
}

/** Профиль заполнен — иначе на онбординг. */
export const onboardingGuard: CanActivateFn = () => {
  const userSvc = inject(UserService);
  const router = inject(Router);
  const lang = asUrlLang(inject(I18nService).lang());

  return userSvc.ensureProfile().pipe(
    take(1),
    map((profile) =>
      profile.onboarding_completed ? true : localeUrlTree(router, lang, '/app/onboarding'),
    ),
    catchError((err) => redirectOnProfileError(err, router, lang, '/app/onboarding')),
  );
};

/** Только для страницы онбординга: уже завершён → home (кроме повторного согласия). */
export const onboardingPageGuard: CanActivateFn = () => {
  const userSvc = inject(UserService);
  const router = inject(Router);
  const lang = asUrlLang(inject(I18nService).lang());

  return userSvc.getProfile().pipe(
    take(1),
    map((profile) => {
      if (profile.data_consent_accepted === false) {
        return true;
      }
      return profile.onboarding_completed ? localeUrlTree(router, lang, '/app/home') : true;
    }),
    catchError((err) => redirectOnProfileError(err, router, lang, '/app/onboarding')),
  );
};

/** Отказ от сбора данных — снова на онбординг (можно принять согласие), не в приложение. */
export const dataConsentGuard: CanActivateFn = () => {
  const userSvc = inject(UserService);
  const router = inject(Router);
  const lang = asUrlLang(inject(I18nService).lang());

  return userSvc.ensureProfile().pipe(
    take(1),
    map((profile) =>
      profile.data_consent_accepted === false
        ? localeUrlTree(router, lang, '/app/onboarding')
        : true,
    ),
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return of(localeUrlTree(router, lang, '/login'));
      }
      // Профиль не загрузился (сеть, 500) — не выкидываем на login
      return of(true);
    }),
  );
};
