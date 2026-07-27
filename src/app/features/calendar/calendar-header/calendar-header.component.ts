import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import type { LessonStatus } from '@interfaces';

export type CalendarHeaderViewMode = '1' | '3' | '7' | '30';

export interface CalendarHeaderViewModeOption {
  value: CalendarHeaderViewMode;
  label: string;
}

export interface CalendarStatusCounts {
  scheduled: number;
  completed: number;
  missed: number;
  canceled: number;
}

export interface CalendarStatusChip {
  key: LessonStatus;
  label: string;
  count: number;
  empty: boolean;
  active: boolean;
}

@Component({
  selector: 'app-calendar-header',
  standalone: true,
  templateUrl: './calendar-header.component.html',
  styleUrl: './calendar-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cal-header-host',
  },
})
export class CalendarHeaderComponent {
  readonly weekLabel = input.required<string>();
  readonly rangeLabel = input<string | null>(null);
  readonly title = input('');
  readonly showTitle = input(true);

  readonly todayLabel = input.required<string>();
  readonly todayDay = input.required<string>();
  readonly prevLabel = input.required<string>();
  readonly nextLabel = input.required<string>();
  readonly studentsLabel = input.required<string>();
  readonly modeDrawerLabel = input.required<string>();
  readonly statusLegendAria = input.required<string>();

  readonly statusScheduled = input.required<string>();
  readonly statusCompleted = input.required<string>();
  readonly statusMissed = input.required<string>();
  readonly statusCanceled = input.required<string>();

  /** Агрегаты статусов только за Active Date Range (родитель считает из gridLessons). */
  readonly statusCounts = input<CalendarStatusCounts>({
    scheduled: 0,
    completed: 0,
    missed: 0,
    canceled: 0,
  });

  /** Активный фильтр статуса сетки (null = без фильтра). */
  readonly activeStatus = input<LessonStatus | null>(null);

  readonly viewMode = input<CalendarHeaderViewMode>('7');
  readonly viewModeOptions = input<CalendarHeaderViewModeOption[]>([]);

  readonly modesMenuOpen = input(false);
  readonly studentsSidebarOpen = input(false);

  readonly burgerClick = output<void>();
  readonly todayClick = output<void>();
  readonly prevClick = output<void>();
  readonly nextClick = output<void>();
  readonly studentsClick = output<void>();
  readonly viewModeChange = output<CalendarHeaderViewMode>();
  readonly statusChipClick = output<LessonStatus>();

  readonly statusChips = computed((): CalendarStatusChip[] => {
    const counts = this.statusCounts();
    const active = this.activeStatus();
    const items: Array<Omit<CalendarStatusChip, 'empty' | 'active'>> = [
      { key: 'scheduled', label: this.statusScheduled(), count: counts.scheduled },
      { key: 'completed', label: this.statusCompleted(), count: counts.completed },
      { key: 'missed', label: this.statusMissed(), count: counts.missed },
      { key: 'canceled', label: this.statusCanceled(), count: counts.canceled },
    ];
    return items.map((item) => ({
      ...item,
      empty: item.count === 0,
      active: active === item.key,
    }));
  });

  modeShortLabel(mode: CalendarHeaderViewMode): string {
    return mode;
  }

  selectViewMode(mode: CalendarHeaderViewMode): void {
    if (mode !== this.viewMode()) {
      this.viewModeChange.emit(mode);
    }
  }

  onStatusChipClick(status: LessonStatus): void {
    this.statusChipClick.emit(status);
  }
}
