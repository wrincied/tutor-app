import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LocaleRouter } from '../i18n/locale-router.service';

export const emailVerificationInterceptor: HttpInterceptorFn = (req, next) => {
  const localeRouter = inject(LocaleRouter);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 403 && err.error?.code === 'EMAIL_NOT_VERIFIED') {
        const email = err.error?.email ? String(err.error.email) : '';
        void localeRouter.navigate('/app/verify-email-notice', {
          queryParams: email ? { email } : {},
        });
      }
      return throwError(() => err);
    }),
  );
};
