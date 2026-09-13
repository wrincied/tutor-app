import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import type { StudentCardData, StudentCardLabels } from './student-card.model';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './student-card.component.html',
  styleUrl: './student-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'student-card',
    role: 'listitem',
    tabindex: '0',
    '[class.student-card--highlight]': 'highlighted()',
    '[attr.data-student-id]': 'student().id',
    '[attr.aria-label]': 'student().name',
    '(click)': 'onCardClick($event)',
    '(keydown)': 'onCardKeydown($event)',
  },
})
export class StudentCardComponent {
  readonly student = input.required<StudentCardData>();
  readonly labels = input.required<StudentCardLabels>();
  readonly highlighted = input(false);

  readonly openDetails = output<string>();
  readonly topUp = output<string>();
  readonly toggleNotifications = output<string>();
  readonly tgConnect = output<string>();

  readonly rateText = computed(() => {
    const s = this.student();
    const unit = s.rateType === 'lesson' ? this.labels().perLesson : this.labels().perHour;
    return `${s.rate} ${s.currency} ${unit}`;
  });

  readonly balanceUnit = computed(() => {
    const s = this.student();
    return s.rateType === 'lesson' ? this.labels().unitLesson : this.labels().unitHour;
  });

  readonly balanceValue = computed(() => {
    const value = this.student().remainingLessons;
    return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
  });

  readonly balanceTone = computed((): 'empty' | 'warning' | 'normal' => {
    const balance = this.student().remainingLessons;
    if (balance <= 0) {
      return 'empty';
    }
    if (balance <= 2) {
      return 'warning';
    }
    return 'normal';
  });

  readonly lastPaymentText = computed(() => this.student().lastPaymentDate?.trim() || '—');

  onCardClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button')) {
      return;
    }
    this.openDetails.emit(this.student().id);
  }

  onCardKeydown(event: KeyboardEvent): void {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.openDetails.emit(this.student().id);
  }

  onOpenDetails(event: Event): void {
    event.stopPropagation();
    this.openDetails.emit(this.student().id);
  }

  onTopUp(event: Event): void {
    event.stopPropagation();
    this.topUp.emit(this.student().id);
  }

  onToggleNotifications(event: Event): void {
    event.stopPropagation();
    this.toggleNotifications.emit(this.student().id);
  }

  onTgConnect(event: Event): void {
    event.stopPropagation();
    this.tgConnect.emit(this.student().id);
  }
}
