import {
  SETUP_TAX_MODES,
  canPurchaseSubscription,
  isTaxModeConfigured,
  normalizeTaxMode,
  subscriptionStatusLabel
} from "./chunk-6SYJUHTI.js";
import {
  UserProfileSettingsService
} from "./chunk-Z5SJQJWJ.js";
import {
  AppSelectComponent
} from "./chunk-VZTTL7NS.js";
import {
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
import {
  AppDialogComponent
} from "./chunk-FZY3AIGP.js";
import "./chunk-JKSU2LPC.js";
import "./chunk-MFN2ATQX.js";
import "./chunk-Z5FPAOY7.js";
import {
  UserService
} from "./chunk-ODVTALVQ.js";
import {
  AuthService
} from "./chunk-VVVNTCL2.js";
import "./chunk-ZSKR65RV.js";
import {
  Router,
  RouterLink
} from "./chunk-HPUTEZXI.js";
import {
  Component,
  I18nService,
  computed,
  inject,
  setClassMetadata,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-27NINFBT.js";

// src/app/features/account/account-profile.component.ts
function AccountProfileComponent_Conditional_0_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 5);
  }
}
function AccountProfileComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "span", 2);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 3);
    \u0275\u0275element(4, "span", 4);
    \u0275\u0275repeaterCreate(5, AccountProfileComponent_Conditional_0_For_6_Template, 1, 0, "span", 5, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275element(7, "span", 6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.sharedUi().loadingContent);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.sharedUi().loadingContent);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.skeletonFieldSlots);
  }
}
function AccountProfileComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function AccountProfileComponent_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().saved);
  }
}
function AccountProfileComponent_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 10);
  }
  if (rf & 2) {
    \u0275\u0275property("value", ctx);
  }
}
function AccountProfileComponent_Conditional_1_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h3", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "fieldset", 23)(3, "div", 12)(4, "input", 24);
    \u0275\u0275twoWayListener("ngModelChange", function AccountProfileComponent_Conditional_1_Conditional_19_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.currentPassword, $event) || (ctx_r0.currentPassword = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "label");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 12)(8, "input", 25);
    \u0275\u0275twoWayListener("ngModelChange", function AccountProfileComponent_Conditional_1_Conditional_19_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.newPassword, $event) || (ctx_r0.newPassword = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "label");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 12)(12, "input", 26);
    \u0275\u0275twoWayListener("ngModelChange", function AccountProfileComponent_Conditional_1_Conditional_19_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.confirmPassword, $event) || (ctx_r0.confirmPassword = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "label");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().passwordSection);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.currentPassword);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().currentPassword);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newPassword);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().newPassword);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.confirmPassword);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().confirmPassword);
  }
}
function AccountProfileComponent_Conditional_1_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 28)(3, "app-select", 29);
    \u0275\u0275listener("ngModelChange", function AccountProfileComponent_Conditional_1_Conditional_34_Template_app_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onTaxModePick($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "label");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().taxModeRequiredHint);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r0.taxModeSelectValue)("options", ctx_r0.taxModeSelectOptions());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().taxMode);
  }
}
function AccountProfileComponent_Conditional_1_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 30)(1, "span", 18);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "p", 19);
    \u0275\u0275text(6);
    \u0275\u0275elementStart(7, "a", 31);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().taxMode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.taxModeLabel(ctx_r0.tax_mode));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.accountUi().taxModeLockedHintBefore, " ");
    \u0275\u0275advance();
    \u0275\u0275property("href", ctx_r0.supportMailto(), \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().taxSupportEmail);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r0.i18n.accountUi().taxModeLockedHintAfter, " ");
  }
}
function AccountProfileComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, AccountProfileComponent_Conditional_1_Conditional_0_Template, 2, 1, "p", 7);
    \u0275\u0275conditionalCreate(1, AccountProfileComponent_Conditional_1_Conditional_1_Template, 2, 1, "p", 8);
    \u0275\u0275elementStart(2, "form", 9);
    \u0275\u0275listener("ngSubmit", function AccountProfileComponent_Conditional_1_Template_form_ngSubmit_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.save());
    });
    \u0275\u0275conditionalCreate(3, AccountProfileComponent_Conditional_1_Conditional_3_Template, 1, 1, "input", 10);
    \u0275\u0275elementStart(4, "section", 11)(5, "div", 12)(6, "input", 13);
    \u0275\u0275twoWayListener("ngModelChange", function AccountProfileComponent_Conditional_1_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.firstName, $event) || (ctx_r0.firstName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "label");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 12)(10, "input", 14);
    \u0275\u0275twoWayListener("ngModelChange", function AccountProfileComponent_Conditional_1_Template_input_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.lastName, $event) || (ctx_r0.lastName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "label");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "h3", 15);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 12)(16, "input", 16);
    \u0275\u0275twoWayListener("ngModelChange", function AccountProfileComponent_Conditional_1_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.newEmail, $event) || (ctx_r0.newEmail = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "label");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(19, AccountProfileComponent_Conditional_1_Conditional_19_Template, 15, 7);
    \u0275\u0275elementStart(20, "h3", 15);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "p", 17)(23, "span", 18);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "strong");
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "p", 19);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "div", 20)(30, "a", 21);
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "h3", 15);
    \u0275\u0275text(33);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(34, AccountProfileComponent_Conditional_1_Conditional_34_Template, 6, 4)(35, AccountProfileComponent_Conditional_1_Conditional_35_Template, 10, 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "button", 22);
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.error() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.saved() ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_3_0 = (tmp_3_0 = ctx_r0.profile()) == null ? null : tmp_3_0.email) ? 3 : -1, tmp_3_0);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.firstName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().firstName);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.lastName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().lastName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().emailSection);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newEmail);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().newEmail);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.showPasswordSection() ? 19 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().subscriptionSection);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().subscriptionStatus);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.subscriptionLabel());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().subscriptionManagedByPayment);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.nav().pricing, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().taxSection);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.taxModeConfigured() ? 34 : 35);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.saving());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.saving() ? ctx_r0.i18n.accountUi().saving : ctx_r0.i18n.accountUi().save, " ");
  }
}
var AccountProfileComponent = class _AccountProfileComponent {
  userSvc = inject(UserService);
  authSvc = inject(AuthService);
  router = inject(Router);
  profileSettings = inject(UserProfileSettingsService);
  i18n = inject(I18nService);
  skeletonFieldSlots = [0, 1, 2, 3];
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : (
    /* istanbul ignore next */
    []
  ));
  saved = signal(false, ...ngDevMode ? [{ debugName: "saved" }] : (
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
  taxConfirmOpen = signal(false, ...ngDevMode ? [{ debugName: "taxConfirmOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  pendingTaxMode = signal(null, ...ngDevMode ? [{ debugName: "pendingTaxMode" }] : (
    /* istanbul ignore next */
    []
  ));
  firstName = "";
  lastName = "";
  newEmail = "";
  currentPassword = "";
  newPassword = "";
  confirmPassword = "";
  tax_mode = "none";
  /** Значение селекта (синхронизируется после подтверждения в модалке). */
  taxModeSelectValue = "none";
  subscription_status = "free";
  taxModeConfigured = computed(() => {
    const profile = this.profile();
    return profile?.tax_mode_configured ?? isTaxModeConfigured(profile?.tax_mode ?? this.tax_mode);
  }, ...ngDevMode ? [{ debugName: "taxModeConfigured" }] : (
    /* istanbul ignore next */
    []
  ));
  canBuySubscription = computed(() => canPurchaseSubscription(this.profile()), ...ngDevMode ? [{ debugName: "canBuySubscription" }] : (
    /* istanbul ignore next */
    []
  ));
  showPasswordSection = computed(() => this.authSvc.canChangePassword(), ...ngDevMode ? [{ debugName: "showPasswordSection" }] : (
    /* istanbul ignore next */
    []
  ));
  subscriptionLabel = computed(() => {
    const t = this.i18n.accountUi();
    return subscriptionStatusLabel(this.subscription_status, {
      free: t.subscriptionFree,
      pro: t.subscriptionPro,
      trial: t.subscriptionTrial
    });
  }, ...ngDevMode ? [{ debugName: "subscriptionLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  taxModeSelectOptions = computed(() => SETUP_TAX_MODES.map((value) => ({
    value,
    label: this.i18n.taxModeLabel(value)
  })), ...ngDevMode ? [{ debugName: "taxModeSelectOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  taxModeConfirmMessage = computed(() => {
    const mode = this.pendingTaxMode();
    if (!mode) {
      return "";
    }
    const label = this.i18n.taxModeLabel(mode);
    return this.i18n.accountUi().taxModeConfirmBody.replace("{mode}", label);
  }, ...ngDevMode ? [{ debugName: "taxModeConfirmMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  supportMailto = computed(() => `mailto:${this.i18n.accountUi().taxSupportEmail}`, ...ngDevMode ? [{ debugName: "supportMailto" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    this.userSvc.getProfile().subscribe({
      next: (user) => {
        this.applyProfile(user);
        this.profileSettings.hydrate(user);
      },
      error: () => {
        this.error.set(this.i18n.accountUi().loadError);
        this.loading.set(false);
      }
    });
  }
  onTaxModePick(next) {
    const normalized = normalizeTaxMode(next);
    if (!isTaxModeConfigured(normalized)) {
      this.tax_mode = normalized;
      this.taxModeSelectValue = normalized;
      return;
    }
    if (normalized === normalizeTaxMode(this.tax_mode)) {
      this.taxModeSelectValue = normalized;
      return;
    }
    this.pendingTaxMode.set(normalized);
    this.taxConfirmOpen.set(true);
    this.taxModeSelectValue = String(this.tax_mode);
  }
  onTaxModeConfirm() {
    const pending = this.pendingTaxMode();
    if (pending) {
      this.tax_mode = pending;
      this.taxModeSelectValue = pending;
    }
    this.taxConfirmOpen.set(false);
    this.pendingTaxMode.set(null);
  }
  onTaxModeConfirmCancel() {
    this.taxConfirmOpen.set(false);
    this.pendingTaxMode.set(null);
    this.taxModeSelectValue = String(this.tax_mode);
  }
  applyProfile(user) {
    this.profile.set(user);
    this.firstName = user.first_name ?? "";
    this.lastName = user.last_name ?? "";
    if (!this.firstName && user.name) {
      const parts = user.name.trim().split(/\s+/);
      this.firstName = parts[0] ?? "";
      this.lastName = parts.slice(1).join(" ");
    }
    this.newEmail = user.email;
    this.tax_mode = user.tax_mode || "none";
    this.taxModeSelectValue = String(this.tax_mode);
    this.subscription_status = user.subscription_status || "free";
    this.loading.set(false);
  }
  save() {
    const t = this.i18n.accountUi();
    this.error.set(null);
    this.saved.set(false);
    if (this.showPasswordSection() && this.newPassword && this.newPassword !== this.confirmPassword) {
      this.error.set(t.passwordsMismatch);
      return;
    }
    const payload = {};
    const current = this.profile();
    const trimmedFirst = this.firstName.trim();
    const trimmedLast = this.lastName.trim();
    if (!current || trimmedFirst !== (current.first_name ?? "").trim() || trimmedLast !== (current.last_name ?? "").trim()) {
      payload.first_name = trimmedFirst;
      payload.last_name = trimmedLast;
    }
    if (!this.taxModeConfigured()) {
      if (!isTaxModeConfigured(this.tax_mode)) {
        this.error.set(t.taxModeRequiredHint);
        return;
      }
      payload.tax_mode = this.tax_mode;
    }
    const emailChanging = current && this.newEmail.trim() && this.newEmail.trim() !== current.email;
    const passwordChanging = this.showPasswordSection() && Boolean(this.newPassword);
    if (passwordChanging && !this.currentPassword) {
      this.error.set(t.currentPasswordRequired);
      return;
    }
    if (emailChanging && this.showPasswordSection() && !this.currentPassword) {
      this.error.set(t.currentPasswordRequired);
      return;
    }
    this.saving.set(true);
    const profileUpdate$ = () => this.userSvc.updateProfile(payload);
    const finish = (user) => {
      this.applyProfile(user);
      this.profileSettings.hydrate(user);
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
      this.saving.set(false);
      this.saved.set(true);
      if (emailChanging) {
        void this.router.navigate(["/app/verify-email-notice"]);
      }
    };
    if (passwordChanging || emailChanging && this.showPasswordSection()) {
      this.authSvc.updateCredentials({
        currentPassword: this.currentPassword,
        newEmail: emailChanging ? this.newEmail.trim() : void 0,
        newPassword: passwordChanging ? this.newPassword : void 0
      }).pipe(switchMap(() => profileUpdate$())).subscribe({
        next: (user) => finish(user),
        error: (err) => {
          this.saving.set(false);
          this.error.set(err?.message || t.saveError);
        }
      });
      return;
    }
    if (emailChanging) {
      this.authSvc.updateEmailWithGoogleReauth(this.newEmail.trim()).pipe(switchMap(() => profileUpdate$())).subscribe({
        next: (user) => finish(user),
        error: (err) => {
          this.saving.set(false);
          this.error.set(err?.message || t.saveError);
        }
      });
      return;
    }
    profileUpdate$().subscribe({
      next: (user) => finish(user),
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? t.saveError);
      }
    });
  }
  static \u0275fac = function AccountProfileComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AccountProfileComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AccountProfileComponent, selectors: [["app-account-profile"]], decls: 5, vars: 6, consts: [["role", "status", "aria-busy", "true", 1, "account-skeleton", "skeleton-page"], ["layout", "center", 3, "cancel", "confirm", "open", "title", "cancelLabel", "confirmLabel"], [1, "sr-only"], [1, "skeleton-form-card"], [1, "skeleton", "skeleton--line", "skeleton--line-lg", 2, "width", "35%"], [1, "skeleton", "skeleton--line", "skeleton--block", 2, "height", "2.75rem"], [1, "skeleton", "skeleton--btn", 2, "width", "8rem"], [1, "account-page__error"], [1, "account-page__success"], ["autocomplete", "on", 1, "account-form", 3, "ngSubmit"], ["type", "email", "name", "username", "autocomplete", "username", "tabindex", "-1", "aria-hidden", "true", "readonly", "", 1, "sr-only", 3, "value"], [1, "account-card"], [1, "field", "field--float"], ["type", "text", "name", "firstName", "placeholder", " ", "autocomplete", "given-name", "maxlength", "60", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "lastName", "placeholder", " ", "autocomplete", "family-name", "maxlength", "60", 3, "ngModelChange", "ngModel"], [1, "account-card__subtitle"], ["type", "email", "name", "email", "required", "", "placeholder", " ", "autocomplete", "email", "inputmode", "email", "spellcheck", "false", 3, "ngModelChange", "ngModel"], [1, "account-readonly", "account-readonly--plan"], [1, "account-readonly__label"], [1, "account-hint"], [1, "account-subscription-actions"], ["routerLink", "/app/pricing", 1, "btn-secondary", "account-subscription-actions__pricing"], ["type", "submit", 1, "btn-primary", "account-form__submit", 3, "disabled"], [1, "account-password-fields"], ["type", "password", "name", "currentPassword", "placeholder", " ", "autocomplete", "current-password", 3, "ngModelChange", "ngModel"], ["type", "password", "name", "newPassword", "placeholder", " ", "autocomplete", "new-password", 3, "ngModelChange", "ngModel"], ["type", "password", "name", "confirmPassword", "placeholder", " ", "autocomplete", "new-password", 3, "ngModelChange", "ngModel"], [1, "account-hint", "account-hint--warn"], [1, "field", "field--select"], ["name", "tax_mode", "menuPlacement", "below", 3, "ngModelChange", "ngModel", "options"], [1, "account-readonly"], [3, "href"]], template: function AccountProfileComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AccountProfileComponent_Conditional_0_Template, 8, 2, "div", 0)(1, AccountProfileComponent_Conditional_1_Template, 38, 20);
      \u0275\u0275elementStart(2, "app-dialog", 1);
      \u0275\u0275listener("cancel", function AccountProfileComponent_Template_app_dialog_cancel_2_listener() {
        return ctx.onTaxModeConfirmCancel();
      })("confirm", function AccountProfileComponent_Template_app_dialog_confirm_2_listener() {
        return ctx.onTaxModeConfirm();
      });
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.loading() ? 0 : 1);
      \u0275\u0275advance(2);
      \u0275\u0275property("open", ctx.taxConfirmOpen())("title", ctx.i18n.accountUi().taxModeConfirmTitle)("cancelLabel", ctx.i18n.accountUi().taxModeConfirmCancel)("confirmLabel", ctx.i18n.accountUi().taxModeConfirmConfirm);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.taxModeConfirmMessage());
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, NgModel, NgForm, AppSelectComponent, RouterLink, AppDialogComponent], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n/*# sourceMappingURL=account-page-host.css.map */", "\n.account-page__header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n}\n.account-page__hint[_ngcontent-%COMP%], \n.account-page__error[_ngcontent-%COMP%], \n.account-page__success[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  font-size: 0.875rem;\n}\n.account-page__error[_ngcontent-%COMP%] {\n  color: rgb(220, 38, 38);\n}\n.account-page__success[_ngcontent-%COMP%] {\n  color: rgb(5, 150, 105);\n}\n.account-password-fields[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  min-width: 0;\n}\n.account-skeleton[_ngcontent-%COMP%] {\n  margin-top: 0.5rem;\n}\n.account-setting[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.account-setting[_ngcontent-%COMP%]    + .account-setting[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  padding-top: 1rem;\n  border-top: 1px solid var(--nav-border);\n}\n.account-setting__label[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.account-langs[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.5rem;\n}\n@media (min-width: 400px) {\n  .account-langs[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n}\n.account-lang-btn[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.375rem;\n  padding: 0.625rem 0.5rem;\n  border: 1px solid rgb(226, 232, 240);\n  border-radius: 0.75rem;\n  background: rgb(248, 250, 252);\n  cursor: pointer;\n  transition: background-color 0.15s ease, border-color 0.15s ease;\n}\n.account-lang-btn[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  border-radius: 2px;\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);\n}\n.account-lang-btn__name[_ngcontent-%COMP%] {\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n  text-align: center;\n  line-height: 1.2;\n}\n.account-lang-btn[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n}\n.account-lang-btn--active[_ngcontent-%COMP%] {\n  border-color: var(--nav-accent);\n  background: var(--nav-active-bg);\n}\n.account-lang-btn--active[_ngcontent-%COMP%]   .account-lang-btn__name[_ngcontent-%COMP%] {\n  color: var(--nav-accent);\n}\n.account-theme-btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.625rem;\n  padding: 0.625rem 1rem;\n  border: 1px solid rgb(226, 232, 240);\n  border-radius: 1rem;\n  background: rgb(248, 250, 252);\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  cursor: pointer;\n  transition: background-color 0.15s ease, border-color 0.15s ease;\n}\n.account-theme-btn[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n  border-color: rgb(203, 213, 225);\n}\n.account-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.account-card[_ngcontent-%COMP%] {\n  padding: 1rem 1.125rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.account-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 0.875rem;\n  font-size: 1rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.account-card__subtitle[_ngcontent-%COMP%] {\n  margin: 1rem 0 0.625rem;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n}\n.account-card__subtitle[_ngcontent-%COMP%]:first-of-type {\n  margin-top: 0;\n}\n.field--select[_ngcontent-%COMP%]   app-select[_ngcontent-%COMP%] {\n  display: block;\n}\n.account-hint[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  font-size: 0.8125rem;\n  line-height: 1.4;\n  color: var(--text-secondary);\n}\n.account-hint[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--nav-accent);\n  font-weight: 500;\n  text-decoration: underline;\n  text-underline-offset: 2px;\n}\n.account-hint--warn[_ngcontent-%COMP%] {\n  color: rgb(180, 83, 9);\n}\n.account-hint--muted[_ngcontent-%COMP%] {\n  margin-top: 0.25rem;\n  font-size: 0.75rem;\n  opacity: 0.9;\n}\n.account-pricing-country[_ngcontent-%COMP%] {\n  margin-bottom: 0.75rem;\n}\n.account-readonly[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.375rem 0.75rem;\n  margin: 0 0 0.5rem;\n  font-size: 0.875rem;\n  color: var(--text-primary);\n}\n.account-readonly--plan[_ngcontent-%COMP%] {\n  margin-bottom: 0.375rem;\n}\n.account-readonly__label[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n  font-weight: 500;\n}\n.account-learn-more[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin: 0 0 0.75rem;\n  padding: 0;\n  border: none;\n  background: none;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--nav-accent);\n  text-decoration: underline;\n  text-underline-offset: 2px;\n  cursor: pointer;\n}\n.account-learn-more[_ngcontent-%COMP%]:hover {\n  opacity: 0.85;\n}\n.subscription-modal[_ngcontent-%COMP%] {\n  text-align: left;\n}\n.subscription-modal__intro[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  font-size: 0.875rem;\n  line-height: 1.45;\n  color: var(--text-primary);\n}\n.subscription-modal__features[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  padding-left: 1.125rem;\n  font-size: 0.8125rem;\n  line-height: 1.5;\n  color: var(--text-secondary);\n}\n.subscription-modal__features[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]    + li[_ngcontent-%COMP%] {\n  margin-top: 0.25rem;\n}\n.subscription-modal__country[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n}\n.subscription-modal__prices[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0.75rem;\n}\n.subscription-modal__price[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  padding: 0.75rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  background: rgba(248, 250, 252, 0.6);\n}\n.subscription-modal__price[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  color: var(--text-primary);\n}\n.subscription-modal__price-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.account-subscription-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n  margin: 0 0 1rem;\n}\n.account-subscription-actions__pricing[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  text-decoration: none;\n}\n.account-mobile-logout[_ngcontent-%COMP%] {\n  display: none;\n  margin-top: 1.5rem;\n  padding-top: 1.25rem;\n  border-top: 1px solid var(--nav-border);\n}\n@media (max-width: 768px), (max-height: 440px) {\n  .account-mobile-logout[_ngcontent-%COMP%] {\n    display: block;\n    margin-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));\n  }\n}\n.account-logout-btn[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.75rem 1rem;\n  border: 1px solid rgba(197, 48, 48, 0.35);\n  border-radius: 0.5rem;\n  background: rgba(254, 242, 242, 0.8);\n  color: #c5221f;\n  font-size: 0.9375rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.15s;\n}\n.account-logout-btn[_ngcontent-%COMP%]:hover {\n  background: #fce8e6;\n}\n.account-form__submit[_ngcontent-%COMP%] {\n  align-self: flex-start;\n  margin-top: 0.25rem;\n  margin-left: auto;\n}\n.account-lang-btn__flag-wrap[_ngcontent-%COMP%] {\n  display: block;\n  width: 28px;\n  height: 14px;\n}\n.account-workspace[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  padding-top: 1rem;\n  border-top: 1px solid var(--nav-border);\n}\n.account-workspace--page[_ngcontent-%COMP%] {\n  margin-top: 0;\n  padding-top: 0;\n  border-top: none;\n}\n.account-workspace__head[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 0.5rem;\n  margin-top: 0.75rem;\n}\n.account-workspace__title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.875rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.account-workspace__title--hours[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  margin-bottom: 0.625rem;\n}\n.account-workspace__status[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n}\n.account-workspace__status--ok[_ngcontent-%COMP%] {\n  color: rgb(5, 150, 105);\n}\n.account-workspace__grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.75rem;\n  grid-template-columns: 1fr;\n}\n@media (min-width: 640px) {\n  .account-workspace__grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1.4fr 0.8fr 0.8fr;\n    align-items: stretch;\n  }\n}\n.account-workspace__name[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.account-workspace__hours-row[_ngcontent-%COMP%] {\n  display: grid;\n  align-items: stretch;\n  gap: 0.75rem;\n  grid-template-columns: 1fr 1fr;\n}\n@media (min-width: 480px) {\n  .account-workspace__hours-row[_ngcontent-%COMP%] {\n    max-width: 20rem;\n  }\n}\n.account-workspace__hour[_ngcontent-%COMP%], \n.account-workspace__duration[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n  min-width: 0;\n}\n.account-workspace__days-label[_ngcontent-%COMP%] {\n  margin: 0.75rem 0 0.5rem;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.account-workspace__days[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.375rem;\n}\n.account-workspace__day[_ngcontent-%COMP%] {\n  min-width: 2.5rem;\n  padding: 0.45rem 0.55rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  background: var(--page-bg);\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n  cursor: pointer;\n  transition:\n    background-color 0.15s ease,\n    border-color 0.15s ease,\n    color 0.15s ease;\n}\n.account-workspace__day[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n}\n.account-workspace__day--active[_ngcontent-%COMP%] {\n  border-color: var(--nav-accent);\n  background: var(--nav-active-bg);\n  color: var(--nav-accent);\n}\n/*# sourceMappingURL=account.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AccountProfileComponent, [{
    type: Component,
    args: [{ selector: "app-account-profile", standalone: true, imports: [FormsModule, AppSelectComponent, RouterLink, AppDialogComponent], template: '@if (loading()) {\r\n  <div\r\n    class="account-skeleton skeleton-page"\r\n    role="status"\r\n    aria-busy="true"\r\n    [attr.aria-label]="i18n.sharedUi().loadingContent"\r\n  >\r\n    <span class="sr-only">{{ i18n.sharedUi().loadingContent }}</span>\r\n    <div class="skeleton-form-card">\r\n      <span class="skeleton skeleton--line skeleton--line-lg" style="width: 35%"></span>\r\n      @for (i of skeletonFieldSlots; track i) {\r\n        <span class="skeleton skeleton--line skeleton--block" style="height: 2.75rem"></span>\r\n      }\r\n      <span class="skeleton skeleton--btn" style="width: 8rem"></span>\r\n    </div>\r\n  </div>\r\n} @else {\r\n  @if (error()) {\r\n    <p class="account-page__error">{{ error() }}</p>\r\n  }\r\n\r\n  @if (saved()) {\r\n    <p class="account-page__success">{{ i18n.accountUi().saved }}</p>\r\n  }\r\n\r\n  <form class="account-form" (ngSubmit)="save()" autocomplete="on">\r\n    @if (profile()?.email; as accountEmail) {\r\n      <input\r\n        type="email"\r\n        name="username"\r\n        class="sr-only"\r\n        [value]="accountEmail"\r\n        autocomplete="username"\r\n        tabindex="-1"\r\n        aria-hidden="true"\r\n        readonly\r\n      />\r\n    }\r\n\r\n    <section class="account-card">\r\n      <div class="field field--float">\r\n        <input\r\n          type="text"\r\n          [(ngModel)]="firstName"\r\n          name="firstName"\r\n          placeholder=" "\r\n          autocomplete="given-name"\r\n          maxlength="60"\r\n        />\r\n        <label>{{ i18n.accountUi().firstName }}</label>\r\n      </div>\r\n\r\n      <div class="field field--float">\r\n        <input\r\n          type="text"\r\n          [(ngModel)]="lastName"\r\n          name="lastName"\r\n          placeholder=" "\r\n          autocomplete="family-name"\r\n          maxlength="60"\r\n        />\r\n        <label>{{ i18n.accountUi().lastName }}</label>\r\n      </div>\r\n\r\n      <h3 class="account-card__subtitle">{{ i18n.accountUi().emailSection }}</h3>\r\n\r\n      <div class="field field--float">\r\n        <input\r\n          type="email"\r\n          [(ngModel)]="newEmail"\r\n          name="email"\r\n          required\r\n          placeholder=" "\r\n          autocomplete="email"\r\n          inputmode="email"\r\n          spellcheck="false"\r\n        />\r\n        <label>{{ i18n.accountUi().newEmail }}</label>\r\n      </div>\r\n\r\n      @if (showPasswordSection()) {\r\n        <h3 class="account-card__subtitle">{{ i18n.accountUi().passwordSection }}</h3>\r\n\r\n        <fieldset class="account-password-fields">\r\n          <div class="field field--float">\r\n            <input\r\n              type="password"\r\n              [(ngModel)]="currentPassword"\r\n              name="currentPassword"\r\n              placeholder=" "\r\n              autocomplete="current-password"\r\n            />\r\n            <label>{{ i18n.accountUi().currentPassword }}</label>\r\n          </div>\r\n\r\n          <div class="field field--float">\r\n            <input\r\n              type="password"\r\n              [(ngModel)]="newPassword"\r\n              name="newPassword"\r\n              placeholder=" "\r\n              autocomplete="new-password"\r\n            />\r\n            <label>{{ i18n.accountUi().newPassword }}</label>\r\n          </div>\r\n\r\n          <div class="field field--float">\r\n            <input\r\n              type="password"\r\n              [(ngModel)]="confirmPassword"\r\n              name="confirmPassword"\r\n              placeholder=" "\r\n              autocomplete="new-password"\r\n            />\r\n            <label>{{ i18n.accountUi().confirmPassword }}</label>\r\n          </div>\r\n        </fieldset>\r\n      }\r\n\r\n      <h3 class="account-card__subtitle">{{ i18n.accountUi().subscriptionSection }}</h3>\r\n\r\n      <p class="account-readonly account-readonly--plan">\r\n        <span class="account-readonly__label">{{ i18n.accountUi().subscriptionStatus }}</span>\r\n        <strong>{{ subscriptionLabel() }}</strong>\r\n      </p>\r\n\r\n      <p class="account-hint">{{ i18n.accountUi().subscriptionManagedByPayment }}</p>\r\n\r\n      <div class="account-subscription-actions">\r\n        <a routerLink="/app/pricing" class="btn-secondary account-subscription-actions__pricing">\r\n          {{ i18n.nav().pricing }}\r\n        </a>\r\n      </div>\r\n\r\n      <h3 class="account-card__subtitle">{{ i18n.accountUi().taxSection }}</h3>\r\n\r\n      @if (!taxModeConfigured()) {\r\n        <p class="account-hint account-hint--warn">{{ i18n.accountUi().taxModeRequiredHint }}</p>\r\n\r\n        <div class="field field--select">\r\n          <app-select\r\n            name="tax_mode"\r\n            [ngModel]="taxModeSelectValue"\r\n            (ngModelChange)="onTaxModePick($event)"\r\n            [options]="taxModeSelectOptions()"\r\n            menuPlacement="below"\r\n          />\r\n          <label>{{ i18n.accountUi().taxMode }}</label>\r\n        </div>\r\n      } @else {\r\n        <p class="account-readonly">\r\n          <span class="account-readonly__label">{{ i18n.accountUi().taxMode }}</span>\r\n          <strong>{{ i18n.taxModeLabel(tax_mode) }}</strong>\r\n        </p>\r\n        <p class="account-hint">\r\n          {{ i18n.accountUi().taxModeLockedHintBefore }}\r\n          <a [href]="supportMailto()">{{ i18n.accountUi().taxSupportEmail }}</a>{{ i18n.accountUi().taxModeLockedHintAfter }}\r\n        </p>\r\n      }\r\n    </section>\r\n\r\n    <button type="submit" class="btn-primary account-form__submit" [disabled]="saving()">\r\n      {{ saving() ? i18n.accountUi().saving : i18n.accountUi().save }}\r\n    </button>\r\n  </form>\r\n}\r\n\r\n<app-dialog\r\n  [open]="taxConfirmOpen()"\r\n  [title]="i18n.accountUi().taxModeConfirmTitle"\r\n  [cancelLabel]="i18n.accountUi().taxModeConfirmCancel"\r\n  [confirmLabel]="i18n.accountUi().taxModeConfirmConfirm"\r\n  layout="center"\r\n  (cancel)="onTaxModeConfirmCancel()"\r\n  (confirm)="onTaxModeConfirm()"\r\n>\r\n  <p>{{ taxModeConfirmMessage() }}</p>\r\n</app-dialog>\r\n', styles: ["/* src/app/features/account/account-page-host.scss */\n:host {\n  display: block;\n  width: 100%;\n}\n/*# sourceMappingURL=account-page-host.css.map */\n", "/* src/app/features/account/account.component.scss */\n.account-page__header h1 {\n  font-size: 1.5rem;\n  font-weight: 700;\n}\n.account-page__hint,\n.account-page__error,\n.account-page__success {\n  margin: 0 0 1rem;\n  font-size: 0.875rem;\n}\n.account-page__error {\n  color: rgb(220, 38, 38);\n}\n.account-page__success {\n  color: rgb(5, 150, 105);\n}\n.account-password-fields {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  min-width: 0;\n}\n.account-skeleton {\n  margin-top: 0.5rem;\n}\n.account-setting {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.account-setting + .account-setting {\n  margin-top: 1rem;\n  padding-top: 1rem;\n  border-top: 1px solid var(--nav-border);\n}\n.account-setting__label {\n  margin: 0;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.account-langs {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.5rem;\n}\n@media (min-width: 400px) {\n  .account-langs {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n}\n.account-lang-btn {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.375rem;\n  padding: 0.625rem 0.5rem;\n  border: 1px solid rgb(226, 232, 240);\n  border-radius: 0.75rem;\n  background: rgb(248, 250, 252);\n  cursor: pointer;\n  transition: background-color 0.15s ease, border-color 0.15s ease;\n}\n.account-lang-btn img {\n  display: block;\n  border-radius: 2px;\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);\n}\n.account-lang-btn__name {\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n  text-align: center;\n  line-height: 1.2;\n}\n.account-lang-btn:hover {\n  background: var(--nav-hover);\n}\n.account-lang-btn--active {\n  border-color: var(--nav-accent);\n  background: var(--nav-active-bg);\n}\n.account-lang-btn--active .account-lang-btn__name {\n  color: var(--nav-accent);\n}\n.account-theme-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.625rem;\n  padding: 0.625rem 1rem;\n  border: 1px solid rgb(226, 232, 240);\n  border-radius: 1rem;\n  background: rgb(248, 250, 252);\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  cursor: pointer;\n  transition: background-color 0.15s ease, border-color 0.15s ease;\n}\n.account-theme-btn:hover {\n  background: var(--nav-hover);\n  border-color: rgb(203, 213, 225);\n}\n.account-form {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.account-card {\n  padding: 1rem 1.125rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.account-card h2 {\n  margin: 0 0 0.875rem;\n  font-size: 1rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.account-card__subtitle {\n  margin: 1rem 0 0.625rem;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n}\n.account-card__subtitle:first-of-type {\n  margin-top: 0;\n}\n.field--select app-select {\n  display: block;\n}\n.account-hint {\n  margin: 0 0 0.75rem;\n  font-size: 0.8125rem;\n  line-height: 1.4;\n  color: var(--text-secondary);\n}\n.account-hint a {\n  color: var(--nav-accent);\n  font-weight: 500;\n  text-decoration: underline;\n  text-underline-offset: 2px;\n}\n.account-hint--warn {\n  color: rgb(180, 83, 9);\n}\n.account-hint--muted {\n  margin-top: 0.25rem;\n  font-size: 0.75rem;\n  opacity: 0.9;\n}\n.account-pricing-country {\n  margin-bottom: 0.75rem;\n}\n.account-readonly {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.375rem 0.75rem;\n  margin: 0 0 0.5rem;\n  font-size: 0.875rem;\n  color: var(--text-primary);\n}\n.account-readonly--plan {\n  margin-bottom: 0.375rem;\n}\n.account-readonly__label {\n  color: var(--text-secondary);\n  font-weight: 500;\n}\n.account-learn-more {\n  display: inline-block;\n  margin: 0 0 0.75rem;\n  padding: 0;\n  border: none;\n  background: none;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--nav-accent);\n  text-decoration: underline;\n  text-underline-offset: 2px;\n  cursor: pointer;\n}\n.account-learn-more:hover {\n  opacity: 0.85;\n}\n.subscription-modal {\n  text-align: left;\n}\n.subscription-modal__intro {\n  margin: 0 0 0.75rem;\n  font-size: 0.875rem;\n  line-height: 1.45;\n  color: var(--text-primary);\n}\n.subscription-modal__features {\n  margin: 0 0 1rem;\n  padding-left: 1.125rem;\n  font-size: 0.8125rem;\n  line-height: 1.5;\n  color: var(--text-secondary);\n}\n.subscription-modal__features li + li {\n  margin-top: 0.25rem;\n}\n.subscription-modal__country {\n  margin: 0 0 0.75rem;\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n}\n.subscription-modal__prices {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0.75rem;\n}\n.subscription-modal__price {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  padding: 0.75rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  background: rgba(248, 250, 252, 0.6);\n}\n.subscription-modal__price strong {\n  font-size: 1.125rem;\n  color: var(--text-primary);\n}\n.subscription-modal__price-label {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.account-subscription-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n  margin: 0 0 1rem;\n}\n.account-subscription-actions__pricing {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  text-decoration: none;\n}\n.account-mobile-logout {\n  display: none;\n  margin-top: 1.5rem;\n  padding-top: 1.25rem;\n  border-top: 1px solid var(--nav-border);\n}\n@media (max-width: 768px), (max-height: 440px) {\n  .account-mobile-logout {\n    display: block;\n    margin-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));\n  }\n}\n.account-logout-btn {\n  width: 100%;\n  padding: 0.75rem 1rem;\n  border: 1px solid rgba(197, 48, 48, 0.35);\n  border-radius: 0.5rem;\n  background: rgba(254, 242, 242, 0.8);\n  color: #c5221f;\n  font-size: 0.9375rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.15s;\n}\n.account-logout-btn:hover {\n  background: #fce8e6;\n}\n.account-form__submit {\n  align-self: flex-start;\n  margin-top: 0.25rem;\n  margin-left: auto;\n}\n.account-lang-btn__flag-wrap {\n  display: block;\n  width: 28px;\n  height: 14px;\n}\n.account-workspace {\n  margin-top: 1rem;\n  padding-top: 1rem;\n  border-top: 1px solid var(--nav-border);\n}\n.account-workspace--page {\n  margin-top: 0;\n  padding-top: 0;\n  border-top: none;\n}\n.account-workspace__head {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 0.5rem;\n  margin-top: 0.75rem;\n}\n.account-workspace__title {\n  margin: 0;\n  font-size: 0.875rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.account-workspace__title--hours {\n  margin-top: 1rem;\n  margin-bottom: 0.625rem;\n}\n.account-workspace__status {\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n}\n.account-workspace__status--ok {\n  color: rgb(5, 150, 105);\n}\n.account-workspace__grid {\n  display: grid;\n  gap: 0.75rem;\n  grid-template-columns: 1fr;\n}\n@media (min-width: 640px) {\n  .account-workspace__grid {\n    grid-template-columns: 1.4fr 0.8fr 0.8fr;\n    align-items: stretch;\n  }\n}\n.account-workspace__name {\n  min-width: 0;\n}\n.account-workspace__hours-row {\n  display: grid;\n  align-items: stretch;\n  gap: 0.75rem;\n  grid-template-columns: 1fr 1fr;\n}\n@media (min-width: 480px) {\n  .account-workspace__hours-row {\n    max-width: 20rem;\n  }\n}\n.account-workspace__hour,\n.account-workspace__duration {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n  min-width: 0;\n}\n.account-workspace__days-label {\n  margin: 0.75rem 0 0.5rem;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.account-workspace__days {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.375rem;\n}\n.account-workspace__day {\n  min-width: 2.5rem;\n  padding: 0.45rem 0.55rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  background: var(--page-bg);\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n  cursor: pointer;\n  transition:\n    background-color 0.15s ease,\n    border-color 0.15s ease,\n    color 0.15s ease;\n}\n.account-workspace__day:hover {\n  background: var(--nav-hover);\n}\n.account-workspace__day--active {\n  border-color: var(--nav-accent);\n  background: var(--nav-active-bg);\n  color: var(--nav-accent);\n}\n/*# sourceMappingURL=account.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AccountProfileComponent, { className: "AccountProfileComponent", filePath: "app/features/account/account-profile.component.ts", lineNumber: 27 });
})();
export {
  AccountProfileComponent
};
//# sourceMappingURL=chunk-Q5MIFB2P.js.map
