import {
  DEFAULT_STUDENT_BORDER_COLOR,
  StudentService,
  colorToHexForPicker,
  generatePastelColor,
  hexToStoredColor
} from "./chunk-3SKD4CQG.js";
import {
  ActivityLogPanelComponent,
  RATE_CURRENCIES
} from "./chunk-FXASAEVX.js";
import {
  AppSelectComponent
} from "./chunk-VZTTL7NS.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NumberValueAccessor,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-3XYGRFFE.js";
import {
  AppDialogComponent
} from "./chunk-FZY3AIGP.js";
import "./chunk-JKSU2LPC.js";
import "./chunk-MFN2ATQX.js";
import "./chunk-Z5FPAOY7.js";
import "./chunk-ZSKR65RV.js";
import {
  Component,
  I18nService,
  __spreadValues,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵanimateLeave,
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtextInterpolate6,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-27NINFBT.js";

// src/app/features/students/students.component.ts
var _forTrack0 = ($index, $item) => $item._id;
function StudentsComponent_Conditional_6_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275element(1, "span", 14);
    \u0275\u0275elementStart(2, "div", 15);
    \u0275\u0275element(3, "span", 16)(4, "span", 17)(5, "span", 18);
    \u0275\u0275elementEnd()();
  }
}
function StudentsComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "span", 11);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 12);
    \u0275\u0275repeaterCreate(4, StudentsComponent_Conditional_6_For_5_Template, 6, 0, "div", 13, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r0.t.loading);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.loading);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.skeletonCardSlots);
  }
}
function StudentsComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.t.emptyState);
  }
}
function StudentsComponent_Conditional_8_For_3_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1, "TG");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275attribute("title", ctx_r0.t.botEnabled);
  }
}
function StudentsComponent_Conditional_8_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 32);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_8_For_3_Template_button_click_0_listener() {
      const s_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openQuickActions(s_r3));
    });
    \u0275\u0275element(1, "span", 33);
    \u0275\u0275elementStart(2, "span", 34)(3, "span", 35);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 36)(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 37);
    \u0275\u0275text(9, "\xB7");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "span", 38);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(14, StudentsComponent_Conditional_8_For_3_Conditional_14_Template, 2, 1, "span", 39);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", ctx_r0.studentColor(s_r3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r3.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3("", s_r3.rate_per_hour, " ", ctx_r0.i18n.currencyLabel(ctx_r0.rateCurrencyOf(s_r3)), "", ctx_r0.t.perHour);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(s_r3.timezone);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", s_r3.balance_lessons, " ", ctx_r0.t.lessonsShort, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r3.bot_active ? 14 : -1);
  }
}
function StudentsComponent_Conditional_8_For_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 31)(1, "div", 23)(2, "span", 40);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 24)(5, "input", 41);
    \u0275\u0275listener("change", function StudentsComponent_Conditional_8_For_21_Template_input_change_5_listener($event) {
      const s_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onTableColorChange(s_r5, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 25);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 26)(9, "span", 42);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 43);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_8_For_21_Template_button_click_11_listener() {
      const s_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openTopup(s_r5._id));
    });
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 27);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 28)(16, "button", 44);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_8_For_21_Template_button_click_16_listener($event) {
      const s_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r0.requestBotToggle(s_r5));
    });
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 29)(19, "div", 45)(20, "button", 43);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_8_For_21_Template_button_click_20_listener() {
      const s_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openEdit(s_r5));
    });
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "button", 46);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_8_For_21_Template_button_click_22_listener() {
      const s_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openDeleteConfirm(s_r5._id));
    });
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const s_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r5.name);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.colorToHexForPicker(s_r5.color_hex));
    \u0275\u0275attribute("aria-label", ctx_r0.t.calendarColor + ": " + s_r5.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" ", s_r5.rate_per_hour, " ", ctx_r0.i18n.currencyLabel(ctx_r0.rateCurrencyOf(s_r5)), " ", ctx_r0.t.perHour, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r5.balance_lessons);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("+ ", ctx_r0.t.topup);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r5.timezone);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bot-toggle--on", s_r5.bot_active);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", s_r5.bot_active ? ctx_r0.t.botEnabled : ctx_r0.t.botDisabled, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.t.edit);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.t.delete, " ");
  }
}
function StudentsComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 19);
    \u0275\u0275repeaterCreate(2, StudentsComponent_Conditional_8_For_3_Template, 15, 10, "button", 20, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 21)(5, "div", 22)(6, "span", 23);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 24);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 25);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 26);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 27);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 28);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "span", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 30);
    \u0275\u0275repeaterCreate(20, StudentsComponent_Conditional_8_For_21_Template, 24, 14, "article", 31, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.students());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.t.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.calendarColor);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.rateColumn);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.balanceLessons);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.timezone);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.botNotifications);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.students());
  }
}
function StudentsComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "p", 47);
    \u0275\u0275element(2, "span", 48);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 49);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_11_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.openTopupFromQuick());
    });
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 49);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_11_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.requestBotToggleFromQuick());
    });
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 49);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_11_Template_button_click_9_listener() {
      const student_r7 = \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.openEdit(student_r7));
    });
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 50);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_11_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.openDeleteFromQuick());
    });
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const student_r7 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background-color", ctx_r0.studentColor(student_r7));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate6(" ", student_r7.rate_per_hour, " ", ctx_r0.i18n.currencyLabel(ctx_r0.rateCurrencyOf(student_r7)), "", ctx_r0.t.perHour, " \xB7 ", student_r7.timezone, " \xB7 ", student_r7.balance_lessons, " ", ctx_r0.t.lessonsShort, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" + ", ctx_r0.t.topup, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", student_r7.bot_active ? ctx_r0.t.botDisableConfirm : ctx_r0.t.botEnableConfirm, " \u2014 ", ctx_r0.t.botNotifications, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.edit);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.t.delete, " ");
  }
}
function StudentsComponent_Conditional_15_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 57)(1, "label", 87);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 88);
    \u0275\u0275listener("ngModelChange", function StudentsComponent_Conditional_15_Conditional_40_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.balanceLessons.set($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.balanceLessonsField);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.balanceLessons());
  }
}
function StudentsComponent_Conditional_15_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 57)(1, "label", 89);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 90);
    \u0275\u0275listener("ngModelChange", function StudentsComponent_Conditional_15_Conditional_41_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.creditLimit.set($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.creditLimitField);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.creditLimit());
  }
}
function StudentsComponent_Conditional_15_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 82);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r0.form.timezone);
    \u0275\u0275attribute("name", "tz-display");
  }
}
function StudentsComponent_Conditional_15_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-select", 91);
    \u0275\u0275twoWayListener("ngModelChange", function StudentsComponent_Conditional_15_Conditional_56_Template_app_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.form.timezone, $event) || (ctx_r0.form.timezone = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.form.timezone);
    \u0275\u0275property("options", ctx_r0.timezoneSelectOptionsList());
  }
}
function StudentsComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275animateLeave("modal-overlay-leave");
    \u0275\u0275elementStart(1, "div", 51);
    \u0275\u0275animateLeave("modal-sheet-leave");
    \u0275\u0275listener("click", function StudentsComponent_Conditional_15_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(2, "div", 52)(3, "h2", 53);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 54);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_15_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeForm());
    });
    \u0275\u0275element(6, "img", 55);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "form", 56);
    \u0275\u0275listener("ngSubmit", function StudentsComponent_Conditional_15_Template_form_ngSubmit_7_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.save());
    });
    \u0275\u0275elementStart(8, "div", 57)(9, "label", 58);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 59);
    \u0275\u0275twoWayListener("ngModelChange", function StudentsComponent_Conditional_15_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.form.name, $event) || (ctx_r0.form.name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 60)(13, "label", 61);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 62)(16, "input", 63);
    \u0275\u0275twoWayListener("ngModelChange", function StudentsComponent_Conditional_15_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.form.rate_per_hour, $event) || (ctx_r0.form.rate_per_hour = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 64)(18, "label", 65);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "app-select", 66);
    \u0275\u0275twoWayListener("ngModelChange", function StudentsComponent_Conditional_15_Template_app_select_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.form.rate_currency, $event) || (ctx_r0.form.rate_currency = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(21, "div", 67)(22, "label", 68);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 69)(25, "input", 70);
    \u0275\u0275listener("input", function StudentsComponent_Conditional_15_Template_input_input_25_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onFormColorPickerChange($event.target.value));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "button", 71);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_15_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.randomizeFormColor());
    });
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "fieldset", 72)(29, "legend");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 73)(32, "label", 74)(33, "input", 75);
    \u0275\u0275listener("change", function StudentsComponent_Conditional_15_Template_input_change_33_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.setBillingType("package"));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span");
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "label", 74)(37, "input", 76);
    \u0275\u0275listener("change", function StudentsComponent_Conditional_15_Template_input_change_37_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.setBillingType("postpaid"));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "span");
    \u0275\u0275text(39);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(40, StudentsComponent_Conditional_15_Conditional_40_Template, 4, 2, "div", 57);
    \u0275\u0275conditionalCreate(41, StudentsComponent_Conditional_15_Conditional_41_Template, 4, 2, "div", 57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "div", 77)(43, "label", 78)(44, "input", 79);
    \u0275\u0275twoWayListener("ngModelChange", function StudentsComponent_Conditional_15_Template_input_ngModelChange_44_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.form.bot_active, $event) || (ctx_r0.form.bot_active = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "span");
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(47, "div", 77)(48, "label", 78)(49, "input", 80);
    \u0275\u0275listener("ngModelChange", function StudentsComponent_Conditional_15_Template_input_ngModelChange_49_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onAutoTimezoneChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "span");
    \u0275\u0275text(51);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(52, "div", 57)(53, "label", 81);
    \u0275\u0275text(54);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(55, StudentsComponent_Conditional_15_Conditional_55_Template, 1, 2, "input", 82)(56, StudentsComponent_Conditional_15_Conditional_56_Template, 1, 2, "app-select", 83);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "div", 84)(58, "button", 85);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_15_Template_button_click_58_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeForm());
    });
    \u0275\u0275text(59);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "button", 86);
    \u0275\u0275text(61);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-labelledby", "student-form-title");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.editTarget() ? ctx_r0.t.editModalTitle : ctx_r0.t.newStudent);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.t.close);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.t.name);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.form.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.ratePerHour);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.form.rate_per_hour);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.currency);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.form.rate_currency);
    \u0275\u0275property("options", ctx_r0.currencySelectOptions());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.calendarColor);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.formColorPickerHex());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.t.randomColor, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.billingSectionTitle);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.t.billingSectionTitle);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", ctx_r0.billingType() === "package");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.billingTypePackage);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", ctx_r0.billingType() === "postpaid");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.billingTypePostpaid);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isPackageBilling() ? 40 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isPostpaidBilling() ? 41 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.form.bot_active);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.botNotifications);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", ctx_r0.autoTimezone);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.autoTimezone);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.timezone);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.autoTimezone ? 55 : 56);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.t.cancel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.save);
  }
}
function StudentsComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275animateLeave("modal-overlay-leave");
    \u0275\u0275elementStart(1, "div", 92);
    \u0275\u0275animateLeave("modal-sheet-leave");
    \u0275\u0275listener("click", function StudentsComponent_Conditional_16_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(2, "div", 52)(3, "h2", 93);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 54);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_16_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cancelDelete());
    });
    \u0275\u0275element(6, "img", 55);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 94)(8, "p", 95);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 84)(11, "button", 85);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_16_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cancelDelete());
    });
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 96);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_16_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.confirmDelete());
    });
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.t.delete);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.t.close);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.t.deleteConfirm);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.cancel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.delete);
  }
}
function StudentsComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275animateLeave("modal-overlay-leave");
    \u0275\u0275elementStart(1, "div", 92);
    \u0275\u0275animateLeave("modal-sheet-leave");
    \u0275\u0275listener("click", function StudentsComponent_Conditional_17_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(2, "div", 52)(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 54);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_17_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeTopup());
    });
    \u0275\u0275element(6, "img", 55);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 94)(8, "div", 57)(9, "label", 97);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 98);
    \u0275\u0275twoWayListener("ngModelChange", function StudentsComponent_Conditional_17_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.topupLessonsInput, $event) || (ctx_r0.topupLessonsInput = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 84)(13, "button", 85);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_17_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeTopup());
    });
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 2);
    \u0275\u0275listener("click", function StudentsComponent_Conditional_17_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.applyTopup());
    });
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.t.topupTitle);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.t.close);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.t.topupHint);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.topupLessonsInput);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.cancel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.topupApply);
  }
}
var TIMEZONE_PRESETS = [
  "Europe/Vienna",
  "Europe/Berlin",
  "Europe/Warsaw",
  "Europe/Moscow",
  "Europe/Minsk",
  "Europe/Kaliningrad",
  "Asia/Almaty",
  "Asia/Aqtobe",
  "Asia/Qyzylorda",
  "Asia/Atyrau",
  "Asia/Oral",
  "UTC"
];
function resolveBillingType(raw) {
  if (raw === "postpaid" || raw === "per_lesson" || raw === "single") {
    return "postpaid";
  }
  return "package";
}
function resolvedBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
var StudentsComponent = class _StudentsComponent {
  svc = inject(StudentService);
  students = signal([], ...ngDevMode ? [{ debugName: "students" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  showForm = signal(false, ...ngDevMode ? [{ debugName: "showForm" }] : (
    /* istanbul ignore next */
    []
  ));
  editTarget = signal(null, ...ngDevMode ? [{ debugName: "editTarget" }] : (
    /* istanbul ignore next */
    []
  ));
  i18n = inject(I18nService);
  form = {
    name: "",
    rate_per_hour: 0,
    rate_currency: "EUR",
    timezone: resolvedBrowserTimezone(),
    color_hex: generatePastelColor(),
    bot_active: false
  };
  billingType = signal("package", ...ngDevMode ? [{ debugName: "billingType" }] : (
    /* istanbul ignore next */
    []
  ));
  balanceLessons = signal(0, ...ngDevMode ? [{ debugName: "balanceLessons" }] : (
    /* istanbul ignore next */
    []
  ));
  creditLimit = signal(0, ...ngDevMode ? [{ debugName: "creditLimit" }] : (
    /* istanbul ignore next */
    []
  ));
  isPackageBilling = computed(() => this.billingType() === "package", ...ngDevMode ? [{ debugName: "isPackageBilling" }] : (
    /* istanbul ignore next */
    []
  ));
  isPostpaidBilling = computed(() => this.billingType() === "postpaid", ...ngDevMode ? [{ debugName: "isPostpaidBilling" }] : (
    /* istanbul ignore next */
    []
  ));
  rateCurrencies = RATE_CURRENCIES;
  skeletonCardSlots = [0, 1, 2, 3, 4, 5];
  autoTimezone = true;
  deleteTargetId = signal(null, ...ngDevMode ? [{ debugName: "deleteTargetId" }] : (
    /* istanbul ignore next */
    []
  ));
  topupTargetId = signal(null, ...ngDevMode ? [{ debugName: "topupTargetId" }] : (
    /* istanbul ignore next */
    []
  ));
  topupLessonsInput = 1;
  quickActionsStudent = signal(null, ...ngDevMode ? [{ debugName: "quickActionsStudent" }] : (
    /* istanbul ignore next */
    []
  ));
  botToggleConfirm = signal(null, ...ngDevMode ? [{ debugName: "botToggleConfirm" }] : (
    /* istanbul ignore next */
    []
  ));
  logReloadTrigger = signal(0, ...ngDevMode ? [{ debugName: "logReloadTrigger" }] : (
    /* istanbul ignore next */
    []
  ));
  colorToHexForPicker = colorToHexForPicker;
  ngOnInit() {
    this.load();
  }
  get t() {
    return this.i18n.studentsUi();
  }
  rateCurrencyOf(s) {
    return s.rate_currency ?? "EUR";
  }
  studentColor(s) {
    return s.color_hex || DEFAULT_STUDENT_BORDER_COLOR;
  }
  formColorPickerHex() {
    return colorToHexForPicker(this.form.color_hex);
  }
  onFormColorPickerChange(hex) {
    this.form.color_hex = hexToStoredColor(hex);
  }
  randomizeFormColor() {
    this.form.color_hex = generatePastelColor();
  }
  onTableColorChange(student, event) {
    event.stopPropagation();
    const hex = event.target.value;
    const color_hex = hexToStoredColor(hex);
    this.svc.update(student._id, { color_hex }).subscribe({
      next: (updated) => {
        this.patchStudent(updated);
        this.logReloadTrigger.update((n) => n + 1);
      }
    });
  }
  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: (data) => {
        this.students.set(data);
        this.loading.set(false);
        this.logReloadTrigger.update((n) => n + 1);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
  patchStudent(updated) {
    this.students.update((list) => list.map((item) => item._id === updated._id ? updated : item));
    const quick = this.quickActionsStudent();
    if (quick?._id === updated._id) {
      this.quickActionsStudent.set(updated);
    }
  }
  setBillingType(type) {
    this.billingType.set(type);
  }
  openCreate() {
    this.autoTimezone = true;
    this.form = {
      name: "",
      rate_per_hour: 0,
      rate_currency: "EUR",
      timezone: resolvedBrowserTimezone(),
      color_hex: generatePastelColor(),
      bot_active: false
    };
    this.billingType.set("package");
    this.balanceLessons.set(0);
    this.creditLimit.set(0);
    this.editTarget.set(null);
    this.showForm.set(true);
  }
  openEdit(s) {
    this.closeQuickActions();
    this.autoTimezone = false;
    this.form = {
      name: s.name,
      rate_per_hour: s.rate_per_hour,
      rate_currency: s.rate_currency ?? "EUR",
      timezone: s.timezone || "UTC",
      color_hex: s.color_hex || generatePastelColor(),
      bot_active: Boolean(s.bot_active)
    };
    this.billingType.set(resolveBillingType(s.billing_type));
    this.balanceLessons.set(Number(s.balance_lessons) || 0);
    this.creditLimit.set(Number(s.credit_limit) || 0);
    this.editTarget.set(s);
    this.showForm.set(true);
  }
  closeForm() {
    this.showForm.set(false);
  }
  onAutoTimezoneChange(checked) {
    this.autoTimezone = checked;
    if (checked) {
      this.form.timezone = resolvedBrowserTimezone();
    } else if (!TIMEZONE_PRESETS.includes(this.form.timezone)) {
      this.form.timezone = "Europe/Moscow";
    }
  }
  currencySelectOptions() {
    return RATE_CURRENCIES.map((c) => ({
      value: c,
      label: this.i18n.currencyLabel(c)
    }));
  }
  timezoneSelectOptionsList() {
    const tz = this.form.timezone;
    const zones = tz && !TIMEZONE_PRESETS.includes(tz) ? [tz, ...TIMEZONE_PRESETS] : [...TIMEZONE_PRESETS];
    return zones.map((zone) => ({ value: zone, label: zone }));
  }
  save() {
    const target = this.editTarget();
    const billing_type = this.billingType();
    const payload = __spreadValues({
      name: this.form.name,
      rate_per_hour: this.form.rate_per_hour,
      rate_currency: this.form.rate_currency,
      timezone: this.form.timezone,
      color_hex: this.form.color_hex,
      bot_active: this.form.bot_active,
      billing_type
    }, billing_type === "package" ? { balance_lessons: this.balanceLessons() } : { credit_limit: this.creditLimit() });
    if (target) {
      this.svc.update(target._id, payload).subscribe(() => {
        this.closeForm();
        this.load();
      });
    } else {
      this.svc.create(payload).subscribe(() => {
        this.closeForm();
        this.load();
      });
    }
  }
  openQuickActions(student) {
    this.quickActionsStudent.set(student);
  }
  closeQuickActions() {
    this.quickActionsStudent.set(null);
  }
  openTopup(id) {
    this.topupLessonsInput = 1;
    this.topupTargetId.set(id);
  }
  openTopupFromQuick() {
    const student = this.quickActionsStudent();
    if (!student) {
      return;
    }
    this.closeQuickActions();
    this.openTopup(student._id);
  }
  closeTopup() {
    this.topupTargetId.set(null);
  }
  applyTopup() {
    const id = this.topupTargetId();
    const n = Math.floor(Number(this.topupLessonsInput));
    if (!id || n < 1) {
      return;
    }
    this.svc.topup(id, n).subscribe(() => {
      this.closeTopup();
      this.load();
    });
  }
  openDeleteConfirm(id) {
    this.closeQuickActions();
    this.deleteTargetId.set(id);
  }
  openDeleteFromQuick() {
    const student = this.quickActionsStudent();
    if (!student) {
      return;
    }
    this.openDeleteConfirm(student._id);
  }
  cancelDelete() {
    this.deleteTargetId.set(null);
  }
  confirmDelete() {
    const id = this.deleteTargetId();
    if (!id) {
      return;
    }
    this.svc.remove(id).subscribe(() => {
      this.deleteTargetId.set(null);
      this.load();
    });
  }
  requestBotToggle(student) {
    this.botToggleConfirm.set({ student, nextActive: !student.bot_active });
  }
  requestBotToggleFromQuick() {
    const student = this.quickActionsStudent();
    if (!student) {
      return;
    }
    this.requestBotToggle(student);
  }
  cancelBotToggle() {
    this.botToggleConfirm.set(null);
  }
  confirmBotToggle() {
    const pending = this.botToggleConfirm();
    if (!pending) {
      return;
    }
    this.botToggleConfirm.set(null);
    this.svc.update(pending.student._id, { bot_active: pending.nextActive }).subscribe({
      next: (updated) => {
        this.patchStudent(updated);
        this.logReloadTrigger.update((n) => n + 1);
        if (!pending.nextActive) {
          this.closeQuickActions();
        }
      }
    });
  }
  botToggleTitle() {
    const pending = this.botToggleConfirm();
    if (!pending) {
      return "";
    }
    return pending.nextActive ? this.t.botEnableTitle : this.t.botDisableTitle;
  }
  botToggleMessage() {
    const pending = this.botToggleConfirm();
    if (!pending) {
      return "";
    }
    return pending.nextActive ? this.t.botEnableMessage : this.t.botDisableMessage;
  }
  botToggleConfirmLabel() {
    const pending = this.botToggleConfirm();
    if (!pending) {
      return "";
    }
    return pending.nextActive ? this.t.botEnableConfirm : this.t.botDisableConfirm;
  }
  static \u0275fac = function StudentsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StudentsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StudentsComponent, selectors: [["app-students"]], decls: 18, vars: 19, consts: [[1, "page", "students-page"], [1, "page-header"], ["type", "button", 1, "btn-primary", 3, "click"], ["role", "status", "aria-busy", "true", 1, "skeleton-page"], [1, "hint"], [1, "students-list"], ["category", "students", 3, "title", "emptyText", "strings", "reloadTrigger"], ["layout", "sheet", 3, "cancel", "open", "title", "cancelLabel"], [1, "quick-actions"], [3, "cancel", "confirm", "open", "title", "cancelLabel", "confirmLabel"], ["role", "presentation", 1, "modal-overlay", "modal-overlay--sheet"], [1, "sr-only"], [1, "skeleton-cards"], [1, "skeleton-card"], [1, "skeleton", "skeleton--circle", 2, "width", "0.5rem", "height", "2.5rem"], [1, "skeleton-card__body"], [1, "skeleton", "skeleton--line", 2, "width", "72%"], [1, "skeleton", "skeleton--line", "skeleton--line-sm", 2, "width", "90%"], [1, "skeleton", "skeleton--line", "skeleton--line-sm", 2, "width", "40%"], ["role", "list", 1, "students-cards"], ["type", "button", "role", "listitem", 1, "student-card"], [1, "students-grid"], [1, "students-grid__head"], [1, "students-grid__col", "students-grid__col--name"], [1, "students-grid__col", "students-grid__col--color"], [1, "students-grid__col", "students-grid__col--rate"], [1, "students-grid__col", "students-grid__col--balance"], [1, "students-grid__col", "students-grid__col--tz"], [1, "students-grid__col", "students-grid__col--bot"], [1, "students-grid__col", "students-grid__col--actions"], ["role", "list", 1, "students-grid__body"], ["role", "listitem", 1, "students-grid__row"], ["type", "button", "role", "listitem", 1, "student-card", 3, "click"], ["aria-hidden", "true", 1, "student-card__color"], [1, "student-card__body"], [1, "student-card__name"], [1, "student-card__meta"], ["aria-hidden", "true", 1, "student-card__dot"], [1, "student-card__balance"], [1, "student-card__bot-badge"], [1, "students-grid__name"], ["type", "color", 1, "student-color-input", 3, "change", "value"], [1, "students-grid__balance"], ["type", "button", 1, "btn-link", 3, "click"], ["type", "button", 1, "bot-toggle", 3, "click"], [1, "students-grid__actions"], ["type", "button", 1, "btn-link", "danger", 3, "click"], [1, "quick-actions__summary"], ["aria-hidden", "true", 1, "quick-actions__color"], ["type", "button", 1, "quick-actions__btn", 3, "click"], ["type", "button", 1, "quick-actions__btn", "quick-actions__btn--danger", 3, "click"], ["role", "dialog", "aria-modal", "true", 1, "modal", "modal-sheet", 3, "click"], [1, "modal-header"], ["id", "student-form-title"], ["type", "button", 1, "modal-close", 3, "click"], ["src", "/assets/icons/icon-close.svg", "width", "24", "height", "24", "alt", ""], [1, "modal-body", 3, "ngSubmit"], [1, "field"], ["for", "st-name"], ["id", "st-name", "type", "text", "name", "name", "required", "", "autocomplete", "name", 3, "ngModelChange", "ngModel"], [1, "field", "field--rate-row"], ["for", "st-rate"], [1, "rate-row"], ["id", "st-rate", "type", "number", "name", "rate", "required", "", "min", "1", "inputmode", "decimal", 1, "rate-row__amount", 3, "ngModelChange", "ngModel"], [1, "field", "field--nested"], ["for", "st-currency", 1, "sr-only"], ["id", "st-currency", "name", "rate_currency", "size", "compact", 1, "rate-row__currency", 3, "ngModelChange", "ngModel", "options"], [1, "field", "field--color"], ["for", "st-color"], [1, "color-picker-row"], ["id", "st-color", "type", "color", "name", "color_hex", 1, "color-picker-row__input", 3, "input", "value"], ["type", "button", 1, "btn-secondary", "color-picker-row__random", 3, "click"], [1, "field", "billing-section"], ["role", "radiogroup", 1, "billing-type-options"], [1, "billing-type-option"], ["type", "radio", "name", "billing_type", "value", "package", 3, "change", "checked"], ["type", "radio", "name", "billing_type", "value", "postpaid", 3, "change", "checked"], [1, "field", "field--checkbox"], [1, "checkbox-label"], ["type", "checkbox", "name", "bot_active", 3, "ngModelChange", "ngModel"], ["type", "checkbox", "name", "autoTz", 3, "ngModelChange", "ngModel"], ["for", "st-tz"], ["id", "st-tz", "type", "text", "readonly", "", 1, "input-readonly", 3, "value"], ["id", "st-tz", "name", "timezone", 3, "ngModel", "options"], [1, "modal-actions"], ["type", "button", 1, "btn-secondary", 3, "click"], ["type", "submit", 1, "btn-primary"], ["for", "st-balance"], ["id", "st-balance", "type", "number", "name", "balance_lessons", "min", "0", "step", "1", "inputmode", "numeric", 3, "ngModelChange", "ngModel"], ["for", "st-credit"], ["id", "st-credit", "type", "number", "name", "credit_limit", "min", "0", "step", "1", "inputmode", "numeric", 3, "ngModelChange", "ngModel"], ["id", "st-tz", "name", "timezone", 3, "ngModelChange", "ngModel", "options"], ["role", "dialog", "aria-modal", "true", 1, "modal", "modal-sheet", "modal--confirm", 3, "click"], ["id", "del-title"], [1, "modal-body"], [1, "confirm-text"], ["type", "button", 1, "btn-primary", "danger", 3, "click"], ["for", "topup-n"], ["id", "topup-n", "type", "number", "name", "topupLessons", "min", "1", "inputmode", "numeric", 3, "ngModelChange", "ngModel"]], template: function StudentsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1");
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "button", 2);
      \u0275\u0275listener("click", function StudentsComponent_Template_button_click_4_listener() {
        return ctx.openCreate();
      });
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(6, StudentsComponent_Conditional_6_Template, 6, 2, "div", 3)(7, StudentsComponent_Conditional_7_Template, 2, 1, "p", 4)(8, StudentsComponent_Conditional_8_Template, 22, 6, "div", 5);
      \u0275\u0275element(9, "app-activity-log-panel", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "app-dialog", 7);
      \u0275\u0275listener("cancel", function StudentsComponent_Template_app_dialog_cancel_10_listener() {
        return ctx.closeQuickActions();
      });
      \u0275\u0275conditionalCreate(11, StudentsComponent_Conditional_11_Template, 13, 13, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "app-dialog", 9);
      \u0275\u0275listener("cancel", function StudentsComponent_Template_app_dialog_cancel_12_listener() {
        return ctx.cancelBotToggle();
      })("confirm", function StudentsComponent_Template_app_dialog_confirm_12_listener() {
        return ctx.confirmBotToggle();
      });
      \u0275\u0275elementStart(13, "p");
      \u0275\u0275text(14);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(15, StudentsComponent_Conditional_15_Template, 62, 29, "div", 10);
      \u0275\u0275conditionalCreate(16, StudentsComponent_Conditional_16_Template, 15, 5, "div", 10);
      \u0275\u0275conditionalCreate(17, StudentsComponent_Conditional_17_Template, 17, 6, "div", 10);
    }
    if (rf & 2) {
      let tmp_8_0;
      let tmp_10_0;
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.i18n.nav().students);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.t.addButton);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 6 : ctx.students().length === 0 ? 7 : 8);
      \u0275\u0275advance(3);
      \u0275\u0275property("title", ctx.t.activityLogSection)("emptyText", ctx.t.activityLogEmpty)("strings", ctx.i18n.activityLogUi())("reloadTrigger", ctx.logReloadTrigger());
      \u0275\u0275advance();
      \u0275\u0275property("open", !!ctx.quickActionsStudent())("title", ((tmp_8_0 = ctx.quickActionsStudent()) == null ? null : tmp_8_0.name) ?? ctx.t.quickActionsTitle)("cancelLabel", ctx.t.close);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_10_0 = ctx.quickActionsStudent()) ? 11 : -1, tmp_10_0);
      \u0275\u0275advance();
      \u0275\u0275property("open", !!ctx.botToggleConfirm())("title", ctx.botToggleTitle())("cancelLabel", ctx.t.cancel)("confirmLabel", ctx.botToggleConfirmLabel());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.botToggleMessage());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showForm() ? 15 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.deleteTargetId() ? 16 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.topupTargetId() ? 17 : -1);
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinValidator, NgModel, NgForm, AppDialogComponent, AppSelectComponent, ActivityLogPanelComponent], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 0;\n  min-height: 0;\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n.students-page[_ngcontent-%COMP%]   .activity-log[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\n.sr-only[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n.field--rate-row[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.rate-row[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n@media (min-width: 400px) {\n  .rate-row[_ngcontent-%COMP%] {\n    flex-direction: row;\n    align-items: flex-end;\n    gap: 12px;\n  }\n}\n.rate-row__amount[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.field--nested[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n  flex: 1;\n}\n@media (min-width: 400px) {\n  .field--nested[_ngcontent-%COMP%] {\n    flex: 0 0 min(100%, 200px);\n  }\n}\n.rate-row__currency[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.students-list[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.students-cards[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 0.75rem;\n}\n@media (min-width: 480px) {\n  .students-cards[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (min-width: 1200px) {\n  .students-cards[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n.student-card[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n  align-items: flex-start;\n  gap: 0.75rem;\n  min-height: 5.5rem;\n  padding: 1rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.875rem;\n  background: var(--nav-bg);\n  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 0.15s ease, box-shadow 0.15s ease;\n}\n.student-card[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n}\n.student-card[_ngcontent-%COMP%]:active {\n  transform: scale(0.99);\n}\n.student-card__color[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: 0.75rem;\n  align-self: stretch;\n  min-height: 3rem;\n  border-radius: 999px;\n  border: 1px solid rgba(15, 23, 42, 0.1);\n}\n.student-card__body[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.25rem;\n}\n.student-card__name[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 600;\n  line-height: 1.3;\n  color: var(--text-primary);\n}\n.student-card__meta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.25rem 0.35rem;\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n}\n.student-card__dot[_ngcontent-%COMP%] {\n  opacity: 0.5;\n}\n.student-card__balance[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-primary);\n}\n.student-card__bot-badge[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  align-self: flex-start;\n  border-radius: 0.375rem;\n  background: rgb(224, 242, 254);\n  padding: 0.125rem 0.375rem;\n  font-size: 0.625rem;\n  font-weight: 700;\n  letter-spacing: 0.04em;\n  color: rgb(3, 105, 161);\n}\n.students-grid[_ngcontent-%COMP%] {\n  display: none;\n}\n@media (min-width: 1200px) {\n  .students-grid[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: minmax(0, 1.3fr) auto minmax(6.5rem, 0.95fr) minmax(5.5rem, 0.85fr) minmax(7.5rem, 1.1fr) minmax(6.5rem, 0.9fr) auto;\n    column-gap: 1rem;\n    row-gap: 0.5rem;\n    align-items: center;\n  }\n}\n@media (min-width: 1200px) {\n  .students-grid__head[_ngcontent-%COMP%] {\n    display: grid;\n    grid-column: 1/-1;\n    grid-template-columns: subgrid;\n    padding: 0 0.75rem 0.5rem;\n    border-bottom: 1px solid var(--nav-border);\n    margin-bottom: 0.25rem;\n    font-size: 0.75rem;\n    font-weight: 600;\n    letter-spacing: 0.02em;\n    text-transform: uppercase;\n    color: var(--text-secondary);\n    align-items: center;\n  }\n}\n.students-grid__head[_ngcontent-%COMP%]   .students-grid__col[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n@media (min-width: 1200px) {\n  .students-grid__body[_ngcontent-%COMP%] {\n    display: contents;\n  }\n}\n@media (min-width: 1200px) {\n  .students-grid__row[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n    display: grid;\n    grid-template-columns: subgrid;\n    align-items: center;\n    padding: 0.75rem;\n    border: 1px solid var(--nav-border);\n    border-radius: 0.5rem;\n    background: var(--nav-bg);\n    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);\n  }\n}\n.students-grid__col[_ngcontent-%COMP%] {\n  min-width: 0;\n  font-size: 0.875rem;\n}\n.students-grid__name[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.students-grid__col--balance[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.375rem 0.75rem;\n}\n.students-grid__balance[_ngcontent-%COMP%] {\n  font-variant-numeric: tabular-nums;\n}\n.students-grid__actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem 1rem;\n  justify-content: flex-end;\n}\n.bot-toggle[_ngcontent-%COMP%] {\n  min-height: 2.25rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 999px;\n  background: rgb(248, 250, 252);\n  padding: 0.25rem 0.75rem;\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n  cursor: pointer;\n  white-space: nowrap;\n}\n.bot-toggle--on[_ngcontent-%COMP%] {\n  border-color: rgb(125, 211, 252);\n  background: rgb(224, 242, 254);\n  color: rgb(3, 105, 161);\n}\n.bot-toggle[_ngcontent-%COMP%]:hover {\n  filter: brightness(0.97);\n}\n.student-color-input[_ngcontent-%COMP%] {\n  width: 2.25rem;\n  height: 2.25rem;\n  padding: 0;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.375rem;\n  cursor: pointer;\n  background: transparent;\n}\n.student-color-input[_ngcontent-%COMP%]::-webkit-color-swatch-wrapper {\n  padding: 2px;\n}\n.student-color-input[_ngcontent-%COMP%]::-webkit-color-swatch {\n  border: none;\n  border-radius: 0.25rem;\n}\n.color-picker-row[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.color-picker-row__input[_ngcontent-%COMP%] {\n  width: 3rem;\n  height: 3rem;\n  padding: 0;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  cursor: pointer;\n  background: transparent;\n}\n.color-picker-row__value[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 8rem;\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n  font-variant-numeric: tabular-nums;\n}\n.color-picker-row__random[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.quick-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.quick-actions__summary[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.625rem;\n  margin: 0 0 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.45;\n  color: var(--text-secondary);\n}\n.quick-actions__color[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: 0.5rem;\n  align-self: stretch;\n  min-height: 2.5rem;\n  border-radius: 999px;\n}\n.quick-actions__btn[_ngcontent-%COMP%] {\n  min-height: 3rem;\n  width: 100%;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n  padding: 0.75rem 1rem;\n  font-size: 0.9375rem;\n  font-weight: 500;\n  text-align: left;\n  color: var(--text-primary);\n  cursor: pointer;\n}\n.quick-actions__btn[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n}\n.quick-actions__btn--danger[_ngcontent-%COMP%] {\n  color: rgb(185, 28, 28);\n}\n.page-header[_ngcontent-%COMP%] {\n  flex-wrap: wrap;\n  gap: 12px;\n}\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: clamp(1.125rem, 4vw, 1.375rem);\n}\n.page-header[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%] {\n  min-height: 44px;\n  padding: 10px 16px;\n}\n.modal-header[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  flex-shrink: 0;\n  padding: 16px 12px 0 16px;\n  background: var(--nav-bg);\n}\n.modal-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.125rem;\n  line-height: 1.35;\n  font-weight: 500;\n  color: var(--text-primary);\n  flex: 1;\n  min-width: 0;\n}\n.modal-close[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: 44px;\n  height: 44px;\n  margin: -6px -4px 0 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  background: transparent;\n  color: var(--text-secondary);\n  border-radius: 8px;\n  cursor: pointer;\n}\n.modal-close[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n  color: var(--text-primary);\n}\n.modal-body[_ngcontent-%COMP%] {\n  flex: 0 1 auto;\n  padding: 12px 16px calc(20px + env(safe-area-inset-bottom, 0px));\n  overflow: visible;\n}\n.modal-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.5rem;\n  margin-top: 8px;\n}\n.modal-actions[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%], \n.modal-actions[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%] {\n  padding: 8px 18px;\n}\n.modal-actions[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]:only-child, \n.modal-actions[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]:first-child:nth-last-child(2), \n.modal-actions[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%]:only-child, \n.modal-actions[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%]:first-child:nth-last-child(2) {\n  margin-left: auto;\n}\n@media (min-width: 640px) {\n  .modal-actions[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%], \n   .modal-actions[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%] {\n    width: auto;\n    min-width: 100px;\n  }\n}\n.field--checkbox[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n}\n.checkbox-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  font-size: 14px;\n  line-height: 1.4;\n  color: var(--text-primary);\n  cursor: pointer;\n}\n.checkbox-label[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%] {\n  margin-top: 2px;\n  width: 20px;\n  height: 20px;\n  flex-shrink: 0;\n}\n.confirm-text[_ngcontent-%COMP%] {\n  margin: 0 0 16px;\n  font-size: 14px;\n  line-height: 1.45;\n  color: var(--text-primary);\n}\n.btn-primary.danger[_ngcontent-%COMP%] {\n  background: #c5221f;\n}\n.btn-primary.danger[_ngcontent-%COMP%]:hover {\n  opacity: 0.92;\n}\n.btn-primary.danger[_ngcontent-%COMP%]   .btn-primary.cancel[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n}\n.billing-section[_ngcontent-%COMP%] {\n  border: 1px solid var(--border-subtle, #e2e8f0);\n  border-radius: 8px;\n  padding: 12px 14px 4px;\n  margin-bottom: 16px;\n}\n.billing-section[_ngcontent-%COMP%]   legend[_ngcontent-%COMP%] {\n  padding: 0 6px;\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.billing-type-options[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin-bottom: 12px;\n}\n.billing-type-option[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  line-height: 1.35;\n}\n.billing-type-option[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  margin-top: 3px;\n}\n@media (max-width: 639px) {\n  .page-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .page-header[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=students.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StudentsComponent, [{
    type: Component,
    args: [{ selector: "app-students", imports: [FormsModule, AppDialogComponent, AppSelectComponent, ActivityLogPanelComponent], template: `<div class="page students-page">
  <div class="page-header">
    <h1>{{ i18n.nav().students }}</h1>
    <button type="button" class="btn-primary" (click)="openCreate()">{{ t.addButton }}</button>
  </div>

  @if (loading()) {
    <div class="skeleton-page" role="status" aria-busy="true" [attr.aria-label]="t.loading">
      <span class="sr-only">{{ t.loading }}</span>
      <div class="skeleton-cards">
        @for (i of skeletonCardSlots; track i) {
          <div class="skeleton-card">
            <span class="skeleton skeleton--circle" style="width: 0.5rem; height: 2.5rem"></span>
            <div class="skeleton-card__body">
              <span class="skeleton skeleton--line" style="width: 72%"></span>
              <span class="skeleton skeleton--line skeleton--line-sm" style="width: 90%"></span>
              <span class="skeleton skeleton--line skeleton--line-sm" style="width: 40%"></span>
            </div>
          </div>
        }
      </div>
    </div>
  } @else if (students().length === 0) {
    <p class="hint">{{ t.emptyState }}</p>
  } @else {
    <div class="students-list">
      <div class="students-cards" role="list">
        @for (s of students(); track s._id) {
          <button type="button" class="student-card" role="listitem" (click)="openQuickActions(s)">
            <span
              class="student-card__color"
              [style.background-color]="studentColor(s)"
              aria-hidden="true"
            ></span>
            <span class="student-card__body">
              <span class="student-card__name">{{ s.name }}</span>
              <span class="student-card__meta">
                <span>{{ s.rate_per_hour }} {{ i18n.currencyLabel(rateCurrencyOf(s)) }}{{ t.perHour }}</span>
                <span class="student-card__dot" aria-hidden="true">\xB7</span>
                <span>{{ s.timezone }}</span>
              </span>
              <span class="student-card__balance">
                {{ s.balance_lessons }} {{ t.lessonsShort }}
              </span>
            </span>
            @if (s.bot_active) {
              <span class="student-card__bot-badge" [attr.title]="t.botEnabled">TG</span>
            }
          </button>
        }
      </div>

      <div class="students-grid">
        <div class="students-grid__head">
          <span class="students-grid__col students-grid__col--name">{{ t.name }}</span>
          <span class="students-grid__col students-grid__col--color">{{ t.calendarColor }}</span>
          <span class="students-grid__col students-grid__col--rate">{{ t.rateColumn }}</span>
          <span class="students-grid__col students-grid__col--balance">{{ t.balanceLessons }}</span>
          <span class="students-grid__col students-grid__col--tz">{{ t.timezone }}</span>
          <span class="students-grid__col students-grid__col--bot">{{ t.botNotifications }}</span>
          <span class="students-grid__col students-grid__col--actions"></span>
        </div>

        <div class="students-grid__body" role="list">
          @for (s of students(); track s._id) {
            <article class="students-grid__row" role="listitem">
              <div class="students-grid__col students-grid__col--name">
                <span class="students-grid__name">{{ s.name }}</span>
              </div>

              <div class="students-grid__col students-grid__col--color">
                <input
                  type="color"
                  class="student-color-input"
                  [value]="colorToHexForPicker(s.color_hex)"
                  (change)="onTableColorChange(s, $event)"
                  [attr.aria-label]="t.calendarColor + ': ' + s.name"
                />
              </div>

              <div class="students-grid__col students-grid__col--rate">
                {{ s.rate_per_hour }} {{ i18n.currencyLabel(rateCurrencyOf(s)) }} {{ t.perHour }}
              </div>

              <div class="students-grid__col students-grid__col--balance">
                <span class="students-grid__balance">{{ s.balance_lessons }}</span>
                <button type="button" class="btn-link" (click)="openTopup(s._id)">+ {{ t.topup }}</button>
              </div>

              <div class="students-grid__col students-grid__col--tz">{{ s.timezone }}</div>

              <div class="students-grid__col students-grid__col--bot">
                <button
                  type="button"
                  class="bot-toggle"
                  [class.bot-toggle--on]="s.bot_active"
                  (click)="$event.stopPropagation(); requestBotToggle(s)"
                >
                  {{ s.bot_active ? t.botEnabled : t.botDisabled }}
                </button>
              </div>

              <div class="students-grid__col students-grid__col--actions">
                <div class="students-grid__actions">
                  <button type="button" class="btn-link" (click)="openEdit(s)">{{ t.edit }}</button>
                  <button type="button" class="btn-link danger" (click)="openDeleteConfirm(s._id)">
                    {{ t.delete }}
                  </button>
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </div>
  }

  <app-activity-log-panel
    category="students"
    [title]="t.activityLogSection"
    [emptyText]="t.activityLogEmpty"
    [strings]="i18n.activityLogUi()"
    [reloadTrigger]="logReloadTrigger()"
  />
</div>

<app-dialog
  [open]="!!quickActionsStudent()"
  layout="sheet"
  [title]="quickActionsStudent()?.name ?? t.quickActionsTitle"
  [cancelLabel]="t.close"
  (cancel)="closeQuickActions()"
>
  @if (quickActionsStudent(); as student) {
    <div class="quick-actions">
      <p class="quick-actions__summary">
        <span
          class="quick-actions__color"
          [style.background-color]="studentColor(student)"
          aria-hidden="true"
        ></span>
        <span>
          {{ student.rate_per_hour }} {{ i18n.currencyLabel(rateCurrencyOf(student)) }}{{ t.perHour }} \xB7
          {{ student.timezone }} \xB7 {{ student.balance_lessons }} {{ t.lessonsShort }}
        </span>
      </p>
      <button type="button" class="quick-actions__btn" (click)="openTopupFromQuick()">
        + {{ t.topup }}
      </button>
      <button type="button" class="quick-actions__btn" (click)="requestBotToggleFromQuick()">
        {{ student.bot_active ? t.botDisableConfirm : t.botEnableConfirm }} \u2014 {{ t.botNotifications }}
      </button>
      <button type="button" class="quick-actions__btn" (click)="openEdit(student)">{{ t.edit }}</button>
      <button type="button" class="quick-actions__btn quick-actions__btn--danger" (click)="openDeleteFromQuick()">
        {{ t.delete }}
      </button>
    </div>
  }
</app-dialog>

<app-dialog
  [open]="!!botToggleConfirm()"
  [title]="botToggleTitle()"
  [cancelLabel]="t.cancel"
  [confirmLabel]="botToggleConfirmLabel()"
  (cancel)="cancelBotToggle()"
  (confirm)="confirmBotToggle()"
>
  <p>{{ botToggleMessage() }}</p>
</app-dialog>

@if (showForm()) {
  <div
    class="modal-overlay modal-overlay--sheet"
    role="presentation"
    animate.leave="modal-overlay-leave"
  >
    <div
      class="modal modal-sheet"
      role="dialog"
      aria-modal="true"
      [attr.aria-labelledby]="'student-form-title'"
      animate.leave="modal-sheet-leave"
      (click)="$event.stopPropagation()"
    >
      <div class="modal-header">
        <h2 id="student-form-title">{{ editTarget() ? t.editModalTitle : t.newStudent }}</h2>
        <button type="button" class="modal-close" (click)="closeForm()" [attr.aria-label]="t.close">
          <img src="/assets/icons/icon-close.svg" width="24" height="24" alt="" />
        </button>
      </div>

      <form (ngSubmit)="save()" class="modal-body">
        <div class="field">
          <label for="st-name">{{ t.name }}</label>
          <input id="st-name" type="text" [(ngModel)]="form.name" name="name" required autocomplete="name" />
        </div>
        <div class="field field--rate-row">
          <label for="st-rate">{{ t.ratePerHour }}</label>
          <div class="rate-row">
            <input
              id="st-rate"
              type="number"
              [(ngModel)]="form.rate_per_hour"
              name="rate"
              required
              min="1"
              inputmode="decimal"
              class="rate-row__amount"
            />
            <div class="field field--nested">
              <label for="st-currency" class="sr-only">{{ t.currency }}</label>
              <app-select
                id="st-currency"
                class="rate-row__currency"
                [(ngModel)]="form.rate_currency"
                name="rate_currency"
                size="compact"
                [options]="currencySelectOptions()"
              />
            </div>
          </div>
        </div>

        <div class="field field--color">
          <label for="st-color">{{ t.calendarColor }}</label>
          <div class="color-picker-row">
            <input
              id="st-color"
              type="color"
              class="color-picker-row__input"
              [value]="formColorPickerHex()"
              (input)="onFormColorPickerChange($any($event.target).value)"
              name="color_hex"
            />
            <!-- <span class="color-picker-row__value">{{ form.color_hex }}</span> -->
            <button type="button" class="btn-secondary color-picker-row__random" (click)="randomizeFormColor()">
              {{ t.randomColor }}
            </button>
          </div>
        </div>

        <fieldset class="field billing-section">
          <legend>{{ t.billingSectionTitle }}</legend>
          <div class="billing-type-options" role="radiogroup" [attr.aria-label]="t.billingSectionTitle">
            <label class="billing-type-option">
              <input
                type="radio"
                name="billing_type"
                value="package"
                [checked]="billingType() === 'package'"
                (change)="setBillingType('package')"
              />
              <span>{{ t.billingTypePackage }}</span>
            </label>
            <label class="billing-type-option">
              <input
                type="radio"
                name="billing_type"
                value="postpaid"
                [checked]="billingType() === 'postpaid'"
                (change)="setBillingType('postpaid')"
              />
              <span>{{ t.billingTypePostpaid }}</span>
            </label>
          </div>
          @if (isPackageBilling()) {
            <div class="field">
              <label for="st-balance">{{ t.balanceLessonsField }}</label>
              <input
                id="st-balance"
                type="number"
                [ngModel]="balanceLessons()"
                (ngModelChange)="balanceLessons.set($event)"
                name="balance_lessons"
                min="0"
                step="1"
                inputmode="numeric"
              />
            </div>
          }
          @if (isPostpaidBilling()) {
            <div class="field">
              <label for="st-credit">{{ t.creditLimitField }}</label>
              <input
                id="st-credit"
                type="number"
                [ngModel]="creditLimit()"
                (ngModelChange)="creditLimit.set($event)"
                name="credit_limit"
                min="0"
                step="1"
                inputmode="numeric"
              />
            </div>
          }
        </fieldset>

        <div class="field field--checkbox">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="form.bot_active" name="bot_active" />
            <span>{{ t.botNotifications }}</span>
          </label>
        </div>

        <div class="field field--checkbox">
          <label class="checkbox-label">
            <input
              type="checkbox"
              [ngModel]="autoTimezone"
              (ngModelChange)="onAutoTimezoneChange($event)"
              name="autoTz"
            />
            <span>{{ t.autoTimezone }}</span>
          </label>
        </div>

        <div class="field">
          <label for="st-tz">{{ t.timezone }}</label>
          @if (autoTimezone) {
            <input
              id="st-tz"
              type="text"
              [value]="form.timezone"
              readonly
              class="input-readonly"
              [attr.name]="'tz-display'"
            />
          } @else {
            <app-select
              id="st-tz"
              [(ngModel)]="form.timezone"
              name="timezone"
              [options]="timezoneSelectOptionsList()"
            />
          }
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" (click)="closeForm()">{{ t.cancel }}</button>
          <button type="submit" class="btn-primary">{{ t.save }}</button>
        </div>
      </form>
    </div>
  </div>
}

@if (deleteTargetId()) {
  <div
    class="modal-overlay modal-overlay--sheet"
    role="presentation"
    animate.leave="modal-overlay-leave"
  >
    <div
      class="modal modal-sheet modal--confirm"
      role="dialog"
      aria-modal="true"
      animate.leave="modal-sheet-leave"
      (click)="$event.stopPropagation()"
    >
      <div class="modal-header">
        <h2 id="del-title">{{ t.delete }}</h2>
        <button type="button" class="modal-close" (click)="cancelDelete()" [attr.aria-label]="t.close">
          <img src="/assets/icons/icon-close.svg" width="24" height="24" alt="" />
        </button>
      </div>
      <div class="modal-body">
        <p class="confirm-text">{{ t.deleteConfirm }}</p>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" (click)="cancelDelete()">{{ t.cancel }}</button>
          <button type="button" class="btn-primary danger" (click)="confirmDelete()">{{ t.delete }}</button>
        </div>
      </div>
    </div>
  </div>
}

@if (topupTargetId()) {
  <div
    class="modal-overlay modal-overlay--sheet"
    role="presentation"
    animate.leave="modal-overlay-leave"
  >
    <div
      class="modal modal-sheet modal--confirm"
      role="dialog"
      aria-modal="true"
      animate.leave="modal-sheet-leave"
      (click)="$event.stopPropagation()"
    >
      <div class="modal-header">
        <h2>{{ t.topupTitle }}</h2>
        <button type="button" class="modal-close" (click)="closeTopup()" [attr.aria-label]="t.close">
          <img src="/assets/icons/icon-close.svg" width="24" height="24" alt="" />
        </button>
      </div>
      <div class="modal-body">
        <div class="field">
          <label for="topup-n">{{ t.topupHint }}</label>
          <input
            id="topup-n"
            type="number"
            [(ngModel)]="topupLessonsInput"
            name="topupLessons"
            min="1"
            inputmode="numeric"
          />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" (click)="closeTopup()">{{ t.cancel }}</button>
          <button type="button" class="btn-primary" (click)="applyTopup()">{{ t.topupApply }}</button>
        </div>
      </div>
    </div>
  </div>
}
`, styles: ["/* src/app/features/students/students.component.scss */\n:host {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 0;\n  min-height: 0;\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n.students-page .activity-log {\n  margin-top: 1.5rem;\n}\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n.field--rate-row {\n  margin-bottom: 16px;\n}\n.rate-row {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n@media (min-width: 400px) {\n  .rate-row {\n    flex-direction: row;\n    align-items: flex-end;\n    gap: 12px;\n  }\n}\n.rate-row__amount {\n  flex: 1;\n  min-width: 0;\n}\n.field--nested {\n  margin-bottom: 0;\n  flex: 1;\n}\n@media (min-width: 400px) {\n  .field--nested {\n    flex: 0 0 min(100%, 200px);\n  }\n}\n.rate-row__currency {\n  width: 100%;\n}\n.students-list {\n  width: 100%;\n}\n.students-cards {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 0.75rem;\n}\n@media (min-width: 480px) {\n  .students-cards {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (min-width: 1200px) {\n  .students-cards {\n    display: none;\n  }\n}\n.student-card {\n  display: flex;\n  width: 100%;\n  align-items: flex-start;\n  gap: 0.75rem;\n  min-height: 5.5rem;\n  padding: 1rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.875rem;\n  background: var(--nav-bg);\n  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 0.15s ease, box-shadow 0.15s ease;\n}\n.student-card:hover {\n  background: var(--nav-hover);\n}\n.student-card:active {\n  transform: scale(0.99);\n}\n.student-card__color {\n  flex-shrink: 0;\n  width: 0.75rem;\n  align-self: stretch;\n  min-height: 3rem;\n  border-radius: 999px;\n  border: 1px solid rgba(15, 23, 42, 0.1);\n}\n.student-card__body {\n  display: flex;\n  min-width: 0;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.25rem;\n}\n.student-card__name {\n  font-size: 1rem;\n  font-weight: 600;\n  line-height: 1.3;\n  color: var(--text-primary);\n}\n.student-card__meta {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.25rem 0.35rem;\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n}\n.student-card__dot {\n  opacity: 0.5;\n}\n.student-card__balance {\n  font-size: 0.875rem;\n  font-weight: 500;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-primary);\n}\n.student-card__bot-badge {\n  flex-shrink: 0;\n  align-self: flex-start;\n  border-radius: 0.375rem;\n  background: rgb(224, 242, 254);\n  padding: 0.125rem 0.375rem;\n  font-size: 0.625rem;\n  font-weight: 700;\n  letter-spacing: 0.04em;\n  color: rgb(3, 105, 161);\n}\n.students-grid {\n  display: none;\n}\n@media (min-width: 1200px) {\n  .students-grid {\n    display: grid;\n    grid-template-columns: minmax(0, 1.3fr) auto minmax(6.5rem, 0.95fr) minmax(5.5rem, 0.85fr) minmax(7.5rem, 1.1fr) minmax(6.5rem, 0.9fr) auto;\n    column-gap: 1rem;\n    row-gap: 0.5rem;\n    align-items: center;\n  }\n}\n@media (min-width: 1200px) {\n  .students-grid__head {\n    display: grid;\n    grid-column: 1/-1;\n    grid-template-columns: subgrid;\n    padding: 0 0.75rem 0.5rem;\n    border-bottom: 1px solid var(--nav-border);\n    margin-bottom: 0.25rem;\n    font-size: 0.75rem;\n    font-weight: 600;\n    letter-spacing: 0.02em;\n    text-transform: uppercase;\n    color: var(--text-secondary);\n    align-items: center;\n  }\n}\n.students-grid__head .students-grid__col {\n  min-width: 0;\n}\n@media (min-width: 1200px) {\n  .students-grid__body {\n    display: contents;\n  }\n}\n@media (min-width: 1200px) {\n  .students-grid__row {\n    grid-column: 1/-1;\n    display: grid;\n    grid-template-columns: subgrid;\n    align-items: center;\n    padding: 0.75rem;\n    border: 1px solid var(--nav-border);\n    border-radius: 0.5rem;\n    background: var(--nav-bg);\n    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);\n  }\n}\n.students-grid__col {\n  min-width: 0;\n  font-size: 0.875rem;\n}\n.students-grid__name {\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.students-grid__col--balance {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.375rem 0.75rem;\n}\n.students-grid__balance {\n  font-variant-numeric: tabular-nums;\n}\n.students-grid__actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem 1rem;\n  justify-content: flex-end;\n}\n.bot-toggle {\n  min-height: 2.25rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 999px;\n  background: rgb(248, 250, 252);\n  padding: 0.25rem 0.75rem;\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n  cursor: pointer;\n  white-space: nowrap;\n}\n.bot-toggle--on {\n  border-color: rgb(125, 211, 252);\n  background: rgb(224, 242, 254);\n  color: rgb(3, 105, 161);\n}\n.bot-toggle:hover {\n  filter: brightness(0.97);\n}\n.student-color-input {\n  width: 2.25rem;\n  height: 2.25rem;\n  padding: 0;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.375rem;\n  cursor: pointer;\n  background: transparent;\n}\n.student-color-input::-webkit-color-swatch-wrapper {\n  padding: 2px;\n}\n.student-color-input::-webkit-color-swatch {\n  border: none;\n  border-radius: 0.25rem;\n}\n.color-picker-row {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.color-picker-row__input {\n  width: 3rem;\n  height: 3rem;\n  padding: 0;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  cursor: pointer;\n  background: transparent;\n}\n.color-picker-row__value {\n  flex: 1;\n  min-width: 8rem;\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n  font-variant-numeric: tabular-nums;\n}\n.color-picker-row__random {\n  flex-shrink: 0;\n}\n.quick-actions {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.quick-actions__summary {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.625rem;\n  margin: 0 0 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.45;\n  color: var(--text-secondary);\n}\n.quick-actions__color {\n  flex-shrink: 0;\n  width: 0.5rem;\n  align-self: stretch;\n  min-height: 2.5rem;\n  border-radius: 999px;\n}\n.quick-actions__btn {\n  min-height: 3rem;\n  width: 100%;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n  padding: 0.75rem 1rem;\n  font-size: 0.9375rem;\n  font-weight: 500;\n  text-align: left;\n  color: var(--text-primary);\n  cursor: pointer;\n}\n.quick-actions__btn:hover {\n  background: var(--nav-hover);\n}\n.quick-actions__btn--danger {\n  color: rgb(185, 28, 28);\n}\n.page-header {\n  flex-wrap: wrap;\n  gap: 12px;\n}\n.page-header h1 {\n  font-size: clamp(1.125rem, 4vw, 1.375rem);\n}\n.page-header .btn-primary {\n  min-height: 44px;\n  padding: 10px 16px;\n}\n.modal-header {\n  position: sticky;\n  top: 0;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  flex-shrink: 0;\n  padding: 16px 12px 0 16px;\n  background: var(--nav-bg);\n}\n.modal-header h2 {\n  margin: 0;\n  font-size: 1.125rem;\n  line-height: 1.35;\n  font-weight: 500;\n  color: var(--text-primary);\n  flex: 1;\n  min-width: 0;\n}\n.modal-close {\n  flex-shrink: 0;\n  width: 44px;\n  height: 44px;\n  margin: -6px -4px 0 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  background: transparent;\n  color: var(--text-secondary);\n  border-radius: 8px;\n  cursor: pointer;\n}\n.modal-close:hover {\n  background: var(--nav-hover);\n  color: var(--text-primary);\n}\n.modal-body {\n  flex: 0 1 auto;\n  padding: 12px 16px calc(20px + env(safe-area-inset-bottom, 0px));\n  overflow: visible;\n}\n.modal-actions {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.5rem;\n  margin-top: 8px;\n}\n.modal-actions .btn-primary,\n.modal-actions .btn-secondary {\n  padding: 8px 18px;\n}\n.modal-actions .btn-primary:only-child,\n.modal-actions .btn-primary:first-child:nth-last-child(2),\n.modal-actions .btn-secondary:only-child,\n.modal-actions .btn-secondary:first-child:nth-last-child(2) {\n  margin-left: auto;\n}\n@media (min-width: 640px) {\n  .modal-actions .btn-primary,\n  .modal-actions .btn-secondary {\n    width: auto;\n    min-width: 100px;\n  }\n}\n.field--checkbox {\n  margin-bottom: 12px;\n}\n.checkbox-label {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  font-size: 14px;\n  line-height: 1.4;\n  color: var(--text-primary);\n  cursor: pointer;\n}\n.checkbox-label input[type=checkbox] {\n  margin-top: 2px;\n  width: 20px;\n  height: 20px;\n  flex-shrink: 0;\n}\n.confirm-text {\n  margin: 0 0 16px;\n  font-size: 14px;\n  line-height: 1.45;\n  color: var(--text-primary);\n}\n.btn-primary.danger {\n  background: #c5221f;\n}\n.btn-primary.danger:hover {\n  opacity: 0.92;\n}\n.btn-primary.danger .btn-primary.cancel {\n  color: var(--text-secondary);\n}\n.billing-section {\n  border: 1px solid var(--border-subtle, #e2e8f0);\n  border-radius: 8px;\n  padding: 12px 14px 4px;\n  margin-bottom: 16px;\n}\n.billing-section legend {\n  padding: 0 6px;\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.billing-type-options {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin-bottom: 12px;\n}\n.billing-type-option {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  line-height: 1.35;\n}\n.billing-type-option input {\n  margin-top: 3px;\n}\n@media (max-width: 639px) {\n  .page-header {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .page-header .btn-primary {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=students.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StudentsComponent, { className: "StudentsComponent", filePath: "app/features/students/students.component.ts", lineNumber: 53 });
})();
export {
  StudentsComponent
};
//# sourceMappingURL=chunk-NK2FUSSF.js.map
