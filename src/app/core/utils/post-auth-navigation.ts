import type { UserProfile } from '@interfaces';

/**
 * Only same-origin app deep links. Blocks open redirects (`//evil`, external URLs).
 */
export function safeReturnUrl(raw: string | null | undefined): string | null {
  if (!raw) {
    return null;
  }
  const value = raw.trim();
  if (!value.startsWith('/')) {
    return null;
  }
  if (value.startsWith('//') || value.includes('://')) {
    return null;
  }
  // Stay inside the authenticated app shell (not landing/login loops).
  if (!value.startsWith('/app')) {
    return null;
  }
  // Avoid bouncing back to auth gates as "return".
  if (
    value.startsWith('/app/verify-email-notice') ||
    value.startsWith('/app/onboarding')
  ) {
    return null;
  }
  return value;
}

/** Маршрут после успешной аутентификации и bootstrap (обычный login / Google). */
export function postAuthPath(
  profile: UserProfile,
  emailVerified: boolean,
  returnUrl?: string | null,
): string {
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
  return safeReturnUrl(returnUrl) ?? '/app/home';
}
