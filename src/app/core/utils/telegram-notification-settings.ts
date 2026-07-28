import type { StudentTelegramNotificationSettings } from '@interfaces';

export const DEFAULT_TELEGRAM_SETTINGS: StudentTelegramNotificationSettings = {
  lesson_reminder_enabled: true,
  lesson_reminder_offset_minutes: 60,
  low_balance_enabled: false,
  low_balance_threshold: 2,
  payment_receipt_enabled: false,
  routing: 'student',
};

const OFFSETS = new Set([15, 60, 120, 1440]);

export function normalizeTelegramSettings(
  raw?: Partial<StudentTelegramNotificationSettings> | null,
): StudentTelegramNotificationSettings {
  const offset = Number(raw?.lesson_reminder_offset_minutes);
  const threshold = Number(raw?.low_balance_threshold);
  const routing = raw?.routing;
  return {
    lesson_reminder_enabled: raw?.lesson_reminder_enabled !== false,
    lesson_reminder_offset_minutes: (OFFSETS.has(offset) ? offset : 60) as
      | 15
      | 60
      | 120
      | 1440,
    low_balance_enabled: Boolean(raw?.low_balance_enabled),
    low_balance_threshold:
      Number.isFinite(threshold) && threshold >= 1 ? Math.min(99, Math.floor(threshold)) : 2,
    payment_receipt_enabled: Boolean(raw?.payment_receipt_enabled),
    routing: routing === 'tutor' || routing === 'both' ? routing : 'student',
    routing_targets: Array.isArray(raw?.routing_targets)
      ? raw.routing_targets.filter(
          (item): item is 'student' | 'parent' | 'tutor' =>
            item === 'student' || item === 'parent' || item === 'tutor',
        )
      : undefined,
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
