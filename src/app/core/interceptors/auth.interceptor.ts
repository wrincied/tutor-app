import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

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
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      }
      return next(req);
    }),
  );
};
