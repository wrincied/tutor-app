import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import type { FinanceSummary, UserProfile } from '@interfaces';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { FinanceService } from '../../core/services/finance.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import { financeTodayRange } from '../../core/utils/finance-period';
import { formatMoneyWithCode } from '../../core/utils/format-currency';

const BETA_NOTICE_STORAGE_KEY = 'simple4u_beta_notice_v1';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AppDialogComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly userSvc = inject(UserService);
  private readonly financeSvc = inject(FinanceService);
  readonly i18n = inject(I18nService);

  profile = signal<UserProfile | null>(null);
  summary = signal<FinanceSummary | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  betaOpen = signal(false);

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

  todayLessonCount = computed(() => this.summary()?.totals.lessonCount ?? 0);

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

  ngOnInit(): void {
    this.openBetaNoticeIfNeeded();
    this.reload();
  }

  get t() {
    return this.i18n.homeUi();
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

    const today = financeTodayRange();
    forkJoin({
      profile: this.userSvc.ensureProfile(),
      summary: this.financeSvc.getSummary({ from: today.from, to: today.to }),
    }).subscribe({
      next: ({ profile, summary }) => {
        this.profile.set(profile);
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.t.loadError);
        this.loading.set(false);
      },
    });
  }
}
