/** Brand domain (@simple4u.at): signup blocked except whitelist. */

const PROTECTED_DOMAINS = ['simple4u.at'] as const;
const WHITELIST = ['admin@simple4u.at'] as const;

export function normalizeEmail(email: string | null | undefined): string {
  return String(email ?? '')
    .trim()
    .toLowerCase();
}

function emailDomain(email: string): string {
  const normalized = normalizeEmail(email);
  const at = normalized.lastIndexOf('@');
  if (at <= 0 || at === normalized.length - 1) {
    return '';
  }
  return normalized.slice(at + 1);
}

export function isBrandEmailWhitelisted(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email);
  return (WHITELIST as readonly string[]).includes(normalized);
}

/** Protected domain and not on whitelist → show as "already taken". */
export function isBlockedBrandEmail(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return false;
  }
  const domain = emailDomain(normalized);
  if (!(PROTECTED_DOMAINS as readonly string[]).includes(domain)) {
    return false;
  }
  return !isBrandEmailWhitelisted(normalized);
}

export function isAdminAllowlistedEmail(email: string | null | undefined): boolean {
  return isBrandEmailWhitelisted(email);
}
