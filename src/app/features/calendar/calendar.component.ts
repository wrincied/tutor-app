import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  OnInit,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CurrencyPipe, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CalendarLessonDisplayService } from '../../core/services/calendar-lesson-display.service';
import { LessonService } from '../../core/services/lesson.service';
import { UserProfileSettingsService } from '../../core/services/user-profile-settings.service';
import { StudentService, type Student } from '../../core/services/student.service';
import { isPackageStudentWithLastBalance } from '../../core/utils/calendar-last-paid-lesson';
import type { CalendarLesson, Lesson, LessonStatus } from '@interfaces';
import { DEFAULT_STUDENT_BORDER_COLOR } from '../../core/utils/pastel-color';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';
import { I18nService } from '../../core/services/i18n.service';
import { APP_OVERLAY_LAYER_OPEN } from '../../core/constants/overlay-layer';
import { purgeStaleOverlayLayers } from '../../core/utils/purge-stale-overlay-layers';
import {
  buildRruleFromConfig,
  configFromPreset,
  dayKey,
  DEFAULT_RECURRENCE_CONFIG,
  expandLessonOccurrencesForConflictCheck,
  expandLessonsForRange,
  formatRecurrenceSummary,
  isRecurrenceConfigActive,
  jsDayToRruleWeekday,
  parseRruleToConfig,
  RRULE_WEEKDAY_CODES,
  type RecurrenceCustomFreq,
  type RecurrenceEndMode,
  type RecurrencePreset,
  type RecurrenceRuleConfig,
  type RruleWeekdayCode,
} from '../../core/utils/lesson-recurrence';

const CALENDAR_MODAL_OPEN_CLASS = 'app-calendar-modal-open';
const CALENDAR_DRAGGING_CLASS = 'cal-lesson-dragging';
const PERIOD_EXIT_MS = 200;
const PERIOD_ENTER_MS = 300;

export type CalendarViewMode = '1' | '3' | '7' | '30';

interface LessonDragGhost {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LessonPointerSession {
  lessonId: string;
  pointerId: number;
  startX: number;
  startY: number;
  grabOffsetX: number;
  grabOffsetY: number;
  originScheduledAt: string;
  cardWidth: number;
  cardHeight: number;
  captureTarget: HTMLElement;
}

interface NativeDragState {
  lesson: CalendarLesson;
}

/** Ответ API до нормализации (legacy-поля и статусы). */
type LessonApiRow = Omit<Lesson, 'status'> & {
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

type LessonSavePayload = {
  student_id: string;
  lesson_duration: number;
  status: LessonStatus;
  notes?: string;
  scheduledAt: string | null;
  isRecurring?: boolean;
  startDate?: string | null;
  rrule?: string | null;
  occurrence_date?: string | null;
  occurrence_status?: LessonStatus;
  manual_completion?: boolean;
};
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, AppDialogComponent, AppSelectComponent, NgTemplateOutlet],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
 })
export class CalendarComponent implements OnInit {
  private readonly lessonsSvc = inject(LessonService);
  private readonly studentSvc = inject(StudentService);
  private readonly lessonDisplay = inject(CalendarLessonDisplayService);
  readonly profileSettings = inject(UserProfileSettingsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  readonly i18n = inject(I18nService);

  /** Длительность нового урока по умолчанию (1 ч 30 мин). */
  private static readonly DEFAULT_LESSON_DURATION_MIN = 90;

  /** 60px = 1 час; 1px = 1 минута */
  readonly hourHeightPx = 60;
  readonly minuteHeightPx = 1;
  readonly gridHours = computed(() => this.profileSettings.gridHours());
  readonly gridStartHour = computed(() => this.profileSettings.gridStartHour());
  readonly gridEndHour = computed(() => this.profileSettings.gridEndHour());
  /** Высота сетки: только интервал [start, end) из настроек, 60px = 1 ч. */
  readonly gridHeightPx = computed(() => {
    const span = this.gridEndHour() - this.gridStartHour();
    return Math.max(1, span) * this.hourHeightPx;
  });
  /** Небольшой отступ под последней линией сетки (в scroll-контейнере). */
  readonly gridBottomPaddingPx = 16;
  /** Плейсхолдеры скелета сетки (7 колонок). */
  readonly skeletonGridCols = [0, 1, 2, 3, 4, 5, 6];
  readonly skeletonHourRows = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  readonly viewModes: readonly CalendarViewMode[] = ['1', '3', '7', '30'];

  currentDate = signal<Date>(new Date());
  viewMode = signal<CalendarViewMode>('7');
  /** Пересоздание сетки для @starting-style при смене периода. */
  readonly periodViewKey = signal(0);
  readonly periodExitMode = signal<'prev' | 'next' | 'fade' | null>(null);
  readonly periodEnterFrom = signal<'prev' | 'next' | null>(null);
  private periodTransitionTimer: number | null = null;
  lessons = signal<Lesson[]>([]);
  students = signal<Student[]>([]);

  loadError: string | null = null;
  hasLoaded = signal(false);
  /** Navbar снизу (телефон и планшет landscape). */
  isBottomNavLayout = signal(false);
  /** Планшет/телефон: без стрелок навигации, ≤1023px */
  isCompactHeader = signal(false);
  isNarrowViewport = signal(true);
  /** HTML5 dragstart/dragover — только на десктопе с точным указателем. */
  useNativeLessonDrag = signal(false);
  modesMenuOpen = signal(false);
  studentsSidebarOpen = signal(false);
  studentsSidebarQuery = signal('');
  focusedStudentId = signal<string | null>(null);
  lessonFormStep = signal<1 | 2>(1);
  scheduledAtLocal = signal('');
  /** Урок в активном перетаскивании (pointer events). */
  readonly dragActiveLessonId = signal<string | null>(null);
  /** Исходное время урока — для placeholder на старом месте. */
  readonly dragOriginScheduledAt = signal<string | null>(null);
  /** Целевое время (шаг 15 мин) во время drag. */
  private readonly dragPreview = signal<{ lessonId: string; scheduledAt: string } | null>(null);
  /** Фантом, следующий за пальцем (position: fixed). */
  readonly dragGhost = signal<LessonDragGhost | null>(null);
  private pointerSession: LessonPointerSession | null = null;
  private pointerMoveHandler: ((event: PointerEvent) => void) | null = null;
  private pointerUpHandler: ((event: PointerEvent) => void) | null = null;
  private pointerSafetyHandler: (() => void) | null = null;
  private readonly dragStartThresholdPx = 6;
  private suppressLessonClickUntil = 0;
  /** Native DnD state for desktop drag/drop UX. */
  readonly draggedLesson = signal<CalendarLesson | null>(null);
  readonly currentDropTime = signal<string | null>(null);
  private nativeDragState: NativeDragState | null = null;
  private readonly dragImagePixel = this.createTransparentDragImage();
  private readonly autoScrollEdgePx = 64;
  private readonly autoScrollMaxStepPx = 10;

  showLessonForm = signal(false);
  editLessonTarget = signal<CalendarLesson | null>(null);
  studentsLoadError: string | null = null;
  savingLesson = signal(false);
  deletingLesson = signal(false);
  saveLessonError: string | null = null;
  /** Модалка: слот занят (drag-and-drop или сохранение урока). */
  scheduleConflictMessage = signal<string | null>(null);
  /** Подтверждение переноса перед уведомлением ученика через бота. */
  dragMoveConfirm = signal<{ lesson: Lesson; scheduledAt: string } | null>(null);
  /** Списание баланса при missed/canceled — ждёт выбора в модалке. */
  billingConfirm = signal<{
    payload: LessonSavePayload;
    editing: Lesson | null;
  } | null>(null);

  form = {
    student_id: '',
    status: 'scheduled' as LessonStatus,
    notes: '',
    scheduledAt: '',
  };

  duration = signal(CalendarComponent.DEFAULT_LESSON_DURATION_MIN);
  durationChipMode = signal<'preset' | 'custom'>('preset');
  recurrenceConfig = signal<RecurrenceRuleConfig>({ ...DEFAULT_RECURRENCE_CONFIG });
  recurrenceDraft = signal<RecurrenceRuleConfig>({ ...DEFAULT_RECURRENCE_CONFIG });
  recurrenceModalOpen = signal(false);
  /** Дата вхождения при редактировании виртуальной карточки (YYYY-MM-DD). */
  editingOccurrenceDate = signal<string | null>(null);
  deleteRecurringModalOpen = signal(false);
  readonly durationPresets: readonly number[] = [30, 45, 60, 90];
  /** Цвета точек статуса — как у карточек урока в сетке. */
  private static readonly STATUS_DOT_COLORS: Record<LessonStatus, string> = {
    scheduled: '#0c4a6e',
    completed: '#065f46',
    missed: '#92400e',
    canceled: '#991b1b',
  };

  private static readonly STATUS_BADGE_COLORS: Record<LessonStatus, string> = {
    scheduled: '#0369a1',
    completed: '#047857',
    missed: '#b45309',
    canceled: '#b91c1c',
  };

  viewModeSelectOptions = computed((): AppSelectOption[] =>
    this.viewModes.map((mode) => ({
      value: mode,
      label: this.viewModeLabel(mode),
    })),
  );

  lessonStatusSelectOptions = computed((): AppSelectOption[] => {
    const t = this.i18n.calendarUi();
    const statuses: LessonStatus[] = ['scheduled', 'completed', 'missed', 'canceled'];
    const labels: Record<LessonStatus, string> = {
      scheduled: t.statusScheduled,
      completed: t.statusCompleted,
      missed: t.statusMissed,
      canceled: t.statusCanceled,
    };
    return statuses.map((status) => ({
      value: status,
      label: labels[status],
      dotColor: CalendarComponent.STATUS_DOT_COLORS[status],
    }));
  });

  studentSelectOptions = computed((): AppSelectOption[] =>
    this.students().map((s) => ({ value: s._id, label: s.name })),
  );

  weekdayLabels = computed(() => this.i18n.weekdayShortLabels());

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

  /** Число сегодняшнего дня для кнопки «сегодня». */
  todayDayOfMonth = computed(() => new Date().getDate());

  /** Позиция красной линии текущего времени (px) или null. */
  nowLineTopPx = computed(() => {
    this.nowTick();
    if (this.isMonthOverview()) {
      return null;
    }
    const todayKey = this.dayKey(new Date());
    const showsToday = this.columns().some((col) => this.dayKey(col) === todayKey);
    if (!showsToday) {
      return null;
    }
    const now = new Date();
    const offsetMin = this.minutesFromGridStart(now);
    const maxOffsetMin = (this.gridEndHour() - this.gridStartHour()) * 60;
    if (offsetMin < 0 || offsetMin > maxOffsetMin) {
      return null;
    }
    return offsetMin * this.minuteHeightPx;
  });

  /** Подпись времени на оси для маркера «сейчас». */
  nowTimeLabel = computed(() => {
    this.nowTick();
    if (this.nowLineTopPx() === null) {
      return '';
    }
    const now = new Date();
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now);
  });

