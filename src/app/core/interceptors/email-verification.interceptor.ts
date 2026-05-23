import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const emailVerificationInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 403 && err.error?.code === 'EMAIL_NOT_VERIFIED') {
        const email = err.error?.email ? String(err.error.email) : '';
        void router.navigate(['/app/verify-email-notice'], {
          queryParams: email ? { email } : {},
        });
      }
      return throwError(() => err);
    }),
  );
};
