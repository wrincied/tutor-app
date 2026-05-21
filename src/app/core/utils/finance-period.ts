export type FinancePeriodPreset = 'all' | 'month' | 'year';

export interface FinancePeriodRange {
  from?: string;
  to?: string;
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Диапазон YYYY-MM-DD для запроса summary (UTC-границы дня). */
export function financePeriodRange(preset: FinancePeriodPreset, now = new Date()): FinancePeriodRange {
  if (preset === 'all') {
    return {};
  }

  if (preset === 'month') {
    const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
    return { from: toIsoDate(from), to: toIsoDate(to) };
  }

  const from = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const to = new Date(Date.UTC(now.getUTCFullYear(), 11, 31));
  return { from: toIsoDate(from), to: toIsoDate(to) };
}
