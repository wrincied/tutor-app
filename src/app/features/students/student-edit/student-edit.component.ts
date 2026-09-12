import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService, Student } from '../../../core/services/student.service';
import { I18nService } from '../../../core/services/i18n.service';
import { UserService } from '../../../core/services/user.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import {
  buildStudentPaymentHistory,
  type StudentPaymentHistoryRow,
} from '../../../core/utils/student-payment-history';
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
} from '../../../core/utils/pastel-color';
import { toTitleCaseName } from '../../../core/utils/to-title-case';
import { isBlockingTelegramDeliveryError } from '../../../core/utils/telegram-notification-settings';
import { planEntitlementsFromProfile } from '../../../core/utils/user-profile.utils';
import { AppDialogComponent } from '../../../shared/app-dialog/app-dialog.component';
import { AppSelectComponent, type AppSelectOption } from '../../../shared/app-select';
import { HelpTipComponent } from '../../../shared/help-tip/help-tip.component';
import { LocaleRouter } from '../../../core/i18n/locale-router.service';

/** Fallback IANA when student.timezone is empty (bot/reminders use tutor TZ). */
const DEFAULT_STUDENT_TIMEZONE = 'Europe/Vienna';

type SectionId = 'se-main' | 'se-billing' | 'se-telegram' | 'se-meeting' | 'se-danger';

export type { StudentPaymentHistoryRow };

function resolveBillingType(raw?: string): StudentBillingType {
  if (raw === 'postpaid' || raw === 'per_lesson' || raw === 'single') {
    return 'postpaid';
  }
  return 'package';
}

function resolveRateUnit(raw?: string): StudentRateUnit {
  return raw === 'lesson' ? 'lesson' : 'hour';
}

@Component({
  selector: 'app-student-edit',
  standalone: true,
  imports: [FormsModule, RouterLink, AppDialogComponent, AppSelectComponent, HelpTipComponent],
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.scss',
})
export class StudentEditComponent implements OnInit, OnDestroy {
  private readonly svc = inject(StudentService);
  private readonly activityLogSvc = inject(ActivityLogService);
  private readonly userSvc = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly localeRouter = inject(LocaleRouter);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  readonly i18n = inject(I18nService);

  @ViewChild('studentForm') studentFormRef?: NgForm;
  @ViewChild('anchorsNav') anchorsNav?: ElementRef<HTMLElement>;

  student = signal<Student | null>(null);
  /** Alias used by form helpers that mirror the drawer. */
  readonly editTarget = this.student;

  profile = signal<UserProfile | null>(null);
  loading = signal(true);
  loadError = signal<string | null>(null);

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

  formSubmitted = signal(false);
  savingForm = signal(false);
  formError = signal<string | null>(null);
  linkCopied = signal(false);
  formInviteLoading = signal(false);
  formInviteError = signal<string | null>(null);
  toastMessage = signal<string | null>(null);
  paymentHistory = signal<StudentPaymentHistoryRow[]>([]);
  paymentHistoryLoading = signal(false);

  deleteTargetId = signal<string | null>(null);
  archiveTargetId = signal<string | null>(null);
  disconnectConfirm = signal<Student | null>(null);

  balanceChangeStep = signal<0 | 1 | 2>(0);
  balanceChangeReason = signal<StudentBalanceAdjustReason>('typo');
  balanceChangeSaving = signal(false);

  resyncPromptStudentId = signal<string | null>(null);
  resyncingLessons = signal(false);
  resyncMessage = signal<string | null>(null);

  planGateKind = signal<'telegram' | null>(null);

  activeSection = signal<SectionId>('se-main');

  readonly formInviteLink = computed(() => this.student()?.telegram_deep_link ?? '');
  readonly planEntitlements = computed(() => planEntitlementsFromProfile(this.profile()));
  readonly hasTelegramPlan = computed(() => this.planEntitlements().hasTelegram);
  readonly planGateTitle = computed(() => this.i18n.sharedUi().planTelegramRequiredTitle);
  readonly planGateBody = computed(() => this.i18n.sharedUi().planTelegramRequiredBody);

  readonly pageTitle = computed(() => {
    const s = this.student();
    return s ? toTitleCaseName(s.name) : this.t.editModalTitle;
  });

  /** Live color for mast marker (follows color picker). */
  displayStudentName(name: string | null | undefined): string {
    return toTitleCaseName(name);
  }

  mastColor(): string {
    return this.form.color_hex || this.student()?.color_hex || DEFAULT_STUDENT_BORDER_COLOR;
  }

