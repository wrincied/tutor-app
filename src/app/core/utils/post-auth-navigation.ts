import type { UserProfile } from '@interfaces';

/** Маршрут после успешной аутентификации и bootstrap. */
export function postAuthPath(profile: UserProfile, emailVerified: boolean): string {
  // Super-admin (GitHub) skips email verification / onboarding gates.
  if (profile.role === 'super_admin') {
    return '/app/admin';
  }
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
