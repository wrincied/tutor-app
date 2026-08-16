import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import type { FinanceSummary, Student, SubscriptionStatus, UserProfile } from '@interfaces';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { BillingService } from '../../core/services/billing.service';
import { FinanceService } from '../../core/services/finance.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import {
  financeDayRange,
  financeTodayRange,
  financeWeekRange,
} from '../../core/utils/finance-period';
import { formatMoneyWithCode } from '../../core/utils/format-currency';
import {
  findNextLesson,
  lessonsFromFinanceBreakdown,
  overdueLessonCount,
  paymentBadgeForStudent,
  studentsLowBalance,
  type HomeLessonRow,
} from '../../core/utils/home-dashboard';
import { dayKey } from '../../core/utils/day-key';
import {
  clearBillingQueryFromUrl,
  consumeBillingReturnFlag,
  peekCheckoutSessionId,
} from '../../core/utils/billing-return';
import { hasTelegramAccess } from '../../core/utils/user-profile.utils';

const BETA_NOTICE_STORAGE_KEY = 'simple4u_beta_notice_v1';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DecimalPipe, RouterLink, AppDialogComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly userSvc = inject(UserService);
  private readonly financeSvc = inject(FinanceService);
  private readonly billingSvc = inject(BillingService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  profile = signal<UserProfile | null>(null);
  summary = signal<FinanceSummary | null>(null);
  weekSummary = signal<FinanceSummary | null>(null);
  dayLessons = signal<HomeLessonRow[]>([]);
  lowBalanceStudents = signal<Student[]>([]);
  selectedDay = signal(dayKey(new Date()));
  agendaLoading = signal(false);
  loading = signal(true);
  error = signal<string | null>(null);
  betaOpen = signal(false);
  billingCongratsOpen = signal(false);
  billingCongratsPlan = signal<'trial' | 'pro' | null>(null);

  private billingPollSub: Subscription | null = null;
  private agendaSub: Subscription | null = null;
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

  selectedDayLabel = computed(() =>
    new Intl.DateTimeFormat(this.i18n.localeId(), {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(new Date(`${this.selectedDay()}T12:00:00`)),
  );

  isSelectedToday = computed(() => this.selectedDay() === dayKey(this.now()));

  todayLessonCount = computed(() => this.summary()?.totals.lessonCount ?? 0);
  todayCompletedCount = computed(() => this.summary()?.totals.completedLessonCount ?? 0);
  todayScheduledCount = computed(() => this.summary()?.totals.scheduledLessonCount ?? 0);
  todayHours = computed(() => this.summary()?.totals.totalLessonHours ?? 0);

  lessonsProgressPct = computed(() => {
    const total = this.todayLessonCount();
    if (total <= 0) {
      return 0;
    }
    return Math.min(100, Math.round((this.todayCompletedCount() / total) * 100));
  });

  todayIncome = computed(() => {
    const income = this.summary()?.income;
    if (!income) {
      return 0;
    }
    return income.combinedIncome ?? income.totalIncome + income.scheduledIncome;
  });

  weekIncome = computed(() => {
    const income = this.weekSummary()?.income;
    if (!income) {
      return 0;
    }
    return income.combinedIncome ?? income.totalIncome + income.scheduledIncome;
  });

  todayIncomeLabel = computed(() => {
    const currency = this.summary()?.currency ?? this.weekSummary()?.currency ?? 'EUR';
    return formatMoneyWithCode(this.todayIncome(), currency, this.i18n.localeId(), 0);
  });

  weekIncomeHint = computed(() => {
    const currency = this.weekSummary()?.currency ?? this.summary()?.currency ?? 'EUR';
    const amount = formatMoneyWithCode(this.weekIncome(), currency, this.i18n.localeId(), 0);
    return this.t.todayIncomeWeek.replace('{amount}', amount);
  });

  nextLesson = computed(() => findNextLesson(this.dayLessons(), this.now()));
  overdueCount = computed(() => overdueLessonCount(this.dayLessons(), this.now()));

  scheduleTitle = computed(() =>
    this.isSelectedToday() ? this.t.scheduleTitle : this.selectedDayLabel(),
  );

  telegramPlanEnabled = computed(() =>
    hasTelegramAccess(this.profile()?.subscription_status),
  );

  telegramLinkedCount = computed(() =>
    (this.summary()?.students ?? []).filter(
      (s) => Boolean(s.telegram_chat_id) || s.bot_active === true,
    ).length,
  );

  telegramBotStatusLabel = computed(() => {
    if (!this.telegramPlanEnabled()) {
      return this.t.telegramBotUnavailable;
    }
    return this.telegramLinkedCount() > 0 ? this.t.telegramBotActive : this.t.telegramBotInactive;
  });

  telegramRemindersLabel = computed(() =>
    this.t.telegramRemindersToday.replace('{count}', '0'),
  );

  telegramLinkedLabel = computed(() =>
    this.t.telegramLinkedStudents.replace('{count}', String(this.telegramLinkedCount())),
  );

  billingCongratsTitle = computed(() => {
    const plan = this.billingCongratsPlan();
    const t = this.t;
    if (plan === 'trial') return t.billingCongratsTrialTitle;
    if (plan === 'pro') return t.billingCongratsProTitle;
    return t.billingCongratsProTitle;
  });

  billingCongratsBody = computed(() => {
    const plan = this.billingCongratsPlan();
    const t = this.t;
    if (plan === 'trial') return t.billingCongratsTrialBody;
    if (plan === 'pro') return t.billingCongratsProBody;
    return t.billingCongratsProBody;
  });

  ngOnInit(): void {
    const billingReturn = consumeBillingReturnFlag();
    if (billingReturn === 'success') {
      clearBillingQueryFromUrl();
      this.handleBillingSuccessReturn();
    } else if (billingReturn === 'cancel') {
      clearBillingQueryFromUrl();
      this.handleBillingCancelReturn();
    } else {
      this.openBetaNoticeIfNeeded();
    }
    this.reload();
  }

  ngOnDestroy(): void {
    this.billingPollSub?.unsubscribe();
    this.agendaSub?.unsubscribe();
  }

  get t() {
    return this.i18n.homeUi();
  }

  shiftDay(delta: number): void {
    const current = new Date(`${this.selectedDay()}T12:00:00`);
    current.setDate(current.getDate() + delta);
    this.selectedDay.set(dayKey(current));
    this.loadAgenda(this.selectedDay());
  }

  goToday(): void {
    const today = dayKey(new Date());
    this.selectedDay.set(today);
    this.loadAgenda(today);
  }

  newLessonQuery(): Record<string, string> {
    return {
      new: '1',
      date: this.selectedDay(),
    };
  }

  lessonTimeRange(row: HomeLessonRow): string {
    const startIso = row.lesson.scheduledAt;
    if (!startIso || /^\d{4}-\d{2}-\d{2}$/.test(startIso)) {
      return '—';
    }
    const start = new Date(startIso);
    const end = new Date(start.getTime() + (Number(row.lesson.lesson_duration) || 60) * 60_000);
    const fmt = new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${fmt.format(start)} – ${fmt.format(end)}`;
  }

  lessonMeta(row: HomeLessonRow): string {
    const minutes = Number(row.lesson.lesson_duration) || 0;
    return minutes > 0 ? `${minutes} ${this.i18n.calendarUi().durationMinShort}` : '—';
  }

  paymentBadge(row: HomeLessonRow) {
    return paymentBadgeForStudent(row.student, {
      package: this.t.paymentPackage,
      packageProgress: this.t.paymentPackageProgress,
      unpaid: this.t.paymentUnpaid,
    });
  }

  lessonTime(iso: string): string {
    if (!iso) {
      return '—';
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      return '—';
    }
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
    const unit =
      String(student.rate_unit ?? 'hour').toLowerCase() === 'lesson'
        ? this.i18n.studentsUi().lessonsShort
        : this.i18n.studentsUi().hoursShort;
    return this.t.lowBalanceLessonsLeft.replace(
      '{count}',
      `${student.balance_lessons} ${unit}`,
    );
  }

  overdueHint(): string {
    return this.t.overdueLessonsHint.replace('{count}', String(this.overdueCount()));
  }

  calendarLessonQuery(row: HomeLessonRow): Record<string, string> {
    const query: Record<string, string> = {};
    if (row.lesson.scheduledAt) {
      query['date'] = dayKey(new Date(row.lesson.scheduledAt));
    }
    if (row.lesson._id) {
      query['lesson'] = row.lesson._id;
    }
    if (row.lesson.student_id) {
      query['student'] = row.lesson.student_id;
    }
    return query;
  }

  studentQuery(student: Student): { student: string } {
    return { student: student._id };
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

  dismissBillingCongrats(): void {
    this.billingCongratsOpen.set(false);
    this.openBetaNoticeIfNeeded();
  }

  goManageSubscription(): void {
    this.billingCongratsOpen.set(false);
    void this.router.navigateByUrl('/app/account/profile');
  }

  private handleBillingCancelReturn(): void {
    this.billingCongratsOpen.set(false);
    this.userSvc.invalidateProfile();
    this.billingSvc.syncSubscription().subscribe({
      next: (user) => {
        this.userSvc.cacheProfile(user);
        this.profile.set(user);
        this.openBetaNoticeIfNeeded();
      },
      error: () => {
        this.openBetaNoticeIfNeeded();
      },
    });
  }

  private handleBillingSuccessReturn(): void {
    const sessionId = peekCheckoutSessionId();
    this.billingCongratsOpen.set(false);
    this.userSvc.invalidateProfile();
    this.billingPollSub?.unsubscribe();

    if (!sessionId) {
      this.handleBillingCancelReturn();
      return;
    }

    const applyUser = (user: UserProfile) => {
      this.userSvc.cacheProfile(user);
      this.profile.set(user);
      const status = String(user.subscription_status || 'free') as SubscriptionStatus;
      if (status === 'pro' || status === 'trial') {
        this.billingCongratsPlan.set(status);
        this.billingCongratsOpen.set(true);
        return true;
      }
      this.billingCongratsOpen.set(false);
      return false;
    };

    this.billingSvc.confirmCheckoutSession(sessionId).subscribe({
      next: (user) => {
        clearBillingQueryFromUrl();
        if (!applyUser(user)) {
          this.openBetaNoticeIfNeeded();
        }
      },
      error: (err) => {
        clearBillingQueryFromUrl();
        const fallbackUser = err?.error?.user as UserProfile | undefined;
        if (fallbackUser) {
          applyUser(fallbackUser);
        } else {
          this.handleBillingCancelReturn();
        }
      },
    });
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
    const week = financeWeekRange();
    const selected = this.selectedDay();

    forkJoin({
      profile: this.userSvc.refreshProfile(),
      summary: this.financeSvc.getSummary({ from: today.from, to: today.to, scope: 'home' }),
      weekSummary: this.financeSvc
        .getSummary({ from: week.from, to: week.to, scope: 'home' })
        .pipe(catchError(() => of(null))),
    }).subscribe({
      next: ({ profile, summary, weekSummary }) => {
        this.profile.set(profile);
        this.summary.set(summary);
        this.weekSummary.set(weekSummary);
        const students = (summary.students ?? []) as Student[];
        this.lowBalanceStudents.set(studentsLowBalance(students));

        if (selected === today.from) {
          this.dayLessons.set(
            lessonsFromFinanceBreakdown(summary.lessonsBreakdown ?? [], students),
          );
        } else {
          this.loadAgenda(selected);
        }

        this.loading.set(false);

        const status = String(profile?.subscription_status || 'free');
        if (status === 'trial' || status === 'pro' || status === 'basis') {
          this.billingSvc.syncSubscription().subscribe({
            next: (user) => {
              this.userSvc.cacheProfile(user);
              this.profile.set(user);
            },
            error: () => undefined,
          });
        }
      },
      error: () => {
        this.error.set(this.t.loadError);
        this.loading.set(false);
      },
    });
  }

  private loadAgenda(dayIso: string): void {
    this.agendaSub?.unsubscribe();
    this.agendaLoading.set(true);
    const range = financeDayRange(dayIso);
    this.agendaSub = this.financeSvc
      .getSummary({ from: range.from, to: range.to, scope: 'home' })
      .subscribe({
        next: (summary) => {
          const students = (summary.students ?? this.summary()?.students ?? []) as Student[];
          this.dayLessons.set(
            lessonsFromFinanceBreakdown(summary.lessonsBreakdown ?? [], students),
          );
          if (students.length) {
            this.lowBalanceStudents.set(studentsLowBalance(students));
          }
          this.agendaLoading.set(false);
        },
        error: () => {
          this.agendaLoading.set(false);
        },
      });
  }
}
