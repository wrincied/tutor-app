// src/app/core/utils/format-currency.ts
function formatMoneyWithCode(amount, currencyCode, locale, fractionDigits = 2) {
  const code = String(currencyCode || "USD").trim().toUpperCase();
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      currencyDisplay: "code",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    }).format(amount);
  } catch {
    return `${amount.toFixed(fractionDigits)} ${code}`;
  }
}

export {
  formatMoneyWithCode
};
//# sourceMappingURL=chunk-KD4RMTVM.js.map
