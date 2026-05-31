import {
  apiUrl
} from "./chunk-EWPFDTJG.js";
import {
  Component,
  DatePipe,
  HttpClient,
  HttpParams,
  Injectable,
  Input,
  effect,
  inject,
  input,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomProperty,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-27NINFBT.js";

// src/assets/Interfaces.ts
var RATE_CURRENCIES = ["BYN", "PLN", "EUR", "USD", "RUB"];
var FINANCE_REPORT_CURRENCIES = [
  "EUR",
  "USD",
  "PLN",
  "RUB",
  "BYN",
  "KZT"
];

// src/app/core/services/activity-log.service.ts
var ActivityLogService = class _ActivityLogService {
  http = inject(HttpClient);
  getLogs(category, limit = 50) {
    const base = category === "finance" ? apiUrl("/finance") : apiUrl("/students");
    const params = new HttpParams().set("limit", String(limit));
    return this.http.get(`${base}/activity-logs`, { params });
  }
  static \u0275fac = function ActivityLogService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActivityLogService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActivityLogService, factory: _ActivityLogService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivityLogService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/utils/activity-log-format.ts
function formatValue(field, value, strings) {
  if (value == null || value === "") {
    return "\u2014";
  }
  if (field === "bot_active") {
    return value ? strings.valueOn : strings.valueOff;
  }
  if (field === "billing_type") {
    return value === "postpaid" ? strings.valuePostpaid : strings.valuePackage;
  }
  if (field === "auto_debit_enabled") {
    return value ? strings.valueOn : strings.valueOff;
  }
  if (field === "rate_per_hour") {
    return String(value);
  }
  return String(value);
}
function fieldLabel(field, strings) {
  switch (field) {
    case "name":
      return strings.fieldName;
    case "rate_per_hour":
      return strings.fieldRate;
    case "rate_currency":
      return strings.fieldRateCurrency;
    case "timezone":
      return strings.fieldTimezone;
    case "bot_active":
      return strings.fieldBotActive;
    case "balance_lessons":
      return strings.fieldBalanceLessons;
    case "billing_type":
      return strings.fieldBillingType;
    case "credit_limit":
      return strings.fieldCreditLimit;
    case "auto_debit_enabled":
      return strings.fieldAutoDebit;
    case "color_hex":
      return strings.fieldColor;
    case "title":
      return strings.fieldExpenseTitle;
    case "amount":
      return strings.fieldExpenseAmount;
    case "expense_date":
      return strings.fieldExpenseDate;
    case "category":
      return strings.fieldExpenseCategory;
    default:
      return field;
  }
}
function balanceReasonLabel(reason, strings) {
  switch (reason) {
    case "lesson_completed_delayed":
      return strings.reasonLessonCompleted;
    case "lesson_completed_postpaid":
      return strings.reasonLessonPostpaid;
    case "lesson_missed_deduct":
      return strings.reasonLessonMissed;
    case "lesson_canceled_deduct":
      return strings.reasonLessonCanceled;
    case "lesson_balance_refund":
    case "lesson_uncompleted_refund":
      return strings.reasonLessonRefund;
    case "lesson_uncompleted_postpaid_reversal":
      return strings.reasonLessonUncompleted;
    case "lesson_deleted_refund":
      return strings.reasonLessonDeleted;
    default:
      return reason ?? "";
  }
}
function formatActivityLogTitle(entry, strings) {
  const meta = entry.metadata ?? {};
  const student = entry.student_name ? `${entry.student_name}` : "";
  switch (entry.action) {
    case "expense.created":
      return `${strings.actionExpenseCreated}: \xAB${meta["title"] ?? "\u2014"}\xBB (${meta["amount"] ?? "\u2014"})`;
    case "expense.updated":
      return `${strings.actionExpenseUpdated}: \xAB${meta["title"] ?? "\u2014"}\xBB`;
    case "expense.deleted":
      return `${strings.actionExpenseDeleted}: \xAB${meta["title"] ?? "\u2014"}\xBB (${meta["amount"] ?? "\u2014"})`;
    case "student.created":
      return student ? `${strings.actionStudentCreated}: ${student}` : strings.actionStudentCreated;
    case "student.updated":
      return student ? `${strings.actionStudentUpdated}: ${student}` : strings.actionStudentUpdated;
    case "student.deleted":
      return student ? `${strings.actionStudentDeleted}: ${student}` : strings.actionStudentDeleted;
    case "student.topup": {
      const added = meta["added"];
      return student ? `${strings.actionStudentTopup}: ${student} (+${added} ${strings.lessonsUnit})` : `${strings.actionStudentTopup} (+${added} ${strings.lessonsUnit})`;
    }
    case "balance.debit": {
      const reason = balanceReasonLabel(String(meta["reason"] ?? entry.summary ?? ""), strings);
      return student ? `${strings.actionBalanceDebit}: ${student}${reason ? ` \u2014 ${reason}` : ""}` : `${strings.actionBalanceDebit}${reason ? `: ${reason}` : ""}`;
    }
    case "balance.credit": {
      const reason = balanceReasonLabel(String(meta["reason"] ?? entry.summary ?? ""), strings);
      return student ? `${strings.actionBalanceCredit}: ${student}${reason ? ` \u2014 ${reason}` : ""}` : `${strings.actionBalanceCredit}${reason ? `: ${reason}` : ""}`;
    }
    default:
      return entry.summary || entry.action;
  }
}
function formatActivityLogChanges(entry, strings) {
  return (entry.changes ?? []).filter((change) => change.field !== "balance_lessons" || entry.action.startsWith("student.")).map((change) => {
    const label = fieldLabel(change.field, strings);
    const from = formatValue(change.field, change.from, strings);
    const to = formatValue(change.field, change.to, strings);
    return `${label}: ${from} ${strings.changeArrow} ${to}`;
  });
}

// src/app/shared/activity-log-panel/activity-log-panel.component.ts
var _forTrack0 = ($index, $item) => $item._id;
function ActivityLogPanelComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 2);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.strings().loading);
  }
}
function ActivityLogPanelComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function ActivityLogPanelComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 2);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.emptyText());
  }
}
function ActivityLogPanelComponent_Conditional_6_For_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "time", 8);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const entry_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275domProperty("dateTime", entry_r2.createdAt);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(2, 2, entry_r2.createdAt, "dd.MM.yyyy HH:mm"), " ");
  }
}
function ActivityLogPanelComponent_Conditional_6_For_2_Conditional_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const line_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(line_r3);
  }
}
function ActivityLogPanelComponent_Conditional_6_For_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "ul", 9);
    \u0275\u0275repeaterCreate(1, ActivityLogPanelComponent_Conditional_6_For_2_Conditional_5_For_2_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const entry_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.entryChanges(entry_r2));
  }
}
function ActivityLogPanelComponent_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "li", 5)(1, "div", 6)(2, "span", 7);
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(4, ActivityLogPanelComponent_Conditional_6_For_2_Conditional_4_Template, 3, 5, "time", 8);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(5, ActivityLogPanelComponent_Conditional_6_For_2_Conditional_5_Template, 3, 0, "ul", 9);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const entry_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.entryTitle(entry_r2));
    \u0275\u0275advance();
    \u0275\u0275conditional(entry_r2.createdAt ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.entryChanges(entry_r2).length ? 5 : -1);
  }
}
function ActivityLogPanelComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "ul", 4);
    \u0275\u0275repeaterCreate(1, ActivityLogPanelComponent_Conditional_6_For_2_Template, 6, 3, "li", 5, _forTrack0);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.entries());
  }
}
var ActivityLogPanelComponent = class _ActivityLogPanelComponent {
  logSvc = inject(ActivityLogService);
  category = input.required(...ngDevMode ? [{ debugName: "category" }] : (
    /* istanbul ignore next */
    []
  ));
  title = input.required(...ngDevMode ? [{ debugName: "title" }] : (
    /* istanbul ignore next */
    []
  ));
  emptyText = input.required(...ngDevMode ? [{ debugName: "emptyText" }] : (
    /* istanbul ignore next */
    []
  ));
  strings = input.required(...ngDevMode ? [{ debugName: "strings" }] : (
    /* istanbul ignore next */
    []
  ));
  reloadTrigger = input(0, ...ngDevMode ? [{ debugName: "reloadTrigger" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : (
    /* istanbul ignore next */
    []
  ));
  entries = signal([], ...ngDevMode ? [{ debugName: "entries" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      this.category();
      this.reloadTrigger();
      this.load();
    });
  }
  entryTitle(entry) {
    return formatActivityLogTitle(entry, this.strings());
  }
  entryChanges(entry) {
    return formatActivityLogChanges(entry, this.strings());
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.logSvc.getLogs(this.category()).subscribe({
      next: (rows) => {
        this.entries.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.strings().loadError);
        this.loading.set(false);
      }
    });
  }
  static \u0275fac = function ActivityLogPanelComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActivityLogPanelComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ActivityLogPanelComponent, selectors: [["app-activity-log-panel"]], inputs: { category: [1, "category"], title: [1, "title"], emptyText: [1, "emptyText"], strings: [1, "strings"], reloadTrigger: [1, "reloadTrigger"] }, decls: 7, vars: 3, consts: [[1, "activity-log"], [1, "activity-log__title"], [1, "activity-log__hint"], ["role", "alert", 1, "activity-log__error"], [1, "activity-log__list"], [1, "activity-log__item"], [1, "activity-log__row"], [1, "activity-log__text"], [1, "activity-log__time", 3, "dateTime"], [1, "activity-log__changes"]], template: function ActivityLogPanelComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "section", 0)(1, "h2", 1);
      \u0275\u0275text(2);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(3, ActivityLogPanelComponent_Conditional_3_Template, 2, 1, "p", 2)(4, ActivityLogPanelComponent_Conditional_4_Template, 2, 1, "p", 3)(5, ActivityLogPanelComponent_Conditional_5_Template, 2, 1, "p", 2)(6, ActivityLogPanelComponent_Conditional_6_Template, 3, 0, "ul", 4);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275attribute("aria-label", ctx.title());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.title());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 3 : ctx.error() ? 4 : ctx.entries().length === 0 ? 5 : 6);
    }
  }, dependencies: [DatePipe], styles: ["\n.activity-log[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n  padding-top: 1.5rem;\n  border-top: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.08));\n}\n.activity-log__title[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  font-size: 1.125rem;\n  font-weight: 600;\n}\n.activity-log__hint[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--text-muted, #666);\n  font-size: 0.9375rem;\n}\n.activity-log__error[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--danger, #c62828);\n  font-size: 0.9375rem;\n}\n.activity-log__list[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.activity-log__item[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  border-radius: 0.5rem;\n  background: var(--surface-elevated, rgba(0, 0, 0, 0.03));\n}\n.activity-log__row[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 0.5rem 1rem;\n}\n.activity-log__text[_ngcontent-%COMP%] {\n  font-size: 0.9375rem;\n  font-weight: 500;\n}\n.activity-log__time[_ngcontent-%COMP%] {\n  font-size: 0.8125rem;\n  color: var(--text-muted, #666);\n  white-space: nowrap;\n}\n.activity-log__changes[_ngcontent-%COMP%] {\n  margin: 0.5rem 0 0;\n  padding-left: 1rem;\n  font-size: 0.875rem;\n  color: var(--text-muted, #666);\n}\n.activity-log__changes[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]    + li[_ngcontent-%COMP%] {\n  margin-top: 0.25rem;\n}\n/*# sourceMappingURL=activity-log-panel.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivityLogPanelComponent, [{
    type: Component,
    args: [{ selector: "app-activity-log-panel", standalone: true, imports: [DatePipe], template: `<section class="activity-log" [attr.aria-label]="title()">\r
  <h2 class="activity-log__title">{{ title() }}</h2>\r
\r
  @if (loading()) {\r
    <p class="activity-log__hint">{{ strings().loading }}</p>\r
  } @else if (error()) {\r
    <p class="activity-log__error" role="alert">{{ error() }}</p>\r
  } @else if (entries().length === 0) {\r
    <p class="activity-log__hint">{{ emptyText() }}</p>\r
  } @else {\r
    <ul class="activity-log__list">\r
      @for (entry of entries(); track entry._id) {\r
        <li class="activity-log__item">\r
          <div class="activity-log__row">\r
            <span class="activity-log__text">{{ entryTitle(entry) }}</span>\r
            @if (entry.createdAt) {\r
              <time class="activity-log__time" [dateTime]="entry.createdAt">\r
                {{ entry.createdAt | date: 'dd.MM.yyyy HH:mm' }}\r
              </time>\r
            }\r
          </div>\r
          @if (entryChanges(entry).length) {\r
            <ul class="activity-log__changes">\r
              @for (line of entryChanges(entry); track line) {\r
                <li>{{ line }}</li>\r
              }\r
            </ul>\r
          }\r
        </li>\r
      }\r
    </ul>\r
  }\r
</section>\r
`, styles: ["/* src/app/shared/activity-log-panel/activity-log-panel.component.scss */\n.activity-log {\n  margin-top: 2rem;\n  padding-top: 1.5rem;\n  border-top: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.08));\n}\n.activity-log__title {\n  margin: 0 0 1rem;\n  font-size: 1.125rem;\n  font-weight: 600;\n}\n.activity-log__hint {\n  margin: 0;\n  color: var(--text-muted, #666);\n  font-size: 0.9375rem;\n}\n.activity-log__error {\n  margin: 0;\n  color: var(--danger, #c62828);\n  font-size: 0.9375rem;\n}\n.activity-log__list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.activity-log__item {\n  padding: 0.75rem 1rem;\n  border-radius: 0.5rem;\n  background: var(--surface-elevated, rgba(0, 0, 0, 0.03));\n}\n.activity-log__row {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 0.5rem 1rem;\n}\n.activity-log__text {\n  font-size: 0.9375rem;\n  font-weight: 500;\n}\n.activity-log__time {\n  font-size: 0.8125rem;\n  color: var(--text-muted, #666);\n  white-space: nowrap;\n}\n.activity-log__changes {\n  margin: 0.5rem 0 0;\n  padding-left: 1rem;\n  font-size: 0.875rem;\n  color: var(--text-muted, #666);\n}\n.activity-log__changes li + li {\n  margin-top: 0.25rem;\n}\n/*# sourceMappingURL=activity-log-panel.component.css.map */\n"] }]
  }], () => [], { category: [{ type: Input, args: [{ isSignal: true, alias: "category", required: true }] }], title: [{ type: Input, args: [{ isSignal: true, alias: "title", required: true }] }], emptyText: [{ type: Input, args: [{ isSignal: true, alias: "emptyText", required: true }] }], strings: [{ type: Input, args: [{ isSignal: true, alias: "strings", required: true }] }], reloadTrigger: [{ type: Input, args: [{ isSignal: true, alias: "reloadTrigger", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ActivityLogPanelComponent, { className: "ActivityLogPanelComponent", filePath: "app/shared/activity-log-panel/activity-log-panel.component.ts", lineNumber: 20 });
})();

export {
  RATE_CURRENCIES,
  FINANCE_REPORT_CURRENCIES,
  ActivityLogPanelComponent
};
//# sourceMappingURL=chunk-EGMZHRVQ.js.map
