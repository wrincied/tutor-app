import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

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
    map((user) => {
      if (!user) {
        return router.createUrlTree(['/login']);
      }
      if (!user.emailVerified) {
        return router.createUrlTree(['/app/verify-email-notice']);
      }
      return true;
    }),
  );
};
