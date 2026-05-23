/** Пересчёт по курсам API: единиц валюты за 1 EUR. */
export function convertWithEurRates(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  eurRates: Record<string, number>,
): number {
  const value = Number(amount);
  if (Number.isNaN(value) || value === 0) {
    return 0;
  }
  const from = String(fromCurrency).toUpperCase();
  const to = String(toCurrency).toUpperCase();
  if (from === to) {
    return Math.round(value * 100) / 100;
  }
  const fromRate = eurRates[from];
  const toRate = eurRates[to];
  if (!fromRate || !toRate || fromRate <= 0 || toRate <= 0) {
    return value;
  }
  return Math.round((value / fromRate) * toRate * 100) / 100;
}
