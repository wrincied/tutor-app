import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { localeUrlTree } from '../i18n/locale-routing';
import { asUrlLang } from '../i18n/locale-url';
import { AuthService } from '../services/auth.service';
import { I18nService } from '../services/i18n.service';
import { UserService } from '../services/user.service';
import { isAdminAllowlistedEmail } from '../utils/brand-email';

function firebaseClaimsFromJwt(token: string): {
  sign_in_provider?: string;
  email?: string;
} {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? '')) as {
      email?: string;
      firebase?: { sign_in_provider?: string };
    };
    return {
      sign_in_provider: payload.firebase?.sign_in_provider,
      email: payload.email,
    };
  } catch {
    return {};
  }
}

/** Super-admin UI: role + password provider + allowlisted admin email. */
export const adminGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const auth = inject(AuthService);
  const router = inject(Router);
  const lang = asUrlLang(inject(I18nService).lang());

  return userService.ensureProfile().pipe(
    take(1),
    switchMap((profile) => {
      if (profile.role !== 'super_admin') {
        return of(localeUrlTree(router, lang, '/admin-login'));
      }
      return from(auth.getIdToken()).pipe(
        map((token) => {
          if (!token) {
            return localeUrlTree(router, lang, '/admin-login');
          }
          const claims = firebaseClaimsFromJwt(token);
          if (claims.sign_in_provider !== 'password') {
            return localeUrlTree(router, lang, '/admin-login');
          }
          if (!isAdminAllowlistedEmail(claims.email || profile.email)) {
            return localeUrlTree(router, lang, '/admin-login');
          }
          return true;
        }),
      );
    }),
    catchError(() => of(localeUrlTree(router, lang, '/admin-login'))),
  );
};
