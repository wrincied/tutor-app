/** Общие типы и интерфейсы приложения (i18n, API-модели). */

import type {
  AppCurrency,
  FinanceReportCurrency,
  RateCurrency,
  WorkspaceCurrency,
} from '../app/core/constants/currencies';
import {
  APP_CURRENCIES,
  FINANCE_REPORT_CURRENCIES,
  RATE_CURRENCIES,
  WORKSPACE_CURRENCIES,
} from '../app/core/constants/currencies';

export type { AppCurrency, FinanceReportCurrency, RateCurrency, WorkspaceCurrency };
export { APP_CURRENCIES, FINANCE_REPORT_CURRENCIES, RATE_CURRENCIES, WORKSPACE_CURRENCIES };

export type Lang = 'ru' | 'en' | 'de' | 'kz' | 'uk' | 'by';

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

/** Ключи для document.title (route data `title` и SeoService). */
export type PageTitleKey =
  | 'default'
  | 'landing'
  | 'login'
  | 'register'
  | 'legalDataProcessing'
  | 'legalCookies'
  | 'legalImpressum'
  | 'adminLogin'
  | 'verifyEmail'
  | 'onboarding'
  | 'home'
  | 'students'
  | 'calendar'
  | 'finance'
  | 'pricing'
  | 'account'
  | 'accountCustomization'
  | 'accountProfile'
  | 'accountAdministration'
  | 'admin'
  | 'adminUsers'
  | 'adminSettings'
  | 'adminLanding';

export type PageTitleStrings = Record<PageTitleKey, string>;

export type LegalCmsDocId = 'datenschutz' | 'impressum';

export interface LegalCmsDocument {
  id: LegalCmsDocId;
  title: string;
  body: string;
  updatedAt?: string | null;
  source?: 'firestore' | 'default';
}

export interface PublicContactInfo {
  email: string;
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
  | 'ua-fop3'
  | 'none';

export type SubscriptionStatus = 'free' | 'pro' | 'trial';

export type UserRole = 'tutor' | 'super_admin';

export interface SubscriptionPricing {
  country: string;
  currency: string;
  monthly: number;
  yearly: number;
}

export type WorkspaceLessonDuration = 45 | 60 | 90;

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
  workspace?: UserWorkspaceSettings;
  workingHours?: UserWorkingHoursSettings;
}

export interface AdminStats {
  totalUsers: number;
  paidUsers: number;
  trialUsers: number;
  conversionPercent: number;
  estimatedMrr: Record<string, number>;
}

export type AdminDashboardWidgetId =
  | 'kpi-total-users'
  | 'kpi-paid-users'
  | 'kpi-trial-users'
  | 'kpi-conversion'
  | 'kpi-mrr'
  | 'segments'
  | 'activation-funnel'
  | 'alerts'
  | 'last-visits'
  | 'geography'
  | 'product-usage';

export interface AdminDashboardSegments {
  active7d: number;
  inactive14d: number;
  trialExpiring7d: number;
  onboardingIncomplete: number;
  emailUnverified: number;
}

export interface AdminDashboardFunnel {
  registered: number;
  emailVerified: number;
  onboardingDone: number;
  hasStudent: number;
  hasLesson: number;
  activeWeek2: number;
}

export type AdminDashboardAlertType = 'trial_expiring_soon' | 'trial_expired' | 'pro_inactive';

export interface AdminDashboardAlert {
  type: AdminDashboardAlertType;
  user_id: string;
  email: string;
  trial_ends_at?: string | null;
  last_login_at?: string | null;
}

export interface AdminGeographyRow {
  country: string;
  count: number;
}

export interface AdminProductUsage {
  lessonsLast7d: number;
  totalStudents: number;
  avgStudentsPerTutor: number;
  tutorsWithFinance: number;
  financeUsersPercent: number;
}

export interface AdminDashboardPayload {
  stats: AdminStats;
  segments: AdminDashboardSegments;
  funnel: AdminDashboardFunnel;
  alerts: AdminDashboardAlert[];
  geography: AdminGeographyRow[];
  productUsage: AdminProductUsage;
}

export interface AdminPreferences {
  dashboard_widgets: AdminDashboardWidgetId[];
}

export interface AdminUserSummary {
  user: AdminUserRow;
  studentsCount: number;
  lessonsCount: number;
  recentActivity: ActivityLogEntry[];
}

