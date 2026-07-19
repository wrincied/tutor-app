import type { Lang, PricingStrings } from '@interfaces';

/** Структура совпадает с assets/i18n/pricing.{ru,en,de}.json */
export const PRICING_RU: PricingStrings = {
  title: 'Тарифы',
  subtitle: 'Выберите план. Pro — 14 дней бесплатно, карта не нужна.',
  toggleMonthly: 'Ежемесячно',
  toggleYearly: 'Ежегодно',
  saveBadge: '−20%',
  recommendedBadge: 'Pro',
  freePlan: {
    name: 'Start / Free',
    priceLabel: '0',
    period: 'навсегда',
    cta: 'Текущий тариф',
    features: [
      'До 3 активных учеников',
      'Ручное ведение календаря занятий',
      'Базовый просмотр расписания',
    ],
  },
  proPlan: {
    name: 'Simple4U Pro',
    periodMonthly: 'в месяц',
    periodYearly: 'в год',
    trialBadge: '14 дней бесплатно',
    microcopy: 'Кредитная карта не требуется для старта. Отмена в любой момент.',
    cta: 'Начать Pro',
    ctaLoading: 'Переход к оплате…',
    features: [
      'Безлимитные ученики и группы',
      'Интеллектуальный биллинг (Package / Postpaid)',
      'Защита от мискликов (30-минутный буфер до списания)',
      'Интеграция с Telegram для родителей и учеников',
      'Автоматический расчёт налогов SVS и финансовая аналитика',
    ],
  },
  stripeNote: 'Безопасная оплата через Stripe. Отмена в один клик.',
  taxRequired: 'Сначала выберите налоговый режим в аккаунте — без этого оплата недоступна.',
  alreadyPro: 'У вас уже активен Pro',
  alreadyTrial: 'Активен пробный период Pro',
  accountLink: 'Перейти в аккаунт',
  faq: {
    title: 'Часто задаваемые вопросы',
    items: [
      {
        q: 'Как работает бесплатный тестовый период (Trial)?',
        a: 'Вы получаете полный доступ ко всем функциям Pro на 14 дней бесплатно. Карта не нужна на старте. После окончания trial можно оформить подписку или остаться на Free.',
      },
      {
        q: 'Безопасны ли мои платежи?',
        a: 'Все транзакции обрабатываются через Stripe — сертифицированный платёжный провайдер уровня PCI-DSS 1. Данные карты не хранятся на наших серверах.',
      },
      {
        q: 'Могу ли я отменить подписку в любой момент?',
        a: 'Да, отмена в один клик в личном кабинете. Доступ Pro сохранится до конца оплаченного периода.',
      },
    ],
  },
};

export const PRICING_EN: PricingStrings = {
  title: 'Pricing',
  subtitle: 'Pick a plan. Pro includes 14 days free — no card required.',
  toggleMonthly: 'Monthly',
  toggleYearly: 'Yearly',
  saveBadge: '−20%',
  recommendedBadge: 'Pro',
  freePlan: {
    name: 'Start / Free',
    priceLabel: '0',
    period: 'forever',
    cta: 'Current plan',
    features: [
      'Up to 3 active students',
      'Manual lesson calendar',
      'Basic schedule view',
    ],
  },
  proPlan: {
    name: 'Simple4U Pro',
    periodMonthly: 'per month',
    periodYearly: 'per year',
    trialBadge: '14 days free',
    microcopy: 'No card required to start. Cancel anytime.',
    cta: 'Start Pro',
    ctaLoading: 'Redirecting to checkout…',
    features: [
      'Unlimited students and groups',
      'Smart billing (Package / Postpaid)',
      'Misclick protection (30-min buffer before debit)',
      'Telegram integration for parents and students',
      'SVS tax estimates and finance analytics',
    ],
  },
  stripeNote: 'Secure checkout via Stripe. Cancel in one click.',
  taxRequired: 'Set your tax regime in Account first — checkout is unavailable until then.',
  alreadyPro: 'You already have Pro',
  alreadyTrial: 'Pro trial is active',
  accountLink: 'Go to account',
  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'How does the free trial work?',
        a: 'You get full Pro access for 14 days at no charge. No card is required to start. After the trial you can subscribe or stay on Free.',
      },
      {
        q: 'Are my payments secure?',
        a: 'All payments are processed by Stripe, a PCI-DSS Level 1 certified provider. We never store your card details.',
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Yes — cancel in one click from your account. Pro access remains until the end of the paid period.',
      },
    ],
  },
};

