import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import type { User } from 'firebase/auth';

import { resolveFirebaseUser } from '../utils/resolve-firebase-user';
import { localeUrlTree } from '../i18n/locale-routing';
import { asUrlLang } from '../i18n/locale-url';
import { I18nService } from '../services/i18n.service';

/** Session: skip reload+force token after first successful verified check per UID. */
const verifiedUidSession = new Set<string>();

function loginTree(router: Router, lang: string, returnUrl?: string) {
  return localeUrlTree(router, lang, '/login', returnUrl ? { returnUrl } : undefined);
}

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const lang = asUrlLang(inject(I18nService).lang());

  return resolveFirebaseUser(auth).pipe(
    map((user) => (user ? true : loginTree(router, lang, state.url))),
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
  const lang = asUrlLang(inject(I18nService).lang());

  return resolveFirebaseUser(auth).pipe(
    switchMap((user) => {
      if (!user) {
        return of(loginTree(router, lang, state.url));
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
          return of(localeUrlTree(router, lang, '/app/verify-email-notice'));
        }),
      );
    }),
  );
};
