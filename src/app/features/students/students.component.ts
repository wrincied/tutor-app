import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentService, Student } from '../../core/services/student.service';
import { I18nService } from '../../core/services/i18n.service';
import { RATE_CURRENCIES, type RateCurrency } from '@interfaces';
import {
  colorToHexForPicker,
  generatePastelColor,
  hexToStoredColor,
} from '../../core/utils/pastel-color';

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

function resolvedBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

@Component({
  selector: 'app-students',
  imports: [FormsModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent implements OnInit {
  private svc = inject(StudentService);
  lessons = signal<any[]>([]);
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
  };

  readonly rateCurrencies = RATE_CURRENCIES;
  /** Галочка: подставлять часовой пояс с устройства; иначе — выбор из списка. */
  autoTimezone = true;

  deleteTargetId = signal<string | null>(null);
  topupTargetId = signal<string | null>(null);
  topupLessonsInput = 1;

  ngOnInit() {
    this.load();
  }

  get t() {
    return this.i18n.studentsUi();
  }

  /** Для старых записей без валюты в API. */
  rateCurrencyOf(s: Student): RateCurrency {
    return s.rate_currency ?? 'EUR';
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

  /** Для шаблона таблицы. */
  readonly colorToHexForPicker = colorToHexForPicker;

  onTableColorChange(student: Student, event: Event): void {
    event.stopPropagation();
    const hex = (event.target as HTMLInputElement).value;
    const color_hex = hexToStoredColor(hex);
    this.svc.update(student._id, { color_hex }).subscribe({
      next: (updated) => {
        this.students.update((list) =>
          list.map((item) => (item._id === updated._id ? updated : item)),
        );
      },
    });
  }

  load() {
    this.svc.getAll().subscribe({
      next: (data) => {
        // #region agent log
        const first = data?.[0];
        fetch('http://127.0.0.1:7583/ingest/072b4f1f-4783-44ce-80c4-c83ee8d97b1e', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0d9b15' },
          body: JSON.stringify({
            sessionId: '0d9b15',
            runId: 'pre-fix',
            hypothesisId: 'H_API',
            location: 'students.component.ts:load',
            message: 'students GET ok',
            data: {
              count: data?.length,
              firstKeys: first ? Object.keys(first) : [],
              firstRateCurrency: first?.rate_currency,
              firstRate: first?.rate_per_hour,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        this.students.set(data);
        this.loading.set(false);
      },
      error: () => {
        // #region agent log
        fetch('http://127.0.0.1:7583/ingest/072b4f1f-4783-44ce-80c4-c83ee8d97b1e', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0d9b15' },
          body: JSON.stringify({
            sessionId: '0d9b15',
            runId: 'pre-fix',
            hypothesisId: 'H_ERR',
            location: 'students.component.ts:load',
            message: 'students GET error',
            data: {},
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        this.loading.set(false);
      },
    });
  }

  openCreate() {
    this.autoTimezone = true;
    this.form = {
      name: '',
      rate_per_hour: 0,
      rate_currency: 'EUR',
      timezone: resolvedBrowserTimezone(),
      color_hex: generatePastelColor(),
    };
    this.editTarget.set(null);
    this.showForm.set(true);
  }

  openEdit(s: Student) {
    this.autoTimezone = false;
    this.form = {
      name: s.name,
      rate_per_hour: s.rate_per_hour,
      rate_currency: s.rate_currency ?? 'EUR',
      timezone: s.timezone || 'UTC',
      color_hex: s.color_hex || generatePastelColor(),
    };
    this.editTarget.set(s);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }

  onAutoTimezoneChange(checked: boolean) {
    this.autoTimezone = checked;
    if (checked) {
      this.form.timezone = resolvedBrowserTimezone();
    } else {
      if (!TIMEZONE_PRESETS.includes(this.form.timezone)) {
        this.form.timezone = 'Europe/Moscow';
      }
    }
  }

  /** Список зон для select: текущее значение + пресеты (ученик в другой стране). */
  timezoneSelectOptions(): string[] {
    const tz = this.form.timezone;
    if (tz && !TIMEZONE_PRESETS.includes(tz)) {
      return [tz, ...TIMEZONE_PRESETS];
    }
    return [...TIMEZONE_PRESETS];
  }

  save() {
    const target = this.editTarget();
    // #region agent log
    fetch('http://127.0.0.1:7583/ingest/072b4f1f-4783-44ce-80c4-c83ee8d97b1e', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0d9b15' },
      body: JSON.stringify({
        sessionId: '0d9b15',
        runId: 'pre-fix',
        hypothesisId: 'H_FORM',
        location: 'students.component.ts:save',
        message: 'save payload',
        data: {
          edit: !!target,
          rate_per_hour: this.form.rate_per_hour,
          rate_currency: this.form.rate_currency,
          timezoneLen: this.form.timezone?.length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    if (target) {
      this.svc.update(target._id, this.form).subscribe(() => {
        this.closeForm();
        this.load();
      });
    } else {
      this.svc.create(this.form).subscribe(() => {
        this.closeForm();
        this.load();
      });
    }
  }

  openDeleteConfirm(id: string) {
    this.deleteTargetId.set(id);
  }

  cancelDelete() {
    this.deleteTargetId.set(null);
  }

  confirmDelete() {
    const id = this.deleteTargetId();
    if (!id) return;
    this.svc.remove(id).subscribe(() => {
      this.deleteTargetId.set(null);
      this.load();
    });
  }

  openTopup(id: string) {
    this.topupLessonsInput = 1;
    this.topupTargetId.set(id);
  }

  closeTopup() {
    this.topupTargetId.set(null);
  }

  applyTopup() {
    const id = this.topupTargetId();
    const n = Math.floor(Number(this.topupLessonsInput));
    if (!id || n < 1) return;
    this.svc.topup(id, n).subscribe(() => {
      this.closeTopup();
      this.load();
    });
  }
}
