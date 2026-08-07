import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import type {
  UserVacationSettings,
  UserWorkingHoursSettings,
  WorkspaceLessonDuration,
} from '@interfaces';
import {
  WORKSPACE_LESSON_DURATIONS,
  normalizeVacation,
  normalizeWorkingHours,
  type IsoWeekday,
} from '../../core/utils/user-workspace-settings';
import { I18nService } from '../../core/services/i18n.service';
import { UserProfileSettingsService } from '../../core/services/user-profile-settings.service';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';
import { AppDateRangeComponent } from '../../shared/app-date-input';

const ISO_WEEKDAYS: readonly IsoWeekday[] = [1, 2, 3, 4, 5, 6, 7];
const DAY_WIDTH_PX = 28;

type TimelineMonth = { key: string; label: string; days: number };
type TimelineDay = {
  key: string;
  dayNum: number;
  weekend: boolean;
  today: boolean;
  dateMs: number;
};
type TimelineRange = {
  leftPx: number;
  widthPx: number;
  label: string;
  caption: string;
  title: string;
};

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [FormsModule, AppSelectComponent, AppDateRangeComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
})
export class WorkspaceComponent implements OnInit, AfterViewInit {
  readonly i18n = inject(I18nService);
  readonly profileSettings = inject(UserProfileSettingsService);
  private readonly timelineScroller = viewChild<ElementRef<HTMLElement>>('timelineScroller');

  readonly isoWeekdays = ISO_WEEKDAYS;
  readonly timelineDayWidth = DAY_WIDTH_PX;
  loading = signal(true);
  saving = signal(false);
  saved = signal(false);
  error = signal<string | null>(null);

  duration: WorkspaceLessonDuration = 60;
  hoursStart = '08:00';
  hoursEnd = '21:00';
  workingDays: IsoWeekday[] = [1, 2, 3, 4, 5];

  vacationEnabled = false;
  vacationStart = '';
  vacationEnd = '';
  vacationMessage = '';

  durationOptions = computed((): AppSelectOption[] =>
    WORKSPACE_LESSON_DURATIONS.map((value) => ({
      value: String(value),
      label: `${value} ${this.i18n.calendarUi().durationMinShort}`,
    })),
  );

  workingHourOptions = computed((): AppSelectOption[] =>
    this.profileSettings.hourSelectOptions.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
  );

  weekdayLabels = computed(() => {
    const t = this.i18n.calendarUi();
    return {
      1: t.weekdayMon,
      2: t.weekdayTue,
      3: t.weekdayWed,
      4: t.weekdayThu,
      5: t.weekdayFri,
      6: t.weekdaySat,
      7: t.weekdaySun,
    } as Record<IsoWeekday, string>;
  });

  ngOnInit(): void {
    this.profileSettings.loadProfile().subscribe({
      next: () => {
        this.applyDraftFromProfile();
        this.loading.set(false);
        queueMicrotask(() => this.scrollTimelineToToday());
      },
      error: () => this.loading.set(false),
    });
  }

  ngAfterViewInit(): void {
    if (!this.loading()) {
      queueMicrotask(() => this.scrollTimelineToToday());
    }
  }

