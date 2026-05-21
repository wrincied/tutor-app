import { effect, Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'tutor_theme';

function readStoredDark(): boolean {
  if (typeof localStorage === 'undefined') {
    return false;
  }
  return localStorage.getItem(STORAGE_KEY) === 'dark';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly dark = signal(readStoredDark());

  constructor() {
    effect(() => {
      const theme = this.dark() ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    });
  }

  toggle(): void {
    this.dark.update((value) => !value);
  }
}
