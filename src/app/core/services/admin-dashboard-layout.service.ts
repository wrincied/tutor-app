import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import type { AdminDashboardWidgetId } from '@interfaces';

import { AdminService } from './admin.service';
import {
  ADMIN_DASHBOARD_WIDGETS,
  DEFAULT_ADMIN_DASHBOARD_WIDGETS,
} from '../../features/admin/admin-dashboard-widgets';

const STORAGE_KEY = 'simple4u.admin.dashboard.widgets';

@Injectable({ providedIn: 'root' })
export class AdminDashboardLayoutService {
  private readonly adminSvc = inject(AdminService);

  readonly enabled = signal<AdminDashboardWidgetId[]>([...DEFAULT_ADMIN_DASHBOARD_WIDGETS]);
  readonly loaded = signal(false);

  load(): Observable<{ dashboard_widgets: AdminDashboardWidgetId[] }> {
    return this.adminSvc.getPreferences().pipe(
      tap((prefs) => {
        this.enabled.set(this.normalize(prefs.dashboard_widgets));
        this.loaded.set(true);
        this.persistLocal(this.enabled());
      }),
      catchError(() => {
        const local = this.readLocal();
        this.enabled.set(local);
        this.loaded.set(true);
        return of({ dashboard_widgets: local });
      }),
    );
  }

  isEnabled(id: AdminDashboardWidgetId): boolean {
    return this.enabled().includes(id);
  }

  save(widgets: AdminDashboardWidgetId[]): Observable<{ ok: boolean; dashboard_widgets: AdminDashboardWidgetId[] }> {
    const next = this.normalize(widgets);
    this.enabled.set(next);
    this.persistLocal(next);
    return this.adminSvc.savePreferences({ dashboard_widgets: next }).pipe(
      catchError(() => of({ ok: true, dashboard_widgets: next })),
    );
  }

  reset(): Observable<{ ok: boolean; dashboard_widgets: AdminDashboardWidgetId[] }> {
    return this.save([...DEFAULT_ADMIN_DASHBOARD_WIDGETS]);
  }

  toggle(id: AdminDashboardWidgetId, on: boolean): AdminDashboardWidgetId[] {
    const current = new Set(this.enabled());
    if (on) {
      current.add(id);
    } else {
      current.delete(id);
    }
    const order = ADMIN_DASHBOARD_WIDGETS.map((w) => w.id);
    return order.filter((widgetId) => current.has(widgetId));
  }

  private normalize(raw: AdminDashboardWidgetId[] | undefined): AdminDashboardWidgetId[] {
    const allowed = new Set(DEFAULT_ADMIN_DASHBOARD_WIDGETS);
    if (!raw?.length) {
      return [...DEFAULT_ADMIN_DASHBOARD_WIDGETS];
    }
    const filtered = raw.filter((id) => allowed.has(id));
    return filtered.length ? filtered : [...DEFAULT_ADMIN_DASHBOARD_WIDGETS];
  }

  private readLocal(): AdminDashboardWidgetId[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [...DEFAULT_ADMIN_DASHBOARD_WIDGETS];
      }
      return this.normalize(JSON.parse(raw) as AdminDashboardWidgetId[]);
    } catch {
      return [...DEFAULT_ADMIN_DASHBOARD_WIDGETS];
    }
  }

  private persistLocal(widgets: AdminDashboardWidgetId[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    } catch {
      /* ignore quota errors */
    }
  }
}