  /** Day-grid window: from month start through +~4 months, expanded for vacation. */
  timelineWindow(): { start: Date; end: Date; days: TimelineDay[] } {
    const now = new Date();
    const todayKey = this.toDayKey(now);
    let start = new Date(now.getFullYear(), now.getMonth(), 1);
    let end = new Date(now.getFullYear(), now.getMonth() + 4, 0);

    if (this.vacationStart) {
      const vacStart = new Date(`${this.vacationStart}T12:00:00`);
      if (Number.isFinite(vacStart.getTime()) && vacStart < start) {
        start = new Date(vacStart.getFullYear(), vacStart.getMonth(), 1);
      }
    }
    if (this.vacationEnd) {
      const vacEnd = new Date(`${this.vacationEnd}T12:00:00`);
      if (Number.isFinite(vacEnd.getTime()) && vacEnd > end) {
        end = new Date(vacEnd.getFullYear(), vacEnd.getMonth() + 1, 0);
      }
    }

    const days: TimelineDay[] = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    while (cursor <= end) {
      const jsDay = cursor.getDay();
      const key = this.toDayKey(cursor);
      days.push({
        key,
        dayNum: cursor.getDate(),
        weekend: jsDay === 0 || jsDay === 6,
        today: key === todayKey,
        dateMs: cursor.getTime(),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return { start, end, days };
  }

  timelineDays(): TimelineDay[] {
    return this.timelineWindow().days;
  }

  timelineMonths(): TimelineMonth[] {
    this.i18n.lang();
    const days = this.timelineDays();
    if (days.length === 0) {
      return [];
    }
    const months: TimelineMonth[] = [];
    let currentKey = '';
    for (const day of days) {
      const d = new Date(day.dateMs);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (key !== currentKey) {
        months.push({
          key,
          label: new Intl.DateTimeFormat(this.i18n.localeId(), {
            month: 'long',
            year: 'numeric',
          }).format(d),
          days: 1,
        });
        currentKey = key;
      } else {
        months[months.length - 1].days += 1;
      }
    }
    return months;
  }

  timelineCanvasWidth(): number {
    return this.timelineDays().length * DAY_WIDTH_PX;
  }

  timelineRange(): TimelineRange | null {
    this.i18n.lang();
    if (!this.vacationEnabled || !this.vacationStart || !this.vacationEnd) {
      return null;
    }
    const days = this.timelineDays();
    if (days.length === 0) {
      return null;
    }

    const startIdx = days.findIndex((d) => d.key >= this.vacationStart);
    let endIdx = -1;
    for (let i = days.length - 1; i >= 0; i -= 1) {
      if (days[i].key <= this.vacationEnd) {
        endIdx = i;
        break;
      }
    }
    if (startIdx < 0 || endIdx < 0 || endIdx < startIdx) {
      return null;
    }

    const label =
      this.vacationMessage.trim().split(/\n/)[0]?.trim().slice(0, 28) ||
      this.i18n.accountUi().vacationTimelineDefault;
    const rangeText = `${this.formatDay(this.vacationStart)} – ${this.formatDay(this.vacationEnd)}`;

    return {
      leftPx: startIdx * DAY_WIDTH_PX + 2,
      widthPx: Math.max(DAY_WIDTH_PX - 4, (endIdx - startIdx + 1) * DAY_WIDTH_PX - 4),
      label,
      caption: `${label} (${rangeText})`,
      title: rangeText,
    };
  }

  todayLineLeftPx(): number | null {
    const idx = this.timelineDays().findIndex((d) => d.today);
    if (idx < 0) {
      return null;
    }
    return idx * DAY_WIDTH_PX + DAY_WIDTH_PX / 2;
  }

  timelineAriaLabel(): string {
    const range = this.timelineRange();
    return range?.caption ?? this.i18n.accountUi().vacationTimelineEmpty;
  }

  scrollTimelineToToday(): void {
    const el = this.timelineScroller()?.nativeElement;
    if (!el) {
      return;
    }
    const idx = this.timelineDays().findIndex((d) => d.today);
    if (idx < 0) {
      return;
    }
    const target = idx * DAY_WIDTH_PX - el.clientWidth / 2 + DAY_WIDTH_PX / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }

  onDurationChange(value: string): void {
    this.duration = Number(value) as WorkspaceLessonDuration;
  }

  toggleWorkingDay(day: IsoWeekday): void {
    const set = new Set(this.workingDays);
    if (set.has(day)) {
      set.delete(day);
    } else {
      set.add(day);
    }
    const next = [...set].sort((a, b) => a - b) as IsoWeekday[];
    this.workingDays = next.length > 0 ? next : [day];
  }

  isWorkingDaySelected(day: IsoWeekday): boolean {
    return this.workingDays.includes(day);
  }

  saveAll(): void {
    const t = this.i18n.accountUi();
    this.error.set(null);
    this.saved.set(false);

    const vacation: UserVacationSettings = normalizeVacation({
      enabled: this.vacationEnabled,
      startDate: this.vacationStart,
      endDate: this.vacationEnd,
      message: this.vacationMessage,
    });

    if (vacation.enabled && (!vacation.startDate || !vacation.endDate)) {
      this.error.set(t.vacationDatesRequired);
      return;
    }
    if (vacation.enabled && vacation.endDate < vacation.startDate) {
      this.error.set(t.vacationDatesInvalid);
      return;
    }

    const workingHours: UserWorkingHoursSettings = normalizeWorkingHours({
      start: this.hoursStart,
      end: this.hoursEnd,
      days: this.workingDays,
    });

    this.saving.set(true);
    this.profileSettings
      .saveWorkspaceSettings({
        workspace: {
          ...this.profileSettings.workspace(),
          defaultLessonDuration: this.duration,
        },
        workingHours,
        vacation,
      })
      .subscribe({
        next: () => {
          this.applyDraftFromProfile();
          this.saving.set(false);
          this.saved.set(true);
          window.setTimeout(() => this.saved.set(false), 2200);
        },
        error: () => {
          this.saving.set(false);
          this.error.set(t.workspaceSaveError);
        },
      });
  }

  private toDayKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private formatDay(iso: string): string {
    const time = Date.parse(`${iso}T12:00:00`);
    if (!Number.isFinite(time)) {
      return iso;
    }
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(time));
  }

  private applyDraftFromProfile(): void {
    const workspace = this.profileSettings.workspace();
    const hours = this.profileSettings.workingHours();
    const vacation = this.profileSettings.vacation();
    this.duration = workspace.defaultLessonDuration;
    this.hoursStart = hours.start;
    this.hoursEnd = hours.end;
    this.workingDays = [...hours.days];
    this.vacationEnabled = vacation.enabled;
    this.vacationStart = vacation.startDate;
    this.vacationEnd = vacation.endDate;
    this.vacationMessage = vacation.message;
  }
}