export const PRICING_DE: PricingStrings = {
  title: 'Preise',
  subtitle: 'Plan wählen. Pro — 14 Tage gratis, keine Karte nötig.',
  toggleMonthly: 'Monatlich',
  toggleYearly: 'Jährlich',
  saveBadge: '−20%',
  recommendedBadge: 'Pro',
  freePlan: {
    name: 'Start / Free',
    priceLabel: '0',
    period: 'dauerhaft',
    cta: 'Aktueller Tarif',
    features: [
      'Bis zu 3 aktive Schüler',
      'Manueller Unterrichtskalender',
      'Einfache Terminplan-Ansicht',
    ],
  },
  proPlan: {
    name: 'Simple4U Pro',
    periodMonthly: 'pro Monat',
    periodYearly: 'pro Jahr',
    trialBadge: '14 Tage gratis',
    microcopy: 'Keine Karte zum Start nötig. Jederzeit kündbar.',
    cta: 'Pro starten',
    ctaLoading: 'Weiter zur Zahlung…',
    features: [
      'Unbegrenzte Schüler und Gruppen',
      'Intelligentes Billing (Package / Postpaid)',
      'Schutz vor Fehlklicks (30-Min.-Puffer vor Abbuchung)',
      'Telegram-Integration für Eltern und Schüler',
      'SVS-Steuerschätzung und Finanzanalyse',
    ],
  },
  stripeNote: 'Sichere Zahlung über Stripe. Kündigung mit einem Klick.',
  taxRequired:
    'Bitte zuerst das Steuerregime im Konto festlegen — ohne diesen Schritt ist kein Checkout möglich.',
  alreadyPro: 'Pro ist bereits aktiv',
  alreadyTrial: 'Pro-Testphase ist aktiv',
  accountLink: 'Zum Konto',
  faq: {
    title: 'Häufige Fragen',
    items: [
      {
        q: 'Wie funktioniert die kostenlose Testphase?',
        a: '14 Tage voller Pro-Zugang ohne Gebühr. Keine Karte zum Start. Danach Abo oder Free-Tarif.',
      },
      {
        q: 'Sind Zahlungen sicher?',
        a: 'Alle Zahlungen laufen über Stripe (PCI-DSS Level 1). Kartendaten speichern wir nicht.',
      },
      {
        q: 'Kann ich jederzeit kündigen?',
        a: 'Ja — mit einem Klick im Konto. Pro-Zugang bis Periodenende.',
      },
    ],
  },
};

export const PRICING_UK: PricingStrings = {
  ...PRICING_RU,
  title: 'Тарифи',
  subtitle: 'Оберіть план. Pro — 14 днів безкоштовно, картка не потрібна.',
  toggleMonthly: 'Щомісяця',
  toggleYearly: 'Щороку',
  saveBadge: '−20%',
  recommendedBadge: 'Pro',
  freePlan: {
    ...PRICING_RU.freePlan,
    period: 'назавжди',
    cta: 'Поточний тариф',
    features: [
      'До 3 активних учнів',
      'Ручне ведення календаря занять',
      'Базовий перегляд розкладу',
    ],
  },
  proPlan: {
    ...PRICING_RU.proPlan,
    periodMonthly: 'на місяць',
    periodYearly: 'на рік',
    microcopy: 'Картка не потрібна для старту. Скасування в будь-який момент.',
    cta: 'Почати Pro',
    ctaLoading: 'Перехід до оплати…',
    features: [
      'Безлімітні учні та групи',
      'Інтелектуальний білінг (Package / Postpaid)',
      'Захист від помилкових кліків (30-хв буфер до списання)',
      'Інтеграція з Telegram для батьків і учнів',
      'Автоматичний розрахунок податків SVS і фінансова аналітика',
    ],
  },
  stripeNote: 'Безпечна оплата через Stripe. Скасування в один клік.',
  taxRequired: 'Спочатку оберіть податковий режим в акаунті — без цього оплата недоступна.',
  alreadyPro: 'У вас уже активний Pro',
  alreadyTrial: 'Активний пробний період Pro',
  accountLink: 'Перейти в акаунт',
  faq: {
    title: 'Часті запитання',
    items: PRICING_RU.faq.items.map((item, i) => ({
      q: [
        'Як працює безкоштовний пробний період (Trial)?',
        'Чи безпечні мої платежі?',
        'Чи можу я скасувати підписку в будь-який момент?',
      ][i],
      a: [
        'Ви отримуєте повний доступ до Pro на 14 днів безкоштовно. Картка не потрібна на старті.',
        'Усі транзакції через Stripe (PCI-DSS Level 1). Дані картки не зберігаємо.',
        'Так — скасування в один клік. Доступ Pro до кінця оплаченого періоду.',
      ][i],
    })),
  },
};

