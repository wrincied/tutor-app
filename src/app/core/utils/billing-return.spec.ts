/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest';
import {
  BILLING_RETURN_STORAGE_KEY,
  consumeBillingReturnFlag,
  markBillingCheckoutPending,
} from './billing-return';

describe('billing-return', () => {
  afterEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('requires session_id for success', () => {
    markBillingCheckoutPending();
    window.history.replaceState(
      {},
      '',
      '/app/home?billing=success&session_id=cs_test_123',
    );
    expect(consumeBillingReturnFlag()).toBe('success');
    expect(sessionStorage.getItem(BILLING_RETURN_STORAGE_KEY)).toBeNull();
  });

  it('rejects billing=success without session_id', () => {
    window.history.replaceState({}, '', '/app/home?billing=success');
    expect(consumeBillingReturnFlag()).toBe('cancel');
  });

  it('treats abandoned pending checkout as cancel', () => {
    markBillingCheckoutPending();
    window.history.replaceState({}, '', '/app/payment?plan=pro');
    expect(consumeBillingReturnFlag()).toBe('cancel');
    expect(sessionStorage.getItem(BILLING_RETURN_STORAGE_KEY)).toBeNull();
  });

  it('clears legacy pending keys as cancel', () => {
    sessionStorage.setItem('simple4u_billing_return_v1', 'pending');
    window.history.replaceState({}, '', '/app/payment');
    expect(consumeBillingReturnFlag()).toBe('cancel');
  });
});