export interface AdminUserRow {
  _id: string;
  email: string;
  subscription_status: SubscriptionStatus | string;
  trial_ends_at?: string | null;
  createdAt: string | null;
  last_login_at?: string | null;
  last_activity_at?: string | null;
  email_verified?: boolean;
  onboarding_completed?: boolean;
  country_settings?: string;
  role?: UserRole | string;
  studentsCount?: number;
}

export interface AdminStrings {
  title: string;
  navLink: string;
  dashboardTab: string;
  usersTab: string;
  settingsTab: string;
  landingTab: string;
  landingTitle: string;
  landingIntro: string;
  landingDatenschutz: string;
  landingImpressum: string;
  landingTitleField: string;
  landingBodyField: string;
  landingBodyHint: string;
  landingSave: string;
  landingSaving: string;
  landingSaved: string;
  landingLoadError: string;
  loading: string;
  loadError: string;
  refresh: string;
  customizeDashboard: string;
  settingsTitle: string;
  settingsIntro: string;
  settingsGroupKpi: string;
  settingsGroupAnalytics: string;
  settingsGroupTables: string;
  settingsSave: string;
  settingsSaving: string;
  settingsSaved: string;
  settingsReset: string;
  settingsResetConfirm: string;
  widgetKpiTotalUsers: string;
  widgetKpiPaidUsers: string;
  widgetKpiTrialUsers: string;
  widgetKpiConversion: string;
  widgetKpiMrr: string;
  widgetSegments: string;
  widgetActivationFunnel: string;
  widgetAlerts: string;
  widgetLastVisits: string;
  widgetGeography: string;
  widgetProductUsage: string;
  metricTotalUsers: string;
  metricPaidUsers: string;
  metricTrialUsers: string;
  metricConversion: string;
  metricRevenue: string;
  revenueHint: string;
  segmentActive7d: string;
  segmentInactive14d: string;
  segmentTrialExpiring: string;
  segmentOnboardingIncomplete: string;
  segmentEmailUnverified: string;
  funnelTitle: string;
  funnelRegistered: string;
  funnelEmailVerified: string;
  funnelOnboardingDone: string;
  funnelHasStudent: string;
  funnelHasLesson: string;
  funnelActiveWeek2: string;
  alertsTitle: string;
  alertsEmpty: string;
  alertTrialExpiringSoon: string;
  alertTrialExpired: string;
  alertProInactive: string;
  geographyTitle: string;
  geographyCountry: string;
  geographyUsers: string;
  geographyEmpty: string;
  productUsageTitle: string;
  productLessons7d: string;
  productTotalStudents: string;
  productAvgStudents: string;
  productFinanceUsers: string;
  lastVisitsTitle: string;
  lastVisitsHint: string;
  tableEmail: string;
  tableStatus: string;
  tableRegistered: string;
  tableLastVisit: string;
  tableWhen: string;
  tableAction: string;
  tableActions: string;
  tableCountry: string;
  tableStudents: string;
  noVisits: string;
  noAlerts: string;
  never: string;
  searchUsers: string;
  exportCsv: string;
  sortByRegistered: string;
  sortByLastVisit: string;
  sortByEmail: string;
  userDetailTitle: string;
  userDetailStudents: string;
  userDetailLessons: string;
  userDetailRecentActivity: string;
  userDetailLoading: string;
  userDetailError: string;
  statusFree: string;
  statusPro: string;
  statusTrial: string;
  trialEndsUntil: string;
  giftTrial: string;
  giftingTrial: string;
  giftTrialSuccess: string;
  giftTrialError: string;
  editSubscription: string;
  editSubscriptionTitle: string;
  subscriptionField: string;
  trialEndsLabel: string;
  saveSubscription: string;
  savingSubscription: string;
  cancelEdit: string;
  updateSubscriptionSuccess: string;
  updateSubscriptionError: string;
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
  taxModeChangeHint: string;
  taxModeConfirmTitle: string;
  taxModeConfirmBody: string;
  taxModeConfirmConfirm: string;
  taxModeConfirmCancel: string;
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
  customizationTab: string;
  accountTab: string;
  administrationTab: string;
  activityLogSection: string;
  activityLogEmpty: string;
  administrationIntro: string;
  workspaceSection: string;
  workspaceName: string;
  workspaceCurrency: string;
  workspaceDefaultDuration: string;
  workingHoursSection: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  workingDays: string;
  workspaceSaving: string;
  workspaceSaved: string;
}

