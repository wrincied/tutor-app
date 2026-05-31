import {
  canPurchaseSubscription,
  isTaxModeConfigured,
  subscriptionStatusLabel
} from "./chunk-6SYJUHTI.js";
import {
  formatMoneyWithCode
} from "./chunk-KD4RMTVM.js";
import {
  UserService
} from "./chunk-KBYR5346.js";
import "./chunk-LS4RMPGH.js";
import {
  apiUrl
} from "./chunk-EWPFDTJG.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-HPUTEZXI.js";
import {
  Component,
  HttpClient,
  I18nService,
  Injectable,
  computed,
  inject,
  setClassMetadata,
  signal,
  switchMap,
  take,
  timer,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-27NINFBT.js";

// src/app/core/services/billing.service.ts
var API = apiUrl("");
var BillingService = class _BillingService {
  http = inject(HttpClient);
  createCheckoutSession(interval = "monthly") {
    return this.http.post(`${API}/billing/checkout-session`, { interval });
  }
  /** Ручное подтверждение оплаты (прод: admin secret в .env бэкенда). */
  confirmPayment(plan, adminSecret) {
    return this.http.post(`${API}/billing/confirm-payment`, {
      plan,
      adminSecret
    });
  }
  static \u0275fac = function BillingService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BillingService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _BillingService, factory: _BillingService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BillingService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/utils/subscription-pricing.ts
var PRICING_BY_COUNTRY = {
  // Еврозона (Австрия, Германия) — базовый платежеспособный рынок.
  // Оставляем стандартную психологическую цену для подписок начального уровня.
  AT: { country: "AT", currency: "EUR", monthly: 9.99, yearly: 99.99 },
  DE: { country: "DE", currency: "EUR", monthly: 9.99, yearly: 99.99 },
  // Польша — должна быть эквивалентна или чуть дешевле еврозоны.
  // 39 PLN — это около €9. Отличный порог входа для польского рынка.
  PL: { country: "PL", currency: "PLN", monthly: 39, yearly: 390 },
  // США — цена приведена к европейскому стандарту.
  // $11.99 — психологически комфортная цена для подписки в США.
  US: { country: "US", currency: "USD", monthly: 11.99, yearly: 119.99 },
  // Казахстан — 8900 KZT было слишком дорого.
  // 3900 KZT (около €8) — адекватная стоимость, сопоставимая с подпиской на местный софт.
  KZ: { country: "KZ", currency: "KZT", monthly: 3900, yearly: 39e3 },
  // Беларусь — 39 BYN за B2B утилиту для физлиц многовато.
  // 19.99 BYN (около €5.5) — идеальный баланс, чтобы платили массово.
  BY: { country: "BY", currency: "BYN", monthly: 19.99, yearly: 199.99 },
  // Россия — 1490 RUB за узкую CRM блокирует конверсию.
  // 590 RUB (около €6) — стандартная цена для локальных сервисов учета/записи.
  RU: { country: "RU", currency: "RUB", monthly: 590, yearly: 5900 }
};
var DEFAULT_PRICING = PRICING_BY_COUNTRY["AT"];
function getSubscriptionPricing(country) {
  const code = String(country ?? "AT").trim().toUpperCase();
  return PRICING_BY_COUNTRY[code] ?? DEFAULT_PRICING;
}
function formatSubscriptionPrice(amount, currency, locale) {
  const fractionDigits = Number.isFinite(amount) && !Number.isInteger(amount) ? 2 : 0;
  return formatMoneyWithCode(amount, currency, locale, fractionDigits);
}

// src/app/features/pricing/pricing.component.ts
var _forTrack0 = ($index, $item) => $item.q;
function PricingComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "p", 6);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.sharedUi().loadingContent);
  }
}
function PricingComponent_Conditional_8_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function PricingComponent_Conditional_8_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const feature_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(feature_r3);
  }
}
function PricingComponent_Conditional_8_For_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const feature_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(feature_r4);
  }
}
function PricingComponent_Conditional_8_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.t.alreadyPro);
  }
}
function PricingComponent_Conditional_8_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.t.alreadyTrial);
  }
}
function PricingComponent_Conditional_8_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "a", 29);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.t.taxRequired);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.accountLink);
  }
}
function PricingComponent_Conditional_8_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function PricingComponent_Conditional_8_Conditional_43_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.startProCheckout());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 31);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r0.checkoutLoading());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.checkoutLoading() ? ctx_r0.t.proPlan.ctaLoading : ctx_r0.t.proPlan.cta, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.stripeNote);
  }
}
function PricingComponent_Conditional_8_For_49_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r8.a);
  }
}
function PricingComponent_Conditional_8_For_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32)(1, "button", 33);
    \u0275\u0275listener("click", function PricingComponent_Conditional_8_For_49_Template_button_click_1_listener() {
      const \u0275$index_118_r7 = \u0275\u0275restoreView(_r6).$index;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleFaq(\u0275$index_118_r7));
    });
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "span", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingComponent_Conditional_8_For_49_Conditional_5_Template, 3, 1, "div", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    const \u0275$index_118_r7 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("pricing-faq__item--open", ctx_r0.isFaqOpen(\u0275$index_118_r7));
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-expanded", ctx_r0.isFaqOpen(\u0275$index_118_r7));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r8.q);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.isFaqOpen(\u0275$index_118_r7) ? 5 : -1);
  }
}
function PricingComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "button", 8);
    \u0275\u0275listener("click", function PricingComponent_Conditional_8_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.setBillingInterval("monthly"));
    });
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 8);
    \u0275\u0275listener("click", function PricingComponent_Conditional_8_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.setBillingInterval("yearly"));
    });
    \u0275\u0275text(4);
    \u0275\u0275elementStart(5, "span", 9);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 5);
    \u0275\u0275conditionalCreate(8, PricingComponent_Conditional_8_Conditional_8_Template, 2, 1, "p", 10);
    \u0275\u0275elementStart(9, "div", 11)(10, "article", 12)(11, "h2", 13);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p", 14)(14, "span", 15);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 16);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "ul", 17);
    \u0275\u0275repeaterCreate(19, PricingComponent_Conditional_8_For_20_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 18);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "article", 19)(24, "span", 20);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "p", 21);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "h2", 13);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "p", 14)(31, "span", 15);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 16);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "p", 22);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "ul", 17);
    \u0275\u0275repeaterCreate(38, PricingComponent_Conditional_8_For_39_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(40, PricingComponent_Conditional_8_Conditional_40_Template, 2, 1, "button", 23)(41, PricingComponent_Conditional_8_Conditional_41_Template, 2, 1, "button", 23)(42, PricingComponent_Conditional_8_Conditional_42_Template, 4, 2)(43, PricingComponent_Conditional_8_Conditional_43_Template, 4, 3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "section", 24)(45, "h2", 25);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "div", 26);
    \u0275\u0275repeaterCreate(48, PricingComponent_Conditional_8_For_49_Template, 6, 5, "div", 27, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r0.t.toggleMonthly);
    \u0275\u0275advance();
    \u0275\u0275classProp("pricing-toggle__btn--active", ctx_r0.billingInterval() === "monthly");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.t.toggleMonthly, " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("pricing-toggle__btn--active", ctx_r0.billingInterval() === "yearly");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.t.toggleYearly, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.saveBadge);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.error() ? 8 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.t.freePlan.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.freePriceLabel());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.freePlan.period);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.t.freePlan.features);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.isPro() || ctx_r0.isTrial() ? ctx_r0.t.freePlan.cta : ctx_r0.subscriptionLabel(), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.recommendedBadge);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.proPlan.trialBadge);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.proPlan.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.proPriceLabel());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.proPeriodLabel());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.proPlan.microcopy);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.t.proPlan.features);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.isPro() ? 40 : ctx_r0.isTrial() ? 41 : !ctx_r0.taxModeConfigured() ? 42 : 43);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.t.faq.title);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.t.faq.items);
  }
}
var PricingComponent = class _PricingComponent {
  userSvc = inject(UserService);
  billingSvc = inject(BillingService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  billingPollSub = null;
  i18n = inject(I18nService);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  checkoutLoading = signal(false, ...ngDevMode ? [{ debugName: "checkoutLoading" }] : (
    /* istanbul ignore next */
    []
  ));
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : (
    /* istanbul ignore next */
    []
  ));
  profile = signal(null, ...ngDevMode ? [{ debugName: "profile" }] : (
    /* istanbul ignore next */
    []
  ));
  billingInterval = signal("monthly", ...ngDevMode ? [{ debugName: "billingInterval" }] : (
    /* istanbul ignore next */
    []
  ));
  openFaqIndex = signal(null, ...ngDevMode ? [{ debugName: "openFaqIndex" }] : (
    /* istanbul ignore next */
    []
  ));
  taxModeConfigured = computed(() => {
    const profile = this.profile();
    return profile?.tax_mode_configured ?? isTaxModeConfigured(profile?.tax_mode);
  }, ...ngDevMode ? [{ debugName: "taxModeConfigured" }] : (
    /* istanbul ignore next */
    []
  ));
  canBuy = computed(() => canPurchaseSubscription(this.profile()), ...ngDevMode ? [{ debugName: "canBuy" }] : (
    /* istanbul ignore next */
    []
  ));
  subscriptionStatus = computed(() => this.profile()?.subscription_status || "free", ...ngDevMode ? [{ debugName: "subscriptionStatus" }] : (
    /* istanbul ignore next */
    []
  ));
  isPro = computed(() => this.subscriptionStatus() === "pro", ...ngDevMode ? [{ debugName: "isPro" }] : (
    /* istanbul ignore next */
    []
  ));
  isTrial = computed(() => this.subscriptionStatus() === "trial", ...ngDevMode ? [{ debugName: "isTrial" }] : (
    /* istanbul ignore next */
    []
  ));
  pricing = computed(() => {
    const fromApi = this.profile()?.subscription_pricing;
    if (fromApi) {
      return fromApi;
    }
    return getSubscriptionPricing(this.profile()?.country_settings ?? "AT");
  }, ...ngDevMode ? [{ debugName: "pricing" }] : (
    /* istanbul ignore next */
    []
  ));
  proPriceLabel = computed(() => {
    const p = this.pricing();
    const amount = this.billingInterval() === "yearly" ? p.yearly : p.monthly;
    return formatSubscriptionPrice(amount, p.currency, this.i18n.localeId());
  }, ...ngDevMode ? [{ debugName: "proPriceLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  proPeriodLabel = computed(() => {
    const t = this.i18n.pricingUi().proPlan;
    return this.billingInterval() === "yearly" ? t.periodYearly : t.periodMonthly;
  }, ...ngDevMode ? [{ debugName: "proPeriodLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  freePriceLabel = computed(() => {
    const p = this.pricing();
    return formatSubscriptionPrice(0, p.currency, this.i18n.localeId());
  }, ...ngDevMode ? [{ debugName: "freePriceLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  subscriptionLabel = computed(() => {
    const t = this.i18n.accountUi();
    return subscriptionStatusLabel(this.subscriptionStatus(), {
      free: t.subscriptionFree,
      pro: t.subscriptionPro,
      trial: t.subscriptionTrial
    });
  }, ...ngDevMode ? [{ debugName: "subscriptionLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    this.userSvc.getProfile().subscribe({
      next: (user) => {
        this.profile.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.i18n.accountUi().loadError);
        this.loading.set(false);
      }
    });
    const billingResult = this.route.snapshot.queryParamMap.get("billing");
    if (billingResult === "success") {
      this.startBillingSuccessPoll();
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { billing: null },
        queryParamsHandling: "merge",
        replaceUrl: true
      });
    }
  }
  ngOnDestroy() {
    this.billingPollSub?.unsubscribe();
  }
  get t() {
    return this.i18n.pricingUi();
  }
  setBillingInterval(interval) {
    this.billingInterval.set(interval);
  }
  toggleFaq(index) {
    this.openFaqIndex.update((current) => current === index ? null : index);
  }
  isFaqOpen(index) {
    return this.openFaqIndex() === index;
  }
  startProCheckout() {
    if (!this.canBuy() || this.isPro() || this.isTrial()) {
      return;
    }
    this.checkoutLoading.set(true);
    this.error.set(null);
    this.billingSvc.createCheckoutSession(this.billingInterval()).subscribe({
      next: ({ url }) => {
        this.checkoutLoading.set(false);
        if (url) {
          window.location.href = url;
        }
      },
      error: (err) => {
        this.checkoutLoading.set(false);
        this.error.set(err?.error?.message ?? this.i18n.accountUi().saveError);
      }
    });
  }
  startBillingSuccessPoll() {
    this.billingPollSub?.unsubscribe();
    this.billingPollSub = timer(0, 2e3).pipe(take(15), switchMap(() => this.userSvc.getProfile())).subscribe({
      next: (user) => {
        this.profile.set(user);
        const status = String(user.subscription_status || "free");
        if (status === "pro" || status === "trial") {
          this.billingPollSub?.unsubscribe();
          this.billingPollSub = null;
        }
      }
    });
  }
  static \u0275fac = function PricingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PricingComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PricingComponent, selectors: [["app-pricing"]], decls: 9, vars: 3, consts: [[1, "page", "app-scroll-page", "pricing-page"], [1, "page-header", "pricing-page__header"], [1, "pricing-hero"], [1, "pricing-hero__title"], [1, "pricing-hero__subtitle"], [1, "scrollable-content"], ["role", "status", 1, "pricing-page__status"], ["role", "group", 1, "pricing-toggle"], ["type", "button", 1, "pricing-toggle__btn", 3, "click"], [1, "pricing-toggle__badge"], ["role", "alert", 1, "pricing-page__error"], [1, "pricing-grid"], [1, "pricing-card", "pricing-card--free"], [1, "pricing-card__name"], [1, "pricing-card__price"], [1, "pricing-card__amount"], [1, "pricing-card__period"], [1, "pricing-card__features"], ["type", "button", "disabled", "", 1, "pricing-card__cta", "pricing-card__cta--ghost"], [1, "pricing-card", "pricing-card--pro"], [1, "pricing-card__ribbon"], [1, "pricing-card__trial"], [1, "pricing-card__microcopy"], ["type", "button", "disabled", "", 1, "pricing-card__cta"], ["aria-labelledby", "pricing-faq-title", 1, "pricing-faq"], ["id", "pricing-faq-title", 1, "pricing-faq__title"], [1, "pricing-faq__list"], [1, "pricing-faq__item", 3, "pricing-faq__item--open"], [1, "pricing-card__hint"], ["routerLink", "/app/account", 1, "pricing-card__cta", "pricing-card__cta--link"], ["type", "button", 1, "pricing-card__cta", "pricing-card__cta--primary", 3, "click", "disabled"], [1, "pricing-card__stripe"], [1, "pricing-faq__item"], ["type", "button", 1, "pricing-faq__question", 3, "click"], ["aria-hidden", "true", 1, "pricing-faq__chevron"], [1, "pricing-faq__answer"]], template: function PricingComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "div", 2)(3, "h1", 3);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 4);
      \u0275\u0275text(6);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(7, PricingComponent_Conditional_7_Template, 3, 1, "div", 5)(8, PricingComponent_Conditional_8_Template, 50, 21);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.t.title);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.t.subtitle);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 7 : 8);
    }
  }, dependencies: [RouterLink], styles: ['\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 0;\n  min-height: 0;\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n.pricing-page__status[_ngcontent-%COMP%], \n.pricing-page__error[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--text-secondary);\n}\n.pricing-page__error[_ngcontent-%COMP%] {\n  color: rgb(220, 38, 38);\n  margin-bottom: 1rem;\n}\n.pricing-hero[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 100%;\n  max-width: 56rem;\n  margin-inline: auto;\n  margin-bottom: 1.75rem;\n  text-align: center;\n}\n.pricing-hero__title[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  font-size: clamp(1rem, 3vw, 2rem);\n  font-weight: 700;\n  line-height: 1.2;\n  color: var(--text-primary);\n}\n.pricing-hero__subtitle[_ngcontent-%COMP%] {\n  margin: 0 auto;\n  max-width: 40rem;\n  font-size: 0.9375rem;\n  line-height: 1.55;\n  color: var(--text-secondary);\n}\n.pricing-toggle[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-shrink: 0;\n  align-self: center;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 0.375rem;\n  width: 100%;\n  margin: 0 0 1rem;\n  padding: 0.25rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 999px;\n  background: var(--nav-bg);\n}\n.pricing-toggle__btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  border: none;\n  border-radius: 999px;\n  background: transparent;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.pricing-toggle__btn--active[_ngcontent-%COMP%] {\n  background: var(--nav-active-bg);\n  color: var(--nav-accent);\n  font-weight: 600;\n}\n.pricing-toggle__badge[_ngcontent-%COMP%] {\n  padding: 0.125rem 0.5rem;\n  border-radius: 999px;\n  background: rgba(5, 150, 105, 0.15);\n  color: rgb(5, 150, 105);\n  font-size: 0.6875rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n}\n.pricing-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 1rem;\n  margin-bottom: 2.5rem;\n}\n@media (min-width: 768px) {\n  .pricing-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 1.15fr;\n    align-items: stretch;\n  }\n}\n.pricing-card[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  padding: 1.25rem 1.25rem 1.5rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 1rem;\n  background: var(--nav-bg);\n}\n.pricing-card--pro[_ngcontent-%COMP%] {\n  border-color: rgba(14, 165, 233, 0.45);\n  background:\n    linear-gradient(\n      165deg,\n      rgba(14, 165, 233, 0.1) 0%,\n      var(--nav-bg) 45%);\n  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.08);\n}\n.pricing-card__ribbon[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.875rem;\n  right: 0.875rem;\n  padding: 0.2rem 0.55rem;\n  border-radius: 999px;\n  background: var(--nav-accent);\n  color: #fff;\n  font-size: 0.6875rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.pricing-card__trial[_ngcontent-%COMP%] {\n  margin: 0;\n  padding-right: 5rem;\n  font-size: 0.8125rem;\n  font-weight: 700;\n  color: rgb(5, 150, 105);\n}\n.pricing-card__name[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.125rem;\n  font-weight: 700;\n  color: var(--text-primary);\n}\n.pricing-card__price[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.375rem 0.5rem;\n  margin: 0;\n}\n.pricing-card__amount[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 800;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-primary);\n  line-height: 1.1;\n}\n.pricing-card__period[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--text-secondary);\n}\n.pricing-card__microcopy[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.8125rem;\n  line-height: 1.45;\n  color: var(--text-secondary);\n}\n.pricing-card__features[_ngcontent-%COMP%] {\n  margin: 0.25rem 0 0.5rem;\n  padding: 0;\n  list-style: none;\n  flex: 1 1 auto;\n}\n.pricing-card__features[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  position: relative;\n  padding: 0.35rem 0 0.35rem 1.25rem;\n  font-size: 0.875rem;\n  line-height: 1.45;\n  color: var(--text-primary);\n}\n.pricing-card__features[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  top: 0.72rem;\n  width: 0.45rem;\n  height: 0.45rem;\n  border-radius: 50%;\n  background: var(--nav-accent);\n}\n.pricing-card__cta[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: auto;\n  padding: 0.7rem 1rem;\n  border-radius: 0.625rem;\n  border: 1px solid var(--nav-border);\n  background: transparent;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n  cursor: default;\n}\n.pricing-card__cta--ghost[_ngcontent-%COMP%] {\n  opacity: 0.85;\n}\n.pricing-card__cta--primary[_ngcontent-%COMP%] {\n  border-color: var(--nav-accent);\n  background: var(--nav-accent);\n  color: #fff;\n  cursor: pointer;\n}\n.pricing-card__cta--primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  filter: brightness(1.05);\n}\n.pricing-card__cta--primary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.7;\n  cursor: wait;\n}\n.pricing-card__cta--link[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  text-decoration: none;\n  border-color: var(--nav-accent);\n  color: var(--nav-accent);\n  cursor: pointer;\n}\n.pricing-card__hint[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.8125rem;\n  color: rgb(180, 83, 9);\n}\n.pricing-card__stripe[_ngcontent-%COMP%] {\n  margin: 0;\n  text-align: center;\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n}\n.pricing-faq__title[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  font-size: 1.125rem;\n  font-weight: 700;\n  color: var(--text-primary);\n}\n.pricing-faq__list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.pricing-faq__item[_ngcontent-%COMP%] {\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n  overflow: hidden;\n}\n.pricing-faq__question[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  width: 100%;\n  padding: 0.875rem 1rem;\n  border: none;\n  background: transparent;\n  text-align: left;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  color: var(--text-primary);\n  cursor: pointer;\n}\n.pricing-faq__chevron[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: 0.5rem;\n  height: 0.5rem;\n  border-right: 2px solid var(--text-secondary);\n  border-bottom: 2px solid var(--text-secondary);\n  transform: rotate(45deg);\n  transition: transform 0.15s ease;\n}\n.pricing-faq__item--open[_ngcontent-%COMP%]   .pricing-faq__chevron[_ngcontent-%COMP%] {\n  transform: rotate(-135deg);\n  margin-top: 0.25rem;\n}\n.pricing-faq__answer[_ngcontent-%COMP%] {\n  padding: 0 1rem 1rem;\n}\n.pricing-faq__answer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.875rem;\n  line-height: 1.55;\n  color: var(--text-secondary);\n}\n/*# sourceMappingURL=pricing.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PricingComponent, [{
    type: Component,
    args: [{ selector: "app-pricing", standalone: true, imports: [RouterLink], template: `<div class="page app-scroll-page pricing-page">
  <header class="page-header pricing-page__header">
    <div class="pricing-hero">
      <h1 class="pricing-hero__title">{{ t.title }}</h1>
      <p class="pricing-hero__subtitle">{{ t.subtitle }}</p>
    </div>
  </header>

  @if (loading()) {
    <div class="scrollable-content">
      <p class="pricing-page__status" role="status">{{ i18n.sharedUi().loadingContent }}</p>
    </div>
  } @else {
    <div class="pricing-toggle" role="group" [attr.aria-label]="t.toggleMonthly">
      <button
        type="button"
        class="pricing-toggle__btn"
        [class.pricing-toggle__btn--active]="billingInterval() === 'monthly'"
        (click)="setBillingInterval('monthly')"
      >
        {{ t.toggleMonthly }}
      </button>
      <button
        type="button"
        class="pricing-toggle__btn"
        [class.pricing-toggle__btn--active]="billingInterval() === 'yearly'"
        (click)="setBillingInterval('yearly')"
      >
        {{ t.toggleYearly }}
        <span class="pricing-toggle__badge">{{ t.saveBadge }}</span>
      </button>
    </div>

    <div class="scrollable-content">
    @if (error()) {
      <p class="pricing-page__error" role="alert">{{ error() }}</p>
    }

    <div class="pricing-grid">
      <article class="pricing-card pricing-card--free">
        <h2 class="pricing-card__name">{{ t.freePlan.name }}</h2>
        <p class="pricing-card__price">
          <span class="pricing-card__amount">{{ freePriceLabel() }}</span>
          <span class="pricing-card__period">{{ t.freePlan.period }}</span>
        </p>
        <ul class="pricing-card__features">
          @for (feature of t.freePlan.features; track feature) {
            <li>{{ feature }}</li>
          }
        </ul>
        <button type="button" class="pricing-card__cta pricing-card__cta--ghost" disabled>
          {{ isPro() || isTrial() ? t.freePlan.cta : subscriptionLabel() }}
        </button>
      </article>

      <article class="pricing-card pricing-card--pro">
        <span class="pricing-card__ribbon">{{ t.recommendedBadge }}</span>
        <p class="pricing-card__trial">{{ t.proPlan.trialBadge }}</p>
        <h2 class="pricing-card__name">{{ t.proPlan.name }}</h2>
        <p class="pricing-card__price">
          <span class="pricing-card__amount">{{ proPriceLabel() }}</span>
          <span class="pricing-card__period">{{ proPeriodLabel() }}</span>
        </p>
        <p class="pricing-card__microcopy">{{ t.proPlan.microcopy }}</p>
        <ul class="pricing-card__features">
          @for (feature of t.proPlan.features; track feature) {
            <li>{{ feature }}</li>
          }
        </ul>

        @if (isPro()) {
          <button type="button" class="pricing-card__cta" disabled>{{ t.alreadyPro }}</button>
        } @else if (isTrial()) {
          <button type="button" class="pricing-card__cta" disabled>{{ t.alreadyTrial }}</button>
        } @else if (!taxModeConfigured()) {
          <p class="pricing-card__hint">{{ t.taxRequired }}</p>
          <a routerLink="/app/account" class="pricing-card__cta pricing-card__cta--link">{{
            t.accountLink
          }}</a>
        } @else {
          <button
            type="button"
            class="pricing-card__cta pricing-card__cta--primary"
            [disabled]="checkoutLoading()"
            (click)="startProCheckout()"
          >
            {{ checkoutLoading() ? t.proPlan.ctaLoading : t.proPlan.cta }}
          </button>
          <p class="pricing-card__stripe">{{ t.stripeNote }}</p>
        }
      </article>
    </div>

    <section class="pricing-faq" aria-labelledby="pricing-faq-title">
      <h2 id="pricing-faq-title" class="pricing-faq__title">{{ t.faq.title }}</h2>
      <div class="pricing-faq__list">
        @for (item of t.faq.items; track item.q; let i = $index) {
          <div class="pricing-faq__item" [class.pricing-faq__item--open]="isFaqOpen(i)">
            <button
              type="button"
              class="pricing-faq__question"
              [attr.aria-expanded]="isFaqOpen(i)"
              (click)="toggleFaq(i)"
            >
              <span>{{ item.q }}</span>
              <span class="pricing-faq__chevron" aria-hidden="true"></span>
            </button>
            @if (isFaqOpen(i)) {
              <div class="pricing-faq__answer">
                <p>{{ item.a }}</p>
              </div>
            }
          </div>
        }
      </div>
    </section>
    </div>
  }
</div>
`, styles: ['/* src/app/features/pricing/pricing.component.scss */\n:host {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 0;\n  min-height: 0;\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n.pricing-page__status,\n.pricing-page__error {\n  font-size: 0.875rem;\n  color: var(--text-secondary);\n}\n.pricing-page__error {\n  color: rgb(220, 38, 38);\n  margin-bottom: 1rem;\n}\n.pricing-hero {\n  flex-shrink: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 100%;\n  max-width: 56rem;\n  margin-inline: auto;\n  margin-bottom: 1.75rem;\n  text-align: center;\n}\n.pricing-hero__title {\n  margin: 0 0 0.75rem;\n  font-size: clamp(1rem, 3vw, 2rem);\n  font-weight: 700;\n  line-height: 1.2;\n  color: var(--text-primary);\n}\n.pricing-hero__subtitle {\n  margin: 0 auto;\n  max-width: 40rem;\n  font-size: 0.9375rem;\n  line-height: 1.55;\n  color: var(--text-secondary);\n}\n.pricing-toggle {\n  display: inline-flex;\n  flex-shrink: 0;\n  align-self: center;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 0.375rem;\n  width: 100%;\n  margin: 0 0 1rem;\n  padding: 0.25rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 999px;\n  background: var(--nav-bg);\n}\n.pricing-toggle__btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  border: none;\n  border-radius: 999px;\n  background: transparent;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.pricing-toggle__btn--active {\n  background: var(--nav-active-bg);\n  color: var(--nav-accent);\n  font-weight: 600;\n}\n.pricing-toggle__badge {\n  padding: 0.125rem 0.5rem;\n  border-radius: 999px;\n  background: rgba(5, 150, 105, 0.15);\n  color: rgb(5, 150, 105);\n  font-size: 0.6875rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n}\n.pricing-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 1rem;\n  margin-bottom: 2.5rem;\n}\n@media (min-width: 768px) {\n  .pricing-grid {\n    grid-template-columns: 1fr 1.15fr;\n    align-items: stretch;\n  }\n}\n.pricing-card {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  padding: 1.25rem 1.25rem 1.5rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 1rem;\n  background: var(--nav-bg);\n}\n.pricing-card--pro {\n  border-color: rgba(14, 165, 233, 0.45);\n  background:\n    linear-gradient(\n      165deg,\n      rgba(14, 165, 233, 0.1) 0%,\n      var(--nav-bg) 45%);\n  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.08);\n}\n.pricing-card__ribbon {\n  position: absolute;\n  top: 0.875rem;\n  right: 0.875rem;\n  padding: 0.2rem 0.55rem;\n  border-radius: 999px;\n  background: var(--nav-accent);\n  color: #fff;\n  font-size: 0.6875rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.pricing-card__trial {\n  margin: 0;\n  padding-right: 5rem;\n  font-size: 0.8125rem;\n  font-weight: 700;\n  color: rgb(5, 150, 105);\n}\n.pricing-card__name {\n  margin: 0;\n  font-size: 1.125rem;\n  font-weight: 700;\n  color: var(--text-primary);\n}\n.pricing-card__price {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.375rem 0.5rem;\n  margin: 0;\n}\n.pricing-card__amount {\n  font-size: 2rem;\n  font-weight: 800;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-primary);\n  line-height: 1.1;\n}\n.pricing-card__period {\n  font-size: 0.875rem;\n  color: var(--text-secondary);\n}\n.pricing-card__microcopy {\n  margin: 0;\n  font-size: 0.8125rem;\n  line-height: 1.45;\n  color: var(--text-secondary);\n}\n.pricing-card__features {\n  margin: 0.25rem 0 0.5rem;\n  padding: 0;\n  list-style: none;\n  flex: 1 1 auto;\n}\n.pricing-card__features li {\n  position: relative;\n  padding: 0.35rem 0 0.35rem 1.25rem;\n  font-size: 0.875rem;\n  line-height: 1.45;\n  color: var(--text-primary);\n}\n.pricing-card__features li::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  top: 0.72rem;\n  width: 0.45rem;\n  height: 0.45rem;\n  border-radius: 50%;\n  background: var(--nav-accent);\n}\n.pricing-card__cta {\n  width: 100%;\n  margin-top: auto;\n  padding: 0.7rem 1rem;\n  border-radius: 0.625rem;\n  border: 1px solid var(--nav-border);\n  background: transparent;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n  cursor: default;\n}\n.pricing-card__cta--ghost {\n  opacity: 0.85;\n}\n.pricing-card__cta--primary {\n  border-color: var(--nav-accent);\n  background: var(--nav-accent);\n  color: #fff;\n  cursor: pointer;\n}\n.pricing-card__cta--primary:hover:not(:disabled) {\n  filter: brightness(1.05);\n}\n.pricing-card__cta--primary:disabled {\n  opacity: 0.7;\n  cursor: wait;\n}\n.pricing-card__cta--link {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  text-decoration: none;\n  border-color: var(--nav-accent);\n  color: var(--nav-accent);\n  cursor: pointer;\n}\n.pricing-card__hint {\n  margin: 0;\n  font-size: 0.8125rem;\n  color: rgb(180, 83, 9);\n}\n.pricing-card__stripe {\n  margin: 0;\n  text-align: center;\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n}\n.pricing-faq__title {\n  margin: 0 0 1rem;\n  font-size: 1.125rem;\n  font-weight: 700;\n  color: var(--text-primary);\n}\n.pricing-faq__list {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.pricing-faq__item {\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n  overflow: hidden;\n}\n.pricing-faq__question {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  width: 100%;\n  padding: 0.875rem 1rem;\n  border: none;\n  background: transparent;\n  text-align: left;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  color: var(--text-primary);\n  cursor: pointer;\n}\n.pricing-faq__chevron {\n  flex-shrink: 0;\n  width: 0.5rem;\n  height: 0.5rem;\n  border-right: 2px solid var(--text-secondary);\n  border-bottom: 2px solid var(--text-secondary);\n  transform: rotate(45deg);\n  transition: transform 0.15s ease;\n}\n.pricing-faq__item--open .pricing-faq__chevron {\n  transform: rotate(-135deg);\n  margin-top: 0.25rem;\n}\n.pricing-faq__answer {\n  padding: 0 1rem 1rem;\n}\n.pricing-faq__answer p {\n  margin: 0;\n  font-size: 0.875rem;\n  line-height: 1.55;\n  color: var(--text-secondary);\n}\n/*# sourceMappingURL=pricing.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PricingComponent, { className: "PricingComponent", filePath: "app/features/pricing/pricing.component.ts", lineNumber: 28 });
})();
export {
  PricingComponent
};
//# sourceMappingURL=chunk-6TLI2M6A.js.map
