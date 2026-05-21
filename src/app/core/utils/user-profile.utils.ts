import type { SubscriptionStatus, TaxMode, UserProfile } from '@interfaces';

const CONFIGURED_TAX_MODES = new Set<string>([
  'at-self-employed',
  'de-kleinunternehmer',
  'pl-ryczalt',
  'ru-usn',
  'ru-ip',
  'by-ip',
  'kz-ip',
]);

export function normalizeTaxMode(raw: string | null | undefined): TaxMode | 'none' {
  const value = String(raw ?? 'none').trim();
  if (!value || value === 'none') {
    return 'none';
  }
  if (value === 'austria-self-employed') {
    return 'at-self-employed';
  }
  return value as TaxMode;
}

export function isTaxModeConfigured(raw: string | null | undefined): boolean {
  const mode = normalizeTaxMode(raw);
  return mode !== 'none' && CONFIGURED_TAX_MODES.has(mode);
}

export function canPurchaseSubscription(profile: UserProfile | null | undefined): boolean {
  if (!profile) {
    return false;
  }
  const taxOk = profile.tax_mode_configured ?? isTaxModeConfigured(profile.tax_mode);
  return taxOk && (profile.subscription_status as SubscriptionStatus) === 'free';
}

export function subscriptionStatusLabel(
  status: string,
  labels: { free: string; pro: string; trial: string },
): string {
  if (status === 'pro') {
    return labels.pro;
  }
  if (status === 'trial') {
    return labels.trial;
  }
  return labels.free;
}

export const SETUP_TAX_MODES: TaxMode[] = [
  'at-self-employed',
  'de-kleinunternehmer',
  'pl-ryczalt',
  'ru-usn',
  'ru-ip',
  'by-ip',
  'kz-ip',
];
