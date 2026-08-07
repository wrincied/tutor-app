import type {
  Lang,
  NavStrings,
  PageTitleStrings,
  AccountStrings,
  AuthStrings,
  LegalCommonStrings,
  LegalDataProcessingStrings,
  LegalCookiesStrings,
  LegalTermsStrings,
  SharedStrings,
  CalendarStrings,
  FinanceStrings,
  ActivityLogStrings,
  StudentStrings,
  HomeStrings,
  PricingStrings,
  AdminStrings,
  TaxMode,
} from '@interfaces';

/** All UI strings for a single language (lazy-loaded pack). */
export type LocalePack = {
  nav: NavStrings;
  pageTitles: PageTitleStrings;
  account: AccountStrings;
  auth: AuthStrings;
  legal: LegalCommonStrings;
  legalData: LegalDataProcessingStrings;
  legalCookies: LegalCookiesStrings;
  legalTerms: LegalTermsStrings;
  shared: SharedStrings;
  calendar: CalendarStrings;
  taxModeLabels: Record<TaxMode, string>;
  finance: FinanceStrings;
  activityLog: ActivityLogStrings;
  students: StudentStrings;
  home: HomeStrings;
  pricing: PricingStrings;
  admin: AdminStrings;
};

const cache = new Map<Lang, Promise<LocalePack>>();

/** Dynamically import one language pack (Vite/Angular code-split). */
export function loadLocalePack(lang: Lang): Promise<LocalePack> {
  let pending = cache.get(lang);
  if (!pending) {
    pending = importLocale(lang);
    cache.set(lang, pending);
  }
  return pending;
}

async function importLocale(lang: Lang): Promise<LocalePack> {
  switch (lang) {
    case 'ru':
      return (await import('./packs/ru.pack')).LOCALE_PACK;
    case 'en':
      return (await import('./packs/en.pack')).LOCALE_PACK;
    case 'de':
      return (await import('./packs/de.pack')).LOCALE_PACK;
    case 'kz':
      return (await import('./packs/kz.pack')).LOCALE_PACK;
    case 'uk':
      return (await import('./packs/uk.pack')).LOCALE_PACK;
    case 'by':
      return (await import('./packs/by.pack')).LOCALE_PACK;
    default: {
      const _exhaustive: never = lang;
      return _exhaustive;
    }
  }
}
