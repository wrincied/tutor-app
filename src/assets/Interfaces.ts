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
  /** Short value line under the plan name. */
  subtitle: string;
  /** Logged-in free user (current plan). */
  cta: string;
  /** Guest CTA on public /pricing. */
  ctaGuest: string;
  features: string[];
}

/** Paid plan copy shared by Basis and Pro (amounts come from pricing utils). */
export interface PricingPaidPlanCopy {
  name: string;
  periodMonthly: string;
  periodYearly: string;
  /** Yearly mode footnote. Placeholders: `{amount}`, `{currency}`. */
  billedAnnually: string;
  /** Optional highlight under the plan name (trial / value line). */
  trialBadge: string;
  microcopy: string;
  cta: string;
  ctaLoading: string;
  features: string[];
}

/** @deprecated Use PricingPaidPlanCopy */
export type PricingProPlanCopy = PricingPaidPlanCopy;

export interface PricingStrings {
  title: string;
  subtitle: string;
  toggleMonthly: string;
  toggleYearly: string;
  saveBadge: string;
  recommendedBadge: string;
  /** Soft highlight on Basis (e.g. “For small tutors”). */
  basisBadge: string;
  /** Strong highlight on Pro (e.g. “Pays for itself”). */
  proValueBadge: string;
  freePlan: PricingPlanCopy;
  basisPlan: PricingPaidPlanCopy;
  proPlan: PricingPaidPlanCopy;
  stripeNote: string;
  stripeNoteBasis: string;
  taxRequired: string;
  /** Disabled CTA on the active plan card. */
  currentPlanCta: string;
  /** Outline CTA on lower plans when user is on a higher paid plan. */
  downgradeCta: string;
  downgradeToFreeTitle: string;
  downgradeToFreeBody: string;
  downgradeToFreeConfirm: string;
  downgradeToBasisTitle: string;
  /** Placeholders: `{current_period_end}`, `{basis_price}`. */
  downgradeToBasisBody: string;
  downgradeToBasisConfirm: string;
  downgradeKeep: string;
  /** Safe cancel label when downgrading from Pro → Basis. */
  downgradeKeepPro: string;
  downgradeLoading: string;
  /** Shown on Basis when Pro→Basis is already scheduled. Placeholder: `{date}`. */
  downgradeBasisScheduledCta: string;
  downgradeBasisScheduledHint: string;
  /** Shown on Free when cancel_at_period_end is already scheduled. Placeholder: `{date}`. */
  cancelScheduledCta: string;
  /** Extra line under Free CTA when cancel is scheduled. Placeholder: `{date}`. */
  cancelScheduledHint: string;
  alreadyBasis: string;
  alreadyPro: string;
  alreadyTrial: string;
  accountLink: string;
  faq: {
    title: string;
    items: PricingFaqItem[];
  };
}

export interface PaymentStrings {
  backToPricing: string;
  planPrefix: string;
  intervalMonthly: string;
  intervalYearly: string;
  /** Short period unit for “/ month” lines, e.g. месяц / month. */
  periodMonth: string;
  periodYear: string;
  /** Placeholders: {amount}, {currency} */
  dueToday: string;
  /** Placeholders: {amount}, {currency}, {period}, {days} */
  thenAfterTrial: string;
  /** Placeholders: {days} */
  timelineToday: string;
  /** Placeholders: {days}, {amount}, {currency} */
  timelineCharge: string;
  features: [string, string, string];
  methodsTitle: string;
  methodsSubtitle: string;
  tributeName: string;
  tributeRegion: string;
  tributeHint: string;
  tributeBadges: [string, string, string];
  stripeName: string;
  stripeRegion: string;
  stripeHint: string;
  stripeBadges: string[];
  recommended: string;
  unavailable: string;
  /** Placeholders: {days} */
  payCtaTrial: string;
  /** Placeholders: {amount}, {currency} */
  payCtaPayNow: string;
  payLoading: string;
  /** Lead-in before terms/privacy links inside the consent checkbox label. */
  legalBefore: string;
  legalTerms: string;
  legalMid: string;
  legalPrivacy: string;
  legalAfter: string;
  tributeNotReady: string;
  stripeNotReady: string;
  /** Shown when CIS preferred Tribute but Stripe is used as temporary fallback. */
  stripeFallbackHint: string;
  taxRequired: string;
  accountLink: string;
  loadError: string;
  payError: string;
}

