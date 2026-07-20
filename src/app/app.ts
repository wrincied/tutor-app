import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, interval } from 'rxjs';
import { environment } from '../environments/environment';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AppDialogComponent } from './shared/app-dialog/app-dialog.component';
import { AuthService } from './core/services/auth.service';
import { AnalyticsService } from './core/services/analytics.service';
import { BotUnlinkAlertService } from './core/services/bot-unlink-alert.service';
import { I18nService } from './core/services/i18n.service';
import { SeoService } from './core/services/seo.service';
import { ThemeService } from './core/services/theme.service';
import { purgeStaleOverlayLayers } from './core/utils/purge-stale-overlay-layers';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, AppDialogComponent],
  templateUrl: './app.html',
})
export class App {
  auth = inject(AuthService);
  router = inject(Router);
  readonly unlinkAlert = inject(BotUnlinkAlertService);
  private readonly i18n = inject(I18nService);
  /** Глобальная тема (localStorage + data-theme). */
  private readonly _theme = inject(ThemeService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    inject(SeoService);
    inject(AnalyticsService);
    void this._theme;
    if ((environment as { designMode?: boolean }).designMode) {
      this.document.documentElement.dataset['design'] = 'v2';
    } else {
      delete this.document.documentElement.dataset['design'];
    }
    // После HMR могут остаться невидимые слои select — они блокируют клики по всему UI
    purgeStaleOverlayLayers(this.document);

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (this.showNavbar()) {
          this.unlinkAlert.refreshFromApi();
        }
      });

    interval(20000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.showNavbar()) {
          this.unlinkAlert.refreshFromApi();
        }
      });
  }

  showNavbar(): boolean {
    const path = this.router.url.split('?')[0];
    if (!this.auth.isLoggedIn() || !path.startsWith('/app')) {
      return false;
    }
    return path !== '/app/onboarding' && path !== '/app/verify-email-notice';
  }

  unlinkDialogTitle(): string {
    return this.i18n.studentsUi().botUnlinkAlertTitle;
  }

  unlinkDialogOk(): string {
    return this.i18n.studentsUi().botUnlinkAlertOk;
  }

  unlinkDialogMessage(): string {
    const alert = this.unlinkAlert.alert();
    const t = this.i18n.studentsUi();
    if (!alert) {
      return '';
    }
    const username = alert.telegramUsername ? ` (@${alert.telegramUsername})` : '';
    return t.botUnlinkAlertMessage.replace('{name}', alert.studentName).replace('{username}', username);
  }
}
