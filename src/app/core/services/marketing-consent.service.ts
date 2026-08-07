import { Injectable, computed, signal } from '@angular/core';
import type { UserProfile } from '@interfaces';

/** v2: stores analytics consent; essential/functional always on. */
const STORAGE_KEY = 'simple4u_cookie_consent_v2';
const LEGACY_KEY = 'simple4u_marketing_cookies_v1';

export type CookieConsentChoice = {
  /** GA4 / Firebase Analytics — requires prior consent (TKG § 165). */
  analytics: boolean;
};

function readStoredChoice(): CookieConsentChoice | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CookieConsentChoice>;
      if (typeof parsed.analytics === 'boolean') {
        return { analytics: parsed.analytics };
      }
    }
  } catch {
    /* fall through to legacy */
  }
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy === '1') {
    return { analytics: true };
  }
  if (legacy === '0') {
    return { analytics: false };
  }
  return null;
}

function writeStoredChoice(value: CookieConsentChoice): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  // Keep legacy key in sync for older profile sync / analytics paths.
  localStorage.setItem(LEGACY_KEY, value.analytics ? '1' : '0');
}

@Injectable({ providedIn: 'root' })
export class MarketingConsentService {
  private readonly _choice = signal<CookieConsentChoice | null>(readStoredChoice());
  private readonly _preferencesOpen = signal(false);
  private readonly _settingsPanelOpen = signal(false);

  readonly choice = this._choice.asReadonly();

  readonly hasChoice = computed(() => this._choice() !== null);

  /** Analytics (GA4) accepted. */
  readonly isAccepted = computed(() => this._choice()?.analytics === true);

  readonly analyticsEnabled = computed(() => this.isAccepted());

  /** First visit or reopened via Cookie Settings. */
  readonly preferencesOpen = this._preferencesOpen.asReadonly();

  readonly settingsPanelOpen = this._settingsPanelOpen.asReadonly();

  readonly shouldShowBanner = computed(
    () => !this.hasChoice() || this._preferencesOpen(),
  );

  /** Draft toggle while settings panel is open (not saved until Save / Accept). */
  private readonly _draftAnalytics = signal(false);
  readonly draftAnalytics = this._draftAnalytics.asReadonly();

  acceptAll(): void {
    this.setChoice({ analytics: true });
    this.closeBanner();
  }

  acceptEssentialOnly(): void {
    this.setChoice({ analytics: false });
    this.closeBanner();
  }

  openPreferences(): void {
    this._draftAnalytics.set(this._choice()?.analytics ?? false);
    this._settingsPanelOpen.set(false);
    this._preferencesOpen.set(true);
  }

  openSettingsPanel(): void {
    this._draftAnalytics.set(this._choice()?.analytics ?? false);
    this._settingsPanelOpen.set(true);
  }

  closeSettingsPanel(): void {
    this._settingsPanelOpen.set(false);
  }

  setDraftAnalytics(value: boolean): void {
    this._draftAnalytics.set(value);
  }

  saveSettings(): void {
    this.setChoice({ analytics: this._draftAnalytics() });
    this.closeBanner();
  }

  closePreferences(): void {
    this.closeBanner();
  }

  /** @deprecated use acceptAll */
  accept(): void {
    this.acceptAll();
  }

  /** @deprecated use acceptEssentialOnly */
  decline(): void {
    this.acceptEssentialOnly();
  }

  syncFromProfile(profile: UserProfile | null | undefined): void {
    const value = profile?.marketing_cookies_accepted;
    if (value === true || value === false) {
      this.setChoice({ analytics: value });
    }
  }

  private closeBanner(): void {
    this._preferencesOpen.set(false);
    this._settingsPanelOpen.set(false);
  }

  private setChoice(value: CookieConsentChoice): void {
    this._choice.set(value);
    writeStoredChoice(value);
  }
}
