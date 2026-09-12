import type { UserProfile } from '@interfaces';
import { asUrlLang, localizePath, stripLocalePrefix, type UrlLang } from '../i18n/locale-url';

/**
 * Only same-origin app deep links. Blocks open redirects (`//evil`, external URLs).
 * Accepts both `/app/...` and `/{lang}/app/...`.
 */
export function safeReturnUrl(
  raw: string | null | undefined,
  lang: UrlLang | string = 'de',
): string | null {
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
  const stripped = stripLocalePrefix(value.split('?')[0]);
  // Stay inside the authenticated app shell (not landing/login loops).
  if (!stripped.startsWith('/app')) {
    return null;
  }
  // Avoid bouncing back to auth gates as "return".
  if (stripped.startsWith('/app/verify-email-notice') || stripped.startsWith('/app/onboarding')) {
    return null;
  }
  const query = value.includes('?') ? value.slice(value.indexOf('?')) : '';
  return `${localizePath(stripped, asUrlLang(lang))}${query}`;
}

/** Маршрут после успешной аутентификации и bootstrap (обычный login / Google). */
export function postAuthPath(
  profile: UserProfile,
  emailVerified: boolean,
  returnUrl?: string | null,
  lang: UrlLang | string = 'de',
): string {
  const urlLang = asUrlLang(lang);
  // Admin console is only via /admin-login + password — never auto-route here.
  if (!emailVerified) {
    return localizePath('/app/verify-email-notice', urlLang);
  }
  // Declined earlier: allow signing in again and re-running onboarding to accept.
  if (profile.data_consent_accepted === false || !profile.onboarding_completed) {
    return localizePath('/app/onboarding', urlLang);
  }
  return safeReturnUrl(returnUrl, urlLang) ?? localizePath('/app/home', urlLang);
}
