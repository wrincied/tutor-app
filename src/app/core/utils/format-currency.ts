/** Формат суммы с ISO-кодом валюты (USD, EUR, BYN …), без локализованных названий. */
export function formatMoneyWithCode(
  amount: number,
  currencyCode: string,
  locale: string,
  fractionDigits = 2,
): string {
  const code = String(currencyCode || 'USD').trim().toUpperCase();
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      currencyDisplay: 'code',
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch {
    return `${amount.toFixed(fractionDigits)} ${code}`;
  }
}
