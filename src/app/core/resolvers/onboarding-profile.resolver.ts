import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { take } from 'rxjs/operators';
import type { UserProfile } from '@interfaces';
import { UserService } from '../services/user.service';

/** Профиль до отрисовки онбординга (без NG0100 и с bootstrap при 404). */
export const onboardingProfileResolver: ResolveFn<UserProfile> = () =>
  inject(UserService).ensureProfile().pipe(take(1));
