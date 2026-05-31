import {
  FinanceService,
  financeTodayRange
} from "./chunk-OWDSG4YD.js";
import {
  formatMoneyWithCode
} from "./chunk-KD4RMTVM.js";
import {
  AppDialogComponent
} from "./chunk-FZY3AIGP.js";
import "./chunk-JKSU2LPC.js";
import "./chunk-MFN2ATQX.js";
import "./chunk-Z5FPAOY7.js";
import {
  UserService
} from "./chunk-KBYR5346.js";
import "./chunk-LS4RMPGH.js";
import "./chunk-EWPFDTJG.js";
import {
  RouterLink
} from "./chunk-HPUTEZXI.js";
import {
  Component,
  I18nService,
  computed,
  forkJoin,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-27NINFBT.js";

// src/app/features/home/home.component.ts
var _c0 = () => [0, 1];
function HomeComponent_Conditional_9_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275element(1, "span", 12)(2, "span", 13);
    \u0275\u0275elementEnd();
  }
}
function HomeComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "span", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, HomeComponent_Conditional_9_For_4_Template, 3, 0, "div", 11, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.loading);
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(1, _c0));
  }
}
function HomeComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function HomeComponent_Conditional_11_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.t.lessonsEmpty);
  }
}
function HomeComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "a", 14)(2, "span", 15);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(3, "svg", 16);
    \u0275\u0275element(4, "rect", 17)(5, "line", 18)(6, "line", 19)(7, "line", 20);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(8, "span", 21);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 22);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, HomeComponent_Conditional_11_Conditional_12_Template, 2, 1, "span", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "a", 24)(14, "span", 15);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(15, "svg", 16);
    \u0275\u0275element(16, "line", 25)(17, "path", 26);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(18, "span", 21);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 22);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 23);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r0.todayLessonCount());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.todayLessons);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.todayLessonCount() === 0 ? 12 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.todayIncomeLabel());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.todayIncome);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.incomeApproxHint);
  }
}
var BETA_NOTICE_STORAGE_KEY = "simple4u_beta_notice_v1";
var HomeComponent = class _HomeComponent {
  userSvc = inject(UserService);
  financeSvc = inject(FinanceService);
  i18n = inject(I18nService);
  profile = signal(null, ...ngDevMode ? [{ debugName: "profile" }] : (
    /* istanbul ignore next */
    []
  ));
  summary = signal(null, ...ngDevMode ? [{ debugName: "summary" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : (
    /* istanbul ignore next */
    []
  ));
  betaOpen = signal(false, ...ngDevMode ? [{ debugName: "betaOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  displayName = computed(() => {
    const profile = this.profile();
    const first = profile?.first_name?.trim();
    if (first) {
      return first;
    }
    const full = profile?.name?.trim();
    if (full) {
      return full.split(/\s+/)[0] ?? full;
    }
    return "";
  }, ...ngDevMode ? [{ debugName: "displayName" }] : (
    /* istanbul ignore next */
    []
  ));
  greeting = computed(() => {
    const t = this.i18n.homeUi();
    const name = this.displayName();
    return name ? t.greetingNamed.replace("{name}", name) : t.greetingAnonymous;
  }, ...ngDevMode ? [{ debugName: "greeting" }] : (
    /* istanbul ignore next */
    []
  ));
  todayLessonCount = computed(() => this.summary()?.totals.lessonCount ?? 0, ...ngDevMode ? [{ debugName: "todayLessonCount" }] : (
    /* istanbul ignore next */
    []
  ));
  todayIncome = computed(() => {
    const income = this.summary()?.income;
    if (!income) {
      return 0;
    }
    return income.combinedIncome ?? income.totalIncome + income.scheduledIncome;
  }, ...ngDevMode ? [{ debugName: "todayIncome" }] : (
    /* istanbul ignore next */
    []
  ));
  todayIncomeLabel = computed(() => {
    const currency = this.summary()?.currency ?? "EUR";
    return formatMoneyWithCode(this.todayIncome(), currency, this.i18n.localeId(), 0);
  }, ...ngDevMode ? [{ debugName: "todayIncomeLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    this.openBetaNoticeIfNeeded();
    this.reload();
  }
  get t() {
    return this.i18n.homeUi();
  }
  dismissBetaNotice() {
    this.betaOpen.set(false);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(BETA_NOTICE_STORAGE_KEY, "1");
    }
  }
  openBetaNoticeIfNeeded() {
    if (typeof localStorage === "undefined") {
      this.betaOpen.set(true);
      return;
    }
    this.betaOpen.set(!localStorage.getItem(BETA_NOTICE_STORAGE_KEY));
  }
  reload() {
    this.loading.set(true);
    this.error.set(null);
    const today = financeTodayRange();
    forkJoin({
      profile: this.userSvc.ensureProfile(),
      summary: this.financeSvc.getSummary({ from: today.from, to: today.to })
    }).subscribe({
      next: ({ profile, summary }) => {
        this.profile.set(profile);
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.t.loadError);
        this.loading.set(false);
      }
    });
  }
  static \u0275fac = function HomeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], decls: 15, vars: 7, consts: [[1, "page", "app-scroll-page", "home-page"], [1, "home-page__header"], [1, "home-page__badge"], [1, "home-page__greeting"], [1, "home-page__subtitle"], [1, "scrollable-content"], ["role", "status", "aria-busy", "true", 1, "home-stats", "home-stats--loading"], [1, "home-page__error"], [1, "home-stats"], [3, "cancel", "open", "title", "dismissLabel"], [1, "sr-only"], [1, "home-stat", "home-stat--skeleton"], [1, "skeleton", "skeleton--line", "skeleton--line-sm", 2, "width", "55%"], [1, "skeleton", "skeleton--line", "skeleton--line-lg", 2, "width", "40%"], ["routerLink", "/app/calendar", 1, "home-stat", "home-stat--lessons"], ["aria-hidden", "true", 1, "home-stat__icon"], ["width", "28", "height", "28", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "1.75"], ["x", "3", "y", "4", "width", "18", "height", "18", "rx", "2"], ["x1", "16", "y1", "2", "x2", "16", "y2", "6"], ["x1", "8", "y1", "2", "x2", "8", "y2", "6"], ["x1", "3", "y1", "10", "x2", "21", "y2", "10"], [1, "home-stat__value"], [1, "home-stat__label"], [1, "home-stat__hint"], ["routerLink", "/app/finance", 1, "home-stat", "home-stat--income"], ["x1", "12", "y1", "1", "x2", "12", "y2", "23"], ["d", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]], template: function HomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "p", 2);
      \u0275\u0275text(3, "Beta");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h1", 3);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 4);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 5);
      \u0275\u0275conditionalCreate(9, HomeComponent_Conditional_9_Template, 5, 2, "div", 6)(10, HomeComponent_Conditional_10_Template, 2, 1, "p", 7)(11, HomeComponent_Conditional_11_Template, 24, 6, "div", 8);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "app-dialog", 9);
      \u0275\u0275listener("cancel", function HomeComponent_Template_app_dialog_cancel_12_listener() {
        return ctx.dismissBetaNotice();
      });
      \u0275\u0275elementStart(13, "p");
      \u0275\u0275text(14);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.greeting());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.t.todaySection);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 9 : ctx.error() ? 10 : 11);
      \u0275\u0275advance(3);
      \u0275\u0275property("open", ctx.betaOpen())("title", ctx.t.betaTitle)("dismissLabel", ctx.t.betaDismiss);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.t.betaBody);
    }
  }, dependencies: [RouterLink, AppDialogComponent], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  min-height: 0;\n  max-width: 720px;\n  overflow: hidden;\n  touch-action: none;\n}\n.home-page__header[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  margin-bottom: 1.5rem;\n}\n.home-page__badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin: 0 0 0.5rem;\n  padding: 0.2rem 0.55rem;\n  border-radius: 999px;\n  background: rgba(245, 158, 11, 0.15);\n  color: rgb(180, 83, 9);\n  font-size: 0.6875rem;\n  font-weight: 700;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n}\n.home-page__greeting[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(1.5rem, 4vw, 2rem);\n  font-weight: 700;\n  line-height: 1.2;\n  color: var(--text-primary);\n}\n.home-page__subtitle[_ngcontent-%COMP%] {\n  margin: 0.375rem 0 0;\n  font-size: 0.9375rem;\n  color: var(--text-secondary);\n}\n.home-page__error[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.875rem;\n  color: rgb(220, 38, 38);\n}\n.home-stats[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.75rem;\n}\n@media (max-width: 520px) {\n  .home-stats[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.home-stat[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n  min-height: 8.5rem;\n  padding: 1rem 1.125rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.875rem;\n  background: var(--nav-bg);\n  color: inherit;\n  text-decoration: none;\n  transition:\n    border-color 0.15s ease,\n    box-shadow 0.15s ease,\n    transform 0.15s ease;\n}\n.home-stat[_ngcontent-%COMP%]:hover {\n  border-color: var(--nav-accent);\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);\n  transform: translateY(-1px);\n}\n.home-stat--lessons[_ngcontent-%COMP%] {\n  border-color: rgba(14, 165, 233, 0.35);\n  background:\n    linear-gradient(\n      145deg,\n      rgba(14, 165, 233, 0.08),\n      var(--nav-bg) 55%);\n}\n.home-stat--income[_ngcontent-%COMP%] {\n  border-color: rgba(5, 150, 105, 0.35);\n  background:\n    linear-gradient(\n      145deg,\n      rgba(5, 150, 105, 0.08),\n      var(--nav-bg) 55%);\n}\n.home-stat--skeleton[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n.home-stat__icon[_ngcontent-%COMP%] {\n  display: flex;\n  width: 2.5rem;\n  height: 2.5rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 0.625rem;\n  background: rgba(255, 255, 255, 0.65);\n  color: var(--nav-accent);\n}\n.home-stat--income[_ngcontent-%COMP%]   .home-stat__icon[_ngcontent-%COMP%] {\n  color: rgb(5, 150, 105);\n}\n.home-stat__value[_ngcontent-%COMP%] {\n  font-size: clamp(1.75rem, 5vw, 2.25rem);\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  line-height: 1.1;\n  color: var(--text-primary);\n}\n.home-stat__label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.home-stat__hint[_ngcontent-%COMP%] {\n  margin-top: auto;\n  font-size: 0.75rem;\n  line-height: 1.35;\n  color: var(--text-secondary);\n}\n/*# sourceMappingURL=home.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HomeComponent, [{
    type: Component,
    args: [{ selector: "app-home", standalone: true, imports: [RouterLink, AppDialogComponent], template: '<div class="page app-scroll-page home-page">\n  <header class="home-page__header">\n    <p class="home-page__badge">Beta</p>\n    <h1 class="home-page__greeting">{{ greeting() }}</h1>\n    <p class="home-page__subtitle">{{ t.todaySection }}</p>\n  </header>\n\n  <div class="scrollable-content">\n  @if (loading()) {\n    <div class="home-stats home-stats--loading" role="status" aria-busy="true">\n      <span class="sr-only">{{ t.loading }}</span>\n      @for (slot of [0, 1]; track slot) {\n        <div class="home-stat home-stat--skeleton">\n          <span class="skeleton skeleton--line skeleton--line-sm" style="width: 55%"></span>\n          <span class="skeleton skeleton--line skeleton--line-lg" style="width: 40%"></span>\n        </div>\n      }\n    </div>\n  } @else if (error()) {\n    <p class="home-page__error">{{ error() }}</p>\n  } @else {\n    <div class="home-stats">\n      <a routerLink="/app/calendar" class="home-stat home-stat--lessons">\n        <span class="home-stat__icon" aria-hidden="true">\n          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">\n            <rect x="3" y="4" width="18" height="18" rx="2" />\n            <line x1="16" y1="2" x2="16" y2="6" />\n            <line x1="8" y1="2" x2="8" y2="6" />\n            <line x1="3" y1="10" x2="21" y2="10" />\n          </svg>\n        </span>\n        <span class="home-stat__value">{{ todayLessonCount() }}</span>\n        <span class="home-stat__label">{{ t.todayLessons }}</span>\n        @if (todayLessonCount() === 0) {\n          <span class="home-stat__hint">{{ t.lessonsEmpty }}</span>\n        }\n      </a>\n\n      <a routerLink="/app/finance" class="home-stat home-stat--income">\n        <span class="home-stat__icon" aria-hidden="true">\n          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">\n            <line x1="12" y1="1" x2="12" y2="23" />\n            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />\n          </svg>\n        </span>\n        <span class="home-stat__value">{{ todayIncomeLabel() }}</span>\n        <span class="home-stat__label">{{ t.todayIncome }}</span>\n        <span class="home-stat__hint">{{ t.incomeApproxHint }}</span>\n      </a>\n    </div>\n  }\n  </div>\n</div>\n\n<app-dialog\n  [open]="betaOpen()"\n  [title]="t.betaTitle"\n  [dismissLabel]="t.betaDismiss"\n  (cancel)="dismissBetaNotice()"\n>\n  <p>{{ t.betaBody }}</p>\n</app-dialog>\n', styles: ["/* src/app/features/home/home.component.scss */\n:host {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  min-height: 0;\n  max-width: 720px;\n  overflow: hidden;\n  touch-action: none;\n}\n.home-page__header {\n  flex-shrink: 0;\n  margin-bottom: 1.5rem;\n}\n.home-page__badge {\n  display: inline-block;\n  margin: 0 0 0.5rem;\n  padding: 0.2rem 0.55rem;\n  border-radius: 999px;\n  background: rgba(245, 158, 11, 0.15);\n  color: rgb(180, 83, 9);\n  font-size: 0.6875rem;\n  font-weight: 700;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n}\n.home-page__greeting {\n  margin: 0;\n  font-size: clamp(1.5rem, 4vw, 2rem);\n  font-weight: 700;\n  line-height: 1.2;\n  color: var(--text-primary);\n}\n.home-page__subtitle {\n  margin: 0.375rem 0 0;\n  font-size: 0.9375rem;\n  color: var(--text-secondary);\n}\n.home-page__error {\n  margin: 0;\n  font-size: 0.875rem;\n  color: rgb(220, 38, 38);\n}\n.home-stats {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.75rem;\n}\n@media (max-width: 520px) {\n  .home-stats {\n    grid-template-columns: 1fr;\n  }\n}\n.home-stat {\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n  min-height: 8.5rem;\n  padding: 1rem 1.125rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.875rem;\n  background: var(--nav-bg);\n  color: inherit;\n  text-decoration: none;\n  transition:\n    border-color 0.15s ease,\n    box-shadow 0.15s ease,\n    transform 0.15s ease;\n}\n.home-stat:hover {\n  border-color: var(--nav-accent);\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);\n  transform: translateY(-1px);\n}\n.home-stat--lessons {\n  border-color: rgba(14, 165, 233, 0.35);\n  background:\n    linear-gradient(\n      145deg,\n      rgba(14, 165, 233, 0.08),\n      var(--nav-bg) 55%);\n}\n.home-stat--income {\n  border-color: rgba(5, 150, 105, 0.35);\n  background:\n    linear-gradient(\n      145deg,\n      rgba(5, 150, 105, 0.08),\n      var(--nav-bg) 55%);\n}\n.home-stat--skeleton {\n  pointer-events: none;\n}\n.home-stat__icon {\n  display: flex;\n  width: 2.5rem;\n  height: 2.5rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 0.625rem;\n  background: rgba(255, 255, 255, 0.65);\n  color: var(--nav-accent);\n}\n.home-stat--income .home-stat__icon {\n  color: rgb(5, 150, 105);\n}\n.home-stat__value {\n  font-size: clamp(1.75rem, 5vw, 2.25rem);\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  line-height: 1.1;\n  color: var(--text-primary);\n}\n.home-stat__label {\n  font-size: 0.875rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.home-stat__hint {\n  margin-top: auto;\n  font-size: 0.75rem;\n  line-height: 1.35;\n  color: var(--text-secondary);\n}\n/*# sourceMappingURL=home.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "app/features/home/home.component.ts", lineNumber: 21 });
})();
export {
  HomeComponent
};
//# sourceMappingURL=chunk-3ELTCGEZ.js.map
