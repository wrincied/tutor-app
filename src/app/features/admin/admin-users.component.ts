import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { AdminUserRow, SubscriptionStatus } from '@interfaces';
import { AdminService } from '../../core/services/admin.service';
import { I18nService } from '../../core/services/i18n.service';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';
import {
  adminStatusClass,
  adminStatusLabel,
  parseTimestamp,
} from './admin-subscription.helpers';

const TRIAL_GIFT_DAYS = 14;

type UsersSortKey = 'email' | 'registered' | 'lastVisit';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [DatePipe, FormsModule, AppDialogComponent, AppSelectComponent, RelativeTimePipe],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminUsersComponent implements OnInit {
  private readonly adminSvc = inject(AdminService);
  readonly i18n = inject(I18nService);

  readonly users = signal<AdminUserRow[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly giftingUserId = signal<string | null>(null);
  readonly savingUserId = signal<string | null>(null);
  readonly actionMessage = signal<string | null>(null);
  readonly actionError = signal<string | null>(null);

  readonly search = signal('');
  readonly sortKey = signal<UsersSortKey>('registered');

  readonly editOpen = signal(false);
  readonly editingUser = signal<AdminUserRow | null>(null);
  readonly editStatus = signal<SubscriptionStatus>('free');
  readonly editTrialEnds = signal('');

  readonly filteredUsers = computed(() => {
    const query = this.search().trim().toLowerCase();
    let rows = [...this.users()];
    if (query) {
      rows = rows.filter((user) => user.email.toLowerCase().includes(query));
    }
    const key = this.sortKey();
    rows.sort((left, right) => {
      switch (key) {
        case 'email':
          return left.email.localeCompare(right.email);
        case 'lastVisit':
          return parseTimestamp(right.last_login_at) - parseTimestamp(left.last_login_at);
        default:
          return parseTimestamp(right.createdAt) - parseTimestamp(left.createdAt);
      }
    });
    return rows;
  });

  readonly sortOptions = computed((): AppSelectOption[] => {
    const labels = this.t();
    return [
      { value: 'registered', label: labels.sortByRegistered },
      { value: 'lastVisit', label: labels.sortByLastVisit },
      { value: 'email', label: labels.sortByEmail },
    ];
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.loadError.set(null);

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
    return adminStatusLabel(status, this.t());
  }

  statusClass(status: SubscriptionStatus | string): string {
    return adminStatusClass(status);
  }

  exportCsv(): void {
    const rows = this.filteredUsers();
    const header = [
      'email',
      'status',
      'country',
      'registered',
      'last_visit',
    ];
    const lines = rows.map((user) =>
      [
        user.email,
        user.subscription_status,
        user.country_settings ?? '',
        user.createdAt ?? '',
        user.last_login_at ?? '',
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(','),
    );
    const csv = [header.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `simple4u-users-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
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
