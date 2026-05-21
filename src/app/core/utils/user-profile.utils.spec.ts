import { describe, expect, it } from 'vitest';
import {
  canPurchaseSubscription,
  isTaxModeConfigured,
  normalizeTaxMode,
  subscriptionStatusLabel,
} from './user-profile.utils';

describe('user-profile.utils', () => {
  it('normalizeTaxMode treats unset as none', () => {
    expect(normalizeTaxMode(undefined)).toBe('none');
    expect(normalizeTaxMode('austria-self-employed')).toBe('at-self-employed');
  });

  it('isTaxModeConfigured is false until set', () => {
    expect(isTaxModeConfigured('none')).toBe(false);
    expect(isTaxModeConfigured('de-kleinunternehmer')).toBe(true);
  });

  it('canPurchaseSubscription needs tax and free plan', () => {
    expect(
      canPurchaseSubscription({
        _id: '1',
        email: 'a@b.c',
        country_settings: 'AT',
        tax_mode: 'none',
        tax_mode_configured: false,
        timezone: 'UTC',
        subscription_status: 'free',
      }),
    ).toBe(false);
    expect(
      canPurchaseSubscription({
        _id: '1',
        email: 'a@b.c',
        country_settings: 'AT',
        tax_mode: 'at-self-employed',
        tax_mode_configured: true,
        timezone: 'UTC',
        subscription_status: 'free',
      }),
    ).toBe(true);
  });

  it('subscriptionStatusLabel maps plan', () => {
    const labels = { free: 'Free', pro: 'Pro', trial: 'Trial' };
    expect(subscriptionStatusLabel('pro', labels)).toBe('Pro');
  });
});
