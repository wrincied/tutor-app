/** Общие типы и интерфейсы приложения (i18n, API-модели). */

export type Lang = 'ru' | 'en' | 'de' | 'kz' | 'uk' | 'by';

/** Валюта ставки за час (BY — рубли, PL — злотые, AT/EU — евро, USD, RU — рубли). */
export type RateCurrency = 'BYN' | 'PLN' | 'EUR' | 'USD' | 'RUB';

export const RATE_CURRENCIES: RateCurrency[] = ['BYN', 'PLN', 'EUR', 'USD', 'RUB'];

/** Валюты для сводки Finance (курсы Frankfurter + fallback на backend). */
export type FinanceReportCurrency = 'EUR' | 'USD' | 'PLN' | 'RUB' | 'BYN' | 'KZT';

export const FINANCE_REPORT_CURRENCIES: FinanceReportCurrency[] = [
  'EUR',
  'USD',
  'PLN',
  'RUB',
  'BYN',
  'KZT',
];

export interface PricingFaqItem {
  q: string;
  a: string;
}

export interface PricingPlanCopy {
  name: string;
  priceLabel: string;
  period: string;
  cta: string;
  features: string[];
}

export interface PricingProPlanCopy {
  name: string;
  periodMonthly: string;
  periodYearly: string;
  trialBadge: string;
  microcopy: string;
  cta: string;
  ctaLoading: string;
  features: string[];
}

export interface PricingStrings {
  title: string;
  subtitle: string;
  toggleMonthly: string;
  toggleYearly: string;
  saveBadge: string;
  recommendedBadge: string;
  freePlan: PricingPlanCopy;
  proPlan: PricingProPlanCopy;
  stripeNote: string;
  taxRequired: string;
  alreadyPro: string;
  alreadyTrial: string;
  accountLink: string;
  faq: {
    title: string;
    items: PricingFaqItem[];
  };
}

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
  admin: string;
  pricing: string;
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

export type UserRole = 'tutor' | 'super_admin';

export interface SubscriptionPricing {
  country: string;
  currency: string;
  monthly: number;
  yearly: number;
}

export interface UserProfile {
  _id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  onboarding_completed?: boolean;
  data_consent_accepted?: boolean | null;
  marketing_cookies_accepted?: boolean | null;
  country_settings: string;
  subscription_pricing?: SubscriptionPricing;
  tax_mode: TaxMode | string;
  /** Задан ли налоговый режим (не `none`). */
  tax_mode_configured?: boolean;
  timezone: string;
  subscription_status: SubscriptionStatus | string;
  email_verified?: boolean;
  role?: UserRole | string;
}

export interface AdminStats {
  totalUsers: number;
  paidUsers: number;
  trialUsers: number;
  conversionPercent: number;
  estimatedMrr: Record<string, number>;
}

export interface AdminUserRow {
  _id: string;
  email: string;
  subscription_status: SubscriptionStatus | string;
  createdAt: string | null;
  role?: UserRole | string;
}

export interface AdminStrings {
  title: string;
  navLink: string;
  loading: string;
  loadError: string;
  metricTotalUsers: string;
  metricPaidUsers: string;
  metricConversion: string;
  metricRevenue: string;
  revenueHint: string;
  tableEmail: string;
  tableStatus: string;
  tableRegistered: string;
  tableActions: string;
  statusFree: string;
  statusPro: string;
  statusTrial: string;
  giftTrial: string;
  giftingTrial: string;
  giftTrialSuccess: string;
  giftTrialError: string;
  noUsers: string;
  accessDenied: string;
}

