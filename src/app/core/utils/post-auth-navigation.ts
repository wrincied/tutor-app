import type { UserProfile } from '@interfaces';

/** Маршрут после успешной аутентификации и bootstrap (обычный login / Google). */
export function postAuthPath(profile: UserProfile, emailVerified: boolean): string {
  // Admin console is only via /admin-login + GitHub — never auto-route here.
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