  /** Rate · balance summary under the name. */
  mastSubtitle(): string {
    const rate = this.form.rate_per_hour;
    const cur = this.i18n.currencyLabel(this.form.rate_currency);
    const unit = this.rateUnit() === 'lesson' ? this.t.perLesson : this.t.perHour;
    const ratePart = `${rate} ${cur} ${unit}`;
    if (!this.isPackageBilling()) {
      return ratePart;
    }
    const bal = this.formatBalanceAmount(this.balanceLessons());
    const balUnit = this.rateUnit() === 'lesson' ? this.t.lessonsShort : this.t.hoursShort;
    return `${ratePart} · ${bal} ${balUnit}`;
  }

  protected readonly isBlockingTelegramDeliveryError = isBlockingTelegramDeliveryError;

  private linkCopiedTimer: ReturnType<typeof setTimeout> | null = null;
  private formInvitePollTimer: ReturnType<typeof setInterval> | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private sectionObserver: IntersectionObserver | null = null;
  private sectionScrollCleanup: (() => void) | null = null;
  private routeSub: { unsubscribe(): void } | null = null;

  get t() {
    return this.i18n.studentsUi();
  }

  lp(path: string): string {
    return this.localeRouter.path(path);
  }

  ngOnInit(): void {
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

    this.routeSub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id')?.trim();
      if (!id) {
        this.loadError.set('Not found');
        this.loading.set(false);
        return;
      }
      this.loadStudent(id);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.stopFormInvitePolling();
    this.teardownSectionObserver();
    if (this.linkCopiedTimer) {
      clearTimeout(this.linkCopiedTimer);
    }
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  private loadStudent(id: string): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.paymentHistory.set([]);
    this.stopFormInvitePolling();
    this.svc.getOne(id).subscribe({
      next: (s) => {
        this.fillForm(s);
        this.loading.set(false);
        this.loadPaymentHistory(s);
        afterNextRender(() => this.setupSectionObserver(), { injector: this.injector });
      },
      error: (err) => {
        this.loading.set(false);
        this.loadError.set(this.apiErrorMessage(err) || 'Not found');
      },
    });
  }

  private loadPaymentHistory(student: Student): void {
    this.paymentHistoryLoading.set(true);
    this.activityLogSvc.getLogs('students', 200).subscribe({
      next: (entries) => {
        this.paymentHistory.set(
          buildStudentPaymentHistory(
            entries,
            student._id,
            student.last_topup,
            this.i18n.localeId(),
          ),
        );
        this.paymentHistoryLoading.set(false);
      },
      error: () => {
        this.paymentHistory.set(
          buildStudentPaymentHistory([], student._id, student.last_topup, this.i18n.localeId()),
        );
        this.paymentHistoryLoading.set(false);
      },
    });
  }

  private fillForm(s: Student): void {
    this.formSubmitted.set(false);
    this.formError.set(null);
    this.linkCopied.set(false);
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
    this.student.set(s);
    if (!this.isTelegramLinked(s) && this.hasTelegramPlan()) {
      this.ensureFormInviteLink(s);
    } else {
      this.stopFormInvitePolling();
      this.formInviteLoading.set(false);
      this.formInviteError.set(null);
    }
  }

  setBillingType(type: StudentBillingType): void {
    this.billingType.set(type);
  }

  setRateUnit(unit: StudentRateUnit): void {
    this.rateUnit.set(unit);
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

  billingHelpText(): string {
    const t = this.t;
    return `${t.billingInfoPackage}\n\n${t.billingInfoPostpaid}`;
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

  currencySelectOptions(): AppSelectOption[] {
    return RATE_CURRENCIES.map((c) => ({
      value: c,
      label: this.i18n.currencyLabel(c),
    }));
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

  save(): void {
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
    this.persistStudentForm({ omitBalance: false });
  }

  needsBalanceChangeConfirmation(): boolean {
    const target = this.student();
    if (!target || !this.isPackageBilling()) {
      return false;
    }
    const unit = this.rateUnit();
    const from = this.normalizeBalanceAmount(Number(target.balance_lessons) || 0, unit);
    const to = this.normalizeBalanceAmount(this.balanceLessons(), unit);
    return from !== to;
  }

  balanceChangePreview(): { from: number; to: number; unitLabel: string } | null {
    const target = this.student();
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
    const target = this.student();
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
          this.student.set(updated);
          if (!updated.telegram_notified) {
            this.showToast(this.t.tgNotifySkipped);
          }
          this.persistStudentForm({ omitBalance: true });
        },
        error: (err) => {
          this.balanceChangeSaving.set(false);
          this.formError.set(this.apiErrorMessage(err));
        },
      });
  }

