import { Component, computed, inject, signal, OnInit, OnDestroy, ViewChild, afterNextRender, Injector, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService, Student } from '../../core/services/student.service';
import { BotUnlinkAlertService } from '../../core/services/bot-unlink-alert.service';
import { I18nService } from '../../core/services/i18n.service';
import {
  RATE_CURRENCIES,
  type RateCurrency,
  type StudentBalanceAdjustReason,
  type StudentBillingType,
  type StudentRateUnit,
  type StudentTelegramNotificationSettings,
} from '@interfaces';
import {
  colorToHexForPicker,
  DEFAULT_STUDENT_BORDER_COLOR,
  generatePastelColor,
  hexToStoredColor,
} from '../../core/utils/pastel-color';
import {
  DEFAULT_TELEGRAM_SETTINGS,
  normalizeTelegramSettings,
} from '../../core/utils/telegram-notification-settings';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';
import { HelpTipComponent } from '../../shared/help-tip/help-tip.component';
import { TelegramCellComponent } from './telegram-cell/telegram-cell.component';

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
  imports: [FormsModule, AppDialogComponent, AppSelectComponent, HelpTipComponent, TelegramCellComponent],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent implements OnInit, OnDestroy {
  private svc = inject(StudentService);
  private unlinkAlerts = inject(BotUnlinkAlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);
  @ViewChild('studentForm') studentFormRef?: NgForm;
  students = signal<Student[]>([]);
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
    this.rateUnit() === 'lesson' ? this.t.ratePerLesson : this.t.ratePerHour,
  );

  readonly rateCurrencies = RATE_CURRENCIES;
  readonly skeletonCardSlots = [0, 1, 2, 3, 4, 5];

  deleteTargetId = signal<string | null>(null);
  topupTargetId = signal<string | null>(null);
  topupMoney = signal(0);
  topupUnits = signal(1);
  topupPaidAt = signal('');
  topupSendReceipt = signal(false);
  topupAmountSource = signal<'money' | 'units'>('units');
  adjustTarget = signal<Student | null>(null);
  adjustNextBalance = signal(0);
  adjustReason = signal<StudentBalanceAdjustReason>('typo');
  adjustNotify = signal(false);
  adjustSaving = signal(false);
  quickActionsStudent = signal<Student | null>(null);
  botToggleConfirm = signal<{ student: Student; nextActive: boolean } | null>(null);
  disconnectConfirm = signal<Student | null>(null);
  inviteDialogStudent = signal<Student | null>(null);
  inviteDialogLoading = signal(false);
  inviteDialogError = signal<string | null>(null);
  inviteLinkedSuccess = signal(false);
  showManualChatId = signal(false);
  manualChatId = signal('');
  settingsStudent = signal<Student | null>(null);
  settingsDraft = signal<StudentTelegramNotificationSettings>({ ...DEFAULT_TELEGRAM_SETTINGS });
  settingsSaving = signal(false);
  settingsIsMinor = signal(false);
  toastMessage = signal<string | null>(null);
  formSubmitted = signal(false);
  savingForm = signal(false);
  linkCopied = signal(false);
  formError = signal<string | null>(null);
  /** После смены ставки — предложить resync снапшотов уроков. */
  resyncPromptStudentId = signal<string | null>(null);
  resyncingLessons = signal(false);
  resyncMessage = signal<string | null>(null);
  readonly colorToHexForPicker = colorToHexForPicker;
  readonly inviteDialogLink = computed(() => this.inviteDialogStudent()?.telegram_deep_link ?? '');
  readonly inviteQrSrc = computed(() => {
    const link = this.inviteDialogLink();
    if (!link) {
      return '';
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
  });
  readonly telegramTogglesDisabled = computed(() => {
    const student = this.settingsStudent() ?? this.editTarget();
    if (!student?.telegram_user_id && !student?.telegram_chat_id) {
      return true;
    }
    if (student.telegram_delivery_status === 'error') {
      return true;
    }
    return false;
  });

  private linkCopiedTimer: ReturnType<typeof setTimeout> | null = null;
  private invitePollTimer: ReturnType<typeof setInterval> | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.load();
  }

  ngOnDestroy(): void {
    this.stopInvitePolling();
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

  onTableColorChange(student: Student, event: Event): void {
    event.stopPropagation();
    const hex = (event.target as HTMLInputElement).value;
    const color_hex = hexToStoredColor(hex);
    this.svc.update(student._id, { color_hex }).subscribe({
      next: (updated) => {
        this.patchStudent(updated);
      },
    });
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

  formatStudentRate(student: Student): string {
    const unit = resolveRateUnit(student.rate_unit);
    return `${student.rate_per_hour} ${this.i18n.currencyLabel(this.rateCurrencyOf(student))}${rateUnitSuffix(unit, this.t)}`;
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
    if (!student) {
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

  telegramCellLabels() {
    const t = this.t;
    return {
      connected: t.tgConnected,
      notConnected: t.tgNotConnected,
      error: t.tgError,
      paused: t.tgPaused,
      bind: t.tgBind,
      openChat: t.tgOpenChat,
      connectedTooltip: t.tgConnectedTooltip,
      notConnectedTooltip: t.tgNotConnectedTooltip,
      errorTooltip: t.tgErrorUnknown,
    };
  }

  telegramErrorTooltip(student: Student): string {
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

  telegramCellLabelsFor(student: Student) {
    return {
      ...this.telegramCellLabels(),
      errorTooltip: this.telegramErrorTooltip(student),
    };
  }

  reminderOffsetOptions(): AppSelectOption[] {
    return [
      { value: '15', label: this.t.tgReminder15m },
      { value: '60', label: this.t.tgReminder1h },
      { value: '120', label: this.t.tgReminder2h },
      { value: '1440', label: this.t.tgReminder24h },
    ];
  }

  reminderOffsetValue(): string {
    return String(this.settingsDraft().lesson_reminder_offset_minutes);
  }

  formatLinkedAt(value?: string | null): string {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleString();
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
    this.showForm.set(true);
  }

  openEdit(s: Student) {
    this.formSubmitted.set(false);
    this.formError.set(null);
    this.linkCopied.set(false);
    this.closeQuickActions();
    this.form = {
      name: s.name,
      rate_per_hour: s.rate_per_hour,
      rate_currency: s.rate_currency ?? 'EUR',
      timezone: s.timezone || DEFAULT_STUDENT_TIMEZONE,
      color_hex: s.color_hex || generatePastelColor(),
      bot_active: Boolean(s.bot_active),
      meeting_link: s.meeting_link || '',
    };
    this.billingType.set(resolveBillingType(s.billing_type));
    this.rateUnit.set(resolveRateUnit(s.rate_unit));
    this.balanceLessons.set(Number.isFinite(Number(s.balance_lessons)) ? Number(s.balance_lessons) : 0);
    this.creditLimit.set(Number(s.credit_limit) || 0);
    this.editTarget.set(s);
    this.showForm.set(true);
  }

  closeForm() {
    if (this.savingForm()) {
      return;
    }
    this.resetFormDialog();
  }

  private resetFormDialog(): void {
    this.formSubmitted.set(false);
    this.formError.set(null);
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

  private studentFormPayload(): Partial<Student> {
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
        ? { balance_lessons: this.balanceLessons() }
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
    this.persistStudentForm({ inviteAfter: false });
  }

  private apiErrorMessage(err: unknown): string {
    const message =
      err &&
      typeof err === 'object' &&
      'error' in err &&
      err.error &&
      typeof err.error === 'object' &&
      'message' in err.error
        ? String((err.error as { message?: unknown }).message || '')
        : '';
    return message || 'Ошибка сохранения';
  }

  private persistStudentForm(opts: { inviteAfter?: boolean; openInviteDialog?: boolean }): void {
    const target = this.editTarget();
    const payload = this.studentFormPayload();
    const rateSnapshotChanged =
      Boolean(target) &&
      (resolveRateUnit(target!.rate_unit) !== this.rateUnit() ||
        Number(target!.rate_per_hour) !== Number(this.form.rate_per_hour) ||
        String(target!.rate_currency) !== String(this.form.rate_currency));

    if (opts.inviteAfter || opts.openInviteDialog) {
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
        this.resetFormDialog();
        this.load();
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
    if (student) {
      this.openInviteDialog(student);
      return;
    }
    this.ensureInviteLinkFromForm();
  }

  openInviteDialog(student: Student): void {
    if (this.isTelegramLinked(student)) {
      this.openTelegramSettings(student);
      return;
    }
    this.inviteDialogError.set(null);
    this.inviteLinkedSuccess.set(false);
    this.showManualChatId.set(false);
    this.manualChatId.set('');
    this.linkCopied.set(false);
    this.inviteDialogStudent.set(student);
    this.startInvitePolling(student._id);
    if (!student.telegram_deep_link) {
      this.loadInviteLink(student);
    }
  }

  closeInviteDialog(): void {
    this.stopInvitePolling();
    this.inviteDialogStudent.set(null);
    this.inviteDialogLoading.set(false);
    this.inviteDialogError.set(null);
    this.inviteLinkedSuccess.set(false);
    this.showManualChatId.set(false);
    this.manualChatId.set('');
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
    if (!student || !chatId) {
      return;
    }
    this.inviteDialogLoading.set(true);
    this.inviteDialogError.set(null);
    this.svc.linkTelegramManual(student._id, chatId, 'student').subscribe({
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

  submitParentChatId(): void {
    const student = this.settingsStudent();
    const chatId = this.manualChatId().trim();
    if (!student || !chatId) {
      return;
    }
    this.settingsSaving.set(true);
    this.svc.linkTelegramManual(student._id, chatId, 'parent').subscribe({
      next: (updated) => {
        this.settingsSaving.set(false);
        this.manualChatId.set('');
        this.patchStudent(updated);
        this.settingsStudent.set(updated);
        this.settingsIsMinor.set(true);
      },
      error: (err) => {
        this.settingsSaving.set(false);
        this.showToast(this.apiErrorMessage(err));
      },
    });
  }

  openTelegramSettings(student: Student): void {
    this.closeQuickActions();
    this.manualChatId.set('');
    this.settingsStudent.set(student);
    this.settingsDraft.set(normalizeTelegramSettings(student.telegram_notification_settings));
    this.settingsIsMinor.set(Boolean(student.is_minor));
  }

  closeTelegramSettings(): void {
    if (this.settingsSaving()) {
      return;
    }
    this.settingsStudent.set(null);
  }

  updateSettingsDraft(patch: Partial<StudentTelegramNotificationSettings>): void {
    this.settingsDraft.update((current) => normalizeTelegramSettings({ ...current, ...patch }));
  }

  setReminderOffset(value: string): void {
    const n = Number(value);
    if (n === 15 || n === 60 || n === 120 || n === 1440) {
      this.updateSettingsDraft({ lesson_reminder_offset_minutes: n });
    }
  }

  saveTelegramSettings(): void {
    const student = this.settingsStudent();
    if (!student || this.settingsSaving()) {
      return;
    }
    this.settingsSaving.set(true);
    const settings = normalizeTelegramSettings(this.settingsDraft());
    this.svc
      .update(student._id, {
        telegram_notification_settings: settings,
        is_minor: this.settingsIsMinor(),
      })
      .subscribe({
        next: (updated) => {
          this.settingsSaving.set(false);
          this.patchStudent(updated);
          this.settingsStudent.set(updated);
          this.closeTelegramSettings();
        },
        error: (err) => {
          this.settingsSaving.set(false);
          this.showToast(this.apiErrorMessage(err));
        },
      });
  }

  requestDisconnectFromSettings(): void {
    const student = this.settingsStudent();
    if (!student) {
      return;
    }
    this.requestTelegramDisconnect(student);
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

  private loadInviteLink(student: Student): void {
    if (this.isTelegramLinked(student)) {
      return;
    }
    const link = student.telegram_deep_link || '';
    if (link) {
      return;
    }
    this.inviteDialogLoading.set(true);
    this.inviteDialogError.set(null);
    this.svc.update(student._id, { bot_active: true }).subscribe({
      next: (updated) => {
        this.inviteDialogLoading.set(false);
        this.patchStudent(updated);
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
    const student = this.students().find((item) => item._id === id) ?? null;
    const step = resolveRateUnit(student?.rate_unit) === 'hour' ? 0.5 : 1;
    const rate = Number(student?.rate_per_hour) || 0;
    this.topupUnits.set(step);
    this.topupMoney.set(rate > 0 ? this.roundMoney(rate * step) : 0);
    this.topupPaidAt.set(this.todayInputDate());
    this.topupAmountSource.set('units');
    const settings = normalizeTelegramSettings(student?.telegram_notification_settings);
    this.topupSendReceipt.set(settings.payment_receipt_enabled && this.canNotifyTelegram(student));
    this.topupTargetId.set(id);
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
  }

  onTopupMoneyChange(raw: number | string): void {
    const student = this.topupStudent();
    const money = Number(raw);
    this.topupMoney.set(Number.isFinite(money) ? money : 0);
    this.topupAmountSource.set('money');
    const rate = Number(student?.rate_per_hour) || 0;
    if (rate > 0 && Number.isFinite(money) && money > 0) {
      this.topupUnits.set(this.normalizeTopupUnits(money / rate, student));
    }
  }

  onTopupUnitsChange(raw: number | string): void {
    const student = this.topupStudent();
    const units = this.normalizeTopupUnits(Number(raw), student);
    this.topupUnits.set(units);
    this.topupAmountSource.set('units');
    const rate = Number(student?.rate_per_hour) || 0;
    if (rate > 0 && units > 0) {
      this.topupMoney.set(this.roundMoney(rate * units));
    }
  }

  applyTopup() {
    const id = this.topupTargetId();
    const student = this.topupStudent();
    const n = this.normalizeTopupUnits(this.topupUnits(), student);
    if (!id || !(n > 0)) {
      return;
    }
    const wantsReceipt = this.topupSendReceipt();
    this.svc
      .topup(id, {
        lessons: n,
        money_amount: this.topupMoney(),
        paid_at: this.topupPaidAt() || undefined,
        send_receipt: wantsReceipt,
      })
      .subscribe({
        next: (updated) => {
          this.closeTopup();
          this.patchStudent(updated);
          if (wantsReceipt && !updated.telegram_receipt_sent) {
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
    this.adjustNotify.set(false);
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
    const wantsNotify = this.adjustNotify();
    this.adjustSaving.set(true);
    this.svc
      .adjustBalance(student._id, {
        balance_lessons: balance,
        reason: this.adjustReason(),
        notify_telegram: wantsNotify,
      })
      .subscribe({
        next: (updated) => {
          this.adjustSaving.set(false);
          this.patchStudent(updated);
          this.closeBalanceAdjust();
          if (wantsNotify && !updated.telegram_notified) {
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
    this.deleteTargetId.set(id);
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
    const name = student?.name?.trim() || '—';
    return this.t.deleteConfirm.replace('{name}', name);
  }

  confirmDelete() {
    const id = this.deleteTargetId();
    if (!id) {
      return;
    }
    this.svc.remove(id).subscribe(() => {
      this.deleteTargetId.set(null);
      this.load();
    });
  }

  requestBotToggle(student: Student): void {
    if (!this.isTelegramLinked(student)) {
      return;
    }
    this.botToggleConfirm.set({ student, nextActive: !student.bot_active });
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
