import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import {
  SystemStatusService,
  type HealthServiceState,
  type ServiceHealthStatus,
} from '../../core/services/system-status.service';

type ServiceRowKey = 'statusApp' | 'statusDatabase' | 'statusStripe';

@Component({
  selector: 'app-status-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './status-page.component.html',
  styleUrl: './status-page.component.scss',
})
export class StatusPageComponent implements OnInit {
  readonly i18n = inject(I18nService);
  readonly status = inject(SystemStatusService);

  readonly rows = computed(() => {
    const services = this.status.report().services;
    return [
      { key: 'statusApp' as const, state: services.app },
      { key: 'statusDatabase' as const, state: services.database },
      { key: 'statusStripe' as const, state: services.stripe },
    ];
  });

  ngOnInit(): void {
    this.status.refresh();
  }

  bannerLabel(): string {
    const t = this.i18n.authUi();
    if (this.status.loading()) return t.statusChecking;
    switch (this.status.overall()) {
      case 'ok':
        return t.statusAllOk;
      case 'degraded':
        return t.statusDegraded;
      case 'error':
        return t.statusOutage;
      default:
        return t.statusChecking;
    }
  }

  stateLabel(state: HealthServiceState): string {
    const t = this.i18n.authUi();
    switch (state.status) {
      case 'ok':
        return t.statusOperational;
      case 'error':
        return t.statusDown;
      case 'unconfigured':
        return t.statusUnconfigured;
      default:
        return t.statusUnknown;
    }
  }

  bannerClass(): string {
    if (this.status.loading()) return 'status-page__banner status-page__banner--loading';
    return `status-page__banner status-page__banner--${this.status.overall()}`;
  }

  stateClass(status: ServiceHealthStatus): string {
    return `status-page__state status-page__state--${status}`;
  }

  rowLabel(key: ServiceRowKey): string {
    return this.i18n.authUi()[key];
  }

  refresh(): void {
    this.status.refresh();
  }
}
