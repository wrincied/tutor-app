import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import type { AdminStats, AdminUserRow, SubscriptionStatus } from '@interfaces';
import { AdminService } from '../../core/services/admin.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe],
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
  readonly actionMessage = signal<string | null>(null);
  readonly actionError = signal<string | null>(null);

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

  giftTrial(user: AdminUserRow): void {
    if (this.giftingUserId()) {
      return;
    }
    this.actionMessage.set(null);
    this.actionError.set(null);
    this.giftingUserId.set(user._id);

    this.adminSvc.grantTrial(user._id).subscribe({
      next: (res) => {
        this.users.update((rows) =>
          rows.map((row) =>
            row._id === user._id
              ? { ...row, subscription_status: res.user.subscription_status }
              : row,
          ),
        );
        this.actionMessage.set(this.t().giftTrialSuccess);
        this.giftingUserId.set(null);
        this.adminSvc.getStats().subscribe({
          next: (stats) => this.stats.set(stats),
        });
      },
      error: () => {
        this.actionError.set(this.t().giftTrialError);
        this.giftingUserId.set(null);
      },
    });
  }
}
