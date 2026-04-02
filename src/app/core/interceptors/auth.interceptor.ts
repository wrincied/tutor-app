import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/** Только запросы к бэкенду `/api/` (не трогаем Firebase и прочие origin). */
function isBackendApiUrl(url: string): boolean {
  return url.includes('/api/');
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();

  if (token && isBackendApiUrl(req.url)) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