  /** Календарная неделя (ISO) для текущего якоря даты, напр. «KW 12». */
  calendarWeekLabel = computed(() => {
    this.i18n.lang();
    this.currentDate();
    const week = this.isoWeekNumber(this.currentDate());
    return this.i18n.calendarUi().calendarWeek.replace('{week}', String(week));
  });

  /** Диапазон дат / месяц в шапке (без номера недели). */
  periodRangeLabel = computed(() => {
    this.i18n.lang();
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
    const locale = this.i18n.localeId();
    const fmt = (d: Date) => d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
    return `${fmt(cols[0])} – ${fmt(cols[cols.length - 1])}`;
  });

  private periodSwipeStart: { x: number; y: number } | null = null;
  private readonly periodSwipeMinPx = 48;
  /** Обновление линии текущего времени раз в минуту. */
  private readonly nowTick = signal(0);
  private nowLineIntervalId: ReturnType<typeof setInterval> | null = null;

  /** Уроки с UI-флагом `isLastPaid` для сетки календаря. */
  displayLessons = computed(() =>
    this.lessonDisplay.enrichForGrid(this.lessons(), this.students()),
  );

  recurrenceSummaryLabels = computed(() => {
    const t = this.i18n.calendarUi();
    return {
      none: t.recurrencePresetNone,
      daily: t.recurrenceDaily,
      dailyInterval: t.recurrenceDailyInterval,
      weekly: t.recurrenceWeekly,
      weeklyInterval: t.recurrenceWeeklyInterval,
      monthly: t.recurrenceMonthly,
      monthlyInterval: t.recurrenceMonthlyInterval,
      custom: t.recurrencePresetCustom,
      endNever: t.recurrenceEndNever,
      endUntil: t.recurrenceEndUntil,
      endCount: t.recurrenceEndCount,
      weekdays: {
        MO: t.weekdayMon,
        TU: t.weekdayTue,
        WE: t.weekdayWed,
        TH: t.weekdayThu,
        FR: t.weekdayFri,
        SA: t.weekdaySat,
        SU: t.weekdaySun,
      },
    };
  });

  recurrenceSummary = computed(() => {
    const scheduledAt = this.form.scheduledAt?.trim();
    const startDate = scheduledAt ? dayKey(new Date(scheduledAt)) : null;
    return formatRecurrenceSummary(
      this.recurrenceConfig(),
      this.recurrenceSummaryLabels(),
      startDate,
    );
  });

  recurrencePresetSelectOptions = computed((): AppSelectOption[] => {
    const t = this.i18n.calendarUi();
    return [
      { value: 'none', label: t.recurrencePresetNone },
      { value: 'daily', label: t.recurrencePresetDaily },
      { value: 'weekly', label: t.recurrencePresetWeekly },
      { value: 'monthly', label: t.recurrencePresetMonthly },
      { value: 'custom', label: t.recurrencePresetCustom },
    ];
  });

  recurrenceCustomFreqSelectOptions = computed((): AppSelectOption[] => {
    const t = this.i18n.calendarUi();
    return [
      { value: 'daily', label: t.recurrencePresetDaily },
      { value: 'weekly', label: t.recurrencePresetWeekly },
      { value: 'monthly', label: t.recurrencePresetMonthly },
    ];
  });

  recurrenceEndModeSelectOptions = computed((): AppSelectOption[] => {
    const t = this.i18n.calendarUi();
    return [
      { value: 'never', label: t.recurrenceEndNever },
      { value: 'until', label: t.recurrenceEndUntilShort },
      { value: 'count', label: t.recurrenceEndCountShort },
    ];
  });

  recurrenceDayOptions = computed(() => {
    const t = this.i18n.calendarUi();
    return RRULE_WEEKDAY_CODES.map((code) => ({
      code,
      label: {
        MO: t.weekdayMon,
        TU: t.weekdayTue,
        WE: t.weekdayWed,
        TH: t.weekdayThu,
        FR: t.weekdayFri,
        SA: t.weekdaySat,
        SU: t.weekdaySun,
      }[code],
    }));
  });

  /** Диапазон дат текущего вида (неделя / день / месяц). */
  visibleRange = computed((): { start: Date; end: Date } | null => {
    if (this.isMonthOverview()) {
      const cells = this.monthOverviewCells();
      if (cells.length === 0) {
        return null;
      }
      const start = this.startOfLocalDay(cells[0].date);
      const end = this.startOfLocalDay(cells[cells.length - 1].date);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    const cols = this.columns();
    if (cols.length === 0) {
      return null;
    }
    const start = this.startOfLocalDay(cols[0]);
    const end = this.startOfLocalDay(cols[cols.length - 1]);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  });

  /** Уроки для сетки: развёрнутые RRULE-вхождения в видимом диапазоне. */
  gridLessons = computed(() => {
    const base = this.displayLessons();
    const range = this.visibleRange();
    if (!range) {
      return base;
    }
    return expandLessonsForRange(base, range.start, range.end);
  });

  dragActiveLesson = computed(() => {
    const id = this.dragActiveLessonId();
    if (!id) {
      return null;
    }
    return this.displayLessons().find((lesson) => lesson._id === id) ?? null;
  });

  /** Время на бейдже фантома во время перетаскивания (шаг 15 мин). */
  dragPreviewTimeLabel = computed(() => {
    const preview = this.dragPreview();
    if (!preview?.scheduledAt) {
      return '';
    }
    const date = new Date(preview.scheduledAt);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  });

  /** Dynamic destination label for custom phantom slot preview. */
  phantomDropTimeLabel = computed(() => {
    const iso = this.currentDropTime();
    if (!iso) {
      return '';
    }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const startLabel = new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);

    const lesson = this.draggedLesson();
    const durationMinutes = this.clampedDurationMinutes(lesson?.lesson_duration ?? this.duration());
    const end = new Date(date.getTime() + durationMinutes * 60_000);
    const endLabel = new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(end);

    return `${startLabel} - ${endLabel}`;
  });

