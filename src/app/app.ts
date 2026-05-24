import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';
import { AnalyticsService } from './core/services/analytics.service';
import { SeoService } from './core/services/seo.service';
import { ThemeService } from './core/services/theme.service';
import { purgeStaleOverlayLayers } from './core/utils/purge-stale-overlay-layers';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
})
export class App {
  auth = inject(AuthService);
  router = inject(Router);
  /** Глобальная тема (localStorage + data-theme). */
  private readonly _theme = inject(ThemeService);
  private readonly document = inject(DOCUMENT);

  constructor() {
    inject(SeoService);
    inject(AnalyticsService);
    void this._theme;
    // После HMR могут остаться невидимые слои select — они блокируют клики по всему UI
    purgeStaleOverlayLayers(this.document);
  }

  showNavbar(): boolean {
    const path = this.router.url.split('?')[0];
    if (!this.auth.isLoggedIn() || !path.startsWith('/app')) {
      return false;
    }
    return path !== '/app/onboarding' && path !== '/app/verify-email-notice';
  }
}
