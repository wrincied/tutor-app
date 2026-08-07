import type { Lang, PricingStrings } from '@interfaces';

/** Структура совпадает с packs/*.pack.ts `pricing` (и assets/i18n/pricing.*.json). */
export const PRICING_RU: PricingStrings = {
  title: 'Тарифы',
  subtitle: 'Выберите Free навсегда или попробуйте Pro с бесплатным пробным периодом.',
  toggleMonthly: 'Ежемесячно',
  toggleYearly: 'Ежегодно',
  saveBadge: '−20%',
  recommendedBadge: 'Рекомендуем',
  freePlan: {
    name: 'Start / Free',
    priceLabel: '0',
    period: 'навсегда',
    cta: 'Текущий тариф',
    ctaGuest: 'Начать бесплатно',
    features: [
      'До 3 активных учеников',
      'Ручное ведение календаря занятий',
      'Базовый просмотр расписания',
      'Финансовый обзор',
      'Базовые профили учеников',
    ],
  },
  proPlan: {
    name: 'Simple4U Pro',
    periodMonthly: 'в месяц',
    periodYearly: 'в год',
    billedAnnually: 'Списание раз в год · {amount} {currency}/год',
    trialBadge: '14 дней бесплатно',
    microcopy: 'Карта нужна для старта · списание после 14 дней · отмена в любой момент.',
    cta: 'Начать 14-дневный пробный период',
    ctaLoading: 'Переход к оплате…',
    features: [
      'Безлимитные ученики и группы',
      'Интеллектуальный биллинг (Package / Postpaid)',
      'Защита от мискликов (30-минутный буфер до списания)',
      'Интеграция с Telegram для родителей и учеников',
      'Оценка налогов и соцвзносов (SVS / подоходный налог)',
    ],
  },
  stripeNote: 'Безопасная оплата через Stripe. Карта привязывается при старте trial; первая оплата — после пробного периода, если не отменить.',
  taxRequired: 'Сначала выберите налоговый режим в аккаунте — без этого оплата недоступна.',
  alreadyPro: 'У вас уже активен Pro',
  alreadyTrial: 'Активен пробный период Pro',
  accountLink: 'Перейти в аккаунт',
  faq: {
    title: 'Часто задаваемые вопросы',
    items: [
      {
        q: 'Это для школ?',
        a: 'Нет. Simple4U создан исключительно для частных репетиторов и преподавателей.',
      },
      {
        q: 'Что входит в бесплатный тариф?',
        a: 'Тариф Free навсегда бесплатен для работы с до 3 активных учеников, включая календарь и финансовый обзор.',
      },
      {
        q: 'Как работает 14-дневный пробный период?',
        a: 'Pro открывается сразу на 14 дней. Карту нужно указать при оформлении (требование Stripe), но списание происходит только после trial — если до этого не отменить подписку.',
      },
      {
        q: 'Нужна ли регистрация ИП (Gewerbe)?',
        a: 'Для работы в Simple4U — нет. Нужно ли вам регистрировать деятельность, зависит от законов вашей страны и объема доходов.',
      },
      {
        q: 'Безопасна ли оплата?',
        a: 'Да. Все транзакции обрабатываются через Stripe. Данные банковских карт не хранятся на наших серверах.',
      },
      {
        q: 'Можно ли отменить подписку в любой момент?',
        a: 'Да. Отключить Pro можно в настройках аккаунта в один клик. Вы просто вернетесь на тариф Free.',
      },
    ],
  },
};

export const PRICING_EN: PricingStrings = {
  title: 'Pricing',
  subtitle: 'Choose Free forever, or try Pro with a free trial.',
  toggleMonthly: 'Monthly',
  toggleYearly: 'Yearly',
  saveBadge: '−20%',
  recommendedBadge: 'Recommended',
  freePlan: {
    name: 'Start / Free',
    priceLabel: '0',
    period: 'forever',
    cta: 'Current plan',
    ctaGuest: 'Start for free',
    features: [
      'Up to 3 active students',
      'Manual lesson calendar',
      'Basic schedule view',
      'Financial dashboard overview',
      'Basic client profiles',
    ],
  },
  proPlan: {
    name: 'Simple4U Pro',
    periodMonthly: 'per month',
    periodYearly: 'per year',
    billedAnnually: 'Billed annually · {amount} {currency}/yr',
    trialBadge: '14-day free trial',
    microcopy: 'Card required to start · billed after 14 days · cancel anytime.',
    cta: 'Start 14-day free trial',
    ctaLoading: 'Redirecting to checkout…',
    features: [
      'Unlimited students and groups',
      'Smart billing (Package / Postpaid)',
      'Misclick protection (30-min buffer before debit)',
      'Telegram integration for parents and students',
      'Tax & social security estimates (SVS / income tax)',
    ],
  },
  stripeNote: 'Secure checkout via Stripe. A card is saved at trial start; the first charge is after the trial unless you cancel.',
  taxRequired: 'Set your tax regime in Account first — checkout is unavailable until then.',
  alreadyPro: 'You already have Pro',
  alreadyTrial: 'Pro trial is active',
  accountLink: 'Go to account',
  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'Is this for schools?',
        a: 'No. Simple4U is built exclusively for private tutors and teachers.',
      },
      {
        q: 'What is included in the free plan?',
        a: 'The Free plan is free forever for up to 3 active students, including calendar and financial overview.',
      },
      {
        q: 'How does the 14-day free trial work?',
        a: 'Pro unlocks immediately for 14 days. Stripe requires a card at checkout, but you are charged only after the trial — unless you cancel first.',
      },
      {
        q: 'Do I need to register a business (Gewerbe)?',
        a: 'Not to use Simple4U. Whether you need to register your activity depends on your country’s laws and your income level.',
      },
      {
        q: 'Is payment secure?',
        a: 'Yes. All transactions are processed through Stripe. Card data is never stored on our servers.',
      },
      {
        q: 'Can I cancel my subscription anytime?',
        a: 'Yes. You can turn off Pro in account settings with one click. You’ll simply go back to the Free plan.',
      },
    ],
  },
};

