import { WORKSPACE_CURRENCIES, type WorkspaceCurrency } from '../constants/currencies';

export type { WorkspaceCurrency };
export { WORKSPACE_CURRENCIES };

export const WORKSPACE_LESSON_DURATIONS = [45, 60, 90, 120] as const;

export const LESSON_DURATION_MIN = 5;
export const LESSON_DURATION_MAX = 480;

export type WorkspaceLessonDuration = number;

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

export interface UserVacationSettings {
  enabled: boolean;
  startDate: string;
  endDate: string;
  message: string;
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

export const DEFAULT_VACATION: UserVacationSettings = {
  enabled: false,
  startDate: '',
  endDate: '',
  message: '',
};

export const HOUR_OPTIONS: readonly string[] = Array.from(
  { length: 24 },
  (_, h) => `${String(h).padStart(2, '0')}:00`,
);

export function clampLessonDurationMinutes(raw: unknown): number {
  const minutes = Math.round(Number(raw));
  if (!Number.isFinite(minutes)) {
    return DEFAULT_WORKSPACE.defaultLessonDuration;
  }
  return Math.min(LESSON_DURATION_MAX, Math.max(LESSON_DURATION_MIN, minutes));
}

export function isWorkspaceDurationPreset(minutes: number): boolean {
  return (WORKSPACE_LESSON_DURATIONS as readonly number[]).includes(minutes);
}

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
  const defaultLessonDuration = clampLessonDurationMinutes(data['defaultLessonDuration']);

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

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function normalizeDateToken(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!DATE_RE.test(raw)) {
    return '';
  }
  const time = Date.parse(`${raw}T12:00:00`);
  return Number.isFinite(time) ? raw : '';
}

export function normalizeVacation(raw: unknown): UserVacationSettings {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  let startDate = normalizeDateToken(data['startDate']);
  let endDate = normalizeDateToken(data['endDate']);
  if (startDate && endDate && endDate < startDate) {
    const swap = startDate;
    startDate = endDate;
    endDate = swap;
  }
  return {
    enabled: data['enabled'] === true,
    startDate,
    endDate,
    message: String(data['message'] ?? '')
      .replace(/\r\n/g, '\n')
      .trim()
      .slice(0, 500),
  };
}

/** Local calendar day key YYYY-MM-DD. */
export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isDateInVacation(date: Date, vacation: UserVacationSettings): boolean {
  if (!vacation.enabled || !vacation.startDate || !vacation.endDate) {
    return false;
  }
  const key = toDayKey(date);
  return key >= vacation.startDate && key <= vacation.endDate;
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
