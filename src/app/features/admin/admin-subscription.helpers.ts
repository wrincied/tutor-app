import type { SubscriptionStatus } from '@interfaces';

export function adminStatusLabel(
  status: SubscriptionStatus | string,
  labels: { statusFree: string; statusPro: string; statusTrial: string },
): string {
  switch (status) {
    case 'pro':
      return labels.statusPro;
    case 'trial':
      return labels.statusTrial;
    default:
      return labels.statusFree;
  }
}

export function adminStatusClass(status: SubscriptionStatus | string): string {
  switch (status) {
    case 'pro':
      return 'admin-status admin-status--pro';
    case 'trial':
      return 'admin-status admin-status--trial';
    default:
      return 'admin-status admin-status--free';
  }
}

export function parseTimestamp(value: string | null | undefined): number {
  if (!value) {
    return 0;
  }
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? 0 : ms;
}
