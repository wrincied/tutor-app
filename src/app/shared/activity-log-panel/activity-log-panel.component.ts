import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import type { ActivityLogEntry, ActivityLogStrings } from '@interfaces';
import {
  ActivityLogService,
  type ActivityLogCategory,
} from '../../core/services/activity-log.service';
import {
  formatActivityLogChanges,
  formatActivityLogTitle,
} from '../../core/utils/activity-log-format';

@Component({
  selector: 'app-activity-log-panel',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './activity-log-panel.component.html',
  styleUrl: './activity-log-panel.component.scss',
})
export class ActivityLogPanelComponent {
  private readonly logSvc = inject(ActivityLogService);

  category = input.required<ActivityLogCategory>();
  title = input.required<string>();
  emptyText = input.required<string>();
  strings = input.required<ActivityLogStrings>();
  reloadTrigger = input(0);
  limit = input(50);

  loading = signal(false);
  error = signal<string | null>(null);
  entries = signal<ActivityLogEntry[]>([]);

  constructor() {
    effect(() => {
      this.category();
      this.reloadTrigger();
      this.limit();
      this.load();
    });
  }

  entryTitle(entry: ActivityLogEntry): string {
    return formatActivityLogTitle(entry, this.strings());
  }

  entryChanges(entry: ActivityLogEntry): string[] {
    return formatActivityLogChanges(entry, this.strings());
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.logSvc.getLogs(this.category(), this.limit()).subscribe({
      next: (rows) => {
        this.entries.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.strings().loadError);
        this.loading.set(false);
      },
    });
  }
}
