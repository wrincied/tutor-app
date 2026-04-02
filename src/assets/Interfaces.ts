/** Общие типы и интерфейсы приложения (i18n, API-модели). */

export type Lang = 'ru' | 'en' | 'de' | 'kz';

/** Валюта ставки за час (BY — рубли, PL — злотые, AT/EU — евро, USD, RU — рубли). */
export type RateCurrency = 'BYN' | 'PLN' | 'EUR' | 'USD' | 'RUB';

export const RATE_CURRENCIES: RateCurrency[] = ['BYN', 'PLN', 'EUR', 'USD', 'RUB'];

export interface NavStrings {
  home: string;
  students: string;
  calendar: string;
  finance: string;
  themeDark: string;
  themeLight: string;
  logout: string;
  language: string;
}

export interface StudentStrings {
  addButton: string;
  emptyState: string;
  loading: string;
  newStudent: string;
  editModalTitle: string;
  name: string;
  ratePerHour: string;
  rateColumn: string;
  balanceLessons: string;
  perHour: string;
  timezone: string;
  edit: string;
  delete: string;
  topup: string;
  cancel: string;
  save: string;
  close: string;
  autoTimezone: string;
  deleteConfirm: string;
  topupTitle: string;
  topupHint: string;
  topupApply: string;
  /** Подпись поля выбора валюты */
  currency: string;
}

/** Как в Firestore (backend lessonController): статус урока. */
export type LessonStatus = 'scheduled' | 'completed' | 'cancelled';

/**
 * Урок в коллекции `lessons` (Node API сериализует Timestamps в ISO-строки).
 * Поля title, lesson_price, scheduledAt, status — основные для UI/расписания.
 */
export interface Lesson {
  _id: string;
  tutor: string;
  student_id: string | null;
  student_name: string | null;
  title: string;
  lesson_price: number;
  scheduledAt: string | null;
  /** Длительность урока в минутах (по умолчанию на бэкенде 60). */
  lesson_duration?: number;
  status: LessonStatus;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  _id: string;
  name: string;
  rate_per_hour: number;
  /** Код валюты ставки; у старых записей может не быть — тогда на фронте подставляем EUR. */
  rate_currency?: RateCurrency;
  balance_lessons: number;
  timezone: string;
  auto_debit_enabled: boolean;
  bot_active: boolean;
  createdAt: string;
}
