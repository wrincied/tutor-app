/** Checkout return marker. Bumped so old cached clients cannot reuse a stale `pending` success path. */
export const BILLING_RETURN_STORAGE_KEY = 'simple4u_billing_return_v3';
const LEGACY_BILLING_RETURN_KEYS = [
  'simple4u_billing_return_v1',
  'simple4u_billing_return_v2',
  BILLING_RETURN_STORAGE_KEY,
];

export type BillingReturnKind = 'success' | 'cancel';

export function markBillingCheckoutPending(): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }
  sessionStorage.setItem(BILLING_RETURN_STORAGE_KEY, 'pending');
}

function readCheckoutSessionId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const fromSearch = new URLSearchParams(window.location.search).get('session_id');
  if (fromSearch && fromSearch.startsWith('cs_')) {
    return fromSearch;
  }
  const hash = window.location.hash || '';
  const hashQuery = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '';
  const fromHash = new URLSearchParams(hashQuery).get('session_id');
  if (fromHash && fromHash.startsWith('cs_')) {
    return fromHash;
  }
  return null;
}

export function peekCheckoutSessionId(): string | null {
  return readCheckoutSessionId();
}

/**
 * Success ONLY with Stripe redirect: billing=success + session_id=cs_…
 * Browser Back / pending storage must never unlock Pro/Trial.
 */
export function consumeBillingReturnFlag(): BillingReturnKind | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const fromSearch = new URLSearchParams(window.location.search).get('billing');
  const hash = window.location.hash || '';
  const hashQuery = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '';
  const fromHash = new URLSearchParams(hashQuery).get('billing');
  const fromUrl = fromSearch || fromHash;
  const sessionId = readCheckoutSessionId();

  let hadPending = false;
  try {
    for (const key of LEGACY_BILLING_RETURN_KEYS) {
      const value = sessionStorage.getItem(key);
      if (value === 'pending' || value === 'success') {
        hadPending = true;
      }
      sessionStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }

  if (fromUrl === 'success' && sessionId) {
    return 'success';
  }

  if (fromUrl === 'success' && !sessionId) {
    // Fake/legacy success without Stripe session id → treat as cancel.
    return 'cancel';
  }

  if (fromUrl === 'cancel' || hadPending) {
    return 'cancel';
  }

  return null;
}

/** Strip billing= / session_id from URL without leaving the current route. */
export function clearBillingQueryFromUrl(): void {
  if (typeof window === 'undefined' || typeof history === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete('billing');
  url.searchParams.delete('session_id');

  const hash = url.hash || '';
  if (hash.includes('?')) {
    const path = hash.slice(0, hash.indexOf('?'));
    const params = new URLSearchParams(hash.slice(hash.indexOf('?') + 1));
    params.delete('billing');
    params.delete('session_id');
    const next = params.toString();
    url.hash = next ? `${path}?${next}` : path;
  }

  history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
}