export const PRICING_DE: PricingStrings = {
  title: 'Preise',
  subtitle: 'Wähle Free dauerhaft oder Pro mit kostenloser Testphase.',
  toggleMonthly: 'Monatlich',
  toggleYearly: 'Jährlich',
  saveBadge: '−20%',
  recommendedBadge: 'Empfohlen',
  freePlan: {
    name: 'Start / Free',
    priceLabel: '0',
    period: 'dauerhaft',
    cta: 'Aktueller Tarif',
    ctaGuest: 'Kostenlos starten',
    features: [
      'Bis zu 3 aktive Schüler',
      'Manueller Unterrichtskalender',
      'Einfache Terminplan-Ansicht',
      'Finanzübersicht',
      'Basis-Schülerprofile',
    ],
  },
  proPlan: {
    name: 'Simple4U Pro',
    periodMonthly: 'pro Monat',
    periodYearly: 'pro Jahr',
    billedAnnually: 'Jährlich abgerechnet · {amount} {currency}/Jahr',
    trialBadge: '14 Tage gratis testen',
    microcopy: 'Karte nötig zum Start · Abbuchung nach 14 Tagen · jederzeit kündbar.',
    cta: '14-Tage-Test starten',
    ctaLoading: 'Weiter zur Zahlung…',
    features: [
      'Unbegrenzte Schüler und Gruppen',
      'Intelligentes Billing (Package / Postpaid)',
      'Schutz vor Fehlklicks (30-Min.-Puffer vor Abbuchung)',
      'Telegram-Integration für Eltern und Schüler',
      'Steuer- & Sozialversicherungs-Schätzung (SVS / ESt)',
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
        q: 'Ist Simple4U für Schulen gedacht?',
        a: 'Nein. Simple4U wurde ausschließlich für private Tutoren und Lehrkräfte entwickelt.',
      },
      {
        q: 'Was ist im Free-Plan enthalten?',
        a: 'Der Free-Plan ist dauerhaft kostenlos für bis zu 3 aktive Schüler — inklusive Kalender und Finanzübersicht.',
      },
      {
        q: 'Brauche ich eine Gewerbeanmeldung?',
        a: 'Für die Nutzung von Simple4U nicht. Ob Sie Ihre Tätigkeit anmelden müssen, hängt von den Gesetzen Ihres Landes und Ihrem Umsatz ab.',
      },
      {
        q: 'Wie sicher sind Zahlungen?',
        a: 'Ja. Alle Transaktionen werden über Stripe abgewickelt. Kartendaten werden nicht auf unseren Servern gespeichert.',
      },
      {
        q: 'Kann ich das Abo jederzeit kündigen?',
        a: 'Ja. Pro können Sie in den Kontoeinstellungen mit einem Klick beenden. Danach nutzen Sie wieder den Free-Plan.',
      },
    ],
  },
};

