import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Analytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setConsent,
  setUserId,
} from '@angular/fire/analytics';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { MarketingConsentService } from './marketing-consent.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly analytics = inject(Analytics, { optional: true });
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly consent = inject(MarketingConsentService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (!this.isEnabled()) {
      return;
    }

    effect(() => {
      this.applyConsent(this.consent.isAccepted());
    });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.trackPageView(event.urlAfterRedirects));

    effect(() => {
      if (!this.consent.isAccepted()) {
        return;
      }
      this.syncUserId();
    });
  }

  /** Произвольное событие GA4 — только при согласии на cookies. */
  trackEvent(eventName: string, params?: Record<string, unknown>): void {
    if (!this.canTrack()) {
      return;
    }
    logEvent(this.analytics!, eventName, params);
  }

  private isEnabled(): boolean {
    return (
      environment.production &&
      isPlatformBrowser(this.platformId) &&
      Boolean(this.analytics) &&
      Boolean(environment.firebaseConfig.measurementId)
    );
  }

  private canTrack(): boolean {
    return Boolean(this.analytics) && this.consent.isAccepted();
  }

  private applyConsent(enabled: boolean): void {
    if (!this.analytics) {
      return;
    }
    setAnalyticsCollectionEnabled(this.analytics, enabled);
    setConsent({
      analytics_storage: enabled ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  private trackPageView(path: string): void {
    if (!this.canTrack()) {
      return;
    }
    const pageLocation =
      typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
    logEvent(this.analytics!, 'page_view', {
      page_path: path,
      page_location: pageLocation,
      page_title: typeof document !== 'undefined' ? document.title : '',
    });
  }

  private syncUserId(): void {
    if (!this.canTrack()) {
      return;
    }
    const uid = this.auth.firebaseUser()?.uid ?? null;
    setUserId(this.analytics!, uid);
  }
}
