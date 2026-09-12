import { Component, computed, inject, signal, OnInit, OnDestroy, ViewChild, afterNextRender, Injector, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService, Student } from '../../core/services/student.service';
import { BotUnlinkAlertService } from '../../core/services/bot-unlink-alert.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import {
  RATE_CURRENCIES,
  type RateCurrency,
  type StudentBalanceAdjustReason,
  type StudentBillingType,
  type StudentRateUnit,
  type UserProfile,
} from '@interfaces';
import {
  colorToHexForPicker,
  DEFAULT_STUDENT_BORDER_COLOR,
  generatePastelColor,
  hexToStoredColor,
} from '../../core/utils/pastel-color';
import { toTitleCaseName } from '../../core/utils/to-title-case';
import {
  normalizeTelegramSettings,
  isBlockingTelegramDeliveryError,
} from '../../core/utils/telegram-notification-settings';
import { planEntitlementsFromProfile } from '../../core/utils/user-profile.utils';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { AppDateInputComponent } from '../../shared/app-date-input';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';
import { HelpTipComponent } from '../../shared/help-tip/help-tip.component';
import {
  StudentCardComponent,
} from './student-card/student-card.component';
import type { StudentCardData, StudentCardLabels } from './student-card/student-card.model';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import {
  StudentSwipeRowDirective,
  type StudentSwipeMovePayload,
  type StudentSwipeTouchPayload,
} from './student-swipe-row.directive';
import { LocaleRouter } from '../../core/i18n/locale-router.service';

const CURRENCY_SYMBOLS: Record<RateCurrency, string> = {
  EUR: '€',
  USD: '$',
  PLN: 'zł',
  RUB: '₽',
  BYN: 'Br',
  KZT: '₸',
  UAH: '₴',
};

/** Fallback IANA when student.timezone is empty (bot/reminders use tutor TZ). */
const DEFAULT_STUDENT_TIMEZONE = 'Europe/Vienna';

function resolveBillingType(raw?: string): StudentBillingType {
  if (raw === 'postpaid' || raw === 'per_lesson' || raw === 'single') {
    return 'postpaid';
  }
  return 'package';
}

function resolveRateUnit(raw?: string): StudentRateUnit {
  return raw === 'lesson' ? 'lesson' : 'hour';
}

function rateUnitSuffix(unit: StudentRateUnit, t: { perHour: string; perLesson: string }): string {
  return unit === 'lesson' ? t.perLesson : t.perHour;
}

