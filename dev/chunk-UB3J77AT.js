import {
  AppSelectComponent
} from "./chunk-VZTTL7NS.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3XYGRFFE.js";
import {
  AppDialogComponent
} from "./chunk-FZY3AIGP.js";
import "./chunk-JKSU2LPC.js";
import "./chunk-MFN2ATQX.js";
import "./chunk-Z5FPAOY7.js";
import {
  apiUrl
} from "./chunk-EWPFDTJG.js";
import {
  Component,
  DatePipe,
  HttpClient,
  I18nService,
  Injectable,
  __spreadValues,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-27NINFBT.js";

// src/app/core/services/admin.service.ts
var API = apiUrl("admin");
var AdminService = class _AdminService {
  http = inject(HttpClient);
  getStats() {
    return this.http.get(`${API}/stats`);
  }
  getUsers() {
    return this.http.get(`${API}/users`);
  }
  updateSubscription(userId, payload) {
    return this.http.put(`${API}/users/${userId}/subscription`, payload);
  }
  grantTrial(userId, trialEndsAt) {
    return this.http.post(`${API}/users/${userId}/grant-trial`, {
      trial_ends_at: trialEndsAt
    });
  }
  static \u0275fac = function AdminService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminService, factory: _AdminService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/admin/admin-dashboard.component.ts
var _forTrack0 = ($index, $item) => $item._id;
function AdminDashboardComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.loadError());
  }
}
function AdminDashboardComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.actionMessage());
  }
}
function AdminDashboardComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.actionError());
  }
}
function AdminDashboardComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.t().loading);
  }
}
function AdminDashboardComponent_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 8)(1, "article", 12)(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong", 14);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "article", 12)(7, "span", 13);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "strong", 14);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "article", 12)(12, "span", 13);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "strong", 14);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "article", 15)(17, "span", 13);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "strong", 16);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 17);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const s_r2 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t().metricTotalUsers);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r2.totalUsers);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t().metricPaidUsers);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r2.paidUsers);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t().metricConversion);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", s_r2.conversionPercent, "%");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t().metricRevenue);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.revenueLabel());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t().revenueHint);
  }
}
function AdminDashboardComponent_Conditional_9_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 18);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t().noUsers);
  }
}
function AdminDashboardComponent_Conditional_9_Conditional_15_For_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.t().trialEndsUntil, " ", \u0275\u0275pipeBind2(2, 2, user_r4.trial_ends_at, "dd.MM.yyyy"), " ");
  }
}
function AdminDashboardComponent_Conditional_9_Conditional_15_For_1_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "date");
  }
  if (rf & 2) {
    const user_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(1, 1, user_r4.createdAt, "dd.MM.yyyy HH:mm"), " ");
  }
}
function AdminDashboardComponent_Conditional_9_Conditional_15_For_1_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u2014 ");
  }
}
function AdminDashboardComponent_Conditional_9_Conditional_15_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "div", 19)(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, AdminDashboardComponent_Conditional_9_Conditional_15_For_1_Conditional_7_Template, 3, 5, "span", 20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275conditionalCreate(9, AdminDashboardComponent_Conditional_9_Conditional_15_For_1_Conditional_9_Template, 2, 4)(10, AdminDashboardComponent_Conditional_9_Conditional_15_For_1_Conditional_10_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 21)(12, "div", 22)(13, "button", 23);
    \u0275\u0275listener("click", function AdminDashboardComponent_Conditional_9_Conditional_15_For_1_Template_button_click_13_listener() {
      const user_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openEdit(user_r4));
    });
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 24);
    \u0275\u0275listener("click", function AdminDashboardComponent_Conditional_9_Conditional_15_For_1_Template_button_click_15_listener() {
      const user_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.giftTrial(user_r4));
    });
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const user_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-label", ctx_r0.t().tableEmail);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(user_r4.email);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-label", ctx_r0.t().tableStatus);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r0.statusClass(user_r4.subscription_status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.statusLabel(user_r4.subscription_status), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(user_r4.subscription_status === "trial" && user_r4.trial_ends_at ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-label", ctx_r0.t().tableRegistered);
    \u0275\u0275advance();
    \u0275\u0275conditional(user_r4.createdAt ? 9 : 10);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-label", ctx_r0.t().tableActions);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.t().editSubscription, " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.giftingUserId() === user_r4._id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.giftingUserId() === user_r4._id ? ctx_r0.t().giftingTrial : ctx_r0.t().giftTrial, " ");
  }
}
function AdminDashboardComponent_Conditional_9_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminDashboardComponent_Conditional_9_Conditional_15_For_1_Template, 17, 13, "tr", null, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r0.users());
  }
}
function AdminDashboardComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AdminDashboardComponent_Conditional_9_Conditional_0_Template, 23, 9, "section", 8);
    \u0275\u0275elementStart(1, "section", 9)(2, "table", 10)(3, "thead")(4, "tr")(5, "th", 11);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 11);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 11);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 11);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "tbody");
    \u0275\u0275conditionalCreate(14, AdminDashboardComponent_Conditional_9_Conditional_14_Template, 3, 1, "tr")(15, AdminDashboardComponent_Conditional_9_Conditional_15_Template, 2, 0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r0.stats()) ? 0 : -1, tmp_1_0);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.t().tableEmail);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t().tableStatus);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t().tableRegistered);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t().tableActions);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.users().length === 0 ? 14 : 15);
  }
}
function AdminDashboardComponent_Conditional_11_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "input", 29);
    \u0275\u0275listener("ngModelChange", function AdminDashboardComponent_Conditional_11_Conditional_6_Template_input_ngModelChange_2_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.editTrialEnds.set($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.t().trialEndsLabel);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.editTrialEnds());
  }
}
function AdminDashboardComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "p", 25);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "label", 26);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "app-select", 27);
    \u0275\u0275listener("ngModelChange", function AdminDashboardComponent_Conditional_11_Template_app_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onEditStatusChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, AdminDashboardComponent_Conditional_11_Conditional_6_Template, 3, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t().subscriptionField);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.editStatus())("options", ctx_r0.subscriptionOptions());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.editStatus() === "trial" ? 6 : -1);
  }
}
var TRIAL_GIFT_DAYS = 14;
var AdminDashboardComponent = class _AdminDashboardComponent {
  adminSvc = inject(AdminService);
  i18n = inject(I18nService);
  stats = signal(null, ...ngDevMode ? [{ debugName: "stats" }] : (
    /* istanbul ignore next */
    []
  ));
  users = signal([], ...ngDevMode ? [{ debugName: "users" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  loadError = signal(null, ...ngDevMode ? [{ debugName: "loadError" }] : (
    /* istanbul ignore next */
    []
  ));
  giftingUserId = signal(null, ...ngDevMode ? [{ debugName: "giftingUserId" }] : (
    /* istanbul ignore next */
    []
  ));
  savingUserId = signal(null, ...ngDevMode ? [{ debugName: "savingUserId" }] : (
    /* istanbul ignore next */
    []
  ));
  actionMessage = signal(null, ...ngDevMode ? [{ debugName: "actionMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  actionError = signal(null, ...ngDevMode ? [{ debugName: "actionError" }] : (
    /* istanbul ignore next */
    []
  ));
  editOpen = signal(false, ...ngDevMode ? [{ debugName: "editOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  editingUser = signal(null, ...ngDevMode ? [{ debugName: "editingUser" }] : (
    /* istanbul ignore next */
    []
  ));
  editStatus = signal("free", ...ngDevMode ? [{ debugName: "editStatus" }] : (
    /* istanbul ignore next */
    []
  ));
  editTrialEnds = signal("", ...ngDevMode ? [{ debugName: "editTrialEnds" }] : (
    /* istanbul ignore next */
    []
  ));
  revenueLabel = computed(() => {
    const mrr = this.stats()?.estimatedMrr;
    if (!mrr || Object.keys(mrr).length === 0) {
      return "\u2014";
    }
    return Object.entries(mrr).map(([currency, amount]) => `${amount.toLocaleString()} ${currency}`).join(" \xB7 ");
  }, ...ngDevMode ? [{ debugName: "revenueLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    this.reload();
  }
  reload() {
    this.loading.set(true);
    this.loadError.set(null);
    this.adminSvc.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => this.loadError.set(this.t().loadError)
    });
    this.adminSvc.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(this.t().loadError);
        this.loading.set(false);
      }
    });
  }
  t() {
    return this.i18n.adminUi();
  }
  subscriptionOptions() {
    const labels = this.t();
    return [
      { value: "free", label: labels.statusFree },
      { value: "pro", label: labels.statusPro },
      { value: "trial", label: labels.statusTrial }
    ];
  }
  statusLabel(status) {
    const labels = this.t();
    switch (status) {
      case "pro":
        return labels.statusPro;
      case "trial":
        return labels.statusTrial;
      default:
        return labels.statusFree;
    }
  }
  statusClass(status) {
    switch (status) {
      case "pro":
        return "admin-status admin-status--pro";
      case "trial":
        return "admin-status admin-status--trial";
      default:
        return "admin-status admin-status--free";
    }
  }
  openEdit(user) {
    this.actionMessage.set(null);
    this.actionError.set(null);
    this.editingUser.set(user);
    this.editStatus.set(user.subscription_status || "free");
    this.editTrialEnds.set(this.trialEndsInputValue(user.trial_ends_at));
    this.editOpen.set(true);
  }
  closeEdit() {
    this.editOpen.set(false);
    this.editingUser.set(null);
  }
  onEditStatusChange(status) {
    const next = status || "free";
    this.editStatus.set(next);
    if (next === "trial" && !this.editTrialEnds()) {
      this.editTrialEnds.set(this.defaultTrialEndsInput());
    }
  }
  saveSubscription() {
    const user = this.editingUser();
    if (!user || this.savingUserId()) {
      return;
    }
    this.actionMessage.set(null);
    this.actionError.set(null);
    this.savingUserId.set(user._id);
    const status = this.editStatus();
    this.adminSvc.updateSubscription(user._id, {
      subscription_status: status,
      trial_ends_at: status === "trial" ? this.editTrialEnds() : void 0
    }).subscribe({
      next: (res) => {
        this.applyUserUpdate(res.user);
        this.actionMessage.set(this.t().updateSubscriptionSuccess);
        this.savingUserId.set(null);
        this.closeEdit();
        this.refreshStats();
      },
      error: () => {
        this.actionError.set(this.t().updateSubscriptionError);
        this.savingUserId.set(null);
      }
    });
  }
  giftTrial(user) {
    if (this.giftingUserId() || this.savingUserId()) {
      return;
    }
    this.actionMessage.set(null);
    this.actionError.set(null);
    this.giftingUserId.set(user._id);
    this.adminSvc.grantTrial(user._id).subscribe({
      next: (res) => {
        this.applyUserUpdate(res.user);
        this.actionMessage.set(this.t().giftTrialSuccess);
        this.giftingUserId.set(null);
        this.refreshStats();
      },
      error: () => {
        this.actionError.set(this.t().giftTrialError);
        this.giftingUserId.set(null);
      }
    });
  }
  applyUserUpdate(user) {
    this.users.update((rows) => rows.map((row) => row._id === user._id ? __spreadValues(__spreadValues({}, row), user) : row));
  }
  refreshStats() {
    this.adminSvc.getStats().subscribe({
      next: (stats) => this.stats.set(stats)
    });
  }
  defaultTrialEndsInput(from = /* @__PURE__ */ new Date()) {
    const ends = new Date(from);
    ends.setUTCDate(ends.getUTCDate() + TRIAL_GIFT_DAYS);
    return ends.toISOString().slice(0, 10);
  }
  trialEndsInputValue(raw) {
    if (raw) {
      return raw.slice(0, 10);
    }
    return this.defaultTrialEndsInput();
  }
  static \u0275fac = function AdminDashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminDashboardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminDashboardComponent, selectors: [["app-admin-dashboard"]], decls: 12, vars: 10, consts: [[1, "page", "app-scroll-page", "admin-page"], [1, "page-header"], [1, "scrollable-content"], ["role", "alert", 1, "admin-page__error"], ["role", "status", 1, "admin-page__success"], [1, "hint"], [3, "cancel", "confirm", "open", "title", "confirmLabel", "cancelLabel"], [1, "admin-sub-form"], ["aria-label", "Metrics", 1, "admin-kpi"], [1, "admin-table-wrap"], [1, "admin-table"], ["scope", "col"], [1, "admin-kpi__card"], [1, "admin-kpi__label"], [1, "admin-kpi__value"], [1, "admin-kpi__card", "admin-kpi__card--wide"], [1, "admin-kpi__value", "admin-kpi__value--sm"], [1, "admin-kpi__hint"], ["colspan", "4", 1, "admin-table__empty"], [1, "admin-status-cell"], [1, "admin-trial-ends"], [1, "admin-table__actions-cell"], [1, "admin-table__actions"], ["type", "button", 1, "btn-secondary", 3, "click"], ["type", "button", 1, "btn-secondary", "admin-table__gift", 3, "click", "disabled"], [1, "admin-sub-form__email"], ["for", "admin-sub-status", 1, "admin-sub-form__label"], ["id", "admin-sub-status", "size", "compact", 3, "ngModelChange", "ngModel", "options"], ["for", "admin-sub-trial-ends", 1, "admin-sub-form__label"], ["id", "admin-sub-trial-ends", "type", "date", 1, "app-input", 3, "ngModelChange", "ngModel"]], template: function AdminDashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1");
      \u0275\u0275text(3);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "div", 2);
      \u0275\u0275conditionalCreate(5, AdminDashboardComponent_Conditional_5_Template, 2, 1, "p", 3);
      \u0275\u0275conditionalCreate(6, AdminDashboardComponent_Conditional_6_Template, 2, 1, "p", 4);
      \u0275\u0275conditionalCreate(7, AdminDashboardComponent_Conditional_7_Template, 2, 1, "p", 3);
      \u0275\u0275conditionalCreate(8, AdminDashboardComponent_Conditional_8_Template, 2, 1, "p", 5)(9, AdminDashboardComponent_Conditional_9_Template, 16, 6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "app-dialog", 6);
      \u0275\u0275listener("cancel", function AdminDashboardComponent_Template_app_dialog_cancel_10_listener() {
        return ctx.closeEdit();
      })("confirm", function AdminDashboardComponent_Template_app_dialog_confirm_10_listener() {
        return ctx.saveSubscription();
      });
      \u0275\u0275conditionalCreate(11, AdminDashboardComponent_Conditional_11_Template, 7, 5, "div", 7);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_9_0;
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.t().title);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loadError() ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.actionMessage() ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.actionError() ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 8 : 9);
      \u0275\u0275advance(2);
      \u0275\u0275property("open", ctx.editOpen())("title", ctx.t().editSubscriptionTitle)("confirmLabel", ctx.savingUserId() ? ctx.t().savingSubscription : ctx.t().saveSubscription)("cancelLabel", ctx.t().cancelEdit);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_9_0 = ctx.editingUser()) ? 11 : -1, tmp_9_0);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, AppDialogComponent, AppSelectComponent, DatePipe], styles: ['\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 0;\n  min-height: 0;\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n.admin-page__error[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  color: rgb(220, 38, 38);\n  font-size: 0.875rem;\n}\n.admin-page__success[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  color: var(--nav-accent);\n  font-size: 0.875rem;\n}\n.admin-kpi[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.75rem;\n  margin-bottom: 1.25rem;\n}\n@media (min-width: 900px) {\n  .admin-kpi[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n}\n.admin-kpi__card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  padding: 1rem 1.125rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n@media (max-width: 899px) {\n  .admin-kpi__card--wide[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n}\n.admin-kpi__label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.admin-kpi__value[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 600;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-primary);\n  line-height: 1.1;\n}\n.admin-kpi__value--sm[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  line-height: 1.35;\n}\n.admin-kpi__hint[_ngcontent-%COMP%] {\n  font-size: 0.6875rem;\n  color: var(--text-secondary);\n}\n.admin-table-wrap[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.admin-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.875rem;\n}\n.admin-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.admin-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  text-align: left;\n  border-bottom: 1px solid var(--nav-border);\n  vertical-align: middle;\n}\n.admin-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n  background: rgba(248, 250, 252, 0.6);\n  white-space: nowrap;\n}\n.admin-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.admin-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: none;\n}\n.admin-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%] {\n  background: var(--nav-hover);\n}\n.admin-table__empty[_ngcontent-%COMP%] {\n  text-align: center;\n  color: var(--text-secondary);\n}\n.admin-table__actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.admin-table__gift[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.admin-status-cell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 0.25rem;\n}\n.admin-trial-ends[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n}\n.admin-sub-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.admin-sub-form__email[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.875rem;\n  color: var(--text-secondary);\n  word-break: break-all;\n}\n.admin-sub-form__label[_ngcontent-%COMP%] {\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.admin-status[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  padding: 0.2rem 0.55rem;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.admin-status--free[_ngcontent-%COMP%] {\n  background: rgb(241, 245, 249);\n  color: rgb(71, 85, 105);\n}\n.admin-status--pro[_ngcontent-%COMP%] {\n  background: rgb(220, 252, 231);\n  color: rgb(21, 128, 61);\n}\n.admin-status--trial[_ngcontent-%COMP%] {\n  background: rgb(254, 243, 199);\n  color: rgb(146, 64, 14);\n}\n@media (max-width: 980px) {\n  .admin-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .admin-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%] {\n    display: grid;\n    gap: 0.625rem;\n  }\n  .admin-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr);\n    gap: 0.375rem;\n    border: 1px solid var(--nav-border);\n    border-radius: 0.625rem;\n    padding: 0.625rem;\n    background: var(--nav-bg);\n  }\n  .admin-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: minmax(7rem, 42%) minmax(0, 1fr);\n    gap: 0.625rem;\n    align-items: start;\n    padding: 0;\n    border-bottom: none;\n  }\n  .admin-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]::before {\n    content: attr(data-label);\n    font-size: 0.6875rem;\n    font-weight: 600;\n    color: var(--text-secondary);\n    text-transform: uppercase;\n    letter-spacing: 0.02em;\n  }\n  .admin-table[_ngcontent-%COMP%]   td[colspan][_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n    text-align: left;\n  }\n  .admin-table[_ngcontent-%COMP%]   td[colspan][_ngcontent-%COMP%]::before {\n    content: "";\n  }\n  .admin-table[_ngcontent-%COMP%]   .admin-table__actions[_ngcontent-%COMP%] {\n    justify-content: flex-start;\n  }\n  .admin-table[_ngcontent-%COMP%]   .admin-table__actions-cell[_ngcontent-%COMP%]::before {\n    content: "";\n  }\n}\n/*# sourceMappingURL=admin-dashboard.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminDashboardComponent, [{
    type: Component,
    args: [{ selector: "app-admin-dashboard", standalone: true, imports: [DatePipe, FormsModule, AppDialogComponent, AppSelectComponent], template: `<div class="page app-scroll-page admin-page">
  <header class="page-header">
    <h1>{{ t().title }}</h1>
  </header>

  <div class="scrollable-content">
  @if (loadError()) {
    <p class="admin-page__error" role="alert">{{ loadError() }}</p>
  }

  @if (actionMessage()) {
    <p class="admin-page__success" role="status">{{ actionMessage() }}</p>
  }
  @if (actionError()) {
    <p class="admin-page__error" role="alert">{{ actionError() }}</p>
  }

  @if (loading()) {
    <p class="hint">{{ t().loading }}</p>
  } @else {
    @if (stats(); as s) {
      <section class="admin-kpi" aria-label="Metrics">
        <article class="admin-kpi__card">
          <span class="admin-kpi__label">{{ t().metricTotalUsers }}</span>
          <strong class="admin-kpi__value">{{ s.totalUsers }}</strong>
        </article>
        <article class="admin-kpi__card">
          <span class="admin-kpi__label">{{ t().metricPaidUsers }}</span>
          <strong class="admin-kpi__value">{{ s.paidUsers }}</strong>
        </article>
        <article class="admin-kpi__card">
          <span class="admin-kpi__label">{{ t().metricConversion }}</span>
          <strong class="admin-kpi__value">{{ s.conversionPercent }}%</strong>
        </article>
        <article class="admin-kpi__card admin-kpi__card--wide">
          <span class="admin-kpi__label">{{ t().metricRevenue }}</span>
          <strong class="admin-kpi__value admin-kpi__value--sm">{{ revenueLabel() }}</strong>
          <span class="admin-kpi__hint">{{ t().revenueHint }}</span>
        </article>
      </section>
    }

    <section class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th scope="col">{{ t().tableEmail }}</th>
            <th scope="col">{{ t().tableStatus }}</th>
            <th scope="col">{{ t().tableRegistered }}</th>
            <th scope="col">{{ t().tableActions }}</th>
          </tr>
        </thead>
        <tbody>
          @if (users().length === 0) {
            <tr>
              <td colspan="4" class="admin-table__empty">{{ t().noUsers }}</td>
            </tr>
          } @else {
            @for (user of users(); track user._id) {
              <tr>
                <td [attr.data-label]="t().tableEmail">{{ user.email }}</td>
                <td [attr.data-label]="t().tableStatus">
                  <div class="admin-status-cell">
                    <span [class]="statusClass(user.subscription_status)">
                      {{ statusLabel(user.subscription_status) }}
                    </span>
                    @if (user.subscription_status === 'trial' && user.trial_ends_at) {
                      <span class="admin-trial-ends">
                        {{ t().trialEndsUntil }}
                        {{ user.trial_ends_at | date: 'dd.MM.yyyy' }}
                      </span>
                    }
                  </div>
                </td>
                <td [attr.data-label]="t().tableRegistered">
                  @if (user.createdAt) {
                    {{ user.createdAt | date: 'dd.MM.yyyy HH:mm' }}
                  } @else {
                    \u2014
                  }
                </td>
                <td class="admin-table__actions-cell" [attr.data-label]="t().tableActions">
                  <div class="admin-table__actions">
                    <button type="button" class="btn-secondary" (click)="openEdit(user)">
                      {{ t().editSubscription }}
                    </button>
                    <button
                      type="button"
                      class="btn-secondary admin-table__gift"
                      [disabled]="giftingUserId() === user._id"
                      (click)="giftTrial(user)"
                    >
                      {{
                        giftingUserId() === user._id ? t().giftingTrial : t().giftTrial
                      }}
                    </button>
                  </div>
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </section>
  }
  </div>
</div>

<app-dialog
  [open]="editOpen()"
  [title]="t().editSubscriptionTitle"
  [confirmLabel]="savingUserId() ? t().savingSubscription : t().saveSubscription"
  [cancelLabel]="t().cancelEdit"
  (cancel)="closeEdit()"
  (confirm)="saveSubscription()"
>
  @if (editingUser(); as user) {
    <div class="admin-sub-form">
      <p class="admin-sub-form__email">{{ user.email }}</p>

      <label class="admin-sub-form__label" for="admin-sub-status">{{ t().subscriptionField }}</label>
      <app-select
        id="admin-sub-status"
        size="compact"
        [ngModel]="editStatus()"
        (ngModelChange)="onEditStatusChange($event)"
        [options]="subscriptionOptions()"
      />

      @if (editStatus() === 'trial') {
        <label class="admin-sub-form__label" for="admin-sub-trial-ends">{{ t().trialEndsLabel }}</label>
        <input
          id="admin-sub-trial-ends"
          class="app-input"
          type="date"
          [ngModel]="editTrialEnds()"
          (ngModelChange)="editTrialEnds.set($event)"
        />
      }
    </div>
  }
</app-dialog>
`, styles: ['/* src/app/features/admin/admin-dashboard.component.scss */\n:host {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 0;\n  min-height: 0;\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n.admin-page__error {\n  margin: 0 0 1rem;\n  color: rgb(220, 38, 38);\n  font-size: 0.875rem;\n}\n.admin-page__success {\n  margin: 0 0 1rem;\n  color: var(--nav-accent);\n  font-size: 0.875rem;\n}\n.admin-kpi {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.75rem;\n  margin-bottom: 1.25rem;\n}\n@media (min-width: 900px) {\n  .admin-kpi {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n}\n.admin-kpi__card {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  padding: 1rem 1.125rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n@media (max-width: 899px) {\n  .admin-kpi__card--wide {\n    grid-column: 1/-1;\n  }\n}\n.admin-kpi__label {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.admin-kpi__value {\n  font-size: 1.75rem;\n  font-weight: 600;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-primary);\n  line-height: 1.1;\n}\n.admin-kpi__value--sm {\n  font-size: 1.125rem;\n  line-height: 1.35;\n}\n.admin-kpi__hint {\n  font-size: 0.6875rem;\n  color: var(--text-secondary);\n}\n.admin-table-wrap {\n  overflow-x: auto;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.admin-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.875rem;\n}\n.admin-table th,\n.admin-table td {\n  padding: 0.75rem 1rem;\n  text-align: left;\n  border-bottom: 1px solid var(--nav-border);\n  vertical-align: middle;\n}\n.admin-table th {\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n  background: rgba(248, 250, 252, 0.6);\n  white-space: nowrap;\n}\n.admin-table td {\n  white-space: nowrap;\n}\n.admin-table tbody tr:last-child td {\n  border-bottom: none;\n}\n.admin-table tbody tr:hover td {\n  background: var(--nav-hover);\n}\n.admin-table__empty {\n  text-align: center;\n  color: var(--text-secondary);\n}\n.admin-table__actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.admin-table__gift {\n  white-space: nowrap;\n}\n.admin-status-cell {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 0.25rem;\n}\n.admin-trial-ends {\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n}\n.admin-sub-form {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.admin-sub-form__email {\n  margin: 0;\n  font-size: 0.875rem;\n  color: var(--text-secondary);\n  word-break: break-all;\n}\n.admin-sub-form__label {\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.admin-status {\n  display: inline-flex;\n  align-items: center;\n  padding: 0.2rem 0.55rem;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.admin-status--free {\n  background: rgb(241, 245, 249);\n  color: rgb(71, 85, 105);\n}\n.admin-status--pro {\n  background: rgb(220, 252, 231);\n  color: rgb(21, 128, 61);\n}\n.admin-status--trial {\n  background: rgb(254, 243, 199);\n  color: rgb(146, 64, 14);\n}\n@media (max-width: 980px) {\n  .admin-table thead {\n    display: none;\n  }\n  .admin-table tbody {\n    display: grid;\n    gap: 0.625rem;\n  }\n  .admin-table tr {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr);\n    gap: 0.375rem;\n    border: 1px solid var(--nav-border);\n    border-radius: 0.625rem;\n    padding: 0.625rem;\n    background: var(--nav-bg);\n  }\n  .admin-table td {\n    display: grid;\n    grid-template-columns: minmax(7rem, 42%) minmax(0, 1fr);\n    gap: 0.625rem;\n    align-items: start;\n    padding: 0;\n    border-bottom: none;\n  }\n  .admin-table td::before {\n    content: attr(data-label);\n    font-size: 0.6875rem;\n    font-weight: 600;\n    color: var(--text-secondary);\n    text-transform: uppercase;\n    letter-spacing: 0.02em;\n  }\n  .admin-table td[colspan] {\n    grid-template-columns: minmax(0, 1fr);\n    text-align: left;\n  }\n  .admin-table td[colspan]::before {\n    content: "";\n  }\n  .admin-table .admin-table__actions {\n    justify-content: flex-start;\n  }\n  .admin-table .admin-table__actions-cell::before {\n    content: "";\n  }\n}\n/*# sourceMappingURL=admin-dashboard.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminDashboardComponent, { className: "AdminDashboardComponent", filePath: "app/features/admin/admin-dashboard.component.ts", lineNumber: 19 });
})();
export {
  AdminDashboardComponent
};
//# sourceMappingURL=chunk-UB3J77AT.js.map