export const PRICING_BY: PricingStrings = {
  ...PRICING_RU,
  title: 'Тарыфы',
  subtitle: 'Абярыце план. Pro — 14 дзён бясплатна, картка не патрэбна.',
  toggleMonthly: 'Штомесяц',
  toggleYearly: 'Штогод',
  saveBadge: '−20%',
  recommendedBadge: 'Pro',
  freePlan: {
    ...PRICING_RU.freePlan,
    period: 'назаўжды',
    cta: 'Бягучы тарыф',
    features: [
      'Да 3 актыўных вучняў',
      'Ручное вядзенне календара заняткаў',
      'Базовы прагляд раскладу',
    ],
  },
  proPlan: {
    ...PRICING_RU.proPlan,
    periodMonthly: 'у месяц',
    periodYearly: 'у год',
    cta: 'Пачаць Pro',
    features: [
      'Безлімітныя вучні і групы',
      'Інтэлектуальны білінг (Package / Postpaid)',
      'Абарона ад памылковых клікаў (30-хв буфер)',
      'Інтэграцыя з Telegram',
      'Разлік падаткаў SVS і фінансавая аналітыка',
    ],
  },
  accountLink: 'Перайсці ў акаўнт',
  faq: { title: 'Частыя пытанні', items: PRICING_RU.faq.items },
};

export const PRICING_KZ: PricingStrings = {
  ...PRICING_RU,
  title: 'Тарифтер',
  subtitle: 'Жоспарды таңдаңыз. Pro — 14 күн тегін, карта қажет емес.',
  toggleMonthly: 'Ай сайын',
  toggleYearly: 'Жыл сайын',
  saveBadge: '−20%',
  recommendedBadge: 'Pro',
  freePlan: {
    ...PRICING_RU.freePlan,
    period: 'мәңгі',
    cta: 'Ағымдағы тариф',
    features: [
      '3 белсенді оқушыға дейін',
      'Қолмен кесте жүргізу',
      'Негізгі кесте көрінісі',
    ],
  },
  proPlan: {
    ...PRICING_RU.proPlan,
    periodMonthly: 'айына',
    periodYearly: 'жылына',
    cta: 'Pro бастау',
    ctaLoading: 'Төлемге өту…',
    features: [
      'Шексіз оқушылар мен топтар',
      'Ақылды биллинг (Package / Postpaid)',
      'Қате басудан қорғау (30 мин буфер)',
      'Telegram интеграциясы',
      'SVS салық есебі және қаржы аналитикасы',
    ],
  },
  stripeNote: 'Stripe арқылы қауіпсіз төлем. Бір басумен бас тарту.',
  taxRequired: 'Алдымен аккаунтта салық режимін таңдаңыз.',
  accountLink: 'Аккаунтқа өту',
  faq: { title: 'Жиі қойылатын сұрақтар', items: PRICING_EN.faq.items },
};

export const PRICING: Record<Lang, PricingStrings> = {
  ru: PRICING_RU,
  en: PRICING_EN,
  de: PRICING_DE,
  uk: PRICING_UK,
  by: PRICING_BY,
  kz: PRICING_KZ,
};
