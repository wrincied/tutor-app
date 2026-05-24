import {
  jsDayToRruleWeekday,
  parseByDayFromRrule,
  parseRruleParts,
  parseUntilFromRrule,
  RRULE_WEEKDAY_CODES,
  type RruleWeekdayCode,
} from './lesson-recurrence';

export type RecurrencePreset = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
export type RecurrenceCustomFreq = 'daily' | 'weekly' | 'monthly';
export type RecurrenceEndMode = 'never' | 'until' | 'count';

export interface RecurrenceRuleConfig {
  preset: RecurrencePreset;
  /** Каждые N дней / недель / месяцев (зависит от типа). */
  interval: number;
  byDay: RruleWeekdayCode[];
  customFreq: RecurrenceCustomFreq;
  endMode: RecurrenceEndMode;
  untilDate: string | null;
  count: number | null;
}

export interface RecurrenceSummaryLabels {
  none: string;
  daily: string;
  dailyInterval: string;
  weekly: string;
  weeklyInterval: string;
  monthly: string;
  monthlyInterval: string;
  custom: string;
  endNever: string;
  endUntil: string;
  endCount: string;
  weekdays: Record<RruleWeekdayCode, string>;
}

export const DEFAULT_RECURRENCE_CONFIG: RecurrenceRuleConfig = {
  preset: 'none',
  interval: 1,
  byDay: [],
  customFreq: 'weekly',
  endMode: 'never',
  untilDate: null,
  count: 10,
};

function clampInterval(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.min(99, Math.max(1, Math.round(value)));
}

function clampCount(value: number | null | undefined): number {
  if (value == null || !Number.isFinite(value)) {
    return 10;
  }
  return Math.min(999, Math.max(1, Math.round(value)));
}

function formatUntilForRrule(untilDate: string): string {
  const compact = untilDate.replace(/-/g, '').slice(0, 8);
  return `UNTIL=${compact}T235959Z`;
}

function appendEndSegments(
  segments: string[],
  config: Pick<RecurrenceRuleConfig, 'endMode' | 'untilDate' | 'count'>,
): void {
  if (config.endMode === 'until' && config.untilDate && /^\d{4}-\d{2}-\d{2}$/.test(config.untilDate)) {
    segments.push(formatUntilForRrule(config.untilDate));
  } else if (config.endMode === 'count' && config.count) {
    segments.push(`COUNT=${clampCount(config.count)}`);
  }
}

function effectiveFreq(config: RecurrenceRuleConfig): RecurrenceCustomFreq | null {
  if (config.preset === 'none') {
    return null;
  }
  if (config.preset === 'custom') {
    return config.customFreq;
  }
  if (config.preset === 'daily') {
    return 'daily';
  }
  if (config.preset === 'weekly') {
    return 'weekly';
  }
  return 'monthly';
}

export function buildRruleFromConfig(
  config: RecurrenceRuleConfig,
  startDate: string,
): string | null {
  if (config.preset === 'none' || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return null;
  }

  const freq = effectiveFreq(config);
  if (!freq) {
    return null;
  }

  const interval = clampInterval(config.interval);
  const segments: string[] = [];

  if (freq === 'daily') {
    segments.push('FREQ=DAILY', `INTERVAL=${interval}`);
  } else if (freq === 'weekly') {
    const normalized = [...new Set(config.byDay.map((d) => d.toUpperCase()))].filter(
      (d): d is RruleWeekdayCode => RRULE_WEEKDAY_CODES.includes(d as RruleWeekdayCode),
    );
    if (normalized.length === 0) {
      return null;
    }
    segments.push('FREQ=WEEKLY', `INTERVAL=${interval}`, `BYDAY=${normalized.join(',')}`);
  } else {
    const monthDay = Number(startDate.slice(8, 10));
    if (Number.isNaN(monthDay) || monthDay < 1 || monthDay > 31) {
      return null;
    }
    segments.push('FREQ=MONTHLY', `INTERVAL=${interval}`, `BYMONTHDAY=${monthDay}`);
  }

  appendEndSegments(segments, config);
  return segments.join(';');
}

