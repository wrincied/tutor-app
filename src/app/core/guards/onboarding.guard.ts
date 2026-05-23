import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

/** Профиль заполнен — иначе на онбординг. */
export const onboardingGuard: CanActivateFn = () => {
  const userSvc = inject(UserService);
  const router = inject(Router);

  return userSvc.ensureProfile().pipe(
    take(1),
    map((profile) =>
      profile.onboarding_completed ? true : router.createUrlTree(['/app/onboarding']),
    ),
  );
};

/** Только для страницы онбординга: уже завершён → home. */
export const onboardingPageGuard: CanActivateFn = () => {
  const userSvc = inject(UserService);
  const router = inject(Router);

  return userSvc.getProfile().pipe(
    take(1),
    map((profile) =>
      profile.onboarding_completed ? router.createUrlTree(['/app/home']) : true,
    ),
  );
};

/** Отказ от сбора данных — выход и login. */
export const dataConsentGuard: CanActivateFn = () => {
  const userSvc = inject(UserService);
  const auth = inject(AuthService);
  const router = inject(Router);

  return userSvc.ensureProfile().pipe(
    take(1),
    switchMap((profile) => {
      if (profile.data_consent_accepted !== false) {
        return of(true);
      }
      return auth.logout().pipe(
        map(() =>
          router.createUrlTree(['/login'], {
            queryParams: { consent: 'declined' },
          }),
        ),
      );
    }),
  );
};
