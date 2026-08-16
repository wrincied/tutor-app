export type FinancePeriodPreset = 'all' | 'month' | 'year';

export interface FinancePeriodRange {
  from?: string;
  to?: string;
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function toIsoDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Сегодня (локальная дата) как YYYY-MM-DD для summary. */
export function financeTodayRange(now = new Date()): FinancePeriodRange {
  const iso = toIsoDateLocal(now);
  return { from: iso, to: iso };
}

/** Локальный день YYYY-MM-DD → from/to для summary. */
export function financeDayRange(dayIso: string): FinancePeriodRange {
  return { from: dayIso, to: dayIso };
}

/** Текущая календарная неделя (пн–вс, локальные даты). */
export function financeWeekRange(now = new Date()): FinancePeriodRange {
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekday = (day.getDay() + 6) % 7; // Mon=0
  const monday = new Date(day);
  monday.setDate(day.getDate() - weekday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { from: toIsoDateLocal(monday), to: toIsoDateLocal(sunday) };
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
