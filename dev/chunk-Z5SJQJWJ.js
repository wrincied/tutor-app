import {
  UserService
} from "./chunk-ODVTALVQ.js";
import {
  Injectable,
  Subject,
  __spreadProps,
  __spreadValues,
  catchError,
  computed,
  debounceTime,
  inject,
  of,
  setClassMetadata,
  signal,
  switchMap,
  tap,
  ɵɵdefineInjectable
} from "./chunk-27NINFBT.js";

// src/app/core/utils/user-workspace-settings.ts
var WORKSPACE_CURRENCIES = ["EUR", "USD", "RUB", "BYN"];
var WORKSPACE_LESSON_DURATIONS = [45, 60, 90];
var DEFAULT_WORKSPACE = {
  name: "",
  currency: "EUR",
  defaultLessonDuration: 60
};
var DEFAULT_WORKING_HOURS = {
  start: "08:00",
  end: "21:00",
  days: [1, 2, 3, 4, 5]
};
var HOUR_OPTIONS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);
function parseHourToken(value) {
  const match = /^(\d{1,2}):00$/.exec(String(value ?? "").trim());
  if (!match) {
    return 0;
  }
  const hour = Number(match[1]);
  return hour >= 0 && hour <= 23 ? hour : 0;
}
function normalizeWorkspace(raw) {
  const data = raw && typeof raw === "object" ? raw : {};
  const currency = WORKSPACE_CURRENCIES.includes(data["currency"]) ? data["currency"] : DEFAULT_WORKSPACE.currency;
  const durationNum = Number(data["defaultLessonDuration"]);
  const defaultLessonDuration = WORKSPACE_LESSON_DURATIONS.includes(durationNum) ? durationNum : DEFAULT_WORKSPACE.defaultLessonDuration;
  return {
    name: String(data["name"] ?? "").trim().slice(0, 120),
    currency,
    defaultLessonDuration
  };
}
function normalizeWorkingHours(raw) {
  const data = raw && typeof raw === "object" ? raw : {};
  let start = parseHourToken(String(data["start"] ?? DEFAULT_WORKING_HOURS.start));
  let end = parseHourToken(String(data["end"] ?? DEFAULT_WORKING_HOURS.end));
  if (end <= start) {
    start = parseHourToken(DEFAULT_WORKING_HOURS.start);
    end = parseHourToken(DEFAULT_WORKING_HOURS.end);
  }
  const daysRaw = Array.isArray(data["days"]) ? data["days"] : DEFAULT_WORKING_HOURS.days;
  const days = daysRaw.map((d) => Number(d)).filter((d) => d >= 1 && d <= 7);
  const uniqueDays = [...new Set(days)].sort((a, b) => a - b);
  return {
    start: `${String(start).padStart(2, "0")}:00`,
    end: `${String(end).padStart(2, "0")}:00`,
    days: uniqueDays.length > 0 ? uniqueDays : [...DEFAULT_WORKING_HOURS.days]
  };
}
function buildGridHours(start, end) {
  const startHour = parseHourToken(start);
  const endHour = parseHourToken(end);
  if (endHour <= startHour) {
    return Array.from({ length: 24 }, (_, i) => i);
  }
  return Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
}

// src/app/core/services/user-profile-settings.service.ts
var UserProfileSettingsService = class _UserProfileSettingsService {
  userSvc = inject(UserService);
  profile = signal(null, ...ngDevMode ? [{ debugName: "profile" }] : (
    /* istanbul ignore next */
    []
  ));
  saveQueue$ = new Subject();
  workspace = computed(() => normalizeWorkspace(this.profile()?.workspace), ...ngDevMode ? [{ debugName: "workspace" }] : (
    /* istanbul ignore next */
    []
  ));
  workingHours = computed(() => normalizeWorkingHours(this.profile()?.workingHours), ...ngDevMode ? [{ debugName: "workingHours" }] : (
    /* istanbul ignore next */
    []
  ));
  gridStartHour = computed(() => parseHourToken(this.workingHours().start), ...ngDevMode ? [{ debugName: "gridStartHour" }] : (
    /* istanbul ignore next */
    []
  ));
  gridEndHour = computed(() => parseHourToken(this.workingHours().end), ...ngDevMode ? [{ debugName: "gridEndHour" }] : (
    /* istanbul ignore next */
    []
  ));
  gridHours = computed(() => buildGridHours(this.workingHours().start, this.workingHours().end), ...ngDevMode ? [{ debugName: "gridHours" }] : (
    /* istanbul ignore next */
    []
  ));
  hourSelectOptions = HOUR_OPTIONS.map((value) => ({ value, label: value }));
  constructor() {
    this.saveQueue$.pipe(debounceTime(500), switchMap((payload) => this.userSvc.updateProfile(payload).pipe(tap((user) => this.profile.set(user)), catchError(() => of(null))))).subscribe();
  }
  hydrate(user) {
    this.profile.set(user);
  }
  loadProfile() {
    return this.userSvc.getProfile().pipe(tap((user) => this.hydrate(user)));
  }
  updateWorkspaceName(name) {
    const next = __spreadProps(__spreadValues({}, this.workspace()), { name: name.trim().slice(0, 120) });
    this.patchProfile({ workspace: next });
  }
  updateWorkspaceCurrency(currency) {
    this.patchProfile({ workspace: __spreadProps(__spreadValues({}, this.workspace()), { currency }) });
  }
  updateWorkspaceDuration(defaultLessonDuration) {
    this.patchProfile({ workspace: __spreadProps(__spreadValues({}, this.workspace()), { defaultLessonDuration }) });
  }
  updateWorkingHoursStart(start) {
    const next = __spreadProps(__spreadValues({}, this.workingHours()), { start });
    this.patchProfile({ workingHours: this.clampWorkingHours(next) });
  }
  updateWorkingHoursEnd(end) {
    const next = __spreadProps(__spreadValues({}, this.workingHours()), { end });
    this.patchProfile({ workingHours: this.clampWorkingHours(next) });
  }
  toggleWorkingDay(day) {
    const current = new Set(this.workingHours().days);
    if (current.has(day)) {
      current.delete(day);
    } else {
      current.add(day);
    }
    const days = [...current].sort((a, b) => a - b);
    this.patchProfile({
      workingHours: __spreadProps(__spreadValues({}, this.workingHours()), { days })
    });
  }
  isWorkingDay(date) {
    const iso = date.getDay() === 0 ? 7 : date.getDay();
    return this.workingHours().days.includes(iso);
  }
  clampWorkingHours(hours) {
    const normalized = normalizeWorkingHours(hours);
    if (parseHourToken(normalized.end) <= parseHourToken(normalized.start)) {
      return DEFAULT_WORKING_HOURS;
    }
    return normalized;
  }
  patchProfile(patch) {
    const current = this.profile();
    if (!current) {
      return;
    }
    const nextProfile = __spreadProps(__spreadValues({}, current), {
      workspace: patch.workspace ?? current.workspace,
      workingHours: patch.workingHours ?? current.workingHours
    });
    this.profile.set(nextProfile);
    this.saveQueue$.next(patch);
  }
  static \u0275fac = function UserProfileSettingsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserProfileSettingsService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UserProfileSettingsService, factory: _UserProfileSettingsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserProfileSettingsService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

export {
  WORKSPACE_CURRENCIES,
  WORKSPACE_LESSON_DURATIONS,
  UserProfileSettingsService
};
//# sourceMappingURL=chunk-Z5SJQJWJ.js.map
