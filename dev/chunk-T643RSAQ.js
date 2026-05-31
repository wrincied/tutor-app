import {
  RouterLink
} from "./chunk-HPUTEZXI.js";
import {
  Component,
  I18nService,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-27NINFBT.js";

// src/app/features/landing/landing.component.ts
var LandingComponent = class _LandingComponent {
  i18n = inject(I18nService);
  static \u0275fac = function LandingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LandingComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LandingComponent, selectors: [["app-landing"]], decls: 5, vars: 2, consts: [[1, "landing"], ["routerLink", "/login"], ["routerLink", "/register"]], template: function LandingComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "a", 1);
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 2);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().login);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().createAccount);
    }
  }, dependencies: [RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LandingComponent, [{
    type: Component,
    args: [{ selector: "app-landing", imports: [RouterLink], template: '<div class="landing">\n  <a routerLink="/login">{{ i18n.authUi().login }}</a>\n  <a routerLink="/register">{{ i18n.authUi().createAccount }}</a>\n</div>\n' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LandingComponent, { className: "LandingComponent", filePath: "app/features/landing/landing.component.ts", lineNumber: 10 });
})();
export {
  LandingComponent
};
//# sourceMappingURL=chunk-T643RSAQ.js.map
