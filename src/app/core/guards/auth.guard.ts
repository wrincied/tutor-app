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

function isGithubUser(user: { providerData: { providerId: string }[] }): boolean {
  return user.providerData.some((p) => p.providerId === 'github.com');
}

export const emailVerifiedGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const userService = inject(UserService);

  return resolveFirebaseUser(auth).pipe(
    switchMap((user) => {
      if (!user) {
        return of(router.createUrlTree(['/login']));
      }

      return from(user.reload()).pipe(
        switchMap(() => {
          if (user.emailVerified) {
            return of(true);
          }
          // Only GitHub super-admins skip Firebase emailVerified (admin UID allowlist).
          if (!isGithubUser(user)) {
            return of(router.createUrlTree(['/app/verify-email-notice']));
          }
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