@Component({
  selector: 'app-students',
  imports: [
    FormsModule,
    AppDialogComponent,
    AppDateInputComponent,
    AppSelectComponent,
    HelpTipComponent,
    StudentCardComponent,
    NotificationSettingsComponent,
    StudentSwipeRowDirective,
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent implements OnInit, OnDestroy {
  private svc = inject(StudentService);
  private unlinkAlerts = inject(BotUnlinkAlertService);
  private readonly userSvc = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly localeRouter = inject(LocaleRouter);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);
  @ViewChild('studentForm') studentFormRef?: NgForm;
  students = signal<Student[]>([]);
  profile = signal<UserProfile | null>(null);
  loading = signal(true);
  showForm = signal(false);
  editTarget = signal<Student | null>(null);
  /** Ученик, на которого пришли с главной — краткая подсветка. */
  highlightedStudentId = signal<string | null>(null);
  private highlightClearTimer: ReturnType<typeof setTimeout> | null = null;
  i18n = inject(I18nService);

  form = {
    name: '',
    rate_per_hour: 0,
    rate_currency: 'EUR' as RateCurrency,
    timezone: DEFAULT_STUDENT_TIMEZONE,
    color_hex: generatePastelColor(),
    bot_active: false,
    meeting_link: '',
  };

  billingType = signal<StudentBillingType>('package');
  rateUnit = signal<StudentRateUnit>('hour');
  balanceLessons = signal(0);
  creditLimit = signal(0);
  readonly isPackageBilling = computed(() => this.billingType() === 'package');
  readonly isPostpaidBilling = computed(() => this.billingType() === 'postpaid');
  readonly rateFieldLabel = computed(() =>
    this.rateUnit() === 'lesson' ? this.t.ratePerLesson : this.t.rateHourLabel,
  );

  readonly rateCurrencies = RATE_CURRENCIES;
  readonly skeletonCardSlots = [0, 1, 2, 3, 4, 5];

  searchQuery = signal('');
  listTab = signal<'active' | 'archive'>('active');
  swipedStudentId = signal<string | null>(null);
  studentSwipeOffset = signal(0);
  swipeDraggingId = signal<string | null>(null);
  private studentSwipeStart: { x: number; y: number; id: string; base: number } | null = null;
  private readonly studentSwipeMinPx = 48;
  private readonly studentSwipeOpenPx = -176;

  readonly activeStudents = computed(() => this.students().filter((student) => !student.archived_at));
  readonly archivedStudents = computed(() =>
    this.students().filter((student) => Boolean(student.archived_at)),
  );

  readonly filteredStudents = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const list = this.listTab() === 'archive' ? this.archivedStudents() : this.activeStudents();
    if (!query) {
      return list;
    }
    return list.filter((student) => student.name.toLowerCase().includes(query));
  });

  deleteTargetId = signal<string | null>(null);
  archiveTargetId = signal<string | null>(null);
  topupTargetId = signal<string | null>(null);
  topupMoney = signal(0);
  /** Text buffer for amount input — leading 0 replaced while typing; allows "0.". */
  topupMoneyText = signal('0');
  topupUnits = signal(0);
  topupPaidAt = signal('');
  topupSendReceipt = signal(false);
  topupAmountSource = signal<'money' | 'units'>('money');
  /** Active quick-amount chip: multiplier id (`1`/`2`/`3`) or `custom`. */
  topupPreset = signal<'1' | '2' | '3' | 'custom'>('custom');
  /** Sticky: hidden on open at 0; shown after first amount > 0 and kept visible. */
  topupSummaryVisible = signal(false);
  adjustTarget = signal<Student | null>(null);
  adjustNextBalance = signal(0);
  adjustReason = signal<StudentBalanceAdjustReason>('typo');
  adjustSaving = signal(false);
  /** 0 = closed; 1 = preview+reason; 2 = final confirm (edit modal save). */
  balanceChangeStep = signal<0 | 1 | 2>(0);
  balanceChangeReason = signal<StudentBalanceAdjustReason>('typo');
  balanceChangeSaving = signal(false);
  quickActionsStudent = signal<Student | null>(null);
  botToggleConfirm = signal<{ student: Student; nextActive: boolean } | null>(null);
  disconnectConfirm = signal<Student | null>(null);
  inviteDialogStudent = signal<Student | null>(null);
  inviteDialogLoading = signal(false);
  inviteDialogError = signal<string | null>(null);
  inviteLinkedSuccess = signal(false);
  showManualChatId = signal(false);
  manualChatId = signal('');
  manualChatConsent = signal(false);
  formInviteLoading = signal(false);
  formInviteError = signal<string | null>(null);
  settingsStudent = signal<Student | null>(null);
  toastMessage = signal<string | null>(null);
  formSubmitted = signal(false);
  savingForm = signal(false);
  linkCopied = signal(false);
  formError = signal<string | null>(null);
  /** После смены ставки — предложить resync снапшотов уроков. */
  resyncPromptStudentId = signal<string | null>(null);
  resyncingLessons = signal(false);
  resyncMessage = signal<string | null>(null);
  readonly inviteDialogLink = computed(() => this.inviteDialogStudent()?.telegram_deep_link ?? '');
  readonly formInviteLink = computed(() => this.editTarget()?.telegram_deep_link ?? '');
  readonly inviteQrSrc = computed(() => {
    const link = this.inviteDialogLink();
    if (!link) {
      return '';
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
  });

  readonly planEntitlements = computed(() => planEntitlementsFromProfile(this.profile()));
  readonly hasTelegramPlan = computed(() => this.planEntitlements().hasTelegram);
  readonly maxStudents = computed(() => this.planEntitlements().maxStudents);
  readonly canAddStudent = computed(() => {
    // Wait for /me — unknown plan must not look like Free(3).
    if (!this.profile()) {
      return false;
    }
    const max = this.maxStudents();
    if (max === null) {
      return true;
    }
    return this.activeStudents().length < max;
  });
  readonly studentLimitHint = computed(() => {
    if (!this.profile()) {
      return null;
    }
    const max = this.maxStudents();
    if (max === null || this.canAddStudent()) {
      return null;
    }
    return this.i18n.sharedUi().planStudentLimitBody.replace('{max}', String(max));
  });

  planGateKind = signal<'students' | 'telegram' | null>(null);
  readonly planGateTitle = computed(() => {
    const kind = this.planGateKind();
    const s = this.i18n.sharedUi();
    if (kind === 'telegram') {
      return s.planTelegramRequiredTitle;
    }
    return s.planStudentLimitTitle;
  });
  readonly planGateBody = computed(() => {
    const kind = this.planGateKind();
    const s = this.i18n.sharedUi();
    if (kind === 'telegram') {
      return s.planTelegramRequiredBody;
    }
    const max = this.maxStudents() ?? 3;
    return s.planStudentLimitBody.replace('{max}', String(max));
  });

  private linkCopiedTimer: ReturnType<typeof setTimeout> | null = null;
  private invitePollTimer: ReturnType<typeof setInterval> | null = null;
  private formInvitePollTimer: ReturnType<typeof setInterval> | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.userSvc.invalidateProfile();
    this.userSvc.refreshProfile().subscribe({
      next: (profile) => this.profile.set(profile),
      error: () => {
        this.userSvc.ensureProfile().subscribe({
          next: (profile) => this.profile.set(profile),
          error: () => this.profile.set(null),
        });
      },
    });
    this.load();
  }

  ngOnDestroy(): void {
    this.stopInvitePolling();
    this.stopFormInvitePolling();
    if (this.linkCopiedTimer) {
      clearTimeout(this.linkCopiedTimer);
    }
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    if (this.highlightClearTimer !== null) {
      clearTimeout(this.highlightClearTimer);
    }
  }

  get t() {
    return this.i18n.studentsUi();
  }

  readonly telegramCellLabels = computed(() => {
    const t = this.i18n.studentsUi();
    return {
      connected: t.tgConnected,
      notConnected: t.tgNotConnected,
      error: t.tgError,
      paused: t.tgPaused,
      bind: t.tgBind,
      openChat: t.tgOpenChat,
      connectedTooltip: t.tgConnectedTooltip,
      notConnectedTooltip: t.tgNotConnectedTooltip,
      errorUnknown: t.tgErrorUnknown,
      errorBotBlocked: t.tgErrorBotBlocked,
      errorChatNotFound: t.tgErrorChatNotFound,
      errorUserDeactivated: t.tgErrorUserDeactivated,
    };
  });

  readonly studentCardLabels = computed((): StudentCardLabels => {
    const t = this.t;
    return {
      balancePrefix: t.balanceLessons,
      lastPaymentPrefix: t.lastPaidMeta,
      topUp: `+ ${t.topup}`,
      unitLesson: t.lessonsShort,
      unitHour: t.hoursShort,
      perLesson: t.perLesson,
      perHour: t.perHour,
      notificationsOn: t.botEnabled,
      notificationsOff: t.botDisabled,
      telegramConnected: t.tgConnected,
      telegramDisconnected: t.tgNotConnected,
      openDetails: t.quickActionsTitle,
    };
  });

  protected readonly isBlockingTelegramDeliveryError = isBlockingTelegramDeliveryError;

  telegramErrorTooltip(student: Student): string {
    if (!isBlockingTelegramDeliveryError(student)) {
      return this.t.tgConnected;
    }
    switch (student.telegram_delivery_error) {
      case 'BOT_BLOCKED':
        return this.t.tgErrorBotBlocked;
      case 'CHAT_NOT_FOUND':
        return this.t.tgErrorChatNotFound;
      case 'USER_DEACTIVATED':
        return this.t.tgErrorUserDeactivated;
      default:
        return this.t.tgErrorUnknown;
    }
  }

  billingHelpText(): string {
    const t = this.t;
    return `${t.billingInfoPackage}\n\n${t.billingInfoPostpaid}`;
  }

  rateCurrencyOf(s: Student): RateCurrency {
    return s.rate_currency ?? 'EUR';
  }

  studentColor(s: Student): string {
    return s.color_hex || DEFAULT_STUDENT_BORDER_COLOR;
  }

  formColorPickerHex(): string {
    return colorToHexForPicker(this.form.color_hex);
  }

  onFormColorPickerChange(hex: string): void {
    this.form.color_hex = hexToStoredColor(hex);
  }

  randomizeFormColor(): void {
    this.form.color_hex = generatePastelColor();
  }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: (data) => {
        this.students.set(data);
        this.unlinkAlerts.ingestStudents(data);
        this.loading.set(false);
        this.applyStudentFromRoute();
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  isStudentHighlighted(studentId: string): boolean {
    return this.highlightedStudentId() === studentId;
  }

  private applyStudentFromRoute(): void {
    const studentId = this.route.snapshot.queryParamMap.get('student')?.trim();
    if (!studentId) {
      return;
    }
    const student = this.students().find((item) => item._id === studentId);
    if (!student) {
      return;
    }

    this.highlightedStudentId.set(studentId);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { student: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(
        () => {
          const el = document.querySelector<HTMLElement>(`[data-student-id="${studentId}"]`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
        { injector: this.injector },
      );
    }

    if (this.highlightClearTimer !== null) {
      clearTimeout(this.highlightClearTimer);
    }
    this.highlightClearTimer = setTimeout(() => {
      this.highlightClearTimer = null;
      if (this.highlightedStudentId() === studentId) {
        this.highlightedStudentId.set(null);
      }
    }, 4500);
  }

  private patchStudent(updated: Student): void {
    this.students.update((list) => {
      const index = list.findIndex((item) => item._id === updated._id);
      if (index < 0) {
        return [updated, ...list];
      }
      return list.map((item) => (item._id === updated._id ? updated : item));
    });
    const quick = this.quickActionsStudent();
    if (quick?._id === updated._id) {
      this.quickActionsStudent.set(updated);
    }
    const invite = this.inviteDialogStudent();
    if (invite?._id === updated._id) {
      this.inviteDialogStudent.set(updated);
    }
    const settings = this.settingsStudent();
    if (settings?._id === updated._id) {
      this.settingsStudent.set(updated);
    }
  }

  setBillingType(type: StudentBillingType): void {
    this.billingType.set(type);
  }

  setRateUnit(unit: StudentRateUnit): void {
    this.rateUnit.set(unit);
  }

  displayStudentName(name: string | null | undefined): string {
    return toTitleCaseName(name);
  }

  formatStudentRate(student: Student): string {
    const unit = resolveRateUnit(student.rate_unit);
    return `${student.rate_per_hour} ${this.i18n.currencyLabel(this.rateCurrencyOf(student))} ${rateUnitSuffix(unit, this.t)}`;
  }

  formatLastTopupDate(student: Student): string {
    const at = student.last_topup?.at;
    if (!at) {
      return '';
    }
    return this.formatPaidShortDate(at);
  }

  toStudentCardData(student: Student): StudentCardData {
    return {
      id: student._id,
      name: toTitleCaseName(student.name),
      color: this.studentColor(student),
      hasTelegram: this.isTelegramLinked(student),
      rate: student.rate_per_hour,
      rateType: resolveRateUnit(student.rate_unit),
      currency: this.i18n.currencyLabel(this.rateCurrencyOf(student)),
      remainingLessons: Number(student.balance_lessons) || 0,
      lastPaymentDate: this.formatLastTopupDate(student) || null,
      notificationsEnabled: this.studentRemindersOn(student),
    };
  }

  studentRemindersOn(student: Student): boolean {
    if (!this.canNotifyTelegram(student)) {
      return false;
    }
    return normalizeTelegramSettings(student.telegram_notification_settings).lesson_reminder_enabled;
  }

  onStudentCardOpenDetails(id: string): void {
    this.closeStudentSwipe();
    const student = this.students().find((item) => item._id === id);
    if (student) {
      this.openEdit(student);
    }
  }

  onStudentSwipeStart(payload: StudentSwipeTouchPayload): void {
    if (!this.isStudentSwipeEnabled() || this.listTab() === 'archive') {
      return;
    }
    this.studentSwipeStart = {
      x: payload.x,
      y: payload.y,
      id: payload.id,
      base: payload.base,
    };
    this.swipeDraggingId.set(payload.id);
    this.studentSwipeOffset.set(payload.base);
  }

  onStudentSwipeMove(payload: StudentSwipeMovePayload): void {
    if (!this.isStudentSwipeEnabled() || this.listTab() === 'archive') {
      return;
    }
    const start = this.studentSwipeStart;
    if (!start || start.id !== payload.id) {
      return;
    }
    const next = Math.max(this.studentSwipeOpenPx, Math.min(0, start.base + payload.dx));
    this.studentSwipeOffset.set(next);
    this.swipeDraggingId.set(payload.id);
  }

  onStudentSwipeEnd(payload: StudentSwipeMovePayload): void {
    if (!this.isStudentSwipeEnabled() || this.listTab() === 'archive') {
      return;
    }
    const start = this.studentSwipeStart;
    this.studentSwipeStart = null;
    this.swipeDraggingId.set(null);
    if (!start || start.id !== payload.id) {
      return;
    }
    const dx = payload.dx;
    const dy = payload.dy;
    const offset = this.studentSwipeOffset();
    if (Math.abs(dx) >= this.studentSwipeMinPx && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0 || offset <= this.studentSwipeOpenPx / 2) {
        this.swipedStudentId.set(payload.id);
        this.studentSwipeOffset.set(this.studentSwipeOpenPx);
        return;
      }
      this.swipedStudentId.set(null);
      this.studentSwipeOffset.set(0);
      return;
    }
    if (offset <= this.studentSwipeOpenPx / 2) {
      this.swipedStudentId.set(payload.id);
      this.studentSwipeOffset.set(this.studentSwipeOpenPx);
    } else {
      this.swipedStudentId.set(null);
      this.studentSwipeOffset.set(0);
    }
  }

  studentSwipeBase(id: string): number {
    return this.swipedStudentId() === id ? this.studentSwipeOpenPx : 0;
  }

  /** Keep the card full-width and slide it inside the clipped row. */
  studentSwipeTransform(id: string): string {
    if (this.swipeDraggingId() === id) {
      return `translate3d(${this.studentSwipeOffset()}px, 0, 0)`;
    }
    if (this.swipedStudentId() === id) {
      return `translate3d(${this.studentSwipeOpenPx}px, 0, 0)`;
    }
    return 'translate3d(0, 0, 0)';
  }

  closeStudentSwipe(): void {
    this.swipedStudentId.set(null);
    this.studentSwipeStart = null;
    this.studentSwipeOffset.set(0);
    this.swipeDraggingId.set(null);
  }

  setListTab(tab: 'active' | 'archive'): void {
    this.listTab.set(tab);
    this.closeStudentSwipe();
    this.searchQuery.set('');
  }

  onStudentSwipeDelete(id: string, event: Event): void {
    event.stopPropagation();
    this.closeStudentSwipe();
    this.openDeleteConfirm(id);
  }

  onStudentSwipeArchive(id: string, event: Event): void {
    event.stopPropagation();
    this.closeStudentSwipe();
    this.openArchiveConfirm(id);
  }

  readonly isStudentSwipeEnabled = (): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(max-width: 768px), (max-height: 440px)').matches;
  };

  onStudentCardTopUp(id: string): void {
    this.openTopup(id);
  }

  onStudentCardToggleNotifications(id: string): void {
    const student = this.students().find((item) => item._id === id);
    if (!student) {
      return;
    }
    if (!this.hasTelegramPlan()) {
      this.planGateKind.set('telegram');
      return;
    }
    if (this.isTelegramLinked(student)) {
      this.openTelegramSettings(student);
      return;
    }
    this.inviteStudentToBot(student);
  }

  onStudentCardTgConnect(id: string): void {
    const student = this.students().find((item) => item._id === id);
    if (!student) {
      return;
    }
    if (!this.isTelegramLinked(student)) {
      this.inviteStudentToBot(student);
      return;
    }
    this.openTelegramSettings(student);
  }

  balanceUnitLabel(student: Student | null | undefined): string {
    return resolveRateUnit(student?.rate_unit) === 'lesson' ? this.t.lessonsShort : this.t.hoursShort;
  }

  formatStudentBalance(student: Student): string {
    const raw = Number(student.balance_lessons);
    const value = Number.isFinite(raw) ? raw : 0;
    const pretty = Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
    return `${pretty} ${this.balanceUnitLabel(student)}`;
  }

  formatLastPaid(student: Student): string {
    const last = student.last_topup;
    if (!last || !(Number(last.amount_money) >= 0) || !last.at) {
      // Fallback for older records that only have cumulative top-up units.
      if (!last && Number(student.total_topup_units) > 0) {
        const units = Number(student.total_topup_units);
        const rate = Number(student.rate_per_hour) || 0;
        const currency = this.i18n.currencyLabel(this.rateCurrencyOf(student));
        if (rate > 0) {
          const money = Math.round(rate * units * 100) / 100;
          return `+${money} ${currency}`;
        }
      }
      return this.t.lastPaidEmpty;
    }
    const money = Number(last.amount_money);
    const pretty = Number.isInteger(money) ? String(money) : String(Math.round(money * 100) / 100);
    const currency = this.i18n.currencyLabel(last.currency || this.rateCurrencyOf(student));
    return `+${pretty} ${currency} (${this.formatPaidShortDate(last.at)})`;
  }

  formatPaidShortDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const now = new Date();
    if (date.getFullYear() !== now.getFullYear()) {
      return `${dd}.${mm}.${String(date.getFullYear()).slice(-2)}`;
    }
    return `${dd}.${mm}`;
  }

  quickActionsMeta(student: Student): string {
    const last = this.formatLastPaid(student);
    return `${this.formatStudentRate(student)} · ${this.formatStudentBalance(student)} · ${this.t.lastPaidMeta}: ${last}`;
  }

  canNotifyTelegram(student: Student | null | undefined): boolean {
    if (!this.hasTelegramPlan()) {
      return false;
    }
    if (!student) {
      return false;
    }
    if (!student.telegram_user_id && !student.telegram_chat_id) {
      return false;
    }
    if (!student.bot_active) {
      return false;
    }
    if (isBlockingTelegramDeliveryError(student)) {
      return false;
    }
    return true;
  }

  topupStudent(): Student | null {
    const id = this.topupTargetId();
    return this.students().find((item) => item._id === id) ?? null;
  }

  topupUnitsLabel(): string {
    const student = this.topupStudent();
    return resolveRateUnit(student?.rate_unit) === 'hour'
      ? this.t.topupUnitsLabelHours
      : this.t.topupUnitsLabel;
  }

  topupPresets(): Array<{ id: '1' | '2' | '3'; multiplier: number; label: string; money: number }> {
    const student = this.topupStudent();
    const rate = Number(student?.rate_per_hour) || 0;
    if (!(rate > 0)) {
      return [];
    }
    return ([1, 2, 3] as const).map((multiplier) => {
      const money = this.roundMoney(rate * multiplier);
      return {
        id: String(multiplier) as '1' | '2' | '3',
        multiplier,
        money,
        label: this.formatTopupMoneyLabel(money, student),
      };
    });
  }

  formatTopupMoneyLabel(money: number, student: Student | null): string {
    const pretty = Number.isInteger(money) ? String(money) : money.toFixed(2);
    if (!student) {
      return pretty;
    }
    return `${pretty} ${this.currencySymbol(this.rateCurrencyOf(student))}`;
  }

  formatTopupSummaryLine(student: Student): string {
    const units = this.topupUnits();
    const pretty = Number.isInteger(units) ? String(units) : String(Math.round(units * 100) / 100);
    const unitLabel =
      resolveRateUnit(student.rate_unit) === 'hour' ? this.t.hoursShort : this.t.lessonsShort;
    return this.t.topupSummaryLine.replace('{amount}', pretty).replace('{unit}', unitLabel);
  }

  currencySymbol(code: RateCurrency): string {
    return CURRENCY_SYMBOLS[code] ?? code;
  }

  formatTopupUnits(student: Student): string {
    const units = this.topupUnits();
    const pretty = Number.isInteger(units) ? String(units) : String(Math.round(units * 100) / 100);
    const unitLabel =
      resolveRateUnit(student.rate_unit) === 'hour' ? this.t.hoursShort : this.t.lessonsShort;
    return `${pretty} ${unitLabel}`;
  }

  selectTopupPreset(preset: { id: '1' | '2' | '3'; money: number }): void {
    this.topupPreset.set(preset.id);
    this.setTopupMoneyValue(preset.money);
  }

  selectTopupCustom(): void {
    this.topupPreset.set('custom');
    this.setTopupMoneyValue(0);
  }

  showToast(message: string): void {
    this.toastMessage.set(message);
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.toastTimer = null;
      this.toastMessage.set(null);
    }, 5000);
  }

  dismissToast(): void {
    this.toastMessage.set(null);
  }

  topupHintLabel(): string {
    return this.topupUnitsLabel();
  }

  topupStep(): number {
    const student = this.topupStudent();
    return resolveRateUnit(student?.rate_unit) === 'hour' ? 0.5 : 1;
  }

  resolveAdjustStep(student: Student): number {
    return resolveRateUnit(student.rate_unit) === 'hour' ? 0.5 : 1;
  }

  private todayInputDate(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private normalizeTopupUnits(raw: number, student: Student | null): number {
    if (!Number.isFinite(raw) || raw <= 0) {
      return 0;
    }
    return resolveRateUnit(student?.rate_unit) === 'hour'
      ? Math.round(raw * 100) / 100
      : Math.floor(raw);
  }

  balanceFieldLabel(): string {
    return this.rateUnit() === 'hour' ? this.t.balanceHoursField : this.t.balanceLessonsField;
  }

  onBalanceLessonsChange(raw: number | string | null): void {
    if (raw === '' || raw === null || raw === undefined) {
      this.balanceLessons.set(0);
      return;
    }
    const n = Number(raw);
    this.balanceLessons.set(Number.isFinite(n) ? n : 0);
  }

  openCreate() {
    if (!this.canAddStudent()) {
      this.planGateKind.set('students');
      return;
    }
    this.formSubmitted.set(false);
    this.formError.set(null);
    this.linkCopied.set(false);
    this.form = {
      name: '',
      rate_per_hour: 0,
      rate_currency: 'EUR',
      timezone: DEFAULT_STUDENT_TIMEZONE,
      color_hex: generatePastelColor(),
      bot_active: false,
      meeting_link: '',
    };
    this.billingType.set('package');
    this.rateUnit.set('hour');
    this.balanceLessons.set(0);
    this.creditLimit.set(0);
    this.editTarget.set(null);
    this.stopFormInvitePolling();
    this.formInviteLoading.set(false);
    this.formInviteError.set(null);
    this.showForm.set(true);
  }

  openEdit(s: Student) {
    this.closeQuickActions();
    void this.localeRouter.navigate(`/app/students/${s._id}`);
  }

  closeForm() {
    if (this.savingForm()) {
      return;
    }
    this.resetFormDialog();
  }

  private resetFormDialog(): void {
    this.stopFormInvitePolling();
    this.formInviteLoading.set(false);
    this.formInviteError.set(null);
    this.formSubmitted.set(false);
    this.formError.set(null);
    this.balanceChangeStep.set(0);
    this.balanceChangeSaving.set(false);
    this.showForm.set(false);
    this.editTarget.set(null);
  }

  onSubmit(studentForm?: NgForm): void {
    const form = studentForm ?? this.studentFormRef;
    if (!form) {
      return;
    }
    this.formSubmitted.set(true);
    if (form.invalid) {
      return;
    }
    this.save();
  }

  isFieldInvalid(controlName: string, studentForm: NgForm): boolean {
    if (!this.formSubmitted()) {
      return false;
    }
    const control = studentForm.controls[controlName];
    return Boolean(control?.invalid);
  }

  currencySelectOptions(): AppSelectOption[] {
    return RATE_CURRENCIES.map((c) => ({
      value: c,
      label: this.i18n.currencyLabel(c),
    }));
  }

  private studentFormPayload(opts?: { omitBalance?: boolean }): Partial<Student> {
    const billing_type = this.billingType();
    return {
      name: this.form.name,
      rate_per_hour: this.form.rate_per_hour,
      rate_currency: this.form.rate_currency,
      timezone: this.form.timezone,
      color_hex: this.form.color_hex,
      meeting_link: this.form.meeting_link.trim() || null,
      billing_type,
      rate_unit: this.rateUnit(),
      ...(billing_type === 'package'
        ? opts?.omitBalance
          ? {}
          : { balance_lessons: this.balanceLessons() }
        : { credit_limit: this.creditLimit() }),
    };
  }

  save() {
    if (this.savingForm()) {
      return;
    }
    this.formSubmitted.set(true);
    const form = this.studentFormRef;
    if (!form || form.invalid) {
      return;
    }
    if (this.needsBalanceChangeConfirmation()) {
      this.balanceChangeReason.set('typo');
      this.balanceChangeStep.set(1);
      return;
    }
    this.persistStudentForm({ inviteAfter: false });
  }

  needsBalanceChangeConfirmation(): boolean {
    const target = this.editTarget();
    if (!target || !this.isPackageBilling()) {
      return false;
    }
    const unit = this.rateUnit();
    const from = this.normalizeBalanceAmount(Number(target.balance_lessons) || 0, unit);
    const to = this.normalizeBalanceAmount(this.balanceLessons(), unit);
    return from !== to;
  }

  balanceChangePreview(): { from: number; to: number; unitLabel: string } | null {
    const target = this.editTarget();
    if (!target) {
      return null;
    }
    const unit = this.rateUnit();
    return {
      from: this.normalizeBalanceAmount(Number(target.balance_lessons) || 0, unit),
      to: this.normalizeBalanceAmount(this.balanceLessons(), unit),
      unitLabel: this.balanceUnitLabel(target),
    };
  }

  balanceChangeIntroText(): string {
    const preview = this.balanceChangePreview();
    if (!preview) {
      return '';
    }
    return this.t.balanceChangeConfirmIntro
      .replace('{from}', this.formatBalanceAmount(preview.from))
      .replace('{to}', this.formatBalanceAmount(preview.to))
      .replace('{unit}', preview.unitLabel);
  }

  balanceChangeFinalText(): string {
    const preview = this.balanceChangePreview();
    if (!preview) {
      return '';
    }
    return this.t.balanceChangeFinalBody
      .replace('{from}', this.formatBalanceAmount(preview.from))
      .replace('{to}', this.formatBalanceAmount(preview.to))
      .replace('{unit}', preview.unitLabel);
  }

  cancelBalanceChangeConfirm(): void {
    this.balanceChangeStep.set(0);
  }

  continueBalanceChangeConfirm(): void {
    if (this.balanceChangeStep() === 1) {
      this.balanceChangeStep.set(2);
    }
  }

  backBalanceChangeConfirm(): void {
    if (this.balanceChangeStep() === 2) {
      this.balanceChangeStep.set(1);
    }
  }

  confirmBalanceChangeAndSave(): void {
    const target = this.editTarget();
    if (!target || this.balanceChangeSaving() || this.savingForm()) {
      return;
    }
    const unit = this.rateUnit();
    const balance = this.normalizeBalanceAmount(this.balanceLessons(), unit);
    this.balanceChangeSaving.set(true);
    this.formError.set(null);
    this.svc
      .adjustBalance(target._id, {
        balance_lessons: balance,
        reason: this.balanceChangeReason(),
        notify_telegram: true,
      })
      .subscribe({
        next: (updated) => {
          this.balanceChangeSaving.set(false);
          this.balanceChangeStep.set(0);
          this.patchStudent(updated);
          this.editTarget.set(updated);
          if (!updated.telegram_notified) {
            this.showToast(this.t.tgNotifySkipped);
          }
          this.persistStudentForm({ inviteAfter: false, omitBalance: true });
        },
        error: (err) => {
          this.balanceChangeSaving.set(false);
          this.formError.set(this.apiErrorMessage(err));
        },
      });
  }

  private normalizeBalanceAmount(raw: number, unit: StudentRateUnit): number {
    if (!Number.isFinite(raw)) {
      return 0;
    }
    return unit === 'hour' ? Math.round(raw * 100) / 100 : Math.trunc(raw);
  }

  formatBalanceAmount(value: number): string {
    return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
  }

  private apiErrorMessage(err: unknown): string {
    const body =
      err &&
      typeof err === 'object' &&
      'error' in err &&
      err.error &&
      typeof err.error === 'object'
        ? (err.error as { message?: unknown; code?: unknown; max_students?: unknown })
        : null;
    const code = body?.code ? String(body.code) : '';
    if (code === 'PLAN_STUDENT_LIMIT') {
      const max = Number(body?.max_students) || this.maxStudents() || 3;
      return this.i18n.sharedUi().planStudentLimitBody.replace('{max}', String(max));
    }
    if (code === 'PLAN_TELEGRAM_REQUIRED') {
      return this.i18n.sharedUi().planTelegramRequiredBody;
    }
    const message = body?.message ? String(body.message) : '';
    return message || 'Ошибка сохранения';
  }

  private persistStudentForm(opts: {
    inviteAfter?: boolean;
    openInviteDialog?: boolean;
    omitBalance?: boolean;
  }): void {
    const target = this.editTarget();
    const payload = this.studentFormPayload({ omitBalance: opts.omitBalance });
    const rateSnapshotChanged =
      Boolean(target) &&
      (resolveRateUnit(target!.rate_unit) !== this.rateUnit() ||
        Number(target!.rate_per_hour) !== Number(this.form.rate_per_hour) ||
        String(target!.rate_currency) !== String(this.form.rate_currency));

    if (opts.inviteAfter || opts.openInviteDialog) {
      if (!this.hasTelegramPlan()) {
        this.planGateKind.set('telegram');
        return;
      }
      payload.bot_active = true;
    }
    this.formError.set(null);
    this.resyncMessage.set(null);
    this.savingForm.set(true);
    const req = target ? this.svc.update(target._id, payload) : this.svc.create(payload);

    req.subscribe({
      next: (updated) => {
        this.savingForm.set(false);
        this.patchStudent(updated);
        if (opts.openInviteDialog) {
          this.resetFormDialog();
          this.load();
          this.openInviteDialog(updated);
          return;
        }
        if (opts.inviteAfter) {
          void this.copyInviteLink(updated.telegram_deep_link || '');
        }
        const wasCreate = !target;
        this.load();
        if (wasCreate) {
          this.resetFormDialog();
          this.openEdit(updated);
          return;
        }
        this.resetFormDialog();
        if (rateSnapshotChanged) {
          this.resyncPromptStudentId.set(updated._id);
        }
      },
      error: (err) => {
        this.savingForm.set(false);
        this.formError.set(this.apiErrorMessage(err));
      },
    });
  }

  cancelResyncLessons(): void {
    this.resyncPromptStudentId.set(null);
  }

  confirmResyncLessons(): void {
    const id = this.resyncPromptStudentId();
    if (!id || this.resyncingLessons()) {
      return;
    }
    this.resyncingLessons.set(true);
    this.resyncMessage.set(null);
    this.svc.resyncLessonSnapshots(id).subscribe({
      next: ({ updated }) => {
        this.resyncingLessons.set(false);
        this.resyncPromptStudentId.set(null);
        this.resyncMessage.set(
          this.t.resyncLessonsDone.replace('{count}', String(updated)),
        );
      },
      error: (err) => {
        this.resyncingLessons.set(false);
        this.resyncMessage.set(this.apiErrorMessage(err) || this.t.resyncLessonsError);
      },
    });
  }

  isTelegramLinked(student?: Student | null): boolean {
    const target = student ?? this.editTarget();
    return Boolean(target?.telegram_user_id || target?.telegram_chat_id);
  }

  canInviteToBot(student?: Student | null): boolean {
    return !this.isTelegramLinked(student);
  }

  telegramDeepLink(student?: Student | null): string {
    return (student ?? this.editTarget())?.telegram_deep_link || '';
  }

  connectTelegramFromForm(): void {
    if (!this.hasTelegramPlan()) {
      this.planGateKind.set('telegram');
      return;
    }
    const target = this.editTarget();
    if (!target) {
      this.formError.set(this.t.botSaveToGetLink);
      return;
    }
    this.ensureFormInviteLink(target);
  }

  async copyFormInviteLink(): Promise<void> {
    const link = this.formInviteLink();
    if (!link) {
      return;
    }
    const copied = await this.copyInviteLink(link);
    if (!copied) {
      this.formInviteError.set(this.t.botInviteLinkFailed);
    }
  }

  shareFormInviteLink(): void {
    const link = this.formInviteLink();
    if (!link || typeof window === 'undefined') {
      return;
    }
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }

  openStudentTelegramChat(student?: Student | null): void {
    const target = student ?? this.editTarget();
    const username = target?.telegram_username?.replace(/^@/, '').trim();
    if (!username || typeof window === 'undefined') {
      return;
    }
    window.open(`https://t.me/${username}`, '_blank', 'noopener,noreferrer');
  }

  applyMeetingPreset(kind: 'meet' | 'zoom'): void {
    this.form.meeting_link =
      kind === 'meet' ? 'https://meet.google.com/' : 'https://zoom.us/j/';
  }

  meetingPresetActive(kind: 'meet' | 'zoom'): boolean {
    const link = (this.form.meeting_link || '').toLowerCase();
    return kind === 'meet' ? link.includes('meet.google.com') : link.includes('zoom.');
  }

  private ensureFormInviteLink(student: Student): void {
    if (this.isTelegramLinked(student)) {
      this.stopFormInvitePolling();
      return;
    }
    this.form.bot_active = true;
    this.startFormInvitePolling(student._id);
    if (student.telegram_deep_link) {
      this.formInviteLoading.set(false);
      this.formInviteError.set(null);
      return;
    }
    this.formInviteLoading.set(true);
    this.formInviteError.set(null);
    this.svc.update(student._id, { bot_active: true }).subscribe({
      next: (updated) => {
        this.formInviteLoading.set(false);
        this.patchStudent(updated);
        if (this.editTarget()?._id === updated._id) {
          this.editTarget.set(updated);
          this.form.bot_active = true;
        }
        if (!updated.telegram_deep_link) {
          this.formInviteError.set(this.t.botInviteLinkFailed);
        }
      },
      error: (err) => {
        this.formInviteLoading.set(false);
        this.formInviteError.set(this.apiErrorMessage(err));
      },
    });
  }

  private startFormInvitePolling(studentId: string): void {
    this.stopFormInvitePolling();
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.formInvitePollTimer = setInterval(() => {
      this.svc.getOne(studentId).subscribe({
        next: (updated) => {
          this.patchStudent(updated);
          if (this.editTarget()?._id === updated._id) {
            this.editTarget.set(updated);
          }
          if (updated.telegram_user_id || updated.telegram_chat_id) {
            this.stopFormInvitePolling();
            this.formInviteLoading.set(false);
            this.formInviteError.set(null);
          }
        },
      });
    }, 3000);
  }

  private stopFormInvitePolling(): void {
    if (this.formInvitePollTimer) {
      clearInterval(this.formInvitePollTimer);
      this.formInvitePollTimer = null;
    }
  }

  private async copyInviteLink(link: string): Promise<boolean> {
    if (!link || typeof navigator === 'undefined' || !navigator.clipboard) {
      return false;
    }
    try {
      await navigator.clipboard.writeText(link);
      this.linkCopied.set(true);
      if (this.linkCopiedTimer) {
        clearTimeout(this.linkCopiedTimer);
      }
      this.linkCopiedTimer = setTimeout(() => this.linkCopied.set(false), 2000);
      return true;
    } catch {
      return false;
    }
  }

  async copyTelegramInvite(student?: Student | null): Promise<void> {
    const existing = this.telegramDeepLink(student);
    if (existing) {
      await this.copyInviteLink(existing);
      return;
    }
    if (student) {
      this.openInviteDialog(student);
      return;
    }
    this.ensureInviteLinkFromForm();
  }

  /** Открыть диалог с invite-ссылкой (из таблицы, быстрых действий или формы). */
  inviteStudentToBot(student?: Student | null): void {
    if (!this.hasTelegramPlan()) {
      this.planGateKind.set('telegram');
      return;
    }
    if (student) {
      this.openInviteDialog(student);
      return;
    }
    this.ensureInviteLinkFromForm();
  }

  openInviteDialog(student: Student): void {
    if (!this.hasTelegramPlan()) {
      this.planGateKind.set('telegram');
      return;
    }
    if (this.isTelegramLinked(student)) {
      this.openTelegramSettings(student);
      return;
    }
    this.inviteDialogError.set(null);
    this.inviteLinkedSuccess.set(false);
    this.showManualChatId.set(false);
    this.manualChatId.set('');
    this.manualChatConsent.set(false);
    this.linkCopied.set(false);
    this.inviteDialogStudent.set(student);
    this.startInvitePolling(student._id);
    this.refreshInviteLink(student);
  }

  closeInviteDialog(): void {
    this.stopInvitePolling();
    this.inviteDialogStudent.set(null);
    this.inviteDialogLoading.set(false);
    this.inviteDialogError.set(null);
    this.inviteLinkedSuccess.set(false);
    this.showManualChatId.set(false);
    this.manualChatId.set('');
    this.manualChatConsent.set(false);
    this.linkCopied.set(false);
  }

  private startInvitePolling(studentId: string): void {
    this.stopInvitePolling();
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.invitePollTimer = setInterval(() => {
      this.svc.getOne(studentId).subscribe({
        next: (updated) => {
          this.patchStudent(updated);
          if (updated.telegram_user_id || updated.telegram_chat_id) {
            this.inviteLinkedSuccess.set(true);
            this.inviteDialogStudent.set(updated);
            this.stopInvitePolling();
            setTimeout(() => {
              if (this.inviteDialogStudent()?._id === updated._id) {
                this.closeInviteDialog();
                this.openTelegramSettings(updated);
              }
            }, 1200);
          }
        },
      });
    }, 3000);
  }

  private stopInvitePolling(): void {
    if (this.invitePollTimer) {
      clearInterval(this.invitePollTimer);
      this.invitePollTimer = null;
    }
  }

  toggleManualChatId(): void {
    this.showManualChatId.update((v) => !v);
  }

  submitManualChatId(): void {
    const student = this.inviteDialogStudent();
    const chatId = this.manualChatId().trim();
    if (!student || !chatId || !this.manualChatConsent()) {
      return;
    }
    this.inviteDialogLoading.set(true);
    this.inviteDialogError.set(null);
    this.svc
      .linkTelegramManual(student._id, chatId, 'student', { confirmRecipientConsent: true })
      .subscribe({
        next: (updated) => {
          this.inviteDialogLoading.set(false);
          this.patchStudent(updated);
          this.inviteLinkedSuccess.set(true);
          this.stopInvitePolling();
          setTimeout(() => {
            this.closeInviteDialog();
            this.openTelegramSettings(updated);
          }, 800);
        },
        error: (err) => {
          this.inviteDialogLoading.set(false);
          this.inviteDialogError.set(this.apiErrorMessage(err));
        },
      });
  }

  openTelegramSettings(student: Student): void {
    if (!this.hasTelegramPlan()) {
      this.planGateKind.set('telegram');
      return;
    }
    this.closeQuickActions();
    this.settingsStudent.set(student);
  }

  closeTelegramSettings(): void {
    this.settingsStudent.set(null);
  }

  onNotificationStudentChange(updated: Student): void {
    this.patchStudent(updated);
    if (this.settingsStudent()?._id === updated._id) {
      this.settingsStudent.set(updated);
    }
  }

  async copyInviteFromDialog(): Promise<void> {
    const link = this.inviteDialogLink();
    if (!link) {
      return;
    }
    const copied = await this.copyInviteLink(link);
    if (!copied) {
      this.inviteDialogError.set(this.t.botInviteLinkFailed);
    }
  }

  openInviteLinkInTelegram(): void {
    const link = this.inviteDialogLink();
    if (!link || typeof window === 'undefined') {
      return;
    }
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  private ensureInviteLinkFromForm(): void {
    if (this.isTelegramLinked() || this.savingForm()) {
      return;
    }
    this.formError.set(null);
    this.form.bot_active = true;

    const existingLink = this.telegramDeepLink();
    const target = this.editTarget();
    if (existingLink && target) {
      this.openInviteDialog(target);
      return;
    }

    if (target) {
      this.openInviteDialog(target);
      return;
    }

    this.formSubmitted.set(true);
    const form = this.studentFormRef;
    if (!form || form.invalid || !this.form.name.trim()) {
      this.formError.set('Сначала заполните имя ученика и сохраните карточку.');
      return;
    }
    this.persistStudentForm({ openInviteDialog: true });
  }

  private refreshInviteLink(student: Student): void {
    if (this.isTelegramLinked(student)) {
      return;
    }
    this.inviteDialogLoading.set(true);
    this.inviteDialogError.set(null);
    // PATCH bot_active re-runs ensureTelegramLink → registers token in bot Firestore.
    this.svc.update(student._id, { bot_active: true }).subscribe({
      next: (updated) => {
        this.inviteDialogLoading.set(false);
        this.patchStudent(updated);
        this.inviteDialogStudent.set(updated);
        if (this.editTarget()?._id === updated._id) {
          this.editTarget.set(updated);
          this.form.bot_active = true;
        }
        if (!updated.telegram_deep_link) {
          this.inviteDialogError.set(this.t.botInviteLinkFailed);
        }
      },
      error: (err) => {
        this.inviteDialogLoading.set(false);
        this.inviteDialogError.set(this.apiErrorMessage(err));
      },
    });
  }

  private loadInviteLink(student: Student): void {
    this.refreshInviteLink(student);
  }


  inviteFromQuick(): void {
    const student = this.quickActionsStudent();
    if (!student) {
      return;
    }
    this.closeQuickActions();
    this.openInviteDialog(student);
  }

  openQuickActions(student: Student): void {
    this.quickActionsStudent.set(student);
  }

  closeQuickActions(): void {
    this.quickActionsStudent.set(null);
  }

  openTopup(id: string) {
    this.topupTargetId.set(id);
    this.topupPaidAt.set(this.todayInputDate());
    this.topupAmountSource.set('money');
    this.topupPreset.set('custom');
    this.topupSummaryVisible.set(false);
    this.setTopupMoneyValue(0);
    this.svc.getOne(id).subscribe({
      next: (student) => {
        this.patchStudent(student);
        const receiptDefault =
          this.isTelegramLinked(student) &&
          normalizeTelegramSettings(student.telegram_notification_settings).payment_receipt_enabled &&
          !isBlockingTelegramDeliveryError(student);
        this.topupSendReceipt.set(receiptDefault);
      },
      error: () => {
        const student = this.students().find((item) => item._id === id) ?? null;
        this.topupSendReceipt.set(
          !!student &&
            this.isTelegramLinked(student) &&
            normalizeTelegramSettings(student.telegram_notification_settings).payment_receipt_enabled &&
            !isBlockingTelegramDeliveryError(student),
        );
      },
    });
  }

  openTopupFromQuick(): void {
    const student = this.quickActionsStudent();
    if (!student) {
      return;
    }
    this.closeQuickActions();
    this.openTopup(student._id);
  }

  closeTopup() {
    this.topupTargetId.set(null);
    this.topupSummaryVisible.set(false);
  }

  onTopupMoneyChange(raw: number | string): void {
    const student = this.topupStudent();
    const text = this.normalizeTopupMoneyText(raw);
    this.topupMoneyText.set(text);
    const money = text === '' || text === '.' ? 0 : Number(text);
    const safeMoney = Number.isFinite(money) ? money : 0;
    this.topupMoney.set(safeMoney);
    this.topupAmountSource.set('money');
    this.topupPreset.set('custom');
    const rate = Number(student?.rate_per_hour) || 0;
    if (rate > 0 && safeMoney > 0) {
      this.topupUnits.set(this.normalizeTopupUnits(safeMoney / rate, student));
      const matched = this.topupPresets().find(
        (preset) => Math.abs(preset.money - safeMoney) < 0.005,
      );
      if (matched) {
        this.topupPreset.set(matched.id);
      }
    } else {
      this.topupUnits.set(0);
    }
    this.markTopupSummaryVisibleIfNeeded(safeMoney);
  }

  private setTopupMoneyValue(money: number): void {
    const safe = Number.isFinite(money) ? money : 0;
    this.topupMoney.set(safe);
    this.topupMoneyText.set(Number.isInteger(safe) ? String(safe) : String(safe));
    this.topupAmountSource.set('money');
    const student = this.topupStudent();
    const rate = Number(student?.rate_per_hour) || 0;
    if (rate > 0 && safe > 0) {
      this.topupUnits.set(this.normalizeTopupUnits(safe / rate, student));
    } else {
      this.topupUnits.set(0);
    }
    this.markTopupSummaryVisibleIfNeeded(safe);
  }

  private markTopupSummaryVisibleIfNeeded(amount: number): void {
    if (amount > 0) {
      this.topupSummaryVisible.set(true);
    }
  }

  /** Keep decimals typable; drop a stuck leading 0 when the next digit is typed. */
  private normalizeTopupMoneyText(raw: number | string): string {
    if (raw === null || raw === undefined) {
      return '0';
    }
    let text = String(raw).trim().replace(',', '.');
    text = text.replace(/[^\d.]/g, '');
    const firstDot = text.indexOf('.');
    if (firstDot !== -1) {
      text =
        text.slice(0, firstDot + 1) + text.slice(firstDot + 1).replace(/\./g, '');
    }
    if (text === '') {
      return '';
    }
    if (/^0\d/.test(text)) {
      text = text.replace(/^0+/, '');
    }
    return text;
  }

  onTopupMoneyFocus(event: FocusEvent): void {
    this.topupPreset.set('custom');
    const el = event.target as HTMLInputElement | null;
    if (!el) {
      return;
    }
    if (this.topupMoney() === 0 || this.topupMoneyText() === '0') {
      queueMicrotask(() => el.select());
    }
  }

  topupMoneyDisplay(): string {
    return this.topupMoneyText();
  }

  onTopupUnitsChange(raw: number | string): void {
    const student = this.topupStudent();
    const units = this.normalizeTopupUnits(Number(raw), student);
    this.topupUnits.set(units);
    this.topupAmountSource.set('units');
    const rate = Number(student?.rate_per_hour) || 0;
    if (rate > 0 && units > 0) {
      this.setTopupMoneyValue(this.roundMoney(rate * units));
    }
  }

  applyTopup() {
    const id = this.topupTargetId();
    const student = this.topupStudent();
    const n = this.normalizeTopupUnits(this.topupUnits(), student);
    if (!id || !(n > 0)) {
      return;
    }
    const settings = student ? normalizeTelegramSettings(student.telegram_notification_settings) : null;
    const linked = !!student && this.isTelegramLinked(student);
    const autoReceipt =
      linked &&
      !!settings?.payment_receipt_enabled &&
      !isBlockingTelegramDeliveryError(student!);
    const payload: {
      lessons: number;
      money_amount: number;
      paid_at?: string;
      send_receipt?: boolean;
    } = {
      lessons: n,
      money_amount: this.topupMoney(),
      paid_at: this.topupPaidAt() || undefined,
    };
    if (autoReceipt) {
      payload.send_receipt = this.topupSendReceipt();
    }
    const expectedReceipt = autoReceipt && payload.send_receipt === true;
    this.svc
      .topup(id, payload)
      .subscribe({
        next: (updated) => {
          this.closeTopup();
          this.patchStudent(updated);
          const receiptAttempted = Boolean(
            (updated as Student & { telegram_receipt_attempted?: boolean }).telegram_receipt_attempted,
          );
          const receiptSent = Boolean(updated.telegram_receipt_sent);
          if ((expectedReceipt || receiptAttempted) && !receiptSent) {
            this.showToast(this.t.tgNotifySkipped);
          }
        },
        error: (err) => {
          this.showToast(this.apiErrorMessage(err));
        },
      });
  }

  openBalanceAdjust(student: Student, event?: Event): void {
    event?.stopPropagation();
    this.closeQuickActions();
    this.adjustTarget.set(student);
    this.adjustNextBalance.set(Number(student.balance_lessons) || 0);
    this.adjustReason.set('typo');
  }

  closeBalanceAdjust(): void {
    if (this.adjustSaving()) {
      return;
    }
    this.adjustTarget.set(null);
  }

  applyBalanceAdjust(): void {
    const student = this.adjustTarget();
    if (!student || this.adjustSaving()) {
      return;
    }
    const raw = Number(this.adjustNextBalance());
    if (!Number.isFinite(raw)) {
      return;
    }
    const balance =
      resolveRateUnit(student.rate_unit) === 'hour' ? Math.round(raw * 100) / 100 : Math.trunc(raw);
    this.adjustSaving.set(true);
    this.svc
      .adjustBalance(student._id, {
        balance_lessons: balance,
        reason: this.adjustReason(),
        notify_telegram: true,
      })
      .subscribe({
        next: (updated) => {
          this.adjustSaving.set(false);
          this.patchStudent(updated);
          this.closeBalanceAdjust();
          if (!updated.telegram_notified) {
            this.showToast(this.t.tgNotifySkipped);
          }
        },
        error: (err) => {
          this.adjustSaving.set(false);
          this.showToast(this.apiErrorMessage(err));
        },
      });
  }

  openDeleteConfirm(id: string) {
    this.closeQuickActions();
    this.archiveTargetId.set(null);
    this.deleteTargetId.set(id);
  }

  openArchiveConfirm(id: string) {
    this.closeQuickActions();
    this.deleteTargetId.set(null);
    this.archiveTargetId.set(id);
  }

  cancelArchive() {
    this.archiveTargetId.set(null);
  }

  archiveConfirmMessage(): string {
    const id = this.archiveTargetId();
    const student = this.students().find((item) => item._id === id);
    const name = toTitleCaseName(student?.name) || '—';
    return this.t.archiveConfirm.replace('{name}', name);
  }

  confirmArchive() {
    const id = this.archiveTargetId();
    if (!id) {
      return;
    }
    this.svc.archive(id).subscribe({
      next: () => {
        this.archiveTargetId.set(null);
        if (this.editTarget()?._id === id) {
          this.resetFormDialog();
        }
        this.load();
      },
      error: (err) => this.showToast(this.apiErrorMessage(err)),
    });
  }

  unarchiveStudent(id: string) {
    this.svc.unarchive(id).subscribe({
      next: () => this.load(),
      error: (err) => this.showToast(this.apiErrorMessage(err)),
    });
  }

  openDeleteFromQuick(): void {
    const student = this.quickActionsStudent();
    if (!student) {
      return;
    }
    this.openDeleteConfirm(student._id);
  }

  cancelDelete() {
    this.deleteTargetId.set(null);
  }

  deleteConfirmMessage(): string {
    const id = this.deleteTargetId();
    const student = this.students().find((item) => item._id === id);
    const name = toTitleCaseName(student?.name) || '—';
    return this.t.deleteConfirm.replace('{name}', name);
  }

  confirmDelete() {
    const id = this.deleteTargetId();
    if (!id) {
      return;
    }
    this.svc.remove(id).subscribe({
      next: () => {
        this.deleteTargetId.set(null);
        if (this.editTarget()?._id === id) {
          this.resetFormDialog();
        }
        this.closeQuickActions();
        this.load();
      },
      error: (err) => this.showToast(this.apiErrorMessage(err)),
    });
  }

  requestBotToggle(student: Student): void {
    if (!this.hasTelegramPlan()) {
      this.planGateKind.set('telegram');
      return;
    }
    if (!this.isTelegramLinked(student)) {
      return;
    }
    this.botToggleConfirm.set({ student, nextActive: !student.bot_active });
  }

  closePlanGate(): void {
    this.planGateKind.set(null);
  }

  goToPricingFromGate(): void {
    this.planGateKind.set(null);
    void this.localeRouter.navigate('/app/pricing');
  }

  requestBotToggleFromQuick(): void {
    const student = this.quickActionsStudent();
    if (!student) {
      return;
    }
    this.requestBotToggle(student);
  }

  requestBotToggleFromForm(): void {
    const student = this.editTarget();
    if (!student || !this.isTelegramLinked(student)) {
      return;
    }
    this.requestBotToggle(student);
  }

  cancelBotToggle(): void {
    this.botToggleConfirm.set(null);
  }

  confirmBotToggle(): void {
    const pending = this.botToggleConfirm();
    if (!pending) {
      return;
    }
    this.botToggleConfirm.set(null);
    this.svc.update(pending.student._id, { bot_active: pending.nextActive }).subscribe({
      next: (updated) => {
        this.patchStudent(updated);
        if (this.editTarget()?._id === updated._id) {
          this.editTarget.set(updated);
          this.form.bot_active = Boolean(updated.bot_active);
        }
        if (!pending.nextActive) {
          this.closeQuickActions();
        }
      },
    });
  }

  botToggleTitle(): string {
    const pending = this.botToggleConfirm();
    if (!pending) {
      return '';
    }
    return pending.nextActive ? this.t.botEnableTitle : this.t.botDisableTitle;
  }

  botToggleMessage(): string {
    const pending = this.botToggleConfirm();
    if (!pending) {
      return '';
    }
    return pending.nextActive ? this.t.botEnableMessage : this.t.botDisableMessage;
  }

  botToggleConfirmLabel(): string {
    const pending = this.botToggleConfirm();
    if (!pending) {
      return '';
    }
    return pending.nextActive ? this.t.botEnableConfirm : this.t.botDisableConfirm;
  }

  requestTelegramDisconnect(student?: Student | null): void {
    const target = student ?? this.editTarget() ?? this.quickActionsStudent() ?? this.settingsStudent();
    if (!target || !this.isTelegramLinked(target)) {
      return;
    }
    this.disconnectConfirm.set(target);
  }

  cancelTelegramDisconnect(): void {
    this.disconnectConfirm.set(null);
  }

  confirmTelegramDisconnect(): void {
    const student = this.disconnectConfirm();
    if (!student) {
      return;
    }
    this.disconnectConfirm.set(null);
    this.svc.disconnectTelegram(student._id).subscribe({
      next: (updated) => {
        this.patchStudent(updated);
        if (this.editTarget()?._id === updated._id) {
          this.editTarget.set(updated);
          this.form.bot_active = false;
        }
        if (this.settingsStudent()?._id === updated._id) {
          this.settingsStudent.set(updated);
          this.closeTelegramSettings();
        }
        this.closeQuickActions();
      },
    });
  }
}
