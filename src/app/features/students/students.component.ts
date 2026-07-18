import { Component, computed, inject, signal, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { StudentService, Student } from '../../core/services/student.service';
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

/** IANA: репетитор в AT, ученики в KZ/BY/RU и др. */
const TIMEZONE_PRESETS: string[] = [
  'Europe/Vienna',
  'Europe/Berlin',
  'Europe/Warsaw',
  'Europe/Moscow',
  'Europe/Minsk',
  'Europe/Kaliningrad',
  'Asia/Almaty',
  'Asia/Aqtobe',
  'Asia/Qyzylorda',
  'Asia/Atyrau',
  'Asia/Oral',
  'UTC',
];

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

function resolvedBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

@Component({
  selector: 'app-students',
  imports: [FormsModule, AppDialogComponent, AppSelectComponent, HelpTipComponent],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent implements OnInit {
  private svc = inject(StudentService);
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
    timezone: resolvedBrowserTimezone(),
    color_hex: generatePastelColor(),
    bot_active: false,
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
  autoTimezone = true;

  deleteTargetId = signal<string | null>(null);
  topupTargetId = signal<string | null>(null);
  topupLessonsInput = 1;
  quickActionsStudent = signal<Student | null>(null);
  botToggleConfirm = signal<{ student: Student; nextActive: boolean } | null>(null);
  formSubmitted = signal(false);
  savingForm = signal(false);
  readonly colorToHexForPicker = colorToHexForPicker;

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
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private patchStudent(updated: Student): void {
    this.students.update((list) =>
      list.map((item) => (item._id === updated._id ? updated : item)),
    );
    const quick = this.quickActionsStudent();
    if (quick?._id === updated._id) {
      this.quickActionsStudent.set(updated);
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

  openCreate() {
    this.formSubmitted.set(false);
    this.autoTimezone = true;
    this.form = {
      name: '',
      rate_per_hour: 0,
      rate_currency: 'EUR',
      timezone: resolvedBrowserTimezone(),
      color_hex: generatePastelColor(),
      bot_active: false,
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
    this.closeQuickActions();
    this.autoTimezone = false;
    this.form = {
      name: s.name,
      rate_per_hour: s.rate_per_hour,
      rate_currency: s.rate_currency ?? 'EUR',
      timezone: s.timezone || 'UTC',
      color_hex: s.color_hex || generatePastelColor(),
      bot_active: Boolean(s.bot_active),
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
    this.formSubmitted.set(false);
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

  onAutoTimezoneChange(checked: boolean) {
    this.autoTimezone = checked;
    if (checked) {
      this.form.timezone = resolvedBrowserTimezone();
    } else if (!TIMEZONE_PRESETS.includes(this.form.timezone)) {
      this.form.timezone = 'Europe/Moscow';
    }
  }

  currencySelectOptions(): AppSelectOption[] {
    return RATE_CURRENCIES.map((c) => ({
      value: c,
      label: this.i18n.currencyLabel(c),
    }));
  }

  timezoneSelectOptionsList(): AppSelectOption[] {
    const tz = this.form.timezone;
    const zones =
      tz && !TIMEZONE_PRESETS.includes(tz) ? [tz, ...TIMEZONE_PRESETS] : [...TIMEZONE_PRESETS];
    return zones.map((zone) => ({ value: zone, label: zone }));
  }

  save() {
    if (this.savingForm()) {
      return;
    }

    const target = this.editTarget();
    const billing_type = this.billingType();
    const payload: Partial<Student> = {
      name: this.form.name,
      rate_per_hour: this.form.rate_per_hour,
      rate_currency: this.form.rate_currency,
      timezone: this.form.timezone,
      color_hex: this.form.color_hex,
      bot_active: this.form.bot_active,
      billing_type,
      rate_unit: this.rateUnit(),
      ...(billing_type === 'package'
        ? { balance_lessons: this.balanceLessons() }
        : { credit_limit: this.creditLimit() }),
    };

    this.savingForm.set(true);
    const req = target ? this.svc.update(target._id, payload) : this.svc.create(payload);

    req.subscribe({
      next: () => {
        this.savingForm.set(false);
        this.closeForm();
        this.load();
      },
      error: () => {
        this.savingForm.set(false);
      },
    });
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
    const n = Math.floor(Number(this.topupLessonsInput));
    if (!id || n < 1) {
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
    this.botToggleConfirm.set({ student, nextActive: !student.bot_active });
  }

  requestBotToggleFromQuick(): void {
    const student = this.quickActionsStudent();
    if (!student) {
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
}