/** Публичная визитка / лендинг + auth. */
export interface AuthStrings {
  landingHeadline: string;
  landingSubtitle: string;
  join: string;
  landingSignIn: string;
  landingFeaturesTitle: string;
  landingFeatureScheduleTitle: string;
  landingFeatureScheduleBody: string;
  landingFeatureStudentsTitle: string;
  landingFeatureStudentsBody: string;
  landingFeatureFinanceTitle: string;
  landingFeatureFinanceBody: string;
  landingHowTitle: string;
  landingHowBody: string;
  landingClosingTitle: string;
  landingClosingCta: string;
  footerDatenschutz: string;
  footerImpressum: string;
  footerKontakt: string;
  footerCookies: string;
  footerRights: string;
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
  backHome: string;
  hasAccount: string;
  noAccount: string;
  wrongCredentials: string;
  passwordsMismatch: string;
  passwordMinLength: string;
  registerError: string;
  emailAlreadyInUse: string;
  emailAlreadyInUseGoogle: string;
  invalidEmail: string;
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
  oauthErrorGithub: string;
  profileSyncError: string;
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
  lessonDescriptionLabel: string;
  advancedSettingsLabel: string;
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
  billingMissedTitle: string;
  billingCanceledTitle: string;
  billingRefundTitle: string;
  billingRefundBodyBefore: string;
  billingRefundBodyMiddle: string;
  billingRefundBodyAfter: string;
  billingRefundConfirm: string;
  billingRefundKeep: string;
  billingRefundOnlyAction: string;
  billingDebitedHint: string;
  statusScheduled: string;
  statusCompleted: string;
  statusMissed: string;
  statusCanceled: string;
  durationHourShort: string;
  durationMinShort: string;
  durationOneHour: string;
  recurrenceLabel: string;
  recurrenceHint: string;
  recurrenceModalTitle: string;
  recurrenceApply: string;
  recurrencePresetNone: string;
  recurrencePresetDaily: string;
  recurrencePresetWeekly: string;
  recurrencePresetMonthly: string;
  recurrencePresetCustom: string;
  recurrenceFreqWeekly: string;
  recurrenceFreqMonthly: string;
  recurrenceDaily: string;
  recurrenceDailyInterval: string;
  recurrenceWeekly: string;
  recurrenceWeeklyInterval: string;
  recurrenceMonthly: string;
  recurrenceMonthlyInterval: string;
  recurrenceMonthlyOnDay: string;
  recurrenceEveryLabel: string;
  recurrenceUnitDays: string;
  recurrenceUnitWeeks: string;
  recurrenceUnitMonths: string;
  recurrenceUnitOccurrences: string;
  recurrenceWeekdaysLabel: string;
  recurrenceWeekdaysRequired: string;
  recurrenceEndSection: string;
  recurrenceEndNever: string;
  recurrenceEndUntil: string;
  recurrenceEndUntilShort: string;
  recurrenceEndCount: string;
  recurrenceEndCountShort: string;
  recurrenceCountLabel: string;
  recurrenceUntilLabel: string;
  recurrenceUntilHint: string;
  deleteRecurringTitle: string;
  deleteRecurringOccurrence: string;
  deleteRecurringSeries: string;
  weekdayMon: string;
  weekdayTue: string;
  weekdayWed: string;
  weekdayThu: string;
  weekdayFri: string;
  weekdaySat: string;
  weekdaySun: string;
  /** Месяц: «+ ещё {count}» под плашками уроков. */
  monthMoreLessons: string;
  /** Колонка вне рабочих дней. */
  dayOffLabel: string;
}

