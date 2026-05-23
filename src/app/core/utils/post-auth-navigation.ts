import type { UserProfile } from '@interfaces';

/** Маршрут после успешной аутентификации и bootstrap. */
export function postAuthPath(profile: UserProfile, emailVerified: boolean): string {
  if (!emailVerified) {
    return '/app/verify-email-notice';
  }
  if (profile.data_consent_accepted === false) {
    return '/login';
  }
  if (!profile.onboarding_completed) {
    return '/app/onboarding';
  }
  return '/app/home';
}