export const PRICING_UK: PricingStrings = {
  ...PRICING_RU,
  title: 'Тарифи',
  subtitle: 'Оберіть Free назавжди або спробуйте Pro з безкоштовним пробним періодом.',
  toggleMonthly: 'Щомісяця',
  toggleYearly: 'Щороку',
  saveBadge: '−20%',
  recommendedBadge: 'Рекомендуємо',
  freePlan: {
    ...PRICING_RU.freePlan,
    period: 'назавжди',
    cta: 'Поточний тариф',
    ctaGuest: 'Почати безкоштовно',
    features: [
      'До 3 активних учнів',
      'Ручне ведення календаря занять',
      'Базовий перегляд розкладу',
      'Фінансовий огляд',
      'Базові профілі учнів',
    ],
  },
  proPlan: {
    ...PRICING_RU.proPlan,
    periodMonthly: 'на місяць',
    periodYearly: 'на рік',
    billedAnnually: 'Списання раз на рік · {amount} {currency}/рік',
    trialBadge: '14 днів безкоштовно',
    microcopy: 'Картка потрібна для старту · списання після 14 днів · скасування будь-коли.',
    cta: 'Почати 14-денний пробний період',
    ctaLoading: 'Перехід до оплати…',
    features: [
      'Безлімітні учні та групи',
      'Інтелектуальний білінг (Package / Postpaid)',
      'Захист від помилкових кліків (30-хв буфер до списання)',
      'Інтеграція з Telegram для батьків і учнів',
      'Оцінка податків і соцвнесків (SVS / податок на дохід)',
    ],
  },
  stripeNote: 'Безпечна оплата через Stripe. Скасування в один клік.',
  taxRequired: 'Спочатку оберіть податковий режим в акаунті — без цього оплата недоступна.',
  alreadyPro: 'У вас уже активний Pro',
  alreadyTrial: 'Активний пробний період Pro',
  accountLink: 'Перейти в акаунт',
  faq: {
    title: 'Часті запитання',
    items: [
      {
        q: 'Це для шкіл?',
        a: 'Ні. Simple4U створений виключно для приватних репетиторів і викладачів.',
      },
      {
        q: 'Що входить у безкоштовний тариф?',
        a: 'Тариф Free назавжди безкоштовний для роботи з до 3 активних учнів, включно з календарем і фінансовим оглядом.',
      },
      {
        q: 'Чи потрібна реєстрація ФОП (Gewerbe)?',
        a: 'Для роботи в Simple4U — ні. Чи потрібно реєструвати діяльність, залежить від законів вашої країни та обсягу доходів.',
      },
      {
        q: 'Чи безпечна оплата?',
        a: 'Так. Усі транзакції обробляються через Stripe. Дані банківських карток не зберігаються на наших серверах.',
      },
      {
        q: 'Чи можна скасувати підписку будь-коли?',
        a: 'Так. Вимкнути Pro можна в налаштуваннях акаунта в один клік. Ви просто повернетесь на тариф Free.',
      },
    ],
  },
};

export const PRICING_BY: PricingStrings = {
  ...PRICING_RU,
  title: 'Тарыфы',
  subtitle: 'Абярыце Free назаўжды або паспрабуйце Pro з бясплатным пробным перыядам.',
  toggleMonthly: 'Штомесяц',
  toggleYearly: 'Штогод',
  saveBadge: '−20%',
  recommendedBadge: 'Рэкамендуем',
  freePlan: {
    ...PRICING_RU.freePlan,
    period: 'назаўжды',
    cta: 'Бягучы тарыф',
    ctaGuest: 'Пачаць бясплатна',
    features: [
      'Да 3 актыўных вучняў',
      'Ручное вядзенне календара заняткаў',
      'Базовы прагляд раскладу',
      'Фінансавы агляд',
      'Базовыя профілі вучняў',
    ],
  },
  proPlan: {
    ...PRICING_RU.proPlan,
    periodMonthly: 'у месяц',
    periodYearly: 'у год',
    billedAnnually: 'Спісанне раз на год · {amount} {currency}/год',
    trialBadge: '14 дзён бясплатна',
    microcopy: 'Картка патрэбна для старту · спісанне пасля 14 дзён · адмена ў любы момант.',
    cta: 'Пачаць 14-дзённы пробны перыяд',
    features: [
      'Безлімітныя вучні і групы',
      'Інтэлектуальны білінг (Package / Postpaid)',
      'Абарона ад памылковых клікаў (30-хв буфер)',
      'Інтэграцыя з Telegram',
      'Ацэнка падаткаў і сацунёсаў (SVS / падаходны)',
    ],
  },
  accountLink: 'Перайсці ў акаўнт',
  faq: { title: 'Частыя пытанні', items: PRICING_RU.faq.items },
};

export const PRICING_KZ: PricingStrings = {
  ...PRICING_RU,
  title: 'Тарифтер',
  subtitle: 'Free мәңгі немесе Pro тегін сынақпен таңдаңыз.',
  toggleMonthly: 'Ай сайын',
  toggleYearly: 'Жыл сайын',
  saveBadge: '−20%',
  recommendedBadge: 'Ұсынылады',
  freePlan: {
    ...PRICING_RU.freePlan,
    period: 'мәңгі',
    cta: 'Ағымдағы тариф',
    ctaGuest: 'Тегін бастау',
    features: [
      '3 белсенді оқушыға дейін',
      'Қолмен кесте жүргізу',
      'Негізгі кесте көрінісі',
      'Қаржы шолуы',
      'Негізгі оқушы профильдері',
    ],
  },
  proPlan: {
    ...PRICING_RU.proPlan,
    periodMonthly: 'айына',
    periodYearly: 'жылына',
    billedAnnually: 'Жылына бір рет · {amount} {currency}/жыл',
    trialBadge: '14 күн тегін',
    microcopy: 'Бастау үшін карта керек · 14 күннен кейін төлем · кез келген уақытта бас тарту.',
    cta: '14 күндік сынақты бастау',
    ctaLoading: 'Төлемге өту…',
    features: [
      'Шексіз оқушылар мен топтар',
      'Ақылды биллинг (Package / Postpaid)',
      'Қате басудан қорғау (30 мин буфер)',
      'Telegram интеграциясы',
      'Салық және әлеуметтік төлемдер бағасы (SVS / табыс салығы)',
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
