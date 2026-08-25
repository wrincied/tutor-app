const STORAGE_KEY = 'simple4u.ref';

export function normalizeReferralCode(raw: string | null | undefined): string {
  return String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 12);
}

export function peekStoredReferral(): string | null {
  try {
    const code = normalizeReferralCode(localStorage.getItem(STORAGE_KEY));
    return code || null;
  } catch {
    return null;
  }
}

export function storeReferralCode(code: string): void {
  const normalized = normalizeReferralCode(code);
  if (!normalized) {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, normalized);
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearStoredReferral(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Persist ?ref= from the current URL (register, landing, Google redirect return). */
export function captureReferralFromLocation(search = window.location.search): string | null {
  const params = new URLSearchParams(search);
  const fromQuery = normalizeReferralCode(params.get('ref'));
  if (fromQuery) {
    storeReferralCode(fromQuery);
    return fromQuery;
  }
  return peekStoredReferral();
}
