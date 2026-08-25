import type { StudentTelegramNotificationSettings } from '@interfaces';

export type TelegramRoutingTarget = 'student' | 'parent' | 'tutor';

export const DEFAULT_TELEGRAM_SETTINGS: StudentTelegramNotificationSettings = {
  lesson_reminder_enabled: true,
  lesson_reminder_offset_minutes: 60,
  low_balance_enabled: false,
  low_balance_threshold: 2,
  payment_receipt_enabled: false,
  routing: 'student',
  routing_targets: ['student'],
};

/** Built-in offsets shown in the picker (minutes). */
export const BUILTIN_REMINDER_OFFSETS = [15, 30, 60, 1440] as const;

export const REMINDER_OFFSET_MIN = 5;
export const REMINDER_OFFSET_MAX = 7 * 24 * 60;

export function clampReminderOffset(raw: unknown, fallback = 60): number {
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n)) {
    return fallback;
  }
  return Math.min(REMINDER_OFFSET_MAX, Math.max(REMINDER_OFFSET_MIN, n));
}

export function isBuiltinReminderOffset(minutes: number): boolean {
  return (BUILTIN_REMINDER_OFFSETS as readonly number[]).includes(minutes);
}

export function normalizeCustomReminderOffsets(raw: unknown): number[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const unique = new Set<number>();
  for (const item of raw) {
    const n = Math.round(Number(item));
    if (!Number.isFinite(n) || isBuiltinReminderOffset(n)) {
      continue;
    }
    if (n < REMINDER_OFFSET_MIN || n > REMINDER_OFFSET_MAX) {
      continue;
    }
    unique.add(n);
  }
  return [...unique].sort((a, b) => a - b);
}

function isTarget(value: unknown): value is TelegramRoutingTarget {
  return value === 'student' || value === 'parent' || value === 'tutor';
}

/** Map legacy radio `routing` → checkbox targets. */
export function targetsFromRouting(
  routing: StudentTelegramNotificationSettings['routing'] | undefined,
): TelegramRoutingTarget[] {
  if (routing === 'tutor') {
    return ['tutor'];
  }
  if (routing === 'both') {
    return ['student', 'tutor'];
  }
  return ['student'];
}

/** Keep legacy `routing` in sync for older backend consumers. */
export function routingFromTargets(
  targets: TelegramRoutingTarget[],
): StudentTelegramNotificationSettings['routing'] {
  const hasStudent = targets.includes('student');
  const hasTutor = targets.includes('tutor');
  if (hasStudent && hasTutor) {
    return 'both';
  }
  if (hasTutor && !hasStudent) {
    return 'tutor';
  }
  return 'student';
}

export function normalizeRoutingTargets(
  raw?: Partial<StudentTelegramNotificationSettings> | null,
): TelegramRoutingTarget[] {
  if (Array.isArray(raw?.routing_targets)) {
    const unique = [...new Set(raw.routing_targets.filter(isTarget))];
    if (unique.length > 0) {
      return unique;
    }
  }
  return targetsFromRouting(raw?.routing);
}

export function normalizeTelegramSettings(
  raw?: Partial<StudentTelegramNotificationSettings> | null,
): StudentTelegramNotificationSettings {
  const rawOffset = Number(raw?.lesson_reminder_offset_minutes);
  const offset = Number.isFinite(rawOffset)
    ? clampReminderOffset(rawOffset)
    : DEFAULT_TELEGRAM_SETTINGS.lesson_reminder_offset_minutes;
  const threshold = Number(raw?.low_balance_threshold);
  const routing_targets = normalizeRoutingTargets(raw);
  return {
    lesson_reminder_enabled: raw?.lesson_reminder_enabled !== false,
    lesson_reminder_offset_minutes: offset,
    low_balance_enabled: Boolean(raw?.low_balance_enabled),
    low_balance_threshold:
      Number.isFinite(threshold) && threshold >= 1 ? Math.min(10, Math.floor(threshold)) : 2,
    payment_receipt_enabled: Boolean(raw?.payment_receipt_enabled),
    routing: routingFromTargets(routing_targets),
    routing_targets,
  };
}

export function canSendTelegramReceipt(student: {
  telegram_user_id?: string | null;
  telegram_chat_id?: string | null;
  bot_active?: boolean;
  telegram_delivery_status?: string | null;
  telegram_notification_settings?: Partial<StudentTelegramNotificationSettings> | null;
}): boolean {
  const settings = normalizeTelegramSettings(student.telegram_notification_settings);
  if (!settings.payment_receipt_enabled) {
    return false;
  }
  if (!student.telegram_user_id && !student.telegram_chat_id) {
    return false;
  }
  if (!student.bot_active) {
    return false;
  }
  if (student.telegram_delivery_status === 'error') {
    return false;
  }
  return true;
}

export function formatReminderOffsetLabel(
  minutes: number,
  labels: {
    m15: string;
    m30: string;
    m60: string;
    m1440: string;
    custom: (n: number) => string;
  },
): string {
  switch (minutes) {
    case 15:
      return labels.m15;
    case 30:
      return labels.m30;
    case 60:
      return labels.m60;
    case 1440:
      return labels.m1440;
    default:
      return labels.custom(minutes);
  }
}
