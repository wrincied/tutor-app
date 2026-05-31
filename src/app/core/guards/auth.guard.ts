import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';

import { resolveFirebaseUser } from '../utils/resolve-firebase-user';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return resolveFirebaseUser(auth).pipe(
    map((user) => (user ? true : router.createUrlTree(['/login']))),
  );
};

export const emailVerifiedGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return resolveFirebaseUser(auth).pipe(
    switchMap((user) => {
      if (!user) {
        return of(router.createUrlTree(['/login']));
      }

      // Форсируем обновление стейта пользователя с серверов Firebase,
      // чтобы получить актуальный статус emailVerified
      return from(user.reload()).pipe(
        map(() => {
          if (!user.emailVerified) {
            return router.createUrlTree(['/app/verify-email-notice']);
          }
          return true;
        })
      );
    })
  );
};