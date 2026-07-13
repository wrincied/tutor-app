import { WORKSPACE_CURRENCIES, type WorkspaceCurrency } from '../constants/currencies';

export type { WorkspaceCurrency };
export { WORKSPACE_CURRENCIES };

export const WORKSPACE_LESSON_DURATIONS = [45, 60, 90] as const;

export type WorkspaceLessonDuration = (typeof WORKSPACE_LESSON_DURATIONS)[number];

/** ISO weekday: 1 = Monday … 7 = Sunday. */
export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface UserWorkspaceSettings {
  name: string;
  currency: WorkspaceCurrency;
  defaultLessonDuration: WorkspaceLessonDuration;
}

export interface UserWorkingHoursSettings {
  start: string;
  end: string;
  days: IsoWeekday[];
}

export const DEFAULT_WORKSPACE: UserWorkspaceSettings = {
  name: '',
  currency: 'EUR',
  defaultLessonDuration: 60,
};

export const DEFAULT_WORKING_HOURS: UserWorkingHoursSettings = {
  start: '08:00',
  end: '21:00',
  days: [1, 2, 3, 4, 5],
};

export const HOUR_OPTIONS: readonly string[] = Array.from(
  { length: 24 },
  (_, h) => `${String(h).padStart(2, '0')}:00`,
);

export function parseHourToken(value: string): number {
  const match = /^(\d{1,2}):00$/.exec(String(value ?? '').trim());
  if (!match) {
    return 0;
  }
  const hour = Number(match[1]);
  return hour >= 0 && hour <= 23 ? hour : 0;
}

export function normalizeWorkspace(raw: unknown): UserWorkspaceSettings {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const currency = WORKSPACE_CURRENCIES.includes(data['currency'] as WorkspaceCurrency)
    ? (data['currency'] as WorkspaceCurrency)
    : DEFAULT_WORKSPACE.currency;
  const durationNum = Number(data['defaultLessonDuration']);
  const defaultLessonDuration = WORKSPACE_LESSON_DURATIONS.includes(
    durationNum as WorkspaceLessonDuration,
  )
    ? (durationNum as WorkspaceLessonDuration)
    : DEFAULT_WORKSPACE.defaultLessonDuration;

  return {
    name: String(data['name'] ?? '').trim().slice(0, 120),
    currency,
    defaultLessonDuration,
  };
}

export function normalizeWorkingHours(raw: unknown): UserWorkingHoursSettings {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  let start = parseHourToken(String(data['start'] ?? DEFAULT_WORKING_HOURS.start));
  let end = parseHourToken(String(data['end'] ?? DEFAULT_WORKING_HOURS.end));
  if (end <= start) {
    start = parseHourToken(DEFAULT_WORKING_HOURS.start);
    end = parseHourToken(DEFAULT_WORKING_HOURS.end);
  }

  const daysRaw = Array.isArray(data['days']) ? data['days'] : DEFAULT_WORKING_HOURS.days;
  const days = daysRaw
    .map((d) => Number(d))
    .filter((d): d is IsoWeekday => d >= 1 && d <= 7);
  const uniqueDays = [...new Set(days)].sort((a, b) => a - b);

  return {
    start: `${String(start).padStart(2, '0')}:00`,
    end: `${String(end).padStart(2, '0')}:00`,
    days: uniqueDays.length > 0 ? uniqueDays : [...DEFAULT_WORKING_HOURS.days],
  };
}

export function buildGridHours(start: string, end: string): number[] {
  const startHour = parseHourToken(start);
  const endHour = parseHourToken(end);
  if (endHour <= startHour) {
    return Array.from({ length: 24 }, (_, i) => i);
  }
  return Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
}

/** JS Date.getDay(): 0 Sun … 6 Sat → ISO 1 Mon … 7 Sun. */
export function jsDateToIsoWeekday(date: Date): IsoWeekday {
  const day = date.getDay();
  return (day === 0 ? 7 : day) as IsoWeekday;
}