export function parseRruleToConfig(
  rrule: string | null | undefined,
  anchor?: Date | null,
): RecurrenceRuleConfig {
  if (!rrule) {
    return { ...DEFAULT_RECURRENCE_CONFIG };
  }

  const parts = parseRruleParts(rrule);
  const interval = clampInterval(parts['INTERVAL'] ? Number(parts['INTERVAL']) : 1);
  const byDay = parseByDayFromRrule(rrule);
  const untilDate = parseUntilFromRrule(rrule);
  const countRaw = parts['COUNT'] ? Number(parts['COUNT']) : null;

  let endMode: RecurrenceEndMode = 'never';
  let until: string | null = null;
  let count: number | null = null;
  if (untilDate) {
    endMode = 'until';
    until = untilDate;
  } else if (countRaw && !Number.isNaN(countRaw)) {
    endMode = 'count';
    count = clampCount(countRaw);
  }

  const freq = (parts['FREQ'] ?? 'WEEKLY').toUpperCase();
  if (freq === 'DAILY') {
    return {
      preset: 'daily',
      interval,
      byDay: anchor ? [jsDayToRruleWeekday(anchor.getDay())] : byDay,
      customFreq: 'daily',
      endMode,
      untilDate: until,
      count,
    };
  }
  if (freq === 'MONTHLY') {
    return {
      preset: 'monthly',
      interval,
      byDay: anchor ? [jsDayToRruleWeekday(anchor.getDay())] : byDay,
      customFreq: 'monthly',
      endMode,
      untilDate: until,
      count,
    };
  }

  return {
    preset: 'weekly',
    interval,
    byDay: byDay.length > 0 ? byDay : anchor ? [jsDayToRruleWeekday(anchor.getDay())] : [],
    customFreq: 'weekly',
    endMode,
    untilDate: until,
    count,
  };
}

export function configFromPreset(
  preset: RecurrencePreset,
  anchor: Date,
  previous?: RecurrenceRuleConfig,
): RecurrenceRuleConfig {
  const base = previous ? { ...previous, preset } : { ...DEFAULT_RECURRENCE_CONFIG, preset };
  if (preset === 'none') {
    return { ...base, preset: 'none', byDay: [] };
  }
  if (preset === 'daily') {
    return { ...base, preset, customFreq: 'daily', interval: base.interval || 1 };
  }
  if (preset === 'weekly') {
    const day = jsDayToRruleWeekday(anchor.getDay());
    return {
      ...base,
      preset,
      customFreq: 'weekly',
      interval: base.interval || 1,
      byDay: base.byDay.length > 0 ? base.byDay : [day],
    };
  }
  if (preset === 'monthly') {
    return { ...base, preset, customFreq: 'monthly', interval: base.interval || 1 };
  }
  return {
    ...base,
    preset: 'custom',
    byDay: base.byDay.length > 0 ? base.byDay : [jsDayToRruleWeekday(anchor.getDay())],
  };
}

export function formatRecurrenceSummary(
  config: RecurrenceRuleConfig,
  labels: RecurrenceSummaryLabels,
  startDate?: string | null,
): string {
  if (config.preset === 'none') {
    return labels.none;
  }

  const freq = effectiveFreq(config);
  const n = clampInterval(config.interval);
  let main = labels.none;

  if (config.preset === 'daily' || (config.preset === 'custom' && freq === 'daily')) {
    main = n === 1 ? labels.daily : labels.dailyInterval.replace('{n}', String(n));
  } else if (config.preset === 'weekly' || (config.preset === 'custom' && freq === 'weekly')) {
    const days = config.byDay.map((code) => labels.weekdays[code]).join(', ');
    const weekly =
      n === 1 ? labels.weekly.replace('{days}', days) : labels.weeklyInterval.replace('{n}', String(n)).replace('{days}', days);
    main = days ? weekly : labels.weekly.replace('{days}', '—');
  } else if (config.preset === 'monthly' || (config.preset === 'custom' && freq === 'monthly')) {
    const day = startDate?.slice(8, 10) ?? '—';
    main =
      n === 1
        ? labels.monthly.replace('{day}', day)
        : labels.monthlyInterval.replace('{n}', String(n)).replace('{day}', day);
  } else if (config.preset === 'custom') {
    main = labels.custom;
  }

  if (config.endMode === 'until' && config.untilDate) {
    return `${main} · ${labels.endUntil.replace('{date}', config.untilDate)}`;
  }
  if (config.endMode === 'count' && config.count) {
    return `${main} · ${labels.endCount.replace('{n}', String(config.count))}`;
  }
  if (config.endMode === 'never') {
    return `${main} · ${labels.endNever}`;
  }
  return main;
}

export function isRecurrenceConfigActive(config: RecurrenceRuleConfig): boolean {
  return config.preset !== 'none';
}
