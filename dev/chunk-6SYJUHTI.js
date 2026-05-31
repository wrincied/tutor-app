// src/app/core/utils/user-profile.utils.ts
var CONFIGURED_TAX_MODES = /* @__PURE__ */ new Set([
  "at-self-employed",
  "de-kleinunternehmer",
  "pl-ryczalt",
  "ru-usn",
  "ru-ip",
  "by-ip",
  "kz-ip"
]);
function normalizeTaxMode(raw) {
  const value = String(raw ?? "none").trim();
  if (!value || value === "none") {
    return "none";
  }
  if (value === "austria-self-employed") {
    return "at-self-employed";
  }
  return value;
}
function isTaxModeConfigured(raw) {
  const mode = normalizeTaxMode(raw);
  return mode !== "none" && CONFIGURED_TAX_MODES.has(mode);
}
function canPurchaseSubscription(profile) {
  if (!profile) {
    return false;
  }
  const taxOk = profile.tax_mode_configured ?? isTaxModeConfigured(profile.tax_mode);
  return taxOk && profile.subscription_status === "free";
}
function subscriptionStatusLabel(status, labels) {
  if (status === "pro") {
    return labels.pro;
  }
  if (status === "trial") {
    return labels.trial;
  }
  return labels.free;
}
var SETUP_TAX_MODES = [
  "at-self-employed",
  "de-kleinunternehmer",
  "pl-ryczalt",
  "ru-usn",
  "ru-ip",
  "by-ip",
  "kz-ip"
];

export {
  normalizeTaxMode,
  isTaxModeConfigured,
  canPurchaseSubscription,
  subscriptionStatusLabel,
  SETUP_TAX_MODES
};
//# sourceMappingURL=chunk-6SYJUHTI.js.map
