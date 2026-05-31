import {
  ActivityLogPanelComponent,
  FINANCE_REPORT_CURRENCIES
} from "./chunk-FXASAEVX.js";
import {
  AppSelectComponent
} from "./chunk-VZTTL7NS.js";
import {
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
  FinanceService,
  financePeriodRange
} from "./chunk-NZVDDRVQ.js";
import {
  formatMoneyWithCode
} from "./chunk-KD4RMTVM.js";
import {
  AppDialogComponent
} from "./chunk-FZY3AIGP.js";
import "./chunk-JKSU2LPC.js";
import "./chunk-MFN2ATQX.js";
import "./chunk-Z5FPAOY7.js";
import "./chunk-ZSKR65RV.js";
import {
  RouterLink
} from "./chunk-HPUTEZXI.js";
import {
  Component,
  I18nService,
  __spreadProps,
  __spreadValues,
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-27NINFBT.js";

// src/app/core/utils/finance-currency.ts
function convertWithEurRates(amount, fromCurrency, toCurrency, eurRates) {
  const value = Number(amount);
  if (Number.isNaN(value) || value === 0) {
    return 0;
  }
  const from = String(fromCurrency).toUpperCase();
  const to = String(toCurrency).toUpperCase();
  if (from === to) {
    return Math.round(value * 100) / 100;
  }
  const fromRate = eurRates[from];
  const toRate = eurRates[to];
  if (!fromRate || !toRate || fromRate <= 0 || toRate <= 0) {
    return value;
  }
  return Math.round(value / fromRate * toRate * 100) / 100;
}

// src/app/core/utils/finance-summary-currency.ts
function convertField(amount, fromCurrency, toCurrency, rates) {
  return convertWithEurRates(amount, fromCurrency, toCurrency, rates);
}
function remapFinanceSummary(summary, targetCurrency) {
  const target = String(targetCurrency).trim().toUpperCase();
  const from = String(summary.currency).trim().toUpperCase();
  if (!target || from === target) {
    return summary;
  }
  const rates = summary.exchangeRates?.rates;
  if (!rates) {
    return __spreadProps(__spreadValues({}, summary), { currency: target });
  }
  const convert = (amount) => convertField(amount, from, target, rates);
  const income = summary.income;
  return __spreadProps(__spreadValues({}, summary), {
    currency: target,
    exchangeRates: __spreadProps(__spreadValues({}, summary.exchangeRates), {
      reportCurrency: target
    }),
    income: __spreadProps(__spreadValues({}, income), {
      totalIncome: convert(income.totalIncome),
      scheduledIncome: convert(income.scheduledIncome),
      combinedIncome: convert(income.combinedIncome ?? income.totalIncome + income.scheduledIncome),
      totalExpenses: convert(income.totalExpenses),
      grossProfit: convert(income.grossProfit),
      combinedByCurrency: Object.fromEntries(Object.entries(income.combinedByCurrency ?? {}).map(([code, amount]) => [
        code,
        convertField(amount, code, target, rates)
      ]))
    }),
    austria: summary.austria ? __spreadProps(__spreadValues({}, summary.austria), {
      socialInsurance: convert(summary.austria.socialInsurance),
      taxableBase: convert(summary.austria.taxableBase),
      incomeTax: convert(summary.austria.incomeTax),
      netProfit: convert(summary.austria.netProfit)
    }) : null
  });
}
function expenseAmountInReportCurrency(amount, summary, targetCurrency) {
  const target = String(targetCurrency).trim().toUpperCase();
  const from = String(summary.defaultCurrency ?? summary.currency).trim().toUpperCase();
  const rates = summary.exchangeRates?.rates;
  if (!rates || from === target) {
    return amount;
  }
  return convertWithEurRates(amount, from, target, rates);
}

// src/app/features/finance/finance.component.ts
var _forTrack0 = ($index, $item) => $item[0];
var _forTrack1 = ($index, $item) => $item._id;
function FinanceComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function FinanceComponent_Conditional_21_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33);
    \u0275\u0275element(1, "span", 36)(2, "span", 37);
    \u0275\u0275elementEnd();
  }
}
function FinanceComponent_Conditional_21_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 35);
  }
}
function FinanceComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "span", 25);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "span", 26)(4, "span", 27);
    \u0275\u0275elementStart(5, "div", 28)(6, "div", 29);
    \u0275\u0275element(7, "span", 30)(8, "span", 31)(9, "span", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(10, FinanceComponent_Conditional_21_For_11_Template, 3, 0, "div", 33, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 34);
    \u0275\u0275repeaterCreate(13, FinanceComponent_Conditional_21_For_14_Template, 1, 0, "span", 35, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r0.t.loading);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.loading);
    \u0275\u0275advance(8);
    \u0275\u0275repeater(ctx_r0.skeletonKpiSlots);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.skeletonLineSlots);
  }
}
function FinanceComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function FinanceComponent_Conditional_23_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.t.lessonsEmptyHint);
  }
}
function FinanceComponent_Conditional_23_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 47)(1, "span", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong", 44);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.netProfit);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatMoney(ctx.netProfit));
  }
}
function FinanceComponent_Conditional_23_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r3 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r0.t.missedLessons, ": ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r3.totals.missedLessonCount);
  }
}
function FinanceComponent_Conditional_23_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r3 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r0.t.canceledLessons, ": ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r3.totals.canceledLessonCount);
  }
}
function FinanceComponent_Conditional_23_Conditional_61_For_4_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong", 61);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u2248 ", ctx_r0.formatMoney(ctx_r0.convertToReport(row_r4[1], row_r4[0])), " ");
  }
}
function FinanceComponent_Conditional_23_Conditional_61_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 59);
    \u0275\u0275text(4);
    \u0275\u0275elementStart(5, "span", 60);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, FinanceComponent_Conditional_23_Conditional_61_For_4_Conditional_7_Template, 2, 1, "strong", 61);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r4[0]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatMoney(row_r4[1], row_r4[0]), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("(", ctx_r0.t.originalInCurrency, ")");
    \u0275\u0275advance();
    \u0275\u0275conditional(row_r4[0] !== ctx_r0.displayCurrency() ? 7 : -1);
  }
}
function FinanceComponent_Conditional_23_Conditional_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 57);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "ul", 58);
    \u0275\u0275repeaterCreate(3, FinanceComponent_Conditional_23_Conditional_61_For_4_Template, 8, 4, "li", null, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.t.mixedCurrencyNote);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.incomeByCurrencyRows());
  }
}
function FinanceComponent_Conditional_23_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 51)(1, "div")(2, "dt");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "dd");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "dt");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dd");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div")(12, "dt");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dd");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 62)(17, "dt");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "dd");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const at_r5 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.taxableBase);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatMoney(at_r5.taxableBase));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r0.t.socialInsurance, " (", ctx_r0.formatPercent(at_r5.socialInsuranceRate), ")");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\u2212", ctx_r0.formatMoney(at_r5.socialInsurance));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.incomeTax);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\u2212", ctx_r0.formatMoney(at_r5.incomeTax));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.netProfit);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatMoney(at_r5.netProfit));
  }
}
function FinanceComponent_Conditional_23_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 57);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 57);
    \u0275\u0275text(3);
    \u0275\u0275elementStart(4, "a", 63);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "p", 49);
    \u0275\u0275text(7);
    \u0275\u0275elementStart(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r3 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.t.taxNotConfigured);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.t.taxConfigureHint, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.nav().account);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.accountUi().taxMode, ": ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.taxModeLabel(s_r3.tax_mode));
  }
}
function FinanceComponent_Conditional_23_Conditional_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.t.emptyExpenses);
  }
}
function FinanceComponent_Conditional_23_Conditional_74_For_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 65);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 66)(10, "button", 67);
    \u0275\u0275listener("click", function FinanceComponent_Conditional_23_Conditional_74_For_16_Template_button_click_10_listener() {
      const e_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.confirmDeleteExpense(e_r7._id));
    });
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 68);
    \u0275\u0275listener("click", function FinanceComponent_Conditional_23_Conditional_74_For_16_Template_button_click_12_listener() {
      const e_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openExpenseEdit(e_r7));
    });
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const e_r7 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-label", ctx_r0.t.expenseDate);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r7.expense_date);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-label", ctx_r0.t.expenseTitle);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r7.title);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-label", ctx_r0.t.expenseCategory);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r7.category || "\u2014");
    \u0275\u0275advance();
    \u0275\u0275attribute("data-label", ctx_r0.t.expenseAmount);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatExpenseAmount(e_r7.amount), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.t.deleteExpense, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.t.editExpense, " ");
  }
}
function FinanceComponent_Conditional_23_Conditional_74_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 56)(1, "table", 64)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 65);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Action");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275repeaterCreate(15, FinanceComponent_Conditional_23_Conditional_74_For_16_Template, 14, 10, "tr", null, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.t.expenseDate);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.expenseTitle);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.expenseCategory);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.expenseAmount);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.filteredExpenses());
  }
}
function FinanceComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 39);
    \u0275\u0275text(3);
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, FinanceComponent_Conditional_23_Conditional_7_Template, 2, 1, "p", 40);
    \u0275\u0275elementStart(8, "section", 41)(9, "article", 42)(10, "span", 43);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "strong", 44);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 45)(15, "span");
    \u0275\u0275text(16);
    \u0275\u0275elementStart(17, "strong");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span");
    \u0275\u0275text(21);
    \u0275\u0275elementStart(22, "strong");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "article", 46)(26, "span", 43);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "strong", 44);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "article", 46)(31, "span", 43);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "strong", 44);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(35, FinanceComponent_Conditional_23_Conditional_35_Template, 5, 2, "article", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "section", 48)(37, "span");
    \u0275\u0275text(38);
    \u0275\u0275elementStart(39, "strong");
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "span");
    \u0275\u0275text(42);
    \u0275\u0275elementStart(43, "strong");
    \u0275\u0275text(44);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(45, "span");
    \u0275\u0275text(46);
    \u0275\u0275elementStart(47, "strong");
    \u0275\u0275text(48);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(49, FinanceComponent_Conditional_23_Conditional_49_Template, 4, 2, "span");
    \u0275\u0275conditionalCreate(50, FinanceComponent_Conditional_23_Conditional_50_Template, 4, 2, "span");
    \u0275\u0275elementStart(51, "span");
    \u0275\u0275text(52);
    \u0275\u0275elementStart(53, "strong");
    \u0275\u0275text(54);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "span");
    \u0275\u0275text(56);
    \u0275\u0275elementStart(57, "strong");
    \u0275\u0275text(58);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(59, "p", 49);
    \u0275\u0275text(60);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(61, FinanceComponent_Conditional_23_Conditional_61_Template, 5, 1);
    \u0275\u0275elementStart(62, "section", 50)(63, "h2");
    \u0275\u0275text(64);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(65, FinanceComponent_Conditional_23_Conditional_65_Template, 21, 9, "dl", 51)(66, FinanceComponent_Conditional_23_Conditional_66_Template, 10, 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "section", 52)(68, "div", 53)(69, "h2");
    \u0275\u0275text(70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "button", 54);
    \u0275\u0275listener("click", function FinanceComponent_Conditional_23_Template_button_click_71_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.openExpenseCreate());
    });
    \u0275\u0275text(72);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(73, FinanceComponent_Conditional_23_Conditional_73_Template, 2, 1, "p", 55)(74, FinanceComponent_Conditional_23_Conditional_74_Template, 17, 4, "div", 56);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_19_0;
    let tmp_35_0;
    const s_r3 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.t.disclaimer);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.t.conversionNote, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.displayCurrency());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(". ", ctx_r0.exchangeRatesLabel(), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.hasLessonsInPeriod() ? 7 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.t.totalIncomeCombined);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatMoney(ctx_r0.combinedIncome()));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.t.incomeCompletedPart, ": ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatMoney(s_r3.income.totalIncome));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" (", s_r3.totals.completedLessonCount, ") ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.t.incomePlannedPart, ": ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatMoney(s_r3.income.scheduledIncome));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" (", s_r3.totals.scheduledLessonCount, ") ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.totalExpenses);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatMoney(s_r3.income.totalExpenses));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.grossProfit);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatMoney(s_r3.income.grossProfit));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_19_0 = s_r3.austria) ? 35 : -1, tmp_19_0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r0.t.totalLessons, ": ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r3.totals.lessonCount);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r0.t.scheduledLessons, ": ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r3.totals.scheduledLessonCount);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r0.t.completedLessons, ": ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r3.totals.completedLessonCount);
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r3.totals.missedLessonCount > 0 ? 49 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r3.totals.canceledLessonCount > 0 ? 50 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r0.t.lessonHours, ": ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatHours(s_r3.totals.totalLessonHours));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r0.t.expensesCount, ": ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r3.totals.expenseCount);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.t.markCompletedHint);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.showMixedCurrencyNote() ? 61 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.t.taxSection);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_35_0 = s_r3.austria) ? 65 : 66, tmp_35_0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.t.expensesSection);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.t.addExpense, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.filteredExpenses().length === 0 ? 73 : 74);
  }
}
var FINANCE_CURRENCY_STORAGE_KEY = "finance_report_currency";
var FinanceComponent = class _FinanceComponent {
  financeSvc = inject(FinanceService);
  i18n = inject(I18nService);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  skeletonKpiSlots = [0, 1, 2, 3];
  skeletonLineSlots = [0, 1, 2];
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : (
    /* istanbul ignore next */
    []
  ));
  summary = signal(null, ...ngDevMode ? [{ debugName: "summary" }] : (
    /* istanbul ignore next */
    []
  ));
  expenses = signal([], ...ngDevMode ? [{ debugName: "expenses" }] : (
    /* istanbul ignore next */
    []
  ));
  periodPreset = signal("all", ...ngDevMode ? [{ debugName: "periodPreset" }] : (
    /* istanbul ignore next */
    []
  ));
  reportCurrency = signal(this.readStoredReportCurrency(), ...ngDevMode ? [{ debugName: "reportCurrency" }] : (
    /* istanbul ignore next */
    []
  ));
  displayCurrency = computed(() => this.reportCurrency() || this.summary()?.currency || "EUR", ...ngDevMode ? [{ debugName: "displayCurrency" }] : (
    /* istanbul ignore next */
    []
  ));
  expenseFormOpen = signal(false, ...ngDevMode ? [{ debugName: "expenseFormOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  expenseEditTarget = signal(null, ...ngDevMode ? [{ debugName: "expenseEditTarget" }] : (
    /* istanbul ignore next */
    []
  ));
  expenseDeleteId = signal(null, ...ngDevMode ? [{ debugName: "expenseDeleteId" }] : (
    /* istanbul ignore next */
    []
  ));
  expenseSaving = signal(false, ...ngDevMode ? [{ debugName: "expenseSaving" }] : (
    /* istanbul ignore next */
    []
  ));
  logReloadTrigger = signal(0, ...ngDevMode ? [{ debugName: "logReloadTrigger" }] : (
    /* istanbul ignore next */
    []
  ));
  expenseForm = {
    title: "",
    amount: 0,
    expense_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    category: ""
  };
  incomeByCurrencyRows = computed(() => {
    const by = this.summary()?.income.byCurrency ?? {};
    return Object.entries(by).filter(([, amount]) => amount > 0).sort(([a], [b]) => a.localeCompare(b));
  }, ...ngDevMode ? [{ debugName: "incomeByCurrencyRows" }] : (
    /* istanbul ignore next */
    []
  ));
  showMixedCurrencyNote = computed(() => {
    const codes = Object.keys(this.summary()?.income.byCurrency ?? {});
    const report = this.displayCurrency();
    return codes.length > 1 || codes.some((c) => c !== report);
  }, ...ngDevMode ? [{ debugName: "showMixedCurrencyNote" }] : (
    /* istanbul ignore next */
    []
  ));
  combinedIncome = computed(() => {
    const s = this.summary();
    if (!s) {
      return 0;
    }
    return s.income.combinedIncome ?? s.income.totalIncome + s.income.scheduledIncome;
  }, ...ngDevMode ? [{ debugName: "combinedIncome" }] : (
    /* istanbul ignore next */
    []
  ));
  hasLessonsInPeriod = computed(() => (this.summary()?.totals.lessonCount ?? 0) > 0, ...ngDevMode ? [{ debugName: "hasLessonsInPeriod" }] : (
    /* istanbul ignore next */
    []
  ));
  periodPresetLabel = computed(() => {
    const preset = this.periodPreset();
    if (preset === "month") {
      return this.t.periodMonth;
    }
    if (preset === "year") {
      return this.t.periodYear;
    }
    return this.t.periodAll;
  }, ...ngDevMode ? [{ debugName: "periodPresetLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  periodRangeLabel = computed(() => {
    this.i18n.lang();
    const preset = this.periodPreset();
    if (preset === "all") {
      return "";
    }
    const range = financePeriodRange(preset);
    if (!range.from || !range.to) {
      return "";
    }
    if (preset === "year") {
      return String((/* @__PURE__ */ new Date(`${range.from}T12:00:00`)).getFullYear());
    }
    const locale = this.i18n.localeId();
    const fmt = (iso) => (/* @__PURE__ */ new Date(`${iso}T12:00:00`)).toLocaleDateString(locale, {
      day: "numeric",
      month: "short"
    });
    if (range.from === range.to) {
      return fmt(range.from);
    }
    return `${fmt(range.from)} \u2013 ${fmt(range.to)}`;
  }, ...ngDevMode ? [{ debugName: "periodRangeLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  filteredExpenses = computed(() => {
    const range = financePeriodRange(this.periodPreset());
    const items = this.expenses();
    if (!range.from && !range.to) {
      return items;
    }
    return items.filter((e) => {
      const d = e.expense_date || e.createdAt?.slice(0, 10);
      if (!d) {
        return true;
      }
      if (range.from && d < range.from) {
        return false;
      }
      if (range.to && d > range.to) {
        return false;
      }
      return true;
    });
  }, ...ngDevMode ? [{ debugName: "filteredExpenses" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    this.reload();
  }
  get t() {
    return this.i18n.financeUi();
  }
  setPeriod(preset) {
    this.periodPreset.set(preset);
    this.reload();
  }
  currencySelectOptions() {
    return FINANCE_REPORT_CURRENCIES.map((code) => ({
      value: code,
      label: code
    }));
  }
  setReportCurrency(code) {
    if (!code || code === this.reportCurrency()) {
      return;
    }
    this.reportCurrency.set(code);
    localStorage.setItem(FINANCE_CURRENCY_STORAGE_KEY, code);
    const current = this.summary();
    if (current) {
      this.summary.set(remapFinanceSummary(current, code));
    }
    this.reload();
  }
  readStoredReportCurrency() {
    if (typeof localStorage === "undefined") {
      return "";
    }
    return localStorage.getItem(FINANCE_CURRENCY_STORAGE_KEY) ?? "";
  }
  reload() {
    this.loading.set(true);
    this.error.set(null);
    const range = financePeriodRange(this.periodPreset());
    const currency = this.reportCurrency();
    const summaryQuery = __spreadValues(__spreadValues({}, range), currency ? { currency } : {});
    let pending = 2;
    const finish = () => {
      pending -= 1;
      if (pending === 0) {
        this.loading.set(false);
        this.logReloadTrigger.update((n) => n + 1);
      }
    };
    this.financeSvc.getSummary(summaryQuery).subscribe({
      next: (data) => {
        const target = this.reportCurrency() || data.currency;
        if (!this.reportCurrency()) {
          this.reportCurrency.set(target);
        }
        this.summary.set(remapFinanceSummary(data, target));
        finish();
      },
      error: () => {
        this.error.set(this.t.loadError);
        finish();
      }
    });
    this.financeSvc.getExpenses().subscribe({
      next: (list) => {
        this.expenses.set(list);
        finish();
      },
      error: () => {
        this.error.set(this.t.loadError);
        finish();
      }
    });
  }
  formatMoney(amount, currencyCode) {
    const code = currencyCode ?? this.displayCurrency();
    return formatMoneyWithCode(amount, code, this.i18n.localeId());
  }
  formatExpenseAmount(amount) {
    const summary = this.summary();
    if (!summary) {
      return this.formatMoney(amount);
    }
    return this.formatMoney(expenseAmountInReportCurrency(amount, summary, this.displayCurrency()));
  }
  formatHours(hours) {
    return new Intl.NumberFormat(this.i18n.localeId(), {
      maximumFractionDigits: 1
    }).format(hours);
  }
  formatPercent(rate) {
    return new Intl.NumberFormat(this.i18n.localeId(), {
      style: "percent",
      maximumFractionDigits: 2
    }).format(rate);
  }
  convertToReport(amount, fromCurrency) {
    const s = this.summary();
    if (!s?.exchangeRates?.rates) {
      return amount;
    }
    return convertWithEurRates(amount, fromCurrency, this.displayCurrency(), s.exchangeRates.rates);
  }
  exchangeRatesLabel() {
    const s = this.summary();
    if (!s?.exchangeRates) {
      return "";
    }
    const { asOf, source } = s.exchangeRates;
    return `${this.t.ratesAsOf} ${asOf} (${source})`;
  }
  openExpenseCreate() {
    this.expenseEditTarget.set(null);
    this.expenseForm = {
      title: "",
      amount: 0,
      expense_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      category: ""
    };
    this.expenseFormOpen.set(true);
  }
  openExpenseEdit(expense) {
    this.expenseEditTarget.set(expense);
    this.expenseForm = {
      title: expense.title,
      amount: expense.amount,
      expense_date: expense.expense_date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      category: expense.category ?? ""
    };
    this.expenseFormOpen.set(true);
  }
  closeExpenseForm() {
    this.expenseFormOpen.set(false);
    this.expenseEditTarget.set(null);
  }
  saveExpense() {
    const title = this.expenseForm.title.trim();
    const amount = Number(this.expenseForm.amount);
    if (!title || Number.isNaN(amount) || amount < 0) {
      return;
    }
    const payload = {
      title,
      amount,
      expense_date: this.expenseForm.expense_date,
      category: this.expenseForm.category.trim() || void 0
    };
    this.expenseSaving.set(true);
    const edit = this.expenseEditTarget();
    const req = edit ? this.financeSvc.updateExpense(edit._id, payload) : this.financeSvc.createExpense(payload);
    req.subscribe({
      next: () => {
        this.expenseSaving.set(false);
        this.closeExpenseForm();
        this.reload();
      },
      error: () => {
        this.expenseSaving.set(false);
        this.error.set(this.t.loadError);
      }
    });
  }
  confirmDeleteExpense(id) {
    this.expenseDeleteId.set(id);
  }
  cancelDeleteExpense() {
    this.expenseDeleteId.set(null);
  }
  deleteExpense() {
    const id = this.expenseDeleteId();
    if (!id) {
      return;
    }
    this.financeSvc.removeExpense(id).subscribe({
      next: () => {
        this.expenseDeleteId.set(null);
        this.reload();
      },
      error: () => this.error.set(this.t.loadError)
    });
  }
  static \u0275fac = function FinanceComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FinanceComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FinanceComponent, selectors: [["app-finance"]], decls: 46, vars: 39, consts: [[1, "page", "app-scroll-page", "finance-page"], [1, "finance-header"], [1, "finance-header__start"], [1, "finance-header__titles"], [1, "finance-header__title"], [1, "finance-header__period"], [1, "finance-header__preset"], [1, "finance-header__range"], [1, "finance-header__actions"], [1, "finance-toolbar"], ["role", "group", 1, "finance-period"], ["type", "button", 1, "finance-period__btn", 3, "click"], ["id", "finance-report-currency", "size", "compact", "name", "financeReportCurrency", 1, "finance-toolbar__currency-select", 3, "ngModelChange", "ngModel", "options"], [1, "scrollable-content"], ["role", "status", "aria-busy", "true", 1, "skeleton-page", "finance-skeleton"], [1, "finance-page__error"], ["category", "finance", 3, "title", "emptyText", "strings", "reloadTrigger"], [3, "cancel", "confirm", "open", "closeOnOverlay", "title", "cancelLabel", "confirmLabel"], [1, "finance-expense-form", 3, "ngSubmit"], [1, "field", "field--float"], ["type", "text", "name", "expTitle", "required", "", "placeholder", " ", 3, "ngModelChange", "ngModel"], ["type", "number", "name", "expAmount", "min", "0", "step", "0.01", "required", "", "placeholder", " ", 3, "ngModelChange", "ngModel"], ["type", "date", "name", "expDate", "required", "", "placeholder", " ", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "expCategory", "placeholder", " ", 3, "ngModelChange", "ngModel"], ["variant", "error", 3, "cancel", "confirm", "open", "title", "cancelLabel", "confirmLabel"], [1, "sr-only"], [1, "skeleton", "skeleton--line", 2, "width", "88%", "max-width", "28rem"], [1, "skeleton", "skeleton--line", "skeleton--line-sm", 2, "width", "72%", "max-width", "22rem"], [1, "skeleton-kpi-grid"], [1, "skeleton-kpi", "skeleton-kpi--wide"], [1, "skeleton", "skeleton--line", "skeleton--line-sm", 2, "width", "55%"], [1, "skeleton", "skeleton--line", "skeleton--line-lg", 2, "width", "70%"], [1, "skeleton", "skeleton--line", "skeleton--line-sm", 2, "width", "90%"], [1, "skeleton-kpi"], [1, "finance-skeleton__table"], [1, "skeleton", "skeleton--line", "skeleton--block"], [1, "skeleton", "skeleton--line", "skeleton--line-sm", 2, "width", "60%"], [1, "skeleton", "skeleton--line", "skeleton--line-lg", 2, "width", "50%"], [1, "finance-disclaimer"], [1, "finance-disclaimer", "finance-disclaimer--rates"], [1, "finance-note", "finance-note--warn"], ["aria-label", "Summary", 1, "finance-kpi"], [1, "finance-kpi__card", "finance-kpi__card--income", "finance-kpi__card--wide"], [1, "finance-kpi__label"], [1, "finance-kpi__value"], [1, "finance-kpi__split"], [1, "finance-kpi__card"], [1, "finance-kpi__card", "finance-kpi__card--net"], [1, "finance-stats", "finance-stats--lessons"], [1, "finance-note", "finance-note--muted"], [1, "finance-card"], [1, "finance-dl"], [1, "finance-card", "finance-expenses"], [1, "finance-expenses__head"], ["type", "button", 1, "btn-primary", 3, "click"], [1, "hint"], [1, "table-wrap"], [1, "finance-note"], [1, "finance-currency-list"], [1, "finance-currency-list__original"], [1, "finance-currency-list__muted"], [1, "finance-currency-list__converted"], [1, "finance-dl__highlight"], ["routerLink", "/app/account", 1, "finance-link"], [1, "finance-table"], [1, "finance-table__num"], ["data-label", "Actions", 1, "finance-table__actions"], ["type", "button", 1, "btn-link", "danger", 3, "click"], ["type", "button", 1, "btn-link", 3, "click"]], template: function FinanceComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "div", 2)(3, "div", 3)(4, "h1", 4);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 5)(7, "span", 6);
      \u0275\u0275text(8);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, FinanceComponent_Conditional_9_Template, 2, 1, "span", 7);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(10, "div", 8)(11, "div", 9)(12, "div", 10)(13, "button", 11);
      \u0275\u0275listener("click", function FinanceComponent_Template_button_click_13_listener() {
        return ctx.setPeriod("month");
      });
      \u0275\u0275text(14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "button", 11);
      \u0275\u0275listener("click", function FinanceComponent_Template_button_click_15_listener() {
        return ctx.setPeriod("year");
      });
      \u0275\u0275text(16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "button", 11);
      \u0275\u0275listener("click", function FinanceComponent_Template_button_click_17_listener() {
        return ctx.setPeriod("all");
      });
      \u0275\u0275text(18);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "app-select", 12);
      \u0275\u0275listener("ngModelChange", function FinanceComponent_Template_app_select_ngModelChange_19_listener($event) {
        return ctx.setReportCurrency($event);
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(20, "div", 13);
      \u0275\u0275conditionalCreate(21, FinanceComponent_Conditional_21_Template, 15, 2, "div", 14)(22, FinanceComponent_Conditional_22_Template, 2, 1, "p", 15)(23, FinanceComponent_Conditional_23_Template, 75, 37);
      \u0275\u0275element(24, "app-activity-log-panel", 16);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "app-dialog", 17);
      \u0275\u0275listener("cancel", function FinanceComponent_Template_app_dialog_cancel_25_listener() {
        return ctx.closeExpenseForm();
      })("confirm", function FinanceComponent_Template_app_dialog_confirm_25_listener() {
        return ctx.saveExpense();
      });
      \u0275\u0275elementStart(26, "form", 18);
      \u0275\u0275listener("ngSubmit", function FinanceComponent_Template_form_ngSubmit_26_listener() {
        return ctx.saveExpense();
      });
      \u0275\u0275elementStart(27, "div", 19)(28, "input", 20);
      \u0275\u0275twoWayListener("ngModelChange", function FinanceComponent_Template_input_ngModelChange_28_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.expenseForm.title, $event) || (ctx.expenseForm.title = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "label");
      \u0275\u0275text(30);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "div", 19)(32, "input", 21);
      \u0275\u0275twoWayListener("ngModelChange", function FinanceComponent_Template_input_ngModelChange_32_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.expenseForm.amount, $event) || (ctx.expenseForm.amount = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "label");
      \u0275\u0275text(34);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "div", 19)(36, "input", 22);
      \u0275\u0275twoWayListener("ngModelChange", function FinanceComponent_Template_input_ngModelChange_36_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.expenseForm.expense_date, $event) || (ctx.expenseForm.expense_date = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "label");
      \u0275\u0275text(38);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "div", 19)(40, "input", 23);
      \u0275\u0275twoWayListener("ngModelChange", function FinanceComponent_Template_input_ngModelChange_40_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.expenseForm.category, $event) || (ctx.expenseForm.category = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "label");
      \u0275\u0275text(42);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(43, "app-dialog", 24);
      \u0275\u0275listener("cancel", function FinanceComponent_Template_app_dialog_cancel_43_listener() {
        return ctx.cancelDeleteExpense();
      })("confirm", function FinanceComponent_Template_app_dialog_confirm_43_listener() {
        return ctx.deleteExpense();
      });
      \u0275\u0275elementStart(44, "p");
      \u0275\u0275text(45);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_13_0;
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.i18n.nav().finance);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.periodPresetLabel());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.periodRangeLabel()) ? 9 : -1, tmp_2_0);
      \u0275\u0275advance(3);
      \u0275\u0275attribute("aria-label", ctx.t.periodMonth);
      \u0275\u0275advance();
      \u0275\u0275classProp("finance-period__btn--active", ctx.periodPreset() === "month");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.t.periodMonth, " ");
      \u0275\u0275advance();
      \u0275\u0275classProp("finance-period__btn--active", ctx.periodPreset() === "year");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.t.periodYear, " ");
      \u0275\u0275advance();
      \u0275\u0275classProp("finance-period__btn--active", ctx.periodPreset() === "all");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.t.periodAll, " ");
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.reportCurrency())("options", ctx.currencySelectOptions());
      \u0275\u0275attribute("aria-label", ctx.t.reportCurrency);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 21 : ctx.error() ? 22 : (tmp_13_0 = ctx.summary()) ? 23 : -1, tmp_13_0);
      \u0275\u0275advance(3);
      \u0275\u0275property("title", ctx.t.activityLogSection)("emptyText", ctx.t.activityLogEmpty)("strings", ctx.i18n.activityLogUi())("reloadTrigger", ctx.logReloadTrigger());
      \u0275\u0275advance();
      \u0275\u0275property("open", ctx.expenseFormOpen())("closeOnOverlay", false)("title", ctx.expenseEditTarget() ? ctx.t.editExpense : ctx.t.addExpense)("cancelLabel", ctx.t.cancel)("confirmLabel", ctx.expenseSaving() ? ctx.t.saving : ctx.t.save);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.expenseForm.title);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.t.expenseTitle);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("ngModel", ctx.expenseForm.amount);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.t.expenseAmount);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("ngModel", ctx.expenseForm.expense_date);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.t.expenseDate);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("ngModel", ctx.expenseForm.category);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.t.expenseCategory);
      \u0275\u0275advance();
      \u0275\u0275property("open", ctx.expenseDeleteId() !== null)("title", ctx.t.deleteExpense)("cancelLabel", ctx.t.cancel)("confirmLabel", ctx.t.deleteExpense);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.t.deleteConfirm);
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinValidator, NgModel, NgForm, RouterLink, AppDialogComponent, AppSelectComponent, ActivityLogPanelComponent], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 0;\n  min-height: 0;\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n.finance-page__error[_ngcontent-%COMP%] {\n  color: rgb(220, 38, 38);\n  font-size: 0.875rem;\n}\n.finance-skeleton__table[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.625rem;\n  padding: 1rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.finance-header[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n  display: flex;\n  flex-shrink: 0;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n  color: var(--text-primary);\n  box-sizing: border-box;\n}\n.finance-header__start[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  align-items: center;\n  gap: 0.5rem;\n}\n.finance-header__actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.375rem;\n}\n.finance-header__titles[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.125rem;\n}\n.finance-header__title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.125rem;\n  font-weight: 700;\n  letter-spacing: -0.025em;\n  line-height: 1.2;\n}\n@media (min-width: 640px) {\n  .finance-header__title[_ngcontent-%COMP%] {\n    font-size: 1.375rem;\n  }\n}\n.finance-header__period[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.35rem 0.5rem;\n  margin: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: 1.25;\n}\n.finance-header__preset[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  font-size: 0.8125rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  letter-spacing: 0.02em;\n  color: var(--nav-accent);\n}\n@media (min-width: 640px) {\n  .finance-header__preset[_ngcontent-%COMP%] {\n    font-size: 0.875rem;\n  }\n}\n.finance-header__range[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  color: var(--text-primary);\n  text-transform: capitalize;\n}\n.finance-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.375rem;\n}\n.finance-toolbar__currency-select[_ngcontent-%COMP%] {\n  width: min(7.5rem, 32vw);\n  min-width: 6.5rem;\n  flex-shrink: 0;\n}\n.finance-period[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.375rem;\n}\n.finance-period__btn[_ngcontent-%COMP%] {\n  padding: 0.375rem 0.75rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 999px;\n  background: var(--nav-bg);\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n  cursor: pointer;\n  transition:\n    background-color 0.15s ease,\n    border-color 0.15s ease,\n    color 0.15s ease;\n}\n.finance-period__btn[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n}\n.finance-period__btn--active[_ngcontent-%COMP%] {\n  border-color: var(--nav-accent);\n  background: var(--nav-active-bg);\n  color: var(--nav-accent);\n  font-weight: 600;\n}\n.finance-disclaimer[_ngcontent-%COMP%] {\n  margin: 0 0 0.5rem;\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n  line-height: 1.4;\n}\n.finance-disclaimer--rates[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n.finance-kpi[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.75rem;\n  margin-bottom: 1rem;\n}\n@media (min-width: 900px) {\n  .finance-kpi[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(5, minmax(0, 1fr));\n  }\n}\n@media (min-width: 720px) and (max-width: 899px) {\n  .finance-kpi[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n}\n.finance-kpi__card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  padding: 0.875rem 1rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.finance-kpi__card--income[_ngcontent-%COMP%] {\n  border-color: rgba(14, 165, 233, 0.35);\n  background: rgba(14, 165, 233, 0.06);\n}\n@media (min-width: 720px) {\n  .finance-kpi__card--wide[_ngcontent-%COMP%] {\n    grid-column: span 2;\n  }\n}\n.finance-kpi__card--net[_ngcontent-%COMP%] {\n  border-color: rgba(5, 150, 105, 0.35);\n  background: rgba(5, 150, 105, 0.06);\n}\n.finance-kpi__label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.finance-kpi__value[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  font-weight: 700;\n  color: var(--text-primary);\n  font-variant-numeric: tabular-nums;\n}\n.finance-kpi__split[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  margin-top: 0.375rem;\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n  line-height: 1.35;\n}\n.finance-kpi__split[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--text-primary);\n  font-weight: 600;\n}\n.finance-stats[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.75rem 1.25rem;\n  margin-bottom: 1rem;\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n}\n.finance-stats[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--text-primary);\n}\n.finance-note[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  font-size: 0.8125rem;\n  line-height: 1.45;\n  color: var(--text-primary);\n}\n.finance-note--muted[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n}\n.finance-note--warn[_ngcontent-%COMP%] {\n  padding: 0.625rem 0.75rem;\n  border-radius: 0.5rem;\n  border: 1px solid rgba(234, 179, 8, 0.45);\n  background: rgba(254, 252, 232, 0.8);\n  color: rgb(120, 53, 15);\n}\n.finance-stats--lessons[_ngcontent-%COMP%] {\n  padding: 0.75rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  background: rgba(248, 250, 252, 0.5);\n}\n.finance-currency-list--planned[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  border-color: rgba(99, 102, 241, 0.25);\n}\n.finance-currency-list[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  padding: 0;\n  list-style: none;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.finance-currency-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.375rem 0.75rem;\n  padding: 0.375rem 0.625rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  font-size: 0.8125rem;\n  background: var(--nav-bg);\n}\n.finance-currency-list__original[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: baseline;\n  gap: 0.25rem;\n}\n.finance-currency-list__muted[_ngcontent-%COMP%] {\n  font-size: 0.6875rem;\n  color: var(--text-secondary);\n}\n.finance-currency-list__converted[_ngcontent-%COMP%] {\n  margin-left: auto;\n  color: var(--nav-accent);\n}\n.finance-card[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n  padding: 1rem 1.125rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.finance-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  font-size: 1rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.finance-card__sub[_ngcontent-%COMP%] {\n  margin: 1rem 0 0.5rem;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n}\n.finance-dl[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.5rem;\n  margin: 0;\n}\n.finance-dl[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: baseline;\n  gap: 1rem;\n  font-size: 0.875rem;\n}\n.finance-dl[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n  font-weight: 500;\n}\n.finance-dl[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 600;\n  color: var(--text-primary);\n  font-variant-numeric: tabular-nums;\n}\n.finance-dl__highlight[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  color: rgb(5, 150, 105);\n}\n.finance-dl--compact[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  font-size: 0.8125rem;\n}\n.finance-link[_ngcontent-%COMP%] {\n  color: var(--nav-accent);\n  font-weight: 500;\n  text-decoration: underline;\n  text-underline-offset: 2px;\n}\n.finance-expenses__head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  flex-wrap: wrap;\n  margin-bottom: 0.75rem;\n}\n.finance-expenses__head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.finance-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.875rem;\n}\n.finance-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.finance-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.625rem 0.5rem;\n  text-align: left;\n  border-bottom: 1px solid var(--nav-border);\n}\n.finance-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n}\n.finance-table__num[_ngcontent-%COMP%] {\n  text-align: right;\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n}\n.finance-table__actions[_ngcontent-%COMP%] {\n  text-align: right;\n  white-space: nowrap;\n}\n.finance-expense-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  text-align: left;\n}\n@media (max-width: 640px) {\n  .finance-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .finance-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%] {\n    display: grid;\n    gap: 0.625rem;\n  }\n  .finance-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr);\n    gap: 0.375rem;\n    border: 1px solid var(--nav-border);\n    border-radius: 0.625rem;\n    padding: 0.625rem;\n    background: var(--nav-bg);\n  }\n  .finance-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: minmax(6.5rem, 40%) minmax(0, 1fr);\n    gap: 0.625rem;\n    align-items: start;\n    padding: 0;\n    border-bottom: none;\n  }\n  .finance-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]::before {\n    content: attr(data-label);\n    font-size: 0.6875rem;\n    font-weight: 600;\n    color: var(--text-secondary);\n    text-transform: uppercase;\n    letter-spacing: 0.02em;\n  }\n  .finance-table[_ngcontent-%COMP%]   .finance-table__num[_ngcontent-%COMP%], \n   .finance-table[_ngcontent-%COMP%]   .finance-table__actions[_ngcontent-%COMP%] {\n    text-align: left;\n  }\n  .finance-table[_ngcontent-%COMP%]   .finance-table__actions[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 0.25rem;\n  }\n}\n/*# sourceMappingURL=finance.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FinanceComponent, [{
    type: Component,
    args: [{ selector: "app-finance", standalone: true, imports: [FormsModule, RouterLink, AppDialogComponent, AppSelectComponent, ActivityLogPanelComponent], template: `<div class="page app-scroll-page finance-page">
  <header class="finance-header">
    <div class="finance-header__start">
      <div class="finance-header__titles">
        <h1 class="finance-header__title">{{ i18n.nav().finance }}</h1>
        <p class="finance-header__period">
          <span class="finance-header__preset">{{ periodPresetLabel() }}</span>
          @if (periodRangeLabel(); as range) {
            <span class="finance-header__range">{{ range }}</span>
          }
        </p>
      </div>
    </div>

    <div class="finance-header__actions">
      <div class="finance-toolbar">
        <div class="finance-period" role="group" [attr.aria-label]="t.periodMonth">
          <button
            type="button"
            class="finance-period__btn"
            [class.finance-period__btn--active]="periodPreset() === 'month'"
            (click)="setPeriod('month')"
          >
            {{ t.periodMonth }}
          </button>
          <button
            type="button"
            class="finance-period__btn"
            [class.finance-period__btn--active]="periodPreset() === 'year'"
            (click)="setPeriod('year')"
          >
            {{ t.periodYear }}
          </button>
          <button
            type="button"
            class="finance-period__btn"
            [class.finance-period__btn--active]="periodPreset() === 'all'"
            (click)="setPeriod('all')"
          >
            {{ t.periodAll }}
          </button>
        </div>
        <app-select
          id="finance-report-currency"
          class="finance-toolbar__currency-select"
          size="compact"
          [ngModel]="reportCurrency()"
          (ngModelChange)="setReportCurrency($event)"
          name="financeReportCurrency"
          [options]="currencySelectOptions()"
          [attr.aria-label]="t.reportCurrency"
        />
      </div>
    </div>
  </header>

  <div class="scrollable-content">
    @if (loading()) {
      <div
        class="skeleton-page finance-skeleton"
        role="status"
        aria-busy="true"
        [attr.aria-label]="t.loading"
      >
        <span class="sr-only">{{ t.loading }}</span>
        <span class="skeleton skeleton--line" style="width: 88%; max-width: 28rem"></span>
        <span
          class="skeleton skeleton--line skeleton--line-sm"
          style="width: 72%; max-width: 22rem"
        ></span>
        <div class="skeleton-kpi-grid">
          <div class="skeleton-kpi skeleton-kpi--wide">
            <span class="skeleton skeleton--line skeleton--line-sm" style="width: 55%"></span>
            <span class="skeleton skeleton--line skeleton--line-lg" style="width: 70%"></span>
            <span class="skeleton skeleton--line skeleton--line-sm" style="width: 90%"></span>
          </div>
          @for (i of skeletonKpiSlots; track i) {
            <div class="skeleton-kpi">
              <span class="skeleton skeleton--line skeleton--line-sm" style="width: 60%"></span>
              <span class="skeleton skeleton--line skeleton--line-lg" style="width: 50%"></span>
            </div>
          }
        </div>
        <div class="finance-skeleton__table">
          @for (i of skeletonLineSlots; track i) {
            <span class="skeleton skeleton--line skeleton--block"></span>
          }
        </div>
      </div>
    } @else if (error()) {
      <p class="finance-page__error">{{ error() }}</p>
    } @else if (summary(); as s) {
      <p class="finance-disclaimer">{{ t.disclaimer }}</p>
      <p class="finance-disclaimer finance-disclaimer--rates">
        {{ t.conversionNote }} <strong>{{ displayCurrency() }}</strong
        >. {{ exchangeRatesLabel() }}
      </p>

      @if (!hasLessonsInPeriod()) {
        <p class="finance-note finance-note--warn">{{ t.lessonsEmptyHint }}</p>
      }

      <section class="finance-kpi" aria-label="Summary">
        <article class="finance-kpi__card finance-kpi__card--income finance-kpi__card--wide">
          <span class="finance-kpi__label">{{ t.totalIncomeCombined }}</span>
          <strong class="finance-kpi__value">{{ formatMoney(combinedIncome()) }}</strong>
          <div class="finance-kpi__split">
            <span>
              {{ t.incomeCompletedPart }}:
              <strong>{{ formatMoney(s.income.totalIncome) }}</strong>
              ({{ s.totals.completedLessonCount }})
            </span>
            <span>
              {{ t.incomePlannedPart }}:
              <strong>{{ formatMoney(s.income.scheduledIncome) }}</strong>
              ({{ s.totals.scheduledLessonCount }})
            </span>
          </div>
        </article>
        <article class="finance-kpi__card">
          <span class="finance-kpi__label">{{ t.totalExpenses }}</span>
          <strong class="finance-kpi__value">{{ formatMoney(s.income.totalExpenses) }}</strong>
        </article>
        <article class="finance-kpi__card">
          <span class="finance-kpi__label">{{ t.grossProfit }}</span>
          <strong class="finance-kpi__value">{{ formatMoney(s.income.grossProfit) }}</strong>
        </article>
        @if (s.austria; as at) {
          <article class="finance-kpi__card finance-kpi__card--net">
            <span class="finance-kpi__label">{{ t.netProfit }}</span>
            <strong class="finance-kpi__value">{{ formatMoney(at.netProfit) }}</strong>
          </article>
        }
      </section>

      <section class="finance-stats finance-stats--lessons">
        <span
          >{{ t.totalLessons }}: <strong>{{ s.totals.lessonCount }}</strong></span
        >
        <span
          >{{ t.scheduledLessons }}: <strong>{{ s.totals.scheduledLessonCount }}</strong></span
        >
        <span
          >{{ t.completedLessons }}: <strong>{{ s.totals.completedLessonCount }}</strong></span
        >
        @if (s.totals.missedLessonCount > 0) {
          <span
            >{{ t.missedLessons }}: <strong>{{ s.totals.missedLessonCount }}</strong></span
          >
        }
        @if (s.totals.canceledLessonCount > 0) {
          <span
            >{{ t.canceledLessons }}: <strong>{{ s.totals.canceledLessonCount }}</strong></span
          >
        }
        <span
          >{{ t.lessonHours }}: <strong>{{ formatHours(s.totals.totalLessonHours) }}</strong></span
        >
        <span
          >{{ t.expensesCount }}: <strong>{{ s.totals.expenseCount }}</strong></span
        >
      </section>

      <p class="finance-note finance-note--muted">{{ t.markCompletedHint }}</p>

      @if (showMixedCurrencyNote()) {
        <p class="finance-note">{{ t.mixedCurrencyNote }}</p>
        <ul class="finance-currency-list">
          @for (row of incomeByCurrencyRows(); track row[0]) {
            <li>
              <span>{{ row[0] }}</span>
              <span class="finance-currency-list__original">
                {{ formatMoney(row[1], row[0]) }}
                <span class="finance-currency-list__muted">({{ t.originalInCurrency }})</span>
              </span>
              @if (row[0] !== displayCurrency()) {
                <strong class="finance-currency-list__converted">
                  \u2248 {{ formatMoney(convertToReport(row[1], row[0])) }}
                </strong>
              }
            </li>
          }
        </ul>
      }

      <section class="finance-card">
        <h2>{{ t.taxSection }}</h2>
        @if (s.austria; as at) {
          <dl class="finance-dl">
            <div>
              <dt>{{ t.taxableBase }}</dt>
              <dd>{{ formatMoney(at.taxableBase) }}</dd>
            </div>
            <div>
              <dt>{{ t.socialInsurance }} ({{ formatPercent(at.socialInsuranceRate) }})</dt>
              <dd>\u2212{{ formatMoney(at.socialInsurance) }}</dd>
            </div>
            <div>
              <dt>{{ t.incomeTax }}</dt>
              <dd>\u2212{{ formatMoney(at.incomeTax) }}</dd>
            </div>
            <div class="finance-dl__highlight">
              <dt>{{ t.netProfit }}</dt>
              <dd>{{ formatMoney(at.netProfit) }}</dd>
            </div>
          </dl>
        } @else {
          <p class="finance-note">{{ t.taxNotConfigured }}</p>
          <p class="finance-note">
            {{ t.taxConfigureHint }}
            <a routerLink="/app/account" class="finance-link">{{ i18n.nav().account }}</a>
          </p>
          <p class="finance-note finance-note--muted">
            {{ i18n.accountUi().taxMode }}:
            <strong>{{ i18n.taxModeLabel(s.tax_mode) }}</strong>
          </p>
        }
      </section>

      <section class="finance-card finance-expenses">
        <div class="finance-expenses__head">
          <h2>{{ t.expensesSection }}</h2>
          <button type="button" class="btn-primary" (click)="openExpenseCreate()">
            {{ t.addExpense }}
          </button>
        </div>

        @if (filteredExpenses().length === 0) {
          <p class="hint">{{ t.emptyExpenses }}</p>
        } @else {
          <div class="table-wrap">
            <table class="finance-table">
              <thead>
                <tr>
                  <th>{{ t.expenseDate }}</th>
                  <th>{{ t.expenseTitle }}</th>
                  <th>{{ t.expenseCategory }}</th>
                  <th class="finance-table__num">{{ t.expenseAmount }}</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (e of filteredExpenses(); track e._id) {
                  <tr>
                    <td [attr.data-label]="t.expenseDate">{{ e.expense_date }}</td>
                    <td [attr.data-label]="t.expenseTitle">{{ e.title }}</td>
                    <td [attr.data-label]="t.expenseCategory">{{ e.category || '\u2014' }}</td>
                    <td class="finance-table__num" [attr.data-label]="t.expenseAmount">
                      {{ formatExpenseAmount(e.amount) }}
                    </td>
                    <td class="finance-table__actions" data-label="Actions">
                      <button
                        type="button"
                        class="btn-link danger"
                        (click)="confirmDeleteExpense(e._id)"
                      >
                        {{ t.deleteExpense }}
                      </button>
                      <button type="button" class="btn-link" (click)="openExpenseEdit(e)">
                        {{ t.editExpense }}
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    }

    <app-activity-log-panel
      category="finance"
      [title]="t.activityLogSection"
      [emptyText]="t.activityLogEmpty"
      [strings]="i18n.activityLogUi()"
      [reloadTrigger]="logReloadTrigger()"
    />
  </div>
</div>

<app-dialog
  [open]="expenseFormOpen()"
  [closeOnOverlay]="false"
  [title]="expenseEditTarget() ? t.editExpense : t.addExpense"
  [cancelLabel]="t.cancel"
  [confirmLabel]="expenseSaving() ? t.saving : t.save"
  (cancel)="closeExpenseForm()"
  (confirm)="saveExpense()"
>
  <form class="finance-expense-form" (ngSubmit)="saveExpense()">
    <div class="field field--float">
      <input type="text" [(ngModel)]="expenseForm.title" name="expTitle" required placeholder=" " />
      <label>{{ t.expenseTitle }}</label>
    </div>
    <div class="field field--float">
      <input
        type="number"
        [(ngModel)]="expenseForm.amount"
        name="expAmount"
        min="0"
        step="0.01"
        required
        placeholder=" "
      />
      <label>{{ t.expenseAmount }}</label>
    </div>
    <div class="field field--float">
      <input
        type="date"
        [(ngModel)]="expenseForm.expense_date"
        name="expDate"
        required
        placeholder=" "
      />
      <label>{{ t.expenseDate }}</label>
    </div>
    <div class="field field--float">
      <input type="text" [(ngModel)]="expenseForm.category" name="expCategory" placeholder=" " />
      <label>{{ t.expenseCategory }}</label>
    </div>
  </form>
</app-dialog>

<app-dialog
  [open]="expenseDeleteId() !== null"
  [title]="t.deleteExpense"
  [cancelLabel]="t.cancel"
  [confirmLabel]="t.deleteExpense"
  variant="error"
  (cancel)="cancelDeleteExpense()"
  (confirm)="deleteExpense()"
>
  <p>{{ t.deleteConfirm }}</p>
</app-dialog>
`, styles: ["/* src/app/features/finance/finance.component.scss */\n:host {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 0;\n  min-height: 0;\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n.finance-page__error {\n  color: rgb(220, 38, 38);\n  font-size: 0.875rem;\n}\n.finance-skeleton__table {\n  display: flex;\n  flex-direction: column;\n  gap: 0.625rem;\n  padding: 1rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.finance-header {\n  margin-bottom: 0.5rem;\n  display: flex;\n  flex-shrink: 0;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n  color: var(--text-primary);\n  box-sizing: border-box;\n}\n.finance-header__start {\n  display: flex;\n  min-width: 0;\n  align-items: center;\n  gap: 0.5rem;\n}\n.finance-header__actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.375rem;\n}\n.finance-header__titles {\n  display: flex;\n  min-width: 0;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.125rem;\n}\n.finance-header__title {\n  margin: 0;\n  font-size: 1.125rem;\n  font-weight: 700;\n  letter-spacing: -0.025em;\n  line-height: 1.2;\n}\n@media (min-width: 640px) {\n  .finance-header__title {\n    font-size: 1.375rem;\n  }\n}\n.finance-header__period {\n  display: flex;\n  min-width: 0;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.35rem 0.5rem;\n  margin: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: 1.25;\n}\n.finance-header__preset {\n  flex-shrink: 0;\n  font-size: 0.8125rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  letter-spacing: 0.02em;\n  color: var(--nav-accent);\n}\n@media (min-width: 640px) {\n  .finance-header__preset {\n    font-size: 0.875rem;\n  }\n}\n.finance-header__range {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  color: var(--text-primary);\n  text-transform: capitalize;\n}\n.finance-toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.375rem;\n}\n.finance-toolbar__currency-select {\n  width: min(7.5rem, 32vw);\n  min-width: 6.5rem;\n  flex-shrink: 0;\n}\n.finance-period {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.375rem;\n}\n.finance-period__btn {\n  padding: 0.375rem 0.75rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 999px;\n  background: var(--nav-bg);\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n  cursor: pointer;\n  transition:\n    background-color 0.15s ease,\n    border-color 0.15s ease,\n    color 0.15s ease;\n}\n.finance-period__btn:hover {\n  background: var(--nav-hover);\n}\n.finance-period__btn--active {\n  border-color: var(--nav-accent);\n  background: var(--nav-active-bg);\n  color: var(--nav-accent);\n  font-weight: 600;\n}\n.finance-disclaimer {\n  margin: 0 0 0.5rem;\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n  line-height: 1.4;\n}\n.finance-disclaimer--rates {\n  margin-bottom: 1rem;\n}\n.finance-kpi {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.75rem;\n  margin-bottom: 1rem;\n}\n@media (min-width: 900px) {\n  .finance-kpi {\n    grid-template-columns: repeat(5, minmax(0, 1fr));\n  }\n}\n@media (min-width: 720px) and (max-width: 899px) {\n  .finance-kpi {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n}\n.finance-kpi__card {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  padding: 0.875rem 1rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.finance-kpi__card--income {\n  border-color: rgba(14, 165, 233, 0.35);\n  background: rgba(14, 165, 233, 0.06);\n}\n@media (min-width: 720px) {\n  .finance-kpi__card--wide {\n    grid-column: span 2;\n  }\n}\n.finance-kpi__card--net {\n  border-color: rgba(5, 150, 105, 0.35);\n  background: rgba(5, 150, 105, 0.06);\n}\n.finance-kpi__label {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.finance-kpi__value {\n  font-size: 1.125rem;\n  font-weight: 700;\n  color: var(--text-primary);\n  font-variant-numeric: tabular-nums;\n}\n.finance-kpi__split {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  margin-top: 0.375rem;\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n  line-height: 1.35;\n}\n.finance-kpi__split strong {\n  color: var(--text-primary);\n  font-weight: 600;\n}\n.finance-stats {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.75rem 1.25rem;\n  margin-bottom: 1rem;\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n}\n.finance-stats strong {\n  color: var(--text-primary);\n}\n.finance-note {\n  margin: 0 0 0.75rem;\n  font-size: 0.8125rem;\n  line-height: 1.45;\n  color: var(--text-primary);\n}\n.finance-note--muted {\n  color: var(--text-secondary);\n}\n.finance-note--warn {\n  padding: 0.625rem 0.75rem;\n  border-radius: 0.5rem;\n  border: 1px solid rgba(234, 179, 8, 0.45);\n  background: rgba(254, 252, 232, 0.8);\n  color: rgb(120, 53, 15);\n}\n.finance-stats--lessons {\n  padding: 0.75rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  background: rgba(248, 250, 252, 0.5);\n}\n.finance-currency-list--planned li {\n  border-color: rgba(99, 102, 241, 0.25);\n}\n.finance-currency-list {\n  margin: 0 0 1rem;\n  padding: 0;\n  list-style: none;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.finance-currency-list li {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.375rem 0.75rem;\n  padding: 0.375rem 0.625rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  font-size: 0.8125rem;\n  background: var(--nav-bg);\n}\n.finance-currency-list__original {\n  display: inline-flex;\n  align-items: baseline;\n  gap: 0.25rem;\n}\n.finance-currency-list__muted {\n  font-size: 0.6875rem;\n  color: var(--text-secondary);\n}\n.finance-currency-list__converted {\n  margin-left: auto;\n  color: var(--nav-accent);\n}\n.finance-card {\n  margin-bottom: 1rem;\n  padding: 1rem 1.125rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.finance-card h2 {\n  margin: 0 0 0.75rem;\n  font-size: 1rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.finance-card__sub {\n  margin: 1rem 0 0.5rem;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n}\n.finance-dl {\n  display: grid;\n  gap: 0.5rem;\n  margin: 0;\n}\n.finance-dl div {\n  display: flex;\n  justify-content: space-between;\n  align-items: baseline;\n  gap: 1rem;\n  font-size: 0.875rem;\n}\n.finance-dl dt {\n  color: var(--text-secondary);\n  font-weight: 500;\n}\n.finance-dl dd {\n  margin: 0;\n  font-weight: 600;\n  color: var(--text-primary);\n  font-variant-numeric: tabular-nums;\n}\n.finance-dl__highlight dd {\n  color: rgb(5, 150, 105);\n}\n.finance-dl--compact div {\n  font-size: 0.8125rem;\n}\n.finance-link {\n  color: var(--nav-accent);\n  font-weight: 500;\n  text-decoration: underline;\n  text-underline-offset: 2px;\n}\n.finance-expenses__head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  flex-wrap: wrap;\n  margin-bottom: 0.75rem;\n}\n.finance-expenses__head h2 {\n  margin: 0;\n}\n.finance-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.875rem;\n}\n.finance-table th,\n.finance-table td {\n  padding: 0.625rem 0.5rem;\n  text-align: left;\n  border-bottom: 1px solid var(--nav-border);\n}\n.finance-table th {\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n}\n.finance-table__num {\n  text-align: right;\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n}\n.finance-table__actions {\n  text-align: right;\n  white-space: nowrap;\n}\n.finance-expense-form {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  text-align: left;\n}\n@media (max-width: 640px) {\n  .finance-table thead {\n    display: none;\n  }\n  .finance-table tbody {\n    display: grid;\n    gap: 0.625rem;\n  }\n  .finance-table tr {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr);\n    gap: 0.375rem;\n    border: 1px solid var(--nav-border);\n    border-radius: 0.625rem;\n    padding: 0.625rem;\n    background: var(--nav-bg);\n  }\n  .finance-table td {\n    display: grid;\n    grid-template-columns: minmax(6.5rem, 40%) minmax(0, 1fr);\n    gap: 0.625rem;\n    align-items: start;\n    padding: 0;\n    border-bottom: none;\n  }\n  .finance-table td::before {\n    content: attr(data-label);\n    font-size: 0.6875rem;\n    font-weight: 600;\n    color: var(--text-secondary);\n    text-transform: uppercase;\n    letter-spacing: 0.02em;\n  }\n  .finance-table .finance-table__num,\n  .finance-table .finance-table__actions {\n    text-align: left;\n  }\n  .finance-table .finance-table__actions {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 0.25rem;\n  }\n}\n/*# sourceMappingURL=finance.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FinanceComponent, { className: "FinanceComponent", filePath: "app/features/finance/finance.component.ts", lineNumber: 34 });
})();
export {
  FinanceComponent
};
//# sourceMappingURL=chunk-ZWOTSA75.js.map
