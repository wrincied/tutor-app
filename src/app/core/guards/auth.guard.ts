import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { catchError, map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';

import { resolveFirebaseUser } from '../utils/resolve-firebase-user';
import { UserService } from '../services/user.service';

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
  const userService = inject(UserService);

  return resolveFirebaseUser(auth).pipe(
    switchMap((user) => {
      if (!user) {
        return of(router.createUrlTree(['/login']));
      }

      // Форсируем обновление стейта пользователя с серверов Firebase,
      // чтобы получить актуальный статус emailVerified
      return from(user.reload()).pipe(
        switchMap(() => {
          if (user.emailVerified) {
            return of(true);
          }
          // GitHub super-admins are not gated on Firebase emailVerified.
          return userService.ensureProfile().pipe(
            map((profile) =>
              profile.role === 'super_admin'
                ? true
                : router.createUrlTree(['/app/verify-email-notice']),
            ),
            catchError(() => of(router.createUrlTree(['/app/verify-email-notice']))),
          );
        }),
      );
    }),
  );
};
