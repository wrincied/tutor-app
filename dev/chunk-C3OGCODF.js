import {
  ActivatedRoute
} from "./chunk-HPUTEZXI.js";
import {
  Component,
  I18nService,
  Location,
  computed,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵnextContext,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-27NINFBT.js";

// src/app/features/legal/legal-document.component.ts
function LegalDocumentComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "h1");
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(2, "p", 4);
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(4, "section")(5, "h2");
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(9, "section")(10, "h2");
    \u0275\u0275text(11);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(12, "p");
    \u0275\u0275text(13);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(14, "section")(15, "h2");
    \u0275\u0275text(16);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(17, "p");
    \u0275\u0275text(18);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(19, "section")(20, "h2");
    \u0275\u0275text(21);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(22, "p");
    \u0275\u0275text(23);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalCookiesUi().title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalCookiesUi().intro);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalCookiesUi().section1Title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalCookiesUi().section1Body);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalCookiesUi().section2Title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalCookiesUi().section2Body);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalCookiesUi().section3Title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalCookiesUi().section3Body);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalCookiesUi().section4Title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalCookiesUi().section4Body);
  }
}
function LegalDocumentComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "h1");
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(2, "p", 4);
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(4, "section")(5, "h2");
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(9, "section")(10, "h2");
    \u0275\u0275text(11);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(12, "p");
    \u0275\u0275text(13);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(14, "section")(15, "h2");
    \u0275\u0275text(16);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(17, "p");
    \u0275\u0275text(18);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(19, "section")(20, "h2");
    \u0275\u0275text(21);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(22, "p");
    \u0275\u0275text(23);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(24, "section")(25, "h2");
    \u0275\u0275text(26);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(27, "p");
    \u0275\u0275text(28);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalDataUi().title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalDataUi().intro);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalDataUi().section1Title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalDataUi().section1Body);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalDataUi().section2Title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalDataUi().section2Body);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalDataUi().section3Title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalDataUi().section3Body);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalDataUi().section4Title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalDataUi().section4Body);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalDataUi().section5Title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.legalDataUi().section5Body);
  }
}
var LegalDocumentComponent = class _LegalDocumentComponent {
  route = inject(ActivatedRoute);
  location = inject(Location);
  i18n = inject(I18nService);
  goBack() {
    this.location.back();
  }
  documentId = computed(() => {
    const id = this.route.snapshot.data["doc"];
    return id === "cookies" ? "cookies" : "data-processing";
  }, ...ngDevMode ? [{ debugName: "documentId" }] : (
    /* istanbul ignore next */
    []
  ));
  isCookies = computed(() => this.documentId() === "cookies", ...ngDevMode ? [{ debugName: "isCookies" }] : (
    /* istanbul ignore next */
    []
  ));
  static \u0275fac = function LegalDocumentComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LegalDocumentComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LegalDocumentComponent, selectors: [["app-legal-document"]], decls: 8, vars: 3, consts: [[1, "legal-page"], [1, "legal-page__header"], ["type", "button", 1, "legal-page__back", 3, "click"], [1, "legal-page__updated"], [1, "legal-page__intro"]], template: function LegalDocumentComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "article", 0)(1, "header", 1)(2, "button", 2);
      \u0275\u0275domListener("click", function LegalDocumentComponent_Template_button_click_2_listener() {
        return ctx.goBack();
      });
      \u0275\u0275text(3);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(4, "p", 3);
      \u0275\u0275text(5);
      \u0275\u0275domElementEnd()();
      \u0275\u0275conditionalCreate(6, LegalDocumentComponent_Conditional_6_Template, 24, 10)(7, LegalDocumentComponent_Conditional_7_Template, 29, 12);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.i18n.legalUi().back);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.legalUi().lastUpdated);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isCookies() ? 6 : 7);
    }
  }, styles: ["\n.legal-page[_ngcontent-%COMP%] {\n  max-width: 42rem;\n  margin: 0 auto;\n  padding: 1.5rem 1.25rem 3rem;\n  color: #202124;\n  line-height: 1.55;\n}\n.legal-page__header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  margin-bottom: 1.5rem;\n}\n.legal-page__back[_ngcontent-%COMP%] {\n  border: 0;\n  padding: 0;\n  background: none;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #0f9d58;\n  cursor: pointer;\n  text-decoration: none;\n}\n.legal-page__back[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.legal-page__updated[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.75rem;\n  color: #5f6368;\n}\n.legal-page__intro[_ngcontent-%COMP%] {\n  margin: 0 0 1.5rem;\n  font-size: 0.9375rem;\n  color: #5f6368;\n}\n.legal-page[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  font-size: 1.5rem;\n  font-weight: 500;\n}\n.legal-page[_ngcontent-%COMP%]   section[_ngcontent-%COMP%] {\n  margin-bottom: 1.25rem;\n}\n.legal-page[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 0.5rem;\n  font-size: 1rem;\n  font-weight: 600;\n}\n.legal-page[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.875rem;\n  color: #3c4043;\n}\n/*# sourceMappingURL=legal-document.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LegalDocumentComponent, [{
    type: Component,
    args: [{ selector: "app-legal-document", standalone: true, imports: [], template: '<article class="legal-page">\n  <header class="legal-page__header">\n    <button type="button" class="legal-page__back" (click)="goBack()">{{ i18n.legalUi().back }}</button>\n    <p class="legal-page__updated">{{ i18n.legalUi().lastUpdated }}</p>\n  </header>\n\n  @if (isCookies()) {\n  <h1>{{ i18n.legalCookiesUi().title }}</h1>\n  <p class="legal-page__intro">{{ i18n.legalCookiesUi().intro }}</p>\n\n  <section>\n    <h2>{{ i18n.legalCookiesUi().section1Title }}</h2>\n    <p>{{ i18n.legalCookiesUi().section1Body }}</p>\n  </section>\n  <section>\n    <h2>{{ i18n.legalCookiesUi().section2Title }}</h2>\n    <p>{{ i18n.legalCookiesUi().section2Body }}</p>\n  </section>\n  <section>\n    <h2>{{ i18n.legalCookiesUi().section3Title }}</h2>\n    <p>{{ i18n.legalCookiesUi().section3Body }}</p>\n  </section>\n  <section>\n    <h2>{{ i18n.legalCookiesUi().section4Title }}</h2>\n    <p>{{ i18n.legalCookiesUi().section4Body }}</p>\n  </section>\n  } @else {\n  <h1>{{ i18n.legalDataUi().title }}</h1>\n  <p class="legal-page__intro">{{ i18n.legalDataUi().intro }}</p>\n\n  <section>\n    <h2>{{ i18n.legalDataUi().section1Title }}</h2>\n    <p>{{ i18n.legalDataUi().section1Body }}</p>\n  </section>\n  <section>\n    <h2>{{ i18n.legalDataUi().section2Title }}</h2>\n    <p>{{ i18n.legalDataUi().section2Body }}</p>\n  </section>\n  <section>\n    <h2>{{ i18n.legalDataUi().section3Title }}</h2>\n    <p>{{ i18n.legalDataUi().section3Body }}</p>\n  </section>\n  <section>\n    <h2>{{ i18n.legalDataUi().section4Title }}</h2>\n    <p>{{ i18n.legalDataUi().section4Body }}</p>\n  </section>\n  <section>\n    <h2>{{ i18n.legalDataUi().section5Title }}</h2>\n    <p>{{ i18n.legalDataUi().section5Body }}</p>\n  </section>\n  }\n</article>\n', styles: ["/* src/app/features/legal/legal-document.component.scss */\n.legal-page {\n  max-width: 42rem;\n  margin: 0 auto;\n  padding: 1.5rem 1.25rem 3rem;\n  color: #202124;\n  line-height: 1.55;\n}\n.legal-page__header {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  margin-bottom: 1.5rem;\n}\n.legal-page__back {\n  border: 0;\n  padding: 0;\n  background: none;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #0f9d58;\n  cursor: pointer;\n  text-decoration: none;\n}\n.legal-page__back:hover {\n  text-decoration: underline;\n}\n.legal-page__updated {\n  margin: 0;\n  font-size: 0.75rem;\n  color: #5f6368;\n}\n.legal-page__intro {\n  margin: 0 0 1.5rem;\n  font-size: 0.9375rem;\n  color: #5f6368;\n}\n.legal-page h1 {\n  margin: 0 0 0.75rem;\n  font-size: 1.5rem;\n  font-weight: 500;\n}\n.legal-page section {\n  margin-bottom: 1.25rem;\n}\n.legal-page h2 {\n  margin: 0 0 0.5rem;\n  font-size: 1rem;\n  font-weight: 600;\n}\n.legal-page p {\n  margin: 0;\n  font-size: 0.875rem;\n  color: #3c4043;\n}\n/*# sourceMappingURL=legal-document.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LegalDocumentComponent, { className: "LegalDocumentComponent", filePath: "app/features/legal/legal-document.component.ts", lineNumber: 15 });
})();
export {
  LegalDocumentComponent
};
//# sourceMappingURL=chunk-C3OGCODF.js.map
