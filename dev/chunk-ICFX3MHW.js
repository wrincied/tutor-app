import {
  UserProfileSettingsService,
  WORKSPACE_CURRENCIES,
  WORKSPACE_LESSON_DURATIONS
} from "./chunk-N5ZNR6LJ.js";
import {
  ThemeService
} from "./chunk-4BCFSGY7.js";
import {
  AppSelectComponent
} from "./chunk-VZTTL7NS.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3XYGRFFE.js";
import "./chunk-JKSU2LPC.js";
import "./chunk-Z5FPAOY7.js";
import "./chunk-KBYR5346.js";
import "./chunk-LS4RMPGH.js";
import "./chunk-EWPFDTJG.js";
import "./chunk-HPUTEZXI.js";
import {
  Component,
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
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-27NINFBT.js";

// src/app/shared/belarus-flag/belarus-flag.component.ts
var BelarusFlagComponent = class _BelarusFlagComponent {
  static \u0275fac = function BelarusFlagComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BelarusFlagComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BelarusFlagComponent, selectors: [["app-belarus-flag"]], decls: 6, vars: 0, consts: [["aria-hidden", "true", 1, "by-flag"], [1, "by-flag__ornament"], [1, "by-flag__pattern"], [1, "by-flag__field"], [1, "by-flag__stripe", "by-flag__stripe--red"], [1, "by-flag__stripe", "by-flag__stripe--green"]], template: function BelarusFlagComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "span", 0)(1, "span", 1);
      \u0275\u0275domElement(2, "span", 2);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "span", 3);
      \u0275\u0275domElement(4, "span", 4)(5, "span", 5);
      \u0275\u0275domElementEnd()();
    }
  }, styles: ["\n.by-flag[_ngcontent-%COMP%] {\n  display: grid;\n  width: 100%;\n  height: 100%;\n  aspect-ratio: 2/1;\n  grid-template-columns: 1fr 8fr;\n  overflow: hidden;\n  border-radius: 2px;\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);\n}\n.by-flag__ornament[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 0;\n  background: #fff;\n  overflow: hidden;\n}\n.by-flag__pattern[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 6% 10%;\n  background-color: #fff;\n  background-image:\n    linear-gradient(\n      45deg,\n      #c8102e 25%,\n      transparent 25%),\n    linear-gradient(\n      -45deg,\n      #c8102e 25%,\n      transparent 25%),\n    linear-gradient(\n      45deg,\n      transparent 75%,\n      #c8102e 75%),\n    linear-gradient(\n      -45deg,\n      transparent 75%,\n      #c8102e 75%);\n  background-size: 14% 14%;\n  background-position:\n    0 0,\n    0 7%,\n    7% -7%,\n    -7% 0;\n  opacity: 0.95;\n}\n.by-flag__field[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex-direction: column;\n}\n.by-flag__stripe[_ngcontent-%COMP%] {\n  flex: 1 1 0;\n  min-height: 0;\n}\n.by-flag__stripe--red[_ngcontent-%COMP%] {\n  flex-grow: 2;\n  background: #c8102e;\n}\n.by-flag__stripe--green[_ngcontent-%COMP%] {\n  flex-grow: 1;\n  background: #007a3d;\n}\n/*# sourceMappingURL=belarus-flag.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BelarusFlagComponent, [{
    type: Component,
    args: [{ selector: "app-belarus-flag", standalone: true, template: `
    <span class="by-flag" aria-hidden="true">
      <span class="by-flag__ornament">
        <span class="by-flag__pattern"></span>
      </span>
      <span class="by-flag__field">
        <span class="by-flag__stripe by-flag__stripe--red"></span>
        <span class="by-flag__stripe by-flag__stripe--green"></span>
      </span>
    </span>
  `, styles: ["/* src/app/shared/belarus-flag/belarus-flag.component.scss */\n.by-flag {\n  display: grid;\n  width: 100%;\n  height: 100%;\n  aspect-ratio: 2/1;\n  grid-template-columns: 1fr 8fr;\n  overflow: hidden;\n  border-radius: 2px;\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);\n}\n.by-flag__ornament {\n  position: relative;\n  min-width: 0;\n  background: #fff;\n  overflow: hidden;\n}\n.by-flag__pattern {\n  position: absolute;\n  inset: 6% 10%;\n  background-color: #fff;\n  background-image:\n    linear-gradient(\n      45deg,\n      #c8102e 25%,\n      transparent 25%),\n    linear-gradient(\n      -45deg,\n      #c8102e 25%,\n      transparent 25%),\n    linear-gradient(\n      45deg,\n      transparent 75%,\n      #c8102e 75%),\n    linear-gradient(\n      -45deg,\n      transparent 75%,\n      #c8102e 75%);\n  background-size: 14% 14%;\n  background-position:\n    0 0,\n    0 7%,\n    7% -7%,\n    -7% 0;\n  opacity: 0.95;\n}\n.by-flag__field {\n  display: flex;\n  min-width: 0;\n  flex-direction: column;\n}\n.by-flag__stripe {\n  flex: 1 1 0;\n  min-height: 0;\n}\n.by-flag__stripe--red {\n  flex-grow: 2;\n  background: #c8102e;\n}\n.by-flag__stripe--green {\n  flex-grow: 1;\n  background: #007a3d;\n}\n/*# sourceMappingURL=belarus-flag.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BelarusFlagComponent, { className: "BelarusFlagComponent", filePath: "app/shared/belarus-flag/belarus-flag.component.ts", lineNumber: 20 });
})();

// src/app/features/account/account-customization.component.ts
var _c0 = () => [0, 1, 2];
function AccountCustomizationComponent_Conditional_0_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 5);
  }
}
function AccountCustomizationComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "span", 2);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 3);
    \u0275\u0275element(4, "span", 4);
    \u0275\u0275repeaterCreate(5, AccountCustomizationComponent_Conditional_0_For_6_Template, 1, 0, "span", 5, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.sharedUi().loadingContent);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.sharedUi().loadingContent);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(\u0275\u0275pureFunction0(2, _c0));
  }
}
function AccountCustomizationComponent_Conditional_1_For_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 28);
  }
  if (rf & 2) {
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl);
  }
}
function AccountCustomizationComponent_Conditional_1_For_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275element(1, "app-belarus-flag");
    \u0275\u0275elementEnd();
  }
}
function AccountCustomizationComponent_Conditional_1_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function AccountCustomizationComponent_Conditional_1_For_6_Template_button_click_0_listener() {
      const code_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.pickLang(code_r4));
    });
    \u0275\u0275conditionalCreate(1, AccountCustomizationComponent_Conditional_1_For_6_Conditional_1_Template, 1, 1, "img", 28)(2, AccountCustomizationComponent_Conditional_1_For_6_Conditional_2_Template, 2, 0, "span", 29);
    \u0275\u0275elementStart(3, "span", 30);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_14_0;
    const code_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("account-lang-btn--active", ctx_r0.i18n.lang() === code_r4);
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.labelForLang(code_r4))("aria-pressed", ctx_r0.i18n.lang() === code_r4);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_14_0 = ctx_r0.flagIcon(code_r4)) ? 1 : 2, tmp_14_0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.labelForLang(code_r4));
  }
}
function AccountCustomizationComponent_Conditional_1_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 31);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().themeLight);
  }
}
function AccountCustomizationComponent_Conditional_1_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 32);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().themeDark);
  }
}
function AccountCustomizationComponent_Conditional_1_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().workspaceSaving);
  }
}
function AccountCustomizationComponent_Conditional_1_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.accountUi().workspaceSaved, " ");
  }
}
function AccountCustomizationComponent_Conditional_1_For_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function AccountCustomizationComponent_Conditional_1_For_39_Template_button_click_0_listener() {
      const day_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleWorkingDay(day_r6));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const day_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("account-workspace__day--active", ctx_r0.isWorkingDaySelected(day_r6));
    \u0275\u0275attribute("aria-pressed", ctx_r0.isWorkingDaySelected(day_r6));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.weekdayLabels()[day_r6], " ");
  }
}
function AccountCustomizationComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 1)(1, "div", 6)(2, "span", 7);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 8);
    \u0275\u0275repeaterCreate(5, AccountCustomizationComponent_Conditional_1_For_6_Template, 5, 6, "button", 9, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 6)(8, "span", 7);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 10);
    \u0275\u0275listener("click", function AccountCustomizationComponent_Conditional_1_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.theme.toggle());
    });
    \u0275\u0275conditionalCreate(11, AccountCustomizationComponent_Conditional_1_Conditional_11_Template, 3, 1)(12, AccountCustomizationComponent_Conditional_1_Conditional_12_Template, 3, 1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 11)(14, "div", 12)(15, "h2", 13);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(17, AccountCustomizationComponent_Conditional_1_Conditional_17_Template, 2, 1, "span", 14)(18, AccountCustomizationComponent_Conditional_1_Conditional_18_Template, 2, 1, "span", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 16)(20, "div", 17)(21, "p", 7);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "app-select", 18);
    \u0275\u0275listener("ngModelChange", function AccountCustomizationComponent_Conditional_1_Template_app_select_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onWorkspaceDurationChange($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "h3", 19);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 20)(27, "div", 21)(28, "span", 7);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "app-select", 22);
    \u0275\u0275listener("ngModelChange", function AccountCustomizationComponent_Conditional_1_Template_app_select_ngModelChange_30_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onWorkingHoursStartChange($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 21)(32, "span", 7);
    \u0275\u0275text(33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "app-select", 23);
    \u0275\u0275listener("ngModelChange", function AccountCustomizationComponent_Conditional_1_Template_app_select_ngModelChange_34_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onWorkingHoursEndChange($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(35, "p", 24);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "div", 25);
    \u0275\u0275repeaterCreate(38, AccountCustomizationComponent_Conditional_1_For_39_Template, 2, 4, "button", 26, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().language);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.accountUi().language);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.i18n.allLangs);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.theme.dark() ? ctx_r0.i18n.accountUi().themeLight : ctx_r0.i18n.accountUi().themeDark, " BETA TEST ");
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.theme.dark() ? ctx_r0.i18n.accountUi().themeLight : ctx_r0.i18n.accountUi().themeDark);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.theme.dark() ? 11 : 12);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().workspaceSection);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.workspaceAutosave() === "saving" ? 17 : ctx_r0.workspaceAutosave() === "saved" ? 18 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().workspaceDefaultDuration);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.profileSettings.workspace().defaultLessonDuration + "")("options", ctx_r0.workspaceDurationOptions());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.accountUi().workingHoursSection, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().workingHoursStart);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.profileSettings.workingHours().start)("options", ctx_r0.workingHourOptions());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().workingHoursEnd);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.profileSettings.workingHours().end)("options", ctx_r0.workingHourOptions());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.accountUi().workingDays);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.accountUi().workingDays);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.isoWeekdays);
  }
}
var ISO_WEEKDAYS = [1, 2, 3, 4, 5, 6, 7];
var AccountCustomizationComponent = class _AccountCustomizationComponent {
  i18n = inject(I18nService);
  theme = inject(ThemeService);
  profileSettings = inject(UserProfileSettingsService);
  isoWeekdays = ISO_WEEKDAYS;
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  workspaceAutosave = signal("idle", ...ngDevMode ? [{ debugName: "workspaceAutosave" }] : (
    /* istanbul ignore next */
    []
  ));
  workspaceCurrencyOptions = computed(() => WORKSPACE_CURRENCIES.map((value) => ({ value, label: value })), ...ngDevMode ? [{ debugName: "workspaceCurrencyOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  workspaceDurationOptions = computed(() => WORKSPACE_LESSON_DURATIONS.map((value) => ({
    value: String(value),
    label: `${value} ${this.i18n.calendarUi().durationMinShort}`
  })), ...ngDevMode ? [{ debugName: "workspaceDurationOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  workingHourOptions = computed(() => this.profileSettings.hourSelectOptions.map((opt) => ({
    value: opt.value,
    label: opt.label
  })), ...ngDevMode ? [{ debugName: "workingHourOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  weekdayLabels = computed(() => {
    const t = this.i18n.calendarUi();
    return {
      1: t.weekdayMon,
      2: t.weekdayTue,
      3: t.weekdayWed,
      4: t.weekdayThu,
      5: t.weekdayFri,
      6: t.weekdaySat,
      7: t.weekdaySun
    };
  }, ...ngDevMode ? [{ debugName: "weekdayLabels" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    this.profileSettings.loadProfile().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false)
    });
  }
  pickLang(code) {
    this.i18n.setLang(code);
  }
  flagIcon(code) {
    if (code === "by") {
      return null;
    }
    const icons = {
      ru: "/assets/icons/flag-ru.svg",
      en: "/assets/icons/flag-en.svg",
      de: "/assets/icons/flag-at.svg",
      kz: "/assets/icons/flag-kz.svg",
      uk: "/assets/icons/flag-uk.svg"
    };
    return icons[code];
  }
  onWorkspaceNameChange(value) {
    this.markWorkspaceSaving();
    this.profileSettings.updateWorkspaceName(value);
  }
  onWorkspaceCurrencyChange(value) {
    this.markWorkspaceSaving();
    this.profileSettings.updateWorkspaceCurrency(value);
  }
  onWorkspaceDurationChange(value) {
    this.markWorkspaceSaving();
    this.profileSettings.updateWorkspaceDuration(Number(value));
  }
  onWorkingHoursStartChange(value) {
    this.markWorkspaceSaving();
    this.profileSettings.updateWorkingHoursStart(value);
  }
  onWorkingHoursEndChange(value) {
    this.markWorkspaceSaving();
    this.profileSettings.updateWorkingHoursEnd(value);
  }
  toggleWorkingDay(day) {
    this.markWorkspaceSaving();
    this.profileSettings.toggleWorkingDay(day);
  }
  isWorkingDaySelected(day) {
    return this.profileSettings.workingHours().days.includes(day);
  }
  markWorkspaceSaving() {
    this.workspaceAutosave.set("saving");
    window.setTimeout(() => this.workspaceAutosave.set("saved"), 700);
    window.setTimeout(() => this.workspaceAutosave.set("idle"), 2200);
  }
  static \u0275fac = function AccountCustomizationComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AccountCustomizationComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AccountCustomizationComponent, selectors: [["app-account-customization"]], decls: 2, vars: 1, consts: [["role", "status", "aria-busy", "true", 1, "account-skeleton", "skeleton-page"], [1, "account-card"], [1, "sr-only"], [1, "skeleton-form-card"], [1, "skeleton", "skeleton--line", "skeleton--line-lg", 2, "width", "40%"], [1, "skeleton", "skeleton--line", "skeleton--block", 2, "height", "2.75rem"], [1, "account-setting"], [1, "account-setting__label"], ["role", "group", 1, "account-langs"], ["type", "button", 1, "account-lang-btn", 3, "account-lang-btn--active"], ["type", "button", 1, "account-theme-btn", 3, "click"], [1, "account-workspace", "account-workspace--page"], [1, "account-workspace__head"], [1, "account-workspace__title"], [1, "account-workspace__status"], [1, "account-workspace__status", "account-workspace__status--ok"], [1, "account-workspace__grid"], [1, "account-workspace__duration"], ["name", "workspaceDuration", "menuPlacement", "below", 3, "ngModelChange", "ngModel", "options"], [1, "account-workspace__title", "account-workspace__title--hours"], [1, "account-workspace__hours-row"], [1, "account-workspace__hour"], ["name", "workingHoursStart", "menuPlacement", "below", 3, "ngModelChange", "ngModel", "options"], ["name", "workingHoursEnd", "menuPlacement", "below", 3, "ngModelChange", "ngModel", "options"], [1, "account-workspace__days-label"], ["role", "group", 1, "account-workspace__days"], ["type", "button", 1, "account-workspace__day", 3, "account-workspace__day--active"], ["type", "button", 1, "account-lang-btn", 3, "click"], ["width", "28", "height", "19", "alt", "", 3, "src"], ["aria-hidden", "true", 1, "account-lang-btn__flag-wrap"], [1, "account-lang-btn__name"], ["src", "/assets/icons/icon-sun.svg", "width", "22", "height", "22", "alt", ""], ["src", "/assets/icons/icon-moon.svg", "width", "22", "height", "22", "alt", ""], ["type", "button", 1, "account-workspace__day", 3, "click"]], template: function AccountCustomizationComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AccountCustomizationComponent_Conditional_0_Template, 7, 3, "div", 0)(1, AccountCustomizationComponent_Conditional_1_Template, 40, 19, "section", 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.loading() ? 0 : 1);
    }
  }, dependencies: [FormsModule, NgControlStatus, NgModel, AppSelectComponent, BelarusFlagComponent], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n/*# sourceMappingURL=account-page-host.css.map */", "\n.account-page__header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n}\n.account-page__hint[_ngcontent-%COMP%], \n.account-page__error[_ngcontent-%COMP%], \n.account-page__success[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  font-size: 0.875rem;\n}\n.account-page__error[_ngcontent-%COMP%] {\n  color: rgb(220, 38, 38);\n}\n.account-page__success[_ngcontent-%COMP%] {\n  color: rgb(5, 150, 105);\n}\n.account-password-fields[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  min-width: 0;\n}\n.account-skeleton[_ngcontent-%COMP%] {\n  margin-top: 0.5rem;\n}\n.account-setting[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.account-setting[_ngcontent-%COMP%]    + .account-setting[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  padding-top: 1rem;\n  border-top: 1px solid var(--nav-border);\n}\n.account-setting__label[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.account-langs[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.5rem;\n}\n@media (min-width: 400px) {\n  .account-langs[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n}\n.account-lang-btn[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.375rem;\n  padding: 0.625rem 0.5rem;\n  border: 1px solid rgb(226, 232, 240);\n  border-radius: 0.75rem;\n  background: rgb(248, 250, 252);\n  cursor: pointer;\n  transition: background-color 0.15s ease, border-color 0.15s ease;\n}\n.account-lang-btn[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  border-radius: 2px;\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);\n}\n.account-lang-btn__name[_ngcontent-%COMP%] {\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n  text-align: center;\n  line-height: 1.2;\n}\n.account-lang-btn[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n}\n.account-lang-btn--active[_ngcontent-%COMP%] {\n  border-color: var(--nav-accent);\n  background: var(--nav-active-bg);\n}\n.account-lang-btn--active[_ngcontent-%COMP%]   .account-lang-btn__name[_ngcontent-%COMP%] {\n  color: var(--nav-accent);\n}\n.account-theme-btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.625rem;\n  padding: 0.625rem 1rem;\n  border: 1px solid rgb(226, 232, 240);\n  border-radius: 1rem;\n  background: rgb(248, 250, 252);\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  cursor: pointer;\n  transition: background-color 0.15s ease, border-color 0.15s ease;\n}\n.account-theme-btn[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n  border-color: rgb(203, 213, 225);\n}\n.account-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.account-card[_ngcontent-%COMP%] {\n  padding: 1rem 1.125rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.account-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 0.875rem;\n  font-size: 1rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.account-card__subtitle[_ngcontent-%COMP%] {\n  margin: 1rem 0 0.625rem;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n}\n.account-card__subtitle[_ngcontent-%COMP%]:first-of-type {\n  margin-top: 0;\n}\n.field--select[_ngcontent-%COMP%]   app-select[_ngcontent-%COMP%] {\n  display: block;\n}\n.account-hint[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  font-size: 0.8125rem;\n  line-height: 1.4;\n  color: var(--text-secondary);\n}\n.account-hint[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--nav-accent);\n  font-weight: 500;\n  text-decoration: underline;\n  text-underline-offset: 2px;\n}\n.account-hint--warn[_ngcontent-%COMP%] {\n  color: rgb(180, 83, 9);\n}\n.account-hint--muted[_ngcontent-%COMP%] {\n  margin-top: 0.25rem;\n  font-size: 0.75rem;\n  opacity: 0.9;\n}\n.account-pricing-country[_ngcontent-%COMP%] {\n  margin-bottom: 0.75rem;\n}\n.account-readonly[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.375rem 0.75rem;\n  margin: 0 0 0.5rem;\n  font-size: 0.875rem;\n  color: var(--text-primary);\n}\n.account-readonly--plan[_ngcontent-%COMP%] {\n  margin-bottom: 0.375rem;\n}\n.account-readonly__label[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n  font-weight: 500;\n}\n.account-learn-more[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin: 0 0 0.75rem;\n  padding: 0;\n  border: none;\n  background: none;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--nav-accent);\n  text-decoration: underline;\n  text-underline-offset: 2px;\n  cursor: pointer;\n}\n.account-learn-more[_ngcontent-%COMP%]:hover {\n  opacity: 0.85;\n}\n.subscription-modal[_ngcontent-%COMP%] {\n  text-align: left;\n}\n.subscription-modal__intro[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  font-size: 0.875rem;\n  line-height: 1.45;\n  color: var(--text-primary);\n}\n.subscription-modal__features[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  padding-left: 1.125rem;\n  font-size: 0.8125rem;\n  line-height: 1.5;\n  color: var(--text-secondary);\n}\n.subscription-modal__features[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]    + li[_ngcontent-%COMP%] {\n  margin-top: 0.25rem;\n}\n.subscription-modal__country[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n}\n.subscription-modal__prices[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0.75rem;\n}\n.subscription-modal__price[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  padding: 0.75rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  background: rgba(248, 250, 252, 0.6);\n}\n.subscription-modal__price[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  color: var(--text-primary);\n}\n.subscription-modal__price-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.account-subscription-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n  margin: 0 0 1rem;\n}\n.account-subscription-actions__pricing[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  text-decoration: none;\n}\n.account-mobile-logout[_ngcontent-%COMP%] {\n  display: none;\n  margin-top: 1.5rem;\n  padding-top: 1.25rem;\n  border-top: 1px solid var(--nav-border);\n}\n@media (max-width: 768px), (max-height: 440px) {\n  .account-mobile-logout[_ngcontent-%COMP%] {\n    display: block;\n    margin-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));\n  }\n}\n.account-logout-btn[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.75rem 1rem;\n  border: 1px solid rgba(197, 48, 48, 0.35);\n  border-radius: 0.5rem;\n  background: rgba(254, 242, 242, 0.8);\n  color: #c5221f;\n  font-size: 0.9375rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.15s;\n}\n.account-logout-btn[_ngcontent-%COMP%]:hover {\n  background: #fce8e6;\n}\n.account-form__submit[_ngcontent-%COMP%] {\n  align-self: flex-start;\n  margin-top: 0.25rem;\n  margin-left: auto;\n}\n.account-lang-btn__flag-wrap[_ngcontent-%COMP%] {\n  display: block;\n  width: 28px;\n  height: 14px;\n}\n.account-workspace[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  padding-top: 1rem;\n  border-top: 1px solid var(--nav-border);\n}\n.account-workspace--page[_ngcontent-%COMP%] {\n  margin-top: 0;\n  padding-top: 0;\n  border-top: none;\n}\n.account-workspace__head[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 0.5rem;\n  margin-top: 0.75rem;\n}\n.account-workspace__title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.875rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.account-workspace__title--hours[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  margin-bottom: 0.625rem;\n}\n.account-workspace__status[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n}\n.account-workspace__status--ok[_ngcontent-%COMP%] {\n  color: rgb(5, 150, 105);\n}\n.account-workspace__grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.75rem;\n  grid-template-columns: 1fr;\n}\n@media (min-width: 640px) {\n  .account-workspace__grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1.4fr 0.8fr 0.8fr;\n    align-items: stretch;\n  }\n}\n.account-workspace__name[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.account-workspace__hours-row[_ngcontent-%COMP%] {\n  display: grid;\n  align-items: stretch;\n  gap: 0.75rem;\n  grid-template-columns: 1fr 1fr;\n}\n@media (min-width: 480px) {\n  .account-workspace__hours-row[_ngcontent-%COMP%] {\n    max-width: 20rem;\n  }\n}\n.account-workspace__hour[_ngcontent-%COMP%], \n.account-workspace__duration[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n  min-width: 0;\n}\n.account-workspace__days-label[_ngcontent-%COMP%] {\n  margin: 0.75rem 0 0.5rem;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.account-workspace__days[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.375rem;\n}\n.account-workspace__day[_ngcontent-%COMP%] {\n  min-width: 2.5rem;\n  padding: 0.45rem 0.55rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  background: var(--page-bg);\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n  cursor: pointer;\n  transition:\n    background-color 0.15s ease,\n    border-color 0.15s ease,\n    color 0.15s ease;\n}\n.account-workspace__day[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n}\n.account-workspace__day--active[_ngcontent-%COMP%] {\n  border-color: var(--nav-accent);\n  background: var(--nav-active-bg);\n  color: var(--nav-accent);\n}\n/*# sourceMappingURL=account.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AccountCustomizationComponent, [{
    type: Component,
    args: [{ selector: "app-account-customization", standalone: true, imports: [FormsModule, AppSelectComponent, BelarusFlagComponent], template: `@if (loading()) {\r
  <div\r
    class="account-skeleton skeleton-page"\r
    role="status"\r
    aria-busy="true"\r
    [attr.aria-label]="i18n.sharedUi().loadingContent"\r
  >\r
    <span class="sr-only">{{ i18n.sharedUi().loadingContent }}</span>\r
    <div class="skeleton-form-card">\r
      <span class="skeleton skeleton--line skeleton--line-lg" style="width: 40%"></span>\r
      @for (i of [0, 1, 2]; track i) {\r
        <span class="skeleton skeleton--line skeleton--block" style="height: 2.75rem"></span>\r
      }\r
    </div>\r
  </div>\r
} @else {\r
  <section class="account-card">\r
    <div class="account-setting">\r
      <span class="account-setting__label">{{ i18n.accountUi().language }}</span>\r
      <div class="account-langs" role="group" [attr.aria-label]="i18n.accountUi().language">\r
        @for (code of i18n.allLangs; track code) {\r
          <button\r
            type="button"\r
            class="account-lang-btn"\r
            [class.account-lang-btn--active]="i18n.lang() === code"\r
            (click)="pickLang(code)"\r
            [attr.aria-label]="i18n.labelForLang(code)"\r
            [attr.aria-pressed]="i18n.lang() === code"\r
          >\r
            @if (flagIcon(code); as icon) {\r
              <img [src]="icon" width="28" height="19" alt="" />\r
            } @else {\r
              <span class="account-lang-btn__flag-wrap" aria-hidden="true">\r
                <app-belarus-flag />\r
              </span>\r
            }\r
            <span class="account-lang-btn__name">{{ i18n.labelForLang(code) }}</span>\r
          </button>\r
        }\r
      </div>\r
    </div>\r
\r
    <div class="account-setting">\r
      <span class="account-setting__label">\r
        {{ theme.dark() ? i18n.accountUi().themeLight : i18n.accountUi().themeDark }}\r
        BETA TEST\r
      </span>\r
      <button\r
        type="button"\r
        class="account-theme-btn"\r
        (click)="theme.toggle()"\r
        [attr.aria-label]="theme.dark() ? i18n.accountUi().themeLight : i18n.accountUi().themeDark"\r
      >\r
        @if (theme.dark()) {\r
          <img src="/assets/icons/icon-sun.svg" width="22" height="22" alt="" />\r
          <span>{{ i18n.accountUi().themeLight }}</span>\r
        } @else {\r
          <img src="/assets/icons/icon-moon.svg" width="22" height="22" alt="" />\r
          <span>{{ i18n.accountUi().themeDark }}</span>\r
        }\r
      </button>\r
    </div>\r
\r
    <div class="account-workspace account-workspace--page">\r
      <div class="account-workspace__head">\r
        <h2 class="account-workspace__title">{{ i18n.accountUi().workspaceSection }}</h2>\r
        @if (workspaceAutosave() === 'saving') {\r
          <span class="account-workspace__status">{{ i18n.accountUi().workspaceSaving }}</span>\r
        } @else if (workspaceAutosave() === 'saved') {\r
          <span class="account-workspace__status account-workspace__status--ok">\r
            {{ i18n.accountUi().workspaceSaved }}\r
          </span>\r
        }\r
      </div>\r
\r
      <div class="account-workspace__grid">\r
        <!-- <div class="field field--float account-workspace__name">\r
          <input\r
            type="text"\r
            [ngModel]="profileSettings.workspace().name"\r
            (ngModelChange)="onWorkspaceNameChange($event)"\r
            name="workspaceName"\r
            placeholder=" "\r
            maxlength="120"\r
            autocomplete="organization"\r
          />\r
          <label>{{ i18n.accountUi().workspaceName }}</label>\r
        </div> -->\r
\r
        <!-- <div class="field field--select">\r
          <label>{{ i18n.accountUi().workspaceCurrency }}</label>\r
          <app-select\r
            name="workspaceCurrency"\r
            [ngModel]="profileSettings.workspace().currency"\r
            (ngModelChange)="onWorkspaceCurrencyChange($event)"\r
            [options]="workspaceCurrencyOptions()"\r
            menuPlacement="below"\r
          />\r
          \r
        </div> --> \r
        <!-- will be added later -->\r
\r
        <div class="account-workspace__duration">\r
          <p class="account-setting__label">{{ i18n.accountUi().workspaceDefaultDuration }}</p>\r
          <app-select\r
            name="workspaceDuration"\r
            [ngModel]="profileSettings.workspace().defaultLessonDuration + ''"\r
            (ngModelChange)="onWorkspaceDurationChange($event)"\r
            [options]="workspaceDurationOptions()"\r
            menuPlacement="below"\r
          />\r
        </div>\r
      </div>\r
\r
      <h3 class="account-workspace__title account-workspace__title--hours">\r
        {{ i18n.accountUi().workingHoursSection }}\r
      </h3>\r
\r
      <div class="account-workspace__hours-row">\r
        <div class="account-workspace__hour">\r
          <span class="account-setting__label">{{ i18n.accountUi().workingHoursStart }}</span>\r
          <app-select\r
            name="workingHoursStart"\r
            [ngModel]="profileSettings.workingHours().start"\r
            (ngModelChange)="onWorkingHoursStartChange($event)"\r
            [options]="workingHourOptions()"\r
            menuPlacement="below"\r
          />\r
        </div>\r
\r
        <div class="account-workspace__hour">\r
          <span class="account-setting__label">{{ i18n.accountUi().workingHoursEnd }}</span>\r
          <app-select\r
            name="workingHoursEnd"\r
            [ngModel]="profileSettings.workingHours().end"\r
            (ngModelChange)="onWorkingHoursEndChange($event)"\r
            [options]="workingHourOptions()"\r
            menuPlacement="below"\r
          />\r
        </div>\r
      </div>\r
\r
      <p class="account-workspace__days-label">{{ i18n.accountUi().workingDays }}</p>\r
      <div class="account-workspace__days" role="group" [attr.aria-label]="i18n.accountUi().workingDays">\r
        @for (day of isoWeekdays; track day) {\r
          <button\r
            type="button"\r
            class="account-workspace__day"\r
            [class.account-workspace__day--active]="isWorkingDaySelected(day)"\r
            (click)="toggleWorkingDay(day)"\r
            [attr.aria-pressed]="isWorkingDaySelected(day)"\r
          >\r
            {{ weekdayLabels()[day] }}\r
          </button>\r
        }\r
      </div>\r
    </div>\r
  </section>\r
}\r
`, styles: ["/* src/app/features/account/account-page-host.scss */\n:host {\n  display: block;\n  width: 100%;\n}\n/*# sourceMappingURL=account-page-host.css.map */\n", "/* src/app/features/account/account.component.scss */\n.account-page__header h1 {\n  font-size: 1.5rem;\n  font-weight: 700;\n}\n.account-page__hint,\n.account-page__error,\n.account-page__success {\n  margin: 0 0 1rem;\n  font-size: 0.875rem;\n}\n.account-page__error {\n  color: rgb(220, 38, 38);\n}\n.account-page__success {\n  color: rgb(5, 150, 105);\n}\n.account-password-fields {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  min-width: 0;\n}\n.account-skeleton {\n  margin-top: 0.5rem;\n}\n.account-setting {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.account-setting + .account-setting {\n  margin-top: 1rem;\n  padding-top: 1rem;\n  border-top: 1px solid var(--nav-border);\n}\n.account-setting__label {\n  margin: 0;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.account-langs {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.5rem;\n}\n@media (min-width: 400px) {\n  .account-langs {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n}\n.account-lang-btn {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.375rem;\n  padding: 0.625rem 0.5rem;\n  border: 1px solid rgb(226, 232, 240);\n  border-radius: 0.75rem;\n  background: rgb(248, 250, 252);\n  cursor: pointer;\n  transition: background-color 0.15s ease, border-color 0.15s ease;\n}\n.account-lang-btn img {\n  display: block;\n  border-radius: 2px;\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);\n}\n.account-lang-btn__name {\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n  text-align: center;\n  line-height: 1.2;\n}\n.account-lang-btn:hover {\n  background: var(--nav-hover);\n}\n.account-lang-btn--active {\n  border-color: var(--nav-accent);\n  background: var(--nav-active-bg);\n}\n.account-lang-btn--active .account-lang-btn__name {\n  color: var(--nav-accent);\n}\n.account-theme-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.625rem;\n  padding: 0.625rem 1rem;\n  border: 1px solid rgb(226, 232, 240);\n  border-radius: 1rem;\n  background: rgb(248, 250, 252);\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  cursor: pointer;\n  transition: background-color 0.15s ease, border-color 0.15s ease;\n}\n.account-theme-btn:hover {\n  background: var(--nav-hover);\n  border-color: rgb(203, 213, 225);\n}\n.account-form {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.account-card {\n  padding: 1rem 1.125rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.account-card h2 {\n  margin: 0 0 0.875rem;\n  font-size: 1rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.account-card__subtitle {\n  margin: 1rem 0 0.625rem;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n}\n.account-card__subtitle:first-of-type {\n  margin-top: 0;\n}\n.field--select app-select {\n  display: block;\n}\n.account-hint {\n  margin: 0 0 0.75rem;\n  font-size: 0.8125rem;\n  line-height: 1.4;\n  color: var(--text-secondary);\n}\n.account-hint a {\n  color: var(--nav-accent);\n  font-weight: 500;\n  text-decoration: underline;\n  text-underline-offset: 2px;\n}\n.account-hint--warn {\n  color: rgb(180, 83, 9);\n}\n.account-hint--muted {\n  margin-top: 0.25rem;\n  font-size: 0.75rem;\n  opacity: 0.9;\n}\n.account-pricing-country {\n  margin-bottom: 0.75rem;\n}\n.account-readonly {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.375rem 0.75rem;\n  margin: 0 0 0.5rem;\n  font-size: 0.875rem;\n  color: var(--text-primary);\n}\n.account-readonly--plan {\n  margin-bottom: 0.375rem;\n}\n.account-readonly__label {\n  color: var(--text-secondary);\n  font-weight: 500;\n}\n.account-learn-more {\n  display: inline-block;\n  margin: 0 0 0.75rem;\n  padding: 0;\n  border: none;\n  background: none;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--nav-accent);\n  text-decoration: underline;\n  text-underline-offset: 2px;\n  cursor: pointer;\n}\n.account-learn-more:hover {\n  opacity: 0.85;\n}\n.subscription-modal {\n  text-align: left;\n}\n.subscription-modal__intro {\n  margin: 0 0 0.75rem;\n  font-size: 0.875rem;\n  line-height: 1.45;\n  color: var(--text-primary);\n}\n.subscription-modal__features {\n  margin: 0 0 1rem;\n  padding-left: 1.125rem;\n  font-size: 0.8125rem;\n  line-height: 1.5;\n  color: var(--text-secondary);\n}\n.subscription-modal__features li + li {\n  margin-top: 0.25rem;\n}\n.subscription-modal__country {\n  margin: 0 0 0.75rem;\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n}\n.subscription-modal__prices {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0.75rem;\n}\n.subscription-modal__price {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  padding: 0.75rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  background: rgba(248, 250, 252, 0.6);\n}\n.subscription-modal__price strong {\n  font-size: 1.125rem;\n  color: var(--text-primary);\n}\n.subscription-modal__price-label {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.account-subscription-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n  margin: 0 0 1rem;\n}\n.account-subscription-actions__pricing {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  text-decoration: none;\n}\n.account-mobile-logout {\n  display: none;\n  margin-top: 1.5rem;\n  padding-top: 1.25rem;\n  border-top: 1px solid var(--nav-border);\n}\n@media (max-width: 768px), (max-height: 440px) {\n  .account-mobile-logout {\n    display: block;\n    margin-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));\n  }\n}\n.account-logout-btn {\n  width: 100%;\n  padding: 0.75rem 1rem;\n  border: 1px solid rgba(197, 48, 48, 0.35);\n  border-radius: 0.5rem;\n  background: rgba(254, 242, 242, 0.8);\n  color: #c5221f;\n  font-size: 0.9375rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.15s;\n}\n.account-logout-btn:hover {\n  background: #fce8e6;\n}\n.account-form__submit {\n  align-self: flex-start;\n  margin-top: 0.25rem;\n  margin-left: auto;\n}\n.account-lang-btn__flag-wrap {\n  display: block;\n  width: 28px;\n  height: 14px;\n}\n.account-workspace {\n  margin-top: 1rem;\n  padding-top: 1rem;\n  border-top: 1px solid var(--nav-border);\n}\n.account-workspace--page {\n  margin-top: 0;\n  padding-top: 0;\n  border-top: none;\n}\n.account-workspace__head {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 0.5rem;\n  margin-top: 0.75rem;\n}\n.account-workspace__title {\n  margin: 0;\n  font-size: 0.875rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.account-workspace__title--hours {\n  margin-top: 1rem;\n  margin-bottom: 0.625rem;\n}\n.account-workspace__status {\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n}\n.account-workspace__status--ok {\n  color: rgb(5, 150, 105);\n}\n.account-workspace__grid {\n  display: grid;\n  gap: 0.75rem;\n  grid-template-columns: 1fr;\n}\n@media (min-width: 640px) {\n  .account-workspace__grid {\n    grid-template-columns: 1.4fr 0.8fr 0.8fr;\n    align-items: stretch;\n  }\n}\n.account-workspace__name {\n  min-width: 0;\n}\n.account-workspace__hours-row {\n  display: grid;\n  align-items: stretch;\n  gap: 0.75rem;\n  grid-template-columns: 1fr 1fr;\n}\n@media (min-width: 480px) {\n  .account-workspace__hours-row {\n    max-width: 20rem;\n  }\n}\n.account-workspace__hour,\n.account-workspace__duration {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n  min-width: 0;\n}\n.account-workspace__days-label {\n  margin: 0.75rem 0 0.5rem;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.account-workspace__days {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.375rem;\n}\n.account-workspace__day {\n  min-width: 2.5rem;\n  padding: 0.45rem 0.55rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  background: var(--page-bg);\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n  cursor: pointer;\n  transition:\n    background-color 0.15s ease,\n    border-color 0.15s ease,\n    color 0.15s ease;\n}\n.account-workspace__day:hover {\n  background: var(--nav-hover);\n}\n.account-workspace__day--active {\n  border-color: var(--nav-accent);\n  background: var(--nav-active-bg);\n  color: var(--nav-accent);\n}\n/*# sourceMappingURL=account.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AccountCustomizationComponent, { className: "AccountCustomizationComponent", filePath: "app/features/account/account-customization.component.ts", lineNumber: 24 });
})();
export {
  AccountCustomizationComponent
};
//# sourceMappingURL=chunk-ICFX3MHW.js.map
