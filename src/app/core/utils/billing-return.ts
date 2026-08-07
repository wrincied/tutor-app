/** Set before redirecting to Stripe Checkout; consumed on return to the app. */
export const BILLING_RETURN_STORAGE_KEY = 'simple4u_billing_return_v1';

export type BillingReturnKind = 'success' | 'cancel';

export function markBillingCheckoutPending(): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }
  sessionStorage.setItem(BILLING_RETURN_STORAGE_KEY, 'pending');
}

export function consumeBillingReturnFlag(): BillingReturnKind | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const fromSearch = new URLSearchParams(window.location.search).get('billing');
  const hash = window.location.hash || '';
  const hashQuery = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '';
  const fromHash = new URLSearchParams(hashQuery).get('billing');
  const fromUrl = fromSearch || fromHash;

  let fromStorage: string | null = null;
  try {
    fromStorage = sessionStorage.getItem(BILLING_RETURN_STORAGE_KEY);
  } catch {
    fromStorage = null;
  }

  if (fromUrl === 'success' || fromStorage === 'pending' || fromStorage === 'success') {
    try {
      sessionStorage.removeItem(BILLING_RETURN_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return 'success';
  }

  if (fromUrl === 'cancel') {
    try {
      sessionStorage.removeItem(BILLING_RETURN_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return 'cancel';
  }

  return null;
}

/** Strip billing= from both search and hash query without leaving the current route. */
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
