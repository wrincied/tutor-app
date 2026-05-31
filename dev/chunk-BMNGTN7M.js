import {
  Injectable,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-27NINFBT.js";

// src/app/core/services/marketing-consent.service.ts
var STORAGE_KEY = "simple4u_marketing_cookies_v1";
function readStoredChoice() {
  if (typeof localStorage === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "1") {
    return true;
  }
  if (raw === "0") {
    return false;
  }
  return null;
}
function writeStoredChoice(value) {
  if (typeof localStorage === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
}
var MarketingConsentService = class _MarketingConsentService {
  _choice = signal(readStoredChoice(), ...ngDevMode ? [{ debugName: "_choice" }] : (
    /* istanbul ignore next */
    []
  ));
  /** `true` — принято, `false` — отклонено, `null` — ещё не выбрано. */
  choice = this._choice.asReadonly();
  hasChoice = computed(() => this._choice() !== null, ...ngDevMode ? [{ debugName: "hasChoice" }] : (
    /* istanbul ignore next */
    []
  ));
  isAccepted = computed(() => this._choice() === true, ...ngDevMode ? [{ debugName: "isAccepted" }] : (
    /* istanbul ignore next */
    []
  ));
  accept() {
    this.setChoice(true);
  }
  decline() {
    this.setChoice(false);
  }
  /** Профиль (Firestore) имеет приоритет над localStorage. */
  syncFromProfile(profile) {
    const value = profile?.marketing_cookies_accepted;
    if (value === true || value === false) {
      this.setChoice(value);
    }
  }
  setChoice(value) {
    this._choice.set(value);
    writeStoredChoice(value);
  }
  static \u0275fac = function MarketingConsentService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MarketingConsentService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MarketingConsentService, factory: _MarketingConsentService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MarketingConsentService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  MarketingConsentService
};
//# sourceMappingURL=chunk-BMNGTN7M.js.map
