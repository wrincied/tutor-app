import { RRule, type Weekday } from 'rrule';
import type { CalendarLesson, Lesson } from '@interfaces';

export const RRULE_WEEKDAY_CODES = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'] as const;
export type RruleWeekdayCode = (typeof RRULE_WEEKDAY_CODES)[number];
export type RecurrenceFreq = 'weekly' | 'monthly';

export {
  buildRruleFromConfig,
  configFromPreset,
  DEFAULT_RECURRENCE_CONFIG,
  formatRecurrenceSummary,
  isRecurrenceConfigActive,
  parseRruleToConfig,
  type RecurrenceCustomFreq,
  type RecurrenceEndMode,
  type RecurrencePreset,
  type RecurrenceRuleConfig,
  type RecurrenceSummaryLabels,
} from './lesson-recurrence-config';

const BYDAY_TO_WEEKDAY: Record<RruleWeekdayCode, Weekday> = {
  MO: RRule.MO,
  TU: RRule.TU,
  WE: RRule.WE,
  TH: RRule.TH,
  FR: RRule.FR,
  SA: RRule.SA,
  SU: RRule.SU,
};

const JS_DAY_TO_RRULE: RruleWeekdayCode[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

export function jsDayToRruleWeekday(jsDay: number): RruleWeekdayCode {
  return JS_DAY_TO_RRULE[jsDay] ?? 'MO';
}

export function parseRruleParts(rrule: string | null | undefined): Record<string, string> {
  const parts: Record<string, string> = {};
  if (!rrule) {
    return parts;
  }
  for (const segment of rrule.split(';')) {
    const [key, value] = segment.split('=');
    if (key && value) {
      parts[key.trim().toUpperCase()] = value.trim();
    }
  }
  return parts;
}

export function parseByDayFromRrule(rrule: string | null | undefined): RruleWeekdayCode[] {
  const parts = parseRruleParts(rrule);
  if (!parts['BYDAY']) {
    return [];
  }
  return parts['BYDAY']
    .split(',')
    .map((part) => part.trim().toUpperCase())
    .filter((part): part is RruleWeekdayCode =>
      RRULE_WEEKDAY_CODES.includes(part as RruleWeekdayCode),
    );
}

export function parseUntilFromRrule(rrule: string | null | undefined): string | null {
  const parts = parseRruleParts(rrule);
  if (!parts['UNTIL']) {
    return null;
  }
  const compact = parts['UNTIL'].replace(/[^0-9]/g, '').slice(0, 8);
  if (compact.length !== 8) {
    return null;
  }
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
}

export function parseFreqFromRrule(rrule: string | null | undefined): RecurrenceFreq {
  const parts = parseRruleParts(rrule);
  return parts['FREQ'] === 'MONTHLY' ? 'monthly' : 'weekly';
}

function formatUntilForRrule(untilDate: string): string {
  const compact = untilDate.replace(/-/g, '').slice(0, 8);
  return `UNTIL=${compact}T235959Z`;
}

export function buildRruleString(options: {
  freq: RecurrenceFreq;
  byDay: readonly string[];
  untilDate: string | null;
  startDate: string;
}): string | null {
  const segments: string[] = [];
  if (options.freq === 'monthly') {
    const day = Number(options.startDate.slice(8, 10));
    if (Number.isNaN(day) || day < 1 || day > 31) {
      return null;
    }
    segments.push('FREQ=MONTHLY', `BYMONTHDAY=${day}`);
  } else {
    const normalized = [...new Set(options.byDay.map((d) => d.trim().toUpperCase()))].filter(
      (d) => RRULE_WEEKDAY_CODES.includes(d as RruleWeekdayCode),
    ) as RruleWeekdayCode[];
    if (normalized.length === 0) {
      return null;
    }
    segments.push('FREQ=WEEKLY', `BYDAY=${normalized.join(',')}`);
  }
  if (options.untilDate && /^\d{4}-\d{2}-\d{2}$/.test(options.untilDate)) {
    segments.push(formatUntilForRrule(options.untilDate));
  }
  return segments.join(';');
}

/** @deprecated use buildRruleString */
export function buildWeeklyRrule(byDay: readonly string[]): string | null {
  return buildRruleString({
    freq: 'weekly',
    byDay,
    untilDate: null,
    startDate: '2000-01-01',
  });
}

function applyAnchorTime(date: Date, anchor: Date): Date {
  const next = new Date(date);
  next.setHours(anchor.getHours(), anchor.getMinutes(), anchor.getSeconds(), 0);
  return next;
}

function parseStartDate(startDate: string | null | undefined, anchor: Date): Date {
  if (startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    const [y, m, d] = startDate.split('-').map(Number);
    return new Date(y, m - 1, d, anchor.getHours(), anchor.getMinutes(), 0, 0);
  }
  return new Date(
    anchor.getFullYear(),
    anchor.getMonth(),
    anchor.getDate(),
    anchor.getHours(),
    anchor.getMinutes(),
    0,
    0,
  );
}

function endOfLocalDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildRule(
  lesson: Pick<Lesson, 'rrule' | 'scheduledAt' | 'startDate' | 'isRecurring'>,
): RRule | null {
  if (!(lesson.isRecurring || lesson.rrule) || !lesson.rrule || !lesson.scheduledAt) {
    return null;
  }
  const anchor = new Date(lesson.scheduledAt);
  if (Number.isNaN(anchor.getTime())) {
    return null;
  }
  const parts = parseRruleParts(lesson.rrule);
  const dtstart = parseStartDate(lesson.startDate ?? null, anchor);
  const options: {
    dtstart: Date;
    freq: number;
    interval?: number;
    count?: number;
    byweekday?: Weekday[];
    bymonthday?: number;
    until?: Date;
  } = {
    dtstart,
    freq: RRule.WEEKLY,
    interval: parts['INTERVAL'] ? Math.max(1, Number(parts['INTERVAL'])) : 1,
  };

  const freq = (parts['FREQ'] ?? 'WEEKLY').toUpperCase();
  if (freq === 'DAILY') {
    options.freq = RRule.DAILY;
  } else if (freq === 'MONTHLY') {
    options.freq = RRule.MONTHLY;
    options.bymonthday = parts['BYMONTHDAY']
      ? Number(parts['BYMONTHDAY'])
      : dtstart.getDate();
  } else {
    const byDay = parseByDayFromRrule(lesson.rrule);
    if (byDay.length === 0) {
      return null;
    }
    options.freq = RRule.WEEKLY;
    options.byweekday = byDay.map((code) => BYDAY_TO_WEEKDAY[code]);
  }

  if (parts['COUNT']) {
    const count = Number(parts['COUNT']);
    if (!Number.isNaN(count) && count > 0) {
      options.count = count;
    }
  }

  const untilDate = parseUntilFromRrule(lesson.rrule);
  if (untilDate) {
    const [y, m, d] = untilDate.split('-').map(Number);
    options.until = new Date(y, m - 1, d, 23, 59, 59, 999);
  }

  return new RRule(options);
}

function filterOccurrenceDates(dates: Date[], lesson: Lesson): Date[] {
  const exdates = new Set((lesson.exdates ?? []).map((item) => String(item).slice(0, 10)));
  return dates.filter((date) => !exdates.has(dayKey(date)));
}

function statusForOccurrence(lesson: Lesson, occurrenceDate: string): Lesson['status'] {
  const completed = new Set((lesson.completedDates ?? []).map((item) => String(item).slice(0, 10)));
  if (completed.has(occurrenceDate)) {
    return 'completed';
  }
  return lesson.status === 'completed' ? 'scheduled' : lesson.status;
}

/** Разворачивает рекуррентный урок в экземпляры для диапазона [rangeStart, rangeEnd]. */
export function expandLessonOccurrences(
  lesson: CalendarLesson,
  rangeStart: Date,
  rangeEnd: Date,
): CalendarLesson[] {
  const recurring = Boolean(lesson.isRecurring || lesson.rrule);
  if (!recurring || !lesson.rrule || !lesson.scheduledAt) {
    return [lesson];
  }

  const rule = buildRule(lesson);
  if (!rule) {
    return [lesson];
  }

  const anchor = new Date(lesson.scheduledAt);
  const inclusiveEnd = endOfLocalDay(rangeEnd);
  const dates = filterOccurrenceDates(rule.between(rangeStart, inclusiveEnd, true), lesson);

  return dates.map((occurrence) => {
    const scheduledAt = applyAnchorTime(occurrence, anchor).toISOString();
    const key = dayKey(occurrence);
    return {
      ...lesson,
      scheduledAt,
      status: statusForOccurrence(lesson, key),
      occurrenceKey: `${lesson._id}:${key}`,
      isVirtualOccurrence: true,
    };
  });
}

export function expandLessonsForRange(
  lessons: CalendarLesson[],
  rangeStart: Date,
  rangeEnd: Date,
): CalendarLesson[] {
  const result: CalendarLesson[] = [];
  for (const lesson of lessons) {
    if ((lesson.isRecurring || lesson.rrule) && lesson.rrule) {
      result.push(...expandLessonOccurrences(lesson, rangeStart, rangeEnd));
    } else if (lesson.scheduledAt) {
      result.push(lesson);
    }
  }
  return result;
}

/** Все вхождения серии вперёд (для проверки коллизий при сохранении). */
export function expandLessonOccurrencesForConflictCheck(
  lesson: Pick<
    Lesson,
    'rrule' | 'scheduledAt' | 'startDate' | 'isRecurring' | 'lesson_duration' | 'exdates'
  >,
  weeksAhead = 26,
): Date[] {
  if (!lesson.isRecurring || !lesson.rrule || !lesson.scheduledAt) {
    const single = new Date(lesson.scheduledAt);
    return Number.isNaN(single.getTime()) ? [] : [single];
  }
  const rule = buildRule(lesson as Lesson);
  if (!rule) {
    return [];
  }
  const start = parseStartDate(lesson.startDate ?? null, new Date(lesson.scheduledAt));
  const end = new Date(start);
  end.setDate(end.getDate() + weeksAhead * 7);
  return filterOccurrenceDates(rule.between(start, end, true), lesson as Lesson);
}
