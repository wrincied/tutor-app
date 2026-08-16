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

  it('treats ?billing=success as success and clears pending', () => {
    markBillingCheckoutPending();
    window.history.replaceState({}, '', '/app/home?billing=success');
    expect(consumeBillingReturnFlag()).toBe('success');
    expect(sessionStorage.getItem(BILLING_RETURN_STORAGE_KEY)).toBeNull();
  });

  it('does not treat abandoned pending checkout as success', () => {
    markBillingCheckoutPending();
    window.history.replaceState({}, '', '/app/payment?plan=pro');
    expect(consumeBillingReturnFlag()).toBe('cancel');
    expect(sessionStorage.getItem(BILLING_RETURN_STORAGE_KEY)).toBeNull();
  });

  it('treats ?billing=cancel as cancel', () => {
    markBillingCheckoutPending();
    window.history.replaceState({}, '', '/app/pricing?billing=cancel');
    expect(consumeBillingReturnFlag()).toBe('cancel');
  });
});
