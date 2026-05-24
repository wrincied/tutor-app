import { Injectable, computed, signal } from '@angular/core';
import type { UserProfile } from '@interfaces';

const STORAGE_KEY = 'simple4u_marketing_cookies_v1';

function readStoredChoice(): boolean | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === '1') {
    return true;
  }
  if (raw === '0') {
    return false;
  }
  return null;
}

function writeStoredChoice(value: boolean): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
}

@Injectable({ providedIn: 'root' })
export class MarketingConsentService {
  private readonly _choice = signal<boolean | null>(readStoredChoice());

  /** `true` — принято, `false` — отклонено, `null` — ещё не выбрано. */
  readonly choice = this._choice.asReadonly();

  readonly hasChoice = computed(() => this._choice() !== null);

  readonly isAccepted = computed(() => this._choice() === true);

  accept(): void {
    this.setChoice(true);
  }

  decline(): void {
    this.setChoice(false);
  }

  /** Профиль (Firestore) имеет приоритет над localStorage. */
  syncFromProfile(profile: UserProfile | null | undefined): void {
    const value = profile?.marketing_cookies_accepted;
    if (value === true || value === false) {
      this.setChoice(value);
    }
  }

  private setChoice(value: boolean): void {
    this._choice.set(value);
    writeStoredChoice(value);
  }
}