  private persistStudentForm(opts: { omitBalance?: boolean }): void {
    const target = this.student();
    if (!target) {
      return;
    }
    const payload = this.studentFormPayload({ omitBalance: opts.omitBalance });
    const rateSnapshotChanged =
      resolveRateUnit(target.rate_unit) !== this.rateUnit() ||
      Number(target.rate_per_hour) !== Number(this.form.rate_per_hour) ||
      String(target.rate_currency) !== String(this.form.rate_currency);

    this.formError.set(null);
    this.resyncMessage.set(null);
    this.savingForm.set(true);

    this.svc.update(target._id, payload).subscribe({
      next: (updated) => {
        this.savingForm.set(false);
        this.fillForm(updated);
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
        this.resyncMessage.set(this.t.resyncLessonsDone.replace('{count}', String(updated)));
      },
      error: (err) => {
        this.resyncingLessons.set(false);
        this.resyncMessage.set(this.apiErrorMessage(err) || this.t.resyncLessonsError);
      },
    });
  }

  isTelegramLinked(student?: Student | null): boolean {
    const target = student ?? this.student();
    return Boolean(target?.telegram_user_id || target?.telegram_chat_id);
  }

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

  connectTelegramFromForm(): void {
    if (!this.hasTelegramPlan()) {
      this.planGateKind.set('telegram');
      return;
    }
    const target = this.student();
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
    const target = student ?? this.student();
    const username = target?.telegram_username?.replace(/^@/, '').trim();
    if (!username || typeof window === 'undefined') {
      return;
    }
    window.open(`https://t.me/${username}`, '_blank', 'noopener,noreferrer');
  }

  requestTelegramDisconnect(student?: Student | null): void {
    const target = student ?? this.student();
    if (!target || !this.isTelegramLinked(target)) {
      return;
    }
    this.disconnectConfirm.set(target);
  }

  cancelTelegramDisconnect(): void {
    this.disconnectConfirm.set(null);
  }

  confirmTelegramDisconnect(): void {
    const s = this.disconnectConfirm();
    if (!s) {
      return;
    }
    this.disconnectConfirm.set(null);
    this.svc.disconnectTelegram(s._id).subscribe({
      next: (updated) => {
        this.fillForm(updated);
      },
      error: (err) => this.showToast(this.apiErrorMessage(err)),
    });
  }

  applyMeetingPreset(kind: 'meet' | 'zoom'): void {
    this.form.meeting_link = kind === 'meet' ? 'https://meet.google.com/' : 'https://zoom.us/j/';
  }

  meetingPresetActive(kind: 'meet' | 'zoom'): boolean {
    const link = (this.form.meeting_link || '').toLowerCase();
    return kind === 'meet' ? link.includes('meet.google.com') : link.includes('zoom.');
  }

  openDeleteConfirm(id: string): void {
    this.archiveTargetId.set(null);
    this.deleteTargetId.set(id);
  }

  openArchiveConfirm(id: string): void {
    this.deleteTargetId.set(null);
    this.archiveTargetId.set(id);
  }

  cancelArchive(): void {
    this.archiveTargetId.set(null);
  }

  cancelDelete(): void {
    this.deleteTargetId.set(null);
  }

  archiveConfirmMessage(): string {
    const name = toTitleCaseName(this.student()?.name) || '—';
    return this.t.archiveConfirm.replace('{name}', name);
  }

  deleteConfirmMessage(): string {
    const name = toTitleCaseName(this.student()?.name) || '—';
    return this.t.deleteConfirm.replace('{name}', name);
  }

  confirmArchive(): void {
    const id = this.archiveTargetId();
    if (!id) {
      return;
    }
    this.svc.archive(id).subscribe({
      next: () => {
        this.archiveTargetId.set(null);
        void this.localeRouter.navigate('/app/students');
      },
      error: (err) => this.showToast(this.apiErrorMessage(err)),
    });
  }

  confirmDelete(): void {
    const id = this.deleteTargetId();
    if (!id) {
      return;
    }
    this.svc.remove(id).subscribe({
      next: () => {
        this.deleteTargetId.set(null);
        void this.localeRouter.navigate('/app/students');
      },
      error: (err) => this.showToast(this.apiErrorMessage(err)),
    });
  }

  closePlanGate(): void {
    this.planGateKind.set(null);
  }