export interface HelpFormStrings {
  formTitle: string;
  nameLabel: string;
  emailLabel: string;
  subjectLabel: string;
  messageLabel: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  captchaRequired: string;
  rateLimited: string;
  /** Placeholder: {email} */
  mailHint: string;
  mailCta: string;
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
  | 'legalTerms'
  | 'help'
  | 'status'
  | 'adminLogin'
  | 'verifyEmail'
  | 'onboarding'
  | 'home'
  | 'students'
  | 'calendar'
  | 'workspace'
  | 'finance'
  | 'pricing'
  | 'payment'
  | 'account'
  | 'accountCustomization'
  | 'accountProfile'
  | 'accountAdministration'
  | 'admin'
  | 'adminUsers'
  | 'adminSettings'
  | 'adminLanding'
  | 'notFound';

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
  workspace: string;
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
  | 'by-self-employed'
  | 'kz-ip'
  | 'ua-fop3'
  | 'none';

export type SubscriptionStatus = 'free' | 'basis' | 'pro' | 'trial';

/** Feature gates for Free / Basis / Pro (from API enrichUserProfile). */
export interface PlanEntitlements {
  /** null = unlimited */
  max_students: number | null;
  has_finance: boolean;
  has_telegram: boolean;
}

export type UserRole = 'tutor' | 'super_admin';

export interface SubscriptionPricing {
  country: string;
  currency: string;
  monthly: number;
  yearly: number;
}

export type WorkspaceLessonDuration = 45 | 60 | 90 | 120;

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

/** Out-of-office / vacation mode for the tutor workspace. */
export interface UserVacationSettings {
  enabled: boolean;
  /** Inclusive YYYY-MM-DD, or empty when unset. */
  startDate: string;
  /** Inclusive YYYY-MM-DD, or empty when unset. */
  endDate: string;
  /** Auto-reply / note for students (Telegram / calendar later). */
  message: string;
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
  /** ISO end of Stripe trial, when status is trial. */
  trial_ends_at?: string | null;
  /** User scheduled cancel at period end. */
  cancel_at_period_end?: boolean;
  /** ISO when access ends after cancel-at-period-end. */
  subscription_cancel_at?: string | null;
  /** ISO end of current Stripe billing period (or trial end). */
  subscription_current_period_end?: string | null;
  /** Billing interval of the active Stripe subscription. */
  subscription_interval?: 'monthly' | 'yearly' | null;
  /** Scheduled plan change (e.g. Pro → Basis at period end). */
  pending_plan?: 'basis' | null;
  /** ISO when pending_plan takes effect. */
  pending_plan_at?: string | null;
  /** Whether a Stripe subscription id is linked. */
  has_stripe_subscription?: boolean;
  /** Feature gates derived from subscription_status. */
  plan_entitlements?: PlanEntitlements;
  email_verified?: boolean;
  role?: UserRole | string;
  workspace?: UserWorkspaceSettings;
  workingHours?: UserWorkingHoursSettings;
  vacation?: UserVacationSettings;
}

export interface AdminStats {
  totalUsers: number;
  /** Basis + Pro (без Trial). */
  paidUsers: number;
  basisUsers: number;
  proUsers: number;
  trialUsers: number;
  conversionPercent: number;
  estimatedMrr: Record<string, number>;
}

export type AdminDashboardWidgetId =
  | 'kpi-total-users'
  | 'kpi-basis-users'
  | 'kpi-paid-users'
  | 'kpi-pro-users'
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
  widgetKpiBasisUsers: string;
  widgetKpiPaidUsers: string;
  widgetKpiProUsers: string;
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
  metricBasisUsers: string;
  metricPaidUsers: string;
  metricProUsers: string;
  metricTrialUsers: string;
  metricConversion: string;
  metricRevenue: string;
  revenueHint: string;
  paidBreakdownHint: string;
  signedInAs: string;
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
  statusBasis: string;
  statusPro: string;
  statusTrial: string;
  trialEndsUntil: string;
  giftTrial: string;
  giftingTrial: string;
  giftTrialSuccess: string;
  giftTrialError: string;
  verifyEmail: string;
  verifyingEmail: string;
  verifyEmailSuccess: string;
  verifyEmailError: string;
  verifyEmailAlready: string;
  emailVerifiedBadge: string;
  emailUnverifiedBadge: string;
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
  /** Hint when signed in with Google only (no password provider). */
  googlePasswordHint: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  subscriptionSection: string;
  subscriptionStatus: string;
  subscriptionFree: string;
  subscriptionBasis: string;
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
  /** Firebase reauth failed: wrong current password. */
  currentPasswordIncorrect: string;
  saveError: string;
  subscriptionManagedByPayment: string;
  taxModeRequiredHint: string;
  taxModeChangeHint: string;
  taxModeConfirmTitle: string;
  taxModeConfirmBody: string;
  taxModeConfirmConfirm: string;
  taxModeConfirmCancel: string;
  taxModeUnsavedHint: string;
  unsavedTaxTitle: string;
  unsavedTaxBody: string;
  unsavedTaxStay: string;
  unsavedTaxLeave: string;
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
  cancelSubscription: string;
  cancelSubscriptionConfirmTitle: string;
  cancelSubscriptionConfirmBody: string;
  cancelSubscriptionConfirm: string;
  cancelSubscriptionKeep: string;
  /** Pending cancel → Free. Placeholder: `{date}`. */
  cancelSubscriptionScheduled: string;
  resumeSubscription: string;
  cancelSubscriptionLoading: string;
  cancelSubscriptionError: string;
  customizationTab: string;
  accountTab: string;
  supportTab: string;
  administrationTab: string;
  activityLogSection: string;
  activityLogEmpty: string;
  administrationIntro: string;
  workspaceSection: string;
  workspaceName: string;
  workspaceCurrency: string;
  workspaceDefaultDuration: string;
  workingHoursSection: string;
  workingHoursSubtitle: string;
  workingHoursField: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  workingHoursFrom: string;
  workingHoursTo: string;
  workingDays: string;
  workspaceSaving: string;
  workspaceSaved: string;
  workspaceSaveChanges: string;
  workspaceSaveError: string;
  vacationSection: string;
  vacationSubtitle: string;
  vacationEnable: string;
  vacationTimelineEmpty: string;
  vacationTimelineDefault: string;
  vacationStart: string;
  vacationEnd: string;
  vacationMessage: string;
  vacationMessageHint: string;
  vacationSave: string;
  vacationSaving: string;
  vacationSaved: string;
  vacationSaveError: string;
  vacationDatesRequired: string;
  vacationDatesInvalid: string;
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
  /** Short nav CTA (Anmelden / Войти). Used by landing-v2 sticky header. */
  landingNavSignIn: string;
  landingTrustTitle: string;
  landingTrustBody: string;
  landingMockWeek: string;
  landingMockFinance: string;
  landingMockIncome: string;
  landingMockExpenses: string;
  landingMockNet: string;
  landingMockStudents: string;
  landingMockLessonsLeft: string;
  landingMockPeriodAt: string;
  landingMockExpenseCoworking: string;
  landingMockExpenseSoftware: string;
  landingMockExpenseMaterials: string;
  landingMockExpenseTransit: string;
  landingMockSvs: string;
  /** Telegram bot preview section (design landing). */
  landingBotTitle: string;
  landingBotBody: string;
  landingMockComingSoon: string;
  landingMockBotHeader: string;
  landingMockBotBalance: string;
  landingMockBotPayment: string;
  landingMockBotLessonStart: string;
  landingMockBotHomework: string;
  /** Vacation / absence mode preview. */
  landingVacationTitle: string;
  landingVacationBody: string;
  landingMockVacationMode: string;
  landingMockVacationOn: string;
  landingMockVacationStart: string;
  landingMockVacationEnd: string;
  landingMockVacationMessage: string;
  landingMockVacationMessageText: string;
  landingMockVacationHint: string;
  /** Self-booking calendar link preview. */
  landingBookingTitle: string;
  landingBookingBody: string;
  landingMockBookingLink: string;
  landingMockBookingPick: string;
  landingMockBookingSlot1: string;
  landingMockBookingSlot2: string;
  landingMockBookingSlot3: string;
  landingMockBookingConfirm: string;
  /** Audience line under hero subtitle (landing-v2 trial). */
  landingAudience: string;
  /** Microcopy under primary CTA (e.g. free tier hint). */
  landingCtaHint: string;
  landingNavPricing: string;
  landingPricingTitle: string;
  landingPricingLead: string;
  landingPricingToggleMonthly: string;
  landingPricingToggleYearly: string;
  landingPricingFreeLabel: string;
  /** Value line under Free title (same role as Basis/Pro trial lines). */
  landingPricingFreeSubtitle: string;
  landingPricingBasisLabel: string;
  landingPricingProLabel: string;
  landingPricingBasisBadge: string;
  landingPricingProBadge: string;
  /** Line under Basis title. */
  landingPricingBasisTrial: string;
  /** Trial line under Pro title. */
  landingPricingProTrial: string;
  landingPricingFreePeriod: string;
  landingPricingBasisPeriodMonthly: string;
  landingPricingProPeriodMonthly: string;
  landingPricingProPeriodYearly: string;
  /** Yearly mode footnote. Placeholders: `{amount}`, `{currency}`. */
  landingPricingBilledAnnually: string;
  landingPricingFreeFeatures: string[];
  landingPricingBasisFeatures: string[];
  landingPricingProFeatures: string[];
  landingPricingFreeCta: string;
  landingPricingBasisCta: string;
  landingPricingProCta: string;
  landingPricingLink: string;
  landingFaqTitle: string;
  landingFaq1Q: string;
  landingFaq1A: string;
  landingFaq2Q: string;
  landingFaq2A: string;
  landingFaq3Q: string;
  landingFaq3A: string;
  landingFaq4Q: string;
  landingFaq4A: string;
  landingFaq5Q: string;
  landingFaq5A: string;
  landingFaq6Q: string;
  landingFaq6A: string;
  footerDatenschutz: string;
  footerImpressum: string;
  footerKontakt: string;
  footerCookies: string;
  footerRights: string;
  footerColProduct: string;
  footerColCompany: string;
  footerColLegal: string;
  footerFeatures: string;
  footerStatus: string;
  footerHelpCenter: string;
  footerFaq: string;
  footerTerms: string;
  footerCookieSettings: string;
  footerStatusLive: string;
  helpTitle: string;
  helpIntro: string;
  helpGuideProfile: string;
  helpGuideStudents: string;
  helpGuideFinance: string;
  helpFaqCta: string;
  helpContactCta: string;
  statusTitle: string;
  statusLead: string;
  statusAllOk: string;
  statusApp: string;
  statusDatabase: string;
  statusStripe: string;
  statusOperational: string;
  statusChecking: string;
  statusDegraded: string;
  statusOutage: string;
  statusDown: string;
  statusUnconfigured: string;
  statusUnknown: string;
  statusCheckedAt: string;
  statusRefresh: string;
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
  notFoundTitle: string;
  notFoundBody: string;
  notFoundGoApp: string;
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
  cookieBannerTitle: string;
  cookieBannerBody: string;
  cookieAcceptAll: string;
  cookieEssentialOnly: string;
  cookieSettings: string;
  cookieSave: string;
  cookieBack: string;
  cookieCatEssential: string;
  cookieCatEssentialDesc: string;
  cookieCatFunctional: string;
  cookieCatFunctionalDesc: string;
  cookieCatAnalytics: string;
  cookieCatAnalyticsDesc: string;
  cookieAlwaysOn: string;
  cookiePolicyLink: string;
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

/** Shared chrome + Impressum fallback (CMS failure). */
export interface LegalStrings extends LegalCommonStrings {
  impressumTitle: string;
  impressumUnavailable: string;
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

export interface LegalCookieTableRow {
  category: string;
  name: string;
  provider: string;
  purpose: string;
  retention: string;
}

export interface LegalCookiesStrings extends LegalCommonStrings {
  title: string;
  intro: string;
  definitionTitle: string;
  definitionBody: string;
  categoriesTitle: string;
  essentialTitle: string;
  essentialBody: string;
  functionalTitle: string;
  functionalBody: string;
  analyticsTitle: string;
  analyticsBody: string;
  tableTitle: string;
  tableCategory: string;
  tableName: string;
  tableProvider: string;
  tablePurpose: string;
  tableRetention: string;
  tableRows: LegalCookieTableRow[];
  withdrawTitle: string;
  withdrawBody: string;
  contactBody: string;
}

export interface LegalTermsStrings extends LegalCommonStrings {
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
  section6Title: string;
  section6Body: string;
  section7Title: string;
  section7Body: string;
  section8Title: string;
  section8Body: string;
  section9Title: string;
  section9Body: string;
  section10Title: string;
  section10Body: string;
}

export interface SharedStrings {
  selectNoData: string;
  loadingContent: string;
  planStudentLimitTitle: string;
  /** Placeholder `{max}`. */
  planStudentLimitBody: string;
  planFinanceRequiredTitle: string;
  planFinanceRequiredBody: string;
  planTelegramRequiredTitle: string;
  planTelegramRequiredBody: string;
  planUpgradeCta: string;
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
  scheduledDateLabel: string;
  scheduledTimeLabel: string;
  lessonDescriptionLabel: string;
  advancedSettingsLabel: string;
  notesPlaceholder: string;
  notesNewPlaceholder: string;
  snapshotRateLabel: string;
  snapshotWillUpdate: string;
  snapshotWillFix: string;
  snapshotRefreshAction: string;
  snapshotRefreshing: string;
  snapshotRefreshDone: string;
  snapshotRefreshError: string;
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
  billingKeepHint: string;
  billingConfirm: string;
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
  statusLegendAria: string;
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
  deleteRecurringOccurrenceHint: string;
  deleteRecurringSeries: string;
  deleteRecurringSeriesHint: string;
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
  /** Вкладки мобильной формы урока. */
  lessonFormTabData: string;
  lessonFormTabOccupancy: string;
  /** Хронология занятости. */
  occupancyPickDate: string;
  occupancyEmpty: string;
  /** Предупреждение о долге при нулевом балансе. */
  debtWarning: string;
  /** Чекбокс уведомления в Telegram. */
  lessonTelegramNotify: string;
  /** Слот нового урока в хронологии. */
  newLessonSlotLabel: string;
  /** Конфликт времени в хронологии. */
  timeSlotBusy: string;
  telegramStatusConnected: string;
  telegramStatusDisconnected: string;
  telegramStatusPaused: string;
  telegramStatusError: string;
}

export interface HomeStrings {
  greetingAnonymous: string;
  greetingNamed: string;
  todaySection: string;
  todayLessons: string;
  todayIncome: string;
  todayIncomeToday: string;
  todayIncomeWeek: string;
  todayHours: string;
  todayCompleted: string;
  todayScheduled: string;
  incomeApproxHint: string;
  lessonsEmpty: string;
  lessonsEmptyCta: string;
  newLessonCta: string;
  nextLessonTitle: string;
  nextLessonNone: string;
  todayAgenda: string;
  scheduleTitle: string;
  scheduleTodayBtn: string;
  overdueLessonsHint: string;
  lowBalanceTitle: string;
  lowBalanceLessonsLeft: string;
  lowBalanceAllOk: string;
  paymentPackage: string;
  paymentPackageProgress: string;
  paymentUnpaid: string;
  attentionTitle: string;
  telegramBotTitle: string;
  telegramBotActive: string;
  telegramBotInactive: string;
  telegramBotUnavailable: string;
  telegramBotProBadge: string;
  telegramBotLearnMore: string;
  telegramRemindersToday: string;
  telegramLinkedStudents: string;
  loading: string;
  loadError: string;
  betaTitle: string;
  betaBody: string;
  betaDismiss: string;
  billingCongratsTrialTitle: string;
  billingCongratsProTitle: string;
  billingCongratsTrialBody: string;
  billingCongratsProBody: string;
  billingCongratsDismiss: string;
  billingCongratsManage: string;
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
  /** Free-plan teaser overlay */
  teaserDemoBadge: string;
  teaserTitle: string;
  teaserBody: string;
  teaserCta: string;
  /** Modal when Free user taps a gated action */
  upgradeActionTitle: string;
  upgradeActionBody: string;
  upgradeActionCta: string;
  upgradeActionClose: string;
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
  /** Только при `scope=home` — укороченный список учеников без отдельного GET. */
  students?: Pick<
    Student,
    | '_id'
    | 'name'
    | 'color_hex'
    | 'balance_lessons'
    | 'billing_type'
    | 'rate_unit'
    | 'last_topup'
    | 'unpaid_lessons_count'
    | 'bot_active'
    | 'telegram_chat_id'
  >[];
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
  resyncLessonsTitle: string;
  resyncLessonsBody: string;
  resyncLessonsConfirm: string;
  resyncLessonsCancel: string;
  resyncLessonsRunning: string;
  resyncLessonsDone: string;
  resyncLessonsError: string;
  rateColumn: string;
  balanceLessons: string;
  perLesson: string;
  perHour: string;
  timezone: string;
  edit: string;
  delete: string;
  /** Confirm dialog title for deleting a student */
  deleteStudentTitle: string;
  topup: string;
  cancel: string;
  save: string;
  saving: string;
  close: string;
  autoTimezone: string;
  deleteConfirm: string;
  topupTitle: string;
  topupHint: string;
  /** Top-up hint when rate_unit is hour */
  topupHintHours: string;
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
  /** Invite / linked Telegram profile block */
  botInviteHint: string;
  botInviteLinkLabel: string;
  botInviteButton: string;
  botInviteDialogTitle: string;
  botOpenInTelegram: string;
  botInviteLinkFailed: string;
  botCopyLink: string;
  botLinkCopied: string;
  botNotLinked: string;
  botLinkedTitle: string;
  botTelegramUid: string;
  botTelegramUsername: string;
  botTelegramName: string;
  botSaveToGetLink: string;
  meetingLinkLabel: string;
  meetingLinkPlaceholder: string;
  botUnlinkAlertTitle: string;
  botUnlinkAlertMessage: string;
  botUnlinkAlertOk: string;
  /** Tutor disconnects Telegram link for this student */
  botDisconnect: string;
  botDisconnectTitle: string;
  botDisconnectMessage: string;
  botDisconnectConfirm: string;
  /** Column: last top-up amount + date */
  totalPaidColumn: string;
  lastPaidMeta: string;
  lastPaidEmpty: string;
  topupAmountLabel: string;
  topupUnitsLabel: string;
  topupUnitsLabelHours: string;
  topupDateLabel: string;
  topupSendReceipt: string;
  topupPrimaryCta: string;
  balanceAdjustTitle: string;
  balanceAdjustCurrent: string;
  balanceAdjustNew: string;
  balanceAdjustReason: string;
  balanceAdjustReasonNoShow: string;
  balanceAdjustReasonBonus: string;
  balanceAdjustReasonTypo: string;
  balanceAdjustNotify: string;
  balanceAdjustTooltip: string;
  tgNotifySkipped: string;
  tgStatusDisconnected: string;
  tgStatusConfigure: string;
  tgStatusBind: string;
  tgConnected: string;
  tgNotConnected: string;
  tgError: string;
  tgPaused: string;
  tgBind: string;
  tgOpenChat: string;
  tgConnectedTooltip: string;
  tgNotConnectedTooltip: string;
  tgErrorBotBlocked: string;
  tgErrorChatNotFound: string;
  tgErrorUserDeactivated: string;
  tgErrorUnknown: string;
  tgLinkTitle: string;
  tgWaitingActivation: string;
  tgLinkedSuccess: string;
  tgQrLabel: string;
  tgManualChatId: string;
  tgManualChatIdHint: string;
  tgManualChatIdSubmit: string;
  tgManualChatConsent: string;
  tgSettingsTitle: string;
  tgActiveAccount: string;
  tgLinkedAt: string;
  tgTriggersTitle: string;
  tgTriggerReminder: string;
  tgTriggerLowBalance: string;
  tgTriggerPayment: string;
  tgReminder15m: string;
  tgReminder1h: string;
  tgReminder2h: string;
  tgReminder24h: string;
  tgLowBalanceThreshold: string;
  tgRoutingTitle: string;
  tgRoutingStudent: string;
  tgRoutingTutor: string;
  tgRoutingBoth: string;
  tgNeedsLinkHint: string;
  tgTopupReceiptSkipped: string;
  tgIsMinor: string;
  tgParentAccount: string;
  tgBindParent: string;
  tgRoutingParent: string;
  tgConfigure: string;
  quickActionsTitle: string;
  lessonsShort: string;
  hoursShort: string;
  billingSectionTitle: string;
  billingTypePackage: string;
  billingTypePostpaid: string;
  billingInfoAria: string;
  billingInfoPackage: string;
  billingInfoPostpaid: string;
  balanceLessonsField: string;
  balanceHoursField: string;
  balanceNegativeHint: string;
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
  actionStudentBalanceAdjust: string;
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
  /** Сколько единиц баланса списали за этот урок. */
  balance_units_debited?: number;
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
  /** Исключённые даты вхождений (YYYY-MM-DD) — удаление из серии. */
  exdates?: string[];
  /** Даты проведённых вхождений (YYYY-MM-DD), баланс списан. */
  completedDates?: string[];
  /** Даты пропущенных вхождений (YYYY-MM-DD); остаются в календаре. */
  missedDates?: string[];
  /** Даты отменённых вхождений (YYYY-MM-DD); остаются в календаре. */
  canceledDates?: string[];
}

/** Урок в сетке календаря с UI-флагами (не сохраняется в Firestore). */
export interface CalendarLesson extends Lesson {
  isLastPaid?: boolean;
  /** Ключ виртуального вхождения: `{lessonId}:{yyyy-MM-dd}`. */
  occurrenceKey?: string;
  isVirtualOccurrence?: boolean;
}

/** Автоматические Telegram-триггеры и маршрутизация получателей. */
export interface StudentTelegramNotificationSettings {
  lesson_reminder_enabled: boolean;
  lesson_reminder_offset_minutes: 15 | 60 | 120 | 1440;
  low_balance_enabled: boolean;
  low_balance_threshold: number;
  payment_receipt_enabled: boolean;
  routing: 'student' | 'tutor' | 'both';
  /** Для несовершеннолетних: multi-select получателей. */
  routing_targets?: Array<'student' | 'parent' | 'tutor'>;
}

export type TelegramDeliveryStatus = 'ok' | 'error' | null;
export type TelegramDeliveryError =
  | 'BOT_BLOCKED'
  | 'CHAT_NOT_FOUND'
  | 'USER_DEACTIVATED'
  | 'UNKNOWN'
  | null;

export type StudentBalanceAdjustReason = 'no_show' | 'bonus' | 'typo';

/** Последнее финансовое пополнение (не ручная корректировка баланса). */
export interface StudentLastTopup {
  amount_money: number;
  currency: RateCurrency;
  units: number;
  at: string;
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
  /** Суммарно внесено через top-up (в единицах rate_unit). */
  total_topup_units?: number;
  /** Последняя оплата через «+ Пополнить». */
  last_topup?: StudentLastTopup | null;
  /** package — предоплата (balance_lessons); postpaid — постоплата / разовая.
   *  При rate_unit=hour в balance_lessons хранятся часы (дробные). */
  billing_type?: StudentBillingType;
  /** Единица абонемента/долга и ставки: hour (часы) или lesson (занятия). */
  rate_unit?: StudentRateUnit;
  /** Лимит долга в тех же единицах, что rate_unit (postpaid). */
  credit_limit?: number;
  /** Неоплаченные уроки (postpaid, увеличивает воркер). */
  unpaid_lessons_count?: number;
  timezone: string;
  auto_debit_enabled: boolean;
  bot_active: boolean;
  /** Opaque token for t.me deep link */
  telegram_link_token?: string | null;
  /** https://t.me/<bot>?start=<token> */
  telegram_deep_link?: string | null;
  telegram_user_id?: string | null;
  telegram_username?: string | null;
  telegram_display_name?: string | null;
  telegram_chat_id?: string | null;
  telegram_linked_at?: string | null;
  /** Язык интерфейса Telegram-бота */
  bot_lang?: 'ru' | 'en' | 'de' | 'kz' | 'uk' | 'by' | null;
  /** Показать репетитору модалку «ученик отвязал бота» */
  telegram_unlink_pending?: boolean | null;
  telegram_unlinked_username?: string | null;
  telegram_unlinked_at?: string | null;
  telegram_delivery_status?: TelegramDeliveryStatus;
  telegram_delivery_error?: TelegramDeliveryError;
  telegram_notification_settings?: StudentTelegramNotificationSettings | null;
  /** Несовершеннолетний — UI до 2 Chat ID (ученик + родитель). */
  is_minor?: boolean;
  telegram_parent_chat_id?: string | null;
  telegram_parent_username?: string | null;
  telegram_parent_linked_at?: string | null;
  /** Zoom / Meet / custom call URL for lesson notifications */
  meeting_link?: string | null;
  createdAt: string;
}
