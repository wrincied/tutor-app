import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { catchError, map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import type { User } from 'firebase/auth';

import { resolveFirebaseUser } from '../utils/resolve-firebase-user';
import { UserService } from '../services/user.service';

/** Session: skip reload+force token after first successful verified check per UID. */
const verifiedUidSession = new Set<string>();

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

function refreshIdToken(user: User) {
  return from(user.getIdToken(true)).pipe(
    map(() => {
      verifiedUidSession.add(user.uid);
      return true as const;
    }),
  );
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

      // Already verified this session — skip Firebase reload + force token refresh.
      if (user.emailVerified && verifiedUidSession.has(user.uid)) {
        return of(true);
      }

      return from(user.reload()).pipe(
        switchMap(() => {
          if (user.emailVerified) {
            // Без force refresh JWT ещё с email_verified: false → 403 на API.
            return refreshIdToken(user);
          }
          // Only GitHub super-admins skip Firebase emailVerified (admin UID allowlist).
          if (!isGithubUser(user)) {
            return of(router.createUrlTree(['/app/verify-email-notice']));
          }
          return userService.ensureProfile().pipe(
            switchMap((profile) =>
              profile.role === 'super_admin'
                ? refreshIdToken(user)
                : of(router.createUrlTree(['/app/verify-email-notice'])),
            ),
            catchError(() => of(router.createUrlTree(['/app/verify-email-notice']))),
          );
        }),
      );
    }),
  );
};
