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
  sidebarCollapse: string;
  sidebarExpand: string;
  account: string;
}

export type TaxMode =
  | 'at-self-employed'
  | 'de-kleinunternehmer'
  | 'pl-ryczalt'
  | 'ru-usn'
  | 'ru-ip'
  | 'by-ip'
  | 'kz-ip'
  | 'none';

export type SubscriptionStatus = 'free' | 'pro' | 'trial';

export interface UserProfile {
  _id: string;
  email: string;
  country_settings: string;
  tax_mode: TaxMode | string;
  /** Задан ли налоговый режим (не `none`). */
  tax_mode_configured?: boolean;
  timezone: string;
  subscription_status: SubscriptionStatus | string;
}

export interface AccountStrings {
  title: string;
  settingsSection: string;
  accountSection: string;
  language: string;
  themeDark: string;
  themeLight: string;
  emailSection: string;
  email: string;
  newEmail: string;
  passwordSection: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  subscriptionSection: string;
  subscriptionStatus: string;
  subscriptionFree: string;
  subscriptionPro: string;
  subscriptionTrial: string;
  taxSection: string;
  taxMode: string;
  country: string;
  save: string;
  saving: string;
  saved: string;
  loadError: string;
  passwordsMismatch: string;
  currentPasswordRequired: string;
  saveError: string;
  subscriptionManagedByPayment: string;
  taxModeRequiredHint: string;
  taxModeLockedHint: string;
  upgradePro: string;
  upgradeTrial: string;
  checkoutLoading: string;
  taxRequiredForBilling: string;
  subscriptionLearnMore: string;
  subscriptionModalTitle: string;
  subscriptionModalIntro: string;
  subscriptionModalFeature1: string;
  subscriptionModalFeature2: string;
  subscriptionModalFeature3: string;
  subscriptionPriceMonthly: string;
  subscriptionPriceYearly: string;
  subscriptionPricesForCountry: string;
  subscriptionModalClose: string;
}

export interface AuthStrings {
  loginTitle: string;
  loginSubtitle: string;
  registerTitle: string;
  registerSubtitle: string;
  email: string;
  password: string;
  confirmPassword: string;
  login: string;
  loggingIn: string;
  createAccount: string;
  creating: string;
  hasAccount: string;
  noAccount: string;
  wrongCredentials: string;
  passwordsMismatch: string;
  passwordMinLength: string;
  registerError: string;
}

export interface CalendarStrings {
  title: string;
  modeDrawerTitle: string;
  viewMode1: string;
  viewMode3: string;
  viewMode7: string;
  viewMode30: string;
  students: string;
  prev: string;
  next: string;
  today: string;
  showAllStudents: string;
  searchStudent: string;
  addLesson: string;
  newLesson: string;
  editLesson: string;
  notesStep: string;
  studentPlaceholder: string;
  notesPlaceholder: string;
  notesNewPlaceholder: string;
  snapshotRateLabel: string;
  snapshotWillUpdate: string;
  snapshotWillFix: string;
  regionLabel: string;
  rateLabel: string;
  durationLabel: string;
  deleteLesson: string;
  deletingLesson: string;
  deleteLessonConfirm: string;
  goToNotes: string;
  back: string;
  scheduleConflict: string;
  timeBusyTitle: string;
  ok: string;
  moveLessonTitle: string;
  moveLessonConfirm: string;
  moveLessonBodyBefore: string;
  moveLessonBodyAfter: string;
  studentFallback: string;
  loadLessonsError: string;
  loadStudentsError: string;
  selectStudentError: string;
  saveLessonError: string;
  deleteLessonError: string;
  statusScheduled: string;
  statusCompleted: string;
  statusMissed: string;
  statusCanceled: string;
  durationHourShort: string;
  durationMinShort: string;
  durationOneHour: string;
  weekdayMon: string;
  weekdayTue: string;
  weekdayWed: string;
  weekdayThu: string;
  weekdayFri: string;
  weekdaySat: string;
  weekdaySun: string;
}

