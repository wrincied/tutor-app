import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { peekStoredReferral } from '../utils/referral-capture';

function isBackendApiUrl(url: string): boolean {
  return url.includes('/api/');
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (!isBackendApiUrl(req.url)) {
    return next(req);
  }

  return from(authService.getIdToken()).pipe(
    switchMap((token) => {
      if (token) {
        const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
        const ref = peekStoredReferral();
        if (ref && (req.url.includes('/auth/me') || req.url.includes('/auth/bootstrap'))) {
          headers['X-Referral-Code'] = ref;
        }
        req = req.clone({ setHeaders: headers });
      }
      return next(req);
    }),
  );
};
