import {
  apiUrl
} from "./chunk-ZSKR65RV.js";
import {
  HttpClient,
  HttpParams,
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-27NINFBT.js";

// src/app/core/services/finance.service.ts
var API = apiUrl("/finance");
var FinanceService = class _FinanceService {
  http = inject(HttpClient);
  getSummary(period) {
    let params = new HttpParams();
    if (period?.from) {
      params = params.set("from", period.from);
    }
    if (period?.to) {
      params = params.set("to", period.to);
    }
    if (period?.currency) {
      params = params.set("currency", period.currency);
    }
    return this.http.get(`${API}/summary`, { params });
  }
  getExpenses() {
    return this.http.get(`${API}/expenses`);
  }
  createExpense(payload) {
    return this.http.post(`${API}/expenses`, payload);
  }
  updateExpense(id, payload) {
    return this.http.put(`${API}/expenses/${id}`, payload);
  }
  removeExpense(id) {
    return this.http.delete(`${API}/expenses/${id}`);
  }
  static \u0275fac = function FinanceService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FinanceService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FinanceService, factory: _FinanceService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FinanceService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/utils/finance-period.ts
function toIsoDate(d) {
  return d.toISOString().slice(0, 10);
}
function toIsoDateLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function financeTodayRange(now = /* @__PURE__ */ new Date()) {
  const iso = toIsoDateLocal(now);
  return { from: iso, to: iso };
}
function financePeriodRange(preset, now = /* @__PURE__ */ new Date()) {
  if (preset === "all") {
    return {};
  }
  if (preset === "month") {
    const from2 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const to2 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
    return { from: toIsoDate(from2), to: toIsoDate(to2) };
  }
  const from = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const to = new Date(Date.UTC(now.getUTCFullYear(), 11, 31));
  return { from: toIsoDate(from), to: toIsoDate(to) };
}

export {
  FinanceService,
  financeTodayRange,
  financePeriodRange
};
//# sourceMappingURL=chunk-NZVDDRVQ.js.map
