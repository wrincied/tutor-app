import type { Lang } from '@interfaces';
import type { CustomLocale } from 'flatpickr/dist/types/locale';
import { Belarusian } from 'flatpickr/dist/l10n/be';
import { German } from 'flatpickr/dist/l10n/de';
import { Russian } from 'flatpickr/dist/l10n/ru';
import { Ukrainian } from 'flatpickr/dist/l10n/uk';

/** Display format for the alt input (ISO stored separately as Y-m-d). */
export function flatpickrAltFormat(lang: Lang): string {
  return lang === 'en' ? 'Y-m-d' : 'd.m.Y';
}

/** Placeholder in empty date fields. */
export function flatpickrDatePlaceholder(lang: Lang): string {
  switch (lang) {
    case 'en':
      return 'YYYY-MM-DD';
    case 'de':
      return 'TT.MM.JJJJ';
    default:
      return 'ДД.ММ.ГГГГ';
  }
}

export function flatpickrLocale(lang: Lang): CustomLocale | undefined {
  switch (lang) {
    case 'de':
      return German;
    case 'ru':
    case 'kz':
      return Russian;
    case 'uk':
      return Ukrainian;
    case 'by':
      return Belarusian;
    default:
      return undefined;
  }
}
