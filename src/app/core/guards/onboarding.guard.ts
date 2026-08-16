import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, map, take } from 'rxjs/operators';
import { of } from 'rxjs';

function redirectOnProfileError(err: unknown, router: Router, fallback: string) {
  if (err instanceof HttpErrorResponse && err.status === 401) {
    return of(router.createUrlTree(['/login']));
  }
  return of(router.createUrlTree([fallback]));
}

/** Профиль заполнен — иначе на онбординг. */
export const onboardingGuard: CanActivateFn = () => {
  const userSvc = inject(UserService);
  const router = inject(Router);

  return userSvc.ensureProfile().pipe(
    take(1),
    map((profile) =>
      profile.onboarding_completed ? true : router.createUrlTree(['/app/onboarding']),
    ),
    catchError((err) => redirectOnProfileError(err, router, '/app/onboarding')),
  );
};

/** Только для страницы онбординга: уже завершён → home (кроме повторного согласия). */
export const onboardingPageGuard: CanActivateFn = () => {
  const userSvc = inject(UserService);
  const router = inject(Router);

  return userSvc.getProfile().pipe(
    take(1),
    map((profile) => {
      if (profile.data_consent_accepted === false) {
        return true;
      }
      return profile.onboarding_completed ? router.createUrlTree(['/app/home']) : true;
    }),
    catchError((err) => redirectOnProfileError(err, router, '/app/onboarding')),
  );
};

/** Отказ от сбора данных — снова на онбординг (можно принять согласие), не в приложение. */
export const dataConsentGuard: CanActivateFn = () => {
  const userSvc = inject(UserService);
  const router = inject(Router);

  return userSvc.ensureProfile().pipe(
    take(1),
    map((profile) =>
      profile.data_consent_accepted === false
        ? router.createUrlTree(['/app/onboarding'])
        : true,
    ),
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return of(router.createUrlTree(['/login']));
      }
      // Профиль не загрузился (сеть, 500) — не выкидываем на login
      return of(true);
    }),
  );
};