export interface HomeStrings {
  greetingAnonymous: string;
  greetingNamed: string;
  todaySection: string;
  todayLessons: string;
  todayIncome: string;
  todayHours: string;
  todayCompleted: string;
  todayScheduled: string;
  incomeApproxHint: string;
  lessonsEmpty: string;
  nextLessonTitle: string;
  nextLessonNone: string;
  todayAgenda: string;
  overdueLessonsHint: string;
  lowBalanceTitle: string;
  lowBalanceLessonsLeft: string;
  loading: string;
  loadError: string;
  betaTitle: string;
  betaBody: string;
  betaDismiss: string;
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
  expenseCurrency: string;
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
  ratesSource: string;
  ratesDebug: string;
  activityLogSection: string;
  activityLogEmpty: string;
  kpiDetailsClose: string;
  incomeBreakdownTitle: string;
  incomeBreakdownIntro: string;
  expensesBreakdownTitle: string;
  expensesBreakdownIntro: string;
  grossProfitBreakdownTitle: string;
  grossProfitBreakdownIntro: string;
  netProfitBreakdownTitle: string;
  netProfitBreakdownIntro: string;
  breakdownLessonsList: string;
  breakdownExpensesList: string;
  breakdownLessonDate: string;
  breakdownLessonStudent: string;
  breakdownLessonStatus: string;
  breakdownLessonDuration: string;
  breakdownLessonAmount: string;
  breakdownRecurringNote: string;
  breakdownHiddenInCalendar: string;
  breakdownOpenCalendar: string;
  breakdownOpenCalendarDate: string;
  breakdownMinutes: string;
  breakdownEmptyLessons: string;
  breakdownEmptyExpenses: string;
  breakdownTapHint: string;
  breakdownBack: string;
  breakdownHiddenNoSchedule: string;
  breakdownHiddenBrokenRecurrence: string;
  breakdownScheduleDerived: string;
  exportPdf: string;
  exportingPdf: string;
  exportPdfError: string;
  pdfGeneratedAt: string;
  pdfSummary: string;
}

export interface FinanceLessonBreakdown {
  id: string;
  lessonId?: string;
  studentId: string | null;
  studentName: string | null;
  scheduledAt: string | null;
  occurrenceDate?: string | null;
  status: string;
  durationMinutes: number;
  amountReport: number;
  amountOriginal: number;
  currency: string;
  visibleInCalendar: boolean;
  isRecurring: boolean;
  incomeType: 'completed' | 'scheduled' | 'none';
  hiddenReason?: 'no_schedule' | 'broken_recurrence' | null;
  scheduleDerived?: boolean;
}

export interface FinanceExpenseBreakdown {
  id: string;
  title: string;
  amount: number;
  currency: string;
  amountReport: number;
  expense_date: string;
  category: string;
}