export interface AccountStrings {
  title: string;
  settingsSection: string;
  accountSection: string;
  name: string;
  firstName: string;
  lastName: string;
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
  subscriptionModalClose: string;
  /** Підпис вибору варіанту сцяга Беларусі в налаштуваннях мови. */
  belarusFlagLabel: string;
  belarusFlagBchb: string;
  belarusFlagOfficial: string;
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
  checkEmailTitle: string;
  checkEmailSubtitle: string;
  checkEmailPurgeHint: string;
  checkEmailResent: string;
  checkEmailResendError: string;
  checkEmailSending: string;
  checkEmailNoAddress: string;
  resendVerification: string;
  verifyTitle: string;
  verifyLoading: string;
  verifySuccess: string;
  verifyFailed: string;
  verifyMissingToken: string;
  goToLogin: string;
  emailNotVerified: string;
  verifyNoticeTitle: string;
  verifyNoticeSubtitle: string;
  verifySuccessBanner: string;
  verifyRefreshStatus: string;
  verifyNotYet: string;
  signOut: string;
  forgotPassword: string;
  resetPasswordSending: string;
  resetPasswordSent: string;
  resetPasswordError: string;
  enterEmailForReset: string;
  resetPasswordModalTitle: string;
  resetPasswordModalHint: string;
  resetPasswordSend: string;
  cancel: string;
  close: string;
  continueWithGoogle: string;
  orContinueWith: string;
  oauthError: string;
  onboardingTitle: string;
  onboardingSubtitle: string;
  onboardingFirstName: string;
  onboardingLastName: string;
  onboardingCountry: string;
  onboardingDataTitle: string;
  onboardingDataBody: string;
  onboardingDataItem1: string;
  onboardingDataItem2: string;
  onboardingDataItem3: string;
  onboardingDataConsentLabel: string;
  onboardingDataPolicyLink: string;
  onboardingCookiesTitle: string;
  onboardingCookiesBody: string;
  onboardingCookiesOptional: string;
  onboardingCookiePolicyLink: string;
  onboardingCookiesAccept: string;
  onboardingCookiesDecline: string;
  onboardingContinue: string;
  onboardingSaving: string;
  onboardingSubmitting: string;
  onboardingDeclineData: string;
  onboardingConsentRequired: string;
  onboardingFirstNameRequired: string;
  onboardingSaveError: string;
  onboardingDeclineError: string;
  onboardingDeclinedNotice: string;
}

export interface LegalCommonStrings {
  back: string;
  lastUpdated: string;
}

export interface LegalDataProcessingStrings extends LegalCommonStrings {
  title: string;
  intro: string;
  section1Title: string;
  section1Body: string;
  section2Title: string;
  section2Body: string;
  section3Title: string;
  section3Body: string;
  section4Title: string;
  section4Body: string;
  section5Title: string;
  section5Body: string;
}

export interface LegalCookiesStrings extends LegalCommonStrings {
  title: string;
  intro: string;
  section1Title: string;
  section1Body: string;
  section2Title: string;
  section2Body: string;
  section3Title: string;
  section3Body: string;
  section4Title: string;
  section4Body: string;
}

export interface SharedStrings {
  selectNoData: string;
  loadingContent: string;
}

export interface CalendarStrings {
  title: string;
  /** Календарная неделя (ISO), плейсхолдер {week}. Напр. «KW 12», «Week 12». */
  calendarWeek: string;
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
  noStudentsForLesson: string;
  studentsSidebarEmpty: string;
  studentsSidebarNoResults: string;
  scheduledAtLabel: string;
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
  loadSchedule: string;
  loadLessonsError: string;
  loadStudentsError: string;
  selectStudentError: string;
  saveLessonError: string;
  deleteLessonError: string;
  balanceLabel: string;
  lastLessonHint: string;
  lastPaidPackageWarning: string;
  billingTitle: string;
  billingBodyBefore: string;
  billingBodyMiddle: string;
  billingBodyAfterDeduct: string;
  billingDeduct: string;
  billingKeep: string;
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
  conversionNote: string;
  reportCurrency: string;
  originalInCurrency: string;
  ratesAsOf: string;
}

export interface FinanceExchangeRates {
  base: string;
  reportCurrency: string;
  asOf: string;
  source: string;
  rates: Record<string, number>;
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
  defaultCurrency?: string;
  country: string;
  tax_mode: string;
  period: { from: string | null; to: string | null };
  exchangeRates: FinanceExchangeRates;
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
  billingSectionTitle: string;
  billingTypePackage: string;
  billingTypePostpaid: string;
  balanceLessonsField: string;
  creditLimitField: string;
}

export type LessonStatus = 'scheduled' | 'completed' | 'missed' | 'canceled';

export type StudentBillingType = 'package' | 'postpaid';

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
  /** Урок уже списан с balance_lessons ученика. */
  balance_debited?: boolean;
  /** Списание/буфер 30 мин обработан (true = с баланса уже списано). */
  billing_processed?: boolean;
  /** Время перевода в completed (старт 30-минутного буфера). */
  completed_at?: string;
  billing_processed_at?: string;
  notes?: string;
  /** Legacy-поля API / Firestore (не используются в UI календаря). */
  tutor?: string;
  student_name?: string | null;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Урок в сетке календаря с UI-флагами (не сохраняется в Firestore). */
export interface CalendarLesson extends Lesson {
  isLastPaid?: boolean;
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
  /** package — предоплата (balance_lessons); postpaid — постоплата / разовая. */
  billing_type?: StudentBillingType;
  /** Лимит долга в уроках (postpaid). */
  credit_limit?: number;
  /** Неоплаченные уроки (postpaid, увеличивает воркер). */
  unpaid_lessons_count?: number;
  timezone: string;
  auto_debit_enabled: boolean;
  bot_active: boolean;
  createdAt: string;
}
