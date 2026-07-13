import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import type {
  ActivityLogEntry,
  AdminDashboardAlert,
  AdminDashboardPayload,
  AdminUserRow,
  AdminUserSummary,
} from '@interfaces';
import { AdminDashboardLayoutService } from '../../core/services/admin-dashboard-layout.service';
import { AdminService } from '../../core/services/admin.service';
import { I18nService } from '../../core/services/i18n.service';
import { formatActivityLogTitle } from '../../core/utils/activity-log-format';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';
import {
  adminStatusClass,
  adminStatusLabel,
  parseTimestamp,
} from './admin-subscription.helpers';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [DatePipe, RouterLink, AppDialogComponent, RelativeTimePipe],
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-dashboard.component.scss', './admin-overview.component.scss'],
})
export class AdminOverviewComponent implements OnInit {
  private readonly adminSvc = inject(AdminService);
  readonly layout = inject(AdminDashboardLayoutService);
  readonly i18n = inject(I18nService);

  readonly dashboard = signal<AdminDashboardPayload | null>(null);
  readonly users = signal<AdminUserRow[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);

  readonly detailOpen = signal(false);
  readonly detailLoading = signal(false);
  readonly detailError = signal<string | null>(null);
  readonly detail = signal<AdminUserSummary | null>(null);

  readonly revenueLabel = computed(() => {
    const mrr = this.dashboard()?.stats.estimatedMrr;
    if (!mrr || Object.keys(mrr).length === 0) {
      return '—';
    }
    return Object.entries(mrr)
      .map(([currency, amount]) => `${amount.toLocaleString()} ${currency}`)
      .join(' · ');
  });

  readonly recentVisits = computed(() =>
    [...this.users()]
      .sort((left, right) => parseTimestamp(right.last_login_at) - parseTimestamp(left.last_login_at))
      .slice(0, 25),
  );

  ngOnInit(): void {
    this.layout.load().subscribe({
      next: () => this.reload(),
      error: () => this.reload(),
    });
  }

  reload(): void {
    this.loading.set(true);
    this.loadError.set(null);

    this.adminSvc.getDashboard().subscribe({
      next: (payload) => {
        this.dashboard.set(payload);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(this.t().loadError);
        this.loading.set(false);
      },
    });

    this.adminSvc.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: () => undefined,
    });
  }

  t() {
    return this.i18n.adminUi();
  }

  isEnabled(id: Parameters<AdminDashboardLayoutService['isEnabled']>[0]): boolean {
    return this.layout.isEnabled(id);
  }

  funnelPercent(value: number): string {
    const total = this.dashboard()?.funnel.registered ?? 0;
    if (!total) {
      return '0%';
    }
    return `${Math.round((value / total) * 100)}%`;
  }

  statusLabel(status: AdminUserRow['subscription_status']): string {
    return adminStatusLabel(status, this.t());
  }

  statusClass(status: AdminUserRow['subscription_status']): string {
    return adminStatusClass(status);
  }

  alertLabel(alert: AdminDashboardAlert): string {
    switch (alert.type) {
      case 'trial_expiring_soon':
        return this.t().alertTrialExpiringSoon;
      case 'trial_expired':
        return this.t().alertTrialExpired;
      default:
        return this.t().alertProInactive;
    }
  }

  activityTitle(item: ActivityLogEntry): string {
    return formatActivityLogTitle(item, this.i18n.activityLogUi());
  }

  openUserDetail(userId: string): void {
    this.detailOpen.set(true);
    this.detailLoading.set(true);
    this.detailError.set(null);
    this.detail.set(null);
    this.adminSvc.getUserSummary(userId).subscribe({
      next: (summary) => {
        this.detail.set(summary);
        this.detailLoading.set(false);
      },
      error: () => {
        this.detailError.set(this.t().userDetailError);
        this.detailLoading.set(false);
      },
    });
  }

  closeUserDetail(): void {
    this.detailOpen.set(false);
    this.detail.set(null);
  }
}
