import {
  Injectable,
  effect,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-27NINFBT.js";

// src/app/core/services/theme.service.ts
var STORAGE_KEY = "tutor_theme";
function readStoredDark() {
  if (typeof localStorage === "undefined") {
    return false;
  }
  return localStorage.getItem(STORAGE_KEY) === "dark";
}
var ThemeService = class _ThemeService {
  dark = signal(readStoredDark(), ...ngDevMode ? [{ debugName: "dark" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      const theme = this.dark() ? "dark" : "light";
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", theme);
      }
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    });
  }
  toggle() {
    this.dark.update((value) => !value);
  }
  static \u0275fac = function ThemeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

export {
  ThemeService
};
//# sourceMappingURL=chunk-4BCFSGY7.js.map
