import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.ensureProfile().pipe(
    take(1),
    map((profile) =>
      profile.role === 'super_admin' ? true : router.createUrlTree(['/app/home']),
    ),
    catchError(() => of(router.createUrlTree(['/app/home']))),
  );
};