export interface FinanceExchangeRates {
  /** Базовая валюта конвертации (обычно EUR). */
  base: string;
  reportCurrency: string;
  /** Дата курса ЦБ / официального источника. */
  asOf: string;
  /** Человекочитаемый источник, напр. ECB, NBRB, NBK. */
  source: string;
  /** units per 1 base currency */
  rates: Record<string, number>;
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  /** Валюта суммы при вводе; у старых записей может отсутствовать — тогда валюта страны аккаунта. */
  currency?: string;
  expense_date: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinanceTaxProjection {
  mode: string;
  socialInsuranceRate: number;
  socialInsurance: number;
  taxableBase: number;
  incomeTax: number;
  netProfit: number;
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
  /** Универсальная налоговая оценка для выбранного режима. */
  tax: FinanceTaxProjection | null;
  /**
   * @deprecated Alias для AT: совпадает с tax при at-self-employed.
   * Новый код должен читать `tax`.
   */
  austria: FinanceTaxProjection | null;
  lessonsBreakdown?: FinanceLessonBreakdown[];
  expensesBreakdown?: FinanceExpenseBreakdown[];
}

export interface StudentStrings {
  addButton: string;
  emptyState: string;
  loading: string;
  newStudent: string;
  editModalTitle: string;
  name: string;
  ratePerLesson: string;
  ratePerHour: string;
  rateUnitTitle: string;
  /** Aria for rate-unit help tip */
  rateUnitInfoAria: string;
  /** Hover/tap explanation for hour vs lesson pricing */
  rateUnitInfo: string;
  rateColumn: string;
  balanceLessons: string;
  perLesson: string;
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
  /** Aria for Telegram help tip */
  botInfoAria: string;
  /** Temporary Telegram tip copy */
  botComingSoon: string;
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
  billingInfoAria: string;
  billingInfoPackage: string;
  billingInfoPostpaid: string;
  balanceLessonsField: string;
  creditLimitField: string;
  activityLogSection: string;
  activityLogEmpty: string;
}

export interface ActivityLogChange {
  field: string;
  from: unknown;
  to: unknown;
}

export interface ActivityLogEntry {
  _id: string;
  category: 'finance' | 'students';
  action: string;
  entity_type: string;
  entity_id?: string;
  summary?: string;
  changes?: ActivityLogChange[];
  metadata?: Record<string, unknown>;
  student_name?: string | null;
  createdAt?: string;
}

export interface ActivityLogStrings {
  loading: string;
  loadError: string;
  actionExpenseCreated: string;
  actionExpenseUpdated: string;
  actionExpenseDeleted: string;
  actionStudentCreated: string;
  actionStudentUpdated: string;
  actionStudentDeleted: string;
  actionStudentTopup: string;
  actionBalanceDebit: string;
  actionBalanceCredit: string;
  fieldName: string;
  fieldRate: string;
  fieldRateCurrency: string;
  fieldTimezone: string;
  fieldBotActive: string;
  fieldBalanceLessons: string;
  fieldBillingType: string;
  fieldCreditLimit: string;
  fieldAutoDebit: string;
  fieldColor: string;
  fieldExpenseTitle: string;
  fieldExpenseAmount: string;
  fieldExpenseDate: string;
  fieldExpenseCategory: string;
  valueOn: string;
  valueOff: string;
  valuePackage: string;
  valuePostpaid: string;
  reasonLessonCompleted: string;
  reasonLessonPostpaid: string;
  reasonLessonMissed: string;
  reasonLessonCanceled: string;
  reasonLessonRefund: string;
  reasonLessonUncompleted: string;
  reasonLessonDeleted: string;
  changeArrow: string;
  lessonsUnit: string;
}

export type LessonStatus = 'scheduled' | 'completed' | 'missed' | 'canceled';

export type StudentBillingType = 'package' | 'postpaid';

export type StudentRateUnit = 'hour' | 'lesson';

export type LessonPriceMode = 'fixed' | 'hourly';

/**
 * Урок в коллекции `lessons`.
 * `scheduledAt` + `lesson_duration` — интервал в БД (без миграции на start_at/end_at).
 * `lesson_price` + `lesson_currency` + `price_mode` — снапшот ставки и режима на момент создания
 * (или при смене ученика); не меняется при правке ставки ученика в профиле.
 */
export interface Lesson {
  _id: string;
  student_id: string | null;
  status: LessonStatus;
  scheduledAt: string;
  lesson_duration: number;
  /**
   * Ставка снапшота: при `price_mode: 'hourly'` — за час;
   * при `price_mode: 'fixed'` — фиксированная сумма за урок.
   */
  lesson_price: number;
  /** Валюта снапшота (EUR, USD, PLN, RUB, BYN, KZT, UAH). */
  lesson_currency: string;
  /** Режим цены: hourly = × duration/60, fixed = lesson_price как есть. */
  price_mode?: LessonPriceMode;
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
  /** Повтор по дням недели (RFC 5545 RRULE). */
  isRecurring?: boolean;
  /** Дата первого урока серии (YYYY-MM-DD). */
  startDate?: string | null;
  /** Напр. FREQ=WEEKLY;BYDAY=MO,WE */
  rrule?: string | null;
  /** Исключённые даты вхождений (YYYY-MM-DD). */
  exdates?: string[];
  /** Даты проведённых вхождений (YYYY-MM-DD), баланс списан. */
  completedDates?: string[];
}

/** Урок в сетке календаря с UI-флагами (не сохраняется в Firestore). */
export interface CalendarLesson extends Lesson {
  isLastPaid?: boolean;
  /** Ключ виртуального вхождения: `{lessonId}:{yyyy-MM-dd}`. */
  occurrenceKey?: string;
  isVirtualOccurrence?: boolean;
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
  /** hour — ставка за час; lesson — фиксированная сумма за урок. */
  rate_unit?: StudentRateUnit;
  /** Лимит долга в уроках (postpaid). */
  credit_limit?: number;
  /** Неоплаченные уроки (postpaid, увеличивает воркер). */
  unpaid_lessons_count?: number;
  timezone: string;
  auto_debit_enabled: boolean;
  bot_active: boolean;
  createdAt: string;
}