  lessonsByDay = computed(() => {
    const map = new Map<string, CalendarLesson[]>();
    for (const lesson of this.gridLessons()) {
      const scheduledAt = lesson.scheduledAt;
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
      bucket.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
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

  private readonly gridScrollRef = viewChild<ElementRef<HTMLElement>>('gridScroll');
  private readonly scrollContainerRef = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  /** Любая модалка календаря — navbar снизу уходит под оверлей. */
  private readonly calendarModalOpen = computed(
    () =>
      this.showLessonForm() ||
      this.dragMoveConfirm() !== null ||
      this.billingConfirm() !== null ||
      this.scheduleConflictMessage() !== null,
  );

  constructor() {
    effect(() => {
      this.document.documentElement.classList.toggle(
        CALENDAR_MODAL_OPEN_CLASS,
        this.calendarModalOpen(),
      );
    });
    effect(() => {
      this.gridHours();
      if (!this.isMonthOverview() && isPlatformBrowser(this.platformId)) {
        afterNextRender(() => this.scrollGridToNow(), { injector: this.injector });
      }
    });
    this.destroyRef.onDestroy(() => {
      if (this.periodTransitionTimer !== null) {
        clearTimeout(this.periodTransitionTimer);
      }
      this.document.documentElement.classList.remove(CALENDAR_MODAL_OPEN_CLASS);
      this.clearPointerListeners();
      this.clearDragUi();
    });
  }

  ngOnInit(): void {
    this.initViewportMediaQueries();
    this.initNowLineClock();
    this.profileSettings.loadProfile().subscribe();
    this.loadLessons();
    this.studentSvc.getAll().subscribe({
      next: (list) => this.students.set(list),
      error: () => {
        /* optional */
      },
    });
  }

  /** Прокрутка к текущему часу (если день на экране) или к утру. */
  private scrollGridToNow(): void {
    if (!isPlatformBrowser(this.platformId) || this.isMonthOverview()) {
      return;
    }
    const top = this.nowLineTopPx();
    if (top === null) {
      this.scrollGridToOffset(this.gridStartHour() * 60 * this.minuteHeightPx);
      return;
    }
    afterNextRender(() => this.applyScrollToNow(), { injector: this.injector });
  }

  private scrollGridToOffset(offsetPx: number, attempt = 0): void {
    if (!isPlatformBrowser(this.platformId) || this.isMonthOverview()) {
      return;
    }
    const el = this.gridScrollRef()?.nativeElement;
    if (!el) {
      if (attempt < 8) {
        afterNextRender(() => this.scrollGridToOffset(offsetPx, attempt + 1), {
          injector: this.injector,
        });
      }
      return;
    }
    const top = Math.max(0, offsetPx - el.clientHeight * 0.25);
    el.scrollTo({ top, behavior: this.scrollBehavior() });
  }

  private applyScrollToNow(attempt = 0): void {
    if (!isPlatformBrowser(this.platformId) || this.isMonthOverview()) {
      return;
    }
    const top = this.nowLineTopPx();
    if (top === null) {
      return;
    }
    const el = this.gridScrollRef()?.nativeElement;
    if (!el) {
      if (attempt < 8) {
        requestAnimationFrame(() => this.applyScrollToNow(attempt + 1));
      }
      return;
    }
    const target = Math.max(0, top - el.clientHeight * 0.25);
    el.scrollTo({ top: target, behavior: this.scrollBehavior() });
  }

  private scrollBehavior(): ScrollBehavior {
    return this.prefersReducedMotion() ? 'auto' : 'smooth';
  }

  private prefersReducedMotion(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Плавная смена недели/дня/месяца: fade-out → обновление → fade-in. */
  private runPeriodTransition(
    direction: 'prev' | 'next' | null,
    apply: () => void,
  ): void {
    if (this.prefersReducedMotion()) {
      apply();
      afterNextRender(() => this.scrollGridToNow(), { injector: this.injector });
      return;
    }

    if (this.periodTransitionTimer !== null) {
      clearTimeout(this.periodTransitionTimer);
      this.periodTransitionTimer = null;
    }

    this.periodExitMode.set(direction ?? 'fade');

    this.periodTransitionTimer = window.setTimeout(() => {
      apply();
      this.periodExitMode.set(null);
      this.periodEnterFrom.set(direction);
      this.periodViewKey.update((k) => k + 1);

      this.periodTransitionTimer = window.setTimeout(() => {
        this.periodEnterFrom.set(null);
        this.periodTransitionTimer = null;
        afterNextRender(() => this.scrollGridToNow(), { injector: this.injector });
      }, PERIOD_ENTER_MS);
    }, direction ? PERIOD_EXIT_MS : 160);
  }

  private shiftCurrentDate(delta: -1 | 1): void {
    const next = new Date(this.currentDate());
    const mode = this.viewMode();
    if (mode === '30') {
      next.setMonth(next.getMonth() + delta);
    } else if (mode === '7') {
      next.setDate(next.getDate() + delta * 7);
    } else {
      next.setDate(next.getDate() + delta * Number(mode));
    }
    this.currentDate.set(next);
  }

  private initNowLineClock(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.nowLineIntervalId = setInterval(() => {
      this.nowTick.update((n) => n + 1);
    }, 60_000);
    this.destroyRef.onDestroy(() => {
      if (this.nowLineIntervalId !== null) {
        clearInterval(this.nowLineIntervalId);
      }
    });
  }

  private initViewportMediaQueries(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const bottomNavMq = window.matchMedia('(max-width: 768px), (max-height: 440px)');
    const compactMq = window.matchMedia('(max-width: 1023px)');
    const finePointerMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const applyViewport = () => {
      const bottomNav = bottomNavMq.matches;
      const compact = compactMq.matches;
      this.isBottomNavLayout.set(bottomNav);
      this.isCompactHeader.set(compact);
      this.isNarrowViewport.set(compact);
      this.useNativeLessonDrag.set(finePointerMq.matches);
      if (!bottomNav) {
        this.modesMenuOpen.set(false);
      }
    };
    applyViewport();
    bottomNavMq.addEventListener('change', applyViewport);
    compactMq.addEventListener('change', applyViewport);
    finePointerMq.addEventListener('change', applyViewport);
    this.destroyRef.onDestroy(() => {
      bottomNavMq.removeEventListener('change', applyViewport);
      compactMq.removeEventListener('change', applyViewport);
      finePointerMq.removeEventListener('change', applyViewport);
    });
  }

  startOfLocalDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  /** Номер ISO-календарной недели (1–53). */
  private isoWeekNumber(date: Date): number {
    const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = utc.getUTCDay() || 7;
    utc.setUTCDate(utc.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
    return Math.ceil(((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
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

  lessonsForColumn(col: Date): CalendarLesson[] {
    return this.lessonsByDay().get(this.dayKey(col)) ?? [];
  }

  displayScheduledAt(lesson: Lesson): string {
    return lesson.scheduledAt;
  }

  calculateTop(scheduledAt: string): number {
    const d = new Date(scheduledAt);
    if (Number.isNaN(d.getTime())) {
      return 0;
    }
    return Math.max(0, this.minutesFromGridStart(d) * this.minuteHeightPx);
  }

  isNonWorkingDay(col: Date): boolean {
    return !this.profileSettings.isWorkingDay(col);
  }

  monthLessonsForDay(day: Date): CalendarLesson[] {
    return this.lessonsByDay().get(this.dayKey(day)) ?? [];
  }

  monthBadgeLessons(day: Date): CalendarLesson[] {
    return this.monthLessonsForDay(day).slice(0, 3);
  }

  monthHiddenLessonCount(day: Date): number {
    const total = this.monthLessonsForDay(day).length;
    return total > 3 ? total - 3 : 0;
  }

  monthLessonBadgeLabel(lesson: CalendarLesson): string {
    const student = this.students().find((s) => s._id === lesson.student_id);
    const name = student?.name?.trim() || '—';
    const scheduledAt = lesson.scheduledAt;
    if (!scheduledAt) {
      return name;
    }
    const date = new Date(scheduledAt);
    if (Number.isNaN(date.getTime())) {
      return name;
    }
    const time = new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
    return `${time} ${name}`;
  }

  monthLessonBadgeColor(lesson: CalendarLesson): string {
    return CalendarComponent.STATUS_BADGE_COLORS[lesson.status] ?? '#0369a1';
  }

  monthMoreLessonsLabel(count: number): string {
    return this.i18n.calendarUi().monthMoreLessons.replace('{count}', String(count));
  }

  private minutesFromGridStart(date: Date): number {
    return date.getHours() * 60 + date.getMinutes() - this.gridStartHour() * 60;
  }

  calculateHeight(duration: number): number {
    return Math.max(15, duration * this.minuteHeightPx);
  }

  formatHourLabel(hour: number): string {
    return `${String(hour).padStart(2, '0')}:00`;
  }

  formatColumnHeader(col: Date): string {
    const weekday = this.dateWeekdayFmt().format(col).replace(/\./g, '');
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
    if (
      target.closest('.cal-lesson-card') ||
      target.closest('.cal-day-header') ||
      this.dragActiveLessonId()
    ) {
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

    if (Math.abs(dx) < this.periodSwipeMinPx || Math.abs(dx) <= Math.abs(dy)) {
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
    const label = this.dateMonthYearFmt().format(this.currentDate());
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  lessonCountForDay(day: Date): number {
    return this.lessonsByDay().get(this.dayKey(day))?.length ?? 0;
  }

  /** Клик по заголовку дня или клетке месяца → режим «1 день» для выбранной даты. */
  openDayView(day: Date): void {
    const target = this.startOfLocalDay(day);
    const anchor = this.startOfLocalDay(this.currentDate());
    const direction = target.getTime() >= anchor.getTime() ? 'next' : 'prev';
    this.runPeriodTransition(direction, () => {
      this.currentDate.set(target);
      this.viewMode.set('1');
      this.modesMenuOpen.set(false);
    });
  }

  navPrev(): void {
    this.runPeriodTransition('prev', () => this.shiftCurrentDate(-1));
  }

  navNext(): void {
    this.runPeriodTransition('next', () => this.shiftCurrentDate(1));
  }

  goToToday(): void {
    this.runPeriodTransition(null, () => this.currentDate.set(new Date()));
  }

  setViewMode(mode: CalendarViewMode): void {
    if (mode === this.viewMode()) {
      return;
    }
    this.runPeriodTransition(null, () => {
      this.viewMode.set(mode);
      this.modesMenuOpen.set(false);
    });
  }

  onViewModeSelect(value: string): void {
    if (this.viewModes.includes(value as CalendarViewMode)) {
      this.setViewMode(value as CalendarViewMode);
    }
  }

  toggleModesMenu(): void {
    this.modesMenuOpen.update((open) => !open);
  }

  viewModeLabel(mode: CalendarViewMode): string {
    const t = this.i18n.calendarUi();
    const labels: Record<CalendarViewMode, string> = {
      '1': t.viewMode1,
      '3': t.viewMode3,
      '7': t.viewMode7,
      '30': t.viewMode30,
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
    this.studentsSidebarOpen.set(false);
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

  isPackageLastBalance(student: Student): boolean {
    return isPackageStudentWithLastBalance(student);
  }

  getStudentColor(studentId: string | null | undefined): string {
    if (!studentId) {
      return DEFAULT_STUDENT_BORDER_COLOR;
    }
    return (
      this.students().find((x) => x._id === studentId)?.color_hex ?? DEFAULT_STUDENT_BORDER_COLOR
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
    const t = this.i18n.calendarUi();
    if (minutes === 60) {
      return t.durationOneHour;
    }
    if (minutes === 90) {
      return `1.5 ${t.durationHourShort}`;
    }
    return `${minutes} ${t.durationMinShort}`;
  }

  selectDurationPreset(minutes: number): void {
    this.duration.set(minutes);
    this.durationChipMode.set('preset');
  }

  selectDurationCustom(): void {
    this.durationChipMode.set('custom');
  }

  recurrenceDraftShowsWeekdays = computed(() => {
    const draft = this.recurrenceDraft();
    if (draft.preset === 'weekly') {
      return true;
    }
    if (draft.preset === 'custom' && draft.customFreq === 'weekly') {
      return true;
    }
    return false;
  });

  recurrenceDraftShowsInterval = computed(() => this.recurrenceDraft().preset !== 'none');

  recurrenceDraftMonthlyHint = computed(() =>
    this.i18n
      .calendarUi()
      .recurrenceMonthlyOnDay.replace('{day}', this.recurrenceDraftMonthDay()),
  );

  recurrenceDraftIntervalUnit = computed(() => {
    const draft = this.recurrenceDraft();
    if (draft.preset === 'daily' || (draft.preset === 'custom' && draft.customFreq === 'daily')) {
      return 'days' as const;
    }
    if (draft.preset === 'weekly' || (draft.preset === 'custom' && draft.customFreq === 'weekly')) {
      return 'weeks' as const;
    }
    if (draft.preset === 'monthly' || (draft.preset === 'custom' && draft.customFreq === 'monthly')) {
      return 'months' as const;
    }
    return 'weeks' as const;
  });

  recurrenceDraftMonthDay = computed(() => {
    const scheduledAt = this.form.scheduledAt?.trim();
    if (!scheduledAt) {
      return '—';
    }
    return String(new Date(scheduledAt).getDate());
  });

  openRecurrenceModal(): void {
    this.recurrenceDraft.set(structuredClone(this.recurrenceConfig()));
    this.recurrenceModalOpen.set(true);
  }

  closeRecurrenceModal(): void {
    this.recurrenceModalOpen.set(false);
  }

  applyRecurrenceModal(): void {
    const draft = this.recurrenceDraft();
    if (draft.preset === 'weekly' || (draft.preset === 'custom' && draft.customFreq === 'weekly')) {
      if (draft.byDay.length === 0) {
        this.saveLessonError = this.i18n.calendarUi().recurrenceWeekdaysRequired;
        return;
      }
    }
    this.recurrenceConfig.set(structuredClone(draft));
    this.recurrenceModalOpen.set(false);
    this.saveLessonError = null;
  }

  onRecurrencePresetChange(value: string): void {
    const preset = value as RecurrencePreset;
    if (!['none', 'daily', 'weekly', 'monthly', 'custom'].includes(preset)) {
      return;
    }
    const anchor = this.scheduledAtAnchor();
    this.recurrenceDraft.set(configFromPreset(preset, anchor, this.recurrenceDraft()));
  }

  onRecurrenceCustomFreqChange(value: string): void {
    const customFreq = value as RecurrenceCustomFreq;
    this.recurrenceDraft.update((current) => ({ ...current, customFreq }));
  }

  onRecurrenceEndModeChange(value: string): void {
    const endMode = value as RecurrenceEndMode;
    this.recurrenceDraft.update((current) => ({ ...current, endMode }));
  }

  onRecurrenceIntervalChange(raw: string | number): void {
    const interval = Math.min(99, Math.max(1, Math.round(Number(raw) || 1)));
    this.recurrenceDraft.update((current) => ({ ...current, interval }));
  }

  onRecurrenceCountChange(raw: string | number): void {
    const count = Math.min(999, Math.max(1, Math.round(Number(raw) || 1)));
    this.recurrenceDraft.update((current) => ({ ...current, count }));
  }

  onRecurrenceUntilChange(value: string): void {
    this.recurrenceDraft.update((current) => ({
      ...current,
      untilDate: value?.trim() ? value.trim() : null,
    }));
  }

  isRecurrenceDraftDayActive(code: RruleWeekdayCode): boolean {
    return this.recurrenceDraft().byDay.includes(code);
  }

  toggleRecurrenceDraftDay(code: RruleWeekdayCode): void {
    this.recurrenceDraft.update((current) => {
      const set = new Set(current.byDay);
      if (set.has(code)) {
        set.delete(code);
      } else {
        set.add(code);
      }
      return { ...current, byDay: RRULE_WEEKDAY_CODES.filter((day) => set.has(day)) };
    });
  }

  private scheduledAtAnchor(): Date {
    const raw = this.form.scheduledAt?.trim();
    if (raw) {
      const parsed = new Date(raw);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  }

  onCustomDurationInput(value: string | number): void {
    const n = Math.round(Number(value));
    this.duration.set(
      Math.min(
        480,
        Math.max(5, Number.isNaN(n) ? CalendarComponent.DEFAULT_LESSON_DURATION_MIN : n),
      ),
    );
  }

  private static readonly CURRENCY_REGION: Record<string, string> = {
    EUR: 'EU',
    BYN: 'BY',
    PLN: 'PL',
    USD: 'US',
    RUB: 'RU',
  };

  lessonHasSnapshotRate(lesson: Lesson): boolean {
    return Number(lesson.lesson_price) > 0;
  }

  /** Компактная строка на низких карточках (< ~50 мин по высоте сетки). */
  lessonCardUseCompactMeta(lesson: Lesson): boolean {
    return lesson.lesson_duration < 50;
  }

  formatLessonRegion(lesson: Lesson): string {
    const tz =
      lesson.student_timezone?.trim() ||
      this.students()
        .find((s) => s._id === lesson.student_id)
        ?.timezone?.trim() ||
      '';
    if (tz) {
      return this.formatTimezoneLabel(tz);
    }
    return (
      CalendarComponent.CURRENCY_REGION[lesson.lesson_currency] ?? lesson.lesson_currency ?? '—'
    );
  }

  formatTimezoneLabel(tz: string): string {
    const parts = tz.split('/');
    if (parts.length >= 2) {
      return parts[parts.length - 1].replace(/_/g, ' ');
    }
    return tz;
  }

  formatLessonSnapshotRate(lesson: Lesson): string {
    if (!this.lessonHasSnapshotRate(lesson)) {
      return '—';
    }
    const formatted = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: lesson.lesson_currency || 'EUR',
      maximumFractionDigits: 0,
    }).format(Number(lesson.lesson_price));
    return `${formatted}${this.i18n.studentsUi().perLesson}`;
  }

  formatLessonDuration(minutes: number): string {
    const t = this.i18n.calendarUi();
    if (minutes >= 60 && minutes % 60 === 0) {
      const h = minutes / 60;
      return h === 1 ? t.durationOneHour : `${h} ${t.durationHourShort}`;
    }
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h} ${t.durationHourShort} ${m} ${t.durationMinShort}`;
    }
    return `${minutes} ${t.durationMinShort}`;
  }

  /** Ученик в форме изменён — при сохранении ставка переснимется на сервере. */
  editLessonStudentChanged(): boolean {
    const editing = this.editLessonTarget();
    if (!editing) {
      return false;
    }
    return this.form.student_id !== (editing.student_id ?? '');
  }

  selectedStudentForForm(): Student | undefined {
    const id = this.form.student_id?.trim();
    if (!id) {
      return undefined;
    }
    return this.students().find((s) => s._id === id);
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
    const fmt = new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${fmt.format(start)} — ${fmt.format(end)}`;
  }

  lessonCardClass(lesson: CalendarLesson): Record<string, boolean> {
    const focused = this.focusedStudentId();
    const dragging = this.dragActiveLessonId() === lesson._id;
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
    if (!preview?.scheduledAt || this.dragActiveLessonId() === null) {
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
    const offsetY = this.offsetYInColumn(event, target);
    const scheduledAt = this.isoFromDayAndOffset(this.dayKey(col), offsetY);
    this.openNewLessonAt(scheduledAt);
  }

  onLessonPointerDown(event: PointerEvent, lesson: CalendarLesson): void {
    // Desktop mouse uses native HTML5 DnD (dragstart/dragover/drop).
    // Keep pointer-driven drag only for touch/pen to avoid conflicts on PC.
    if (event.pointerType === 'mouse') {
      return;
    }

    if (
      lesson.isVirtualOccurrence ||
      !lesson.scheduledAt ||
      event.button !== 0 ||
      this.dragActiveLessonId()
    ) {
      return;
    }
    // Блокируем нативный drag на touch — иначе iOS/Android могут «зависнуть»
    // с html.cal-lesson-dragging и touch-action: none на всём экране.
    event.preventDefault();
    event.stopPropagation();

    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    try {
      card.setPointerCapture(event.pointerId);
    } catch {
      /* unsupported */
    }
    this.pointerSession = {
      lessonId: lesson._id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      grabOffsetX: event.clientX - rect.left,
      grabOffsetY: event.clientY - rect.top,
      originScheduledAt: lesson.scheduledAt,
      cardWidth: rect.width,
      cardHeight: rect.height,
      captureTarget: card,
    };
    this.installPointerListeners();
  }

  onLessonCardClick(event: Event, lesson: CalendarLesson): void {
    if (Date.now() < this.suppressLessonClickUntil || this.dragActiveLessonId()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.openEditLesson(lesson, event);
  }

  private installPointerListeners(): void {
    if (!isPlatformBrowser(this.platformId) || this.pointerMoveHandler) {
      return;
    }
    this.pointerMoveHandler = (event) => this.onDocumentPointerMove(event);
    this.pointerUpHandler = (event) => this.onDocumentPointerUp(event);
    this.pointerSafetyHandler = () => {
      if (this.document.visibilityState === 'visible') {
        return;
      }
      this.abortPointerDrag();
    };
    this.document.addEventListener('pointermove', this.pointerMoveHandler, { passive: false });
    this.document.addEventListener('pointerup', this.pointerUpHandler);
    this.document.addEventListener('pointercancel', this.pointerUpHandler);
    this.document.addEventListener('touchcancel', this.pointerSafetyHandler, { passive: true });
    window.addEventListener('blur', this.pointerSafetyHandler);
    this.document.addEventListener('visibilitychange', this.pointerSafetyHandler);
  }

  private clearPointerListeners(): void {
    if (!this.pointerMoveHandler) {
      return;
    }
    this.document.removeEventListener('pointermove', this.pointerMoveHandler);
    this.document.removeEventListener('pointerup', this.pointerUpHandler!);
    this.document.removeEventListener('pointercancel', this.pointerUpHandler!);
    if (this.pointerSafetyHandler) {
      this.document.removeEventListener('touchcancel', this.pointerSafetyHandler);
      window.removeEventListener('blur', this.pointerSafetyHandler);
      this.document.removeEventListener('visibilitychange', this.pointerSafetyHandler);
      this.pointerSafetyHandler = null;
    }
    this.pointerMoveHandler = null;
    this.pointerUpHandler = null;
  }

  /** Сброс зависшего touch-drag без сохранения переноса. */
  private abortPointerDrag(): void {
    if (!this.pointerSession && !this.dragActiveLessonId()) {
      return;
    }
    const session = this.pointerSession;
    if (session) {
      try {
        session.captureTarget.releasePointerCapture(session.pointerId);
      } catch {
        /* already released */
      }
    }
    const wasDragging = Boolean(this.dragActiveLessonId());
    this.clearPointerListeners();
    this.pointerSession = null;
    if (wasDragging) {
      this.clearDragUi();
      this.suppressLessonClickUntil = Date.now() + 450;
    }
  }

  private onDocumentPointerMove(event: PointerEvent): void {
    const session = this.pointerSession;
    if (!session || event.pointerId !== session.pointerId) {
      return;
    }

    const dx = event.clientX - session.startX;
    const dy = event.clientY - session.startY;

    if (!this.dragActiveLessonId()) {
      if (Math.hypot(dx, dy) < this.dragStartThresholdPx) {
        return;
      }
      this.beginLessonDrag(session);
    }

    event.preventDefault();
    this.updateDragAt(event.clientX, event.clientY, session);
  }

  private onDocumentPointerUp(event: PointerEvent): void {
    const session = this.pointerSession;
    if (!session || event.pointerId !== session.pointerId) {
      return;
    }

    const wasDragging = Boolean(this.dragActiveLessonId());
    const lesson = this.lessons().find((item) => item._id === session.lessonId);

    try {
      session.captureTarget.releasePointerCapture(session.pointerId);
    } catch {
      /* already released */
    }
    this.clearPointerListeners();
    this.pointerSession = null;

    if (!wasDragging) {
      return;
    }

    event.preventDefault();
    const preview = this.dragPreview();
    this.clearDragUi();
    this.suppressLessonClickUntil = Date.now() + 450;

    if (!lesson?.scheduledAt || !preview || preview.lessonId !== lesson._id) {
      return;
    }

    if (this.scheduleTimesEqual(lesson.scheduledAt, preview.scheduledAt)) {
      return;
    }

    if (this.shouldConfirmBotNotifyBeforeMove(lesson, preview.scheduledAt)) {
      this.dragMoveConfirm.set({ lesson, scheduledAt: preview.scheduledAt });
      return;
    }

    this.persistLessonMove(lesson, preview.scheduledAt);
  }

  private beginLessonDrag(session: LessonPointerSession): void {
    const lesson = this.lessons().find((item) => item._id === session.lessonId);
    if (!lesson?.scheduledAt) {
      return;
    }

    this.dragActiveLessonId.set(session.lessonId);
    this.dragOriginScheduledAt.set(session.originScheduledAt);
    this.dragPreview.set({ lessonId: session.lessonId, scheduledAt: session.originScheduledAt });
    this.draggedLesson.set(lesson);
    this.currentDropTime.set(session.originScheduledAt);
    this.dragGhost.set({
      x: session.startX - session.grabOffsetX,
      y: session.startY - session.grabOffsetY,
      width: session.cardWidth,
      height: session.cardHeight,
    });
    this.document.documentElement.classList.add(CALENDAR_DRAGGING_CLASS);

    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(12);
    }
  }

  private updateDragAt(clientX: number, clientY: number, session: LessonPointerSession): void {
    this.dragGhost.set({
      x: clientX - session.grabOffsetX,
      y: clientY - session.grabOffsetY,
      width: session.cardWidth,
      height: session.cardHeight,
    });
    this.updateDragPreviewFromPointer(session.lessonId, clientX, clientY);
    this.applyEdgeAutoScroll(clientY);
  }

  private clearDragUi(): void {
    this.dragActiveLessonId.set(null);
    this.dragOriginScheduledAt.set(null);
    this.dragPreview.set(null);
    this.dragGhost.set(null);
    this.draggedLesson.set(null);
    this.currentDropTime.set(null);
    this.document.documentElement.classList.remove(CALENDAR_DRAGGING_CLASS);
  }

  private clearNativeDragUi(): void {
    this.draggedLesson.set(null);
    this.currentDropTime.set(null);
    this.nativeDragState = null;
    this.dragActiveLessonId.set(null);
    this.dragOriginScheduledAt.set(null);
  }

  onLessonDragStart(event: DragEvent, lesson: CalendarLesson): void {
    if (!this.useNativeLessonDrag()) {
      event.preventDefault();
      return;
    }
    if (lesson.isVirtualOccurrence || !lesson.scheduledAt || !event.dataTransfer) {
      event.preventDefault();
      return;
    }
    this.nativeDragState = { lesson };
    this.draggedLesson.set(lesson);
    this.currentDropTime.set(lesson.scheduledAt);
    this.dragActiveLessonId.set(lesson._id);
    this.dragOriginScheduledAt.set(lesson.scheduledAt);
    this.document.documentElement.classList.add(CALENDAR_DRAGGING_CLASS);

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', lesson._id);
    // Hide the browser default semi-transparent drag image.
    event.dataTransfer.setDragImage(this.dragImagePixel, 0, 0);
  }

  onLessonDragEnd(): void {
    this.document.documentElement.classList.remove(CALENDAR_DRAGGING_CLASS);
    this.clearNativeDragUi();
  }

  onDayColumnDragOver(event: DragEvent, col: Date): void {
    if (!this.draggedLesson()) {
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    const columnEl = event.currentTarget as HTMLElement;
    const rect = columnEl.getBoundingClientRect();
    const offsetY = Math.max(0, Math.min(this.gridHeightPx(), event.clientY - rect.top));
    this.currentDropTime.set(this.isoFromDayAndOffset(this.dayKey(col), offsetY));
  }

  onDayColumnDrop(event: DragEvent): void {
    if (!this.nativeDragState) {
      return;
    }
    event.preventDefault();
    const lesson = this.nativeDragState.lesson;
    const dropTime = this.currentDropTime();
    this.onLessonDragEnd();

    if (!dropTime || !lesson.scheduledAt || this.scheduleTimesEqual(lesson.scheduledAt, dropTime)) {
      return;
    }
    if (this.shouldConfirmBotNotifyBeforeMove(lesson, dropTime)) {
      this.dragMoveConfirm.set({ lesson, scheduledAt: dropTime });
      return;
    }
    this.persistLessonMove(lesson, dropTime);
  }

  onScrollContainerDragOver(event: DragEvent): void {
    if (!this.draggedLesson()) {
      return;
    }
    event.preventDefault();
    this.applyEdgeAutoScroll(event.clientY);
  }

  showPhantomInColumn(col: Date): boolean {
    const drop = this.currentDropTime();
    return Boolean(this.draggedLesson() && drop && this.dayKey(col) === this.dayKey(new Date(drop)));
  }

  phantomTopForColumn(col: Date): number | null {
    if (!this.showPhantomInColumn(col)) {
      return null;
    }
    const drop = this.currentDropTime();
    if (!drop) {
      return null;
    }
    return this.calculateTop(drop);
  }

  dragMoveConfirmStudentName(): string {
    const pending = this.dragMoveConfirm();
    if (!pending?.lesson.student_id) {
      return this.i18n.calendarUi().studentFallback;
    }
    return this.getStudentName(pending.lesson.student_id);
  }

  billingConfirmStudentName(): string {
    const pending = this.billingConfirm();
    if (!pending?.payload.student_id) {
      return this.i18n.calendarUi().studentFallback;
    }
    return this.getStudentName(pending.payload.student_id);
  }

  billingConfirmBalanceAfterDeduct(): number {
    const pending = this.billingConfirm();
    if (!pending) {
      return 0;
    }
    const student = this.students().find((s) => s._id === pending.payload.student_id);
    const balance = Number(student?.balance_lessons ?? 0);
    return Math.max(0, balance - 1);
  }

  private dateWeekdayFmt(): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(this.i18n.localeId(), { weekday: 'short' });
  }

  private dateMonthYearFmt(): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      month: 'long',
      year: 'numeric',
    });
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
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  }

  private offsetYInColumn(event: MouseEvent, columnEl: HTMLElement): number {
    const rect = columnEl.getBoundingClientRect();
    const y = event.clientY - rect.top;
    return Math.max(0, Math.min(this.gridHeightPx(), y));
  }

  private updateDragPreviewFromPointer(lessonId: string, clientX: number, clientY: number): void {
    const columnEl = this.dayColumnAt(clientX, clientY);
    if (!columnEl) {
      return;
    }
    const day = columnEl.dataset['dayKey'];
    if (!day) {
      return;
    }
    const rect = columnEl.getBoundingClientRect();
    const offsetY = Math.max(0, Math.min(this.gridHeightPx(), clientY - rect.top));
    const scheduledAt = this.isoFromDayAndOffset(day, offsetY);
    this.dragPreview.set({ lessonId, scheduledAt });
    this.currentDropTime.set(scheduledAt);
  }

  private dayColumnAt(clientX: number, clientY: number): HTMLElement | null {
    const hit = this.document.elementFromPoint(clientX, clientY);
    return hit?.closest('.cal-day-column') as HTMLElement | null;
  }

  private createTransparentDragImage(): HTMLImageElement {
    const pixel =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    const img = new Image();
    img.src = pixel;
    return img;
  }

  private applyEdgeAutoScroll(clientY: number): void {
    const container = this.scrollContainerRef()?.nativeElement;
    if (!container) {
      return;
    }
    const rect = container.getBoundingClientRect();
    const topZone = rect.top + this.autoScrollEdgePx;
    const bottomZone = rect.bottom - this.autoScrollEdgePx;

    if (clientY < topZone) {
      const rawIntensity = (topZone - clientY) / this.autoScrollEdgePx;
      const easedIntensity = Math.pow(Math.min(1, Math.max(0, rawIntensity)), 1.6);
      const delta = Math.max(1, Math.round(this.autoScrollMaxStepPx * easedIntensity));
      container.scrollTop -= delta;
    } else if (clientY > bottomZone) {
      const rawIntensity = (clientY - bottomZone) / this.autoScrollEdgePx;
      const easedIntensity = Math.pow(Math.min(1, Math.max(0, rawIntensity)), 1.6);
      const delta = Math.max(1, Math.round(this.autoScrollMaxStepPx * easedIntensity));
      container.scrollTop += delta;
    }
  }

  private persistLessonMove(lesson: Lesson, scheduledAt: string): void {
    if (this.hasScheduleConflict(scheduledAt, lesson.lesson_duration, lesson._id, lesson.status)) {
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
            list.map((item) => (item._id === updated._id ? this.normalizeLesson(updated) : item)),
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
    this.clearDragUi();
    purgeStaleOverlayLayers(this.document);
    this.document.dispatchEvent(new CustomEvent(APP_OVERLAY_LAYER_OPEN));
    this.scheduleConflictMessage.set(message ?? this.i18n.calendarUi().scheduleConflict);
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
    if (status !== 'scheduled' || !scheduledAt) {
      return false;
    }

    const recurrence = this.buildRecurrencePayload(scheduledAt);
    const probe: CalendarLesson = {
      _id: excludeLessonId ?? '__probe__',
      student_id: null,
      status: 'scheduled',
      scheduledAt,
      lesson_duration: durationMinutes,
      lesson_price: 0,
      lesson_currency: 'EUR',
      reminder_sent: false,
      isRecurring: recurrence.isRecurring,
      startDate: recurrence.startDate,
      rrule: recurrence.rrule,
    };

    const anchor = new Date(scheduledAt);
    const rangeStart = this.startOfLocalDay(anchor);
    rangeStart.setDate(rangeStart.getDate() - 7);
    const rangeEnd = this.startOfLocalDay(anchor);
    rangeEnd.setDate(rangeEnd.getDate() + 7 * 26);
    rangeEnd.setHours(23, 59, 59, 999);

    const candidateStarts = recurrence.isRecurring
      ? expandLessonOccurrencesForConflictCheck(probe).map((d) => d.toISOString())
      : [scheduledAt];

    for (const candidateAt of candidateStarts) {
      const candidate = this.lessonInterval(candidateAt, durationMinutes);
      if (!candidate) {
        continue;
      }

      for (const lesson of this.lessons()) {
        if (excludeLessonId && lesson._id === excludeLessonId) {
          continue;
        }
        if (lesson.status !== 'scheduled' || !lesson.scheduledAt) {
          continue;
        }

        const otherStarts = lesson.isRecurring
          ? expandLessonOccurrencesForConflictCheck(lesson, 26).map((d) => d.toISOString())
          : [lesson.scheduledAt];

        for (const otherAt of otherStarts) {
          const other = this.lessonInterval(otherAt, lesson.lesson_duration);
          if (!other) {
            continue;
          }
          if (this.intervalsOverlap(candidate, other)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private buildRecurrencePayload(
    scheduledAt: string | null,
    _editing: CalendarLesson | null = this.editLessonTarget(),
  ): {
    isRecurring: boolean;
    startDate: string | null;
    rrule: string | null;
  } {
    const config = this.recurrenceConfig();
    const startDate = scheduledAt ? dayKey(new Date(scheduledAt)) : null;

    if (!isRecurrenceConfigActive(config) || !startDate) {
      return { isRecurring: false, startDate: null, rrule: null };
    }

    const rrule = buildRruleFromConfig(config, startDate);
    if (!rrule) {
      return { isRecurring: false, startDate: null, rrule: null };
    }

    return {
      isRecurring: true,
      startDate,
      rrule,
    };
  }

  private isRecurringSeries(
    lesson: CalendarLesson | null,
    payload?: Pick<LessonSavePayload, 'isRecurring' | 'rrule'>,
  ): boolean {
    if (payload?.isRecurring === false && !payload.rrule) {
      return false;
    }
    return Boolean(lesson?.isRecurring || lesson?.rrule || payload?.isRecurring || payload?.rrule);
  }

  private resolveOccurrenceDate(scheduledAt: string | null | undefined): string | null {
    const fromSignal = this.editingOccurrenceDate();
    if (fromSignal) {
      return fromSignal;
    }
    if (!scheduledAt) {
      return null;
    }
    const parsed = new Date(scheduledAt);
    return Number.isNaN(parsed.getTime()) ? null : dayKey(parsed);
  }

  private attachOccurrencePayload(
    payload: LessonSavePayload,
    editing: CalendarLesson | null,
  ): LessonSavePayload {
    const isSeries = this.isRecurringSeries(editing, payload);
    const occurrenceDate = this.resolveOccurrenceDate(payload.scheduledAt);
    if (!editing || !isSeries || !occurrenceDate) {
      return payload;
    }
    return {
      ...payload,
      occurrence_date: occurrenceDate,
      occurrence_status: payload.status,
      status: 'scheduled',
    };
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
    const maxMinutes = this.gridHeightPx() - 5;
    const rawMinutes = Math.max(0, Math.min(maxMinutes, offsetYPx / this.minuteHeightPx));
    const rounded = Math.round(rawMinutes / 15) * 15;
    const totalMinutes = this.gridStartHour() * 60 + rounded;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return new Date(y, m - 1, d, hours, minutes, 0, 0).toISOString();
  }

  private openNewLessonAt(scheduledAt: string): void {
    this.editLessonTarget.set(null);
    this.lessonFormStep.set(1);
    this.resetLessonForm();
    this.form.scheduledAt = scheduledAt;
    this.recurrenceConfig.set({ ...DEFAULT_RECURRENCE_CONFIG });
    const local = new Date(
      new Date(scheduledAt).getTime() - new Date().getTimezoneOffset() * 60000,
    );
    this.scheduledAtLocal.set(local.toISOString().slice(0, 16));
    this.saveLessonError = null;
    this.studentsLoadError = null;
    this.showLessonForm.set(true);
    this.ensureStudentsLoaded();
  }

  openEditLesson(lesson: CalendarLesson, clickEvent?: Event): void {
    if (Date.now() < this.suppressLessonClickUntil) {
      clickEvent?.preventDefault();
      clickEvent?.stopPropagation();
      return;
    }
    clickEvent?.stopPropagation();
    this.editLessonTarget.set(lesson);
    this.editingOccurrenceDate.set(
      lesson.scheduledAt && (lesson.isRecurring || lesson.rrule)
        ? dayKey(new Date(lesson.scheduledAt))
        : null,
    );
    this.lessonFormStep.set(1);
    this.saveLessonError = null;
    this.studentsLoadError = null;
    this.ensureStudentsLoaded();
    const mins = lesson.lesson_duration;
    this.duration.set(mins);
    this.durationChipMode.set(this.durationPresets.includes(mins) ? 'preset' : 'custom');
    if (lesson.isRecurring && lesson.rrule) {
      this.recurrenceConfig.set(
        parseRruleToConfig(lesson.rrule, lesson.scheduledAt ? new Date(lesson.scheduledAt) : null),
      );
    } else {
      this.recurrenceConfig.set({ ...DEFAULT_RECURRENCE_CONFIG });
    }
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
          err?.error?.message ?? err?.message ?? this.i18n.calendarUi().loadStudentsError;
      },
    });
  }

  closeLessonForm(): void {
    this.showLessonForm.set(false);
    this.editLessonTarget.set(null);
    this.editingOccurrenceDate.set(null);
    this.deletingLesson.set(false);
    this.deleteRecurringModalOpen.set(false);
    this.lessonFormStep.set(1);
  }

  goToNotesStep(): void {
    this.lessonFormStep.set(2);
  }

  backToMainStep(): void {
    this.lessonFormStep.set(1);
  }

  private resetLessonForm(): void {
    this.duration.set(this.profileSettings.workspace().defaultLessonDuration);
    this.durationChipMode.set('preset');
    this.recurrenceConfig.set({ ...DEFAULT_RECURRENCE_CONFIG });
    this.editingOccurrenceDate.set(null);
    this.scheduledAtLocal.set('');
    this.form = {
      student_id: '',
      status: 'scheduled',
      notes: '',
      scheduledAt: '',
    };
  }

  private clampedDurationMinutes(raw?: number): number {
    const minutes = raw !== undefined ? Number(raw) : Math.round(Number(this.duration()));
    if (Number.isNaN(minutes) || minutes < 5) {
      return CalendarComponent.DEFAULT_LESSON_DURATION_MIN;
    }
    return Math.min(480, Math.max(5, Math.round(minutes)));
  }

  private refreshStudentsList(): void {
    this.studentSvc.getAll().subscribe({
      next: (list) => this.students.set(list),
      error: () => {
        /* keep previous list */
      },
    });
  }

  private loadLessons(): void {
    this.lessonsSvc.getAll().subscribe({
      next: (data) => {
        this.lessons.set(
          data.filter((l) => Boolean(l.scheduledAt)).map((l) => this.normalizeLesson(l)),
        );
        this.loadError = null;
        this.hasLoaded.set(true);
        this.scrollGridToNow();
      },
      error: (err) => {
        this.loadError =
          err?.error?.message ?? err?.message ?? this.i18n.calendarUi().loadLessonsError;
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
      student_timezone: raw.student_timezone,
      reminder_sent: raw.reminder_sent ?? false,
      balance_debited: Boolean(
        (raw as LessonApiRow & { balance_debited?: boolean }).balance_debited,
      ),
      billing_processed: Boolean(
        (raw as LessonApiRow & { billing_processed?: boolean }).billing_processed ??
        (raw as LessonApiRow & { balance_debited?: boolean }).balance_debited,
      ),
      notes: raw.notes,
      tutor: raw.tutor,
      student_name: raw.student_name,
      title: raw.title,
      isRecurring:
        Boolean((raw as LessonApiRow & { isRecurring?: boolean }).isRecurring) ||
        Boolean((raw as LessonApiRow & { rrule?: string | null }).rrule),
      startDate: (raw as LessonApiRow & { startDate?: string | null }).startDate ?? null,
      rrule: (raw as LessonApiRow & { rrule?: string | null }).rrule ?? null,
      exdates: (raw as LessonApiRow & { exdates?: string[] }).exdates ?? [],
      completedDates:
        (raw as LessonApiRow & { completedDates?: string[] }).completedDates ?? [],
    };
  }

  saveLesson(): void {
    this.saveLessonError = null;
    if (!this.form.student_id?.trim()) {
      this.saveLessonError = this.i18n.calendarUi().selectStudentError;
      return;
    }

    const duration = this.clampedDurationMinutes();
    const scheduledAt = this.form.scheduledAt?.trim() || null;
    const editing = this.editLessonTarget();
    const excludeId = editing?._id ?? null;

    if (this.hasScheduleConflict(scheduledAt, duration, excludeId, this.form.status)) {
      this.openScheduleConflict();
      return;
    }

    let basePayload: LessonSavePayload = {
      student_id: this.form.student_id,
      lesson_duration: duration,
      status: this.form.status,
      notes: this.form.notes?.trim() || undefined,
      scheduledAt,
      manual_completion: true,
      ...this.buildRecurrencePayload(scheduledAt, editing),
    };
    basePayload = this.attachOccurrencePayload(basePayload, editing);

    const billingPreviousStatus =
      editing && this.isRecurringSeries(editing, basePayload)
        ? editing.status
        : editing?.status;

    if (this.needsBillingDecision(this.form.status, billingPreviousStatus)) {
      purgeStaleOverlayLayers(this.document);
      this.document.dispatchEvent(new CustomEvent(APP_OVERLAY_LAYER_OPEN));
      this.showLessonForm.set(false);
      this.billingConfirm.set({ payload: basePayload, editing: editing ?? null });
      return;
    }

    this.persistLesson(basePayload, editing, false, null, billingPreviousStatus);
  }

  cancelBillingConfirm(): void {
    this.billingConfirm.set(null);
    this.closeLessonForm();
  }

  confirmBillingKeep(): void {
    const pending = this.billingConfirm();
    if (!pending) {
      return;
    }
    this.billingConfirm.set(null);
    this.persistLesson(pending.payload, pending.editing, false, pending);
  }

  confirmBillingDeduct(): void {
    const pending = this.billingConfirm();
    if (!pending) {
      return;
    }
    this.billingConfirm.set(null);
    this.persistLesson(pending.payload, pending.editing, true, pending);
  }

  private isMissedOrCanceledStatus(status: LessonStatus): boolean {
    return status === 'missed' || status === 'canceled';
  }

  private needsBillingDecision(nextStatus: LessonStatus, previousStatus?: LessonStatus): boolean {
    if (!this.isMissedOrCanceledStatus(nextStatus)) {
      return false;
    }
    if (previousStatus === undefined) {
      return true;
    }
    return !this.isMissedOrCanceledStatus(previousStatus);
  }

  private withBillingFlag<T extends { status: LessonStatus }>(
    payload: T,
    previousStatus: LessonStatus | undefined,
    shouldDeduct: boolean,
  ): T & { should_deduct_balance?: boolean } {
    if (!this.needsBillingDecision(payload.status, previousStatus)) {
      return payload;
    }
    return { ...payload, should_deduct_balance: shouldDeduct };
  }

  private persistLesson(
    payload: LessonSavePayload,
    editing: Lesson | null,
    shouldDeduct: boolean,
    billingRestore: {
      payload: LessonSavePayload;
      editing: Lesson | null;
    } | null = null,
    previousStatusForBilling?: LessonStatus,
  ): void {
    this.savingLesson.set(true);
    const previousStatus = previousStatusForBilling ?? editing?.status;
    const body = this.withBillingFlag(payload, previousStatus, shouldDeduct);

    if (editing) {
      this.lessonsSvc.update(editing._id, body).subscribe({
        next: (updated) => {
          this.lessons.update((list) =>
            list.map((l) => (l._id === updated._id ? this.normalizeLesson(updated) : l)),
          );
          this.refreshStudentsList();
          this.savingLesson.set(false);
          this.closeLessonForm();
        },
        error: (err: HttpErrorResponse) => {
          this.savingLesson.set(false);
          this.restoreBillingOnSaveError(billingRestore);
          this.handleLessonSaveError(err);
        },
      });
      return;
    }

    this.lessonsSvc.create(body).subscribe({
      next: (created) => {
        this.lessons.update((list) => [...list, this.normalizeLesson(created)]);
        this.refreshStudentsList();
        this.savingLesson.set(false);
        this.closeLessonForm();
      },
      error: (err: HttpErrorResponse) => {
        this.savingLesson.set(false);
        this.restoreBillingOnSaveError(billingRestore);
        this.handleLessonSaveError(err);
      },
    });
  }

  private restoreBillingOnSaveError(
    billingRestore: {
      payload: LessonSavePayload;
      editing: Lesson | null;
    } | null,
  ): void {
    if (!billingRestore) {
      return;
    }
    this.billingConfirm.set(billingRestore);
    this.showLessonForm.set(true);
  }

  private handleLessonSaveError(err: HttpErrorResponse): void {
    if (err.status === 409) {
      this.openScheduleConflict();
      return;
    }
    this.saveLessonError = this.formatLessonSaveError(err);
  }

  private formatLessonSaveError(err: HttpErrorResponse): string {
    return (
      err?.error?.message ??
      err?.error?.error ??
      err?.message ??
      this.i18n.calendarUi().saveLessonError
    );
  }

  deleteLesson(): void {
    const target = this.editLessonTarget();
    if (!target?._id) {
      return;
    }
    if (target.isRecurring) {
      this.deleteRecurringModalOpen.set(true);
      return;
    }
    if (!window.confirm(this.i18n.calendarUi().deleteLessonConfirm)) {
      return;
    }
    this.executeDeleteSeries(target._id);
  }

  closeDeleteRecurringModal(): void {
    this.deleteRecurringModalOpen.set(false);
  }

  confirmDeleteRecurringOccurrence(): void {
    const target = this.editLessonTarget();
    const occurrenceDate =
      this.editingOccurrenceDate() ??
      (target?.scheduledAt ? dayKey(new Date(target.scheduledAt)) : null);
    if (!target?._id || !occurrenceDate) {
      return;
    }
    this.deletingLesson.set(true);
    this.saveLessonError = null;
    this.lessonsSvc.delete(target._id, { scope: 'occurrence', occurrenceDate }).subscribe({
      next: (result) => {
        if (result && typeof result === 'object' && '_id' in result) {
          this.lessons.update((list) =>
            list.map((l) =>
              l._id === (result as Lesson)._id ? this.normalizeLesson(result as Lesson) : l,
            ),
          );
        }
        this.deletingLesson.set(false);
        this.closeDeleteRecurringModal();
        this.closeLessonForm();
      },
      error: (err) => {
        this.deletingLesson.set(false);
        this.saveLessonError =
          err?.error?.message ?? err?.message ?? this.i18n.calendarUi().deleteLessonError;
      },
    });
  }

  confirmDeleteRecurringSeries(): void {
    const id = this.editLessonTarget()?._id;
    if (!id) {
      return;
    }
    this.closeDeleteRecurringModal();
    if (!window.confirm(this.i18n.calendarUi().deleteLessonConfirm)) {
      return;
    }
    this.executeDeleteSeries(id);
  }

  private executeDeleteSeries(id: string): void {
    this.deletingLesson.set(true);
    this.saveLessonError = null;
    this.lessonsSvc.delete(id).subscribe({
      next: () => {
        this.lessons.update((list) => list.filter((l) => l._id !== id));
        this.deletingLesson.set(false);
        this.closeLessonForm();
      },
      error: (err) => {
        this.deletingLesson.set(false);
        this.saveLessonError =
          err?.error?.message ?? err?.message ?? this.i18n.calendarUi().deleteLessonError;
      },
    });
  }
}
