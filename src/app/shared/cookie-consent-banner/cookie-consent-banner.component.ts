import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { MarketingConsentService } from '../../core/services/marketing-consent.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { LocaleRouter } from '../../core/i18n/locale-router.service';

@Component({
  selector: 'app-cookie-consent-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cookie-consent-banner.component.html',
  styleUrl: './cookie-consent-banner.component.scss',
})
export class CookieConsentBannerComponent {
  readonly i18n = inject(I18nService);
  private readonly localeRouter = inject(LocaleRouter);
  /** Locale-aware absolute path for routerLink. */
  lp(path: string): string {
    return this.localeRouter.path(path);
  }
  readonly consent = inject(MarketingConsentService);
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);

  acceptAll(): void {
    this.consent.acceptAll();
    this.persistToProfile(true);
  }

  essentialOnly(): void {
    this.consent.acceptEssentialOnly();
    this.persistToProfile(false);
  }

  openSettings(): void {
    this.consent.openSettingsPanel();
  }

  backToMain(): void {
    this.consent.closeSettingsPanel();
  }

  onAnalyticsToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.consent.setDraftAnalytics(input.checked);
  }

  saveSettings(): void {
    const analytics = this.consent.draftAnalytics();
    this.consent.saveSettings();
    this.persistToProfile(analytics);
  }

  private persistToProfile(accepted: boolean): void {
    if (!this.auth.isLoggedIn()) {
      return;
    }
    this.users.updateMarketingCookies(accepted).subscribe({ error: () => {} });
  }
}
