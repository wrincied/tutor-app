import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import type { ActivityLogEntry, AdminRecentActivityItem, AdminStats, AdminUserRow } from '@interfaces';
import { AdminService } from '../../core/services/admin.service';
import { I18nService } from '../../core/services/i18n.service';
import { formatActivityLogTitle } from '../../core/utils/activity-log-format';
import {
  adminStatusClass,
  adminStatusLabel,
  parseTimestamp,
} from './admin-subscription.helpers';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-dashboard.component.scss', './admin-overview.component.scss'],
})
export class AdminOverviewComponent implements OnInit {
  private readonly adminSvc = inject(AdminService);
  readonly i18n = inject(I18nService);

  readonly stats = signal<AdminStats | null>(null);
  readonly users = signal<AdminUserRow[]>([]);
  readonly activity = signal<AdminRecentActivityItem[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);

  readonly revenueLabel = computed(() => {
    const mrr = this.stats()?.estimatedMrr;
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
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.loadError.set(null);

    let pending = 3;
    const done = () => {
      pending -= 1;
      if (pending === 0) {
        this.loading.set(false);
      }
    };
    const fail = () => {
      this.loadError.set(this.t().loadError);
      done();
    };

    this.adminSvc.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: fail,
      complete: done,
    });

    this.adminSvc.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: fail,
      complete: done,
    });

    this.adminSvc.getRecentActivity(40).subscribe({
      next: (items) => this.activity.set(items),
      error: fail,
      complete: done,
    });
  }

  t() {
    return this.i18n.adminUi();
  }

  statusLabel(status: AdminUserRow['subscription_status']): string {
    return adminStatusLabel(status, this.t());
  }

  statusClass(status: AdminUserRow['subscription_status']): string {
    return adminStatusClass(status);
  }

  activityTitle(item: AdminRecentActivityItem): string {
    const entry: ActivityLogEntry = {
      _id: item._id,
      category: item.category,
      action: item.action,
      entity_type: item.category === 'students' ? 'student' : 'expense',
      summary: item.summary,
      student_name: item.student_name,
      createdAt: item.createdAt ?? undefined,
    };
    return formatActivityLogTitle(entry, this.i18n.activityLogUi());
  }
}
