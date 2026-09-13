export type FinancePeriodPreset = 'all' | 'month' | 'year';

export interface FinancePeriodRange {
  from?: string;
  to?: string;
}

export interface FinancePeriodAnchor {
  year: number;
  /** 1–12 */
  month: number;
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

export function financeCurrentAnchor(now = new Date()): FinancePeriodAnchor {
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
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
export function financePeriodRange(
  preset: FinancePeriodPreset,
  anchor: FinancePeriodAnchor | null = null,
  now = new Date(),
): FinancePeriodRange {
  if (preset === 'all') {
    return {};
  }

  const resolved = anchor ?? financeCurrentAnchor(now);

  if (preset === 'month') {
    const from = new Date(Date.UTC(resolved.year, resolved.month - 1, 1));
    const to = new Date(Date.UTC(resolved.year, resolved.month, 0));
    return { from: toIsoDate(from), to: toIsoDate(to) };
  }

  const from = new Date(Date.UTC(resolved.year, 0, 1));
  const to = new Date(Date.UTC(resolved.year, 11, 31));
  return { from: toIsoDate(from), to: toIsoDate(to) };
}

export function financeShiftAnchor(
  preset: FinancePeriodPreset,
  anchor: FinancePeriodAnchor,
  delta: -1 | 1,
): FinancePeriodAnchor {
  if (preset === 'year') {
    return { year: anchor.year + delta, month: anchor.month };
  }
  const date = new Date(anchor.year, anchor.month - 1 + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function financeCanShiftForward(
  preset: FinancePeriodPreset,
  anchor: FinancePeriodAnchor,
  now = new Date(),
): boolean {
  if (preset === 'all') {
    return false;
  }
  const current = financeCurrentAnchor(now);
  if (preset === 'year') {
    return anchor.year < current.year;
  }
  if (anchor.year < current.year) {
    return true;
  }
  if (anchor.year > current.year) {
    return false;
  }
  return anchor.month < current.month;
}

export function financeIsCurrentPeriod(
  preset: FinancePeriodPreset,
  anchor: FinancePeriodAnchor,
  now = new Date(),
): boolean {
  if (preset === 'all') {
    return true;
  }
  const current = financeCurrentAnchor(now);
  if (preset === 'year') {
    return anchor.year === current.year;
  }
  return anchor.year === current.year && anchor.month === current.month;
}

export function financeAnchorToQuery(
  anchor: FinancePeriodAnchor,
  preset: FinancePeriodPreset,
): string | undefined {
  if (preset === 'all') {
    return undefined;
  }
  if (preset === 'year') {
    return String(anchor.year);
  }
  return `${anchor.year}-${String(anchor.month).padStart(2, '0')}`;
}

export function financeAnchorFromQuery(
  value: string | null | undefined,
  preset: FinancePeriodPreset,
): FinancePeriodAnchor | null {
  if (!value || preset === 'all') {
    return null;
  }
  if (preset === 'year') {
    const year = Number.parseInt(value, 10);
    if (!Number.isFinite(year) || year < 1970 || year > 9999) {
      return null;
    }
    return { year, month: financeCurrentAnchor().month };
  }
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }
  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  if (!Number.isFinite(year) || month < 1 || month > 12) {
    return null;
  }
  return { year, month };
}