  goToPricingFromGate(): void {
    this.planGateKind.set(null);
    void this.localeRouter.navigate('/app/pricing');
  }

  scrollToSection(id: SectionId, event?: Event): void {
    event?.preventDefault();
    this.activeSection.set(id);
    this.scrollActiveAnchorIntoView(id);
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const body = this.host.nativeElement.querySelector(
      '.student-edit__body',
    ) as HTMLElement | null;
    const el = document.getElementById(id);
    if (!body || !el) {
      return;
    }
    const top = body.scrollTop + (el.getBoundingClientRect().top - body.getBoundingClientRect().top);
    body.scrollTo({ top: Math.max(0, top - 8), behavior: 'smooth' });
    try {
      // Keep locale + student path; only update the fragment.
      const next = `${window.location.pathname}${window.location.search}#${id}`;
      history.replaceState(null, '', next);
    } catch {
      /* ignore */
    }
  }

  /** Keep the active tab visible in the horizontal anchors strip (mobile). */
  private scrollActiveAnchorIntoView(id: SectionId): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const nav = this.anchorsNav?.nativeElement;
    if (!nav) {
      return;
    }
    const btn = nav.querySelector(
      `[data-section="${id}"]`,
    ) as HTMLElement | null;
    if (!btn) {
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const btnCenter = btnRect.left + btnRect.width / 2;
    const navCenter = navRect.left + navRect.width / 2;
    const delta = btnCenter - navCenter;
    if (Math.abs(delta) < 8) {
      return;
    }
    nav.scrollBy({ left: delta, behavior: 'smooth' });
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

  private balanceUnitLabel(student: Student | null | undefined): string {
    return resolveRateUnit(student?.rate_unit) === 'lesson' ? this.t.lessonsShort : this.t.hoursShort;
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
      const max = Number(body?.max_students) || 3;
      return this.i18n.sharedUi().planStudentLimitBody.replace('{max}', String(max));
    }
    if (code === 'PLAN_TELEGRAM_REQUIRED') {
      return this.i18n.sharedUi().planTelegramRequiredBody;
    }
    const message = body?.message ? String(body.message) : '';
    return message || 'Ошибка сохранения';
  }

  private ensureFormInviteLink(s: Student): void {
    if (this.isTelegramLinked(s)) {
      this.stopFormInvitePolling();
      return;
    }
    this.form.bot_active = true;
    this.startFormInvitePolling(s._id);
    if (s.telegram_deep_link) {
      this.formInviteLoading.set(false);
      this.formInviteError.set(null);
      return;
    }
    this.formInviteLoading.set(true);
    this.formInviteError.set(null);
    this.svc.update(s._id, { bot_active: true }).subscribe({
      next: (updated) => {
        this.formInviteLoading.set(false);
        if (this.student()?._id === updated._id) {
          this.student.set(updated);
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
          if (this.student()?._id === updated._id) {
            this.student.set(updated);
          }
          if (updated.telegram_user_id || updated.telegram_chat_id) {
            this.stopFormInvitePolling();
            this.formInviteLoading.set(false);
            this.formInviteError.set(null);
            this.fillForm(updated);
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

  private setupSectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.teardownSectionObserver();
    const body = this.host.nativeElement.querySelector(
      '.student-edit__body',
    ) as HTMLElement | null;
    if (!body) {
      return;
    }
    const ids: SectionId[] = [
      'se-main',
      'se-billing',
      'se-telegram',
      'se-meeting',
      'se-danger',
    ];
    const onScroll = (): void => {
      const marker = body.scrollTop + 24;
      let current: SectionId = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) {
          continue;
        }
        const top =
          body.scrollTop + (el.getBoundingClientRect().top - body.getBoundingClientRect().top);
        if (top <= marker) {
          current = id;
        }
      }
      // Near bottom: pin last section so danger zone can activate fully.
      if (body.scrollTop + body.clientHeight >= body.scrollHeight - 32) {
        current = ids[ids.length - 1];
      }
      if (this.activeSection() !== current) {
        this.activeSection.set(current);
        this.scrollActiveAnchorIntoView(current);
      }
    };
    body.addEventListener('scroll', onScroll, { passive: true });
    this.sectionScrollCleanup = () => body.removeEventListener('scroll', onScroll);
    onScroll();
  }

  private teardownSectionObserver(): void {
    this.sectionScrollCleanup?.();
    this.sectionScrollCleanup = null;
    this.sectionObserver?.disconnect();
    this.sectionObserver = null;
  }
}
