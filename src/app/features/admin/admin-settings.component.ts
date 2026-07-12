import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { AdminDashboardWidgetId } from '@interfaces';
import { AdminDashboardLayoutService } from '../../core/services/admin-dashboard-layout.service';
import { I18nService } from '../../core/services/i18n.service';
import {
  ADMIN_DASHBOARD_WIDGET_GROUPS,
  ADMIN_DASHBOARD_WIDGETS,
  type AdminDashboardWidgetDef,
} from './admin-dashboard-widgets';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss',
})
export class AdminSettingsComponent implements OnInit {
  private readonly layout = inject(AdminDashboardLayoutService);
  readonly i18n = inject(I18nService);

  readonly draft = signal<AdminDashboardWidgetId[]>([]);
  readonly saving = signal(false);
  readonly saved = signal(false);
  readonly loadError = signal<string | null>(null);

  readonly widgetGroups = ADMIN_DASHBOARD_WIDGET_GROUPS;

  ngOnInit(): void {
    if (this.layout.loaded()) {
      this.draft.set([...this.layout.enabled()]);
      return;
    }
    this.layout.load().subscribe({
      next: () => this.draft.set([...this.layout.enabled()]),
      error: () => this.loadError.set(this.t().loadError),
    });
  }

  t() {
    return this.i18n.adminUi();
  }

  widgetsForGroup(group: AdminDashboardWidgetDef['group']): AdminDashboardWidgetDef[] {
    return ADMIN_DASHBOARD_WIDGETS.filter((widget) => widget.group === group);
  }

  groupLabel(group: AdminDashboardWidgetDef['group']): string {
    const labels = this.t();
    switch (group) {
      case 'kpi':
        return labels.settingsGroupKpi;
      case 'analytics':
        return labels.settingsGroupAnalytics;
      default:
        return labels.settingsGroupTables;
    }
  }

  widgetLabel(widget: AdminDashboardWidgetDef): string {
    return this.t()[widget.labelKey];
  }

  isChecked(id: AdminDashboardWidgetId): boolean {
    return this.draft().includes(id);
  }

  onToggle(id: AdminDashboardWidgetId, checked: boolean): void {
    this.saved.set(false);
    const current = new Set(this.draft());
    if (checked) {
      current.add(id);
    } else {
      current.delete(id);
    }
    const order = ADMIN_DASHBOARD_WIDGETS.map((w) => w.id);
    this.draft.set(order.filter((widgetId) => current.has(widgetId)));
  }

  save(): void {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    this.saved.set(false);
    this.loadError.set(null);
    this.layout.save(this.draft()).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
      },
      error: () => {
        this.saving.set(false);
        this.loadError.set(this.t().loadError);
      },
    });
  }

  reset(): void {
    if (!confirm(this.t().settingsResetConfirm)) {
      return;
    }
    this.saving.set(true);
    this.layout.reset().subscribe({
      next: (res) => {
        this.draft.set([...res.dashboard_widgets]);
        this.saving.set(false);
        this.saved.set(true);
      },
      error: () => {
        this.saving.set(false);
        this.loadError.set(this.t().loadError);
      },
    });
  }
}
