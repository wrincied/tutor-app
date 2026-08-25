import { Injectable, computed, inject, signal } from '@angular/core';
import { provideAppInitializer } from '@angular/core';
import type { Lang, RateCurrency, TaxMode } from '@interfaces';
import { loadLocalePack, type LocalePack } from '../i18n/locale-pack';

export type { Lang, RateCurrency } from '@interfaces';

const STORAGE_KEY = 'tutor_lang';

/** Language names in their own language (picker labels — always available). */
const LANG_LABEL: Record<Lang, string> = {
  de: 'Deutsch',
  en: 'English',
  ru: 'Русский',
  by: 'Русский',
  uk: 'Русский',
  kz: 'Русский',
};

/** UI picker: EN / DE / RU. Other packs stay in the repo for later. */
const ALL_LANGS: Lang[] = ['en', 'de', 'ru'];

const LOCALE_TO_LANG: Record<string, Lang> = {
  ru: 'ru',
  en: 'en',
  de: 'de',
  kk: 'ru',
  kz: 'ru',
  uk: 'ru',
  be: 'ru',
};

function coerceUiLang(raw: string | null | undefined): Lang | null {
  const value = String(raw ?? '').trim().toLowerCase();
  if (value === 'en' || value === 'de' || value === 'ru') {
    return value;
  }
  if (value === 'uk' || value === 'by' || value === 'kz' || value === 'kk' || value === 'be') {
    return 'ru';
  }
  return null;
}

function mapLocaleToLang(tag: string): Lang | null {
  const primary = tag.trim().toLowerCase().split(/[-_]/)[0];
  return LOCALE_TO_LANG[primary] ?? null;
}

function detectDeviceLang(): Lang {
  if (typeof navigator === 'undefined') {
    return 'en';
  }
  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);
  for (const tag of candidates) {
    const lang = coerceUiLang(mapLocaleToLang(tag));
    if (lang) {
      return lang;
    }
  }
  return 'en';
}

function syncDocumentLang(lang: Lang): void {
  if (typeof document === 'undefined') {
    return;
  }
  const map: Record<Lang, string> = {
    ru: 'ru',
    en: 'en',
    de: 'de',
    kz: 'kk',
    uk: 'uk',
    by: 'be',
  };
  document.documentElement.lang = map[lang];
}

function readStoredLang(): Lang {
  if (typeof localStorage !== 'undefined') {
    const stored = coerceUiLang(localStorage.getItem(STORAGE_KEY));
    if (stored) {
      if (localStorage.getItem(STORAGE_KEY) !== stored) {
        localStorage.setItem(STORAGE_KEY, stored);
      }
      return stored;
    }
  }
  return detectDeviceLang();
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly _lang = signal<Lang>(readStoredLang());
  private readonly _pack = signal<LocalePack | null>(null);
  private loadSeq = 0;

  /** Current language code. */
  readonly lang = this._lang.asReadonly();

  /** True after the active language pack has been loaded. */
  readonly ready = computed(() => this._pack() !== null);

  private requirePack(): LocalePack {
    const pack = this._pack();
    if (!pack) {
      throw new Error('I18nService: locale pack not loaded yet');
    }
    return pack;
  }

  /** Load (or reload) pack for the current language. Used by APP_INITIALIZER. */
  async init(): Promise<void> {
    const lang = this._lang();
    syncDocumentLang(lang);
    const pack = await loadLocalePack(lang);
    this._pack.set(pack);
  }

  readonly pageTitles = computed(() => this.requirePack().pageTitles);
  readonly nav = computed(() => this.requirePack().nav);
  readonly studentsUi = computed(() => this.requirePack().students);
  readonly accountUi = computed(() => this.requirePack().account);
  readonly authUi = computed(() => this.requirePack().auth);
  readonly legalUi = computed(() => this.requirePack().legal);
  readonly legalDataUi = computed(() => this.requirePack().legalData);
  readonly legalCookiesUi = computed(() => this.requirePack().legalCookies);
  readonly legalTermsUi = computed(() => this.requirePack().legalTerms);
  readonly calendarUi = computed(() => this.requirePack().calendar);
  readonly sharedUi = computed(() => this.requirePack().shared);
  readonly financeUi = computed(() => this.requirePack().finance);
  readonly activityLogUi = computed(() => this.requirePack().activityLog);
  readonly homeUi = computed(() => this.requirePack().home);
  readonly pricingUi = computed(() => this.requirePack().pricing);
  readonly paymentUi = computed(() => this.requirePack().payment);
  readonly helpFormUi = computed(() => this.requirePack().helpForm);
  readonly adminUi = computed(() => this.requirePack().admin);

  readonly allLangs = ALL_LANGS;

  localeId(): string {
    const map: Record<Lang, string> = {
      de: 'de-DE',
      en: 'en-US',
      by: 'be-BY',
      uk: 'uk-UA',
      ru: 'ru-RU',
      kz: 'kk-KZ',
    };
    return map[this._lang()];
  }

  /**
   * Switch UI language. Loads the pack on demand (cached after first fetch).
   * Fire-and-forget safe: UI updates when the pack arrives.
   */
  setLang(lang: Lang): void {
    void this.setLangAsync(lang);
  }

  async setLangAsync(lang: Lang): Promise<void> {
    const uiLang = coerceUiLang(lang) ?? 'en';
    const seq = ++this.loadSeq;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, uiLang);
    }
    syncDocumentLang(uiLang);
    const pack = await loadLocalePack(uiLang);
    if (seq !== this.loadSeq) {
      return;
    }
    this._pack.set(pack);
    this._lang.set(uiLang);
  }

  labelForLang(code: Lang): string {
    return LANG_LABEL[code];
  }

  /** Short badge in language pickers (UA for Ukrainian — not ISO `UK`). */
  codeForLang(code: Lang): string {
    const map: Record<Lang, string> = {
      de: 'DE',
      en: 'EN',
      by: 'BY',
      uk: 'UA',
      ru: 'RU',
      kz: 'KZ',
    };
    return map[code];
  }

  currencyLabel(code: RateCurrency): string {
    return code;
  }

  taxModeLabel(mode: TaxMode | string): string {
    const labels = this.requirePack().taxModeLabels;
    return labels[mode as TaxMode] ?? String(mode);
  }

  weekdayShortLabels(): string[] {
    const t = this.calendarUi();
    return [
      t.weekdayMon,
      t.weekdayTue,
      t.weekdayWed,
      t.weekdayThu,
      t.weekdayFri,
      t.weekdaySat,
      t.weekdaySun,
    ];
  }
}

/** Block bootstrap until the stored/device language pack is ready. */
export function provideI18nInitializer() {
  return provideAppInitializer(() => {
    const i18n = inject(I18nService);
    return i18n.init();
  });
}
