import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import type { PageTitleKey } from '@interfaces';
import { environment } from '@environment';
import { I18nService } from './i18n.service';
import {
  SEO_CANONICAL_ORIGIN,
  SEO_OG_IMAGE,
  isNoindexPage,
  pageDescription,
  seoLang,
  structuredDataJson,
} from '../seo/seo-copy';

const PAGE_TITLE_KEYS = new Set<PageTitleKey>([
  'default',
  'landing',
  'login',
  'register',
  'legalDataProcessing',
  'legalCookies',
  'legalImpressum',
  'legalTerms',
  'help',
  'status',
  'adminLogin',
  'verifyEmail',
  'onboarding',
  'home',
  'students',
  'calendar',
  'workspace',
  'finance',
  'pricing',
  'account',
  'accountCustomization',
  'accountProfile',
  'accountAdministration',
  'admin',
  'adminUsers',
  'adminSettings',
  'adminLanding',
  'notFound',
]);

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
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
    const title = titles[key] ?? titles.default;
    const description = pageDescription(key, this.i18n.lang());
    const path = this.router.url.split('?')[0].split('#')[0] || '/';
    const canonical = this.canonicalUrl(path);
    const noindex = isNoindexPage(path, key);
    const htmlLang = seoLang(this.i18n.lang());

    this.titleService.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({
      name: 'robots',
      content: noindex ? 'noindex, nofollow' : 'index, follow',
    });
    this.meta.updateTag({ name: 'author', content: 'Simple4U, Graz, Austria' });
    this.upsertLink('canonical', canonical);

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Simple4U' });
    this.meta.updateTag({ property: 'og:locale', content: htmlLang === 'de' ? 'de_AT' : 'en_US' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:image', content: SEO_OG_IMAGE });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/png' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: SEO_OG_IMAGE });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    this.upsertJsonLd(structuredDataJson(this.i18n.lang()));
  }

  /** Повторно применить заголовок после смены языка. */
  refreshTitle(): void {
    if (this.currentKey) {
      this.updateTitle(this.currentKey);
      return;
    }
    this.updateFromActiveRoute();
  }

  private canonicalUrl(path: string): string {
    const origin = (environment.appUrl || SEO_CANONICAL_ORIGIN).replace(/\/$/, '');
    const clean = path === '/' ? '/' : path.replace(/\/$/, '');
    return `${origin}${clean}`;
  }

  private upsertLink(rel: string, href: string): void {
    const head = this.document.head;
    let el = head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!el) {
      el = this.document.createElement('link');
      el.rel = rel;
      head.appendChild(el);
    }
    el.href = href;
  }

  private upsertJsonLd(json: string): void {
    const head = this.document.head;
    let el = head.querySelector<HTMLScriptElement>('script[data-seo-jsonld]');
    if (!el) {
      el = this.document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-seo-jsonld', '1');
      head.appendChild(el);
    }
    el.textContent = json;
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
