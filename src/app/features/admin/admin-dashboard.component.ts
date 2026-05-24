import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { AdminStats, AdminUserRow, SubscriptionStatus } from '@interfaces';
import { AdminService } from '../../core/services/admin.service';
import { I18nService } from '../../core/services/i18n.service';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';

const TRIAL_GIFT_DAYS = 14;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, FormsModule, AppDialogComponent, AppSelectComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminSvc = inject(AdminService);
  readonly i18n = inject(I18nService);

  readonly stats = signal<AdminStats | null>(null);
  readonly users = signal<AdminUserRow[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly giftingUserId = signal<string | null>(null);
  readonly savingUserId = signal<string | null>(null);
  readonly actionMessage = signal<string | null>(null);
  readonly actionError = signal<string | null>(null);

  readonly editOpen = signal(false);
  readonly editingUser = signal<AdminUserRow | null>(null);
  readonly editStatus = signal<SubscriptionStatus>('free');
  readonly editTrialEnds = signal('');

  readonly revenueLabel = computed(() => {
    const mrr = this.stats()?.estimatedMrr;
    if (!mrr || Object.keys(mrr).length === 0) {
      return '—';
    }
    return Object.entries(mrr)
      .map(([currency, amount]) => `${amount.toLocaleString()} ${currency}`)
      .join(' · ');
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.loadError.set(null);

    this.adminSvc.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => this.loadError.set(this.t().loadError),
    });

    this.adminSvc.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(this.t().loadError);
        this.loading.set(false);
      },
    });
  }

  t() {
    return this.i18n.adminUi();
  }

  subscriptionOptions(): AppSelectOption[] {
    const labels = this.t();
    return [
      { value: 'free', label: labels.statusFree },
      { value: 'pro', label: labels.statusPro },
      { value: 'trial', label: labels.statusTrial },
    ];
  }

  statusLabel(status: SubscriptionStatus | string): string {
    const labels = this.t();
    switch (status) {
      case 'pro':
        return labels.statusPro;
      case 'trial':
        return labels.statusTrial;
      default:
        return labels.statusFree;
    }
  }

  statusClass(status: SubscriptionStatus | string): string {
    switch (status) {
      case 'pro':
        return 'admin-status admin-status--pro';
      case 'trial':
        return 'admin-status admin-status--trial';
      default:
        return 'admin-status admin-status--free';
    }
  }

  openEdit(user: AdminUserRow): void {
    this.actionMessage.set(null);
    this.actionError.set(null);
    this.editingUser.set(user);
    this.editStatus.set((user.subscription_status as SubscriptionStatus) || 'free');
    this.editTrialEnds.set(this.trialEndsInputValue(user.trial_ends_at));
    this.editOpen.set(true);
  }

  closeEdit(): void {
    this.editOpen.set(false);
    this.editingUser.set(null);
  }

  onEditStatusChange(status: SubscriptionStatus | string): void {
    const next = (status as SubscriptionStatus) || 'free';
    this.editStatus.set(next);
    if (next === 'trial' && !this.editTrialEnds()) {
      this.editTrialEnds.set(this.defaultTrialEndsInput());
    }
  }

  saveSubscription(): void {
    const user = this.editingUser();
    if (!user || this.savingUserId()) {
      return;
    }

    this.actionMessage.set(null);
    this.actionError.set(null);
    this.savingUserId.set(user._id);

    const status = this.editStatus();
    this.adminSvc
      .updateSubscription(user._id, {
        subscription_status: status,
        trial_ends_at: status === 'trial' ? this.editTrialEnds() : undefined,
      })
      .subscribe({
        next: (res) => {
          this.applyUserUpdate(res.user);
          this.actionMessage.set(this.t().updateSubscriptionSuccess);
          this.savingUserId.set(null);
          this.closeEdit();
          this.refreshStats();
        },
        error: () => {
          this.actionError.set(this.t().updateSubscriptionError);
          this.savingUserId.set(null);
        },
      });
  }

  giftTrial(user: AdminUserRow): void {
    if (this.giftingUserId() || this.savingUserId()) {
      return;
    }
    this.actionMessage.set(null);
    this.actionError.set(null);
    this.giftingUserId.set(user._id);

    this.adminSvc.grantTrial(user._id).subscribe({
      next: (res) => {
        this.applyUserUpdate(res.user);
        this.actionMessage.set(this.t().giftTrialSuccess);
        this.giftingUserId.set(null);
        this.refreshStats();
      },
      error: () => {
        this.actionError.set(this.t().giftTrialError);
        this.giftingUserId.set(null);
      },
    });
  }

  private applyUserUpdate(user: AdminUserRow): void {
    this.users.update((rows) =>
      rows.map((row) => (row._id === user._id ? { ...row, ...user } : row)),
    );
  }

  private refreshStats(): void {
    this.adminSvc.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
    });
  }

  private defaultTrialEndsInput(from = new Date()): string {
    const ends = new Date(from);
    ends.setUTCDate(ends.getUTCDate() + TRIAL_GIFT_DAYS);
    return ends.toISOString().slice(0, 10);
  }

  private trialEndsInputValue(raw: string | null | undefined): string {
    if (raw) {
      return raw.slice(0, 10);
    }
    return this.defaultTrialEndsInput();
  }
}
