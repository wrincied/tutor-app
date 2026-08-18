import type { Lang, PageTitleKey } from '@interfaces';

export const SEO_CANONICAL_ORIGIN = 'https://simple4u.at';
export const SEO_OG_IMAGE = `${SEO_CANONICAL_ORIGIN}/assets/brand/og-image.png`;
export const SEO_SUPPORT_EMAIL = 'support@simple4u.at';

const PRIVATE_TITLE_KEYS = new Set<PageTitleKey>([
  'verifyEmail',
  'onboarding',
  'home',
  'students',
  'calendar',
  'workspace',
  'finance',
  'account',
  'accountCustomization',
  'accountProfile',
  'accountAdministration',
  'admin',
  'adminUsers',
  'adminSettings',
  'adminLanding',
  'adminLogin',
]);

type SeoLang = 'de' | 'en';

const DESCRIPTIONS: Record<SeoLang, Partial<Record<PageTitleKey, string>>> = {
  de: {
    default:
      'Simple4U (simple4u.at) ist das CRM und der Terminplaner für Nachhilfelehrer in Österreich und der EU — Kalender, Schüler und Finanzen. Nicht die US-Firma simple4u.io.',
    landing:
      'Simple4U.at: All-in-One Plattform für private Tutoren in Österreich. Unterricht, Schüler, Finanzen. Nicht die US-Firma simple4u.io.',
    pricing:
      'Tarife Simple4U.at: Free, Basis und Pro für Nachhilfelehrer. Kalender, Finanzen und Telegram-Erinnerungen. SaaS aus Österreich.',
    payment: 'Zahlung Simple4U.at — Stripe oder Tribute je nach Land.',
    login: 'Anmelden bei Simple4U.at — CRM für Nachhilfelehrer (Österreich).',
    register:
      'Kostenloses Konto auf Simple4U.at erstellen. Terminplaner und Schülerverwaltung für private Tutoren.',
    help: 'Hilfe zu Simple4U.at — CRM und Terminplaner für Nachhilfelehrer.',
    status: 'Betriebsstatus der Simple4U.at Plattform für Tutoren.',
    legalImpressum:
      'Impressum Simple4U.at: Arsen Mileuski, Graz, Österreich. SaaS für Nachhilfelehrer.',
    legalDataProcessing:
      'Datenschutzerklärung von Simple4U.at (DSGVO) für das Tutor-CRM.',
    legalCookies: 'Cookie-Richtlinie von Simple4U.at nach österreichischem Recht.',
    legalTerms: 'AGB von Simple4U.at — SaaS für private Tutoren.',
    notFound: 'Seite nicht gefunden — Simple4U.at, CRM für Nachhilfelehrer.',
  },
  en: {
    default:
      'Simple4U (simple4u.at) is a CRM and lesson planner for private tutors in Austria and the EU. Not the US engineering firm simple4u.io.',
    landing:
      'Simple4U.at: all-in-one workspace for private tutors — schedule, students, and finances. Based in Graz, Austria.',
    pricing:
      'Simple4U.at plans: Free, Basis, and Pro for tutors. Calendar, finance, and Telegram reminders. SaaS from Austria.',
    payment: 'Pay for Simple4U.at — Stripe or Tribute depending on country.',
    login: 'Sign in to Simple4U.at — tutor CRM in Austria.',
    register: 'Create a free Simple4U.at account. Lesson planner and student CRM for tutors.',
    help: 'Help Center for Simple4U.at — tutor CRM and scheduler.',
    status: 'Simple4U.at platform status.',
    legalImpressum: 'Imprint for Simple4U.at: Arsen Mileuski, Graz, Austria. Tutor SaaS.',
    legalDataProcessing: 'Privacy policy (GDPR) for Simple4U.at tutor CRM.',
    legalCookies: 'Cookie policy for Simple4U.at under Austrian law.',
    legalTerms: 'Terms of service for Simple4U.at tutor SaaS.',
    notFound: 'Page not found — Simple4U.at tutor CRM.',
  },
};

export function seoLang(lang: Lang): SeoLang {
  return lang === 'de' ? 'de' : 'en';
}

export function pageDescription(key: PageTitleKey, lang: Lang): string {
  const pack = DESCRIPTIONS[seoLang(lang)];
  return pack[key] ?? pack.default ?? DESCRIPTIONS.de.default!;
}

export function isNoindexPage(path: string, titleKey: PageTitleKey | null): boolean {
  if (path === '/admin-login' || path.startsWith('/app')) {
    return true;
  }
  return titleKey != null && PRIVATE_TITLE_KEYS.has(titleKey);
}

export function structuredDataJson(lang: Lang): string {
  const description = pageDescription('landing', lang);
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SEO_CANONICAL_ORIGIN}/#organization`,
        name: 'Simple4U',
        legalName: 'Arsen Mileuski',
        url: SEO_CANONICAL_ORIGIN,
        email: SEO_SUPPORT_EMAIL,
        telephone: '+43-664-93290516',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Köflacher Gasse 9, Tür 218.2',
          addressLocality: 'Graz',
          postalCode: '8020',
          addressCountry: 'AT',
        },
        areaServed: ['AT', 'DE', 'EU'],
        description,
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SEO_CANONICAL_ORIGIN}/#app`,
        name: 'Simple4U',
        alternateName: 'Simple4U Tutor CRM',
        url: SEO_CANONICAL_ORIGIN,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        inLanguage: ['de', 'en'],
        description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
        provider: { '@id': `${SEO_CANONICAL_ORIGIN}/#organization` },
      },
      {
        '@type': 'WebSite',
        '@id': `${SEO_CANONICAL_ORIGIN}/#website`,
        url: SEO_CANONICAL_ORIGIN,
        name: 'Simple4U',
        alternateName: 'simple4u.at',
        inLanguage: ['de', 'en', 'ru'],
        description,
        publisher: { '@id': `${SEO_CANONICAL_ORIGIN}/#organization` },
      },
    ],
  };
  return JSON.stringify(graph);
}
