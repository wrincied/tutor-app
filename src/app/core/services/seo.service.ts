import { DestroyRef, Injectable, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import type { PageTitleKey } from '@interfaces';
import { I18nService } from './i18n.service';

const PAGE_TITLE_KEYS = new Set<PageTitleKey>([
  'default',
  'landing',
  'login',
  'register',
  'legalDataProcessing',
  'legalCookies',
  'verifyEmail',
  'onboarding',
  'home',
  'students',
  'calendar',
  'finance',
  'pricing',
  'account',
  'accountCustomization',
  'accountProfile',
  'admin',
]);

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private currentKey: PageTitleKey | null = null;

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateFromActiveRoute());

    effect(() => {
      this.i18n.lang();
      this.refreshTitle();
    });

    this.updateFromActiveRoute();
  }

  /** Установить заголовок по ключу перевода (из route data). */
  updateTitle(key: PageTitleKey): void {
    this.currentKey = key;
    const titles = this.i18n.pageTitles();
    this.titleService.setTitle(titles[key] ?? titles.default);
  }

  /** Повторно применить заголовок после смены языка. */
  refreshTitle(): void {
    if (this.currentKey) {
      this.updateTitle(this.currentKey);
      return;
    }
    this.updateFromActiveRoute();
  }

  private updateFromActiveRoute(): void {
    const key = this.resolveRouteTitleKey();
    this.updateTitle(key ?? 'default');
  }

  private resolveRouteTitleKey(): PageTitleKey | null {
    let route = this.router.routerState.root;
    let found: string | null = null;

    while (route.firstChild) {
      route = route.firstChild;
      const title = route.snapshot.data['title'];
      if (typeof title === 'string') {
        found = title;
      }
    }

    return found && PAGE_TITLE_KEYS.has(found as PageTitleKey) ? (found as PageTitleKey) : null;
  }
}
