import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import type { User } from 'firebase/auth';

import { resolveFirebaseUser } from '../utils/resolve-firebase-user';

/** Session: skip reload+force token after first successful verified check per UID. */
const verifiedUidSession = new Set<string>();

function loginTree(router: Router, returnUrl?: string) {
  return router.createUrlTree(['/login'], {
    queryParams: returnUrl ? { returnUrl } : undefined,
  });
}

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return resolveFirebaseUser(auth).pipe(
    map((user) => (user ? true : loginTree(router, state.url))),
  );
};

function refreshIdToken(user: User) {
  return from(user.getIdToken(true)).pipe(
    map(() => {
      verifiedUidSession.add(user.uid);
      return true as const;
    }),
  );
}

export const emailVerifiedGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return resolveFirebaseUser(auth).pipe(
    switchMap((user) => {
      if (!user) {
        return of(loginTree(router, state.url));
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
          return of(router.createUrlTree(['/app/verify-email-notice']));
        }),
      );
    }),
  );
};
