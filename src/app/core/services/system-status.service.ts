import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';
import { apiUrl } from '../config/api-url';

export type ServiceHealthStatus = 'ok' | 'error' | 'unconfigured' | 'unknown';
export type OverallHealthStatus = 'ok' | 'degraded' | 'error' | 'unknown';

export interface HealthServiceState {
  status: ServiceHealthStatus;
  provider?: string;
  detail?: string;
}

export interface SystemHealthReport {
  status: OverallHealthStatus;
  checkedAt: string | null;
  services: {
    app: HealthServiceState;
    database: HealthServiceState;
    stripe: HealthServiceState;
  };
}

const UNKNOWN: SystemHealthReport = {
  status: 'unknown',
  checkedAt: null,
  services: {
    app: { status: 'unknown' },
    database: { status: 'unknown' },
    stripe: { status: 'unknown' },
  },
};

@Injectable({ providedIn: 'root' })
export class SystemStatusService {
  private readonly http = inject(HttpClient);

  private readonly _report = signal<SystemHealthReport>(UNKNOWN);
  private readonly _loading = signal(false);
  private readonly _loadError = signal(false);

  readonly report = this._report.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly loadError = this._loadError.asReadonly();

  readonly overall = computed(() => this._report().status);
  readonly isOperational = computed(() => this._report().status === 'ok');

  /** Fetch live health from backend `/api/health`. */
  refresh(): void {
    this._loading.set(true);
    this._loadError.set(false);
    this.http
      .get<SystemHealthReport>(apiUrl('health'))
      .pipe(
        map((raw) => this.normalize(raw)),
        catchError((err: unknown) => {
          this._loadError.set(true);
          if (err instanceof HttpErrorResponse && err.error?.services) {
            return of(this.normalize(err.error));
          }
          return of({
            status: 'error' as const,
            checkedAt: new Date().toISOString(),
            services: {
              app: { status: 'error' as const },
              database: { status: 'unknown' as const },
              stripe: { status: 'unknown' as const },
            },
          });
        }),
        tap((report) => {
          this._report.set(report);
          this._loading.set(false);
        }),
      )
      .subscribe();
  }

  private normalize(raw: Partial<SystemHealthReport> & { db?: string } | null | undefined): SystemHealthReport {
    const services = raw?.services;
    if (!services && (raw?.status === 'ok' || raw?.db === 'firestore')) {
      return {
        status: 'ok',
        checkedAt: raw?.checkedAt ?? new Date().toISOString(),
        services: {
          app: { status: 'ok' },
          database: { status: 'ok', provider: 'firestore' },
          stripe: { status: 'unknown' },
        },
      };
    }
    return {
      status: this.asOverall(raw?.status),
      checkedAt: raw?.checkedAt ?? new Date().toISOString(),
      services: {
        app: this.asService(services?.app),
        database: this.asService(services?.database),
        stripe: this.asService(services?.stripe),
      },
    };
  }

  private asOverall(value: unknown): OverallHealthStatus {
    if (value === 'ok' || value === 'degraded' || value === 'error') return value;
    return 'unknown';
  }

  private asService(value: HealthServiceState | undefined): HealthServiceState {
    if (!value || typeof value !== 'object') {
      return { status: 'unknown' };
    }
    const status =
      value.status === 'ok' ||
      value.status === 'error' ||
      value.status === 'unconfigured' ||
      value.status === 'unknown'
        ? value.status
        : 'unknown';
    return {
      status,
      provider: value.provider,
      detail: value.detail,
    };
  }
}
