import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter, interval } from 'rxjs';
import { environment } from '../environments/environment';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AppDialogComponent } from './shared/app-dialog/app-dialog.component';
import { CookieConsentBannerComponent } from './shared/cookie-consent-banner/cookie-consent-banner.component';
import { LandingSkeletonComponent } from './features/landing/landing-skeleton.component';
import { AuthService } from './core/services/auth.service';
import { AnalyticsService } from './core/services/analytics.service';
import { BotUnlinkAlertService } from './core/services/bot-unlink-alert.service';
import { I18nService } from './core/services/i18n.service';
import { SeoService } from './core/services/seo.service';
import { ThemeService } from './core/services/theme.service';
import { purgeStaleOverlayLayers } from './core/utils/purge-stale-overlay-layers';
import { consumeBillingReturnFlag } from './core/utils/billing-return';
import { BillingService } from './core/services/billing.service';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    AppDialogComponent,
    LandingSkeletonComponent,
    CookieConsentBannerComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  auth = inject(AuthService);
  router = inject(Router);
  private readonly billingSvc = inject(BillingService);
  private readonly userSvc = inject(UserService);
  readonly unlinkAlert = inject(BotUnlinkAlertService);
  private readonly i18n = inject(I18nService);
  /** Глобальная тема (localStorage + data-theme). */
  private readonly _theme = inject(ThemeService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  /** Eager landing shell while the lazy landing chunk resolves. */
  readonly landingRouteLoading = signal(false);

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

    // Stripe returns to /app/home?billing=success (legacy: /?billing=success#/…).
    // Browser Back leaves sessionStorage=pending — treat as cancel and force Free if no Stripe sub.
    const billingReturn = consumeBillingReturnFlag();
    if (billingReturn === 'success') {
      const hash = (typeof window !== 'undefined' ? window.location.hash : '') || '';
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      const alreadyHome = path.includes('/app/home') || hash.includes('/app/home');
      if (!alreadyHome) {
        void this.router.navigateByUrl('/app/home?billing=success');
      }
    } else if (billingReturn === 'cancel' && this.auth.isLoggedIn()) {
      this.userSvc.invalidateProfile();
      this.billingSvc.syncSubscription().subscribe({
        next: (user) => this.userSvc.cacheProfile(user),
        error: () => undefined,
      });
    }

    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((e) => {
      if (e instanceof NavigationStart && this.isLandingUrl(e.url)) {
        this.landingRouteLoading.set(true);
        return;
      }
      if (
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError
      ) {
        this.landingRouteLoading.set(false);
      }
    });

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (!this.showNavbar()) {
          return;
        }
        const path = this.router.url.split('?')[0];
        // Students page already loads GET /students and calls ingestStudents.
        if (path === '/app/students') {
          return;
        }
        this.unlinkAlert.refreshFromApi();
      });

    interval(120000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.showNavbar()) {
          this.unlinkAlert.refreshFromApi();
        }
      });
  }

  showNavbar(): boolean {
    if (this.isStandaloneNotFound()) {
      return false;
    }
    const path = this.router.url.split('?')[0];
    if (!this.auth.isLoggedIn() || !path.startsWith('/app')) {
      return false;
    }
    return (
      path !== '/app/onboarding' &&
      path !== '/app/verify-email-notice' &&
      path !== '/app/payment'
    );
  }

  private isLandingUrl(url: string): boolean {
    const path = url.split('?')[0].split('#')[0];
    return path === '/' || path === '';
  }

  /** 404 lives outside the app shell (no navbar / page-host chrome). */
  private isStandaloneNotFound(): boolean {
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data['title'] === 'notFound';
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
