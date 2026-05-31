import {
  AppSelectComponent
} from "./chunk-VZTTL7NS.js";
import {
  MarketingConsentService
} from "./chunk-BMNGTN7M.js";
import {
  CheckboxControlValueAccessor,
  CheckboxRequiredValidator,
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-3XYGRFFE.js";
import "./chunk-JKSU2LPC.js";
import {
  purgeStaleOverlayLayers
} from "./chunk-MFN2ATQX.js";
import "./chunk-Z5FPAOY7.js";
import {
  UserService
} from "./chunk-KBYR5346.js";
import {
  AuthService
} from "./chunk-LS4RMPGH.js";
import "./chunk-EWPFDTJG.js";
import {
  ActivatedRoute,
  RouterLink
} from "./chunk-HPUTEZXI.js";
import {
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  I18nService,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-27NINFBT.js";

// src/app/core/data/un-country-codes.ts
var UN_MEMBER_COUNTRY_CODES = [
  "AF",
  "AL",
  "DZ",
  "AD",
  "AO",
  "AG",
  "AR",
  "AM",
  "AU",
  "AT",
  "AZ",
  "BS",
  "BH",
  "BD",
  "BB",
  "BY",
  "BE",
  "BZ",
  "BJ",
  "BT",
  "BO",
  "BA",
  "BW",
  "BR",
  "BN",
  "BG",
  "BF",
  "BI",
  "CV",
  "KH",
  "CM",
  "CA",
  "CF",
  "TD",
  "CL",
  "CN",
  "CO",
  "KM",
  "CG",
  "CD",
  "CR",
  "CI",
  "HR",
  "CU",
  "CY",
  "CZ",
  "DK",
  "DJ",
  "DM",
  "DO",
  "EC",
  "EG",
  "SV",
  "GQ",
  "ER",
  "EE",
  "SZ",
  "ET",
  "FJ",
  "FI",
  "FR",
  "GA",
  "GM",
  "GE",
  "DE",
  "GH",
  "GR",
  "GD",
  "GT",
  "GN",
  "GW",
  "GY",
  "HT",
  "HN",
  "HU",
  "IS",
  "IN",
  "ID",
  "IR",
  "IQ",
  "IE",
  "IL",
  "IT",
  "JM",
  "JP",
  "JO",
  "KZ",
  "KE",
  "KI",
  "KP",
  "KR",
  "KW",
  "KG",
  "LA",
  "LV",
  "LB",
  "LS",
  "LR",
  "LY",
  "LI",
  "LT",
  "LU",
  "MG",
  "MW",
  "MY",
  "MV",
  "ML",
  "MT",
  "MH",
  "MR",
  "MU",
  "MX",
  "FM",
  "MD",
  "MC",
  "MN",
  "ME",
  "MA",
  "MZ",
  "MM",
  "NA",
  "NR",
  "NP",
  "NL",
  "NZ",
  "NI",
  "NE",
  "NG",
  "MK",
  "NO",
  "OM",
  "PK",
  "PW",
  "PA",
  "PG",
  "PY",
  "PE",
  "PH",
  "PL",
  "PT",
  "QA",
  "RO",
  "RU",
  "RW",
  "KN",
  "LC",
  "VC",
  "WS",
  "SM",
  "ST",
  "SA",
  "SN",
  "RS",
  "SC",
  "SL",
  "SG",
  "SK",
  "SI",
  "SB",
  "SO",
  "ZA",
  "SS",
  "ES",
  "LK",
  "SD",
  "SR",
  "SE",
  "CH",
  "SY",
  "TJ",
  "TH",
  "TL",
  "TG",
  "TO",
  "TT",
  "TN",
  "TR",
  "TM",
  "TV",
  "UG",
  "UA",
  "AE",
  "GB",
  "TZ",
  "US",
  "UY",
  "UZ",
  "VU",
  "VE",
  "VN",
  "YE",
  "ZM",
  "ZW"
];
var UN_MEMBER_COUNTRY_CODE_SET = new Set(UN_MEMBER_COUNTRY_CODES);

// src/app/core/utils/country-select-options.ts
var LOCALE_BY_LANG = {
  ru: "ru",
  en: "en",
  de: "de",
  kz: "kk",
  uk: "uk",
  by: "be"
};
var displayNamesCache = /* @__PURE__ */ new Map();
function countryDisplayNames(lang) {
  const locale = LOCALE_BY_LANG[lang];
  const cached = displayNamesCache.get(locale);
  if (cached) {
    return cached;
  }
  const dn = new Intl.DisplayNames([locale], { type: "region" });
  displayNamesCache.set(locale, dn);
  return dn;
}
function buildCountrySelectOptions(lang) {
  const locale = LOCALE_BY_LANG[lang];
  const names = countryDisplayNames(lang);
  return UN_MEMBER_COUNTRY_CODES.map((code) => ({
    value: code,
    label: names.of(code) ?? code
  })).sort((a, b) => a.label.localeCompare(b.label, locale, { sensitivity: "base" }));
}

// src/app/core/utils/oauth-display-name.ts
function splitDisplayName(displayName) {
  const display = displayName?.trim() ?? "";
  if (!display) {
    return { firstName: "", lastName: "" };
  }
  const parts = display.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ")
  };
}

// src/app/features/auth/onboarding.component.ts
function OnboardingComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 27);
    \u0275\u0275element(2, "span", 28);
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.i18n.authUi().onboardingSubmitting);
  }
}
function OnboardingComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function OnboardingComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "footer", 26)(1, "div", 29)(2, "h2", 30);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 31);
    \u0275\u0275text(5);
    \u0275\u0275elementStart(6, "a", 32);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "p", 33);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 34)(11, "button", 35);
    \u0275\u0275listener("click", function OnboardingComponent_Conditional_52_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.acceptMarketingCookies());
    });
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 36);
    \u0275\u0275listener("click", function OnboardingComponent_Conditional_52_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.declineMarketingCookies());
    });
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.authUi().onboardingCookiesTitle, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.authUi().onboardingCookiesBody, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.authUi().onboardingCookiePolicyLink, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.authUi().onboardingCookiesOptional);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.authUi().onboardingCookiesTitle);
    \u0275\u0275advance();
    \u0275\u0275classProp("onboarding-cookie-btn--active", ctx_r0.consent.isAccepted());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.authUi().onboardingCookiesAccept, " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("onboarding-cookie-btn--active", ctx_r0.consent.choice() === false);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.authUi().onboardingCookiesDecline, " ");
  }
}
var OnboardingComponent = class _OnboardingComponent {
  auth = inject(AuthService);
  userSvc = inject(UserService);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);
  document = inject(DOCUMENT);
  i18n = inject(I18nService);
  consent = inject(MarketingConsentService);
  email = "";
  firstName = "";
  lastName = "";
  country = "AT";
  dataConsent = false;
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  error = signal("", ...ngDevMode ? [{ debugName: "error" }] : (
    /* istanbul ignore next */
    []
  ));
  countryOptions = computed(() => buildCountrySelectOptions(this.i18n.lang()), ...ngDevMode ? [{ debugName: "countryOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    purgeStaleOverlayLayers(this.document);
    const profile = this.route.snapshot.data["profile"];
    const fbUser = this.auth.firebaseUser();
    const oauthNames = splitDisplayName(fbUser?.displayName);
    this.applyProfile(profile, oauthNames, fbUser?.email ?? "");
  }
  applyProfile(profile, oauthNames, fallbackEmail) {
    if (!profile) {
      this.email = fallbackEmail;
      this.firstName = oauthNames.firstName ?? "";
      this.lastName = oauthNames.lastName ?? "";
      return;
    }
    this.email = profile.email || fallbackEmail;
    this.firstName = profile.first_name?.trim() || oauthNames.firstName || "";
    this.lastName = profile.last_name?.trim() || oauthNames.lastName || "";
    if (profile.country_settings) {
      this.country = profile.country_settings;
    }
    this.consent.syncFromProfile(profile);
    this.cdr.markForCheck();
  }
  acceptMarketingCookies() {
    this.consent.accept();
    this.userSvc.updateMarketingCookies(true).subscribe({ error: () => {
    } });
  }
  declineMarketingCookies() {
    this.consent.decline();
    this.userSvc.updateMarketingCookies(false).subscribe({ error: () => {
    } });
  }
  submit() {
    const t = this.i18n.authUi();
    this.error.set("");
    if (!this.dataConsent) {
      this.error.set(t.onboardingConsentRequired);
      return;
    }
    if (!this.firstName.trim()) {
      this.error.set(t.onboardingFirstNameRequired);
      return;
    }
    this.loading.set(true);
    this.userSvc.completeOnboarding({
      first_name: this.firstName.trim(),
      last_name: this.lastName.trim(),
      country_settings: this.country,
      data_consent_accepted: true,
      marketing_cookies_accepted: this.consent.isAccepted()
    }).subscribe({
      next: (profile) => {
        this.loading.set(false);
        const user = this.auth.firebaseUser();
        if (user) {
          this.auth.navigateAfterAuth(profile, user);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? t.onboardingSaveError);
      }
    });
  }
  declineDataCollection() {
    const t = this.i18n.authUi();
    this.loading.set(true);
    this.userSvc.declineOnboarding().subscribe({
      next: () => {
        this.auth.logout().subscribe({
          error: () => {
            this.loading.set(false);
            this.error.set(t.onboardingDeclineError);
          }
        });
      },
      error: () => {
        this.loading.set(false);
        this.error.set(t.onboardingDeclineError);
      }
    });
  }
  static \u0275fac = function OnboardingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OnboardingComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OnboardingComponent, selectors: [["app-onboarding"]], decls: 53, vars: 34, consts: [[1, "onboarding-shell"], [1, "auth-page", "auth-page--onboarding"], ["role", "status", "aria-live", "polite", "aria-busy", "true", 1, "onboarding-submit-overlay"], [1, "auth-page__scroll"], [1, "auth-logo"], [1, "auth-card", "auth-card--onboarding"], [1, "subtitle"], [1, "auth-error"], [1, "auth-form", 3, "ngSubmit"], [1, "field", "field--float", "field--readonly"], ["type", "email", "name", "email", "readonly", "", "tabindex", "-1", "placeholder", " ", 3, "ngModel"], [1, "field", "field--float"], ["type", "text", "name", "firstName", "required", "", "placeholder", " ", "autocomplete", "given-name", "maxlength", "60", 3, "ngModelChange", "ngModel", "disabled"], ["type", "text", "name", "lastName", "placeholder", " ", "autocomplete", "family-name", "maxlength", "60", 3, "ngModelChange", "ngModel", "disabled"], [1, "field", "field--select", "onboarding-country"], ["name", "country", "menuPlacement", "below", 3, "ngModelChange", "ngModel", "options", "disabled"], ["aria-labelledby", "onboarding-data-heading", 1, "onboarding-legal"], ["id", "onboarding-data-heading", 1, "onboarding-legal__title"], [1, "onboarding-legal__text"], [1, "onboarding-legal__list"], ["routerLink", "/legal/data-processing", "target", "_blank", "rel", "noopener noreferrer", 1, "onboarding-legal__link"], [1, "onboarding-consent"], ["type", "checkbox", "name", "dataConsent", "required", "", 3, "ngModelChange", "ngModel", "disabled"], [1, "auth-actions", "auth-actions--stack"], ["type", "submit", 1, "auth-btn-primary", 3, "disabled"], ["type", "button", 1, "auth-link-button", "auth-link-button--block", 3, "click", "disabled"], ["aria-labelledby", "onboarding-cookies-heading", 1, "onboarding-cookie-bar"], [1, "onboarding-submit-overlay__panel"], ["aria-hidden", "true", 1, "onboarding-submit-overlay__spinner"], [1, "onboarding-cookie-bar__inner"], ["id", "onboarding-cookies-heading", 1, "onboarding-cookie-bar__title"], [1, "onboarding-cookie-bar__text"], ["routerLink", "/legal/cookies", "target", "_blank", "rel", "noopener noreferrer", 1, "onboarding-cookie-bar__link"], [1, "onboarding-cookie-bar__hint"], ["role", "group", 1, "onboarding-cookie-actions"], ["type", "button", 1, "onboarding-cookie-btn", "onboarding-cookie-btn--accept", 3, "click"], ["type", "button", 1, "onboarding-cookie-btn", "onboarding-cookie-btn--muted", 3, "click"]], template: function OnboardingComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275conditionalCreate(2, OnboardingComponent_Conditional_2_Template, 5, 1, "div", 2);
      \u0275\u0275elementStart(3, "div", 3)(4, "span", 4);
      \u0275\u0275text(5, "Simple4U");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 5)(7, "h1");
      \u0275\u0275text(8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 6);
      \u0275\u0275text(10);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(11, OnboardingComponent_Conditional_11_Template, 2, 1, "div", 7);
      \u0275\u0275elementStart(12, "form", 8);
      \u0275\u0275listener("ngSubmit", function OnboardingComponent_Template_form_ngSubmit_12_listener() {
        return ctx.submit();
      });
      \u0275\u0275elementStart(13, "div", 9);
      \u0275\u0275element(14, "input", 10);
      \u0275\u0275elementStart(15, "label");
      \u0275\u0275text(16);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 11)(18, "input", 12);
      \u0275\u0275twoWayListener("ngModelChange", function OnboardingComponent_Template_input_ngModelChange_18_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.firstName, $event) || (ctx.firstName = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "label");
      \u0275\u0275text(20);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "div", 11)(22, "input", 13);
      \u0275\u0275twoWayListener("ngModelChange", function OnboardingComponent_Template_input_ngModelChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.lastName, $event) || (ctx.lastName = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "label");
      \u0275\u0275text(24);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "div", 14)(26, "app-select", 15);
      \u0275\u0275twoWayListener("ngModelChange", function OnboardingComponent_Template_app_select_ngModelChange_26_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.country, $event) || (ctx.country = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "label");
      \u0275\u0275text(28);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "section", 16)(30, "h2", 17);
      \u0275\u0275text(31);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "p", 18);
      \u0275\u0275text(33);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "ul", 19)(35, "li");
      \u0275\u0275text(36);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "li");
      \u0275\u0275text(38);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "li");
      \u0275\u0275text(40);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(41, "a", 20);
      \u0275\u0275text(42);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "label", 21)(44, "input", 22);
      \u0275\u0275twoWayListener("ngModelChange", function OnboardingComponent_Template_input_ngModelChange_44_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dataConsent, $event) || (ctx.dataConsent = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "span");
      \u0275\u0275text(46);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(47, "div", 23)(48, "button", 24);
      \u0275\u0275text(49);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "button", 25);
      \u0275\u0275listener("click", function OnboardingComponent_Template_button_click_50_listener() {
        return ctx.declineDataCollection();
      });
      \u0275\u0275text(51);
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275conditionalCreate(52, OnboardingComponent_Conditional_52_Template, 15, 11, "footer", 26);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classProp("onboarding-shell--cookie-dismissed", ctx.consent.hasChoice());
      \u0275\u0275advance();
      \u0275\u0275classProp("auth-page--submitting", ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 2 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().onboardingTitle);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().onboardingSubtitle);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 11 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngModel", ctx.email);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().email);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("ngModel", ctx.firstName);
      \u0275\u0275property("disabled", ctx.loading());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().onboardingFirstName);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("ngModel", ctx.lastName);
      \u0275\u0275property("disabled", ctx.loading());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().onboardingLastName);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("ngModel", ctx.country);
      \u0275\u0275property("options", ctx.countryOptions())("disabled", ctx.loading());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().onboardingCountry);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.i18n.authUi().onboardingDataTitle, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().onboardingDataBody);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().onboardingDataItem1);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().onboardingDataItem2);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().onboardingDataItem3);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.i18n.authUi().onboardingDataPolicyLink, " ");
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("ngModel", ctx.dataConsent);
      \u0275\u0275property("disabled", ctx.loading());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().onboardingDataConsentLabel);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.loading() ? ctx.i18n.authUi().onboardingSaving : ctx.i18n.authUi().onboardingContinue, " ");
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.i18n.authUi().onboardingDeclineData, " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.consent.hasChoice() ? 52 : -1);
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, CheckboxRequiredValidator, NgModel, NgForm, RouterLink, AppSelectComponent], styles: ['\n.auth-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background-color: #f8f9fa;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-logo[_ngcontent-%COMP%] {\n  font-size: 22px;\n  font-weight: 500;\n  color: #202124;\n  letter-spacing: -0.3px;\n  margin-bottom: 28px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-card[_ngcontent-%COMP%] {\n  background: #fff;\n  border: 1px solid #dadce0;\n  border-radius: 8px;\n  width: 100%;\n  max-width: 396px;\n  padding: 48px 40px 36px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 400;\n  color: #202124;\n  text-align: center;\n  margin-bottom: 8px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-card[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #5f6368;\n  text-align: center;\n  margin-bottom: 28px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-error[_ngcontent-%COMP%] {\n  background: #fce8e6;\n  color: #c5221f;\n  font-size: 13px;\n  border-radius: 4px;\n  padding: 8px 12px;\n  margin-bottom: 16px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-success[_ngcontent-%COMP%] {\n  color: #0f9d58;\n  font-size: 13px;\n  margin-bottom: 12px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-hint[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #5f6368;\n  text-align: center;\n  margin-bottom: 16px;\n  line-height: 1.45;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-hint[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #0f9d58;\n  text-decoration: none;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-hint[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-email-display[_ngcontent-%COMP%] {\n  text-align: center;\n  font-weight: 500;\n  color: #202124;\n  margin-bottom: 12px;\n  word-break: break-all;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-forgot-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  margin-top: -8px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-link-button[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  padding: 0;\n  font-size: 13px;\n  color: #0f9d58;\n  cursor: pointer;\n  text-decoration: underline;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-link-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%] {\n  position: relative;\n}\n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid #dadce0;\n  border-radius: 4px;\n  padding: 13px 12px 8px;\n  font-size: 14px;\n  color: #202124;\n  background: #fff;\n  outline: none;\n  transition: border-color 0.15s, box-shadow 0.15s;\n}\n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  border-color: #0f9d58;\n  box-shadow: 0 0 0 1px #0f9d58;\n}\n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus    + label[_ngcontent-%COMP%], \n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:not(:placeholder-shown)    + label[_ngcontent-%COMP%] {\n  top: 6px;\n  font-size: 11px;\n  color: #5f6368;\n}\n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus    + label[_ngcontent-%COMP%] {\n  color: #0f9d58;\n}\n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 14px;\n  color: #5f6368;\n  pointer-events: none;\n  transition:\n    top 0.15s,\n    font-size 0.15s,\n    color 0.15s;\n  background: #fff;\n  padding: 0 2px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%] {\n  flex-direction: column;\n  gap: 12px;\n  align-items: stretch;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%] {\n  width: 100%;\n  background: #0f9d58;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  padding: 10px 24px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%] {\n  width: 100%;\n  background: #fff;\n  color: #202124;\n  border: 1px solid #dadce0;\n  border-radius: 4px;\n  padding: 10px 24px;\n  font-size: 14px;\n  cursor: pointer;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: #5f6368;\n  font-size: 13px;\n  cursor: pointer;\n  text-decoration: underline;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-dialog-hint[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #5f6368;\n  margin: 0 0 16px;\n  line-height: 1.45;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-dialog-success[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #137333;\n  margin: 0;\n  line-height: 1.45;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-dialog-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-dialog-status[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #5f6368;\n  margin: 12px 0 0;\n  text-align: center;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-error--dialog[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-banner-success[_ngcontent-%COMP%] {\n  background: #e6f4ea;\n  color: #137333;\n  font-size: 13px;\n  border-radius: 4px;\n  padding: 10px 12px;\n  margin-bottom: 16px;\n  text-align: center;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: 8px;\n}\n@media (max-width: 400px) {\n  .auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n    font-size: 13px;\n  }\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #0f9d58;\n  text-decoration: none;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  background: #0f9d58;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  padding: 9px 24px;\n}\n@media (max-width: 400px) {\n  .auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    padding: 10px 18px !important;\n    font-size: 11.5px !important;\n  }\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.15s;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  background: #066535;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page.auth-page--onboarding[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  min-height: 0;\n  justify-content: flex-start;\n  align-items: stretch;\n  padding: 0;\n  overflow: hidden;\n}\n.auth-page.auth-page--onboarding[_ngcontent-%COMP%]   .auth-page__scroll[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.auth-page.auth-page--submitting[_ngcontent-%COMP%]   .auth-page__scroll[_ngcontent-%COMP%] {\n  filter: blur(10px);\n  opacity: 0.35;\n  pointer-events: none;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-page__scroll[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  width: 100%;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 16px 16px 0;\n  -webkit-overflow-scrolling: touch;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-card--onboarding[_ngcontent-%COMP%] {\n  max-width: 480px;\n  margin: 0 auto;\n  padding: 40px 32px 24px;\n  background: #fff;\n  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.14);\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-submit-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 500;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1.5rem;\n  background: rgba(255, 255, 255, 0.55);\n  backdrop-filter: blur(14px) saturate(0.85);\n  -webkit-backdrop-filter: blur(14px) saturate(0.85);\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-submit-overlay__panel[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 1rem;\n  max-width: 20rem;\n  padding: 1.5rem 1.75rem;\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.92);\n  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.18);\n  text-align: center;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-submit-overlay__panel[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.9375rem;\n  font-weight: 500;\n  color: #202124;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-submit-overlay__spinner[_ngcontent-%COMP%] {\n  width: 2.25rem;\n  height: 2.25rem;\n  border: 3px solid #dadce0;\n  border-top-color: #0f9d58;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_onboarding-spin 0.75s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_onboarding-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-legal__link[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin-bottom: 12px;\n  font-size: 13px;\n  font-weight: 500;\n  color: #0f9d58;\n  text-decoration: underline;\n}\n.auth-page[_ngcontent-%COMP%]   .field--readonly[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  background: #f8f9fa;\n  color: #5f6368;\n  cursor: default;\n}\n.auth-page[_ngcontent-%COMP%]   .field.field--select[_ngcontent-%COMP%]   app-select[_ngcontent-%COMP%] {\n  display: block;\n}\n.auth-page[_ngcontent-%COMP%]   .field.field--select[_ngcontent-%COMP%]    > label[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 6px;\n  left: 12px;\n  z-index: 2;\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 1.2;\n  transform: none;\n  background: #fff;\n  padding: 0 2px;\n  color: #5f6368;\n  pointer-events: none;\n}\n.auth-page[_ngcontent-%COMP%]   .field--select.onboarding-country[_ngcontent-%COMP%] {\n  margin-top: 0;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-legal[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  padding: 14px 14px 12px;\n  border: 1px solid #dadce0;\n  border-radius: 8px;\n  background: #f8f9fa;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-legal__title[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  font-size: 14px;\n  font-weight: 500;\n  color: #202124;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-legal__text[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #5f6368;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-legal__text[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #0f9d58;\n  text-decoration: underline;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-legal__list[_ngcontent-%COMP%] {\n  margin: 0 0 12px;\n  padding-left: 1.15rem;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #5f6368;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-consent[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #202124;\n  cursor: pointer;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-consent[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  margin-top: 3px;\n  flex-shrink: 0;\n  accent-color: #0f9d58;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-btn-primary[_ngcontent-%COMP%] {\n  width: 100%;\n  background: #0f9d58;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  padding: 10px 24px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-btn-primary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-link-button--block[_ngcontent-%COMP%] {\n  width: 100%;\n  text-align: center;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-divider[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin: 4px 0;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-divider[_ngcontent-%COMP%]::before, \n.auth-page[_ngcontent-%COMP%]   .auth-divider[_ngcontent-%COMP%]::after {\n  content: "";\n  flex: 1;\n  height: 1px;\n  background: #dadce0;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-divider[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #5f6368;\n  white-space: nowrap;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-oauth-btn[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid #dadce0;\n  border-radius: 4px;\n  padding: 10px 16px;\n  font-size: 14px;\n  font-weight: 500;\n  background: #fff;\n  color: #202124;\n  cursor: pointer;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-oauth-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #f8f9fa;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-oauth-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.onboarding-shell[_ngcontent-%COMP%] {\n  --onboarding-cookie-bar-space: 12.5rem;\n  display: flex;\n  flex-direction: column;\n  min-height: 100dvh;\n  min-height: 100svh;\n  position: relative;\n}\n@media (min-width: 640px) {\n  .onboarding-shell[_ngcontent-%COMP%] {\n    --onboarding-cookie-bar-space: 10rem;\n  }\n}\n.onboarding-shell[_ngcontent-%COMP%]   .auth-page--onboarding[_ngcontent-%COMP%]   .auth-page__scroll[_ngcontent-%COMP%] {\n  padding-bottom: calc(var(--onboarding-cookie-bar-space) + env(safe-area-inset-bottom, 0px));\n}\n.onboarding-shell--cookie-dismissed[_ngcontent-%COMP%] {\n  --onboarding-cookie-bar-space: 0px;\n}\n.onboarding-shell--cookie-dismissed[_ngcontent-%COMP%]   .auth-page--onboarding[_ngcontent-%COMP%]   .auth-page__scroll[_ngcontent-%COMP%] {\n  padding-bottom: env(safe-area-inset-bottom, 0px);\n}\n.onboarding-cookie-bar[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 2000;\n  pointer-events: auto;\n  touch-action: manipulation;\n  isolation: isolate;\n  max-height: min(44dvh, 17rem);\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  border-top: 1px solid #dadce0;\n  background: rgba(255, 255, 255, 0.98);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.1);\n  padding: 0 calc(16px + env(safe-area-inset-right, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)) calc(16px + env(safe-area-inset-left, 0px));\n}\n@media (min-width: 640px) {\n  .onboarding-cookie-bar[_ngcontent-%COMP%] {\n    max-height: none;\n  }\n}\n.onboarding-cookie-bar__inner[_ngcontent-%COMP%] {\n  max-width: 480px;\n  margin: 0 auto;\n  padding-top: 12px;\n}\n.onboarding-cookie-bar__title[_ngcontent-%COMP%] {\n  margin: 0 0 6px;\n  font-size: 14px;\n  font-weight: 600;\n  color: #202124;\n}\n.onboarding-cookie-bar__text[_ngcontent-%COMP%] {\n  margin: 0 0 6px;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #5f6368;\n}\n.onboarding-cookie-bar__link[_ngcontent-%COMP%] {\n  color: #0f9d58;\n  font-weight: 500;\n  text-decoration: underline;\n}\n.onboarding-cookie-bar__hint[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n  font-size: 12px;\n  line-height: 1.4;\n  color: #80868b;\n}\n.onboarding-cookie-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.onboarding-cookie-btn[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 7rem;\n  border: 1px solid #dadce0;\n  border-radius: 6px;\n  padding: 8px 12px;\n  font-size: 13px;\n  font-weight: 500;\n  background: #fff;\n  color: #202124;\n  cursor: pointer;\n  pointer-events: auto;\n  transition:\n    border-color 0.15s ease,\n    background 0.15s ease,\n    color 0.15s ease,\n    box-shadow 0.15s ease;\n}\n.onboarding-cookie-btn[_ngcontent-%COMP%]:hover {\n  border-color: #0f9d58;\n}\n.onboarding-cookie-btn[_ngcontent-%COMP%]:active {\n  transform: scale(0.98);\n}\n.onboarding-cookie-btn--accept[_ngcontent-%COMP%] {\n  border-color: #0f9d58;\n  background: #0f9d58;\n  color: #fff;\n}\n.onboarding-cookie-btn--accept[_ngcontent-%COMP%]:hover {\n  background: #0b8043;\n  border-color: #0b8043;\n}\n.onboarding-cookie-btn--muted[_ngcontent-%COMP%] {\n  color: #5f6368;\n  background: #fff;\n}\n.onboarding-cookie-btn--active[_ngcontent-%COMP%] {\n  border-color: #0f9d58;\n  box-shadow: 0 0 0 1px #0f9d58;\n  color: #0f9d58;\n}\n.onboarding-cookie-btn--accept.onboarding-cookie-btn--active[_ngcontent-%COMP%] {\n  background: #0b8043;\n  border-color: #0b8043;\n  color: #fff;\n  box-shadow: 0 0 0 1px #0b8043;\n}\n/*# sourceMappingURL=auth.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OnboardingComponent, [{
    type: Component,
    args: [{ selector: "app-onboarding", standalone: true, imports: [FormsModule, RouterLink, AppSelectComponent], template: '<div\n  class="onboarding-shell"\n  [class.onboarding-shell--cookie-dismissed]="consent.hasChoice()"\n>\n  <div class="auth-page auth-page--onboarding" [class.auth-page--submitting]="loading()">\n    @if (loading()) {\n      <div class="onboarding-submit-overlay" role="status" aria-live="polite" aria-busy="true">\n        <div class="onboarding-submit-overlay__panel">\n          <span class="onboarding-submit-overlay__spinner" aria-hidden="true"></span>\n          <p>{{ i18n.authUi().onboardingSubmitting }}</p>\n        </div>\n      </div>\n    }\n\n    <div class="auth-page__scroll">\n      <span class="auth-logo">Simple4U</span>\n\n      <div class="auth-card auth-card--onboarding">\n        <h1>{{ i18n.authUi().onboardingTitle }}</h1>\n        <p class="subtitle">{{ i18n.authUi().onboardingSubtitle }}</p>\n\n        @if (error()) {\n          <div class="auth-error">{{ error() }}</div>\n        }\n\n        <form class="auth-form" (ngSubmit)="submit()">\n          <div class="field field--float field--readonly">\n            <input\n              type="email"\n              [ngModel]="email"\n              name="email"\n              readonly\n              tabindex="-1"\n              placeholder=" "\n            />\n            <label>{{ i18n.authUi().email }}</label>\n          </div>\n\n          <div class="field field--float">\n            <input\n              type="text"\n              [(ngModel)]="firstName"\n              name="firstName"\n              required\n              placeholder=" "\n              autocomplete="given-name"\n              maxlength="60"\n              [disabled]="loading()"\n            />\n            <label>{{ i18n.authUi().onboardingFirstName }}</label>\n          </div>\n\n          <div class="field field--float">\n            <input\n              type="text"\n              [(ngModel)]="lastName"\n              name="lastName"\n              placeholder=" "\n              autocomplete="family-name"\n              maxlength="60"\n              [disabled]="loading()"\n            />\n            <label>{{ i18n.authUi().onboardingLastName }}</label>\n          </div>\n\n          <div class="field field--select onboarding-country">\n            <app-select\n              name="country"\n              [(ngModel)]="country"\n              [options]="countryOptions()"\n              [disabled]="loading()"\n              menuPlacement="below"\n            />\n            <label>{{ i18n.authUi().onboardingCountry }}</label>\n          </div>\n\n          <section class="onboarding-legal" aria-labelledby="onboarding-data-heading">\n            <h2 id="onboarding-data-heading" class="onboarding-legal__title">\n              {{ i18n.authUi().onboardingDataTitle }}\n            </h2>\n            <p class="onboarding-legal__text">{{ i18n.authUi().onboardingDataBody }}</p>\n            <ul class="onboarding-legal__list">\n              <li>{{ i18n.authUi().onboardingDataItem1 }}</li>\n              <li>{{ i18n.authUi().onboardingDataItem2 }}</li>\n              <li>{{ i18n.authUi().onboardingDataItem3 }}</li>\n            </ul>\n\n            <a\n              routerLink="/legal/data-processing"\n              class="onboarding-legal__link"\n              target="_blank"\n              rel="noopener noreferrer"\n            >\n              {{ i18n.authUi().onboardingDataPolicyLink }}\n            </a>\n\n            <label class="onboarding-consent">\n              <input\n                type="checkbox"\n                [(ngModel)]="dataConsent"\n                name="dataConsent"\n                required\n                [disabled]="loading()"\n              />\n              <span>{{ i18n.authUi().onboardingDataConsentLabel }}</span>\n            </label>\n          </section>\n\n          <div class="auth-actions auth-actions--stack">\n            <button type="submit" class="auth-btn-primary" [disabled]="loading()">\n              {{ loading() ? i18n.authUi().onboardingSaving : i18n.authUi().onboardingContinue }}\n            </button>\n            <button\n              type="button"\n              class="auth-link-button auth-link-button--block"\n              [disabled]="loading()"\n              (click)="declineDataCollection()"\n            >\n              {{ i18n.authUi().onboardingDeclineData }}\n            </button>\n          </div>\n        </form>\n      </div>\n    </div>\n  </div>\n\n  @if (!consent.hasChoice()) {\n    <footer class="onboarding-cookie-bar" aria-labelledby="onboarding-cookies-heading">\n    <div class="onboarding-cookie-bar__inner">\n      <h2 id="onboarding-cookies-heading" class="onboarding-cookie-bar__title">\n        {{ i18n.authUi().onboardingCookiesTitle }}\n      </h2>\n      <p class="onboarding-cookie-bar__text">\n        {{ i18n.authUi().onboardingCookiesBody }}\n        <a\n          routerLink="/legal/cookies"\n          class="onboarding-cookie-bar__link"\n          target="_blank"\n          rel="noopener noreferrer"\n        >\n          {{ i18n.authUi().onboardingCookiePolicyLink }}\n        </a>\n      </p>\n      <p class="onboarding-cookie-bar__hint">{{ i18n.authUi().onboardingCookiesOptional }}</p>\n\n      <div\n        class="onboarding-cookie-actions"\n        role="group"\n        [attr.aria-label]="i18n.authUi().onboardingCookiesTitle"\n      >\n        <button\n          type="button"\n          class="onboarding-cookie-btn onboarding-cookie-btn--accept"\n          [class.onboarding-cookie-btn--active]="consent.isAccepted()"\n          (click)="acceptMarketingCookies()"\n        >\n          {{ i18n.authUi().onboardingCookiesAccept }}\n        </button>\n        <button\n          type="button"\n          class="onboarding-cookie-btn onboarding-cookie-btn--muted"\n          [class.onboarding-cookie-btn--active]="consent.choice() === false"\n          (click)="declineMarketingCookies()"\n        >\n          {{ i18n.authUi().onboardingCookiesDecline }}\n        </button>\n      </div>\n    </div>\n    </footer>\n  }\n</div>\n', styles: ['/* src/app/features/auth/auth.scss */\n.auth-page {\n  min-height: 100vh;\n  background-color: #f8f9fa;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n}\n.auth-page .auth-logo {\n  font-size: 22px;\n  font-weight: 500;\n  color: #202124;\n  letter-spacing: -0.3px;\n  margin-bottom: 28px;\n}\n.auth-page .auth-card {\n  background: #fff;\n  border: 1px solid #dadce0;\n  border-radius: 8px;\n  width: 100%;\n  max-width: 396px;\n  padding: 48px 40px 36px;\n}\n.auth-page .auth-card h1 {\n  font-size: 24px;\n  font-weight: 400;\n  color: #202124;\n  text-align: center;\n  margin-bottom: 8px;\n}\n.auth-page .auth-card .subtitle {\n  font-size: 14px;\n  color: #5f6368;\n  text-align: center;\n  margin-bottom: 28px;\n}\n.auth-page .auth-error {\n  background: #fce8e6;\n  color: #c5221f;\n  font-size: 13px;\n  border-radius: 4px;\n  padding: 8px 12px;\n  margin-bottom: 16px;\n}\n.auth-page .auth-success {\n  color: #0f9d58;\n  font-size: 13px;\n  margin-bottom: 12px;\n}\n.auth-page .auth-hint {\n  font-size: 13px;\n  color: #5f6368;\n  text-align: center;\n  margin-bottom: 16px;\n  line-height: 1.45;\n}\n.auth-page .auth-hint a {\n  color: #0f9d58;\n  text-decoration: none;\n}\n.auth-page .auth-hint a:hover {\n  text-decoration: underline;\n}\n.auth-page .auth-email-display {\n  text-align: center;\n  font-weight: 500;\n  color: #202124;\n  margin-bottom: 12px;\n  word-break: break-all;\n}\n.auth-page .auth-forgot-row {\n  display: flex;\n  justify-content: flex-end;\n  margin-top: -8px;\n}\n.auth-page .auth-link-button {\n  background: none;\n  border: none;\n  padding: 0;\n  font-size: 13px;\n  color: #0f9d58;\n  cursor: pointer;\n  text-decoration: underline;\n}\n.auth-page .auth-link-button:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page .auth-form {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.auth-page .field {\n  position: relative;\n}\n.auth-page .field input {\n  width: 100%;\n  border: 1px solid #dadce0;\n  border-radius: 4px;\n  padding: 13px 12px 8px;\n  font-size: 14px;\n  color: #202124;\n  background: #fff;\n  outline: none;\n  transition: border-color 0.15s, box-shadow 0.15s;\n}\n.auth-page .field input:focus {\n  border-color: #0f9d58;\n  box-shadow: 0 0 0 1px #0f9d58;\n}\n.auth-page .field input:focus + label,\n.auth-page .field input:not(:placeholder-shown) + label {\n  top: 6px;\n  font-size: 11px;\n  color: #5f6368;\n}\n.auth-page .field input:focus + label {\n  color: #0f9d58;\n}\n.auth-page .field label {\n  position: absolute;\n  left: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 14px;\n  color: #5f6368;\n  pointer-events: none;\n  transition:\n    top 0.15s,\n    font-size 0.15s,\n    color 0.15s;\n  background: #fff;\n  padding: 0 2px;\n}\n.auth-page .auth-actions--stack {\n  flex-direction: column;\n  gap: 12px;\n  align-items: stretch;\n}\n.auth-page .auth-actions--stack .btn-primary {\n  width: 100%;\n  background: #0f9d58;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  padding: 10px 24px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n}\n.auth-page .auth-actions--stack .btn-primary:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page .auth-actions--stack a {\n  text-align: center;\n}\n.auth-page .auth-actions--stack .btn-secondary {\n  width: 100%;\n  background: #fff;\n  color: #202124;\n  border: 1px solid #dadce0;\n  border-radius: 4px;\n  padding: 10px 24px;\n  font-size: 14px;\n  cursor: pointer;\n}\n.auth-page .auth-actions--stack .btn-secondary:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page .auth-actions--stack .btn-link {\n  background: none;\n  border: none;\n  color: #5f6368;\n  font-size: 13px;\n  cursor: pointer;\n  text-decoration: underline;\n}\n.auth-page .auth-dialog-hint {\n  font-size: 14px;\n  color: #5f6368;\n  margin: 0 0 16px;\n  line-height: 1.45;\n}\n.auth-page .auth-dialog-success {\n  font-size: 14px;\n  color: #137333;\n  margin: 0;\n  line-height: 1.45;\n}\n.auth-page .auth-dialog-field {\n  margin-bottom: 0;\n}\n.auth-page .auth-dialog-status {\n  font-size: 13px;\n  color: #5f6368;\n  margin: 12px 0 0;\n  text-align: center;\n}\n.auth-page .auth-error--dialog {\n  margin-bottom: 12px;\n}\n.auth-page .auth-banner-success {\n  background: #e6f4ea;\n  color: #137333;\n  font-size: 13px;\n  border-radius: 4px;\n  padding: 10px 12px;\n  margin-bottom: 16px;\n  text-align: center;\n}\n.auth-page .auth-actions {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: 8px;\n}\n@media (max-width: 400px) {\n  .auth-page .auth-actions a {\n    font-size: 13px;\n  }\n}\n.auth-page .auth-actions a {\n  font-size: 14px;\n  color: #0f9d58;\n  text-decoration: none;\n}\n.auth-page .auth-actions a:hover {\n  text-decoration: underline;\n}\n.auth-page .auth-actions button {\n  background: #0f9d58;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  padding: 9px 24px;\n}\n@media (max-width: 400px) {\n  .auth-page .auth-actions button {\n    padding: 10px 18px !important;\n    font-size: 11.5px !important;\n  }\n}\n.auth-page .auth-actions button {\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.15s;\n}\n.auth-page .auth-actions button:hover {\n  background: #066535;\n}\n.auth-page .auth-actions button:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page.auth-page--onboarding {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  min-height: 0;\n  justify-content: flex-start;\n  align-items: stretch;\n  padding: 0;\n  overflow: hidden;\n}\n.auth-page.auth-page--onboarding .auth-page__scroll {\n  position: relative;\n  z-index: 1;\n}\n.auth-page.auth-page--submitting .auth-page__scroll {\n  filter: blur(10px);\n  opacity: 0.35;\n  pointer-events: none;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.auth-page .auth-page__scroll {\n  flex: 1 1 auto;\n  width: 100%;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 16px 16px 0;\n  -webkit-overflow-scrolling: touch;\n}\n.auth-page .auth-card--onboarding {\n  max-width: 480px;\n  margin: 0 auto;\n  padding: 40px 32px 24px;\n  background: #fff;\n  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.14);\n}\n.auth-page .onboarding-submit-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 500;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1.5rem;\n  background: rgba(255, 255, 255, 0.55);\n  backdrop-filter: blur(14px) saturate(0.85);\n  -webkit-backdrop-filter: blur(14px) saturate(0.85);\n}\n.auth-page .onboarding-submit-overlay__panel {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 1rem;\n  max-width: 20rem;\n  padding: 1.5rem 1.75rem;\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.92);\n  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.18);\n  text-align: center;\n}\n.auth-page .onboarding-submit-overlay__panel p {\n  margin: 0;\n  font-size: 0.9375rem;\n  font-weight: 500;\n  color: #202124;\n}\n.auth-page .onboarding-submit-overlay__spinner {\n  width: 2.25rem;\n  height: 2.25rem;\n  border: 3px solid #dadce0;\n  border-top-color: #0f9d58;\n  border-radius: 50%;\n  animation: onboarding-spin 0.75s linear infinite;\n}\n@keyframes onboarding-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.auth-page .onboarding-legal__link {\n  display: inline-block;\n  margin-bottom: 12px;\n  font-size: 13px;\n  font-weight: 500;\n  color: #0f9d58;\n  text-decoration: underline;\n}\n.auth-page .field--readonly input {\n  background: #f8f9fa;\n  color: #5f6368;\n  cursor: default;\n}\n.auth-page .field.field--select app-select {\n  display: block;\n}\n.auth-page .field.field--select > label {\n  position: absolute;\n  top: 6px;\n  left: 12px;\n  z-index: 2;\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 1.2;\n  transform: none;\n  background: #fff;\n  padding: 0 2px;\n  color: #5f6368;\n  pointer-events: none;\n}\n.auth-page .field--select.onboarding-country {\n  margin-top: 0;\n}\n.auth-page .onboarding-legal {\n  margin-top: 4px;\n  padding: 14px 14px 12px;\n  border: 1px solid #dadce0;\n  border-radius: 8px;\n  background: #f8f9fa;\n}\n.auth-page .onboarding-legal__title {\n  margin: 0 0 8px;\n  font-size: 14px;\n  font-weight: 500;\n  color: #202124;\n}\n.auth-page .onboarding-legal__text {\n  margin: 0 0 10px;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #5f6368;\n}\n.auth-page .onboarding-legal__text a {\n  color: #0f9d58;\n  text-decoration: underline;\n}\n.auth-page .onboarding-legal__list {\n  margin: 0 0 12px;\n  padding-left: 1.15rem;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #5f6368;\n}\n.auth-page .onboarding-consent {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #202124;\n  cursor: pointer;\n}\n.auth-page .onboarding-consent input {\n  margin-top: 3px;\n  flex-shrink: 0;\n  accent-color: #0f9d58;\n}\n.auth-page .auth-btn-primary {\n  width: 100%;\n  background: #0f9d58;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  padding: 10px 24px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n}\n.auth-page .auth-btn-primary:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page .auth-link-button--block {\n  width: 100%;\n  text-align: center;\n}\n.auth-page .auth-divider {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin: 4px 0;\n}\n.auth-page .auth-divider::before,\n.auth-page .auth-divider::after {\n  content: "";\n  flex: 1;\n  height: 1px;\n  background: #dadce0;\n}\n.auth-page .auth-divider span {\n  font-size: 12px;\n  color: #5f6368;\n  white-space: nowrap;\n}\n.auth-page .auth-oauth-btn {\n  width: 100%;\n  border: 1px solid #dadce0;\n  border-radius: 4px;\n  padding: 10px 16px;\n  font-size: 14px;\n  font-weight: 500;\n  background: #fff;\n  color: #202124;\n  cursor: pointer;\n}\n.auth-page .auth-oauth-btn:hover:not(:disabled) {\n  background: #f8f9fa;\n}\n.auth-page .auth-oauth-btn:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.onboarding-shell {\n  --onboarding-cookie-bar-space: 12.5rem;\n  display: flex;\n  flex-direction: column;\n  min-height: 100dvh;\n  min-height: 100svh;\n  position: relative;\n}\n@media (min-width: 640px) {\n  .onboarding-shell {\n    --onboarding-cookie-bar-space: 10rem;\n  }\n}\n.onboarding-shell .auth-page--onboarding .auth-page__scroll {\n  padding-bottom: calc(var(--onboarding-cookie-bar-space) + env(safe-area-inset-bottom, 0px));\n}\n.onboarding-shell--cookie-dismissed {\n  --onboarding-cookie-bar-space: 0px;\n}\n.onboarding-shell--cookie-dismissed .auth-page--onboarding .auth-page__scroll {\n  padding-bottom: env(safe-area-inset-bottom, 0px);\n}\n.onboarding-cookie-bar {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 2000;\n  pointer-events: auto;\n  touch-action: manipulation;\n  isolation: isolate;\n  max-height: min(44dvh, 17rem);\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  border-top: 1px solid #dadce0;\n  background: rgba(255, 255, 255, 0.98);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.1);\n  padding: 0 calc(16px + env(safe-area-inset-right, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)) calc(16px + env(safe-area-inset-left, 0px));\n}\n@media (min-width: 640px) {\n  .onboarding-cookie-bar {\n    max-height: none;\n  }\n}\n.onboarding-cookie-bar__inner {\n  max-width: 480px;\n  margin: 0 auto;\n  padding-top: 12px;\n}\n.onboarding-cookie-bar__title {\n  margin: 0 0 6px;\n  font-size: 14px;\n  font-weight: 600;\n  color: #202124;\n}\n.onboarding-cookie-bar__text {\n  margin: 0 0 6px;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #5f6368;\n}\n.onboarding-cookie-bar__link {\n  color: #0f9d58;\n  font-weight: 500;\n  text-decoration: underline;\n}\n.onboarding-cookie-bar__hint {\n  margin: 0 0 10px;\n  font-size: 12px;\n  line-height: 1.4;\n  color: #80868b;\n}\n.onboarding-cookie-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.onboarding-cookie-btn {\n  flex: 1 1 auto;\n  min-width: 7rem;\n  border: 1px solid #dadce0;\n  border-radius: 6px;\n  padding: 8px 12px;\n  font-size: 13px;\n  font-weight: 500;\n  background: #fff;\n  color: #202124;\n  cursor: pointer;\n  pointer-events: auto;\n  transition:\n    border-color 0.15s ease,\n    background 0.15s ease,\n    color 0.15s ease,\n    box-shadow 0.15s ease;\n}\n.onboarding-cookie-btn:hover {\n  border-color: #0f9d58;\n}\n.onboarding-cookie-btn:active {\n  transform: scale(0.98);\n}\n.onboarding-cookie-btn--accept {\n  border-color: #0f9d58;\n  background: #0f9d58;\n  color: #fff;\n}\n.onboarding-cookie-btn--accept:hover {\n  background: #0b8043;\n  border-color: #0b8043;\n}\n.onboarding-cookie-btn--muted {\n  color: #5f6368;\n  background: #fff;\n}\n.onboarding-cookie-btn--active {\n  border-color: #0f9d58;\n  box-shadow: 0 0 0 1px #0f9d58;\n  color: #0f9d58;\n}\n.onboarding-cookie-btn--accept.onboarding-cookie-btn--active {\n  background: #0b8043;\n  border-color: #0b8043;\n  color: #fff;\n  box-shadow: 0 0 0 1px #0b8043;\n}\n/*# sourceMappingURL=auth.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OnboardingComponent, { className: "OnboardingComponent", filePath: "app/features/auth/onboarding.component.ts", lineNumber: 43 });
})();
export {
  OnboardingComponent
};
//# sourceMappingURL=chunk-QRAH373Y.js.map
