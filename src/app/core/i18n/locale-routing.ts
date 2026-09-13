import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, type UrlTree } from '@angular/router';
import { I18nService } from '../services/i18n.service';
import { asUrlLang, isUrlLang, localizePath, readStoredUrlLang, type UrlLang } from './locale-url';

/** Validate first URL segment is a UrlLang (used with path `:lang`). */
export const langSegmentCanMatch: CanMatchFn = (_route, segments) => {
  const first = segments[0]?.path;
  return isUrlLang(first);
};

/** Sync I18nService from `:lang` route param (and keep localStorage in sync). */
export const langSyncGuard: CanActivateFn = (route) => {
  const i18n = inject(I18nService);
  const raw = String(route.paramMap.get('lang') || '').toLowerCase();
  if (!isUrlLang(raw)) {
    return inject(Router).createUrlTree([readStoredUrlLang()]);
  }
  if (i18n.lang() !== raw) {
    void i18n.setLangAsync(raw, { navigate: false });
  }
  return true;
};

/** Legacy unprefixed URL → `/{storedLang}{path}`. */
export function legacyLocaleRedirect(pathWithoutLang: string): CanActivateFn {
  return () => {
    const router = inject(Router);
    const lang = readStoredUrlLang();
    const tree = router.parseUrl(localizePath(pathWithoutLang, lang));
    const current = router.getCurrentNavigation()?.extractedUrl;
    if (current?.queryParams) {
      tree.queryParams = { ...current.queryParams };
    }
    if (current?.fragment) {
      tree.fragment = current.fragment;
    }
    return tree;
  };
}

export function localeUrlTree(
  router: Router,
  lang: UrlLang | string,
  pathWithoutLang: string,
  queryParams?: Record<string, string | undefined>,
): UrlTree {
  const tree = router.parseUrl(localizePath(pathWithoutLang, asUrlLang(lang)));
  if (queryParams) {
    tree.queryParams = Object.fromEntries(
      Object.entries(queryParams).filter(([, v]) => v != null && v !== '') as [string, string][],
    );
  }
  return tree;
}
