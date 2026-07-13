import type { AppCurrency } from './currencies';

export interface ExchangeRateSource {
  label: string;
  url: string;
}

/** Официальные страницы курсов центральных банков. */
export const EXCHANGE_RATE_LINKS: Record<AppCurrency, ExchangeRateSource> = {
  EUR: {
    label: 'ECB',
    url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
  },
  USD: {
    label: 'ECB',
    url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/usd.en.html',
  },
  PLN: {
    label: 'NBP',
    url: 'https://www.nbp.pl/en/statistic-and-financial-reporting/rates/table-a/',
  },
  RUB: {
    label: 'ЦБ РФ',
    url: 'https://www.cbr.ru/currency_base/daily/',
  },
  BYN: {
    label: 'НБРБ',
    url: 'https://www.nbrb.by/statistics/rates/ratesdaily',
  },
  KZT: {
    label: 'НБК',
    url: 'https://nationalbank.kz/ru/exchangerates/ezhednevnye-oficialnye-rynochnye-kursy-valyut',
  },
};

export function getExchangeRateSourceLink(currency: string): ExchangeRateSource {
  if (currency in EXCHANGE_RATE_LINKS) {
    return EXCHANGE_RATE_LINKS[currency as AppCurrency];
  }
  return EXCHANGE_RATE_LINKS.EUR;
}
