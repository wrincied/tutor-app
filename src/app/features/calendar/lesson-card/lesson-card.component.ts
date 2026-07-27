import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import type { LessonStatus } from '@interfaces';

const STATUS_THEME: Record<
  LessonStatus,
  { accent: string; tint: string; ink: string }
> = {
  scheduled: {
    accent: 'rgb(14 165 233)',
    tint: 'rgb(240 249 255)',
    ink: 'rgb(12 74 110)',
  },
  completed: {
    accent: 'rgb(16 185 129)',
    tint: 'rgb(236 253 245)',
    ink: 'rgb(6 78 59)',
  },
  missed: {
    accent: 'rgb(245 158 11)',
    tint: 'rgb(255 251 235)',
    ink: 'rgb(146 64 14)',
  },
  canceled: {
    accent: 'rgb(239 68 68)',
    tint: 'rgb(254 242 242)',
    ink: 'rgb(153 27 27)',
  },
};

@Component({
  selector: 'app-lesson-card',
  standalone: true,
  templateUrl: './lesson-card.component.html',
  styleUrl: './lesson-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cal-lesson-card',
    '[attr.data-status]': 'status()',
    '[class.cal-lesson-card--scheduled]': 'status() === "scheduled"',
    '[class.cal-lesson-card--completed]': 'status() === "completed"',
    '[class.cal-lesson-card--missed]': 'status() === "missed"',
    '[class.cal-lesson-card--canceled]': 'status() === "canceled"',
    '[class.cal-lesson-card--last-paid]': 'lastPaid()',
    '[class.cal-lesson-card--dragging]': 'dragging()',
    '[class.cal-lesson-card--focus-active]': 'focusActive()',
    '[class.cal-lesson-card--focus-dim]': 'focusDim()',
    '[class.cal-lesson-card--route-highlight]': 'routeHighlight()',
    '[style.--status-accent]': 'theme().accent',
    '[style.--status-tint]': 'theme().tint',
    '[style.--status-ink]': 'theme().ink',
    '[style.--student-color]': 'studentColor()',
    '[attr.draggable]': 'nativeDraggable() ? true : null',
    '(click)': 'cardClick.emit($event)',
    '(pointerdown)': 'cardPointerDown.emit($event)',
    '(dragstart)': 'cardDragStart.emit($event)',
    '(dragend)': 'cardDragEnd.emit($event)',
  },
})
export class LessonCardComponent {
  readonly status = input<LessonStatus>('scheduled');
  readonly studentName = input.required<string>();
  readonly studentColor = input('rgb(148 163 184)');
  readonly compactMeta = input(false);
  /** Мобильная плотность: без подписей «Регион/Ставка/Длит.». */
  readonly denseMobile = input(false);
  readonly regionLabel = input('');
  readonly rateLabel = input('');
  readonly durationLabel = input('');
  readonly regionText = input('');
  readonly rateText = input('');
  readonly durationText = input('');
  readonly lastPaid = input(false);
  readonly dragging = input(false);
  readonly focusActive = input(false);
  readonly focusDim = input(false);
  readonly routeHighlight = input(false);
  readonly nativeDraggable = input(false);

  readonly cardClick = output<MouseEvent>();
  readonly cardPointerDown = output<PointerEvent>();
  readonly cardDragStart = output<DragEvent>();
  readonly cardDragEnd = output<DragEvent>();

  readonly theme = computed(() => STATUS_THEME[this.status()] ?? STATUS_THEME.scheduled);
}
