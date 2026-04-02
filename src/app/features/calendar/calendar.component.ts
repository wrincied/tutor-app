import {
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import flatpickr from 'flatpickr';
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import { LessonService } from '../../core/services/lesson.service';
import { StudentService, type Student } from '../../core/services/student.service';
import type { Lesson, LessonStatus } from '@interfaces';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FormsModule, DatePipe, CurrencyPipe, NgClass],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {
  private lessonsSvc = inject(LessonService);
  private studentSvc = inject(StudentService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  @ViewChild('lessonDateInput', { read: ElementRef }) lessonDateInput?: ElementRef<HTMLInputElement>;

  private fp: FlatpickrInstance | null = null;

  lessons = signal<Lesson[]>([]);
  students = signal<Student[]>([]);
  loadError: string | null = null;
  hasLoaded = signal(false);

  /** Якорь полосы: начало «сегодня» (локально), фиксируется при создании компонента. */
  private readonly stripStart = signal<Date>(this.startOfLocalDay(new Date()));

  selectedDate = signal<Date>(this.startOfLocalDay(new Date()));

  /** 14 дней, начиная с `stripStart`. */
  calendarDays = computed(() => {
    const start = this.stripStart();
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  });

  /** Уроки выбранного календарного дня (по локальной дате `scheduledAt`). */
  lessonsForSelectedDate = computed(() => {
    const sel = this.startOfLocalDay(this.selectedDate());
    const next = new Date(sel);
    next.setDate(next.getDate() + 1);
    return this.lessons()
      .filter((l) => {
        if (!l.scheduledAt) {
          return false;
        }
        const t = new Date(l.scheduledAt);
        return t >= sel && t < next;
      })
      .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime());
  });

  /** ISO 4217 по `student_id` — пересчитывается только при изменении `students()`. */
  private readonly studentCurrencyById = computed(() => {
    const m = new Map<string, string>();
    for (const s of this.students()) {
      m.set(s._id, s.rate_currency ?? 'RUB');
    }
    return m;
  });

  showLessonForm = signal(false);
  editLessonTarget = signal<Lesson | null>(null);
  studentsLoadError: string | null = null;
  savingLesson = signal(false);
  deletingLesson = signal(false);
  saveLessonError: string | null = null;

  form = {
    student_id: '',
    lesson_price: 0,
    title: '',
    status: 'scheduled' as LessonStatus,
    notes: '',
    scheduledAt: '',
  };

  /** Длительность урока в минутах (форма). */
  duration = signal(60);
  /** Режим выбора: пресет или своё значение. */
  durationChipMode = signal<'preset' | 'custom'>('preset');
  readonly durationPresets: readonly number[] = [30, 45, 60, 90];

  readonly statusOptions: LessonStatus[] = ['scheduled', 'completed', 'cancelled'];

  private readonly weekdayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

  ngOnInit(): void {
    this.loadLessons();
    this.studentSvc.getAll().subscribe({
      next: (list) => this.students.set(list),
      error: () => {
        /* optional */
      },
    });
  }

  startOfLocalDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  isSameLocalDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  formatWeekdayShort(d: Date): string {
    return this.weekdayFmt.format(d);
  }

  formatDayOfMonth(d: Date): number {
    return d.getDate();
  }

  /** Заголовок agenda, напр. «Wed 8». */
  formatAgendaDayHeading(d: Date): string {
    return `${this.weekdayFmt.format(d)} ${d.getDate()}`;
  }

  selectDay(day: Date): void {
    this.selectedDate.set(this.startOfLocalDay(new Date(day.getTime())));
  }

  hasLessonsOnDay(day: Date): boolean {
    const start = this.startOfLocalDay(day);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return this.lessons().some((l) => {
      if (!l.scheduledAt) {
        return false;
      }
      const t = new Date(l.scheduledAt);
      return t >= start && t < end;
    });
  }

  getStudentName(studentId: string | null | undefined): string {
    if (!studentId) {
      return '(без ученика)';
    }
    const s = this.students().find((x) => x._id === studentId);
    return s?.name ?? '(без ученика)';
  }

  /** Код валюты для CurrencyPipe (профиль ученика или RUB). */
  getStudentCurrency(studentId: string | null | undefined): string {
    if (!studentId) {
      return 'RUB';
    }
    return this.studentCurrencyById().get(studentId) ?? 'RUB';
  }

  /** Интервал урока по `scheduledAt` и сохранённой `lesson_duration` (мин), по умолчанию 60. */
  getLessonSlot(lesson: Lesson): { start: Date; end: Date } | null {
    if (!lesson.scheduledAt) {
      return null;
    }
    const start = new Date(lesson.scheduledAt);
    if (Number.isNaN(start.getTime())) {
      return null;
    }
    const mins = lesson.lesson_duration ?? 60;
    return { start, end: new Date(start.getTime() + mins * 60 * 1000) };
  }

  formatDurationPresetLabel(minutes: number): string {
    if (minutes === 60) {
      return '1ч';
    }
    if (minutes === 90) {
      return '1.5ч';
    }
    return `${minutes}м`;
  }

  selectDurationPreset(minutes: number): void {
    this.duration.set(minutes);
    this.durationChipMode.set('preset');
  }

  selectDurationCustom(): void {
    this.durationChipMode.set('custom');
  }

  onCustomDurationInput(value: string | number): void {
    const n = Math.round(Number(value));
    this.duration.set(Math.min(480, Math.max(5, Number.isNaN(n) ? 60 : n)));
  }

  /** Текст вида «14:00 — 14:45» для превью в форме. */
  getSchedulePreviewText(): string | null {
    const raw = this.form.scheduledAt?.trim();
    if (!raw) {
      return null;
    }
    const start = new Date(raw);
    if (Number.isNaN(start.getTime())) {
      return null;
    }
    const end = new Date(start.getTime() + this.duration() * 60 * 1000);
    const fmt = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${fmt.format(start)} — ${fmt.format(end)}`;
  }

  private clampedDurationMinutes(): number {
    const n = Math.round(Number(this.duration()));
    if (Number.isNaN(n) || n < 5) {
      return 60;
    }
    return Math.min(480, n);
  }

  private destroyLessonFlatpickr(): void {
    this.fp?.destroy();
    this.fp = null;
  }

  private initLessonFlatpickr(): void {
    this.destroyLessonFlatpickr();
    const el = this.lessonDateInput?.nativeElement;
    if (!el) {
      return;
    }

    const existing = this.form.scheduledAt?.trim();
    const parsed = existing ? new Date(existing) : null;
    const defaultDate =
      parsed && !Number.isNaN(parsed.getTime()) ? parsed : undefined;

    this.fp = flatpickr(el, {
      enableTime: true,
      time_24hr: true,
      dateFormat: 'Y-m-d H:i',
      defaultDate,
      appendTo: document.body,
      onChange: (dates) => {
        const d = dates[0];
        this.ngZone.run(() => {
          if (d) {
            this.form.scheduledAt = d.toISOString();
          }
          this.cdr.markForCheck();
        });
      },
    });
  }

  private scheduleLessonFlatpickrInit(): void {
    this.cdr.markForCheck();
    setTimeout(() => {
      this.initLessonFlatpickr();
      this.cdr.markForCheck();
    }, 0);
  }

  /**
   * Время урока в часовом поясе ученика, подпись вида «14:00 Berlin».
   */
  getStudentLocalTimeLabel(lesson: Lesson): string | null {
    if (!lesson.scheduledAt || !lesson.student_id) {
      return null;
    }
    const st = this.students().find((s) => s._id === lesson.student_id);
    const tz = st?.timezone?.trim();
    if (!tz) {
      return null;
    }
    const d = new Date(lesson.scheduledAt);
    if (Number.isNaN(d.getTime())) {
      return null;
    }
    try {
      const fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const time = fmt.format(d);
      const city = tz.split('/').pop()?.replace(/_/g, ' ') ?? tz;
      return `${time} ${city}`;
    } catch {
      return null;
    }
  }

  lessonCardClass(lesson: Lesson): Record<string, boolean> {
    const base = {
      'flex items-center gap-4 p-4 mb-3 rounded-2xl border transition-all hover:shadow-md cursor-pointer w-full text-left': true,
    };
    if (lesson.status === 'scheduled') {
      return { ...base, 'bg-sky-50 border-sky-100': true };
    }
    if (lesson.status === 'completed') {
      return { ...base, 'bg-gray-50 border-gray-100 grayscale-[0.5]': true };
    }
    if (lesson.status === 'cancelled') {
      return { ...base, 'bg-red-50 border-red-100': true };
    }
    return { ...base, 'bg-white border-gray-100': true };
  }

  statusBadgeClass(status: LessonStatus): string {
    const shell = 'px-2 py-0.5 rounded-full text-[10px] uppercase font-bold';
    if (status === 'completed') {
      return `${shell} bg-gray-200 text-gray-700`;
    }
    if (status === 'scheduled') {
      return `${shell} bg-sky-200 text-sky-800`;
    }
    return `${shell} bg-red-200 text-red-800`;
  }

  private loadLessons(): void {
    this.lessonsSvc.getAll().subscribe({
      next: (data) => {
        this.lessons.set(data);
        this.loadError = null;
        this.hasLoaded.set(true);
      },
      error: (err) => {
        this.loadError = err?.error?.message ?? err?.message ?? 'Не удалось загрузить уроки';
        this.hasLoaded.set(true);
      },
    });
  }

  openLessonForm(): void {
    this.editLessonTarget.set(null);
    this.resetLessonForm();
    this.saveLessonError = null;
    this.studentsLoadError = null;
    this.showLessonForm.set(true);
    this.ensureStudentsLoaded();
    this.scheduleLessonFlatpickrInit();
  }

  openEditLesson(lesson: Lesson): void {
    this.editLessonTarget.set(lesson);
    this.saveLessonError = null;
    this.studentsLoadError = null;
    this.ensureStudentsLoaded();
    const mins = lesson.lesson_duration ?? 60;
    this.duration.set(mins);
    this.durationChipMode.set(this.durationPresets.includes(mins) ? 'preset' : 'custom');
    this.form = {
      student_id: lesson.student_id || '',
      lesson_price: lesson.lesson_price,
      title: lesson.title || '',
      status: lesson.status,
      notes: lesson.notes || '',
      scheduledAt: lesson.scheduledAt || '',
    };
    this.showLessonForm.set(true);
    this.scheduleLessonFlatpickrInit();
  }

  private ensureStudentsLoaded(): void {
    if (this.students().length > 0) {
      return;
    }
    this.studentSvc.getAll().subscribe({
      next: (list) => this.students.set(list),
      error: (err) => {
        this.studentsLoadError =
          err?.error?.message ?? err?.message ?? 'Не удалось загрузить учеников';
      },
    });
  }

  closeLessonForm(): void {
    this.destroyLessonFlatpickr();
    this.showLessonForm.set(false);
    this.editLessonTarget.set(null);
    this.deletingLesson.set(false);
  }

  private resetLessonForm(): void {
    this.duration.set(60);
    this.durationChipMode.set('preset');
    this.form = {
      student_id: '',
      lesson_price: 0,
      title: '',
      status: 'scheduled',
      notes: '',
      scheduledAt: '',
    };
  }

  onStudentSelectChange(ev: Event): void {
    const el = ev.target as HTMLSelectElement;
    const selectedId = el.value;
    this.form.student_id = selectedId;
    const selectedStudent = this.students().find((s) => s._id === selectedId);
    if (selectedStudent) {
      this.form.lesson_price = selectedStudent.rate_per_hour;
    }
  }

  saveLesson(): void {
    this.saveLessonError = null;
    this.savingLesson.set(true);
    const payload = {
      student_id: this.form.student_id ? this.form.student_id : null,
      lesson_price: Number(this.form.lesson_price),
      lesson_duration: this.clampedDurationMinutes(),
      status: this.form.status,
      title: this.form.title?.trim() || undefined,
      notes: this.form.notes?.trim() || undefined,
      scheduledAt: this.form.scheduledAt?.trim() || null,
    };

    const editing = this.editLessonTarget();

    if (editing) {
      this.lessonsSvc.update(editing._id, payload).subscribe({
        next: (updated) => {
          this.lessons.update((list) => list.map((l) => (l._id === updated._id ? updated : l)));
          this.savingLesson.set(false);
          this.closeLessonForm();
        },
        error: (err) => {
          this.savingLesson.set(false);
          this.saveLessonError = err?.error?.message ?? err?.message ?? 'Не удалось сохранить урок';
        },
      });
      return;
    }

    this.lessonsSvc.create(payload).subscribe({
      next: (created) => {
        this.lessons.update((list) => [created, ...list]);
        this.savingLesson.set(false);
        this.closeLessonForm();
      },
      error: (err) => {
        this.savingLesson.set(false);
        this.saveLessonError = err?.error?.message ?? err?.message ?? 'Не удалось сохранить урок';
      },
    });
  }

  deleteLesson(): void {
    const id = this.editLessonTarget()?._id;
    if (!id) {
      return;
    }
    if (!window.confirm('Вы уверены, что хотите удалить этот урок?')) {
      return;
    }
    this.saveLessonError = null;
    this.deletingLesson.set(true);
    this.lessonsSvc.delete(id).subscribe({
      next: () => {
        this.lessons.update((list) => list.filter((l) => l._id !== id));
        this.deletingLesson.set(false);
        this.closeLessonForm();
      },
      error: (err) => {
        this.deletingLesson.set(false);
        this.saveLessonError = err?.error?.message ?? err?.message ?? 'Не удалось удалить урок';
      },
    });
  }
}
