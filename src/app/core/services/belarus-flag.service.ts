import { Injectable, signal } from '@angular/core';

export type BelarusFlagVariant = 'bchb' | 'official';

const STORAGE_KEY = 'tutor_by_flag';

@Injectable({ providedIn: 'root' })
export class BelarusFlagService {
  readonly variant = signal<BelarusFlagVariant>(this.readStored());

  iconPath(variant: BelarusFlagVariant = this.variant()): string {
    return variant === 'bchb'
      ? '/assets/icons/flag-by-bchb.svg'
      : '/assets/icons/flag-by-official.svg';
  }

  setVariant(variant: BelarusFlagVariant): void {
    this.variant.set(variant);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, variant);
    }
  }

  private readStored(): BelarusFlagVariant {
    if (typeof localStorage === 'undefined') {
      return 'bchb';
    }
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'official' ? 'official' : 'bchb';
  }
}
