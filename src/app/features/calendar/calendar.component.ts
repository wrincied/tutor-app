import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LessonService } from '../../core/services/lesson.service';
import { StudentService, type Student } from '../../core/services/student.service';
import type { Lesson, LessonStatus } from '@interfaces';
import { DEFAULT_STUDENT_BORDER_COLOR } from '../../core/utils/pastel-color';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';

export type CalendarViewMode = '1' | '3' | '7' | '30';

/** Ответ API до нормализации (legacy-поля и статусы). */
type LessonApiRow = Omit<Lesson, 'status'> & {
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, AppDialogComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  private readonly lessonsSvc = inject(LessonService);
  private readonly studentSvc = inject(StudentService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  /** 60px = 1 час; 1px = 1 минута */
  readonly hourHeightPx = 60;
  readonly minuteHeightPx = 1;
  readonly gridHeightPx = 24 * 60;
  readonly hours = Array.from({ length: 24 }, (_, i) => i);
  readonly viewModes: readonly CalendarViewMode[] = ['1', '3', '7', '30'];

  currentDate = signal<Date>(new Date());
  viewMode = signal<CalendarViewMode>('7');
  lessons = signal<Lesson[]>([]);
  students = signal<Student[]>([]);

  loadError: string | null = null;
  hasLoaded = signal(false);
  /** Navbar снизу (как на телефоне), ≤768px */
  isBottomNavLayout = signal(false);
  /** Планшет/телефон: без стрелок навигации, ≤1023px */
  isCompactHeader = signal(false);
  isNarrowViewport = signal(true);
  modesMenuOpen = signal(false);
  studentsSidebarOpen = signal(false);
  studentsSidebarQuery = signal('');
  focusedStudentId = signal<string | null>(null);
  lessonFormStep = signal<1 | 2>(1);
  scheduledAtLocal = signal('');
  /** Id урока, перетаскиваемого через native drag-and-drop. */
  private readonly dragLessonId = signal<string | null>(null);
  /** Live-позиция карточки до drop (обновляется на dragover). */
  private readonly dragPreview = signal<{ lessonId: string; scheduledAt: string } | null>(
    null,
  );
  private dragGhostEl: HTMLElement | null = null;
  private suppressLessonClickUntil = 0;

  showLessonForm = signal(false);
  editLessonTarget = signal<Lesson | null>(null);
  studentsLoadError: string | null = null;
  savingLesson = signal(false);
  deletingLesson = signal(false);
  saveLessonError: string | null = null;
  /** Модалка: слот занят (drag-and-drop или сохранение урока). */
  scheduleConflictMessage = signal<string | null>(null);
  /** Подтверждение переноса перед уведомлением ученика через бота. */
  dragMoveConfirm = signal<{ lesson: Lesson; scheduledAt: string } | null>(null);

  private static readonly SCHEDULE_CONFLICT_MSG =
    'На это время нет свободного слота — уже запланирован другой урок.';

  form = {
    student_id: '',
    status: 'scheduled' as LessonStatus,
    notes: '',
    scheduledAt: '',
  };

  duration = signal(60);
  durationChipMode = signal<'preset' | 'custom'>('preset');
  readonly durationPresets: readonly number[] = [30, 45, 60, 90];
  readonly statusOptions: LessonStatus[] = ['scheduled', 'completed', 'missed', 'canceled'];

  private readonly weekdayFmt = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' });
  private readonly monthYearFmt = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric',
  });
  readonly weekdayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;

  /** Режим «30» — обзор месяца клетками, без почасовой сетки. */
  isMonthOverview = computed(() => this.viewMode() === '30');

  columns = computed(() => {
    const mode = this.viewMode();
    if (mode === '30') {
      return [];
    }

    const anchor = this.startOfLocalDay(this.currentDate());

    if (mode === '7') {
      const monday = this.startOfWeekMonday(anchor);
      return Array.from({ length: 7 }, (_, i) => this.addDays(monday, i));
    }

    const count = Number(mode);
    return Array.from({ length: count }, (_, i) => this.addDays(anchor, i));
  });

  /** Клетки календаря месяца (пн–вс, с хвостами соседних месяцев). */
  monthOverviewCells = computed(() => {
    const ref = this.startOfLocalDay(this.currentDate());
    const year = ref.getFullYear();
    const month = ref.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    let cursor = this.startOfWeekMonday(firstOfMonth);
    const cells: { date: Date; inMonth: boolean }[] = [];

    while (true) {
      cells.push({
        date: new Date(cursor),
        inMonth: cursor.getMonth() === month,
      });
      const weekEnded = cursor.getDay() === 0;
      const passedLastDay = cursor >= lastOfMonth;
      cursor = this.addDays(cursor, 1);
      if (passedLastDay && weekEnded) {
        break;
      }
      if (cells.length >= 42) {
        break;
      }
    }

    return cells;
  });

  /** Число строк в сетке месяца (5 или 6). */
  monthWeekRows = computed(() => Math.ceil(this.monthOverviewCells().length / 7));

  gridTemplateColumns = computed(() => {
    const count = this.columns().length;
    return count > 0 ? `repeat(${count}, minmax(0, 1fr))` : 'none';
  });

  /** Подпись периода в шапке (вместо «Расписание» на узких экранах). */
  periodLabel = computed(() => {
    if (this.viewMode() === '30') {
      return this.formatMonthYearLabel();
    }
    const cols = this.columns();
    if (cols.length === 0) {
      return '';
    }
    if (cols.length === 1) {
      return this.formatColumnHeader(cols[0]);
    }
    const fmt = (d: Date) =>
      d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    return `${fmt(cols[0])} – ${fmt(cols[cols.length - 1])}`;
  });

  private periodSwipeStart: { x: number; y: number } | null = null;
  private readonly periodSwipeMinPx = 48;

  lessonsByDay = computed(() => {
    const map = new Map<string, Lesson[]>();
    const preview = this.dragPreview();
    for (const lesson of this.lessons()) {
      const scheduledAt =
        preview?.lessonId === lesson._id ? preview.scheduledAt : lesson.scheduledAt;
      if (!scheduledAt) {
        continue;
      }
      const key = this.dayKey(new Date(scheduledAt));
      const bucket = map.get(key);
      if (bucket) {
        bucket.push(lesson);
      } else {
        map.set(key, [lesson]);
      }
    }

    for (const bucket of map.values()) {
      bucket.sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );
    }

    return map;
  });

  private readonly studentCurrencyById = computed(() => {
    const m = new Map<string, string>();
    for (const s of this.students()) {
      m.set(s._id, s.rate_currency ?? 'EUR');
    }
    return m;
  });

  filteredStudentsForSidebar = computed(() => {
    const query = this.studentsSidebarQuery().trim().toLowerCase();
    if (!query) {
      return this.students();
    }
    return this.students().filter((student) => student.name.toLowerCase().includes(query));
  });

  ngOnInit(): void {
    this.initViewportMediaQueries();
    this.initScrollLock();
    this.loadLessons();
    this.studentSvc.getAll().subscribe({
      next: (list) => this.students.set(list),
      error: () => {
        /* optional */
      },
    });
  }

  private initScrollLock(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    document.documentElement.classList.add('cal-scroll-lock');
    this.destroyRef.onDestroy(() => {
      document.documentElement.classList.remove('cal-scroll-lock');
    });
  }

  private initViewportMediaQueries(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const bottomNavMq = window.matchMedia('(max-width: 768px)');
    const compactMq = window.matchMedia('(max-width: 1023px)');
    const applyViewport = () => {
      const bottomNav = bottomNavMq.matches;
      const compact = compactMq.matches;
      this.isBottomNavLayout.set(bottomNav);
      this.isCompactHeader.set(compact);
      this.isNarrowViewport.set(compact);
      if (!compact) {
        this.studentsSidebarOpen.set(false);
      }
      if (!bottomNav) {
        this.modesMenuOpen.set(false);
      }
    };
    applyViewport();
    bottomNavMq.addEventListener('change', applyViewport);
    compactMq.addEventListener('change', applyViewport);
    this.destroyRef.onDestroy(() => {
      bottomNavMq.removeEventListener('change', applyViewport);
      compactMq.removeEventListener('change', applyViewport);
    });
  }

  startOfLocalDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  private startOfWeekMonday(d: Date): Date {
    const x = this.startOfLocalDay(d);
    const day = x.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    x.setDate(x.getDate() + diff);
    return x;
  }

  private addDays(d: Date, days: number): Date {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
  }

  dayKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  lessonsForColumn(col: Date): Lesson[] {
    return this.lessonsByDay().get(this.dayKey(col)) ?? [];
  }

  displayScheduledAt(lesson: Lesson): string {
    const preview = this.dragPreview();
    if (preview?.lessonId === lesson._id) {
      return preview.scheduledAt;
    }
    return lesson.scheduledAt;
  }

  calculateTop(scheduledAt: string): number {
    const d = new Date(scheduledAt);
    if (Number.isNaN(d.getTime())) {
      return 0;
    }
    return (d.getHours() * 60 + d.getMinutes()) * this.minuteHeightPx;
  }

  calculateHeight(duration: number): number {
    return Math.max(15, duration * this.minuteHeightPx);
  }

  formatHourLabel(hour: number): string {
    return `${String(hour).padStart(2, '0')}:00`;
  }

  formatColumnHeader(col: Date): string {
    const weekday = this.weekdayFmt.format(col).replace(/\./g, '');
    if (this.isCompactHeader()) {
      const shortDay = weekday.length > 2 ? weekday.slice(0, 2) : weekday;
      return `${shortDay} ${col.getDate()}`;
    }
    return `${weekday} ${col.getDate()}`;
  }

  onPeriodSwipeStart(event: TouchEvent): void {
    if (event.touches.length !== 1) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('.cal-lesson-card') || this.dragLessonId()) {
      return;
    }
    this.periodSwipeStart = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  onPeriodSwipeEnd(event: TouchEvent): void {
    if (!this.periodSwipeStart || event.changedTouches.length !== 1) {
      this.periodSwipeStart = null;
      return;
    }
    const touch = event.changedTouches[0];
    const dx = touch.clientX - this.periodSwipeStart.x;
    const dy = touch.clientY - this.periodSwipeStart.y;
    this.periodSwipeStart = null;

    if (
      Math.abs(dx) < this.periodSwipeMinPx ||
      Math.abs(dx) <= Math.abs(dy)
    ) {
      return;
    }

    if (dx < 0) {
      this.navNext();
    } else {
      this.navPrev();
    }
  }

  isToday(col: Date): boolean {
    return this.dayKey(col) === this.dayKey(new Date());
  }

  formatMonthYearLabel(): string {
    const label = this.monthYearFmt.format(this.currentDate());
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  lessonCountForDay(day: Date): number {
    return this.lessonsByDay().get(this.dayKey(day))?.length ?? 0;
  }

  /** Клик по клетке месяца → дневное расписание выбранной даты. */
  openDayFromMonth(day: Date): void {
    this.currentDate.set(this.startOfLocalDay(day));
    this.viewMode.set('1');
  }

  navPrev(): void {
    const next = new Date(this.currentDate());
    const mode = this.viewMode();
    if (mode === '30') {
      next.setMonth(next.getMonth() - 1);
    } else if (mode === '7') {
      next.setDate(next.getDate() - 7);
    } else {
      next.setDate(next.getDate() - Number(mode));
    }
    this.currentDate.set(next);
  }

  navNext(): void {
    const next = new Date(this.currentDate());
    const mode = this.viewMode();
    if (mode === '30') {
      next.setMonth(next.getMonth() + 1);
    } else if (mode === '7') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + Number(mode));
    }
    this.currentDate.set(next);
  }

  goToToday(): void {
    this.currentDate.set(new Date());
  }

  setViewMode(mode: CalendarViewMode): void {
    this.viewMode.set(mode);
    this.modesMenuOpen.set(false);
  }

  toggleModesMenu(): void {
    this.modesMenuOpen.update((open) => !open);
  }

  viewModeLabel(mode: CalendarViewMode): string {
    const labels: Record<CalendarViewMode, string> = {
      '1': '1 день',
      '3': '3 дня',
      '7': '7 дней',
      '30': 'Месяц',
    };
    return labels[mode];
  }

  openNewLessonFab(): void {
    const now = new Date();
    const minutes = Math.round(now.getMinutes() / 15) * 15;
    now.setMinutes(minutes, 0, 0);
    this.openNewLessonAt(now.toISOString());
  }

  toggleStudentsSidebar(): void {
    this.studentsSidebarOpen.update((opened) => !opened);
  }

  selectSidebarStudent(studentId: string): void {
    this.focusedStudentId.set(studentId);
    if (this.isNarrowViewport()) {
      this.studentsSidebarOpen.set(false);
    }
  }

  clearStudentFocus(): void {
    this.focusedStudentId.set(null);
    this.studentsSidebarQuery.set('');
  }

  studentInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (parts[0] || '?').slice(0, 2).toUpperCase();
  }

  getStudentName(studentId: string | null | undefined): string {
    if (!studentId) {
      return '(без ученика)';
    }
    return this.students().find((x) => x._id === studentId)?.name ?? '(без ученика)';
  }

  getStudentColor(studentId: string | null | undefined): string {
    if (!studentId) {
      return DEFAULT_STUDENT_BORDER_COLOR;
    }
    return (
      this.students().find((x) => x._id === studentId)?.color_hex ??
      DEFAULT_STUDENT_BORDER_COLOR
    );
  }

  getSelectedStudent(): Student | undefined {
    const selectedId = this.form.student_id;
    if (!selectedId) {
      return undefined;
    }
    return this.students().find((student) => student._id === selectedId);
  }

  formRateCurrencyCode(): string {
    return this.getStudentCurrency(this.form.student_id);
  }

  onScheduledAtLocalChange(value: string): void {
    this.scheduledAtLocal.set(value);
    this.form.scheduledAt = value?.trim() ? new Date(value).toISOString() : '';
  }

  getStudentCurrency(studentId: string | null | undefined): string {
    if (!studentId) {
      return 'EUR';
    }
    return this.studentCurrencyById().get(studentId) ?? 'EUR';
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

  lessonCardClass(lesson: Lesson): Record<string, boolean> {
    const focused = this.focusedStudentId();
    const dragging = this.dragLessonId() === lesson._id;
    return {
      'cal-lesson-card': true,
      'cal-lesson-card--scheduled': lesson.status === 'scheduled',
      'cal-lesson-card--completed': lesson.status === 'completed',
      'cal-lesson-card--missed': lesson.status === 'missed',
      'cal-lesson-card--canceled': lesson.status === 'canceled',
      'cal-lesson-card--focus-active': Boolean(focused && lesson.student_id === focused),
      'cal-lesson-card--focus-dim': Boolean(focused && lesson.student_id !== focused),
      'cal-lesson-card--dragging': dragging,
    };
  }

  isDayDragTarget(col: Date): boolean {
    const preview = this.dragPreview();
    if (!preview?.scheduledAt) {
      return false;
    }
    return this.dayKey(col) === this.dayKey(new Date(preview.scheduledAt));
  }

  dragSnapLineTop(col: Date): number | null {
    const preview = this.dragPreview();
    if (!preview?.scheduledAt || this.dragLessonId() === null) {
      return null;
    }
    if (this.dayKey(col) !== this.dayKey(new Date(preview.scheduledAt))) {
      return null;
    }
    return this.calculateTop(preview.scheduledAt);
  }

  onDayColumnClick(col: Date, event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    if ((event.target as HTMLElement).closest('.cal-lesson-card')) {
      return;
    }
    const rect = target.getBoundingClientRect();
    const offsetY = event.clientY - rect.top + target.scrollTop;
    const scheduledAt = this.isoFromDayAndOffset(this.dayKey(col), offsetY);
    this.openNewLessonAt(scheduledAt);
  }

  onLessonDragStart(event: DragEvent, lesson: Lesson): void {
    if (!lesson.scheduledAt) {
      event.preventDefault();
      return;
    }

    event.stopPropagation();
    this.suppressLessonClickUntil = Date.now() + 400;
    this.dragLessonId.set(lesson._id);
    this.dragPreview.set({ lessonId: lesson._id, scheduledAt: lesson.scheduledAt });

    const card = (event.currentTarget as HTMLElement) ?? null;

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', lesson._id);
      if (card) {
        this.setDragImageFromCard(event, card);
      }
    }
  }

  onLessonDragEnd(): void {
    this.removeDragGhost();
    this.dragLessonId.set(null);
    this.dragPreview.set(null);
  }

  onDayDragOver(event: DragEvent, col: Date): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.updateDragPreviewFromEvent(event, col);
  }

  onDayDrop(event: DragEvent, col: Date): void {
    event.preventDefault();
    event.stopPropagation();

    const lessonId =
      this.dragLessonId() ?? event.dataTransfer?.getData('text/plain') ?? null;
    const lesson = this.lessons().find((item) => item._id === lessonId);
    if (!lesson) {
      this.clearDragState();
      return;
    }

    const preview = this.dragPreview();
    const scheduledAt =
      preview?.lessonId === lesson._id
        ? preview.scheduledAt
        : this.isoFromDayAndOffset(
            this.dayKey(col),
            this.offsetYInColumn(event, event.currentTarget as HTMLElement),
          );

    this.clearDragState();

    if (this.shouldConfirmBotNotifyBeforeMove(lesson, scheduledAt)) {
      this.dragMoveConfirm.set({ lesson, scheduledAt });
      return;
    }

    this.persistLessonMove(lesson, scheduledAt);
  }

  dragMoveConfirmStudentName(): string {
    const pending = this.dragMoveConfirm();
    if (!pending?.lesson.student_id) {
      return 'ученику';
    }
    return this.getStudentName(pending.lesson.student_id);
  }

  dragMoveConfirmTimeLabel(): string {
    const pending = this.dragMoveConfirm();
    if (!pending?.scheduledAt) {
      return '';
    }
    return this.formatLessonDateTime(pending.scheduledAt);
  }

  confirmDragMove(): void {
    const pending = this.dragMoveConfirm();
    if (!pending) {
      return;
    }
    this.dragMoveConfirm.set(null);
    this.persistLessonMove(pending.lesson, pending.scheduledAt);
  }

  cancelDragMove(): void {
    this.dragMoveConfirm.set(null);
  }

  private shouldConfirmBotNotifyBeforeMove(lesson: Lesson, scheduledAt: string): boolean {
    if (lesson.status !== 'scheduled' || !lesson.scheduledAt) {
      return false;
    }
    if (this.scheduleTimesEqual(lesson.scheduledAt, scheduledAt)) {
      return false;
    }
    const student = this.students().find((item) => item._id === lesson.student_id);
    return Boolean(student?.bot_active);
  }

  private scheduleTimesEqual(left: string, right: string): boolean {
    const a = Date.parse(left);
    const b = Date.parse(right);
    if (Number.isNaN(a) || Number.isNaN(b)) {
      return left === right;
    }
    return a === b;
  }

  private formatLessonDateTime(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return iso;
    }
    return new Intl.DateTimeFormat('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  }

  private updateDragPreviewFromEvent(event: DragEvent, col: Date): void {
    const lessonId = this.dragLessonId();
    if (!lessonId) {
      return;
    }
    const columnEl = event.currentTarget as HTMLElement;
    const offsetY = this.offsetYInColumn(event, columnEl);
    const scheduledAt = this.isoFromDayAndOffset(this.dayKey(col), offsetY);
    this.dragPreview.set({ lessonId, scheduledAt });
  }

  private offsetYInColumn(event: DragEvent, columnEl: HTMLElement): number {
    const rect = columnEl.getBoundingClientRect();
    return event.clientY - rect.top + columnEl.scrollTop;
  }

  private setDragImageFromCard(event: DragEvent, card: HTMLElement): void {
    this.removeDragGhost();

    const rect = card.getBoundingClientRect();
    const ghost = card.cloneNode(true) as HTMLElement;
    ghost.classList.add('cal-lesson-card--drag-ghost');
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    ghost.style.left = '0';
    ghost.style.width = `${rect.width}px`;
    ghost.style.pointerEvents = 'none';
    document.body.appendChild(ghost);
    this.dragGhostEl = ghost;

    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    event.dataTransfer?.setDragImage(ghost, offsetX, offsetY);
  }

  private removeDragGhost(): void {
    this.dragGhostEl?.remove();
    this.dragGhostEl = null;
  }

  private clearDragState(): void {
    this.removeDragGhost();
    this.dragLessonId.set(null);
    this.dragPreview.set(null);
  }

  private persistLessonMove(lesson: Lesson, scheduledAt: string): void {
    if (
      this.hasScheduleConflict(
        scheduledAt,
        lesson.lesson_duration,
        lesson._id,
        lesson.status,
      )
    ) {
      this.openScheduleConflict();
      return;
    }

    const previous = [...this.lessons()];

    this.lessons.update((list) =>
      list.map((item) => (item._id === lesson._id ? { ...item, scheduledAt } : item)),
    );

    this.lessonsSvc
      .update(lesson._id, {
        student_id: lesson.student_id,
        lesson_duration: lesson.lesson_duration,
        status: lesson.status,
        notes: lesson.notes,
        scheduledAt,
      })
      .subscribe({
        next: (updated) => {
          this.lessons.update((list) =>
            list.map((item) =>
              item._id === updated._id ? this.normalizeLesson(updated) : item,
            ),
          );
        },
        error: (err: HttpErrorResponse) => {
          this.lessons.set(previous);
          if (err.status === 409) {
            this.openScheduleConflict();
            return;
          }
          this.loadLessons();
        },
      });
  }

  openScheduleConflict(message?: string): void {
    this.scheduleConflictMessage.set(
      message ?? CalendarComponent.SCHEDULE_CONFLICT_MSG,
    );
  }

  closeScheduleConflict(): void {
    this.scheduleConflictMessage.set(null);
  }

  private hasScheduleConflict(
    scheduledAt: string | null | undefined,
    durationMinutes: number,
    excludeLessonId: string | null,
    status: LessonStatus = 'scheduled',
  ): boolean {
    if (status !== 'scheduled') {
      return false;
    }

    const candidate = this.lessonInterval(scheduledAt, durationMinutes);
    if (!candidate) {
      return false;
    }

    for (const lesson of this.lessons()) {
      if (excludeLessonId && lesson._id === excludeLessonId) {
        continue;
      }
      if (lesson.status !== 'scheduled' || !lesson.scheduledAt) {
        continue;
      }
      const other = this.lessonInterval(lesson.scheduledAt, lesson.lesson_duration);
      if (!other) {
        continue;
      }
      if (this.intervalsOverlap(candidate, other)) {
        return true;
      }
    }

    return false;
  }

  private lessonInterval(
    scheduledAt: string | null | undefined,
    durationMinutes: number,
  ): { start: number; end: number } | null {
    if (!scheduledAt) {
      return null;
    }
    const start = Date.parse(scheduledAt);
    if (Number.isNaN(start)) {
      return null;
    }
    const duration = this.clampedDurationMinutes(durationMinutes);
    return { start, end: start + duration * 60_000 };
  }

  private intervalsOverlap(
    a: { start: number; end: number },
    b: { start: number; end: number },
  ): boolean {
    return Math.max(a.start, b.start) < Math.min(a.end, b.end);
  }

  private isoFromDayAndOffset(dayKey: string, offsetYPx: number): string {
    const [y, m, d] = dayKey.split('-').map(Number);
    const maxMinutes = 24 * 60 - 5;
    const rawMinutes = Math.max(0, Math.min(maxMinutes, offsetYPx / this.minuteHeightPx));
    const rounded = Math.round(rawMinutes / 15) * 15;
    const hours = Math.floor(rounded / 60);
    const minutes = rounded % 60;
    return new Date(y, m - 1, d, hours, minutes, 0, 0).toISOString();
  }

  private openNewLessonAt(scheduledAt: string): void {
    this.editLessonTarget.set(null);
    this.lessonFormStep.set(1);
    this.resetLessonForm();
    this.form.scheduledAt = scheduledAt;
    const local = new Date(new Date(scheduledAt).getTime() - new Date().getTimezoneOffset() * 60000);
    this.scheduledAtLocal.set(local.toISOString().slice(0, 16));
    this.saveLessonError = null;
    this.studentsLoadError = null;
    this.showLessonForm.set(true);
    this.ensureStudentsLoaded();
  }

  openEditLesson(lesson: Lesson, clickEvent?: Event): void {
    if (Date.now() < this.suppressLessonClickUntil) {
      clickEvent?.preventDefault();
      clickEvent?.stopPropagation();
      return;
    }
    clickEvent?.stopPropagation();
    this.editLessonTarget.set(lesson);
    this.lessonFormStep.set(1);
    this.saveLessonError = null;
    this.studentsLoadError = null;
    this.ensureStudentsLoaded();
    const mins = lesson.lesson_duration;
    this.duration.set(mins);
    this.durationChipMode.set(this.durationPresets.includes(mins) ? 'preset' : 'custom');
    this.form = {
      student_id: lesson.student_id || '',
      status: lesson.status,
      notes: lesson.notes || '',
      scheduledAt: lesson.scheduledAt,
    };
    const local = new Date(
      new Date(lesson.scheduledAt).getTime() - new Date().getTimezoneOffset() * 60000,
    );
    this.scheduledAtLocal.set(local.toISOString().slice(0, 16));
    this.showLessonForm.set(true);
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
    this.showLessonForm.set(false);
    this.editLessonTarget.set(null);
    this.deletingLesson.set(false);
    this.lessonFormStep.set(1);
  }

  goToNotesStep(): void {
    this.lessonFormStep.set(2);
  }

  backToMainStep(): void {
    this.lessonFormStep.set(1);
  }

  private resetLessonForm(): void {
    this.duration.set(60);
    this.durationChipMode.set('preset');
    this.scheduledAtLocal.set('');
    this.form = {
      student_id: '',
      status: 'scheduled',
      notes: '',
      scheduledAt: '',
    };
  }

  private clampedDurationMinutes(raw?: number): number {
    const minutes =
      raw !== undefined ? Number(raw) : Math.round(Number(this.duration()));
    if (Number.isNaN(minutes) || minutes < 5) {
      return 60;
    }
    return Math.min(480, Math.max(5, Math.round(minutes)));
  }

  private loadLessons(): void {
    this.lessonsSvc.getAll().subscribe({
      next: (data) => {
        this.lessons.set(
          data
            .filter((l) => Boolean(l.scheduledAt))
            .map((l) => this.normalizeLesson(l)),
        );
        this.loadError = null;
        this.hasLoaded.set(true);
      },
      error: (err) => {
        this.loadError = err?.error?.message ?? err?.message ?? 'Не удалось загрузить уроки';
        this.hasLoaded.set(true);
      },
    });
  }

  private normalizeLesson(raw: LessonApiRow): Lesson {
    const statusRaw = String(raw.status ?? 'scheduled');
    const status: LessonStatus =
      statusRaw === 'cancelled' ? 'canceled' : (statusRaw as LessonStatus);
    return {
      _id: raw._id,
      student_id: raw.student_id,
      status,
      scheduledAt: String(raw.scheduledAt),
      lesson_duration: raw.lesson_duration ?? 60,
      lesson_price: raw.lesson_price ?? 0,
      lesson_currency: raw.lesson_currency ?? 'EUR',
      reminder_sent: raw.reminder_sent ?? false,
      notes: raw.notes,
      tutor: raw.tutor,
      student_name: raw.student_name,
      title: raw.title,
    };
  }

  saveLesson(): void {
    this.saveLessonError = null;
    if (!this.form.student_id?.trim()) {
      this.saveLessonError = 'Выберите ученика';
      return;
    }

    const duration = this.clampedDurationMinutes();
    const scheduledAt = this.form.scheduledAt?.trim() || null;
    const editing = this.editLessonTarget();
    const excludeId = editing?._id ?? null;

    if (
      this.hasScheduleConflict(scheduledAt, duration, excludeId, this.form.status)
    ) {
      this.openScheduleConflict();
      return;
    }

    this.savingLesson.set(true);
    const basePayload = {
      student_id: this.form.student_id,
      lesson_duration: duration,
      status: this.form.status,
      notes: this.form.notes?.trim() || undefined,
      scheduledAt,
    };

    if (editing) {
      this.lessonsSvc.update(editing._id, basePayload).subscribe({
        next: (updated) => {
          this.lessons.update((list) =>
            list.map((l) => (l._id === updated._id ? this.normalizeLesson(updated) : l)),
          );
          this.savingLesson.set(false);
          this.closeLessonForm();
        },
        error: (err: HttpErrorResponse) => {
          this.savingLesson.set(false);
          this.handleLessonSaveError(err);
        },
      });
      return;
    }

    this.lessonsSvc.create(basePayload).subscribe({
      next: (created) => {
        this.lessons.update((list) => [...list, this.normalizeLesson(created)]);
        this.savingLesson.set(false);
        this.closeLessonForm();
      },
      error: (err: HttpErrorResponse) => {
        this.savingLesson.set(false);
        this.handleLessonSaveError(err);
      },
    });
  }

  private handleLessonSaveError(err: HttpErrorResponse): void {
    if (err.status === 409) {
      this.openScheduleConflict();
      return;
    }
    this.saveLessonError = this.formatLessonSaveError(err);
  }

  private formatLessonSaveError(err: HttpErrorResponse): string {
    return err?.error?.message ?? err?.error?.error ?? err?.message ?? 'Не удалось сохранить урок';
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