export interface FinanceStrings {
  loading: string;
  loadError: string;
  periodAll: string;
  periodMonth: string;
  periodYear: string;
  totalIncome: string;
  totalIncomeCombined: string;
  incomeCompletedPart: string;
  incomePlannedPart: string;
  totalExpenses: string;
  grossProfit: string;
  netProfit: string;
  completedLessons: string;
  scheduledLessons: string;
  totalLessons: string;
  missedLessons: string;
  canceledLessons: string;
  lessonHours: string;
  scheduledIncome: string;
  expensesCount: string;
  lessonsEmptyHint: string;
  markCompletedHint: string;
  incomeByCurrency: string;
  taxSection: string;
  taxNotConfigured: string;
  taxConfigureHint: string;
  socialInsurance: string;
  incomeTax: string;
  taxableBase: string;
  salaryModelTitle: string;
  monthlyEquivalent: string;
  annualGross14: string;
  annualNetEstimate: string;
  expensesSection: string;
  addExpense: string;
  editExpense: string;
  deleteExpense: string;
  expenseTitle: string;
  expenseAmount: string;
  expenseDate: string;
  expenseCategory: string;
  emptyExpenses: string;
  save: string;
  saving: string;
  cancel: string;
  deleteConfirm: string;
  disclaimer: string;
  mixedCurrencyNote: string;
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  expense_date: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinanceSummary {
  currency: string;
  country: string;
  tax_mode: string;
  period: { from: string | null; to: string | null };
  totals: {
    lessonCount: number;
    scheduledLessonCount: number;
    completedLessonCount: number;
    missedLessonCount: number;
    canceledLessonCount: number;
    totalLessonHours: number;
    completedLessonHours: number;
    scheduledLessonHours: number;
    expenseCount: number;
  };
  income: {
    totalIncome: number;
    scheduledIncome: number;
    combinedIncome: number;
    totalExpenses: number;
    grossProfit: number;
    byCurrency: Record<string, number>;
    scheduledByCurrency: Record<string, number>;
    combinedByCurrency: Record<string, number>;
  };
  austria: {
    socialInsuranceRate: number;
    socialInsurance: number;
    taxableBase: number;
    incomeTax: number;
    netProfit: number;
  } | null;
  salaryModel13_14: {
    monthlyEquivalentGross: number;
    annualGross14: number;
    annualEmployeeNetEstimate: number;
    estimatedRegularTax: number;
    estimatedSpecialSalaryTax: number;
  } | null;
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
  saving: string;
  close: string;
  autoTimezone: string;
  deleteConfirm: string;
  topupTitle: string;
  topupHint: string;
  topupApply: string;
  /** Подпись поля выбора валюты */
  currency: string;
  /** Цвет карточки урока в календаре */
  calendarColor: string;
  /** Кнопка случайного пастельного цвета */
  randomColor: string;
  /** Уведомления ученику через Telegram-бота */
  botNotifications: string;
  botEnabled: string;
  botDisabled: string;
  botEnableTitle: string;
  botEnableMessage: string;
  botDisableTitle: string;
  botDisableMessage: string;
  botEnableConfirm: string;
  botDisableConfirm: string;
  quickActionsTitle: string;
  lessonsShort: string;
}

export type LessonStatus = 'scheduled' | 'completed' | 'missed' | 'canceled';

/**
 * Урок в коллекции `lessons`.
 * `scheduledAt` + `lesson_duration` — интервал в БД (без миграции на start_at/end_at).
 * `lesson_price` + `lesson_currency` — снапшот ставки за час и валюты на момент создания
 * (или при смене ученика); не меняется при правке ставки ученика в профиле.
 */
export interface Lesson {
  _id: string;
  student_id: string | null;
  status: LessonStatus;
  scheduledAt: string;
  lesson_duration: number;
  /** Ставка за час (снапшот), не сумма за весь урок. */
  lesson_price: number;
  /** Валюта снапшота (BYN, PLN, EUR, USD, RUB). */
  lesson_currency: string;
  /** Часовой пояс ученика (снапшот региона) на момент урока. */
  student_timezone?: string;
  reminder_sent: boolean;
  notes?: string;
  /** Legacy-поля API / Firestore (не используются в UI календаря). */
  tutor?: string;
  student_name?: string | null;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  _id: string;
  name: string;
  rate_per_hour: number;
  /** Код валюты ставки; у старых записей может не быть — тогда на фронте подставляем EUR. */
  rate_currency?: RateCurrency;
  /** Пастельный цвет левой полосы карточки урока в календаре (HSL/hex). */
  color_hex: string;
  balance_lessons: number;
  timezone: string;
  auto_debit_enabled: boolean;
  bot_active: boolean;
  createdAt: string;
}
