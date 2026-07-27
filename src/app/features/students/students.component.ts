import { Component, computed, inject, signal, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { StudentService, Student } from '../../core/services/student.service';
import { BotUnlinkAlertService } from '../../core/services/bot-unlink-alert.service';
import { I18nService } from '../../core/services/i18n.service';
import { RATE_CURRENCIES, type RateCurrency, type StudentBillingType, type StudentRateUnit } from '@interfaces';
import {
  colorToHexForPicker,
  DEFAULT_STUDENT_BORDER_COLOR,
  generatePastelColor,
  hexToStoredColor,
} from '../../core/utils/pastel-color';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';
import { HelpTipComponent } from '../../shared/help-tip/help-tip.component';

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
  imports: [FormsModule, AppDialogComponent, AppSelectComponent, HelpTipComponent],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent implements OnInit {
  private svc = inject(StudentService);
  private unlinkAlerts = inject(BotUnlinkAlertService);
  @ViewChild('studentForm') studentFormRef?: NgForm;
  students = signal<Student[]>([]);
  loading = signal(true);
  showForm = signal(false);
  editTarget = signal<Student | null>(null);
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
  topupLessonsInput = 1;
  quickActionsStudent = signal<Student | null>(null);
  botToggleConfirm = signal<{ student: Student; nextActive: boolean } | null>(null);
  disconnectConfirm = signal<Student | null>(null);
  inviteDialogStudent = signal<Student | null>(null);
  inviteDialogLoading = signal(false);
  inviteDialogError = signal<string | null>(null);
  formSubmitted = signal(false);
  savingForm = signal(false);
  linkCopied = signal(false);
  formError = signal<string | null>(null);
  readonly colorToHexForPicker = colorToHexForPicker;
  readonly inviteDialogLink = computed(() => this.inviteDialogStudent()?.telegram_deep_link ?? '');

  private linkCopiedTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.load();
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
      },
      error: () => {
        this.loading.set(false);
      },
    });
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
    const value = Number(student.balance_lessons) || 0;
    const pretty = Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
    return `${pretty} ${this.balanceUnitLabel(student)}`;
  }

  topupHintLabel(): string {
    const id = this.topupTargetId();
    const student = this.students().find((item) => item._id === id);
    return resolveRateUnit(student?.rate_unit) === 'hour' ? this.t.topupHintHours : this.t.topupHint;
  }

  topupStep(): number {
    const id = this.topupTargetId();
    const student = this.students().find((item) => item._id === id);
    return resolveRateUnit(student?.rate_unit) === 'hour' ? 0.5 : 1;
  }

  balanceFieldLabel(): string {
    return this.rateUnit() === 'hour' ? this.t.balanceHoursField : this.t.balanceLessonsField;
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
    this.balanceLessons.set(Number(s.balance_lessons) || 0);
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
    if (opts.inviteAfter || opts.openInviteDialog) {
      payload.bot_active = true;
    }
    this.formError.set(null);
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
      },
      error: (err) => {
        this.savingForm.set(false);
        this.formError.set(this.apiErrorMessage(err));
      },
    });
  }

  isTelegramLinked(student?: Student | null): boolean {
    return Boolean((student ?? this.editTarget())?.telegram_user_id);
  }

  canInviteToBot(student?: Student | null): boolean {
    if (student) {
      return !student.telegram_user_id;
    }
    return !this.editTarget()?.telegram_user_id;
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
    if (student.telegram_user_id) {
      return;
    }
    this.inviteDialogError.set(null);
    this.linkCopied.set(false);
    this.inviteDialogStudent.set(student);
    if (!student.telegram_deep_link) {
      this.loadInviteLink(student);
    }
  }

  closeInviteDialog(): void {
    this.inviteDialogStudent.set(null);
    this.inviteDialogLoading.set(false);
    this.inviteDialogError.set(null);
    this.linkCopied.set(false);
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
    if (student.telegram_user_id) {
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
    this.topupLessonsInput = 1;
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

  applyTopup() {
    const id = this.topupTargetId();
    const student = this.students().find((item) => item._id === id);
    const raw = Number(this.topupLessonsInput);
    const n =
      resolveRateUnit(student?.rate_unit) === 'hour'
        ? Math.round(raw * 100) / 100
        : Math.floor(raw);
    if (!id || !(n > 0)) {
      return;
    }
    this.svc.topup(id, n).subscribe(() => {
      this.closeTopup();
      this.load();
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
    if (!student.telegram_user_id) {
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
    if (!student?.telegram_user_id) {
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
    const target = student ?? this.editTarget() ?? this.quickActionsStudent();
    if (!target?.telegram_user_id) {
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
        this.closeQuickActions();
      },
    });
  }
}
