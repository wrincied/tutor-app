import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import type { FinanceSummary, Lesson, Student, UserProfile } from '@interfaces';
import { environment } from '../../../environments/environment';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { FinanceService } from '../../core/services/finance.service';
import { I18nService } from '../../core/services/i18n.service';
import { LessonService } from '../../core/services/lesson.service';
import { StudentService } from '../../core/services/student.service';
import { UserService } from '../../core/services/user.service';
import { financeTodayRange } from '../../core/utils/finance-period';
import { formatMoneyWithCode } from '../../core/utils/format-currency';
import {
  findNextLesson,
  lessonsForDay,
  overdueLessonCount,
  studentsLowBalance,
  type HomeLessonRow,
} from '../../core/utils/home-dashboard';

const BETA_NOTICE_STORAGE_KEY = 'simple4u_beta_notice_v1';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DecimalPipe, RouterLink, AppDialogComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly userSvc = inject(UserService);
  private readonly financeSvc = inject(FinanceService);
  private readonly lessonSvc = inject(LessonService);
  private readonly studentSvc = inject(StudentService);
  readonly i18n = inject(I18nService);
  /** True only for `ng serve --configuration=design` (:4300). */
  readonly designMode = environment.designMode === true;


  profile = signal<UserProfile | null>(null);
  summary = signal<FinanceSummary | null>(null);
  todayLessons = signal<HomeLessonRow[]>([]);
  lowBalanceStudents = signal<Student[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  betaOpen = signal(false);

  private readonly now = signal(new Date());

  displayName = computed(() => {
    const profile = this.profile();
    const first = profile?.first_name?.trim();
    if (first) {
      return first;
    }
    const full = profile?.name?.trim();
    if (full) {
      return full.split(/\s+/)[0] ?? full;
    }
    return '';
  });

  greeting = computed(() => {
    const t = this.i18n.homeUi();
    const name = this.displayName();
    return name ? t.greetingNamed.replace('{name}', name) : t.greetingAnonymous;
  });

  todayDateLabel = computed(() =>
    new Intl.DateTimeFormat(this.i18n.localeId(), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(this.now()),
  );

  todayLessonCount = computed(() => this.summary()?.totals.lessonCount ?? 0);
  todayCompletedCount = computed(() => this.summary()?.totals.completedLessonCount ?? 0);
  todayScheduledCount = computed(() => this.summary()?.totals.scheduledLessonCount ?? 0);
  todayHours = computed(() => this.summary()?.totals.totalLessonHours ?? 0);

  todayIncome = computed(() => {
    const income = this.summary()?.income;
    if (!income) {
      return 0;
    }
    return income.combinedIncome ?? income.totalIncome + income.scheduledIncome;
  });

  todayIncomeLabel = computed(() => {
    const currency = this.summary()?.currency ?? 'EUR';
    return formatMoneyWithCode(this.todayIncome(), currency, this.i18n.localeId(), 0);
  });

  nextLesson = computed(() => findNextLesson(this.todayLessons(), this.now()));
  overdueCount = computed(() => overdueLessonCount(this.todayLessons(), this.now()));

  ngOnInit(): void {
    this.openBetaNoticeIfNeeded();
    this.reload();
  }

  get t() {
    return this.i18n.homeUi();
  }

  lessonTime(iso: string): string {
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  }

  lessonDuration(minutes: number): string {
    return `${minutes} min`;
  }

  statusLabel(status: HomeLessonRow['lesson']['status']): string {
    const labels = this.i18n.calendarUi();
    switch (status) {
      case 'completed':
        return labels.statusCompleted;
      case 'missed':
        return labels.statusMissed;
      case 'canceled':
        return labels.statusCanceled;
      default:
        return labels.statusScheduled;
    }
  }

  lowBalanceLabel(student: Student): string {
    return this.t.lowBalanceLessonsLeft.replace('{count}', String(student.balance_lessons));
  }

  overdueHint(): string {
    return this.t.overdueLessonsHint.replace('{count}', String(this.overdueCount()));
  }

  isLessonOverdue(row: HomeLessonRow): boolean {
    return (
      row.lesson.status === 'scheduled' &&
      new Date(row.lesson.scheduledAt).getTime() < this.now().getTime()
    );
  }

  dismissBetaNotice(): void {
    this.betaOpen.set(false);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(BETA_NOTICE_STORAGE_KEY, '1');
    }
  }

  private openBetaNoticeIfNeeded(): void {
    if (typeof localStorage === 'undefined') {
      this.betaOpen.set(true);
      return;
    }
    this.betaOpen.set(!localStorage.getItem(BETA_NOTICE_STORAGE_KEY));
  }

  private reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.now.set(new Date());

    const today = financeTodayRange();
    forkJoin({
      profile: this.userSvc.ensureProfile(),
      summary: this.financeSvc.getSummary({ from: today.from, to: today.to }),
      lessons: this.lessonSvc.getAll(),
      students: this.studentSvc.getAll(),
    }).subscribe({
      next: ({ profile, summary, lessons, students }) => {
        this.profile.set(profile);
        this.summary.set(summary);
        this.todayLessons.set(lessonsForDay(lessons as Lesson[], students));
        this.lowBalanceStudents.set(studentsLowBalance(students));
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.t.loadError);
        this.loading.set(false);
      },
    });
  }
}
