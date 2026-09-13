import type { Lang } from '@interfaces';

/** Languages exposed in the URL for SEO / crawlable alternates. */
export const URL_LANGS = ['de', 'en', 'ru'] as const;
export type UrlLang = (typeof URL_LANGS)[number];

const URL_LANG_SET = new Set<string>(URL_LANGS);

export function isUrlLang(value: string | null | undefined): value is UrlLang {
  return !!value && URL_LANG_SET.has(value);
}

export function asUrlLang(lang: Lang | string | null | undefined, fallback: UrlLang = 'de'): UrlLang {
  const value = String(lang ?? '')
    .trim()
    .toLowerCase();
  if (isUrlLang(value)) {
    return value;
  }
  // Legacy URL/UI langs → Russian.
  if (value === 'uk' || value === 'by' || value === 'kz' || value === 'kk' || value === 'be') {
    return 'ru';
  }
  return fallback;
}

/** First path segment if it is a supported locale. */
export function langFromPath(path: string): UrlLang | null {
  const seg = path.split('?')[0].split('#')[0].split('/').filter(Boolean)[0];
  return isUrlLang(seg) ? seg : null;
}

/**
 * Strip leading `/{lang}` from a path. Query/hash are ignored.
 * `/de/app/home` → `/app/home`, `/en` → `/`
 */
export function stripLocalePrefix(path: string): string {
  const clean = path.split('?')[0].split('#')[0] || '/';
  const match = clean.match(/^\/(de|en|ru|uk|by|kz)(?=\/|$)/);
  if (!match) {
    return clean.startsWith('/') ? clean : `/${clean}`;
  }
  const rest = clean.slice(match[0].length);
  return rest ? (rest.startsWith('/') ? rest : `/${rest}`) : '/';
}

/**
 * Prefix a locale-agnostic path with `/{lang}`.
 * `/app/home` + de → `/de/app/home`, `/` + en → `/en`
 */
export function localizePath(path: string, lang: UrlLang): string {
  const stripped = stripLocalePrefix(path.split('?')[0].split('#')[0] || '/');
  if (stripped === '/' || stripped === '') {
    return `/${lang}`;
  }
  return `/${lang}${stripped.startsWith('/') ? stripped : `/${stripped}`}`;
}

/** Router command array: `localeCommands('de', 'app', 'home')` → `['/', 'de', 'app', 'home']`. */
export function localeCommands(lang: UrlLang, ...segments: string[]): (string | number)[] {
  const parts = segments
    .flatMap((s) => String(s).split('/'))
    .map((s) => s.trim())
    .filter(Boolean);
  return ['/', lang, ...parts];
}

/** Read preferred URL lang from localStorage (same key as I18nService). */
export function readStoredUrlLang(fallback: UrlLang = 'de'): UrlLang {
  if (typeof localStorage === 'undefined') {
    return fallback;
  }
  return asUrlLang(localStorage.getItem('tutor_lang'), fallback);
}

/** True when path (with or without locale) is under the authenticated `/app` shell. */
export function isAppShellPath(path: string): boolean {
  return stripLocalePrefix(path).startsWith('/app');
}
