import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

function firebaseClaimsFromJwt(token: string): {
  sign_in_provider?: string;
} {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? '')) as {
      firebase?: { sign_in_provider?: string };
    };
    return payload.firebase ?? {};
  } catch {
    return {};
  }
}

/** Super-admin UI: role + GitHub provider on ID token (2FA via GitHub account). */
export const adminGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const auth = inject(AuthService);
  const router = inject(Router);

  return userService.ensureProfile().pipe(
    take(1),
    switchMap((profile) => {
      if (profile.role !== 'super_admin') {
        return of(router.createUrlTree(['/app/home']));
      }
      return from(auth.getIdToken()).pipe(
        map((token) => {
          if (!token) {
            return router.createUrlTree(['/admin-login']);
          }
          const claims = firebaseClaimsFromJwt(token);
          if (claims.sign_in_provider !== 'github.com') {
            return router.createUrlTree(['/admin-login']);
          }
          return true;
        }),
      );
    }),
    catchError(() => of(router.createUrlTree(['/admin-login']))),
  );
};
