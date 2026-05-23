import type { Lang } from '@interfaces';
import {
  UN_MEMBER_COUNTRY_CODES,
  UN_MEMBER_COUNTRY_CODE_SET,
} from '../data/un-country-codes';
import type { AppSelectOption } from '../../shared/app-select/app-select.component';

const LOCALE_BY_LANG: Record<Lang, string> = {
  ru: 'ru',
  en: 'en',
  de: 'de',
  kz: 'kk',
  uk: 'uk',
  by: 'be',
};

const displayNamesCache = new Map<string, Intl.DisplayNames>();

function countryDisplayNames(lang: Lang): Intl.DisplayNames {
  const locale = LOCALE_BY_LANG[lang];
  const cached = displayNamesCache.get(locale);
  if (cached) {
    return cached;
  }
  const dn = new Intl.DisplayNames([locale], { type: 'region' });
  displayNamesCache.set(locale, dn);
  return dn;
}

/** Все страны — члены ООН, подписи на языке интерфейса, сортировка по алфавиту. */
export function buildCountrySelectOptions(lang: Lang): AppSelectOption[] {
  const locale = LOCALE_BY_LANG[lang];
  const names = countryDisplayNames(lang);

  return UN_MEMBER_COUNTRY_CODES.map((code) => ({
    value: code,
    label: names.of(code) ?? code,
  })).sort((a, b) => a.label.localeCompare(b.label, locale, { sensitivity: 'base' }));
}

export function isUnCountryCode(code: string | null | undefined): boolean {
  const normalized = String(code ?? '')
    .trim()
    .toUpperCase();
  return normalized.length === 2 && UN_MEMBER_COUNTRY_CODE_SET.has(normalized);
}
