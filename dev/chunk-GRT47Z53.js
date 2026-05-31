import {
  DEFAULT_STUDENT_BORDER_COLOR,
  StudentService
} from "./chunk-3SKD4CQG.js";
import {
  UserProfileSettingsService
} from "./chunk-Z5SJQJWJ.js";
import {
  AppSelectComponent
} from "./chunk-VZTTL7NS.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NumberValueAccessor,
  ɵNgNoValidate
} from "./chunk-3XYGRFFE.js";
import {
  AppDialogComponent
} from "./chunk-FZY3AIGP.js";
import "./chunk-JKSU2LPC.js";
import {
  purgeStaleOverlayLayers
} from "./chunk-MFN2ATQX.js";
import {
  APP_OVERLAY_LAYER_OPEN
} from "./chunk-Z5FPAOY7.js";
import "./chunk-ODVTALVQ.js";
import "./chunk-VVVNTCL2.js";
import {
  apiUrl
} from "./chunk-ZSKR65RV.js";
import "./chunk-HPUTEZXI.js";
import {
  Component,
  CurrencyPipe,
  DOCUMENT,
  DestroyRef,
  HttpClient,
  HttpParams,
  I18nService,
  Injectable,
  Injector,
  NgTemplateOutlet,
  PLATFORM_ID,
  ViewChild,
  __assign,
  __extends,
  __spreadArray,
  __spreadProps,
  __spreadValues,
  afterNextRender,
  computed,
  effect,
  inject,
  isPlatformBrowser,
  setClassMetadata,
  signal,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵanimateEnter,
  ɵɵanimateLeave,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind4,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryAdvance,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuerySignal
} from "./chunk-27NINFBT.js";

// src/app/core/utils/calendar-last-paid-lesson.ts
function isPackageStudentWithLastBalance(student) {
  const billingType = String(student.billing_type ?? "package");
  if (billingType !== "package") {
    return false;
  }
  return Number(student.balance_lessons) === 1;
}
function isLessonBillingProcessed(lesson) {
  if (lesson.billing_processed !== void 0) {
    return Boolean(lesson.billing_processed);
  }
  return Boolean(lesson.balance_debited);
}
function isEligibleForLastPaidMarker(lesson) {
  if (!lesson.scheduledAt?.trim()) {
    return false;
  }
  if (Number.isNaN(Date.parse(lesson.scheduledAt))) {
    return false;
  }
  if (lesson.status === "scheduled") {
    return true;
  }
  if (lesson.status === "completed") {
    return !isLessonBillingProcessed(lesson);
  }
  return false;
}
function isScheduledAtNowOrFuture(lesson, now) {
  const startMs = Date.parse(lesson.scheduledAt);
  if (Number.isNaN(startMs)) {
    return false;
  }
  return startMs >= now.getTime();
}
function compareByScheduledAt(a, b) {
  return Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt);
}
function enrichLessonsWithLastPaidMarker(lessons, students, asOf = /* @__PURE__ */ new Date()) {
  const now = asOf;
  const studentsById = new Map(students.map((student) => [student._id, student]));
  const lastPaidIdByStudent = /* @__PURE__ */ new Map();
  const poolByStudent = /* @__PURE__ */ new Map();
  for (const lesson of lessons) {
    const studentId = lesson.student_id;
    if (!studentId) {
      continue;
    }
    const student = studentsById.get(studentId);
    if (!student || !isPackageStudentWithLastBalance(student)) {
      continue;
    }
    if (!isEligibleForLastPaidMarker(lesson)) {
      continue;
    }
    if (!isScheduledAtNowOrFuture(lesson, now)) {
      continue;
    }
    const pool = poolByStudent.get(studentId) ?? [];
    pool.push(lesson);
    poolByStudent.set(studentId, pool);
  }
  for (const [studentId, pool] of poolByStudent) {
    const earliest = [...pool].sort(compareByScheduledAt)[0];
    if (earliest) {
      lastPaidIdByStudent.set(studentId, earliest._id);
    }
  }
  return lessons.map((lesson) => __spreadProps(__spreadValues({}, lesson), {
    isLastPaid: Boolean(lesson.student_id && lastPaidIdByStudent.get(lesson.student_id) === lesson._id)
  }));
}

// src/app/core/services/calendar-lesson-display.service.ts
var CalendarLessonDisplayService = class _CalendarLessonDisplayService {
  /** Обогащение уроков UI-флагом перед отрисовкой сетки календаря. */
  enrichForGrid(lessons, students) {
    return enrichLessonsWithLastPaidMarker(lessons, students);
  }
  static \u0275fac = function CalendarLessonDisplayService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CalendarLessonDisplayService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CalendarLessonDisplayService, factory: _CalendarLessonDisplayService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalendarLessonDisplayService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/services/lesson.service.ts
var API = apiUrl("/lessons");
var LessonService = class _LessonService {
  http = inject(HttpClient);
  /** GET /api/lessons */
  getAll() {
    return this.http.get(API);
  }
  /** POST /api/lessons — цена snapshot на сервере из профиля ученика */
  create(payload) {
    return this.http.post(API, payload);
  }
  /** PUT /api/lessons/:id — снапшот цены только на сервере; при смене student_id переснимается */
  update(id, payload) {
    return this.http.put(`${API}/${id}`, payload);
  }
  /** POST /api/lessons/:id/cancel-with-billing — атомарная смена статуса и баланса */
  cancelWithBilling(id, payload) {
    return this.http.post(`${API}/${id}/cancel-with-billing`, payload);
  }
  /** DELETE /api/lessons/:id — series (204) или одно вхождение (200 + обновлённый урок). */
  delete(id, options) {
    let params = new HttpParams();
    if (options?.scope === "occurrence" && options.occurrenceDate) {
      params = params.set("scope", "occurrence").set("occurrence_date", options.occurrenceDate);
    }
    return this.http.delete(`${API}/${id}`, { params });
  }
  static \u0275fac = function LessonService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LessonService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LessonService, factory: _LessonService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LessonService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// node_modules/rrule/dist/esm/weekday.js
var ALL_WEEKDAYS = [
  "MO",
  "TU",
  "WE",
  "TH",
  "FR",
  "SA",
  "SU"
];
var Weekday = (
  /** @class */
  (function() {
    function Weekday2(weekday, n) {
      if (n === 0)
        throw new Error("Can't create weekday with n == 0");
      this.weekday = weekday;
      this.n = n;
    }
    Weekday2.fromStr = function(str) {
      return new Weekday2(ALL_WEEKDAYS.indexOf(str));
    };
    Weekday2.prototype.nth = function(n) {
      return this.n === n ? this : new Weekday2(this.weekday, n);
    };
    Weekday2.prototype.equals = function(other) {
      return this.weekday === other.weekday && this.n === other.n;
    };
    Weekday2.prototype.toString = function() {
      var s = ALL_WEEKDAYS[this.weekday];
      if (this.n)
        s = (this.n > 0 ? "+" : "") + String(this.n) + s;
      return s;
    };
    Weekday2.prototype.getJsWeekday = function() {
      return this.weekday === 6 ? 0 : this.weekday + 1;
    };
    return Weekday2;
  })()
);

// node_modules/rrule/dist/esm/helpers.js
var isPresent = function(value) {
  return value !== null && value !== void 0;
};
var isNumber = function(value) {
  return typeof value === "number";
};
var isWeekdayStr = function(value) {
  return typeof value === "string" && ALL_WEEKDAYS.includes(value);
};
var isArray = Array.isArray;
var range = function(start, end) {
  if (end === void 0) {
    end = start;
  }
  if (arguments.length === 1) {
    end = start;
    start = 0;
  }
  var rang = [];
  for (var i = start; i < end; i++)
    rang.push(i);
  return rang;
};
var repeat = function(value, times) {
  var i = 0;
  var array = [];
  if (isArray(value)) {
    for (; i < times; i++)
      array[i] = [].concat(value);
  } else {
    for (; i < times; i++)
      array[i] = value;
  }
  return array;
};
var toArray = function(item) {
  if (isArray(item)) {
    return item;
  }
  return [item];
};
function padStart(item, targetLength, padString) {
  if (padString === void 0) {
    padString = " ";
  }
  var str = String(item);
  targetLength = targetLength >> 0;
  if (str.length > targetLength) {
    return String(str);
  }
  targetLength = targetLength - str.length;
  if (targetLength > padString.length) {
    padString += repeat(padString, targetLength / padString.length);
  }
  return padString.slice(0, targetLength) + String(str);
}
var split = function(str, sep, num) {
  var splits = str.split(sep);
  return num ? splits.slice(0, num).concat([splits.slice(num).join(sep)]) : splits;
};
var pymod = function(a, b) {
  var r = a % b;
  return r * b < 0 ? r + b : r;
};
var divmod = function(a, b) {
  return { div: Math.floor(a / b), mod: pymod(a, b) };
};
var empty = function(obj) {
  return !isPresent(obj) || obj.length === 0;
};
var notEmpty = function(obj) {
  return !empty(obj);
};
var includes = function(arr, val) {
  return notEmpty(arr) && arr.indexOf(val) !== -1;
};

// node_modules/rrule/dist/esm/dateutil.js
var datetime = function(y, m, d, h, i, s) {
  if (h === void 0) {
    h = 0;
  }
  if (i === void 0) {
    i = 0;
  }
  if (s === void 0) {
    s = 0;
  }
  return new Date(Date.UTC(y, m - 1, d, h, i, s));
};
var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var ONE_DAY = 1e3 * 60 * 60 * 24;
var MAXYEAR = 9999;
var ORDINAL_BASE = datetime(1970, 1, 1);
var PY_WEEKDAYS = [6, 0, 1, 2, 3, 4, 5];
var isLeapYear = function(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
};
var isDate = function(value) {
  return value instanceof Date;
};
var isValidDate = function(value) {
  return isDate(value) && !isNaN(value.getTime());
};
var daysBetween = function(date1, date2) {
  var date1ms = date1.getTime();
  var date2ms = date2.getTime();
  var differencems = date1ms - date2ms;
  return Math.round(differencems / ONE_DAY);
};
var toOrdinal = function(date) {
  return daysBetween(date, ORDINAL_BASE);
};
var fromOrdinal = function(ordinal) {
  return new Date(ORDINAL_BASE.getTime() + ordinal * ONE_DAY);
};
var getMonthDays = function(date) {
  var month = date.getUTCMonth();
  return month === 1 && isLeapYear(date.getUTCFullYear()) ? 29 : MONTH_DAYS[month];
};
var getWeekday = function(date) {
  return PY_WEEKDAYS[date.getUTCDay()];
};
var monthRange = function(year, month) {
  var date = datetime(year, month + 1, 1);
  return [getWeekday(date), getMonthDays(date)];
};
var combine = function(date, time) {
  time = time || date;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds()));
};
var clone = function(date) {
  var dolly = new Date(date.getTime());
  return dolly;
};
var cloneDates = function(dates) {
  var clones = [];
  for (var i = 0; i < dates.length; i++) {
    clones.push(clone(dates[i]));
  }
  return clones;
};
var sort = function(dates) {
  dates.sort(function(a, b) {
    return a.getTime() - b.getTime();
  });
};
var timeToUntilString = function(time, utc) {
  if (utc === void 0) {
    utc = true;
  }
  var date = new Date(time);
  return [
    padStart(date.getUTCFullYear().toString(), 4, "0"),
    padStart(date.getUTCMonth() + 1, 2, "0"),
    padStart(date.getUTCDate(), 2, "0"),
    "T",
    padStart(date.getUTCHours(), 2, "0"),
    padStart(date.getUTCMinutes(), 2, "0"),
    padStart(date.getUTCSeconds(), 2, "0"),
    utc ? "Z" : ""
  ].join("");
};
var untilStringToDate = function(until) {
  var re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/;
  var bits = re.exec(until);
  if (!bits)
    throw new Error("Invalid UNTIL value: ".concat(until));
  return new Date(Date.UTC(parseInt(bits[1], 10), parseInt(bits[2], 10) - 1, parseInt(bits[3], 10), parseInt(bits[5], 10) || 0, parseInt(bits[6], 10) || 0, parseInt(bits[7], 10) || 0));
};
var dateTZtoISO8601 = function(date, timeZone) {
  var dateStr = date.toLocaleString("sv-SE", { timeZone });
  return dateStr.replace(" ", "T") + "Z";
};
var dateInTimeZone = function(date, timeZone) {
  var localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var dateInLocalTZ = new Date(dateTZtoISO8601(date, localTimeZone));
  var dateInTargetTZ = new Date(dateTZtoISO8601(date, timeZone !== null && timeZone !== void 0 ? timeZone : "UTC"));
  var tzOffset = dateInTargetTZ.getTime() - dateInLocalTZ.getTime();
  return new Date(date.getTime() - tzOffset);
};

// node_modules/rrule/dist/esm/iterresult.js
var IterResult = (
  /** @class */
  (function() {
    function IterResult2(method, args) {
      this.minDate = null;
      this.maxDate = null;
      this._result = [];
      this.total = 0;
      this.method = method;
      this.args = args;
      if (method === "between") {
        this.maxDate = args.inc ? args.before : new Date(args.before.getTime() - 1);
        this.minDate = args.inc ? args.after : new Date(args.after.getTime() + 1);
      } else if (method === "before") {
        this.maxDate = args.inc ? args.dt : new Date(args.dt.getTime() - 1);
      } else if (method === "after") {
        this.minDate = args.inc ? args.dt : new Date(args.dt.getTime() + 1);
      }
    }
    IterResult2.prototype.accept = function(date) {
      ++this.total;
      var tooEarly = this.minDate && date < this.minDate;
      var tooLate = this.maxDate && date > this.maxDate;
      if (this.method === "between") {
        if (tooEarly)
          return true;
        if (tooLate)
          return false;
      } else if (this.method === "before") {
        if (tooLate)
          return false;
      } else if (this.method === "after") {
        if (tooEarly)
          return true;
        this.add(date);
        return false;
      }
      return this.add(date);
    };
    IterResult2.prototype.add = function(date) {
      this._result.push(date);
      return true;
    };
    IterResult2.prototype.getValue = function() {
      var res = this._result;
      switch (this.method) {
        case "all":
        case "between":
          return res;
        case "before":
        case "after":
        default:
          return res.length ? res[res.length - 1] : null;
      }
    };
    IterResult2.prototype.clone = function() {
      return new IterResult2(this.method, this.args);
    };
    return IterResult2;
  })()
);
var iterresult_default = IterResult;

// node_modules/rrule/dist/esm/callbackiterresult.js
var CallbackIterResult = (
  /** @class */
  (function(_super) {
    __extends(CallbackIterResult2, _super);
    function CallbackIterResult2(method, args, iterator) {
      var _this = _super.call(this, method, args) || this;
      _this.iterator = iterator;
      return _this;
    }
    CallbackIterResult2.prototype.add = function(date) {
      if (this.iterator(date, this._result.length)) {
        this._result.push(date);
        return true;
      }
      return false;
    };
    return CallbackIterResult2;
  })(iterresult_default)
);
var callbackiterresult_default = CallbackIterResult;

// node_modules/rrule/dist/esm/nlp/i18n.js
var ENGLISH = {
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  tokens: {
    SKIP: /^[ \r\n\t]+|^\.$/,
    number: /^[1-9][0-9]*/,
    numberAsText: /^(one|two|three)/i,
    every: /^every/i,
    "day(s)": /^days?/i,
    "weekday(s)": /^weekdays?/i,
    "week(s)": /^weeks?/i,
    "hour(s)": /^hours?/i,
    "minute(s)": /^minutes?/i,
    "month(s)": /^months?/i,
    "year(s)": /^years?/i,
    on: /^(on|in)/i,
    at: /^(at)/i,
    the: /^the/i,
    first: /^first/i,
    second: /^second/i,
    third: /^third/i,
    nth: /^([1-9][0-9]*)(\.|th|nd|rd|st)/i,
    last: /^last/i,
    for: /^for/i,
    "time(s)": /^times?/i,
    until: /^(un)?til/i,
    monday: /^mo(n(day)?)?/i,
    tuesday: /^tu(e(s(day)?)?)?/i,
    wednesday: /^we(d(n(esday)?)?)?/i,
    thursday: /^th(u(r(sday)?)?)?/i,
    friday: /^fr(i(day)?)?/i,
    saturday: /^sa(t(urday)?)?/i,
    sunday: /^su(n(day)?)?/i,
    january: /^jan(uary)?/i,
    february: /^feb(ruary)?/i,
    march: /^mar(ch)?/i,
    april: /^apr(il)?/i,
    may: /^may/i,
    june: /^june?/i,
    july: /^july?/i,
    august: /^aug(ust)?/i,
    september: /^sep(t(ember)?)?/i,
    october: /^oct(ober)?/i,
    november: /^nov(ember)?/i,
    december: /^dec(ember)?/i,
    comma: /^(,\s*|(and|or)\s*)+/i
  }
};
var i18n_default = ENGLISH;

// node_modules/rrule/dist/esm/nlp/totext.js
var contains = function(arr, val) {
  return arr.indexOf(val) !== -1;
};
var defaultGetText = function(id) {
  return id.toString();
};
var defaultDateFormatter = function(year, month, day) {
  return "".concat(month, " ").concat(day, ", ").concat(year);
};
var ToText = (
  /** @class */
  (function() {
    function ToText2(rrule, gettext, language, dateFormatter) {
      if (gettext === void 0) {
        gettext = defaultGetText;
      }
      if (language === void 0) {
        language = i18n_default;
      }
      if (dateFormatter === void 0) {
        dateFormatter = defaultDateFormatter;
      }
      this.text = [];
      this.language = language || i18n_default;
      this.gettext = gettext;
      this.dateFormatter = dateFormatter;
      this.rrule = rrule;
      this.options = rrule.options;
      this.origOptions = rrule.origOptions;
      if (this.origOptions.bymonthday) {
        var bymonthday = [].concat(this.options.bymonthday);
        var bynmonthday = [].concat(this.options.bynmonthday);
        bymonthday.sort(function(a, b) {
          return a - b;
        });
        bynmonthday.sort(function(a, b) {
          return b - a;
        });
        this.bymonthday = bymonthday.concat(bynmonthday);
        if (!this.bymonthday.length)
          this.bymonthday = null;
      }
      if (isPresent(this.origOptions.byweekday)) {
        var byweekday = !isArray(this.origOptions.byweekday) ? [this.origOptions.byweekday] : this.origOptions.byweekday;
        var days = String(byweekday);
        this.byweekday = {
          allWeeks: byweekday.filter(function(weekday) {
            return !weekday.n;
          }),
          someWeeks: byweekday.filter(function(weekday) {
            return Boolean(weekday.n);
          }),
          isWeekdays: days.indexOf("MO") !== -1 && days.indexOf("TU") !== -1 && days.indexOf("WE") !== -1 && days.indexOf("TH") !== -1 && days.indexOf("FR") !== -1 && days.indexOf("SA") === -1 && days.indexOf("SU") === -1,
          isEveryDay: days.indexOf("MO") !== -1 && days.indexOf("TU") !== -1 && days.indexOf("WE") !== -1 && days.indexOf("TH") !== -1 && days.indexOf("FR") !== -1 && days.indexOf("SA") !== -1 && days.indexOf("SU") !== -1
        };
        var sortWeekDays = function(a, b) {
          return a.weekday - b.weekday;
        };
        this.byweekday.allWeeks.sort(sortWeekDays);
        this.byweekday.someWeeks.sort(sortWeekDays);
        if (!this.byweekday.allWeeks.length)
          this.byweekday.allWeeks = null;
        if (!this.byweekday.someWeeks.length)
          this.byweekday.someWeeks = null;
      } else {
        this.byweekday = null;
      }
    }
    ToText2.isFullyConvertible = function(rrule) {
      var canConvert = true;
      if (!(rrule.options.freq in ToText2.IMPLEMENTED))
        return false;
      if (rrule.origOptions.until && rrule.origOptions.count)
        return false;
      for (var key in rrule.origOptions) {
        if (contains(["dtstart", "tzid", "wkst", "freq"], key))
          return true;
        if (!contains(ToText2.IMPLEMENTED[rrule.options.freq], key))
          return false;
      }
      return canConvert;
    };
    ToText2.prototype.isFullyConvertible = function() {
      return ToText2.isFullyConvertible(this.rrule);
    };
    ToText2.prototype.toString = function() {
      var gettext = this.gettext;
      if (!(this.options.freq in ToText2.IMPLEMENTED)) {
        return gettext("RRule error: Unable to fully convert this rrule to text");
      }
      this.text = [gettext("every")];
      this[RRule.FREQUENCIES[this.options.freq]]();
      if (this.options.until) {
        this.add(gettext("until"));
        var until = this.options.until;
        this.add(this.dateFormatter(until.getUTCFullYear(), this.language.monthNames[until.getUTCMonth()], until.getUTCDate()));
      } else if (this.options.count) {
        this.add(gettext("for")).add(this.options.count.toString()).add(this.plural(this.options.count) ? gettext("times") : gettext("time"));
      }
      if (!this.isFullyConvertible())
        this.add(gettext("(~ approximate)"));
      return this.text.join("");
    };
    ToText2.prototype.HOURLY = function() {
      var gettext = this.gettext;
      if (this.options.interval !== 1)
        this.add(this.options.interval.toString());
      this.add(this.plural(this.options.interval) ? gettext("hours") : gettext("hour"));
    };
    ToText2.prototype.MINUTELY = function() {
      var gettext = this.gettext;
      if (this.options.interval !== 1)
        this.add(this.options.interval.toString());
      this.add(this.plural(this.options.interval) ? gettext("minutes") : gettext("minute"));
    };
    ToText2.prototype.DAILY = function() {
      var gettext = this.gettext;
      if (this.options.interval !== 1)
        this.add(this.options.interval.toString());
      if (this.byweekday && this.byweekday.isWeekdays) {
        this.add(this.plural(this.options.interval) ? gettext("weekdays") : gettext("weekday"));
      } else {
        this.add(this.plural(this.options.interval) ? gettext("days") : gettext("day"));
      }
      if (this.origOptions.bymonth) {
        this.add(gettext("in"));
        this._bymonth();
      }
      if (this.bymonthday) {
        this._bymonthday();
      } else if (this.byweekday) {
        this._byweekday();
      } else if (this.origOptions.byhour) {
        this._byhour();
      }
    };
    ToText2.prototype.WEEKLY = function() {
      var gettext = this.gettext;
      if (this.options.interval !== 1) {
        this.add(this.options.interval.toString()).add(this.plural(this.options.interval) ? gettext("weeks") : gettext("week"));
      }
      if (this.byweekday && this.byweekday.isWeekdays) {
        if (this.options.interval === 1) {
          this.add(this.plural(this.options.interval) ? gettext("weekdays") : gettext("weekday"));
        } else {
          this.add(gettext("on")).add(gettext("weekdays"));
        }
      } else if (this.byweekday && this.byweekday.isEveryDay) {
        this.add(this.plural(this.options.interval) ? gettext("days") : gettext("day"));
      } else {
        if (this.options.interval === 1)
          this.add(gettext("week"));
        if (this.origOptions.bymonth) {
          this.add(gettext("in"));
          this._bymonth();
        }
        if (this.bymonthday) {
          this._bymonthday();
        } else if (this.byweekday) {
          this._byweekday();
        }
        if (this.origOptions.byhour) {
          this._byhour();
        }
      }
    };
    ToText2.prototype.MONTHLY = function() {
      var gettext = this.gettext;
      if (this.origOptions.bymonth) {
        if (this.options.interval !== 1) {
          this.add(this.options.interval.toString()).add(gettext("months"));
          if (this.plural(this.options.interval))
            this.add(gettext("in"));
        } else {
        }
        this._bymonth();
      } else {
        if (this.options.interval !== 1) {
          this.add(this.options.interval.toString());
        }
        this.add(this.plural(this.options.interval) ? gettext("months") : gettext("month"));
      }
      if (this.bymonthday) {
        this._bymonthday();
      } else if (this.byweekday && this.byweekday.isWeekdays) {
        this.add(gettext("on")).add(gettext("weekdays"));
      } else if (this.byweekday) {
        this._byweekday();
      }
    };
    ToText2.prototype.YEARLY = function() {
      var gettext = this.gettext;
      if (this.origOptions.bymonth) {
        if (this.options.interval !== 1) {
          this.add(this.options.interval.toString());
          this.add(gettext("years"));
        } else {
        }
        this._bymonth();
      } else {
        if (this.options.interval !== 1) {
          this.add(this.options.interval.toString());
        }
        this.add(this.plural(this.options.interval) ? gettext("years") : gettext("year"));
      }
      if (this.bymonthday) {
        this._bymonthday();
      } else if (this.byweekday) {
        this._byweekday();
      }
      if (this.options.byyearday) {
        this.add(gettext("on the")).add(this.list(this.options.byyearday, this.nth, gettext("and"))).add(gettext("day"));
      }
      if (this.options.byweekno) {
        this.add(gettext("in")).add(this.plural(this.options.byweekno.length) ? gettext("weeks") : gettext("week")).add(this.list(this.options.byweekno, void 0, gettext("and")));
      }
    };
    ToText2.prototype._bymonthday = function() {
      var gettext = this.gettext;
      if (this.byweekday && this.byweekday.allWeeks) {
        this.add(gettext("on")).add(this.list(this.byweekday.allWeeks, this.weekdaytext, gettext("or"))).add(gettext("the")).add(this.list(this.bymonthday, this.nth, gettext("or")));
      } else {
        this.add(gettext("on the")).add(this.list(this.bymonthday, this.nth, gettext("and")));
      }
    };
    ToText2.prototype._byweekday = function() {
      var gettext = this.gettext;
      if (this.byweekday.allWeeks && !this.byweekday.isWeekdays) {
        this.add(gettext("on")).add(this.list(this.byweekday.allWeeks, this.weekdaytext));
      }
      if (this.byweekday.someWeeks) {
        if (this.byweekday.allWeeks)
          this.add(gettext("and"));
        this.add(gettext("on the")).add(this.list(this.byweekday.someWeeks, this.weekdaytext, gettext("and")));
      }
    };
    ToText2.prototype._byhour = function() {
      var gettext = this.gettext;
      this.add(gettext("at")).add(this.list(this.origOptions.byhour, void 0, gettext("and")));
    };
    ToText2.prototype._bymonth = function() {
      this.add(this.list(this.options.bymonth, this.monthtext, this.gettext("and")));
    };
    ToText2.prototype.nth = function(n) {
      n = parseInt(n.toString(), 10);
      var nth;
      var gettext = this.gettext;
      if (n === -1)
        return gettext("last");
      var npos = Math.abs(n);
      switch (npos) {
        case 1:
        case 21:
        case 31:
          nth = npos + gettext("st");
          break;
        case 2:
        case 22:
          nth = npos + gettext("nd");
          break;
        case 3:
        case 23:
          nth = npos + gettext("rd");
          break;
        default:
          nth = npos + gettext("th");
      }
      return n < 0 ? nth + " " + gettext("last") : nth;
    };
    ToText2.prototype.monthtext = function(m) {
      return this.language.monthNames[m - 1];
    };
    ToText2.prototype.weekdaytext = function(wday) {
      var weekday = isNumber(wday) ? (wday + 1) % 7 : wday.getJsWeekday();
      return (wday.n ? this.nth(wday.n) + " " : "") + this.language.dayNames[weekday];
    };
    ToText2.prototype.plural = function(n) {
      return n % 100 !== 1;
    };
    ToText2.prototype.add = function(s) {
      this.text.push(" ");
      this.text.push(s);
      return this;
    };
    ToText2.prototype.list = function(arr, callback, finalDelim, delim) {
      var _this = this;
      if (delim === void 0) {
        delim = ",";
      }
      if (!isArray(arr)) {
        arr = [arr];
      }
      var delimJoin = function(array, delimiter, finalDelimiter) {
        var list = "";
        for (var i = 0; i < array.length; i++) {
          if (i !== 0) {
            if (i === array.length - 1) {
              list += " " + finalDelimiter + " ";
            } else {
              list += delimiter + " ";
            }
          }
          list += array[i];
        }
        return list;
      };
      callback = callback || function(o) {
        return o.toString();
      };
      var realCallback = function(arg) {
        return callback && callback.call(_this, arg);
      };
      if (finalDelim) {
        return delimJoin(arr.map(realCallback), delim, finalDelim);
      } else {
        return arr.map(realCallback).join(delim + " ");
      }
    };
    return ToText2;
  })()
);
var totext_default = ToText;

// node_modules/rrule/dist/esm/nlp/parsetext.js
var Parser = (
  /** @class */
  (function() {
    function Parser2(rules) {
      this.done = true;
      this.rules = rules;
    }
    Parser2.prototype.start = function(text) {
      this.text = text;
      this.done = false;
      return this.nextSymbol();
    };
    Parser2.prototype.isDone = function() {
      return this.done && this.symbol === null;
    };
    Parser2.prototype.nextSymbol = function() {
      var best;
      var bestSymbol;
      this.symbol = null;
      this.value = null;
      do {
        if (this.done)
          return false;
        var rule = void 0;
        best = null;
        for (var name_1 in this.rules) {
          rule = this.rules[name_1];
          var match = rule.exec(this.text);
          if (match) {
            if (best === null || match[0].length > best[0].length) {
              best = match;
              bestSymbol = name_1;
            }
          }
        }
        if (best != null) {
          this.text = this.text.substr(best[0].length);
          if (this.text === "")
            this.done = true;
        }
        if (best == null) {
          this.done = true;
          this.symbol = null;
          this.value = null;
          return;
        }
      } while (bestSymbol === "SKIP");
      this.symbol = bestSymbol;
      this.value = best;
      return true;
    };
    Parser2.prototype.accept = function(name) {
      if (this.symbol === name) {
        if (this.value) {
          var v = this.value;
          this.nextSymbol();
          return v;
        }
        this.nextSymbol();
        return true;
      }
      return false;
    };
    Parser2.prototype.acceptNumber = function() {
      return this.accept("number");
    };
    Parser2.prototype.expect = function(name) {
      if (this.accept(name))
        return true;
      throw new Error("expected " + name + " but found " + this.symbol);
    };
    return Parser2;
  })()
);
function parseText(text, language) {
  if (language === void 0) {
    language = i18n_default;
  }
  var options = {};
  var ttr = new Parser(language.tokens);
  if (!ttr.start(text))
    return null;
  S();
  return options;
  function S() {
    ttr.expect("every");
    var n = ttr.acceptNumber();
    if (n)
      options.interval = parseInt(n[0], 10);
    if (ttr.isDone())
      throw new Error("Unexpected end");
    switch (ttr.symbol) {
      case "day(s)":
        options.freq = RRule.DAILY;
        if (ttr.nextSymbol()) {
          AT();
          F();
        }
        break;
      // FIXME Note: every 2 weekdays != every two weeks on weekdays.
      // DAILY on weekdays is not a valid rule
      case "weekday(s)":
        options.freq = RRule.WEEKLY;
        options.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
        ttr.nextSymbol();
        AT();
        F();
        break;
      case "week(s)":
        options.freq = RRule.WEEKLY;
        if (ttr.nextSymbol()) {
          ON();
          AT();
          F();
        }
        break;
      case "hour(s)":
        options.freq = RRule.HOURLY;
        if (ttr.nextSymbol()) {
          ON();
          F();
        }
        break;
      case "minute(s)":
        options.freq = RRule.MINUTELY;
        if (ttr.nextSymbol()) {
          ON();
          F();
        }
        break;
      case "month(s)":
        options.freq = RRule.MONTHLY;
        if (ttr.nextSymbol()) {
          ON();
          F();
        }
        break;
      case "year(s)":
        options.freq = RRule.YEARLY;
        if (ttr.nextSymbol()) {
          ON();
          F();
        }
        break;
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
      case "sunday":
        options.freq = RRule.WEEKLY;
        var key = ttr.symbol.substr(0, 2).toUpperCase();
        options.byweekday = [RRule[key]];
        if (!ttr.nextSymbol())
          return;
        while (ttr.accept("comma")) {
          if (ttr.isDone())
            throw new Error("Unexpected end");
          var wkd = decodeWKD();
          if (!wkd) {
            throw new Error("Unexpected symbol " + ttr.symbol + ", expected weekday");
          }
          options.byweekday.push(RRule[wkd]);
          ttr.nextSymbol();
        }
        AT();
        MDAYs();
        F();
        break;
      case "january":
      case "february":
      case "march":
      case "april":
      case "may":
      case "june":
      case "july":
      case "august":
      case "september":
      case "october":
      case "november":
      case "december":
        options.freq = RRule.YEARLY;
        options.bymonth = [decodeM()];
        if (!ttr.nextSymbol())
          return;
        while (ttr.accept("comma")) {
          if (ttr.isDone())
            throw new Error("Unexpected end");
          var m = decodeM();
          if (!m) {
            throw new Error("Unexpected symbol " + ttr.symbol + ", expected month");
          }
          options.bymonth.push(m);
          ttr.nextSymbol();
        }
        ON();
        F();
        break;
      default:
        throw new Error("Unknown symbol");
    }
  }
  function ON() {
    var on = ttr.accept("on");
    var the = ttr.accept("the");
    if (!(on || the))
      return;
    do {
      var nth = decodeNTH();
      var wkd = decodeWKD();
      var m = decodeM();
      if (nth) {
        if (wkd) {
          ttr.nextSymbol();
          if (!options.byweekday)
            options.byweekday = [];
          options.byweekday.push(RRule[wkd].nth(nth));
        } else {
          if (!options.bymonthday)
            options.bymonthday = [];
          options.bymonthday.push(nth);
          ttr.accept("day(s)");
        }
      } else if (wkd) {
        ttr.nextSymbol();
        if (!options.byweekday)
          options.byweekday = [];
        options.byweekday.push(RRule[wkd]);
      } else if (ttr.symbol === "weekday(s)") {
        ttr.nextSymbol();
        if (!options.byweekday) {
          options.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
        }
      } else if (ttr.symbol === "week(s)") {
        ttr.nextSymbol();
        var n = ttr.acceptNumber();
        if (!n) {
          throw new Error("Unexpected symbol " + ttr.symbol + ", expected week number");
        }
        options.byweekno = [parseInt(n[0], 10)];
        while (ttr.accept("comma")) {
          n = ttr.acceptNumber();
          if (!n) {
            throw new Error("Unexpected symbol " + ttr.symbol + "; expected monthday");
          }
          options.byweekno.push(parseInt(n[0], 10));
        }
      } else if (m) {
        ttr.nextSymbol();
        if (!options.bymonth)
          options.bymonth = [];
        options.bymonth.push(m);
      } else {
        return;
      }
    } while (ttr.accept("comma") || ttr.accept("the") || ttr.accept("on"));
  }
  function AT() {
    var at = ttr.accept("at");
    if (!at)
      return;
    do {
      var n = ttr.acceptNumber();
      if (!n) {
        throw new Error("Unexpected symbol " + ttr.symbol + ", expected hour");
      }
      options.byhour = [parseInt(n[0], 10)];
      while (ttr.accept("comma")) {
        n = ttr.acceptNumber();
        if (!n) {
          throw new Error("Unexpected symbol " + ttr.symbol + "; expected hour");
        }
        options.byhour.push(parseInt(n[0], 10));
      }
    } while (ttr.accept("comma") || ttr.accept("at"));
  }
  function decodeM() {
    switch (ttr.symbol) {
      case "january":
        return 1;
      case "february":
        return 2;
      case "march":
        return 3;
      case "april":
        return 4;
      case "may":
        return 5;
      case "june":
        return 6;
      case "july":
        return 7;
      case "august":
        return 8;
      case "september":
        return 9;
      case "october":
        return 10;
      case "november":
        return 11;
      case "december":
        return 12;
      default:
        return false;
    }
  }
  function decodeWKD() {
    switch (ttr.symbol) {
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
      case "sunday":
        return ttr.symbol.substr(0, 2).toUpperCase();
      default:
        return false;
    }
  }
  function decodeNTH() {
    switch (ttr.symbol) {
      case "last":
        ttr.nextSymbol();
        return -1;
      case "first":
        ttr.nextSymbol();
        return 1;
      case "second":
        ttr.nextSymbol();
        return ttr.accept("last") ? -2 : 2;
      case "third":
        ttr.nextSymbol();
        return ttr.accept("last") ? -3 : 3;
      case "nth":
        var v = parseInt(ttr.value[1], 10);
        if (v < -366 || v > 366)
          throw new Error("Nth out of range: " + v);
        ttr.nextSymbol();
        return ttr.accept("last") ? -v : v;
      default:
        return false;
    }
  }
  function MDAYs() {
    ttr.accept("on");
    ttr.accept("the");
    var nth = decodeNTH();
    if (!nth)
      return;
    options.bymonthday = [nth];
    ttr.nextSymbol();
    while (ttr.accept("comma")) {
      nth = decodeNTH();
      if (!nth) {
        throw new Error("Unexpected symbol " + ttr.symbol + "; expected monthday");
      }
      options.bymonthday.push(nth);
      ttr.nextSymbol();
    }
  }
  function F() {
    if (ttr.symbol === "until") {
      var date = Date.parse(ttr.text);
      if (!date)
        throw new Error("Cannot parse until date:" + ttr.text);
      options.until = new Date(date);
    } else if (ttr.accept("for")) {
      options.count = parseInt(ttr.value[0], 10);
      ttr.expect("number");
    }
  }
}

// node_modules/rrule/dist/esm/types.js
var Frequency;
(function(Frequency2) {
  Frequency2[Frequency2["YEARLY"] = 0] = "YEARLY";
  Frequency2[Frequency2["MONTHLY"] = 1] = "MONTHLY";
  Frequency2[Frequency2["WEEKLY"] = 2] = "WEEKLY";
  Frequency2[Frequency2["DAILY"] = 3] = "DAILY";
  Frequency2[Frequency2["HOURLY"] = 4] = "HOURLY";
  Frequency2[Frequency2["MINUTELY"] = 5] = "MINUTELY";
  Frequency2[Frequency2["SECONDLY"] = 6] = "SECONDLY";
})(Frequency || (Frequency = {}));
function freqIsDailyOrGreater(freq) {
  return freq < Frequency.HOURLY;
}

// node_modules/rrule/dist/esm/nlp/index.js
var fromText = function(text, language) {
  if (language === void 0) {
    language = i18n_default;
  }
  return new RRule(parseText(text, language) || void 0);
};
var common = [
  "count",
  "until",
  "interval",
  "byweekday",
  "bymonthday",
  "bymonth"
];
totext_default.IMPLEMENTED = [];
totext_default.IMPLEMENTED[Frequency.HOURLY] = common;
totext_default.IMPLEMENTED[Frequency.MINUTELY] = common;
totext_default.IMPLEMENTED[Frequency.DAILY] = ["byhour"].concat(common);
totext_default.IMPLEMENTED[Frequency.WEEKLY] = common;
totext_default.IMPLEMENTED[Frequency.MONTHLY] = common;
totext_default.IMPLEMENTED[Frequency.YEARLY] = ["byweekno", "byyearday"].concat(common);
var toText = function(rrule, gettext, language, dateFormatter) {
  return new totext_default(rrule, gettext, language, dateFormatter).toString();
};
var isFullyConvertible = totext_default.isFullyConvertible;

// node_modules/rrule/dist/esm/datetime.js
var Time = (
  /** @class */
  (function() {
    function Time2(hour, minute, second, millisecond) {
      this.hour = hour;
      this.minute = minute;
      this.second = second;
      this.millisecond = millisecond || 0;
    }
    Time2.prototype.getHours = function() {
      return this.hour;
    };
    Time2.prototype.getMinutes = function() {
      return this.minute;
    };
    Time2.prototype.getSeconds = function() {
      return this.second;
    };
    Time2.prototype.getMilliseconds = function() {
      return this.millisecond;
    };
    Time2.prototype.getTime = function() {
      return (this.hour * 60 * 60 + this.minute * 60 + this.second) * 1e3 + this.millisecond;
    };
    return Time2;
  })()
);
var DateTime = (
  /** @class */
  (function(_super) {
    __extends(DateTime2, _super);
    function DateTime2(year, month, day, hour, minute, second, millisecond) {
      var _this = _super.call(this, hour, minute, second, millisecond) || this;
      _this.year = year;
      _this.month = month;
      _this.day = day;
      return _this;
    }
    DateTime2.fromDate = function(date) {
      return new this(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.valueOf() % 1e3);
    };
    DateTime2.prototype.getWeekday = function() {
      return getWeekday(new Date(this.getTime()));
    };
    DateTime2.prototype.getTime = function() {
      return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond)).getTime();
    };
    DateTime2.prototype.getDay = function() {
      return this.day;
    };
    DateTime2.prototype.getMonth = function() {
      return this.month;
    };
    DateTime2.prototype.getYear = function() {
      return this.year;
    };
    DateTime2.prototype.addYears = function(years) {
      this.year += years;
    };
    DateTime2.prototype.addMonths = function(months) {
      this.month += months;
      if (this.month > 12) {
        var yearDiv = Math.floor(this.month / 12);
        var monthMod = pymod(this.month, 12);
        this.month = monthMod;
        this.year += yearDiv;
        if (this.month === 0) {
          this.month = 12;
          --this.year;
        }
      }
    };
    DateTime2.prototype.addWeekly = function(days, wkst) {
      if (wkst > this.getWeekday()) {
        this.day += -(this.getWeekday() + 1 + (6 - wkst)) + days * 7;
      } else {
        this.day += -(this.getWeekday() - wkst) + days * 7;
      }
      this.fixDay();
    };
    DateTime2.prototype.addDaily = function(days) {
      this.day += days;
      this.fixDay();
    };
    DateTime2.prototype.addHours = function(hours, filtered, byhour) {
      if (filtered) {
        this.hour += Math.floor((23 - this.hour) / hours) * hours;
      }
      for (; ; ) {
        this.hour += hours;
        var _a = divmod(this.hour, 24), dayDiv = _a.div, hourMod = _a.mod;
        if (dayDiv) {
          this.hour = hourMod;
          this.addDaily(dayDiv);
        }
        if (empty(byhour) || includes(byhour, this.hour))
          break;
      }
    };
    DateTime2.prototype.addMinutes = function(minutes, filtered, byhour, byminute) {
      if (filtered) {
        this.minute += Math.floor((1439 - (this.hour * 60 + this.minute)) / minutes) * minutes;
      }
      for (; ; ) {
        this.minute += minutes;
        var _a = divmod(this.minute, 60), hourDiv = _a.div, minuteMod = _a.mod;
        if (hourDiv) {
          this.minute = minuteMod;
          this.addHours(hourDiv, false, byhour);
        }
        if ((empty(byhour) || includes(byhour, this.hour)) && (empty(byminute) || includes(byminute, this.minute))) {
          break;
        }
      }
    };
    DateTime2.prototype.addSeconds = function(seconds, filtered, byhour, byminute, bysecond) {
      if (filtered) {
        this.second += Math.floor((86399 - (this.hour * 3600 + this.minute * 60 + this.second)) / seconds) * seconds;
      }
      for (; ; ) {
        this.second += seconds;
        var _a = divmod(this.second, 60), minuteDiv = _a.div, secondMod = _a.mod;
        if (minuteDiv) {
          this.second = secondMod;
          this.addMinutes(minuteDiv, false, byhour, byminute);
        }
        if ((empty(byhour) || includes(byhour, this.hour)) && (empty(byminute) || includes(byminute, this.minute)) && (empty(bysecond) || includes(bysecond, this.second))) {
          break;
        }
      }
    };
    DateTime2.prototype.fixDay = function() {
      if (this.day <= 28) {
        return;
      }
      var daysinmonth = monthRange(this.year, this.month - 1)[1];
      if (this.day <= daysinmonth) {
        return;
      }
      while (this.day > daysinmonth) {
        this.day -= daysinmonth;
        ++this.month;
        if (this.month === 13) {
          this.month = 1;
          ++this.year;
          if (this.year > MAXYEAR) {
            return;
          }
        }
        daysinmonth = monthRange(this.year, this.month - 1)[1];
      }
    };
    DateTime2.prototype.add = function(options, filtered) {
      var freq = options.freq, interval = options.interval, wkst = options.wkst, byhour = options.byhour, byminute = options.byminute, bysecond = options.bysecond;
      switch (freq) {
        case Frequency.YEARLY:
          return this.addYears(interval);
        case Frequency.MONTHLY:
          return this.addMonths(interval);
        case Frequency.WEEKLY:
          return this.addWeekly(interval, wkst);
        case Frequency.DAILY:
          return this.addDaily(interval);
        case Frequency.HOURLY:
          return this.addHours(interval, filtered, byhour);
        case Frequency.MINUTELY:
          return this.addMinutes(interval, filtered, byhour, byminute);
        case Frequency.SECONDLY:
          return this.addSeconds(interval, filtered, byhour, byminute, bysecond);
      }
    };
    return DateTime2;
  })(Time)
);

// node_modules/rrule/dist/esm/parseoptions.js
function initializeOptions(options) {
  var invalid = [];
  var keys = Object.keys(options);
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    if (!includes(defaultKeys, key))
      invalid.push(key);
    if (isDate(options[key]) && !isValidDate(options[key])) {
      invalid.push(key);
    }
  }
  if (invalid.length) {
    throw new Error("Invalid options: " + invalid.join(", "));
  }
  return __assign({}, options);
}
function parseOptions(options) {
  var opts = __assign(__assign({}, DEFAULT_OPTIONS), initializeOptions(options));
  if (isPresent(opts.byeaster))
    opts.freq = RRule.YEARLY;
  if (!(isPresent(opts.freq) && RRule.FREQUENCIES[opts.freq])) {
    throw new Error("Invalid frequency: ".concat(opts.freq, " ").concat(options.freq));
  }
  if (!opts.dtstart)
    opts.dtstart = new Date((/* @__PURE__ */ new Date()).setMilliseconds(0));
  if (!isPresent(opts.wkst)) {
    opts.wkst = RRule.MO.weekday;
  } else if (isNumber(opts.wkst)) {
  } else {
    opts.wkst = opts.wkst.weekday;
  }
  if (isPresent(opts.bysetpos)) {
    if (isNumber(opts.bysetpos))
      opts.bysetpos = [opts.bysetpos];
    for (var i = 0; i < opts.bysetpos.length; i++) {
      var v = opts.bysetpos[i];
      if (v === 0 || !(v >= -366 && v <= 366)) {
        throw new Error("bysetpos must be between 1 and 366, or between -366 and -1");
      }
    }
  }
  if (!(Boolean(opts.byweekno) || notEmpty(opts.byweekno) || notEmpty(opts.byyearday) || Boolean(opts.bymonthday) || notEmpty(opts.bymonthday) || isPresent(opts.byweekday) || isPresent(opts.byeaster))) {
    switch (opts.freq) {
      case RRule.YEARLY:
        if (!opts.bymonth)
          opts.bymonth = opts.dtstart.getUTCMonth() + 1;
        opts.bymonthday = opts.dtstart.getUTCDate();
        break;
      case RRule.MONTHLY:
        opts.bymonthday = opts.dtstart.getUTCDate();
        break;
      case RRule.WEEKLY:
        opts.byweekday = [getWeekday(opts.dtstart)];
        break;
    }
  }
  if (isPresent(opts.bymonth) && !isArray(opts.bymonth)) {
    opts.bymonth = [opts.bymonth];
  }
  if (isPresent(opts.byyearday) && !isArray(opts.byyearday) && isNumber(opts.byyearday)) {
    opts.byyearday = [opts.byyearday];
  }
  if (!isPresent(opts.bymonthday)) {
    opts.bymonthday = [];
    opts.bynmonthday = [];
  } else if (isArray(opts.bymonthday)) {
    var bymonthday = [];
    var bynmonthday = [];
    for (var i = 0; i < opts.bymonthday.length; i++) {
      var v = opts.bymonthday[i];
      if (v > 0) {
        bymonthday.push(v);
      } else if (v < 0) {
        bynmonthday.push(v);
      }
    }
    opts.bymonthday = bymonthday;
    opts.bynmonthday = bynmonthday;
  } else if (opts.bymonthday < 0) {
    opts.bynmonthday = [opts.bymonthday];
    opts.bymonthday = [];
  } else {
    opts.bynmonthday = [];
    opts.bymonthday = [opts.bymonthday];
  }
  if (isPresent(opts.byweekno) && !isArray(opts.byweekno)) {
    opts.byweekno = [opts.byweekno];
  }
  if (!isPresent(opts.byweekday)) {
    opts.bynweekday = null;
  } else if (isNumber(opts.byweekday)) {
    opts.byweekday = [opts.byweekday];
    opts.bynweekday = null;
  } else if (isWeekdayStr(opts.byweekday)) {
    opts.byweekday = [Weekday.fromStr(opts.byweekday).weekday];
    opts.bynweekday = null;
  } else if (opts.byweekday instanceof Weekday) {
    if (!opts.byweekday.n || opts.freq > RRule.MONTHLY) {
      opts.byweekday = [opts.byweekday.weekday];
      opts.bynweekday = null;
    } else {
      opts.bynweekday = [[opts.byweekday.weekday, opts.byweekday.n]];
      opts.byweekday = null;
    }
  } else {
    var byweekday = [];
    var bynweekday = [];
    for (var i = 0; i < opts.byweekday.length; i++) {
      var wday = opts.byweekday[i];
      if (isNumber(wday)) {
        byweekday.push(wday);
        continue;
      } else if (isWeekdayStr(wday)) {
        byweekday.push(Weekday.fromStr(wday).weekday);
        continue;
      }
      if (!wday.n || opts.freq > RRule.MONTHLY) {
        byweekday.push(wday.weekday);
      } else {
        bynweekday.push([wday.weekday, wday.n]);
      }
    }
    opts.byweekday = notEmpty(byweekday) ? byweekday : null;
    opts.bynweekday = notEmpty(bynweekday) ? bynweekday : null;
  }
  if (!isPresent(opts.byhour)) {
    opts.byhour = opts.freq < RRule.HOURLY ? [opts.dtstart.getUTCHours()] : null;
  } else if (isNumber(opts.byhour)) {
    opts.byhour = [opts.byhour];
  }
  if (!isPresent(opts.byminute)) {
    opts.byminute = opts.freq < RRule.MINUTELY ? [opts.dtstart.getUTCMinutes()] : null;
  } else if (isNumber(opts.byminute)) {
    opts.byminute = [opts.byminute];
  }
  if (!isPresent(opts.bysecond)) {
    opts.bysecond = opts.freq < RRule.SECONDLY ? [opts.dtstart.getUTCSeconds()] : null;
  } else if (isNumber(opts.bysecond)) {
    opts.bysecond = [opts.bysecond];
  }
  return { parsedOptions: opts };
}
function buildTimeset(opts) {
  var millisecondModulo = opts.dtstart.getTime() % 1e3;
  if (!freqIsDailyOrGreater(opts.freq)) {
    return [];
  }
  var timeset = [];
  opts.byhour.forEach(function(hour) {
    opts.byminute.forEach(function(minute) {
      opts.bysecond.forEach(function(second) {
        timeset.push(new Time(hour, minute, second, millisecondModulo));
      });
    });
  });
  return timeset;
}

// node_modules/rrule/dist/esm/parsestring.js
function parseString(rfcString) {
  var options = rfcString.split("\n").map(parseLine).filter(function(x) {
    return x !== null;
  });
  return __assign(__assign({}, options[0]), options[1]);
}
function parseDtstart(line) {
  var options = {};
  var dtstartWithZone = /DTSTART(?:;TZID=([^:=]+?))?(?::|=)([^;\s]+)/i.exec(line);
  if (!dtstartWithZone) {
    return options;
  }
  var tzid = dtstartWithZone[1], dtstart = dtstartWithZone[2];
  if (tzid) {
    options.tzid = tzid;
  }
  options.dtstart = untilStringToDate(dtstart);
  return options;
}
function parseLine(rfcString) {
  rfcString = rfcString.replace(/^\s+|\s+$/, "");
  if (!rfcString.length)
    return null;
  var header = /^([A-Z]+?)[:;]/.exec(rfcString.toUpperCase());
  if (!header) {
    return parseRrule(rfcString);
  }
  var key = header[1];
  switch (key.toUpperCase()) {
    case "RRULE":
    case "EXRULE":
      return parseRrule(rfcString);
    case "DTSTART":
      return parseDtstart(rfcString);
    default:
      throw new Error("Unsupported RFC prop ".concat(key, " in ").concat(rfcString));
  }
}
function parseRrule(line) {
  var strippedLine = line.replace(/^RRULE:/i, "");
  var options = parseDtstart(strippedLine);
  var attrs = line.replace(/^(?:RRULE|EXRULE):/i, "").split(";");
  attrs.forEach(function(attr) {
    var _a = attr.split("="), key = _a[0], value = _a[1];
    switch (key.toUpperCase()) {
      case "FREQ":
        options.freq = Frequency[value.toUpperCase()];
        break;
      case "WKST":
        options.wkst = Days[value.toUpperCase()];
        break;
      case "COUNT":
      case "INTERVAL":
      case "BYSETPOS":
      case "BYMONTH":
      case "BYMONTHDAY":
      case "BYYEARDAY":
      case "BYWEEKNO":
      case "BYHOUR":
      case "BYMINUTE":
      case "BYSECOND":
        var num = parseNumber(value);
        var optionKey = key.toLowerCase();
        options[optionKey] = num;
        break;
      case "BYWEEKDAY":
      case "BYDAY":
        options.byweekday = parseWeekday(value);
        break;
      case "DTSTART":
      case "TZID":
        var dtstart = parseDtstart(line);
        options.tzid = dtstart.tzid;
        options.dtstart = dtstart.dtstart;
        break;
      case "UNTIL":
        options.until = untilStringToDate(value);
        break;
      case "BYEASTER":
        options.byeaster = Number(value);
        break;
      default:
        throw new Error("Unknown RRULE property '" + key + "'");
    }
  });
  return options;
}
function parseNumber(value) {
  if (value.indexOf(",") !== -1) {
    var values = value.split(",");
    return values.map(parseIndividualNumber);
  }
  return parseIndividualNumber(value);
}
function parseIndividualNumber(value) {
  if (/^[+-]?\d+$/.test(value)) {
    return Number(value);
  }
  return value;
}
function parseWeekday(value) {
  var days = value.split(",");
  return days.map(function(day) {
    if (day.length === 2) {
      return Days[day];
    }
    var parts = day.match(/^([+-]?\d{1,2})([A-Z]{2})$/);
    if (!parts || parts.length < 3) {
      throw new SyntaxError("Invalid weekday string: ".concat(day));
    }
    var n = Number(parts[1]);
    var wdaypart = parts[2];
    var wday = Days[wdaypart].weekday;
    return new Weekday(wday, n);
  });
}

// node_modules/rrule/dist/esm/datewithzone.js
var DateWithZone = (
  /** @class */
  (function() {
    function DateWithZone2(date, tzid) {
      if (isNaN(date.getTime())) {
        throw new RangeError("Invalid date passed to DateWithZone");
      }
      this.date = date;
      this.tzid = tzid;
    }
    Object.defineProperty(DateWithZone2.prototype, "isUTC", {
      get: function() {
        return !this.tzid || this.tzid.toUpperCase() === "UTC";
      },
      enumerable: false,
      configurable: true
    });
    DateWithZone2.prototype.toString = function() {
      var datestr = timeToUntilString(this.date.getTime(), this.isUTC);
      if (!this.isUTC) {
        return ";TZID=".concat(this.tzid, ":").concat(datestr);
      }
      return ":".concat(datestr);
    };
    DateWithZone2.prototype.getTime = function() {
      return this.date.getTime();
    };
    DateWithZone2.prototype.rezonedDate = function() {
      if (this.isUTC) {
        return this.date;
      }
      return dateInTimeZone(this.date, this.tzid);
    };
    return DateWithZone2;
  })()
);

// node_modules/rrule/dist/esm/optionstostring.js
function optionsToString(options) {
  var rrule = [];
  var dtstart = "";
  var keys = Object.keys(options);
  var defaultKeys2 = Object.keys(DEFAULT_OPTIONS);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] === "tzid")
      continue;
    if (!includes(defaultKeys2, keys[i]))
      continue;
    var key = keys[i].toUpperCase();
    var value = options[keys[i]];
    var outValue = "";
    if (!isPresent(value) || isArray(value) && !value.length)
      continue;
    switch (key) {
      case "FREQ":
        outValue = RRule.FREQUENCIES[options.freq];
        break;
      case "WKST":
        if (isNumber(value)) {
          outValue = new Weekday(value).toString();
        } else {
          outValue = value.toString();
        }
        break;
      case "BYWEEKDAY":
        key = "BYDAY";
        outValue = toArray(value).map(function(wday) {
          if (wday instanceof Weekday) {
            return wday;
          }
          if (isArray(wday)) {
            return new Weekday(wday[0], wday[1]);
          }
          return new Weekday(wday);
        }).toString();
        break;
      case "DTSTART":
        dtstart = buildDtstart(value, options.tzid);
        break;
      case "UNTIL":
        outValue = timeToUntilString(value, !options.tzid);
        break;
      default:
        if (isArray(value)) {
          var strValues = [];
          for (var j = 0; j < value.length; j++) {
            strValues[j] = String(value[j]);
          }
          outValue = strValues.toString();
        } else {
          outValue = String(value);
        }
    }
    if (outValue) {
      rrule.push([key, outValue]);
    }
  }
  var rules = rrule.map(function(_a) {
    var key2 = _a[0], value2 = _a[1];
    return "".concat(key2, "=").concat(value2.toString());
  }).join(";");
  var ruleString = "";
  if (rules !== "") {
    ruleString = "RRULE:".concat(rules);
  }
  return [dtstart, ruleString].filter(function(x) {
    return !!x;
  }).join("\n");
}
function buildDtstart(dtstart, tzid) {
  if (!dtstart) {
    return "";
  }
  return "DTSTART" + new DateWithZone(new Date(dtstart), tzid).toString();
}

// node_modules/rrule/dist/esm/cache.js
function argsMatch(left, right) {
  if (Array.isArray(left)) {
    if (!Array.isArray(right))
      return false;
    if (left.length !== right.length)
      return false;
    return left.every(function(date, i) {
      return date.getTime() === right[i].getTime();
    });
  }
  if (left instanceof Date) {
    return right instanceof Date && left.getTime() === right.getTime();
  }
  return left === right;
}
var Cache = (
  /** @class */
  (function() {
    function Cache2() {
      this.all = false;
      this.before = [];
      this.after = [];
      this.between = [];
    }
    Cache2.prototype._cacheAdd = function(what, value, args) {
      if (value) {
        value = value instanceof Date ? clone(value) : cloneDates(value);
      }
      if (what === "all") {
        this.all = value;
      } else {
        args._value = value;
        this[what].push(args);
      }
    };
    Cache2.prototype._cacheGet = function(what, args) {
      var cached = false;
      var argsKeys = args ? Object.keys(args) : [];
      var findCacheDiff = function(item2) {
        for (var i2 = 0; i2 < argsKeys.length; i2++) {
          var key = argsKeys[i2];
          if (!argsMatch(args[key], item2[key])) {
            return true;
          }
        }
        return false;
      };
      var cachedObject = this[what];
      if (what === "all") {
        cached = this.all;
      } else if (isArray(cachedObject)) {
        for (var i = 0; i < cachedObject.length; i++) {
          var item = cachedObject[i];
          if (argsKeys.length && findCacheDiff(item))
            continue;
          cached = item._value;
          break;
        }
      }
      if (!cached && this.all) {
        var iterResult = new iterresult_default(what, args);
        for (var i = 0; i < this.all.length; i++) {
          if (!iterResult.accept(this.all[i]))
            break;
        }
        cached = iterResult.getValue();
        this._cacheAdd(what, cached, args);
      }
      return isArray(cached) ? cloneDates(cached) : cached instanceof Date ? clone(cached) : cached;
    };
    return Cache2;
  })()
);

// node_modules/rrule/dist/esm/masks.js
var M365MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], repeat(1, 31), true), repeat(2, 28), true), repeat(3, 31), true), repeat(4, 30), true), repeat(5, 31), true), repeat(6, 30), true), repeat(7, 31), true), repeat(8, 31), true), repeat(9, 30), true), repeat(10, 31), true), repeat(11, 30), true), repeat(12, 31), true), repeat(1, 7), true);
var M366MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], repeat(1, 31), true), repeat(2, 29), true), repeat(3, 31), true), repeat(4, 30), true), repeat(5, 31), true), repeat(6, 30), true), repeat(7, 31), true), repeat(8, 31), true), repeat(9, 30), true), repeat(10, 31), true), repeat(11, 30), true), repeat(12, 31), true), repeat(1, 7), true);
var M28 = range(1, 29);
var M29 = range(1, 30);
var M30 = range(1, 31);
var M31 = range(1, 32);
var MDAY366MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], M31, true), M29, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31.slice(0, 7), true);
var MDAY365MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], M31, true), M28, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31.slice(0, 7), true);
var NM28 = range(-28, 0);
var NM29 = range(-29, 0);
var NM30 = range(-30, 0);
var NM31 = range(-31, 0);
var NMDAY366MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], NM31, true), NM29, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31.slice(0, 7), true);
var NMDAY365MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], NM31, true), NM28, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31.slice(0, 7), true);
var M366RANGE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
var M365RANGE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
var WDAYMASK = (function() {
  var wdaymask = [];
  for (var i = 0; i < 55; i++)
    wdaymask = wdaymask.concat(range(7));
  return wdaymask;
})();

// node_modules/rrule/dist/esm/iterinfo/yearinfo.js
function rebuildYear(year, options) {
  var firstyday = datetime(year, 1, 1);
  var yearlen = isLeapYear(year) ? 366 : 365;
  var nextyearlen = isLeapYear(year + 1) ? 366 : 365;
  var yearordinal = toOrdinal(firstyday);
  var yearweekday = getWeekday(firstyday);
  var result = __assign(__assign({ yearlen, nextyearlen, yearordinal, yearweekday }, baseYearMasks(year)), { wnomask: null });
  if (empty(options.byweekno)) {
    return result;
  }
  result.wnomask = repeat(0, yearlen + 7);
  var firstwkst;
  var wyearlen;
  var no1wkst = firstwkst = pymod(7 - yearweekday + options.wkst, 7);
  if (no1wkst >= 4) {
    no1wkst = 0;
    wyearlen = result.yearlen + pymod(yearweekday - options.wkst, 7);
  } else {
    wyearlen = yearlen - no1wkst;
  }
  var div = Math.floor(wyearlen / 7);
  var mod = pymod(wyearlen, 7);
  var numweeks = Math.floor(div + mod / 4);
  for (var j = 0; j < options.byweekno.length; j++) {
    var n = options.byweekno[j];
    if (n < 0) {
      n += numweeks + 1;
    }
    if (!(n > 0 && n <= numweeks)) {
      continue;
    }
    var i = void 0;
    if (n > 1) {
      i = no1wkst + (n - 1) * 7;
      if (no1wkst !== firstwkst) {
        i -= 7 - firstwkst;
      }
    } else {
      i = no1wkst;
    }
    for (var k = 0; k < 7; k++) {
      result.wnomask[i] = 1;
      i++;
      if (result.wdaymask[i] === options.wkst)
        break;
    }
  }
  if (includes(options.byweekno, 1)) {
    var i = no1wkst + numweeks * 7;
    if (no1wkst !== firstwkst)
      i -= 7 - firstwkst;
    if (i < yearlen) {
      for (var j = 0; j < 7; j++) {
        result.wnomask[i] = 1;
        i += 1;
        if (result.wdaymask[i] === options.wkst)
          break;
      }
    }
  }
  if (no1wkst) {
    var lnumweeks = void 0;
    if (!includes(options.byweekno, -1)) {
      var lyearweekday = getWeekday(datetime(year - 1, 1, 1));
      var lno1wkst = pymod(7 - lyearweekday.valueOf() + options.wkst, 7);
      var lyearlen = isLeapYear(year - 1) ? 366 : 365;
      var weekst = void 0;
      if (lno1wkst >= 4) {
        lno1wkst = 0;
        weekst = lyearlen + pymod(lyearweekday - options.wkst, 7);
      } else {
        weekst = yearlen - no1wkst;
      }
      lnumweeks = Math.floor(52 + pymod(weekst, 7) / 4);
    } else {
      lnumweeks = -1;
    }
    if (includes(options.byweekno, lnumweeks)) {
      for (var i = 0; i < no1wkst; i++)
        result.wnomask[i] = 1;
    }
  }
  return result;
}
function baseYearMasks(year) {
  var yearlen = isLeapYear(year) ? 366 : 365;
  var firstyday = datetime(year, 1, 1);
  var wday = getWeekday(firstyday);
  if (yearlen === 365) {
    return {
      mmask: M365MASK,
      mdaymask: MDAY365MASK,
      nmdaymask: NMDAY365MASK,
      wdaymask: WDAYMASK.slice(wday),
      mrange: M365RANGE
    };
  }
  return {
    mmask: M366MASK,
    mdaymask: MDAY366MASK,
    nmdaymask: NMDAY366MASK,
    wdaymask: WDAYMASK.slice(wday),
    mrange: M366RANGE
  };
}

// node_modules/rrule/dist/esm/iterinfo/monthinfo.js
function rebuildMonth(year, month, yearlen, mrange, wdaymask, options) {
  var result = {
    lastyear: year,
    lastmonth: month,
    nwdaymask: []
  };
  var ranges = [];
  if (options.freq === RRule.YEARLY) {
    if (empty(options.bymonth)) {
      ranges = [[0, yearlen]];
    } else {
      for (var j = 0; j < options.bymonth.length; j++) {
        month = options.bymonth[j];
        ranges.push(mrange.slice(month - 1, month + 1));
      }
    }
  } else if (options.freq === RRule.MONTHLY) {
    ranges = [mrange.slice(month - 1, month + 1)];
  }
  if (empty(ranges)) {
    return result;
  }
  result.nwdaymask = repeat(0, yearlen);
  for (var j = 0; j < ranges.length; j++) {
    var rang = ranges[j];
    var first = rang[0];
    var last = rang[1] - 1;
    for (var k = 0; k < options.bynweekday.length; k++) {
      var i = void 0;
      var _a = options.bynweekday[k], wday = _a[0], n = _a[1];
      if (n < 0) {
        i = last + (n + 1) * 7;
        i -= pymod(wdaymask[i] - wday, 7);
      } else {
        i = first + (n - 1) * 7;
        i += pymod(7 - wdaymask[i] + wday, 7);
      }
      if (first <= i && i <= last)
        result.nwdaymask[i] = 1;
    }
  }
  return result;
}

// node_modules/rrule/dist/esm/iterinfo/easter.js
function easter(y, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  var a = y % 19;
  var b = Math.floor(y / 100);
  var c = y % 100;
  var d = Math.floor(b / 4);
  var e = b % 4;
  var f = Math.floor((b + 8) / 25);
  var g = Math.floor((b - f + 1) / 3);
  var h = Math.floor(19 * a + b - d - g + 15) % 30;
  var i = Math.floor(c / 4);
  var k = c % 4;
  var l = Math.floor(32 + 2 * e + 2 * i - h - k) % 7;
  var m = Math.floor((a + 11 * h + 22 * l) / 451);
  var month = Math.floor((h + l - 7 * m + 114) / 31);
  var day = (h + l - 7 * m + 114) % 31 + 1;
  var date = Date.UTC(y, month - 1, day + offset);
  var yearStart = Date.UTC(y, 0, 1);
  return [Math.ceil((date - yearStart) / (1e3 * 60 * 60 * 24))];
}

// node_modules/rrule/dist/esm/iterinfo/index.js
var Iterinfo = (
  /** @class */
  (function() {
    function Iterinfo2(options) {
      this.options = options;
    }
    Iterinfo2.prototype.rebuild = function(year, month) {
      var options = this.options;
      if (year !== this.lastyear) {
        this.yearinfo = rebuildYear(year, options);
      }
      if (notEmpty(options.bynweekday) && (month !== this.lastmonth || year !== this.lastyear)) {
        var _a = this.yearinfo, yearlen = _a.yearlen, mrange = _a.mrange, wdaymask = _a.wdaymask;
        this.monthinfo = rebuildMonth(year, month, yearlen, mrange, wdaymask, options);
      }
      if (isPresent(options.byeaster)) {
        this.eastermask = easter(year, options.byeaster);
      }
    };
    Object.defineProperty(Iterinfo2.prototype, "lastyear", {
      get: function() {
        return this.monthinfo ? this.monthinfo.lastyear : null;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "lastmonth", {
      get: function() {
        return this.monthinfo ? this.monthinfo.lastmonth : null;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "yearlen", {
      get: function() {
        return this.yearinfo.yearlen;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "yearordinal", {
      get: function() {
        return this.yearinfo.yearordinal;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "mrange", {
      get: function() {
        return this.yearinfo.mrange;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "wdaymask", {
      get: function() {
        return this.yearinfo.wdaymask;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "mmask", {
      get: function() {
        return this.yearinfo.mmask;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "wnomask", {
      get: function() {
        return this.yearinfo.wnomask;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "nwdaymask", {
      get: function() {
        return this.monthinfo ? this.monthinfo.nwdaymask : [];
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "nextyearlen", {
      get: function() {
        return this.yearinfo.nextyearlen;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "mdaymask", {
      get: function() {
        return this.yearinfo.mdaymask;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "nmdaymask", {
      get: function() {
        return this.yearinfo.nmdaymask;
      },
      enumerable: false,
      configurable: true
    });
    Iterinfo2.prototype.ydayset = function() {
      return [range(this.yearlen), 0, this.yearlen];
    };
    Iterinfo2.prototype.mdayset = function(_, month) {
      var start = this.mrange[month - 1];
      var end = this.mrange[month];
      var set = repeat(null, this.yearlen);
      for (var i = start; i < end; i++)
        set[i] = i;
      return [set, start, end];
    };
    Iterinfo2.prototype.wdayset = function(year, month, day) {
      var set = repeat(null, this.yearlen + 7);
      var i = toOrdinal(datetime(year, month, day)) - this.yearordinal;
      var start = i;
      for (var j = 0; j < 7; j++) {
        set[i] = i;
        ++i;
        if (this.wdaymask[i] === this.options.wkst)
          break;
      }
      return [set, start, i];
    };
    Iterinfo2.prototype.ddayset = function(year, month, day) {
      var set = repeat(null, this.yearlen);
      var i = toOrdinal(datetime(year, month, day)) - this.yearordinal;
      set[i] = i;
      return [set, i, i + 1];
    };
    Iterinfo2.prototype.htimeset = function(hour, _, second, millisecond) {
      var _this = this;
      var set = [];
      this.options.byminute.forEach(function(minute) {
        set = set.concat(_this.mtimeset(hour, minute, second, millisecond));
      });
      sort(set);
      return set;
    };
    Iterinfo2.prototype.mtimeset = function(hour, minute, _, millisecond) {
      var set = this.options.bysecond.map(function(second) {
        return new Time(hour, minute, second, millisecond);
      });
      sort(set);
      return set;
    };
    Iterinfo2.prototype.stimeset = function(hour, minute, second, millisecond) {
      return [new Time(hour, minute, second, millisecond)];
    };
    Iterinfo2.prototype.getdayset = function(freq) {
      switch (freq) {
        case Frequency.YEARLY:
          return this.ydayset.bind(this);
        case Frequency.MONTHLY:
          return this.mdayset.bind(this);
        case Frequency.WEEKLY:
          return this.wdayset.bind(this);
        case Frequency.DAILY:
          return this.ddayset.bind(this);
        default:
          return this.ddayset.bind(this);
      }
    };
    Iterinfo2.prototype.gettimeset = function(freq) {
      switch (freq) {
        case Frequency.HOURLY:
          return this.htimeset.bind(this);
        case Frequency.MINUTELY:
          return this.mtimeset.bind(this);
        case Frequency.SECONDLY:
          return this.stimeset.bind(this);
      }
    };
    return Iterinfo2;
  })()
);
var iterinfo_default = Iterinfo;

// node_modules/rrule/dist/esm/iter/poslist.js
function buildPoslist(bysetpos, timeset, start, end, ii, dayset) {
  var poslist = [];
  for (var j = 0; j < bysetpos.length; j++) {
    var daypos = void 0;
    var timepos = void 0;
    var pos = bysetpos[j];
    if (pos < 0) {
      daypos = Math.floor(pos / timeset.length);
      timepos = pymod(pos, timeset.length);
    } else {
      daypos = Math.floor((pos - 1) / timeset.length);
      timepos = pymod(pos - 1, timeset.length);
    }
    var tmp = [];
    for (var k = start; k < end; k++) {
      var val = dayset[k];
      if (!isPresent(val))
        continue;
      tmp.push(val);
    }
    var i = void 0;
    if (daypos < 0) {
      i = tmp.slice(daypos)[0];
    } else {
      i = tmp[daypos];
    }
    var time = timeset[timepos];
    var date = fromOrdinal(ii.yearordinal + i);
    var res = combine(date, time);
    if (!includes(poslist, res))
      poslist.push(res);
  }
  sort(poslist);
  return poslist;
}

// node_modules/rrule/dist/esm/iter/index.js
function iter(iterResult, options) {
  var dtstart = options.dtstart, freq = options.freq, interval = options.interval, until = options.until, bysetpos = options.bysetpos;
  var count = options.count;
  if (count === 0 || interval === 0) {
    return emitResult(iterResult);
  }
  var counterDate = DateTime.fromDate(dtstart);
  var ii = new iterinfo_default(options);
  ii.rebuild(counterDate.year, counterDate.month);
  var timeset = makeTimeset(ii, counterDate, options);
  for (; ; ) {
    var _a = ii.getdayset(freq)(counterDate.year, counterDate.month, counterDate.day), dayset = _a[0], start = _a[1], end = _a[2];
    var filtered = removeFilteredDays(dayset, start, end, ii, options);
    if (notEmpty(bysetpos)) {
      var poslist = buildPoslist(bysetpos, timeset, start, end, ii, dayset);
      for (var j = 0; j < poslist.length; j++) {
        var res = poslist[j];
        if (until && res > until) {
          return emitResult(iterResult);
        }
        if (res >= dtstart) {
          var rezonedDate = rezoneIfNeeded(res, options);
          if (!iterResult.accept(rezonedDate)) {
            return emitResult(iterResult);
          }
          if (count) {
            --count;
            if (!count) {
              return emitResult(iterResult);
            }
          }
        }
      }
    } else {
      for (var j = start; j < end; j++) {
        var currentDay = dayset[j];
        if (!isPresent(currentDay)) {
          continue;
        }
        var date = fromOrdinal(ii.yearordinal + currentDay);
        for (var k = 0; k < timeset.length; k++) {
          var time = timeset[k];
          var res = combine(date, time);
          if (until && res > until) {
            return emitResult(iterResult);
          }
          if (res >= dtstart) {
            var rezonedDate = rezoneIfNeeded(res, options);
            if (!iterResult.accept(rezonedDate)) {
              return emitResult(iterResult);
            }
            if (count) {
              --count;
              if (!count) {
                return emitResult(iterResult);
              }
            }
          }
        }
      }
    }
    if (options.interval === 0) {
      return emitResult(iterResult);
    }
    counterDate.add(options, filtered);
    if (counterDate.year > MAXYEAR) {
      return emitResult(iterResult);
    }
    if (!freqIsDailyOrGreater(freq)) {
      timeset = ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second, 0);
    }
    ii.rebuild(counterDate.year, counterDate.month);
  }
}
function isFiltered(ii, currentDay, options) {
  var bymonth = options.bymonth, byweekno = options.byweekno, byweekday = options.byweekday, byeaster = options.byeaster, bymonthday = options.bymonthday, bynmonthday = options.bynmonthday, byyearday = options.byyearday;
  return notEmpty(bymonth) && !includes(bymonth, ii.mmask[currentDay]) || notEmpty(byweekno) && !ii.wnomask[currentDay] || notEmpty(byweekday) && !includes(byweekday, ii.wdaymask[currentDay]) || notEmpty(ii.nwdaymask) && !ii.nwdaymask[currentDay] || byeaster !== null && !includes(ii.eastermask, currentDay) || (notEmpty(bymonthday) || notEmpty(bynmonthday)) && !includes(bymonthday, ii.mdaymask[currentDay]) && !includes(bynmonthday, ii.nmdaymask[currentDay]) || notEmpty(byyearday) && (currentDay < ii.yearlen && !includes(byyearday, currentDay + 1) && !includes(byyearday, -ii.yearlen + currentDay) || currentDay >= ii.yearlen && !includes(byyearday, currentDay + 1 - ii.yearlen) && !includes(byyearday, -ii.nextyearlen + currentDay - ii.yearlen));
}
function rezoneIfNeeded(date, options) {
  return new DateWithZone(date, options.tzid).rezonedDate();
}
function emitResult(iterResult) {
  return iterResult.getValue();
}
function removeFilteredDays(dayset, start, end, ii, options) {
  var filtered = false;
  for (var dayCounter = start; dayCounter < end; dayCounter++) {
    var currentDay = dayset[dayCounter];
    filtered = isFiltered(ii, currentDay, options);
    if (filtered)
      dayset[currentDay] = null;
  }
  return filtered;
}
function makeTimeset(ii, counterDate, options) {
  var freq = options.freq, byhour = options.byhour, byminute = options.byminute, bysecond = options.bysecond;
  if (freqIsDailyOrGreater(freq)) {
    return buildTimeset(options);
  }
  if (freq >= RRule.HOURLY && notEmpty(byhour) && !includes(byhour, counterDate.hour) || freq >= RRule.MINUTELY && notEmpty(byminute) && !includes(byminute, counterDate.minute) || freq >= RRule.SECONDLY && notEmpty(bysecond) && !includes(bysecond, counterDate.second)) {
    return [];
  }
  return ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second, counterDate.millisecond);
}

// node_modules/rrule/dist/esm/rrule.js
var Days = {
  MO: new Weekday(0),
  TU: new Weekday(1),
  WE: new Weekday(2),
  TH: new Weekday(3),
  FR: new Weekday(4),
  SA: new Weekday(5),
  SU: new Weekday(6)
};
var DEFAULT_OPTIONS = {
  freq: Frequency.YEARLY,
  dtstart: null,
  interval: 1,
  wkst: Days.MO,
  count: null,
  until: null,
  tzid: null,
  bysetpos: null,
  bymonth: null,
  bymonthday: null,
  bynmonthday: null,
  byyearday: null,
  byweekno: null,
  byweekday: null,
  bynweekday: null,
  byhour: null,
  byminute: null,
  bysecond: null,
  byeaster: null
};
var defaultKeys = Object.keys(DEFAULT_OPTIONS);
var RRule = (
  /** @class */
  (function() {
    function RRule2(options, noCache) {
      if (options === void 0) {
        options = {};
      }
      if (noCache === void 0) {
        noCache = false;
      }
      this._cache = noCache ? null : new Cache();
      this.origOptions = initializeOptions(options);
      var parsedOptions = parseOptions(options).parsedOptions;
      this.options = parsedOptions;
    }
    RRule2.parseText = function(text, language) {
      return parseText(text, language);
    };
    RRule2.fromText = function(text, language) {
      return fromText(text, language);
    };
    RRule2.fromString = function(str) {
      return new RRule2(RRule2.parseString(str) || void 0);
    };
    RRule2.prototype._iter = function(iterResult) {
      return iter(iterResult, this.options);
    };
    RRule2.prototype._cacheGet = function(what, args) {
      if (!this._cache)
        return false;
      return this._cache._cacheGet(what, args);
    };
    RRule2.prototype._cacheAdd = function(what, value, args) {
      if (!this._cache)
        return;
      return this._cache._cacheAdd(what, value, args);
    };
    RRule2.prototype.all = function(iterator) {
      if (iterator) {
        return this._iter(new callbackiterresult_default("all", {}, iterator));
      }
      var result = this._cacheGet("all");
      if (result === false) {
        result = this._iter(new iterresult_default("all", {}));
        this._cacheAdd("all", result);
      }
      return result;
    };
    RRule2.prototype.between = function(after, before, inc, iterator) {
      if (inc === void 0) {
        inc = false;
      }
      if (!isValidDate(after) || !isValidDate(before)) {
        throw new Error("Invalid date passed in to RRule.between");
      }
      var args = {
        before,
        after,
        inc
      };
      if (iterator) {
        return this._iter(new callbackiterresult_default("between", args, iterator));
      }
      var result = this._cacheGet("between", args);
      if (result === false) {
        result = this._iter(new iterresult_default("between", args));
        this._cacheAdd("between", result, args);
      }
      return result;
    };
    RRule2.prototype.before = function(dt, inc) {
      if (inc === void 0) {
        inc = false;
      }
      if (!isValidDate(dt)) {
        throw new Error("Invalid date passed in to RRule.before");
      }
      var args = { dt, inc };
      var result = this._cacheGet("before", args);
      if (result === false) {
        result = this._iter(new iterresult_default("before", args));
        this._cacheAdd("before", result, args);
      }
      return result;
    };
    RRule2.prototype.after = function(dt, inc) {
      if (inc === void 0) {
        inc = false;
      }
      if (!isValidDate(dt)) {
        throw new Error("Invalid date passed in to RRule.after");
      }
      var args = { dt, inc };
      var result = this._cacheGet("after", args);
      if (result === false) {
        result = this._iter(new iterresult_default("after", args));
        this._cacheAdd("after", result, args);
      }
      return result;
    };
    RRule2.prototype.count = function() {
      return this.all().length;
    };
    RRule2.prototype.toString = function() {
      return optionsToString(this.origOptions);
    };
    RRule2.prototype.toText = function(gettext, language, dateFormatter) {
      return toText(this, gettext, language, dateFormatter);
    };
    RRule2.prototype.isFullyConvertibleToText = function() {
      return isFullyConvertible(this);
    };
    RRule2.prototype.clone = function() {
      return new RRule2(this.origOptions);
    };
    RRule2.FREQUENCIES = [
      "YEARLY",
      "MONTHLY",
      "WEEKLY",
      "DAILY",
      "HOURLY",
      "MINUTELY",
      "SECONDLY"
    ];
    RRule2.YEARLY = Frequency.YEARLY;
    RRule2.MONTHLY = Frequency.MONTHLY;
    RRule2.WEEKLY = Frequency.WEEKLY;
    RRule2.DAILY = Frequency.DAILY;
    RRule2.HOURLY = Frequency.HOURLY;
    RRule2.MINUTELY = Frequency.MINUTELY;
    RRule2.SECONDLY = Frequency.SECONDLY;
    RRule2.MO = Days.MO;
    RRule2.TU = Days.TU;
    RRule2.WE = Days.WE;
    RRule2.TH = Days.TH;
    RRule2.FR = Days.FR;
    RRule2.SA = Days.SA;
    RRule2.SU = Days.SU;
    RRule2.parseString = parseString;
    RRule2.optionsToString = optionsToString;
    return RRule2;
  })()
);

// node_modules/rrule/dist/esm/iterset.js
function iterSet(iterResult, _rrule, _exrule, _rdate, _exdate, tzid) {
  var _exdateHash = {};
  var _accept = iterResult.accept;
  function evalExdate(after, before) {
    _exrule.forEach(function(rrule) {
      rrule.between(after, before, true).forEach(function(date) {
        _exdateHash[Number(date)] = true;
      });
    });
  }
  _exdate.forEach(function(date) {
    var zonedDate2 = new DateWithZone(date, tzid).rezonedDate();
    _exdateHash[Number(zonedDate2)] = true;
  });
  iterResult.accept = function(date) {
    var dt = Number(date);
    if (isNaN(dt))
      return _accept.call(this, date);
    if (!_exdateHash[dt]) {
      evalExdate(new Date(dt - 1), new Date(dt + 1));
      if (!_exdateHash[dt]) {
        _exdateHash[dt] = true;
        return _accept.call(this, date);
      }
    }
    return true;
  };
  if (iterResult.method === "between") {
    evalExdate(iterResult.args.after, iterResult.args.before);
    iterResult.accept = function(date) {
      var dt = Number(date);
      if (!_exdateHash[dt]) {
        _exdateHash[dt] = true;
        return _accept.call(this, date);
      }
      return true;
    };
  }
  for (var i = 0; i < _rdate.length; i++) {
    var zonedDate = new DateWithZone(_rdate[i], tzid).rezonedDate();
    if (!iterResult.accept(new Date(zonedDate.getTime())))
      break;
  }
  _rrule.forEach(function(rrule) {
    iter(iterResult, rrule.options);
  });
  var res = iterResult._result;
  sort(res);
  switch (iterResult.method) {
    case "all":
    case "between":
      return res;
    case "before":
      return res.length && res[res.length - 1] || null;
    case "after":
    default:
      return res.length && res[0] || null;
  }
}

// node_modules/rrule/dist/esm/rrulestr.js
var DEFAULT_OPTIONS2 = {
  dtstart: null,
  cache: false,
  unfold: false,
  forceset: false,
  compatible: false,
  tzid: null
};
function parseInput(s, options) {
  var rrulevals = [];
  var rdatevals = [];
  var exrulevals = [];
  var exdatevals = [];
  var parsedDtstart = parseDtstart(s);
  var dtstart = parsedDtstart.dtstart;
  var tzid = parsedDtstart.tzid;
  var lines = splitIntoLines(s, options.unfold);
  lines.forEach(function(line) {
    var _a;
    if (!line)
      return;
    var _b = breakDownLine(line), name = _b.name, parms = _b.parms, value = _b.value;
    switch (name.toUpperCase()) {
      case "RRULE":
        if (parms.length) {
          throw new Error("unsupported RRULE parm: ".concat(parms.join(",")));
        }
        rrulevals.push(parseString(line));
        break;
      case "RDATE":
        var _c = (_a = /RDATE(?:;TZID=([^:=]+))?/i.exec(line)) !== null && _a !== void 0 ? _a : [], rdateTzid = _c[1];
        if (rdateTzid && !tzid) {
          tzid = rdateTzid;
        }
        rdatevals = rdatevals.concat(parseRDate(value, parms));
        break;
      case "EXRULE":
        if (parms.length) {
          throw new Error("unsupported EXRULE parm: ".concat(parms.join(",")));
        }
        exrulevals.push(parseString(value));
        break;
      case "EXDATE":
        exdatevals = exdatevals.concat(parseRDate(value, parms));
        break;
      case "DTSTART":
        break;
      default:
        throw new Error("unsupported property: " + name);
    }
  });
  return {
    dtstart,
    tzid,
    rrulevals,
    rdatevals,
    exrulevals,
    exdatevals
  };
}
function buildRule(s, options) {
  var _a = parseInput(s, options), rrulevals = _a.rrulevals, rdatevals = _a.rdatevals, exrulevals = _a.exrulevals, exdatevals = _a.exdatevals, dtstart = _a.dtstart, tzid = _a.tzid;
  var noCache = options.cache === false;
  if (options.compatible) {
    options.forceset = true;
    options.unfold = true;
  }
  if (options.forceset || rrulevals.length > 1 || rdatevals.length || exrulevals.length || exdatevals.length) {
    var rset_1 = new RRuleSet(noCache);
    rset_1.dtstart(dtstart);
    rset_1.tzid(tzid || void 0);
    rrulevals.forEach(function(val2) {
      rset_1.rrule(new RRule(groomRruleOptions(val2, dtstart, tzid), noCache));
    });
    rdatevals.forEach(function(date) {
      rset_1.rdate(date);
    });
    exrulevals.forEach(function(val2) {
      rset_1.exrule(new RRule(groomRruleOptions(val2, dtstart, tzid), noCache));
    });
    exdatevals.forEach(function(date) {
      rset_1.exdate(date);
    });
    if (options.compatible && options.dtstart)
      rset_1.rdate(dtstart);
    return rset_1;
  }
  var val = rrulevals[0] || {};
  return new RRule(groomRruleOptions(val, val.dtstart || options.dtstart || dtstart, val.tzid || options.tzid || tzid), noCache);
}
function rrulestr(s, options) {
  if (options === void 0) {
    options = {};
  }
  return buildRule(s, initializeOptions2(options));
}
function groomRruleOptions(val, dtstart, tzid) {
  return __assign(__assign({}, val), { dtstart, tzid });
}
function initializeOptions2(options) {
  var invalid = [];
  var keys = Object.keys(options);
  var defaultKeys2 = Object.keys(DEFAULT_OPTIONS2);
  keys.forEach(function(key) {
    if (!includes(defaultKeys2, key))
      invalid.push(key);
  });
  if (invalid.length) {
    throw new Error("Invalid options: " + invalid.join(", "));
  }
  return __assign(__assign({}, DEFAULT_OPTIONS2), options);
}
function extractName(line) {
  if (line.indexOf(":") === -1) {
    return {
      name: "RRULE",
      value: line
    };
  }
  var _a = split(line, ":", 1), name = _a[0], value = _a[1];
  return {
    name,
    value
  };
}
function breakDownLine(line) {
  var _a = extractName(line), name = _a.name, value = _a.value;
  var parms = name.split(";");
  if (!parms)
    throw new Error("empty property name");
  return {
    name: parms[0].toUpperCase(),
    parms: parms.slice(1),
    value
  };
}
function splitIntoLines(s, unfold) {
  if (unfold === void 0) {
    unfold = false;
  }
  s = s && s.trim();
  if (!s)
    throw new Error("Invalid empty string");
  if (!unfold) {
    return s.split(/\s/);
  }
  var lines = s.split("\n");
  var i = 0;
  while (i < lines.length) {
    var line = lines[i] = lines[i].replace(/\s+$/g, "");
    if (!line) {
      lines.splice(i, 1);
    } else if (i > 0 && line[0] === " ") {
      lines[i - 1] += line.slice(1);
      lines.splice(i, 1);
    } else {
      i += 1;
    }
  }
  return lines;
}
function validateDateParm(parms) {
  parms.forEach(function(parm) {
    if (!/(VALUE=DATE(-TIME)?)|(TZID=)/.test(parm)) {
      throw new Error("unsupported RDATE/EXDATE parm: " + parm);
    }
  });
}
function parseRDate(rdateval, parms) {
  validateDateParm(parms);
  return rdateval.split(",").map(function(datestr) {
    return untilStringToDate(datestr);
  });
}

// node_modules/rrule/dist/esm/rruleset.js
function createGetterSetter(fieldName) {
  var _this = this;
  return function(field) {
    if (field !== void 0) {
      _this["_".concat(fieldName)] = field;
    }
    if (_this["_".concat(fieldName)] !== void 0) {
      return _this["_".concat(fieldName)];
    }
    for (var i = 0; i < _this._rrule.length; i++) {
      var field_1 = _this._rrule[i].origOptions[fieldName];
      if (field_1) {
        return field_1;
      }
    }
  };
}
var RRuleSet = (
  /** @class */
  (function(_super) {
    __extends(RRuleSet2, _super);
    function RRuleSet2(noCache) {
      if (noCache === void 0) {
        noCache = false;
      }
      var _this = _super.call(this, {}, noCache) || this;
      _this.dtstart = createGetterSetter.apply(_this, ["dtstart"]);
      _this.tzid = createGetterSetter.apply(_this, ["tzid"]);
      _this._rrule = [];
      _this._rdate = [];
      _this._exrule = [];
      _this._exdate = [];
      return _this;
    }
    RRuleSet2.prototype._iter = function(iterResult) {
      return iterSet(iterResult, this._rrule, this._exrule, this._rdate, this._exdate, this.tzid());
    };
    RRuleSet2.prototype.rrule = function(rrule) {
      _addRule(rrule, this._rrule);
    };
    RRuleSet2.prototype.exrule = function(rrule) {
      _addRule(rrule, this._exrule);
    };
    RRuleSet2.prototype.rdate = function(date) {
      _addDate(date, this._rdate);
    };
    RRuleSet2.prototype.exdate = function(date) {
      _addDate(date, this._exdate);
    };
    RRuleSet2.prototype.rrules = function() {
      return this._rrule.map(function(e) {
        return rrulestr(e.toString());
      });
    };
    RRuleSet2.prototype.exrules = function() {
      return this._exrule.map(function(e) {
        return rrulestr(e.toString());
      });
    };
    RRuleSet2.prototype.rdates = function() {
      return this._rdate.map(function(e) {
        return new Date(e.getTime());
      });
    };
    RRuleSet2.prototype.exdates = function() {
      return this._exdate.map(function(e) {
        return new Date(e.getTime());
      });
    };
    RRuleSet2.prototype.valueOf = function() {
      var result = [];
      if (!this._rrule.length && this._dtstart) {
        result = result.concat(optionsToString({ dtstart: this._dtstart }));
      }
      this._rrule.forEach(function(rrule) {
        result = result.concat(rrule.toString().split("\n"));
      });
      this._exrule.forEach(function(exrule) {
        result = result.concat(exrule.toString().split("\n").map(function(line) {
          return line.replace(/^RRULE:/, "EXRULE:");
        }).filter(function(line) {
          return !/^DTSTART/.test(line);
        }));
      });
      if (this._rdate.length) {
        result.push(rdatesToString("RDATE", this._rdate, this.tzid()));
      }
      if (this._exdate.length) {
        result.push(rdatesToString("EXDATE", this._exdate, this.tzid()));
      }
      return result;
    };
    RRuleSet2.prototype.toString = function() {
      return this.valueOf().join("\n");
    };
    RRuleSet2.prototype.clone = function() {
      var rrs = new RRuleSet2(!!this._cache);
      this._rrule.forEach(function(rule) {
        return rrs.rrule(rule.clone());
      });
      this._exrule.forEach(function(rule) {
        return rrs.exrule(rule.clone());
      });
      this._rdate.forEach(function(date) {
        return rrs.rdate(new Date(date.getTime()));
      });
      this._exdate.forEach(function(date) {
        return rrs.exdate(new Date(date.getTime()));
      });
      return rrs;
    };
    return RRuleSet2;
  })(RRule)
);
function _addRule(rrule, collection) {
  if (!(rrule instanceof RRule)) {
    throw new TypeError(String(rrule) + " is not RRule instance");
  }
  if (!includes(collection.map(String), String(rrule))) {
    collection.push(rrule);
  }
}
function _addDate(date, collection) {
  if (!(date instanceof Date)) {
    throw new TypeError(String(date) + " is not Date instance");
  }
  if (!includes(collection.map(Number), Number(date))) {
    collection.push(date);
    sort(collection);
  }
}
function rdatesToString(param, rdates, tzid) {
  var isUTC = !tzid || tzid.toUpperCase() === "UTC";
  var header = isUTC ? "".concat(param, ":") : "".concat(param, ";TZID=").concat(tzid, ":");
  var dateString = rdates.map(function(rdate) {
    return timeToUntilString(rdate.valueOf(), isUTC);
  }).join(",");
  return "".concat(header).concat(dateString);
}

// src/app/core/utils/lesson-recurrence-config.ts
var DEFAULT_RECURRENCE_CONFIG = {
  preset: "none",
  interval: 1,
  byDay: [],
  customFreq: "daily",
  endMode: "never",
  untilDate: null,
  count: 10
};
function clampInterval(value) {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.min(99, Math.max(1, Math.round(value)));
}
function clampCount(value) {
  if (value == null || !Number.isFinite(value)) {
    return 10;
  }
  return Math.min(999, Math.max(1, Math.round(value)));
}
function formatUntilForRrule(untilDate) {
  const compact = untilDate.replace(/-/g, "").slice(0, 8);
  return `UNTIL=${compact}T235959Z`;
}
function appendEndSegments(segments, config) {
  if (config.endMode === "until" && config.untilDate && /^\d{4}-\d{2}-\d{2}$/.test(config.untilDate)) {
    segments.push(formatUntilForRrule(config.untilDate));
  } else if (config.endMode === "count" && config.count) {
    segments.push(`COUNT=${clampCount(config.count)}`);
  }
}
function effectiveFreq(config) {
  if (config.preset === "none") {
    return null;
  }
  if (config.preset === "custom") {
    return config.customFreq;
  }
  if (config.preset === "daily") {
    return "daily";
  }
  if (config.preset === "weekly") {
    return "weekly";
  }
  return "monthly";
}
function buildRruleFromConfig(config, startDate) {
  if (config.preset === "none" || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return null;
  }
  const freq = effectiveFreq(config);
  if (!freq) {
    return null;
  }
  const interval = clampInterval(config.interval);
  const segments = [];
  if (freq === "daily") {
    segments.push("FREQ=DAILY", `INTERVAL=${interval}`);
  } else if (freq === "weekly") {
    const normalized = [...new Set(config.byDay.map((d) => d.toUpperCase()))].filter((d) => RRULE_WEEKDAY_CODES.includes(d));
    if (normalized.length === 0) {
      return null;
    }
    segments.push("FREQ=WEEKLY", `INTERVAL=${interval}`, `BYDAY=${normalized.join(",")}`);
  } else {
    const monthDay = Number(startDate.slice(8, 10));
    if (Number.isNaN(monthDay) || monthDay < 1 || monthDay > 31) {
      return null;
    }
    segments.push("FREQ=MONTHLY", `INTERVAL=${interval}`, `BYMONTHDAY=${monthDay}`);
  }
  appendEndSegments(segments, config);
  return segments.join(";");
}
function parseRruleToConfig(rrule, anchor) {
  if (!rrule) {
    return __spreadValues({}, DEFAULT_RECURRENCE_CONFIG);
  }
  const parts = parseRruleParts(rrule);
  const interval = clampInterval(parts["INTERVAL"] ? Number(parts["INTERVAL"]) : 1);
  const byDay = parseByDayFromRrule(rrule);
  const untilDate = parseUntilFromRrule(rrule);
  const countRaw = parts["COUNT"] ? Number(parts["COUNT"]) : null;
  let endMode = "never";
  let until = null;
  let count = null;
  if (untilDate) {
    endMode = "until";
    until = untilDate;
  } else if (countRaw && !Number.isNaN(countRaw)) {
    endMode = "count";
    count = clampCount(countRaw);
  }
  const freq = (parts["FREQ"] ?? "WEEKLY").toUpperCase();
  if (freq === "DAILY") {
    return {
      preset: "daily",
      interval,
      byDay: anchor ? [jsDayToRruleWeekday(anchor.getDay())] : byDay,
      customFreq: "daily",
      endMode,
      untilDate: until,
      count
    };
  }
  if (freq === "MONTHLY") {
    return {
      preset: "monthly",
      interval,
      byDay: anchor ? [jsDayToRruleWeekday(anchor.getDay())] : byDay,
      customFreq: "monthly",
      endMode,
      untilDate: until,
      count
    };
  }
  return {
    preset: "weekly",
    interval,
    byDay: byDay.length > 0 ? byDay : anchor ? [jsDayToRruleWeekday(anchor.getDay())] : [],
    customFreq: "weekly",
    endMode,
    untilDate: until,
    count
  };
}
function configFromPreset(preset, anchor, previous) {
  const base = previous ? __spreadProps(__spreadValues({}, previous), { preset }) : __spreadProps(__spreadValues({}, DEFAULT_RECURRENCE_CONFIG), { preset });
  if (preset === "none") {
    return __spreadValues({}, DEFAULT_RECURRENCE_CONFIG);
  }
  if (preset === "daily") {
    return __spreadProps(__spreadValues({}, base), { preset, customFreq: "daily", interval: base.interval || 1 });
  }
  if (preset === "weekly") {
    const day = jsDayToRruleWeekday(anchor.getDay());
    return __spreadProps(__spreadValues({}, base), {
      preset,
      customFreq: "weekly",
      interval: base.interval || 1,
      byDay: base.byDay.length > 0 ? base.byDay : [day]
    });
  }
  if (preset === "monthly") {
    return __spreadProps(__spreadValues({}, base), { preset, customFreq: "monthly", interval: base.interval || 1 });
  }
  return __spreadProps(__spreadValues({}, base), {
    preset: "custom",
    byDay: base.byDay.length > 0 ? base.byDay : [jsDayToRruleWeekday(anchor.getDay())]
  });
}
function formatRecurrenceSummary(config, labels, startDate) {
  if (config.preset === "none") {
    return labels.none;
  }
  const freq = effectiveFreq(config);
  const n = clampInterval(config.interval);
  let main = labels.none;
  if (config.preset === "daily" || config.preset === "custom" && freq === "daily") {
    main = n === 1 ? labels.daily : labels.dailyInterval.replace("{n}", String(n));
  } else if (config.preset === "weekly" || config.preset === "custom" && freq === "weekly") {
    const days = config.byDay.map((code) => labels.weekdays[code]).join(", ");
    const weekly = n === 1 ? labels.weekly.replace("{days}", days) : labels.weeklyInterval.replace("{n}", String(n)).replace("{days}", days);
    main = days ? weekly : labels.weekly.replace("{days}", "\u2014");
  } else if (config.preset === "monthly" || config.preset === "custom" && freq === "monthly") {
    const day = startDate?.slice(8, 10) ?? "\u2014";
    main = n === 1 ? labels.monthly.replace("{day}", day) : labels.monthlyInterval.replace("{n}", String(n)).replace("{day}", day);
  } else if (config.preset === "custom") {
    main = labels.custom;
  }
  if (config.endMode === "until" && config.untilDate) {
    return `${main} \xB7 ${labels.endUntil.replace("{date}", config.untilDate)}`;
  }
  if (config.endMode === "count" && config.count) {
    return `${main} \xB7 ${labels.endCount.replace("{n}", String(config.count))}`;
  }
  if (config.endMode === "never") {
    return `${main} \xB7 ${labels.endNever}`;
  }
  return main;
}
function isRecurrenceConfigActive(config) {
  return config.preset !== "none";
}

// src/app/core/utils/lesson-recurrence.ts
var RRULE_WEEKDAY_CODES = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
var BYDAY_TO_WEEKDAY = {
  MO: RRule.MO,
  TU: RRule.TU,
  WE: RRule.WE,
  TH: RRule.TH,
  FR: RRule.FR,
  SA: RRule.SA,
  SU: RRule.SU
};
var JS_DAY_TO_RRULE = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
function jsDayToRruleWeekday(jsDay) {
  return JS_DAY_TO_RRULE[jsDay] ?? "MO";
}
function parseRruleParts(rrule) {
  const parts = {};
  if (!rrule) {
    return parts;
  }
  for (const segment of rrule.split(";")) {
    const [key, value] = segment.split("=");
    if (key && value) {
      parts[key.trim().toUpperCase()] = value.trim();
    }
  }
  return parts;
}
function parseByDayFromRrule(rrule) {
  const parts = parseRruleParts(rrule);
  if (!parts["BYDAY"]) {
    return [];
  }
  return parts["BYDAY"].split(",").map((part) => part.trim().toUpperCase()).filter((part) => RRULE_WEEKDAY_CODES.includes(part));
}
function parseUntilFromRrule(rrule) {
  const parts = parseRruleParts(rrule);
  if (!parts["UNTIL"]) {
    return null;
  }
  const compact = parts["UNTIL"].replace(/[^0-9]/g, "").slice(0, 8);
  if (compact.length !== 8) {
    return null;
  }
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
}
function applyAnchorTime(date, anchor) {
  const next = new Date(date);
  next.setHours(anchor.getHours(), anchor.getMinutes(), anchor.getSeconds(), 0);
  return next;
}
function parseStartDate(startDate, anchor) {
  if (startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    const [y, m, d] = startDate.split("-").map(Number);
    return new Date(y, m - 1, d, anchor.getHours(), anchor.getMinutes(), 0, 0);
  }
  return new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate(), anchor.getHours(), anchor.getMinutes(), 0, 0);
}
function endOfLocalDay(date) {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}
function dayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function buildRule2(lesson) {
  if (!(lesson.isRecurring || lesson.rrule) || !lesson.rrule || !lesson.scheduledAt) {
    return null;
  }
  const anchor = new Date(lesson.scheduledAt);
  if (Number.isNaN(anchor.getTime())) {
    return null;
  }
  const parts = parseRruleParts(lesson.rrule);
  const dtstart = parseStartDate(lesson.startDate ?? null, anchor);
  const options = {
    dtstart,
    freq: RRule.WEEKLY,
    interval: parts["INTERVAL"] ? Math.max(1, Number(parts["INTERVAL"])) : 1
  };
  const freq = (parts["FREQ"] ?? "WEEKLY").toUpperCase();
  if (freq === "DAILY") {
    options.freq = RRule.DAILY;
  } else if (freq === "MONTHLY") {
    options.freq = RRule.MONTHLY;
    options.bymonthday = parts["BYMONTHDAY"] ? Number(parts["BYMONTHDAY"]) : dtstart.getDate();
  } else {
    const byDay = parseByDayFromRrule(lesson.rrule);
    if (byDay.length === 0) {
      return null;
    }
    options.freq = RRule.WEEKLY;
    options.byweekday = byDay.map((code) => BYDAY_TO_WEEKDAY[code]);
  }
  if (parts["COUNT"]) {
    const count = Number(parts["COUNT"]);
    if (!Number.isNaN(count) && count > 0) {
      options.count = count;
    }
  }
  const untilDate = parseUntilFromRrule(lesson.rrule);
  if (untilDate) {
    const [y, m, d] = untilDate.split("-").map(Number);
    options.until = new Date(y, m - 1, d, 23, 59, 59, 999);
  }
  return new RRule(options);
}
function filterOccurrenceDates(dates, lesson) {
  const exdates = new Set((lesson.exdates ?? []).map((item) => String(item).slice(0, 10)));
  return dates.filter((date) => !exdates.has(dayKey(date)));
}
function statusForOccurrence(lesson, occurrenceDate) {
  const completed = new Set((lesson.completedDates ?? []).map((item) => String(item).slice(0, 10)));
  if (completed.has(occurrenceDate)) {
    return "completed";
  }
  return lesson.status === "completed" ? "scheduled" : lesson.status;
}
function expandLessonOccurrences(lesson, rangeStart, rangeEnd) {
  const recurring = Boolean(lesson.isRecurring || lesson.rrule);
  if (!recurring || !lesson.rrule || !lesson.scheduledAt) {
    return [lesson];
  }
  const rule = buildRule2(lesson);
  if (!rule) {
    return [lesson];
  }
  const anchor = new Date(lesson.scheduledAt);
  const inclusiveEnd = endOfLocalDay(rangeEnd);
  const dates = filterOccurrenceDates(rule.between(rangeStart, inclusiveEnd, true), lesson);
  return dates.map((occurrence) => {
    const scheduledAt = applyAnchorTime(occurrence, anchor).toISOString();
    const key = dayKey(occurrence);
    return __spreadProps(__spreadValues({}, lesson), {
      scheduledAt,
      status: statusForOccurrence(lesson, key),
      occurrenceKey: `${lesson._id}:${key}`,
      isVirtualOccurrence: true
    });
  });
}
function expandLessonsForRange(lessons, rangeStart, rangeEnd) {
  const result = [];
  for (const lesson of lessons) {
    if ((lesson.isRecurring || lesson.rrule) && lesson.rrule) {
      result.push(...expandLessonOccurrences(lesson, rangeStart, rangeEnd));
    } else if (lesson.scheduledAt) {
      result.push(lesson);
    }
  }
  return result;
}
function expandLessonOccurrencesForConflictCheck(lesson, weeksAhead = 26) {
  if (!lesson.isRecurring || !lesson.rrule || !lesson.scheduledAt) {
    const single = new Date(lesson.scheduledAt);
    return Number.isNaN(single.getTime()) ? [] : [single];
  }
  const rule = buildRule2(lesson);
  if (!rule) {
    return [];
  }
  const start = parseStartDate(lesson.startDate ?? null, new Date(lesson.scheduledAt));
  const end = new Date(start);
  end.setDate(end.getDate() + weeksAhead * 7);
  return filterOccurrenceDates(rule.between(start, end, true), lesson);
}

// src/app/features/calendar/calendar.component.ts
var _c0 = ["gridScroll"];
var _c1 = ["scrollContainer"];
var _c2 = (a0) => [a0];
var _forTrack0 = ($index, $item) => $item._id;
function _forTrack1($index, $item) {
  return this.dayKey($item.date);
}
var _forTrack2 = ($index, $item) => $item.occurrenceKey ?? $item._id;
function _forTrack3($index, $item) {
  return this.dayKey($item);
}
var _forTrack4 = ($index, $item) => $item.code;
function CalendarComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.loadError);
  }
}
function CalendarComponent_Conditional_3_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 27);
  }
}
function CalendarComponent_Conditional_3_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 27);
  }
}
function CalendarComponent_Conditional_3_For_23_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 32);
  }
}
function CalendarComponent_Conditional_3_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275repeaterCreate(1, CalendarComponent_Conditional_3_For_23_For_2_Template, 1, 0, "span", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.skeletonHourRows);
  }
}
function CalendarComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "span", 16);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 17)(4, "div", 18);
    \u0275\u0275element(5, "span", 19)(6, "span", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 21);
    \u0275\u0275element(8, "span", 22)(9, "span", 22)(10, "span", 22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 23)(12, "div", 24);
    \u0275\u0275element(13, "span", 25);
    \u0275\u0275elementStart(14, "div", 26);
    \u0275\u0275repeaterCreate(15, CalendarComponent_Conditional_3_For_16_Template, 1, 0, "span", 27, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 28)(18, "div", 29);
    \u0275\u0275repeaterCreate(19, CalendarComponent_Conditional_3_For_20_Template, 1, 0, "span", 27, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 30);
    \u0275\u0275repeaterCreate(22, CalendarComponent_Conditional_3_For_23_Template, 3, 0, "div", 31, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.calendarUi().loadSchedule);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.sharedUi().loadingContent);
    \u0275\u0275advance(13);
    \u0275\u0275repeater(ctx_r0.skeletonGridCols);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.skeletonHourRows);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.skeletonGridCols);
  }
}
function CalendarComponent_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 67);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_Conditional_0_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      ctx_r0.modesMenuOpen.set(false);
      return \u0275\u0275resetView(ctx_r0.studentsSidebarOpen.set(false));
    });
    \u0275\u0275elementEnd();
  }
}
function CalendarComponent_Conditional_4_Conditional_1_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 75);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_Conditional_1_For_8_Template_button_click_0_listener() {
      const mode_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.setViewMode(mode_r6));
    });
    \u0275\u0275elementStart(1, "span", 76);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 77);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const mode_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("cal-modes-drawer__item--active", ctx_r0.viewMode() === mode_r6);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(mode_r6);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.viewModeLabel(mode_r6));
  }
}
function CalendarComponent_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "aside", 68)(1, "div", 69)(2, "h2", 70);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 71);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_Conditional_1_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.modesMenuOpen.set(false));
    });
    \u0275\u0275element(5, "img", 72);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "nav", 73);
    \u0275\u0275repeaterCreate(7, CalendarComponent_Conditional_4_Conditional_1_For_8_Template, 5, 4, "button", 74, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("cal-modes-drawer--open", ctx_r0.modesMenuOpen());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().modeDrawerTitle);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.studentsUi().close);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.viewModes);
  }
}
function CalendarComponent_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 78);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleModesMenu());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 79);
    \u0275\u0275element(2, "line", 80)(3, "line", 81)(4, "line", 82);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-expanded", ctx_r0.modesMenuOpen())("aria-label", ctx_r0.i18n.calendarUi().modeDrawerTitle);
  }
}
function CalendarComponent_Conditional_4_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h1", 39);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().title);
  }
}
function CalendarComponent_Conditional_4_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 42);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function CalendarComponent_Conditional_4_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 83);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_Conditional_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.navPrev());
    });
    \u0275\u0275text(1, " \u2039 ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.calendarUi().prev);
  }
}
function CalendarComponent_Conditional_4_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 47);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.todayDayOfMonth());
  }
}
function CalendarComponent_Conditional_4_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 48);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().today);
  }
}
function CalendarComponent_Conditional_4_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 83);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_Conditional_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.navNext());
    });
    \u0275\u0275text(1, " \u203A ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.calendarUi().next);
  }
}
function CalendarComponent_Conditional_4_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-select", 84);
    \u0275\u0275listener("ngModelChange", function CalendarComponent_Conditional_4_Conditional_18_Template_app_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onViewModeSelect($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngModel", ctx_r0.viewMode())("options", ctx_r0.viewModeSelectOptions())("ariaLabel", ctx_r0.i18n.calendarUi().modeDrawerTitle);
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_1_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 91);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const label_r11 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(label_r11);
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_1_For_10_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 98);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const lesson_r14 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275styleProp("background", ctx_r0.monthLessonBadgeColor(lesson_r14));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.monthLessonBadgeLabel(lesson_r14));
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_1_For_10_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 99);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const hidden_r15 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.monthMoreLessonsLabel(hidden_r15));
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_1_For_10_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CalendarComponent_Conditional_4_For_27_Conditional_1_For_10_Conditional_6_Conditional_0_Template, 2, 1, "span", 99);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx > 0 ? 0 : -1);
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_1_For_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 94);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_For_27_Conditional_1_For_10_Template_button_click_0_listener() {
      const cell_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.openDayView(cell_r13.date));
    });
    \u0275\u0275elementStart(1, "span", 95);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 96);
    \u0275\u0275repeaterCreate(4, CalendarComponent_Conditional_4_For_27_Conditional_1_For_10_For_5_Template, 2, 3, "span", 97, _forTrack2);
    \u0275\u0275conditionalCreate(6, CalendarComponent_Conditional_4_For_27_Conditional_1_For_10_Conditional_6_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_28_0;
    const cell_r13 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("cal-month__cell--outside", !cell_r13.inMonth)("cal-month__cell--today", ctx_r0.isToday(cell_r13.date))("cal-month__cell--has-lessons", ctx_r0.lessonCountForDay(cell_r13.date) > 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(cell_r13.date.getDate());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.monthBadgeLessons(cell_r13.date));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_28_0 = ctx_r0.monthHiddenLessonCount(cell_r13.date)) ? 6 : -1, tmp_28_0);
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 86)(1, "p", 87);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 88)(4, "div", 89)(5, "div", 90);
    \u0275\u0275repeaterCreate(6, CalendarComponent_Conditional_4_For_27_Conditional_1_For_7_Template, 2, 1, "div", 91, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 92);
    \u0275\u0275repeaterCreate(9, CalendarComponent_Conditional_4_For_27_Conditional_1_For_10_Template, 7, 8, "button", 93, _forTrack1, true);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatMonthYearLabel());
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.weekdayLabels());
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("--cal-month-weeks", ctx_r0.monthWeekRows());
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.monthOverviewCells());
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 115);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_For_27_Conditional_2_For_5_Template_button_click_0_listener($event) {
      const col_r18 = \u0275\u0275restoreView(_r17).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      ctx_r0.openDayView(col_r18);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const col_r18 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("cal-day-header--today", ctx_r0.isToday(col_r18))("cal-day-header--off", ctx_r0.isNonWorkingDay(col_r18));
    \u0275\u0275attribute("aria-label", ctx_r0.formatColumnHeader(col_r18));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatColumnHeader(col_r18), " ");
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 116);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const hour_r19 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275styleProp("height", ctx_r0.hourHeightPx, "px");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatHourLabel(hour_r19), " ");
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 117);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275styleProp("top", ctx, "px");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.nowTimeLabel(), " ");
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().dayOffLabel, " ");
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 123);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275styleProp("height", ctx_r0.hourHeightPx, "px");
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Conditional_4_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 127);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const phantomLesson_r22 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", ctx_r0.formatLessonRegion(phantomLesson_r22), " \xB7 ", ctx_r0.formatLessonSnapshotRate(phantomLesson_r22), " \xB7 ", ctx_r0.formatLessonDuration(phantomLesson_r22.lesson_duration), " ");
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Conditional_4_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 128)(1, "p", 129)(2, "span", 130);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "p", 129)(7, "span", 130);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "p", 129)(12, "span", 130);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const phantomLesson_r22 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(6);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().regionLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatLessonRegion(phantomLesson_r22));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().rateLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatLessonSnapshotRate(phantomLesson_r22));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().durationLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatLessonDuration(phantomLesson_r22.lesson_duration));
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 126);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Conditional_4_Conditional_1_Conditional_2_Template, 2, 3, "p", 127)(3, CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Conditional_4_Conditional_1_Conditional_3_Template, 16, 6, "div", 128);
  }
  if (rf & 2) {
    const phantomLesson_r22 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", phantomLesson_r22.student_name || ctx_r0.getStudentName(phantomLesson_r22.student_id), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.lessonCardUseCompactMeta(phantomLesson_r22) ? 2 : 3);
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 124);
    \u0275\u0275conditionalCreate(1, CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Conditional_4_Conditional_1_Template, 4, 2);
    \u0275\u0275elementStart(2, "p", 125);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_26_0;
    let tmp_28_0;
    let tmp_29_0;
    let tmp_30_0;
    let tmp_31_0;
    let tmp_32_0;
    const col_r21 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275styleProp("border-left-color", ctx_r0.getStudentColor((tmp_26_0 = ctx_r0.draggedLesson()) == null ? null : tmp_26_0.student_id))("top", ctx_r0.phantomTopForColumn(col_r21) ?? 0, "px");
    \u0275\u0275classProp("cal-lesson-card--scheduled", ((tmp_28_0 = ctx_r0.draggedLesson()) == null ? null : tmp_28_0.status) === "scheduled")("cal-lesson-card--completed", ((tmp_29_0 = ctx_r0.draggedLesson()) == null ? null : tmp_29_0.status) === "completed")("cal-lesson-card--missed", ((tmp_30_0 = ctx_r0.draggedLesson()) == null ? null : tmp_30_0.status) === "missed")("cal-lesson-card--canceled", ((tmp_31_0 = ctx_r0.draggedLesson()) == null ? null : tmp_31_0.status) === "canceled");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_32_0 = ctx_r0.draggedLesson()) ? 1 : -1, tmp_32_0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.phantomDropTimeLabel(), " ");
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_For_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 127);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const lesson_r24 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", ctx_r0.formatLessonRegion(lesson_r24), " \xB7 ", ctx_r0.formatLessonSnapshotRate(lesson_r24), " \xB7 ", ctx_r0.formatLessonDuration(lesson_r24.lesson_duration), " ");
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_For_6_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 128)(1, "p", 129)(2, "span", 130);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "p", 129)(7, "span", 130);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "p", 129)(12, "span", 130);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const lesson_r24 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().regionLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatLessonRegion(lesson_r24));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().rateLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatLessonSnapshotRate(lesson_r24));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().durationLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatLessonDuration(lesson_r24.lesson_duration));
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 131);
    \u0275\u0275listener("dragstart", function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_For_6_Template_div_dragstart_0_listener($event) {
      const lesson_r24 = \u0275\u0275restoreView(_r23).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.onLessonDragStart($event, lesson_r24));
    })("dragend", function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_For_6_Template_div_dragend_0_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.onLessonDragEnd());
    })("pointerdown", function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_For_6_Template_div_pointerdown_0_listener($event) {
      const lesson_r24 = \u0275\u0275restoreView(_r23).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.onLessonPointerDown($event, lesson_r24));
    })("click", function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_For_6_Template_div_click_0_listener($event) {
      const lesson_r24 = \u0275\u0275restoreView(_r23).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.onLessonCardClick($event, lesson_r24));
    });
    \u0275\u0275elementStart(1, "p", 126);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_For_6_Conditional_3_Template, 2, 3, "p", 127)(4, CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_For_6_Conditional_4_Template, 16, 6, "div", 128);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const lesson_r24 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275classMap(ctx_r0.lessonCardClass(lesson_r24));
    \u0275\u0275styleProp("top", ctx_r0.calculateTop(ctx_r0.displayScheduledAt(lesson_r24)), "px")("height", ctx_r0.calculateHeight(lesson_r24.lesson_duration), "px")("border-left-color", ctx_r0.getStudentColor(lesson_r24.student_id));
    \u0275\u0275classProp("cal-lesson-card--last-paid", lesson_r24.isLastPaid);
    \u0275\u0275attribute("draggable", ctx_r0.useNativeLessonDrag() ? true : null);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.getStudentName(lesson_r24.student_id), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.lessonCardUseCompactMeta(lesson_r24) ? 3 : 4);
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 118);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Template_div_click_0_listener($event) {
      const col_r21 = \u0275\u0275restoreView(_r20).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.onDayColumnClick(col_r21, $event));
    })("dragover", function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Template_div_dragover_0_listener($event) {
      const col_r21 = \u0275\u0275restoreView(_r20).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.onDayColumnDragOver($event, col_r21));
    })("drop", function CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Template_div_drop_0_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.onDayColumnDrop($event));
    });
    \u0275\u0275conditionalCreate(1, CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Conditional_1_Template, 2, 1, "div", 119);
    \u0275\u0275repeaterCreate(2, CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_For_3_Template, 1, 2, "div", 120, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275conditionalCreate(4, CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Conditional_4_Template, 4, 14, "div", 121);
    \u0275\u0275repeaterCreate(5, CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_For_6_Template, 5, 13, "div", 122, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const col_r21 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("cal-day-column--drag-target", ctx_r0.isDayDragTarget(col_r21))("cal-day-column--off", ctx_r0.isNonWorkingDay(col_r21));
    \u0275\u0275attribute("data-day-key", ctx_r0.dayKey(col_r21));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isNonWorkingDay(col_r21) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.gridHours());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.showPhantomInColumn(col_r21) ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.lessonsForColumn(col_r21));
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 132);
  }
  if (rf & 2) {
    \u0275\u0275styleProp("top", ctx, "px");
  }
}
function CalendarComponent_Conditional_4_For_27_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 100);
    \u0275\u0275element(1, "div", 101);
    \u0275\u0275elementStart(2, "div", 102)(3, "div", 103);
    \u0275\u0275repeaterCreate(4, CalendarComponent_Conditional_4_For_27_Conditional_2_For_5_Template, 2, 6, "button", 104, _forTrack3, true);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(6, "div", 105, 1);
    \u0275\u0275listener("dragover", function CalendarComponent_Conditional_4_For_27_Conditional_2_Template_div_dragover_6_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onScrollContainerDragOver($event));
    });
    \u0275\u0275elementStart(9, "div", 106)(10, "div", 107);
    \u0275\u0275repeaterCreate(11, CalendarComponent_Conditional_4_For_27_Conditional_2_For_12_Template, 2, 3, "div", 108, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(13, "span", 109);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(15, CalendarComponent_Conditional_4_For_27_Conditional_2_Conditional_15_Template, 2, 3, "div", 110);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 111)(17, "div", 112);
    \u0275\u0275repeaterCreate(18, CalendarComponent_Conditional_4_For_27_Conditional_2_For_19_Template, 7, 7, "div", 113, _forTrack3, true);
    \u0275\u0275conditionalCreate(20, CalendarComponent_Conditional_4_For_27_Conditional_2_Conditional_20_Template, 1, 2, "div", 114);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_22_0;
    let tmp_25_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("grid-template-columns", ctx_r0.gridTemplateColumns());
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.columns());
    \u0275\u0275advance(5);
    \u0275\u0275styleProp("--cal-grid-height", ctx_r0.gridHeightPx(), "px")("--cal-grid-bottom-air", ctx_r0.gridBottomPaddingPx, "px");
    \u0275\u0275advance();
    \u0275\u0275styleProp("height", ctx_r0.gridHeightPx(), "px");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.gridHours());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatHourLabel(ctx_r0.gridEndHour()));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_22_0 = ctx_r0.nowLineTopPx()) ? 15 : -1, tmp_22_0);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("grid-template-columns", ctx_r0.gridTemplateColumns());
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.columns());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_25_0 = ctx_r0.nowLineTopPx()) ? 20 : -1, tmp_25_0);
  }
}
function CalendarComponent_Conditional_4_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 85);
    \u0275\u0275conditionalCreate(1, CalendarComponent_Conditional_4_For_27_Conditional_1_Template, 11, 3, "div", 86)(2, CalendarComponent_Conditional_4_For_27_Conditional_2_Template, 21, 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("cal-period-view--enter-next", ctx_r0.periodEnterFrom() === "next")("cal-period-view--enter-prev", ctx_r0.periodEnterFrom() === "prev");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isMonthOverview() ? 1 : 2);
  }
}
function CalendarComponent_Conditional_4_For_35_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 139);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 ", ctx_r0.i18n.calendarUi().lastLessonHint, " ");
  }
}
function CalendarComponent_Conditional_4_For_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "button", 133);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_For_35_Template_button_click_1_listener() {
      const sidebarStudent_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.selectSidebarStudent(sidebarStudent_r26._id));
    });
    \u0275\u0275element(2, "span", 134);
    \u0275\u0275elementStart(3, "span", 135)(4, "span", 136);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 137)(7, "span", 138);
    \u0275\u0275text(8);
    \u0275\u0275conditionalCreate(9, CalendarComponent_Conditional_4_For_35_Conditional_9_Template, 2, 1, "span", 139);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 140);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "currency");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const sidebarStudent_r26 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275styleProp("border-left-color", ctx_r0.focusedStudentId() === sidebarStudent_r26._id ? ctx_r0.getStudentColor(sidebarStudent_r26._id) : null);
    \u0275\u0275classProp("cal-sidebar__item-btn--active", ctx_r0.focusedStudentId() === sidebarStudent_r26._id);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", ctx_r0.getStudentColor(sidebarStudent_r26._id));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(sidebarStudent_r26.name);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("cal-sidebar__balance--last", ctx_r0.isPackageLastBalance(sidebarStudent_r26));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", sidebarStudent_r26.balance_lessons, " ", ctx_r0.i18n.studentsUi().lessonsShort, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isPackageLastBalance(sidebarStudent_r26) ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", \u0275\u0275pipeBind4(12, 14, sidebarStudent_r26.rate_per_hour, sidebarStudent_r26.rate_currency ?? "EUR", "code", "1.0-0"), "", ctx_r0.i18n.studentsUi().perHour, " ");
  }
}
function CalendarComponent_Conditional_4_ForEmpty_36_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().studentsSidebarEmpty, " ");
  }
}
function CalendarComponent_Conditional_4_ForEmpty_36_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().studentsSidebarNoResults, " ");
  }
}
function CalendarComponent_Conditional_4_ForEmpty_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 62);
    \u0275\u0275conditionalCreate(1, CalendarComponent_Conditional_4_ForEmpty_36_Conditional_1_Template, 1, 1)(2, CalendarComponent_Conditional_4_ForEmpty_36_Conditional_2_Template, 1, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.students().length === 0 ? 1 : 2);
  }
}
function CalendarComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, CalendarComponent_Conditional_4_Conditional_0_Template, 1, 0, "div", 33);
    \u0275\u0275conditionalCreate(1, CalendarComponent_Conditional_4_Conditional_1_Template, 9, 4, "aside", 34);
    \u0275\u0275elementStart(2, "header", 35)(3, "div", 36);
    \u0275\u0275conditionalCreate(4, CalendarComponent_Conditional_4_Conditional_4_Template, 5, 2, "button", 37);
    \u0275\u0275elementStart(5, "div", 38);
    \u0275\u0275conditionalCreate(6, CalendarComponent_Conditional_4_Conditional_6_Template, 2, 1, "h1", 39);
    \u0275\u0275elementStart(7, "p", 40)(8, "span", 41);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, CalendarComponent_Conditional_4_Conditional_10_Template, 2, 1, "span", 42);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 43)(12, "div", 44);
    \u0275\u0275conditionalCreate(13, CalendarComponent_Conditional_4_Conditional_13_Template, 2, 1, "button", 45);
    \u0275\u0275elementStart(14, "button", 46);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.goToToday());
    });
    \u0275\u0275conditionalCreate(15, CalendarComponent_Conditional_4_Conditional_15_Template, 2, 1, "span", 47)(16, CalendarComponent_Conditional_4_Conditional_16_Template, 2, 1, "span", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(17, CalendarComponent_Conditional_4_Conditional_17_Template, 2, 1, "button", 45);
    \u0275\u0275conditionalCreate(18, CalendarComponent_Conditional_4_Conditional_18_Template, 1, 3, "app-select", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 50);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleStudentsSidebar());
    });
    \u0275\u0275element(20, "img", 51);
    \u0275\u0275elementStart(21, "span", 52);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(23, "div", 53)(24, "section", 54);
    \u0275\u0275listener("touchstart", function CalendarComponent_Conditional_4_Template_section_touchstart_24_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onPeriodSwipeStart($event));
    })("touchend", function CalendarComponent_Conditional_4_Template_section_touchend_24_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onPeriodSwipeEnd($event));
    });
    \u0275\u0275elementStart(25, "div", 55);
    \u0275\u0275repeaterCreate(26, CalendarComponent_Conditional_4_For_27_Template, 3, 5, "div", 56, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "aside", 57)(29, "div", 58)(30, "button", 59);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.clearStudentFocus());
    });
    \u0275\u0275text(31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "input", 60);
    \u0275\u0275listener("ngModelChange", function CalendarComponent_Conditional_4_Template_input_ngModelChange_32_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.studentsSidebarQuery.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "ul", 61);
    \u0275\u0275repeaterCreate(34, CalendarComponent_Conditional_4_For_35_Template, 13, 19, "li", null, _forTrack0, false, CalendarComponent_Conditional_4_ForEmpty_36_Template, 3, 1, "li", 62);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "button", 63);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_4_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.openNewLessonFab());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(38, "svg", 64);
    \u0275\u0275element(39, "line", 65)(40, "line", 66);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_7_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.isBottomNavLayout() && ctx_r0.modesMenuOpen() || ctx_r0.studentsSidebarOpen() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isBottomNavLayout() ? 1 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.isBottomNavLayout() ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.isCompactHeader() ? 6 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.calendarWeekLabel());
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_7_0 = ctx_r0.periodRangeLabel()) ? 10 : -1, tmp_7_0);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!ctx_r0.isCompactHeader() ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.calendarUi().today)("title", ctx_r0.i18n.calendarUi().today);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isCompactHeader() ? 15 : 16);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.isCompactHeader() ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.isBottomNavLayout() ? 18 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("cal-btn--active", ctx_r0.studentsSidebarOpen());
    \u0275\u0275attribute("aria-expanded", ctx_r0.studentsSidebarOpen())("aria-label", ctx_r0.i18n.calendarUi().students)("title", ctx_r0.i18n.calendarUi().students);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().students);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("cal-grid-section--month", ctx_r0.isMonthOverview());
    \u0275\u0275advance();
    \u0275\u0275classProp("cal-period-shell--exit-next", ctx_r0.periodExitMode() === "next")("cal-period-shell--exit-prev", ctx_r0.periodExitMode() === "prev")("cal-period-shell--exit-fade", ctx_r0.periodExitMode() === "fade");
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction1(34, _c2, ctx_r0.periodViewKey()));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("cal-sidebar--open", ctx_r0.studentsSidebarOpen());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().showAllStudents, " ");
    \u0275\u0275advance();
    \u0275\u0275property("placeholder", ctx_r0.i18n.calendarUi().searchStudent)("ngModel", ctx_r0.studentsSidebarQuery());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.filteredStudentsForSidebar());
    \u0275\u0275advance(3);
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.calendarUi().addLesson)("title", ctx_r0.i18n.calendarUi().addLesson);
  }
}
function CalendarComponent_Conditional_5_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().editLesson, " ");
  }
}
function CalendarComponent_Conditional_5_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().notesStep, " ");
  }
}
function CalendarComponent_Conditional_5_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().newLesson, " ");
  }
}
function CalendarComponent_Conditional_5_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 147);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.studentsLoadError);
  }
}
function CalendarComponent_Conditional_5_Conditional_12_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 150);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().lastPaidPackageWarning, " ");
  }
}
function CalendarComponent_Conditional_5_Conditional_12_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "currency");
  }
  if (rf & 2) {
    const editing_r29 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(1, 1, editing_r29.lesson_price, editing_r29.lesson_currency, "code", "1.0-0"), "/\u0447 ");
  }
}
function CalendarComponent_Conditional_5_Conditional_12_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u2014 ");
  }
}
function CalendarComponent_Conditional_5_Conditional_12_Conditional_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 170);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().snapshotWillUpdate, " ");
  }
}
function CalendarComponent_Conditional_5_Conditional_12_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 169);
    \u0275\u0275text(1);
    \u0275\u0275conditionalCreate(2, CalendarComponent_Conditional_5_Conditional_12_Conditional_3_Conditional_2_Template, 2, 6)(3, CalendarComponent_Conditional_5_Conditional_12_Conditional_3_Conditional_3_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, CalendarComponent_Conditional_5_Conditional_12_Conditional_3_Conditional_4_Template, 2, 1, "p", 170);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().snapshotRateLabel, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.lessonHasSnapshotRate(ctx) ? 2 : 3);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.editLessonStudentChanged() ? 4 : -1);
  }
}
function CalendarComponent_Conditional_5_Conditional_12_For_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 171);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_5_Conditional_12_For_10_Template_button_click_0_listener() {
      const presetMinutes_r31 = \u0275\u0275restoreView(_r30).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.selectDurationPreset(presetMinutes_r31));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const presetMinutes_r31 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("cal-chip--active", ctx_r0.durationChipMode() === "preset" && ctx_r0.duration() === presetMinutes_r31);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatDurationPresetLabel(presetMinutes_r31), " ");
  }
}
function CalendarComponent_Conditional_5_Conditional_12_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 147);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.saveLessonError);
  }
}
function CalendarComponent_Conditional_5_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 148)(1, "app-select", 149);
    \u0275\u0275twoWayListener("ngModelChange", function CalendarComponent_Conditional_5_Conditional_12_Template_app_select_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r28);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.form.student_id, $event) || (ctx_r0.form.student_id = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, CalendarComponent_Conditional_5_Conditional_12_Conditional_2_Template, 2, 1, "p", 150);
    \u0275\u0275conditionalCreate(3, CalendarComponent_Conditional_5_Conditional_12_Conditional_3_Template, 5, 3);
    \u0275\u0275elementStart(4, "div", 151)(5, "label", 152);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 153);
    \u0275\u0275listener("ngModelChange", function CalendarComponent_Conditional_5_Conditional_12_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r28);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onScheduledAtLocalChange($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 154);
    \u0275\u0275repeaterCreate(9, CalendarComponent_Conditional_5_Conditional_12_For_10_Template, 2, 3, "button", 155, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 156)(12, "p", 157);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "button", 158);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_5_Conditional_12_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r28);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openRecurrenceModal());
    });
    \u0275\u0275elementStart(15, "span", 159);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 160);
    \u0275\u0275text(18, "\u203A");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "app-select", 161);
    \u0275\u0275twoWayListener("ngModelChange", function CalendarComponent_Conditional_5_Conditional_12_Template_app_select_ngModelChange_19_listener($event) {
      \u0275\u0275restoreView(_r28);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.form.status, $event) || (ctx_r0.form.status = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 162)(21, "label", 163);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "textarea", 164);
    \u0275\u0275twoWayListener("ngModelChange", function CalendarComponent_Conditional_5_Conditional_12_Template_textarea_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r28);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.form.notes, $event) || (ctx_r0.form.notes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(24, CalendarComponent_Conditional_5_Conditional_12_Conditional_24_Template, 2, 1, "p", 147);
    \u0275\u0275elementStart(25, "div", 165)(26, "button", 166);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_5_Conditional_12_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r28);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.deleteLesson());
    });
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "button", 167);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_5_Conditional_12_Template_button_click_28_listener() {
      \u0275\u0275restoreView(_r28);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.closeLessonForm());
    });
    \u0275\u0275text(29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "button", 168);
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_8_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.form.student_id);
    \u0275\u0275property("options", ctx_r0.studentSelectOptions())("placeholder", ctx_r0.i18n.calendarUi().studentPlaceholder)("emptyMessage", ctx_r0.i18n.calendarUi().noStudentsForLesson);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_7_0 = ctx_r0.editLessonTarget()) == null ? null : tmp_7_0.isLastPaid) ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_8_0 = ctx_r0.editLessonTarget()) ? 3 : -1, tmp_8_0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().scheduledAtLabel);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.scheduledAtLocal());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.durationPresets);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().recurrenceLabel);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.recurrenceSummary());
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.form.status);
    \u0275\u0275property("options", ctx_r0.lessonStatusSelectOptions());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().notesPlaceholder);
    \u0275\u0275advance();
    \u0275\u0275property("placeholder", ctx_r0.i18n.calendarUi().notesPlaceholder);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.form.notes);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.saveLessonError ? 24 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.savingLesson() || ctx_r0.deletingLesson());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.deletingLesson() ? ctx_r0.i18n.calendarUi().deletingLesson : ctx_r0.i18n.calendarUi().deleteLesson, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.studentsUi().cancel, " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.savingLesson() || ctx_r0.deletingLesson());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.savingLesson() ? ctx_r0.i18n.studentsUi().saving : ctx_r0.i18n.studentsUi().save, " ");
  }
}
function CalendarComponent_Conditional_5_Conditional_13_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 169);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "currency");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const picked_r33 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.i18n.calendarUi().snapshotWillFix, " ", \u0275\u0275pipeBind4(2, 2, picked_r33.rate_per_hour, picked_r33.rate_currency ?? "EUR", "code", "1.0-0"), "/\u0447 ");
  }
}
function CalendarComponent_Conditional_5_Conditional_13_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 174);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function CalendarComponent_Conditional_5_Conditional_13_For_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 171);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_5_Conditional_13_For_10_Template_button_click_0_listener() {
      const presetMinutes_r35 = \u0275\u0275restoreView(_r34).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.selectDurationPreset(presetMinutes_r35));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const presetMinutes_r35 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("cal-chip--active", ctx_r0.durationChipMode() === "preset" && ctx_r0.duration() === presetMinutes_r35);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatDurationPresetLabel(presetMinutes_r35), " ");
  }
}
function CalendarComponent_Conditional_5_Conditional_13_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 147);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.saveLessonError);
  }
}
function CalendarComponent_Conditional_5_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 148)(1, "app-select", 149);
    \u0275\u0275twoWayListener("ngModelChange", function CalendarComponent_Conditional_5_Conditional_13_Template_app_select_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r32);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.form.student_id, $event) || (ctx_r0.form.student_id = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, CalendarComponent_Conditional_5_Conditional_13_Conditional_2_Template, 3, 7, "p", 169);
    \u0275\u0275elementStart(3, "div", 151)(4, "label", 172);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "input", 173);
    \u0275\u0275listener("ngModelChange", function CalendarComponent_Conditional_5_Conditional_13_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r32);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onScheduledAtLocalChange($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, CalendarComponent_Conditional_5_Conditional_13_Conditional_7_Template, 2, 1, "p", 174);
    \u0275\u0275elementStart(8, "div", 154);
    \u0275\u0275repeaterCreate(9, CalendarComponent_Conditional_5_Conditional_13_For_10_Template, 2, 3, "button", 155, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 156)(12, "p", 157);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "button", 158);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_5_Conditional_13_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r32);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openRecurrenceModal());
    });
    \u0275\u0275elementStart(15, "span", 159);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 160);
    \u0275\u0275text(18, "\u203A");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "app-select", 161);
    \u0275\u0275twoWayListener("ngModelChange", function CalendarComponent_Conditional_5_Conditional_13_Template_app_select_ngModelChange_19_listener($event) {
      \u0275\u0275restoreView(_r32);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.form.status, $event) || (ctx_r0.form.status = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(20, CalendarComponent_Conditional_5_Conditional_13_Conditional_20_Template, 2, 1, "p", 147);
    \u0275\u0275elementStart(21, "div", 165)(22, "button", 175);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_5_Conditional_13_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r32);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToNotesStep());
    });
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 176)(25, "button", 167);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_5_Conditional_13_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r32);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.closeLessonForm());
    });
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "button", 177);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_5_Conditional_13_Template_button_click_27_listener() {
      \u0275\u0275restoreView(_r32);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.saveLesson());
    });
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_10_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.form.student_id);
    \u0275\u0275property("options", ctx_r0.studentSelectOptions())("placeholder", ctx_r0.i18n.calendarUi().studentPlaceholder)("emptyMessage", ctx_r0.i18n.calendarUi().noStudentsForLesson);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_7_0 = ctx_r0.selectedStudentForForm()) ? 2 : -1, tmp_7_0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().scheduledAtLabel);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.scheduledAtLocal());
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_10_0 = ctx_r0.getSchedulePreviewText()) ? 7 : -1, tmp_10_0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.durationPresets);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().recurrenceLabel);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.recurrenceSummary());
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.form.status);
    \u0275\u0275property("options", ctx_r0.lessonStatusSelectOptions());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.saveLessonError ? 20 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().goToNotes, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.studentsUi().cancel, " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.savingLesson());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.savingLesson() ? ctx_r0.i18n.studentsUi().saving : ctx_r0.i18n.studentsUi().save, " ");
  }
}
function CalendarComponent_Conditional_5_Conditional_14_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 147);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.saveLessonError);
  }
}
function CalendarComponent_Conditional_5_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 162)(1, "label", 178);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "textarea", 179);
    \u0275\u0275twoWayListener("ngModelChange", function CalendarComponent_Conditional_5_Conditional_14_Template_textarea_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r36);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.form.notes, $event) || (ctx_r0.form.notes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(4, CalendarComponent_Conditional_5_Conditional_14_Conditional_4_Template, 2, 1, "p", 147);
    \u0275\u0275elementStart(5, "div", 180)(6, "button", 167);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_5_Conditional_14_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r36);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.backToMainStep());
    });
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 168);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().notesNewPlaceholder);
    \u0275\u0275advance();
    \u0275\u0275property("placeholder", ctx_r0.i18n.calendarUi().notesNewPlaceholder);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.form.notes);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.saveLessonError ? 4 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().back, " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.savingLesson());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.savingLesson() ? ctx_r0.i18n.studentsUi().saving : ctx_r0.i18n.studentsUi().save, " ");
  }
}
function CalendarComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275animateLeave("modal-overlay-leave");
    \u0275\u0275elementStart(1, "div", 141);
    \u0275\u0275animateLeave("modal-sheet-leave");
    \u0275\u0275listener("click", function CalendarComponent_Conditional_5_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(2, "div", 142)(3, "h2");
    \u0275\u0275conditionalCreate(4, CalendarComponent_Conditional_5_Conditional_4_Template, 1, 1)(5, CalendarComponent_Conditional_5_Conditional_5_Template, 1, 1)(6, CalendarComponent_Conditional_5_Conditional_6_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 143);
    \u0275\u0275listener("click", function CalendarComponent_Conditional_5_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r27);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeLessonForm());
    });
    \u0275\u0275element(8, "img", 144);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 145)(10, "form", 146);
    \u0275\u0275listener("ngSubmit", function CalendarComponent_Conditional_5_Template_form_ngSubmit_10_listener() {
      \u0275\u0275restoreView(_r27);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.saveLesson());
    });
    \u0275\u0275conditionalCreate(11, CalendarComponent_Conditional_5_Conditional_11_Template, 2, 1, "p", 147);
    \u0275\u0275conditionalCreate(12, CalendarComponent_Conditional_5_Conditional_12_Template, 32, 21)(13, CalendarComponent_Conditional_5_Conditional_13_Template, 29, 17)(14, CalendarComponent_Conditional_5_Conditional_14_Template, 10, 7);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.editLessonTarget() ? 4 : ctx_r0.lessonFormStep() === 2 ? 5 : 6);
    \u0275\u0275advance(3);
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.studentsUi().close);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.studentsLoadError ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.editLessonTarget() ? 12 : ctx_r0.lessonFormStep() === 1 ? 13 : 14);
  }
}
function CalendarComponent_Conditional_29_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function CalendarComponent_Conditional_29_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 182);
    \u0275\u0275animateLeave("modal-sheet-out-mobile 0.25s cubic-bezier(0.32, 0.72, 0, 1)");
    \u0275\u0275animateEnter("modal-sheet-out-mobile 0.32s cubic-bezier(0.32, 0.72, 0, 1) reverse");
    \u0275\u0275listener("click", function CalendarComponent_Conditional_29_Conditional_1_Template_div_click_0_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275template(1, CalendarComponent_Conditional_29_Conditional_1_ng_container_1_Template, 1, 0, "ng-container", 183);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const recurrenceFormTemplate_r37 = \u0275\u0275reference(31);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", recurrenceFormTemplate_r37);
  }
}
function CalendarComponent_Conditional_29_Conditional_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function CalendarComponent_Conditional_29_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 182);
    \u0275\u0275animateLeave("modal-sheet-out-desktop 0.22s cubic-bezier(0.22, 1, 0.36, 1)");
    \u0275\u0275animateEnter("modal-sheet-out-desktop 0.28s cubic-bezier(0.22, 1, 0.36, 1) reverse");
    \u0275\u0275listener("click", function CalendarComponent_Conditional_29_Conditional_2_Template_div_click_0_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275template(1, CalendarComponent_Conditional_29_Conditional_2_ng_container_1_Template, 1, 0, "ng-container", 183);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const recurrenceFormTemplate_r37 = \u0275\u0275reference(31);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", recurrenceFormTemplate_r37);
  }
}
function CalendarComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275animateLeave("modal-overlay-out 0.2s ease-in");
    \u0275\u0275animateEnter("modal-overlay-out 0.24s ease-out reverse");
    \u0275\u0275conditionalCreate(1, CalendarComponent_Conditional_29_Conditional_1_Template, 2, 1, "div", 181)(2, CalendarComponent_Conditional_29_Conditional_2_Template, 2, 1, "div", 181);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isBottomNavLayout() ? 1 : 2);
  }
}
function CalendarComponent_ng_template_30_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-select", 189);
    \u0275\u0275listener("ngModelChange", function CalendarComponent_ng_template_30_Conditional_8_Template_app_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r39);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onRecurrenceCustomFreqChange($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngModel", ctx_r0.recurrenceDraft().customFreq)("options", ctx_r0.recurrenceCustomFreqSelectOptions());
  }
}
function CalendarComponent_ng_template_30_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 190);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.recurrenceDraftMonthlyHint());
  }
}
function CalendarComponent_ng_template_30_Conditional_9_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().recurrenceUnitDays, " ");
  }
}
function CalendarComponent_ng_template_30_Conditional_9_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().recurrenceUnitWeeks, " ");
  }
}
function CalendarComponent_ng_template_30_Conditional_9_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().recurrenceUnitMonths, " ");
  }
}
function CalendarComponent_ng_template_30_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 191)(1, "label", 196);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 197);
    \u0275\u0275listener("ngModelChange", function CalendarComponent_ng_template_30_Conditional_9_Conditional_1_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r41);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onRecurrenceIntervalChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 198);
    \u0275\u0275conditionalCreate(5, CalendarComponent_ng_template_30_Conditional_9_Conditional_1_Conditional_5_Template, 1, 1)(6, CalendarComponent_ng_template_30_Conditional_9_Conditional_1_Conditional_6_Template, 1, 1)(7, CalendarComponent_ng_template_30_Conditional_9_Conditional_1_Conditional_7_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().recurrenceEveryLabel, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.recurrenceDraft().interval);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.recurrenceDraftIntervalUnit() === "days" ? 5 : ctx_r0.recurrenceDraftIntervalUnit() === "weeks" ? 6 : 7);
  }
}
function CalendarComponent_ng_template_30_Conditional_9_Conditional_2_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 200);
    \u0275\u0275listener("click", function CalendarComponent_ng_template_30_Conditional_9_Conditional_2_For_2_Template_button_click_0_listener() {
      const day_r43 = \u0275\u0275restoreView(_r42).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.toggleRecurrenceDraftDay(day_r43.code));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const day_r43 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("cal-recurrence-day--active", ctx_r0.isRecurrenceDraftDayActive(day_r43.code));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", day_r43.label, " ");
  }
}
function CalendarComponent_ng_template_30_Conditional_9_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 192);
    \u0275\u0275repeaterCreate(1, CalendarComponent_ng_template_30_Conditional_9_Conditional_2_For_2_Template, 2, 3, "button", 199, _forTrack4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.calendarUi().recurrenceWeekdaysLabel);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.recurrenceDayOptions());
  }
}
function CalendarComponent_ng_template_30_Conditional_9_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r44 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 195)(1, "label", 201);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 202);
    \u0275\u0275listener("ngModelChange", function CalendarComponent_ng_template_30_Conditional_9_Conditional_6_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r44);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onRecurrenceUntilChange($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().recurrenceUntilLabel);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.recurrenceDraft().untilDate);
  }
}
function CalendarComponent_ng_template_30_Conditional_9_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r45 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 191)(1, "label", 203);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 204);
    \u0275\u0275listener("ngModelChange", function CalendarComponent_ng_template_30_Conditional_9_Conditional_7_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r45);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onRecurrenceCountChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 198);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().recurrenceCountLabel, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.recurrenceDraft().count);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().recurrenceUnitOccurrences, " ");
  }
}
function CalendarComponent_ng_template_30_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r40 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, CalendarComponent_ng_template_30_Conditional_9_Conditional_0_Template, 2, 1, "p", 190);
    \u0275\u0275conditionalCreate(1, CalendarComponent_ng_template_30_Conditional_9_Conditional_1_Template, 8, 3, "div", 191);
    \u0275\u0275conditionalCreate(2, CalendarComponent_ng_template_30_Conditional_9_Conditional_2_Template, 3, 1, "div", 192);
    \u0275\u0275elementStart(3, "p", 193);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "app-select", 194);
    \u0275\u0275listener("ngModelChange", function CalendarComponent_ng_template_30_Conditional_9_Template_app_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r40);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onRecurrenceEndModeChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, CalendarComponent_ng_template_30_Conditional_9_Conditional_6_Template, 4, 2, "div", 195);
    \u0275\u0275conditionalCreate(7, CalendarComponent_ng_template_30_Conditional_9_Conditional_7_Template, 6, 3, "div", 191);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r0.recurrenceDraft().preset === "monthly" || ctx_r0.recurrenceDraft().preset === "custom" && ctx_r0.recurrenceDraft().customFreq === "monthly" ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.recurrenceDraftShowsInterval() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.recurrenceDraftShowsWeekdays() ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().recurrenceEndSection);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.recurrenceDraft().endMode)("options", ctx_r0.recurrenceEndModeSelectOptions());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.recurrenceDraft().endMode === "until" ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.recurrenceDraft().endMode === "count" ? 7 : -1);
  }
}
function CalendarComponent_ng_template_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 142)(1, "h2");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 143);
    \u0275\u0275listener("click", function CalendarComponent_ng_template_30_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r38);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeRecurrenceModal());
    });
    \u0275\u0275element(4, "img", 144);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 145)(6, "div", 184)(7, "app-select", 185);
    \u0275\u0275listener("ngModelChange", function CalendarComponent_ng_template_30_Template_app_select_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r38);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onRecurrencePresetChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, CalendarComponent_ng_template_30_Conditional_8_Template, 1, 2, "app-select", 186);
    \u0275\u0275conditionalCreate(9, CalendarComponent_ng_template_30_Conditional_9_Template, 8, 8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 187)(11, "button", 167);
    \u0275\u0275listener("click", function CalendarComponent_ng_template_30_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r38);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeRecurrenceModal());
    });
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 188);
    \u0275\u0275listener("click", function CalendarComponent_ng_template_30_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r38);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.applyRecurrenceModal());
    });
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.i18n.calendarUi().recurrenceModalTitle);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.i18n.studentsUi().close);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r0.recurrenceDraft().preset)("options", ctx_r0.recurrencePresetSelectOptions());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.recurrenceDraft().preset === "custom" ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.recurrenceDraft().preset !== "none" ? 9 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.studentsUi().cancel, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.i18n.calendarUi().recurrenceApply, " ");
  }
}
var CALENDAR_MODAL_OPEN_CLASS = "app-calendar-modal-open";
var CALENDAR_DRAGGING_CLASS = "cal-lesson-dragging";
var PERIOD_EXIT_MS = 200;
var PERIOD_ENTER_MS = 300;
var CalendarComponent = class _CalendarComponent {
  lessonsSvc = inject(LessonService);
  studentSvc = inject(StudentService);
  lessonDisplay = inject(CalendarLessonDisplayService);
  profileSettings = inject(UserProfileSettingsService);
  platformId = inject(PLATFORM_ID);
  destroyRef = inject(DestroyRef);
  document = inject(DOCUMENT);
  injector = inject(Injector);
  i18n = inject(I18nService);
  /** Длительность нового урока по умолчанию (1 ч 30 мин). */
  static DEFAULT_LESSON_DURATION_MIN = 90;
  /** 60px = 1 час; 1px = 1 минута */
  hourHeightPx = 60;
  minuteHeightPx = 1;
  gridHours = computed(() => this.profileSettings.gridHours(), ...ngDevMode ? [{ debugName: "gridHours" }] : (
    /* istanbul ignore next */
    []
  ));
  gridStartHour = computed(() => this.profileSettings.gridStartHour(), ...ngDevMode ? [{ debugName: "gridStartHour" }] : (
    /* istanbul ignore next */
    []
  ));
  gridEndHour = computed(() => this.profileSettings.gridEndHour(), ...ngDevMode ? [{ debugName: "gridEndHour" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Высота сетки: только интервал [start, end) из настроек, 60px = 1 ч. */
  gridHeightPx = computed(() => {
    const span = this.gridEndHour() - this.gridStartHour();
    return Math.max(1, span) * this.hourHeightPx;
  }, ...ngDevMode ? [{ debugName: "gridHeightPx" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Небольшой отступ под последней линией сетки (в scroll-контейнере). */
  gridBottomPaddingPx = 16;
  /** Плейсхолдеры скелета сетки (7 колонок). */
  skeletonGridCols = [0, 1, 2, 3, 4, 5, 6];
  skeletonHourRows = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  viewModes = ["1", "3", "7", "30"];
  currentDate = signal(/* @__PURE__ */ new Date(), ...ngDevMode ? [{ debugName: "currentDate" }] : (
    /* istanbul ignore next */
    []
  ));
  viewMode = signal("7", ...ngDevMode ? [{ debugName: "viewMode" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Пересоздание сетки для @starting-style при смене периода. */
  periodViewKey = signal(0, ...ngDevMode ? [{ debugName: "periodViewKey" }] : (
    /* istanbul ignore next */
    []
  ));
  periodExitMode = signal(null, ...ngDevMode ? [{ debugName: "periodExitMode" }] : (
    /* istanbul ignore next */
    []
  ));
  periodEnterFrom = signal(null, ...ngDevMode ? [{ debugName: "periodEnterFrom" }] : (
    /* istanbul ignore next */
    []
  ));
  periodTransitionTimer = null;
  lessons = signal([], ...ngDevMode ? [{ debugName: "lessons" }] : (
    /* istanbul ignore next */
    []
  ));
  students = signal([], ...ngDevMode ? [{ debugName: "students" }] : (
    /* istanbul ignore next */
    []
  ));
  loadError = null;
  hasLoaded = signal(false, ...ngDevMode ? [{ debugName: "hasLoaded" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Navbar снизу (телефон и планшет landscape). */
  isBottomNavLayout = signal(false, ...ngDevMode ? [{ debugName: "isBottomNavLayout" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Планшет/телефон: без стрелок навигации, ≤1023px */
  isCompactHeader = signal(false, ...ngDevMode ? [{ debugName: "isCompactHeader" }] : (
    /* istanbul ignore next */
    []
  ));
  isNarrowViewport = signal(true, ...ngDevMode ? [{ debugName: "isNarrowViewport" }] : (
    /* istanbul ignore next */
    []
  ));
  /** HTML5 dragstart/dragover — только на десктопе с точным указателем. */
  useNativeLessonDrag = signal(false, ...ngDevMode ? [{ debugName: "useNativeLessonDrag" }] : (
    /* istanbul ignore next */
    []
  ));
  modesMenuOpen = signal(false, ...ngDevMode ? [{ debugName: "modesMenuOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  studentsSidebarOpen = signal(false, ...ngDevMode ? [{ debugName: "studentsSidebarOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  studentsSidebarQuery = signal("", ...ngDevMode ? [{ debugName: "studentsSidebarQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  focusedStudentId = signal(null, ...ngDevMode ? [{ debugName: "focusedStudentId" }] : (
    /* istanbul ignore next */
    []
  ));
  lessonFormStep = signal(1, ...ngDevMode ? [{ debugName: "lessonFormStep" }] : (
    /* istanbul ignore next */
    []
  ));
  scheduledAtLocal = signal("", ...ngDevMode ? [{ debugName: "scheduledAtLocal" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Урок в активном перетаскивании (pointer events). */
  dragActiveLessonId = signal(null, ...ngDevMode ? [{ debugName: "dragActiveLessonId" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Исходное время урока — для placeholder на старом месте. */
  dragOriginScheduledAt = signal(null, ...ngDevMode ? [{ debugName: "dragOriginScheduledAt" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Целевое время (шаг 15 мин) во время drag. */
  dragPreview = signal(null, ...ngDevMode ? [{ debugName: "dragPreview" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Фантом, следующий за пальцем (position: fixed). */
  dragGhost = signal(null, ...ngDevMode ? [{ debugName: "dragGhost" }] : (
    /* istanbul ignore next */
    []
  ));
  pointerSession = null;
  pointerMoveHandler = null;
  pointerUpHandler = null;
  pointerSafetyHandler = null;
  dragStartThresholdPx = 6;
  suppressLessonClickUntil = 0;
  /** Native DnD state for desktop drag/drop UX. */
  draggedLesson = signal(null, ...ngDevMode ? [{ debugName: "draggedLesson" }] : (
    /* istanbul ignore next */
    []
  ));
  currentDropTime = signal(null, ...ngDevMode ? [{ debugName: "currentDropTime" }] : (
    /* istanbul ignore next */
    []
  ));
  nativeDragState = null;
  dragImagePixel = this.createTransparentDragImage();
  autoScrollEdgePx = 64;
  autoScrollMaxStepPx = 10;
  showLessonForm = signal(false, ...ngDevMode ? [{ debugName: "showLessonForm" }] : (
    /* istanbul ignore next */
    []
  ));
  editLessonTarget = signal(null, ...ngDevMode ? [{ debugName: "editLessonTarget" }] : (
    /* istanbul ignore next */
    []
  ));
  studentsLoadError = null;
  savingLesson = signal(false, ...ngDevMode ? [{ debugName: "savingLesson" }] : (
    /* istanbul ignore next */
    []
  ));
  deletingLesson = signal(false, ...ngDevMode ? [{ debugName: "deletingLesson" }] : (
    /* istanbul ignore next */
    []
  ));
  saveLessonError = null;
  /** Модалка: слот занят (drag-and-drop или сохранение урока). */
  scheduleConflictMessage = signal(null, ...ngDevMode ? [{ debugName: "scheduleConflictMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Подтверждение переноса перед уведомлением ученика через бота. */
  dragMoveConfirm = signal(null, ...ngDevMode ? [{ debugName: "dragMoveConfirm" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Списание баланса при missed/canceled — ждёт выбора в модалке. */
  billingConfirm = signal(null, ...ngDevMode ? [{ debugName: "billingConfirm" }] : (
    /* istanbul ignore next */
    []
  ));
  form = {
    student_id: "",
    status: "scheduled",
    notes: "",
    scheduledAt: ""
  };
  duration = signal(_CalendarComponent.DEFAULT_LESSON_DURATION_MIN, ...ngDevMode ? [{ debugName: "duration" }] : (
    /* istanbul ignore next */
    []
  ));
  durationChipMode = signal("preset", ...ngDevMode ? [{ debugName: "durationChipMode" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrenceConfig = signal(__spreadValues({}, DEFAULT_RECURRENCE_CONFIG), ...ngDevMode ? [{ debugName: "recurrenceConfig" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrenceDraft = signal(__spreadValues({}, DEFAULT_RECURRENCE_CONFIG), ...ngDevMode ? [{ debugName: "recurrenceDraft" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrenceModalOpen = signal(false, ...ngDevMode ? [{ debugName: "recurrenceModalOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Дата вхождения при редактировании виртуальной карточки (YYYY-MM-DD). */
  editingOccurrenceDate = signal(null, ...ngDevMode ? [{ debugName: "editingOccurrenceDate" }] : (
    /* istanbul ignore next */
    []
  ));
  deleteRecurringModalOpen = signal(false, ...ngDevMode ? [{ debugName: "deleteRecurringModalOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  durationPresets = [30, 45, 60, 90];
  /** Цвета точек статуса — как у карточек урока в сетке. */
  static STATUS_DOT_COLORS = {
    scheduled: "#0c4a6e",
    completed: "#065f46",
    missed: "#92400e",
    canceled: "#991b1b"
  };
  static STATUS_BADGE_COLORS = {
    scheduled: "#0369a1",
    completed: "#047857",
    missed: "#b45309",
    canceled: "#b91c1c"
  };
  viewModeSelectOptions = computed(() => this.viewModes.map((mode) => ({
    value: mode,
    label: this.viewModeLabel(mode)
  })), ...ngDevMode ? [{ debugName: "viewModeSelectOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  lessonStatusSelectOptions = computed(() => {
    const t = this.i18n.calendarUi();
    const statuses = ["scheduled", "completed", "missed", "canceled"];
    const labels = {
      scheduled: t.statusScheduled,
      completed: t.statusCompleted,
      missed: t.statusMissed,
      canceled: t.statusCanceled
    };
    return statuses.map((status) => ({
      value: status,
      label: labels[status],
      dotColor: _CalendarComponent.STATUS_DOT_COLORS[status]
    }));
  }, ...ngDevMode ? [{ debugName: "lessonStatusSelectOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  studentSelectOptions = computed(() => this.students().map((s) => ({ value: s._id, label: s.name })), ...ngDevMode ? [{ debugName: "studentSelectOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  weekdayLabels = computed(() => this.i18n.weekdayShortLabels(), ...ngDevMode ? [{ debugName: "weekdayLabels" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Режим «30» — обзор месяца клетками, без почасовой сетки. */
  isMonthOverview = computed(() => this.viewMode() === "30", ...ngDevMode ? [{ debugName: "isMonthOverview" }] : (
    /* istanbul ignore next */
    []
  ));
  columns = computed(() => {
    const mode = this.viewMode();
    if (mode === "30") {
      return [];
    }
    const anchor = this.startOfLocalDay(this.currentDate());
    if (mode === "7") {
      const monday = this.startOfWeekMonday(anchor);
      return Array.from({ length: 7 }, (_, i) => this.addDays(monday, i));
    }
    const count = Number(mode);
    return Array.from({ length: count }, (_, i) => this.addDays(anchor, i));
  }, ...ngDevMode ? [{ debugName: "columns" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Клетки календаря месяца (пн–вс, с хвостами соседних месяцев). */
  monthOverviewCells = computed(() => {
    const ref = this.startOfLocalDay(this.currentDate());
    const year = ref.getFullYear();
    const month = ref.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    let cursor = this.startOfWeekMonday(firstOfMonth);
    const cells = [];
    while (true) {
      cells.push({
        date: new Date(cursor),
        inMonth: cursor.getMonth() === month
      });
      const weekEnded = cursor.getDay() === 0;
      const passedLastDay = cursor >= lastOfMonth;
      cursor = this.addDays(cursor, 1);
      if (passedLastDay && weekEnded) {
        break;
      }
      if (cells.length >= 42) {
        break;
      }
    }
    return cells;
  }, ...ngDevMode ? [{ debugName: "monthOverviewCells" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Число строк в сетке месяца (5 или 6). */
  monthWeekRows = computed(() => Math.ceil(this.monthOverviewCells().length / 7), ...ngDevMode ? [{ debugName: "monthWeekRows" }] : (
    /* istanbul ignore next */
    []
  ));
  gridTemplateColumns = computed(() => {
    const count = this.columns().length;
    return count > 0 ? `repeat(${count}, minmax(0, 1fr))` : "none";
  }, ...ngDevMode ? [{ debugName: "gridTemplateColumns" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Число сегодняшнего дня для кнопки «сегодня». */
  todayDayOfMonth = computed(() => (/* @__PURE__ */ new Date()).getDate(), ...ngDevMode ? [{ debugName: "todayDayOfMonth" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Позиция красной линии текущего времени (px) или null. */
  nowLineTopPx = computed(() => {
    this.nowTick();
    if (this.isMonthOverview()) {
      return null;
    }
    const todayKey = this.dayKey(/* @__PURE__ */ new Date());
    const showsToday = this.columns().some((col) => this.dayKey(col) === todayKey);
    if (!showsToday) {
      return null;
    }
    const now = /* @__PURE__ */ new Date();
    const offsetMin = this.minutesFromGridStart(now);
    const maxOffsetMin = (this.gridEndHour() - this.gridStartHour()) * 60;
    if (offsetMin < 0 || offsetMin > maxOffsetMin) {
      return null;
    }
    return offsetMin * this.minuteHeightPx;
  }, ...ngDevMode ? [{ debugName: "nowLineTopPx" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Подпись времени на оси для маркера «сейчас». */
  nowTimeLabel = computed(() => {
    this.nowTick();
    if (this.nowLineTopPx() === null) {
      return "";
    }
    const now = /* @__PURE__ */ new Date();
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(now);
  }, ...ngDevMode ? [{ debugName: "nowTimeLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Календарная неделя (ISO) для текущего якоря даты, напр. «KW 12». */
  calendarWeekLabel = computed(() => {
    this.i18n.lang();
    this.currentDate();
    const week = this.isoWeekNumber(this.currentDate());
    return this.i18n.calendarUi().calendarWeek.replace("{week}", String(week));
  }, ...ngDevMode ? [{ debugName: "calendarWeekLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Диапазон дат / месяц в шапке (без номера недели). */
  periodRangeLabel = computed(() => {
    this.i18n.lang();
    if (this.viewMode() === "30") {
      return this.formatMonthYearLabel();
    }
    const cols = this.columns();
    if (cols.length === 0) {
      return "";
    }
    if (cols.length === 1) {
      return this.formatColumnHeader(cols[0]);
    }
    const locale = this.i18n.localeId();
    const fmt = (d) => d.toLocaleDateString(locale, { day: "numeric", month: "short" });
    return `${fmt(cols[0])} \u2013 ${fmt(cols[cols.length - 1])}`;
  }, ...ngDevMode ? [{ debugName: "periodRangeLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  periodSwipeStart = null;
  periodSwipeMinPx = 48;
  /** Обновление линии текущего времени раз в минуту. */
  nowTick = signal(0, ...ngDevMode ? [{ debugName: "nowTick" }] : (
    /* istanbul ignore next */
    []
  ));
  nowLineIntervalId = null;
  /** Уроки с UI-флагом `isLastPaid` для сетки календаря. */
  displayLessons = computed(() => this.lessonDisplay.enrichForGrid(this.lessons(), this.students()), ...ngDevMode ? [{ debugName: "displayLessons" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrenceSummaryLabels = computed(() => {
    const t = this.i18n.calendarUi();
    return {
      none: t.recurrencePresetNone,
      daily: t.recurrenceDaily,
      dailyInterval: t.recurrenceDailyInterval,
      weekly: t.recurrenceWeekly,
      weeklyInterval: t.recurrenceWeeklyInterval,
      monthly: t.recurrenceMonthly,
      monthlyInterval: t.recurrenceMonthlyInterval,
      custom: t.recurrencePresetCustom,
      endNever: t.recurrenceEndNever,
      endUntil: t.recurrenceEndUntil,
      endCount: t.recurrenceEndCount,
      weekdays: {
        MO: t.weekdayMon,
        TU: t.weekdayTue,
        WE: t.weekdayWed,
        TH: t.weekdayThu,
        FR: t.weekdayFri,
        SA: t.weekdaySat,
        SU: t.weekdaySun
      }
    };
  }, ...ngDevMode ? [{ debugName: "recurrenceSummaryLabels" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrenceSummary = computed(() => {
    const scheduledAt = this.form.scheduledAt?.trim();
    const startDate = scheduledAt ? dayKey(new Date(scheduledAt)) : null;
    return formatRecurrenceSummary(this.recurrenceConfig(), this.recurrenceSummaryLabels(), startDate);
  }, ...ngDevMode ? [{ debugName: "recurrenceSummary" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrencePresetSelectOptions = computed(() => {
    const t = this.i18n.calendarUi();
    return [
      { value: "none", label: t.recurrencePresetNone },
      { value: "daily", label: t.recurrencePresetDaily },
      { value: "weekly", label: t.recurrencePresetWeekly },
      { value: "monthly", label: t.recurrencePresetMonthly },
      { value: "custom", label: t.recurrencePresetCustom }
    ];
  }, ...ngDevMode ? [{ debugName: "recurrencePresetSelectOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrenceCustomFreqSelectOptions = computed(() => {
    const t = this.i18n.calendarUi();
    return [
      { value: "daily", label: t.recurrencePresetDaily },
      { value: "weekly", label: t.recurrencePresetWeekly },
      { value: "monthly", label: t.recurrencePresetMonthly }
    ];
  }, ...ngDevMode ? [{ debugName: "recurrenceCustomFreqSelectOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrenceEndModeSelectOptions = computed(() => {
    const t = this.i18n.calendarUi();
    return [
      { value: "never", label: t.recurrenceEndNever },
      { value: "until", label: t.recurrenceEndUntilShort },
      { value: "count", label: t.recurrenceEndCountShort }
    ];
  }, ...ngDevMode ? [{ debugName: "recurrenceEndModeSelectOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrenceDayOptions = computed(() => {
    const t = this.i18n.calendarUi();
    return RRULE_WEEKDAY_CODES.map((code) => ({
      code,
      label: {
        MO: t.weekdayMon,
        TU: t.weekdayTue,
        WE: t.weekdayWed,
        TH: t.weekdayThu,
        FR: t.weekdayFri,
        SA: t.weekdaySat,
        SU: t.weekdaySun
      }[code]
    }));
  }, ...ngDevMode ? [{ debugName: "recurrenceDayOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Диапазон дат текущего вида (неделя / день / месяц). */
  visibleRange = computed(() => {
    if (this.isMonthOverview()) {
      const cells = this.monthOverviewCells();
      if (cells.length === 0) {
        return null;
      }
      const start2 = this.startOfLocalDay(cells[0].date);
      const end2 = this.startOfLocalDay(cells[cells.length - 1].date);
      end2.setHours(23, 59, 59, 999);
      return { start: start2, end: end2 };
    }
    const cols = this.columns();
    if (cols.length === 0) {
      return null;
    }
    const start = this.startOfLocalDay(cols[0]);
    const end = this.startOfLocalDay(cols[cols.length - 1]);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }, ...ngDevMode ? [{ debugName: "visibleRange" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Уроки для сетки: развёрнутые RRULE-вхождения в видимом диапазоне. */
  gridLessons = computed(() => {
    const base = this.displayLessons();
    const range2 = this.visibleRange();
    if (!range2) {
      return base;
    }
    return expandLessonsForRange(base, range2.start, range2.end);
  }, ...ngDevMode ? [{ debugName: "gridLessons" }] : (
    /* istanbul ignore next */
    []
  ));
  dragActiveLesson = computed(() => {
    const id = this.dragActiveLessonId();
    if (!id) {
      return null;
    }
    return this.displayLessons().find((lesson) => lesson._id === id) ?? null;
  }, ...ngDevMode ? [{ debugName: "dragActiveLesson" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Время на бейдже фантома во время перетаскивания (шаг 15 мин). */
  dragPreviewTimeLabel = computed(() => {
    const preview = this.dragPreview();
    if (!preview?.scheduledAt) {
      return "";
    }
    const date = new Date(preview.scheduledAt);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  }, ...ngDevMode ? [{ debugName: "dragPreviewTimeLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Dynamic destination label for custom phantom slot preview. */
  phantomDropTimeLabel = computed(() => {
    const iso = this.currentDropTime();
    if (!iso) {
      return "";
    }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    const startLabel = new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
    const lesson = this.draggedLesson();
    const durationMinutes = this.clampedDurationMinutes(lesson?.lesson_duration ?? this.duration());
    const end = new Date(date.getTime() + durationMinutes * 6e4);
    const endLabel = new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(end);
    return `${startLabel} - ${endLabel}`;
  }, ...ngDevMode ? [{ debugName: "phantomDropTimeLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  lessonsByDay = computed(() => {
    const map = /* @__PURE__ */ new Map();
    for (const lesson of this.gridLessons()) {
      const scheduledAt = lesson.scheduledAt;
      if (!scheduledAt) {
        continue;
      }
      const key = this.dayKey(new Date(scheduledAt));
      const bucket = map.get(key);
      if (bucket) {
        bucket.push(lesson);
      } else {
        map.set(key, [lesson]);
      }
    }
    for (const bucket of map.values()) {
      bucket.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    }
    return map;
  }, ...ngDevMode ? [{ debugName: "lessonsByDay" }] : (
    /* istanbul ignore next */
    []
  ));
  studentCurrencyById = computed(() => {
    const m = /* @__PURE__ */ new Map();
    for (const s of this.students()) {
      m.set(s._id, s.rate_currency ?? "EUR");
    }
    return m;
  }, ...ngDevMode ? [{ debugName: "studentCurrencyById" }] : (
    /* istanbul ignore next */
    []
  ));
  filteredStudentsForSidebar = computed(() => {
    const query = this.studentsSidebarQuery().trim().toLowerCase();
    if (!query) {
      return this.students();
    }
    return this.students().filter((student) => student.name.toLowerCase().includes(query));
  }, ...ngDevMode ? [{ debugName: "filteredStudentsForSidebar" }] : (
    /* istanbul ignore next */
    []
  ));
  gridScrollRef = viewChild("gridScroll", ...ngDevMode ? [{ debugName: "gridScrollRef" }] : (
    /* istanbul ignore next */
    []
  ));
  scrollContainerRef = viewChild("scrollContainer", ...ngDevMode ? [{ debugName: "scrollContainerRef" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Любая модалка календаря — navbar снизу уходит под оверлей. */
  calendarModalOpen = computed(() => this.showLessonForm() || this.dragMoveConfirm() !== null || this.billingConfirm() !== null || this.scheduleConflictMessage() !== null, ...ngDevMode ? [{ debugName: "calendarModalOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      this.document.documentElement.classList.toggle(CALENDAR_MODAL_OPEN_CLASS, this.calendarModalOpen());
    });
    effect(() => {
      this.gridHours();
      if (!this.isMonthOverview() && isPlatformBrowser(this.platformId)) {
        afterNextRender(() => this.scrollGridToNow(), { injector: this.injector });
      }
    });
    this.destroyRef.onDestroy(() => {
      if (this.periodTransitionTimer !== null) {
        clearTimeout(this.periodTransitionTimer);
      }
      this.document.documentElement.classList.remove(CALENDAR_MODAL_OPEN_CLASS);
      this.clearPointerListeners();
      this.clearDragUi();
    });
  }
  ngOnInit() {
    this.initViewportMediaQueries();
    this.initNowLineClock();
    this.profileSettings.loadProfile().subscribe();
    this.loadLessons();
    this.studentSvc.getAll().subscribe({
      next: (list) => this.students.set(list),
      error: () => {
      }
    });
  }
  /** Прокрутка к текущему часу (если день на экране) или к утру. */
  scrollGridToNow() {
    if (!isPlatformBrowser(this.platformId) || this.isMonthOverview()) {
      return;
    }
    const top = this.nowLineTopPx();
    if (top === null) {
      this.scrollGridToOffset(this.gridStartHour() * 60 * this.minuteHeightPx);
      return;
    }
    afterNextRender(() => this.applyScrollToNow(), { injector: this.injector });
  }
  scrollGridToOffset(offsetPx, attempt = 0) {
    if (!isPlatformBrowser(this.platformId) || this.isMonthOverview()) {
      return;
    }
    const el = this.gridScrollRef()?.nativeElement;
    if (!el) {
      if (attempt < 8) {
        afterNextRender(() => this.scrollGridToOffset(offsetPx, attempt + 1), {
          injector: this.injector
        });
      }
      return;
    }
    const top = Math.max(0, offsetPx - el.clientHeight * 0.25);
    el.scrollTo({ top, behavior: this.scrollBehavior() });
  }
  applyScrollToNow(attempt = 0) {
    if (!isPlatformBrowser(this.platformId) || this.isMonthOverview()) {
      return;
    }
    const top = this.nowLineTopPx();
    if (top === null) {
      return;
    }
    const el = this.gridScrollRef()?.nativeElement;
    if (!el) {
      if (attempt < 8) {
        requestAnimationFrame(() => this.applyScrollToNow(attempt + 1));
      }
      return;
    }
    const target = Math.max(0, top - el.clientHeight * 0.25);
    el.scrollTo({ top: target, behavior: this.scrollBehavior() });
  }
  scrollBehavior() {
    return this.prefersReducedMotion() ? "auto" : "smooth";
  }
  prefersReducedMotion() {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  /** Плавная смена недели/дня/месяца: fade-out → обновление → fade-in. */
  runPeriodTransition(direction, apply) {
    if (this.prefersReducedMotion()) {
      apply();
      afterNextRender(() => this.scrollGridToNow(), { injector: this.injector });
      return;
    }
    if (this.periodTransitionTimer !== null) {
      clearTimeout(this.periodTransitionTimer);
      this.periodTransitionTimer = null;
    }
    this.periodExitMode.set(direction ?? "fade");
    this.periodTransitionTimer = window.setTimeout(() => {
      apply();
      this.periodExitMode.set(null);
      this.periodEnterFrom.set(direction);
      this.periodViewKey.update((k) => k + 1);
      this.periodTransitionTimer = window.setTimeout(() => {
        this.periodEnterFrom.set(null);
        this.periodTransitionTimer = null;
        afterNextRender(() => this.scrollGridToNow(), { injector: this.injector });
      }, PERIOD_ENTER_MS);
    }, direction ? PERIOD_EXIT_MS : 160);
  }
  shiftCurrentDate(delta) {
    const next = new Date(this.currentDate());
    const mode = this.viewMode();
    if (mode === "30") {
      next.setMonth(next.getMonth() + delta);
    } else if (mode === "7") {
      next.setDate(next.getDate() + delta * 7);
    } else {
      next.setDate(next.getDate() + delta * Number(mode));
    }
    this.currentDate.set(next);
  }
  initNowLineClock() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.nowLineIntervalId = setInterval(() => {
      this.nowTick.update((n) => n + 1);
    }, 6e4);
    this.destroyRef.onDestroy(() => {
      if (this.nowLineIntervalId !== null) {
        clearInterval(this.nowLineIntervalId);
      }
    });
  }
  initViewportMediaQueries() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const bottomNavMq = window.matchMedia("(max-width: 768px), (max-height: 440px)");
    const compactMq = window.matchMedia("(max-width: 1023px)");
    const finePointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const applyViewport = () => {
      const bottomNav = bottomNavMq.matches;
      const compact = compactMq.matches;
      this.isBottomNavLayout.set(bottomNav);
      this.isCompactHeader.set(compact);
      this.isNarrowViewport.set(compact);
      this.useNativeLessonDrag.set(finePointerMq.matches);
      if (!bottomNav) {
        this.modesMenuOpen.set(false);
      }
    };
    applyViewport();
    bottomNavMq.addEventListener("change", applyViewport);
    compactMq.addEventListener("change", applyViewport);
    finePointerMq.addEventListener("change", applyViewport);
    this.destroyRef.onDestroy(() => {
      bottomNavMq.removeEventListener("change", applyViewport);
      compactMq.removeEventListener("change", applyViewport);
      finePointerMq.removeEventListener("change", applyViewport);
    });
  }
  startOfLocalDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }
  /** Номер ISO-календарной недели (1–53). */
  isoWeekNumber(date) {
    const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = utc.getUTCDay() || 7;
    utc.setUTCDate(utc.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
    return Math.ceil(((utc.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
  }
  startOfWeekMonday(d) {
    const x = this.startOfLocalDay(d);
    const day = x.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    x.setDate(x.getDate() + diff);
    return x;
  }
  addDays(d, days) {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
  }
  dayKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  lessonsForColumn(col) {
    return this.lessonsByDay().get(this.dayKey(col)) ?? [];
  }
  displayScheduledAt(lesson) {
    return lesson.scheduledAt;
  }
  calculateTop(scheduledAt) {
    const d = new Date(scheduledAt);
    if (Number.isNaN(d.getTime())) {
      return 0;
    }
    return Math.max(0, this.minutesFromGridStart(d) * this.minuteHeightPx);
  }
  isNonWorkingDay(col) {
    return !this.profileSettings.isWorkingDay(col);
  }
  monthLessonsForDay(day) {
    return this.lessonsByDay().get(this.dayKey(day)) ?? [];
  }
  monthBadgeLessons(day) {
    return this.monthLessonsForDay(day).slice(0, 3);
  }
  monthHiddenLessonCount(day) {
    const total = this.monthLessonsForDay(day).length;
    return total > 3 ? total - 3 : 0;
  }
  monthLessonBadgeLabel(lesson) {
    const student = this.students().find((s) => s._id === lesson.student_id);
    const name = student?.name?.trim() || "\u2014";
    const scheduledAt = lesson.scheduledAt;
    if (!scheduledAt) {
      return name;
    }
    const date = new Date(scheduledAt);
    if (Number.isNaN(date.getTime())) {
      return name;
    }
    const time = new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
    return `${time} ${name}`;
  }
  monthLessonBadgeColor(lesson) {
    return _CalendarComponent.STATUS_BADGE_COLORS[lesson.status] ?? "#0369a1";
  }
  monthMoreLessonsLabel(count) {
    return this.i18n.calendarUi().monthMoreLessons.replace("{count}", String(count));
  }
  minutesFromGridStart(date) {
    return date.getHours() * 60 + date.getMinutes() - this.gridStartHour() * 60;
  }
  calculateHeight(duration) {
    return Math.max(15, duration * this.minuteHeightPx);
  }
  formatHourLabel(hour) {
    return `${String(hour).padStart(2, "0")}:00`;
  }
  formatColumnHeader(col) {
    const weekday = this.dateWeekdayFmt().format(col).replace(/\./g, "");
    if (this.isCompactHeader()) {
      const shortDay = weekday.length > 2 ? weekday.slice(0, 2) : weekday;
      return `${shortDay} ${col.getDate()}`;
    }
    return `${weekday} ${col.getDate()}`;
  }
  onPeriodSwipeStart(event) {
    if (event.touches.length !== 1) {
      return;
    }
    const target = event.target;
    if (target.closest(".cal-lesson-card") || target.closest(".cal-day-header") || this.dragActiveLessonId()) {
      return;
    }
    this.periodSwipeStart = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }
  onPeriodSwipeEnd(event) {
    if (!this.periodSwipeStart || event.changedTouches.length !== 1) {
      this.periodSwipeStart = null;
      return;
    }
    const touch = event.changedTouches[0];
    const dx = touch.clientX - this.periodSwipeStart.x;
    const dy = touch.clientY - this.periodSwipeStart.y;
    this.periodSwipeStart = null;
    if (Math.abs(dx) < this.periodSwipeMinPx || Math.abs(dx) <= Math.abs(dy)) {
      return;
    }
    if (dx < 0) {
      this.navNext();
    } else {
      this.navPrev();
    }
  }
  isToday(col) {
    return this.dayKey(col) === this.dayKey(/* @__PURE__ */ new Date());
  }
  formatMonthYearLabel() {
    const label = this.dateMonthYearFmt().format(this.currentDate());
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
  lessonCountForDay(day) {
    return this.lessonsByDay().get(this.dayKey(day))?.length ?? 0;
  }
  /** Клик по заголовку дня или клетке месяца → режим «1 день» для выбранной даты. */
  openDayView(day) {
    const target = this.startOfLocalDay(day);
    const anchor = this.startOfLocalDay(this.currentDate());
    const direction = target.getTime() >= anchor.getTime() ? "next" : "prev";
    this.runPeriodTransition(direction, () => {
      this.currentDate.set(target);
      this.viewMode.set("1");
      this.modesMenuOpen.set(false);
    });
  }
  navPrev() {
    this.runPeriodTransition("prev", () => this.shiftCurrentDate(-1));
  }
  navNext() {
    this.runPeriodTransition("next", () => this.shiftCurrentDate(1));
  }
  goToToday() {
    this.runPeriodTransition(null, () => this.currentDate.set(/* @__PURE__ */ new Date()));
  }
  setViewMode(mode) {
    if (mode === this.viewMode()) {
      return;
    }
    this.runPeriodTransition(null, () => {
      this.viewMode.set(mode);
      this.modesMenuOpen.set(false);
    });
  }
  onViewModeSelect(value) {
    if (this.viewModes.includes(value)) {
      this.setViewMode(value);
    }
  }
  toggleModesMenu() {
    this.modesMenuOpen.update((open) => !open);
  }
  viewModeLabel(mode) {
    const t = this.i18n.calendarUi();
    const labels = {
      "1": t.viewMode1,
      "3": t.viewMode3,
      "7": t.viewMode7,
      "30": t.viewMode30
    };
    return labels[mode];
  }
  openNewLessonFab() {
    const now = /* @__PURE__ */ new Date();
    const minutes = Math.round(now.getMinutes() / 15) * 15;
    now.setMinutes(minutes, 0, 0);
    this.openNewLessonAt(now.toISOString());
  }
  toggleStudentsSidebar() {
    this.studentsSidebarOpen.update((opened) => !opened);
  }
  selectSidebarStudent(studentId) {
    this.focusedStudentId.set(studentId);
    this.studentsSidebarOpen.set(false);
  }
  clearStudentFocus() {
    this.focusedStudentId.set(null);
    this.studentsSidebarQuery.set("");
  }
  studentInitials(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (parts[0] || "?").slice(0, 2).toUpperCase();
  }
  getStudentName(studentId) {
    if (!studentId) {
      return "(\u0431\u0435\u0437 \u0443\u0447\u0435\u043D\u0438\u043A\u0430)";
    }
    return this.students().find((x) => x._id === studentId)?.name ?? "(\u0431\u0435\u0437 \u0443\u0447\u0435\u043D\u0438\u043A\u0430)";
  }
  isPackageLastBalance(student) {
    return isPackageStudentWithLastBalance(student);
  }
  getStudentColor(studentId) {
    if (!studentId) {
      return DEFAULT_STUDENT_BORDER_COLOR;
    }
    return this.students().find((x) => x._id === studentId)?.color_hex ?? DEFAULT_STUDENT_BORDER_COLOR;
  }
  getSelectedStudent() {
    const selectedId = this.form.student_id;
    if (!selectedId) {
      return void 0;
    }
    return this.students().find((student) => student._id === selectedId);
  }
  formRateCurrencyCode() {
    return this.getStudentCurrency(this.form.student_id);
  }
  onScheduledAtLocalChange(value) {
    this.scheduledAtLocal.set(value);
    this.form.scheduledAt = value?.trim() ? new Date(value).toISOString() : "";
  }
  getStudentCurrency(studentId) {
    if (!studentId) {
      return "EUR";
    }
    return this.studentCurrencyById().get(studentId) ?? "EUR";
  }
  formatDurationPresetLabel(minutes) {
    const t = this.i18n.calendarUi();
    if (minutes === 60) {
      return t.durationOneHour;
    }
    if (minutes === 90) {
      return `1.5 ${t.durationHourShort}`;
    }
    return `${minutes} ${t.durationMinShort}`;
  }
  selectDurationPreset(minutes) {
    this.duration.set(minutes);
    this.durationChipMode.set("preset");
  }
  selectDurationCustom() {
    this.durationChipMode.set("custom");
  }
  recurrenceDraftShowsWeekdays = computed(() => {
    const draft = this.recurrenceDraft();
    if (draft.preset === "weekly") {
      return true;
    }
    if (draft.preset === "custom" && draft.customFreq === "weekly") {
      return true;
    }
    return false;
  }, ...ngDevMode ? [{ debugName: "recurrenceDraftShowsWeekdays" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrenceDraftShowsInterval = computed(() => this.recurrenceDraft().preset !== "none", ...ngDevMode ? [{ debugName: "recurrenceDraftShowsInterval" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrenceDraftMonthlyHint = computed(() => this.i18n.calendarUi().recurrenceMonthlyOnDay.replace("{day}", this.recurrenceDraftMonthDay()), ...ngDevMode ? [{ debugName: "recurrenceDraftMonthlyHint" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrenceDraftIntervalUnit = computed(() => {
    const draft = this.recurrenceDraft();
    if (draft.preset === "daily" || draft.preset === "custom" && draft.customFreq === "daily") {
      return "days";
    }
    if (draft.preset === "weekly" || draft.preset === "custom" && draft.customFreq === "weekly") {
      return "weeks";
    }
    if (draft.preset === "monthly" || draft.preset === "custom" && draft.customFreq === "monthly") {
      return "months";
    }
    return "weeks";
  }, ...ngDevMode ? [{ debugName: "recurrenceDraftIntervalUnit" }] : (
    /* istanbul ignore next */
    []
  ));
  recurrenceDraftMonthDay = computed(() => {
    const scheduledAt = this.form.scheduledAt?.trim();
    if (!scheduledAt) {
      return "\u2014";
    }
    return String(new Date(scheduledAt).getDate());
  }, ...ngDevMode ? [{ debugName: "recurrenceDraftMonthDay" }] : (
    /* istanbul ignore next */
    []
  ));
  openRecurrenceModal() {
    this.recurrenceDraft.set(structuredClone(this.recurrenceConfig()));
    this.recurrenceModalOpen.set(true);
  }
  closeRecurrenceModal() {
    this.recurrenceModalOpen.set(false);
  }
  applyRecurrenceModal() {
    const draft = this.recurrenceDraft();
    if (draft.preset === "weekly" || draft.preset === "custom" && draft.customFreq === "weekly") {
      if (draft.byDay.length === 0) {
        this.saveLessonError = this.i18n.calendarUi().recurrenceWeekdaysRequired;
        return;
      }
    }
    this.recurrenceConfig.set(structuredClone(draft));
    this.recurrenceModalOpen.set(false);
    this.saveLessonError = null;
  }
  onRecurrencePresetChange(value) {
    const preset = value;
    if (!["none", "daily", "weekly", "monthly", "custom"].includes(preset)) {
      return;
    }
    const anchor = this.scheduledAtAnchor();
    this.recurrenceDraft.set(configFromPreset(preset, anchor, this.recurrenceDraft()));
  }
  onRecurrenceCustomFreqChange(value) {
    const customFreq = value;
    this.recurrenceDraft.update((current) => __spreadProps(__spreadValues({}, current), { customFreq }));
  }
  onRecurrenceEndModeChange(value) {
    const endMode = value;
    this.recurrenceDraft.update((current) => __spreadProps(__spreadValues({}, current), { endMode }));
  }
  onRecurrenceIntervalChange(raw) {
    const interval = Math.min(99, Math.max(1, Math.round(Number(raw) || 1)));
    this.recurrenceDraft.update((current) => __spreadProps(__spreadValues({}, current), { interval }));
  }
  onRecurrenceCountChange(raw) {
    const count = Math.min(999, Math.max(1, Math.round(Number(raw) || 1)));
    this.recurrenceDraft.update((current) => __spreadProps(__spreadValues({}, current), { count }));
  }
  onRecurrenceUntilChange(value) {
    this.recurrenceDraft.update((current) => __spreadProps(__spreadValues({}, current), {
      untilDate: value?.trim() ? value.trim() : null
    }));
  }
  isRecurrenceDraftDayActive(code) {
    return this.recurrenceDraft().byDay.includes(code);
  }
  toggleRecurrenceDraftDay(code) {
    this.recurrenceDraft.update((current) => {
      const set = new Set(current.byDay);
      if (set.has(code)) {
        set.delete(code);
      } else {
        set.add(code);
      }
      return __spreadProps(__spreadValues({}, current), { byDay: RRULE_WEEKDAY_CODES.filter((day) => set.has(day)) });
    });
  }
  scheduledAtAnchor() {
    const raw = this.form.scheduledAt?.trim();
    if (raw) {
      const parsed = new Date(raw);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return /* @__PURE__ */ new Date();
  }
  onCustomDurationInput(value) {
    const n = Math.round(Number(value));
    this.duration.set(Math.min(480, Math.max(5, Number.isNaN(n) ? _CalendarComponent.DEFAULT_LESSON_DURATION_MIN : n)));
  }
  static CURRENCY_REGION = {
    EUR: "EU",
    BYN: "BY",
    PLN: "PL",
    USD: "US",
    RUB: "RU"
  };
  lessonHasSnapshotRate(lesson) {
    return Number(lesson.lesson_price) > 0;
  }
  /** Компактная строка на низких карточках (< ~50 мин по высоте сетки). */
  lessonCardUseCompactMeta(lesson) {
    return lesson.lesson_duration < 50;
  }
  formatLessonRegion(lesson) {
    const tz = lesson.student_timezone?.trim() || this.students().find((s) => s._id === lesson.student_id)?.timezone?.trim() || "";
    if (tz) {
      return this.formatTimezoneLabel(tz);
    }
    return _CalendarComponent.CURRENCY_REGION[lesson.lesson_currency] ?? lesson.lesson_currency ?? "\u2014";
  }
  formatTimezoneLabel(tz) {
    const parts = tz.split("/");
    if (parts.length >= 2) {
      return parts[parts.length - 1].replace(/_/g, " ");
    }
    return tz;
  }
  formatLessonSnapshotRate(lesson) {
    if (!this.lessonHasSnapshotRate(lesson)) {
      return "\u2014";
    }
    const formatted = new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: lesson.lesson_currency || "EUR",
      maximumFractionDigits: 0
    }).format(Number(lesson.lesson_price));
    return `${formatted}${this.i18n.studentsUi().perLesson}`;
  }
  formatLessonDuration(minutes) {
    const t = this.i18n.calendarUi();
    if (minutes >= 60 && minutes % 60 === 0) {
      const h = minutes / 60;
      return h === 1 ? t.durationOneHour : `${h} ${t.durationHourShort}`;
    }
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h} ${t.durationHourShort} ${m} ${t.durationMinShort}`;
    }
    return `${minutes} ${t.durationMinShort}`;
  }
  /** Ученик в форме изменён — при сохранении ставка переснимется на сервере. */
  editLessonStudentChanged() {
    const editing = this.editLessonTarget();
    if (!editing) {
      return false;
    }
    return this.form.student_id !== (editing.student_id ?? "");
  }
  selectedStudentForForm() {
    const id = this.form.student_id?.trim();
    if (!id) {
      return void 0;
    }
    return this.students().find((s) => s._id === id);
  }
  getSchedulePreviewText() {
    const raw = this.form.scheduledAt?.trim();
    if (!raw) {
      return null;
    }
    const start = new Date(raw);
    if (Number.isNaN(start.getTime())) {
      return null;
    }
    const end = new Date(start.getTime() + this.duration() * 60 * 1e3);
    const fmt = new Intl.DateTimeFormat(this.i18n.localeId(), {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    return `${fmt.format(start)} \u2014 ${fmt.format(end)}`;
  }
  lessonCardClass(lesson) {
    const focused = this.focusedStudentId();
    const dragging = this.dragActiveLessonId() === lesson._id;
    return {
      "cal-lesson-card": true,
      "cal-lesson-card--scheduled": lesson.status === "scheduled",
      "cal-lesson-card--completed": lesson.status === "completed",
      "cal-lesson-card--missed": lesson.status === "missed",
      "cal-lesson-card--canceled": lesson.status === "canceled",
      "cal-lesson-card--focus-active": Boolean(focused && lesson.student_id === focused),
      "cal-lesson-card--focus-dim": Boolean(focused && lesson.student_id !== focused),
      "cal-lesson-card--dragging": dragging
    };
  }
  isDayDragTarget(col) {
    const preview = this.dragPreview();
    if (!preview?.scheduledAt) {
      return false;
    }
    return this.dayKey(col) === this.dayKey(new Date(preview.scheduledAt));
  }
  dragSnapLineTop(col) {
    const preview = this.dragPreview();
    if (!preview?.scheduledAt || this.dragActiveLessonId() === null) {
      return null;
    }
    if (this.dayKey(col) !== this.dayKey(new Date(preview.scheduledAt))) {
      return null;
    }
    return this.calculateTop(preview.scheduledAt);
  }
  onDayColumnClick(col, event) {
    const target = event.currentTarget;
    if (event.target.closest(".cal-lesson-card")) {
      return;
    }
    const offsetY = this.offsetYInColumn(event, target);
    const scheduledAt = this.isoFromDayAndOffset(this.dayKey(col), offsetY);
    this.openNewLessonAt(scheduledAt);
  }
  onLessonPointerDown(event, lesson) {
    if (event.pointerType === "mouse") {
      return;
    }
    if (lesson.isVirtualOccurrence || !lesson.scheduledAt || event.button !== 0 || this.dragActiveLessonId()) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    try {
      card.setPointerCapture(event.pointerId);
    } catch {
    }
    this.pointerSession = {
      lessonId: lesson._id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      grabOffsetX: event.clientX - rect.left,
      grabOffsetY: event.clientY - rect.top,
      originScheduledAt: lesson.scheduledAt,
      cardWidth: rect.width,
      cardHeight: rect.height,
      captureTarget: card
    };
    this.installPointerListeners();
  }
  onLessonCardClick(event, lesson) {
    if (Date.now() < this.suppressLessonClickUntil || this.dragActiveLessonId()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.openEditLesson(lesson, event);
  }
  installPointerListeners() {
    if (!isPlatformBrowser(this.platformId) || this.pointerMoveHandler) {
      return;
    }
    this.pointerMoveHandler = (event) => this.onDocumentPointerMove(event);
    this.pointerUpHandler = (event) => this.onDocumentPointerUp(event);
    this.pointerSafetyHandler = () => {
      if (this.document.visibilityState === "visible") {
        return;
      }
      this.abortPointerDrag();
    };
    this.document.addEventListener("pointermove", this.pointerMoveHandler, { passive: false });
    this.document.addEventListener("pointerup", this.pointerUpHandler);
    this.document.addEventListener("pointercancel", this.pointerUpHandler);
    this.document.addEventListener("touchcancel", this.pointerSafetyHandler, { passive: true });
    window.addEventListener("blur", this.pointerSafetyHandler);
    this.document.addEventListener("visibilitychange", this.pointerSafetyHandler);
  }
  clearPointerListeners() {
    if (!this.pointerMoveHandler) {
      return;
    }
    this.document.removeEventListener("pointermove", this.pointerMoveHandler);
    this.document.removeEventListener("pointerup", this.pointerUpHandler);
    this.document.removeEventListener("pointercancel", this.pointerUpHandler);
    if (this.pointerSafetyHandler) {
      this.document.removeEventListener("touchcancel", this.pointerSafetyHandler);
      window.removeEventListener("blur", this.pointerSafetyHandler);
      this.document.removeEventListener("visibilitychange", this.pointerSafetyHandler);
      this.pointerSafetyHandler = null;
    }
    this.pointerMoveHandler = null;
    this.pointerUpHandler = null;
  }
  /** Сброс зависшего touch-drag без сохранения переноса. */
  abortPointerDrag() {
    if (!this.pointerSession && !this.dragActiveLessonId()) {
      return;
    }
    const session = this.pointerSession;
    if (session) {
      try {
        session.captureTarget.releasePointerCapture(session.pointerId);
      } catch {
      }
    }
    const wasDragging = Boolean(this.dragActiveLessonId());
    this.clearPointerListeners();
    this.pointerSession = null;
    if (wasDragging) {
      this.clearDragUi();
      this.suppressLessonClickUntil = Date.now() + 450;
    }
  }
  onDocumentPointerMove(event) {
    const session = this.pointerSession;
    if (!session || event.pointerId !== session.pointerId) {
      return;
    }
    const dx = event.clientX - session.startX;
    const dy = event.clientY - session.startY;
    if (!this.dragActiveLessonId()) {
      if (Math.hypot(dx, dy) < this.dragStartThresholdPx) {
        return;
      }
      this.beginLessonDrag(session);
    }
    event.preventDefault();
    this.updateDragAt(event.clientX, event.clientY, session);
  }
  onDocumentPointerUp(event) {
    const session = this.pointerSession;
    if (!session || event.pointerId !== session.pointerId) {
      return;
    }
    const wasDragging = Boolean(this.dragActiveLessonId());
    const lesson = this.lessons().find((item) => item._id === session.lessonId);
    try {
      session.captureTarget.releasePointerCapture(session.pointerId);
    } catch {
    }
    this.clearPointerListeners();
    this.pointerSession = null;
    if (!wasDragging) {
      return;
    }
    event.preventDefault();
    const preview = this.dragPreview();
    this.clearDragUi();
    this.suppressLessonClickUntil = Date.now() + 450;
    if (!lesson?.scheduledAt || !preview || preview.lessonId !== lesson._id) {
      return;
    }
    if (this.scheduleTimesEqual(lesson.scheduledAt, preview.scheduledAt)) {
      return;
    }
    if (this.shouldConfirmBotNotifyBeforeMove(lesson, preview.scheduledAt)) {
      this.dragMoveConfirm.set({ lesson, scheduledAt: preview.scheduledAt });
      return;
    }
    this.persistLessonMove(lesson, preview.scheduledAt);
  }
  beginLessonDrag(session) {
    const lesson = this.lessons().find((item) => item._id === session.lessonId);
    if (!lesson?.scheduledAt) {
      return;
    }
    this.dragActiveLessonId.set(session.lessonId);
    this.dragOriginScheduledAt.set(session.originScheduledAt);
    this.dragPreview.set({ lessonId: session.lessonId, scheduledAt: session.originScheduledAt });
    this.draggedLesson.set(lesson);
    this.currentDropTime.set(session.originScheduledAt);
    this.dragGhost.set({
      x: session.startX - session.grabOffsetX,
      y: session.startY - session.grabOffsetY,
      width: session.cardWidth,
      height: session.cardHeight
    });
    this.document.documentElement.classList.add(CALENDAR_DRAGGING_CLASS);
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(12);
    }
  }
  updateDragAt(clientX, clientY, session) {
    this.dragGhost.set({
      x: clientX - session.grabOffsetX,
      y: clientY - session.grabOffsetY,
      width: session.cardWidth,
      height: session.cardHeight
    });
    this.updateDragPreviewFromPointer(session.lessonId, clientX, clientY);
    this.applyEdgeAutoScroll(clientY);
  }
  clearDragUi() {
    this.dragActiveLessonId.set(null);
    this.dragOriginScheduledAt.set(null);
    this.dragPreview.set(null);
    this.dragGhost.set(null);
    this.draggedLesson.set(null);
    this.currentDropTime.set(null);
    this.document.documentElement.classList.remove(CALENDAR_DRAGGING_CLASS);
  }
  clearNativeDragUi() {
    this.draggedLesson.set(null);
    this.currentDropTime.set(null);
    this.nativeDragState = null;
    this.dragActiveLessonId.set(null);
    this.dragOriginScheduledAt.set(null);
  }
  onLessonDragStart(event, lesson) {
    if (!this.useNativeLessonDrag()) {
      event.preventDefault();
      return;
    }
    if (lesson.isVirtualOccurrence || !lesson.scheduledAt || !event.dataTransfer) {
      event.preventDefault();
      return;
    }
    this.nativeDragState = { lesson };
    this.draggedLesson.set(lesson);
    this.currentDropTime.set(lesson.scheduledAt);
    this.dragActiveLessonId.set(lesson._id);
    this.dragOriginScheduledAt.set(lesson.scheduledAt);
    this.document.documentElement.classList.add(CALENDAR_DRAGGING_CLASS);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", lesson._id);
    event.dataTransfer.setDragImage(this.dragImagePixel, 0, 0);
  }
  onLessonDragEnd() {
    this.document.documentElement.classList.remove(CALENDAR_DRAGGING_CLASS);
    this.clearNativeDragUi();
  }
  onDayColumnDragOver(event, col) {
    if (!this.draggedLesson()) {
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
    const columnEl = event.currentTarget;
    const rect = columnEl.getBoundingClientRect();
    const offsetY = Math.max(0, Math.min(this.gridHeightPx(), event.clientY - rect.top));
    this.currentDropTime.set(this.isoFromDayAndOffset(this.dayKey(col), offsetY));
  }
  onDayColumnDrop(event) {
    if (!this.nativeDragState) {
      return;
    }
    event.preventDefault();
    const lesson = this.nativeDragState.lesson;
    const dropTime = this.currentDropTime();
    this.onLessonDragEnd();
    if (!dropTime || !lesson.scheduledAt || this.scheduleTimesEqual(lesson.scheduledAt, dropTime)) {
      return;
    }
    if (this.shouldConfirmBotNotifyBeforeMove(lesson, dropTime)) {
      this.dragMoveConfirm.set({ lesson, scheduledAt: dropTime });
      return;
    }
    this.persistLessonMove(lesson, dropTime);
  }
  onScrollContainerDragOver(event) {
    if (!this.draggedLesson()) {
      return;
    }
    event.preventDefault();
    this.applyEdgeAutoScroll(event.clientY);
  }
  showPhantomInColumn(col) {
    const drop = this.currentDropTime();
    return Boolean(this.draggedLesson() && drop && this.dayKey(col) === this.dayKey(new Date(drop)));
  }
  phantomTopForColumn(col) {
    if (!this.showPhantomInColumn(col)) {
      return null;
    }
    const drop = this.currentDropTime();
    if (!drop) {
      return null;
    }
    return this.calculateTop(drop);
  }
  dragMoveConfirmStudentName() {
    const pending = this.dragMoveConfirm();
    if (!pending?.lesson.student_id) {
      return this.i18n.calendarUi().studentFallback;
    }
    return this.getStudentName(pending.lesson.student_id);
  }
  billingConfirmStudentName() {
    const pending = this.billingConfirm();
    if (!pending?.payload.student_id) {
      return this.i18n.calendarUi().studentFallback;
    }
    return this.getStudentName(pending.payload.student_id);
  }
  billingConfirmBalanceAfterDeduct() {
    const pending = this.billingConfirm();
    if (!pending) {
      return 0;
    }
    const student = this.students().find((s) => s._id === pending.payload.student_id);
    const balance = Number(student?.balance_lessons ?? 0);
    return Math.max(0, balance - 1);
  }
  dateWeekdayFmt() {
    return new Intl.DateTimeFormat(this.i18n.localeId(), { weekday: "short" });
  }
  dateMonthYearFmt() {
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      month: "long",
      year: "numeric"
    });
  }
  dragMoveConfirmTimeLabel() {
    const pending = this.dragMoveConfirm();
    if (!pending?.scheduledAt) {
      return "";
    }
    return this.formatLessonDateTime(pending.scheduledAt);
  }
  confirmDragMove() {
    const pending = this.dragMoveConfirm();
    if (!pending) {
      return;
    }
    this.dragMoveConfirm.set(null);
    this.persistLessonMove(pending.lesson, pending.scheduledAt);
  }
  cancelDragMove() {
    this.dragMoveConfirm.set(null);
  }
  shouldConfirmBotNotifyBeforeMove(lesson, scheduledAt) {
    if (lesson.status !== "scheduled" || !lesson.scheduledAt) {
      return false;
    }
    if (this.scheduleTimesEqual(lesson.scheduledAt, scheduledAt)) {
      return false;
    }
    const student = this.students().find((item) => item._id === lesson.student_id);
    return Boolean(student?.bot_active);
  }
  scheduleTimesEqual(left, right) {
    const a = Date.parse(left);
    const b = Date.parse(right);
    if (Number.isNaN(a) || Number.isNaN(b)) {
      return left === right;
    }
    return a === b;
  }
  formatLessonDateTime(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return iso;
    }
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  }
  offsetYInColumn(event, columnEl) {
    const rect = columnEl.getBoundingClientRect();
    const y = event.clientY - rect.top;
    return Math.max(0, Math.min(this.gridHeightPx(), y));
  }
  updateDragPreviewFromPointer(lessonId, clientX, clientY) {
    const columnEl = this.dayColumnAt(clientX, clientY);
    if (!columnEl) {
      return;
    }
    const day = columnEl.dataset["dayKey"];
    if (!day) {
      return;
    }
    const rect = columnEl.getBoundingClientRect();
    const offsetY = Math.max(0, Math.min(this.gridHeightPx(), clientY - rect.top));
    const scheduledAt = this.isoFromDayAndOffset(day, offsetY);
    this.dragPreview.set({ lessonId, scheduledAt });
    this.currentDropTime.set(scheduledAt);
  }
  dayColumnAt(clientX, clientY) {
    const hit = this.document.elementFromPoint(clientX, clientY);
    return hit?.closest(".cal-day-column");
  }
  createTransparentDragImage() {
    const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    const img = new Image();
    img.src = pixel;
    return img;
  }
  applyEdgeAutoScroll(clientY) {
    const container = this.scrollContainerRef()?.nativeElement;
    if (!container) {
      return;
    }
    const rect = container.getBoundingClientRect();
    const topZone = rect.top + this.autoScrollEdgePx;
    const bottomZone = rect.bottom - this.autoScrollEdgePx;
    if (clientY < topZone) {
      const rawIntensity = (topZone - clientY) / this.autoScrollEdgePx;
      const easedIntensity = Math.pow(Math.min(1, Math.max(0, rawIntensity)), 1.6);
      const delta = Math.max(1, Math.round(this.autoScrollMaxStepPx * easedIntensity));
      container.scrollTop -= delta;
    } else if (clientY > bottomZone) {
      const rawIntensity = (clientY - bottomZone) / this.autoScrollEdgePx;
      const easedIntensity = Math.pow(Math.min(1, Math.max(0, rawIntensity)), 1.6);
      const delta = Math.max(1, Math.round(this.autoScrollMaxStepPx * easedIntensity));
      container.scrollTop += delta;
    }
  }
  persistLessonMove(lesson, scheduledAt) {
    if (this.hasScheduleConflict(scheduledAt, lesson.lesson_duration, lesson._id, lesson.status)) {
      this.openScheduleConflict();
      return;
    }
    const previous = [...this.lessons()];
    this.lessons.update((list) => list.map((item) => item._id === lesson._id ? __spreadProps(__spreadValues({}, item), { scheduledAt }) : item));
    this.lessonsSvc.update(lesson._id, {
      student_id: lesson.student_id,
      lesson_duration: lesson.lesson_duration,
      status: lesson.status,
      notes: lesson.notes,
      scheduledAt
    }).subscribe({
      next: (updated) => {
        this.lessons.update((list) => list.map((item) => item._id === updated._id ? this.normalizeLesson(updated) : item));
      },
      error: (err) => {
        this.lessons.set(previous);
        if (err.status === 409) {
          this.openScheduleConflict();
          return;
        }
        this.loadLessons();
      }
    });
  }
  openScheduleConflict(message) {
    this.clearDragUi();
    purgeStaleOverlayLayers(this.document);
    this.document.dispatchEvent(new CustomEvent(APP_OVERLAY_LAYER_OPEN));
    this.scheduleConflictMessage.set(message ?? this.i18n.calendarUi().scheduleConflict);
  }
  closeScheduleConflict() {
    this.scheduleConflictMessage.set(null);
  }
  hasScheduleConflict(scheduledAt, durationMinutes, excludeLessonId, status = "scheduled") {
    if (status !== "scheduled" || !scheduledAt) {
      return false;
    }
    const recurrence = this.buildRecurrencePayload(scheduledAt);
    const probe = {
      _id: excludeLessonId ?? "__probe__",
      student_id: null,
      status: "scheduled",
      scheduledAt,
      lesson_duration: durationMinutes,
      lesson_price: 0,
      lesson_currency: "EUR",
      reminder_sent: false,
      isRecurring: recurrence.isRecurring,
      startDate: recurrence.startDate,
      rrule: recurrence.rrule
    };
    const anchor = new Date(scheduledAt);
    const rangeStart = this.startOfLocalDay(anchor);
    rangeStart.setDate(rangeStart.getDate() - 7);
    const rangeEnd = this.startOfLocalDay(anchor);
    rangeEnd.setDate(rangeEnd.getDate() + 7 * 26);
    rangeEnd.setHours(23, 59, 59, 999);
    const candidateStarts = recurrence.isRecurring ? expandLessonOccurrencesForConflictCheck(probe).map((d) => d.toISOString()) : [scheduledAt];
    for (const candidateAt of candidateStarts) {
      const candidate = this.lessonInterval(candidateAt, durationMinutes);
      if (!candidate) {
        continue;
      }
      for (const lesson of this.lessons()) {
        if (excludeLessonId && lesson._id === excludeLessonId) {
          continue;
        }
        if (lesson.status !== "scheduled" || !lesson.scheduledAt) {
          continue;
        }
        const otherStarts = lesson.isRecurring ? expandLessonOccurrencesForConflictCheck(lesson, 26).map((d) => d.toISOString()) : [lesson.scheduledAt];
        for (const otherAt of otherStarts) {
          const other = this.lessonInterval(otherAt, lesson.lesson_duration);
          if (!other) {
            continue;
          }
          if (this.intervalsOverlap(candidate, other)) {
            return true;
          }
        }
      }
    }
    return false;
  }
  buildRecurrencePayload(scheduledAt, _editing = this.editLessonTarget()) {
    const config = this.recurrenceConfig();
    const startDate = scheduledAt ? dayKey(new Date(scheduledAt)) : null;
    if (!isRecurrenceConfigActive(config) || !startDate) {
      return { isRecurring: false, startDate: null, rrule: null };
    }
    const rrule = buildRruleFromConfig(config, startDate);
    if (!rrule) {
      return { isRecurring: false, startDate: null, rrule: null };
    }
    return {
      isRecurring: true,
      startDate,
      rrule
    };
  }
  isRecurringSeries(lesson, payload) {
    if (payload?.isRecurring === false && !payload.rrule) {
      return false;
    }
    return Boolean(lesson?.isRecurring || lesson?.rrule || payload?.isRecurring || payload?.rrule);
  }
  resolveOccurrenceDate(scheduledAt) {
    const fromSignal = this.editingOccurrenceDate();
    if (fromSignal) {
      return fromSignal;
    }
    if (!scheduledAt) {
      return null;
    }
    const parsed = new Date(scheduledAt);
    return Number.isNaN(parsed.getTime()) ? null : dayKey(parsed);
  }
  attachOccurrencePayload(payload, editing) {
    const isSeries = this.isRecurringSeries(editing, payload);
    const occurrenceDate = this.resolveOccurrenceDate(payload.scheduledAt);
    if (!editing || !isSeries || !occurrenceDate) {
      return payload;
    }
    return __spreadProps(__spreadValues({}, payload), {
      occurrence_date: occurrenceDate,
      occurrence_status: payload.status,
      status: "scheduled"
    });
  }
  lessonInterval(scheduledAt, durationMinutes) {
    if (!scheduledAt) {
      return null;
    }
    const start = Date.parse(scheduledAt);
    if (Number.isNaN(start)) {
      return null;
    }
    const duration = this.clampedDurationMinutes(durationMinutes);
    return { start, end: start + duration * 6e4 };
  }
  intervalsOverlap(a, b) {
    return Math.max(a.start, b.start) < Math.min(a.end, b.end);
  }
  isoFromDayAndOffset(dayKey2, offsetYPx) {
    const [y, m, d] = dayKey2.split("-").map(Number);
    const maxMinutes = this.gridHeightPx() - 5;
    const rawMinutes = Math.max(0, Math.min(maxMinutes, offsetYPx / this.minuteHeightPx));
    const rounded = Math.round(rawMinutes / 15) * 15;
    const totalMinutes = this.gridStartHour() * 60 + rounded;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return new Date(y, m - 1, d, hours, minutes, 0, 0).toISOString();
  }
  openNewLessonAt(scheduledAt) {
    this.editLessonTarget.set(null);
    this.lessonFormStep.set(1);
    this.resetLessonForm();
    this.form.scheduledAt = scheduledAt;
    this.recurrenceConfig.set(__spreadValues({}, DEFAULT_RECURRENCE_CONFIG));
    const local = new Date(new Date(scheduledAt).getTime() - (/* @__PURE__ */ new Date()).getTimezoneOffset() * 6e4);
    this.scheduledAtLocal.set(local.toISOString().slice(0, 16));
    this.saveLessonError = null;
    this.studentsLoadError = null;
    this.showLessonForm.set(true);
    this.ensureStudentsLoaded();
  }
  openEditLesson(lesson, clickEvent) {
    if (Date.now() < this.suppressLessonClickUntil) {
      clickEvent?.preventDefault();
      clickEvent?.stopPropagation();
      return;
    }
    clickEvent?.stopPropagation();
    this.editLessonTarget.set(lesson);
    this.editingOccurrenceDate.set(lesson.scheduledAt && (lesson.isRecurring || lesson.rrule) ? dayKey(new Date(lesson.scheduledAt)) : null);
    this.lessonFormStep.set(1);
    this.saveLessonError = null;
    this.studentsLoadError = null;
    this.ensureStudentsLoaded();
    const mins = lesson.lesson_duration;
    this.duration.set(mins);
    this.durationChipMode.set(this.durationPresets.includes(mins) ? "preset" : "custom");
    if (lesson.isRecurring && lesson.rrule) {
      this.recurrenceConfig.set(parseRruleToConfig(lesson.rrule, lesson.scheduledAt ? new Date(lesson.scheduledAt) : null));
    } else {
      this.recurrenceConfig.set(__spreadValues({}, DEFAULT_RECURRENCE_CONFIG));
    }
    this.form = {
      student_id: lesson.student_id || "",
      status: lesson.status,
      notes: lesson.notes || "",
      scheduledAt: lesson.scheduledAt
    };
    const local = new Date(new Date(lesson.scheduledAt).getTime() - (/* @__PURE__ */ new Date()).getTimezoneOffset() * 6e4);
    this.scheduledAtLocal.set(local.toISOString().slice(0, 16));
    this.showLessonForm.set(true);
  }
  ensureStudentsLoaded() {
    if (this.students().length > 0) {
      return;
    }
    this.studentSvc.getAll().subscribe({
      next: (list) => this.students.set(list),
      error: (err) => {
        this.studentsLoadError = err?.error?.message ?? err?.message ?? this.i18n.calendarUi().loadStudentsError;
      }
    });
  }
  closeLessonForm() {
    this.showLessonForm.set(false);
    this.editLessonTarget.set(null);
    this.editingOccurrenceDate.set(null);
    this.deletingLesson.set(false);
    this.deleteRecurringModalOpen.set(false);
    this.lessonFormStep.set(1);
  }
  goToNotesStep() {
    this.lessonFormStep.set(2);
  }
  backToMainStep() {
    this.lessonFormStep.set(1);
  }
  resetLessonForm() {
    this.duration.set(this.profileSettings.workspace().defaultLessonDuration);
    this.durationChipMode.set("preset");
    this.recurrenceConfig.set(__spreadValues({}, DEFAULT_RECURRENCE_CONFIG));
    this.editingOccurrenceDate.set(null);
    this.scheduledAtLocal.set("");
    this.form = {
      student_id: "",
      status: "scheduled",
      notes: "",
      scheduledAt: ""
    };
  }
  clampedDurationMinutes(raw) {
    const minutes = raw !== void 0 ? Number(raw) : Math.round(Number(this.duration()));
    if (Number.isNaN(minutes) || minutes < 5) {
      return _CalendarComponent.DEFAULT_LESSON_DURATION_MIN;
    }
    return Math.min(480, Math.max(5, Math.round(minutes)));
  }
  refreshStudentsList() {
    this.studentSvc.getAll().subscribe({
      next: (list) => this.students.set(list),
      error: () => {
      }
    });
  }
  loadLessons() {
    this.lessonsSvc.getAll().subscribe({
      next: (data) => {
        this.lessons.set(data.filter((l) => Boolean(l.scheduledAt)).map((l) => this.normalizeLesson(l)));
        this.loadError = null;
        this.hasLoaded.set(true);
        this.scrollGridToNow();
      },
      error: (err) => {
        this.loadError = err?.error?.message ?? err?.message ?? this.i18n.calendarUi().loadLessonsError;
        this.hasLoaded.set(true);
      }
    });
  }
  normalizeLesson(raw) {
    const statusRaw = String(raw.status ?? "scheduled");
    const status = statusRaw === "cancelled" ? "canceled" : statusRaw;
    return {
      _id: raw._id,
      student_id: raw.student_id,
      status,
      scheduledAt: String(raw.scheduledAt),
      lesson_duration: raw.lesson_duration ?? 60,
      lesson_price: raw.lesson_price ?? 0,
      lesson_currency: raw.lesson_currency ?? "EUR",
      student_timezone: raw.student_timezone,
      reminder_sent: raw.reminder_sent ?? false,
      balance_debited: Boolean(raw.balance_debited),
      billing_processed: Boolean(raw.billing_processed ?? raw.balance_debited),
      notes: raw.notes,
      tutor: raw.tutor,
      student_name: raw.student_name,
      title: raw.title,
      isRecurring: Boolean(raw.isRecurring) || Boolean(raw.rrule),
      startDate: raw.startDate ?? null,
      rrule: raw.rrule ?? null,
      exdates: raw.exdates ?? [],
      completedDates: raw.completedDates ?? []
    };
  }
  saveLesson() {
    this.saveLessonError = null;
    if (!this.form.student_id?.trim()) {
      this.saveLessonError = this.i18n.calendarUi().selectStudentError;
      return;
    }
    const duration = this.clampedDurationMinutes();
    const scheduledAt = this.form.scheduledAt?.trim() || null;
    const editing = this.editLessonTarget();
    const excludeId = editing?._id ?? null;
    if (this.hasScheduleConflict(scheduledAt, duration, excludeId, this.form.status)) {
      this.openScheduleConflict();
      return;
    }
    let basePayload = __spreadValues({
      student_id: this.form.student_id,
      lesson_duration: duration,
      status: this.form.status,
      notes: this.form.notes?.trim() || void 0,
      scheduledAt,
      manual_completion: true
    }, this.buildRecurrencePayload(scheduledAt, editing));
    basePayload = this.attachOccurrencePayload(basePayload, editing);
    const billingPreviousStatus = editing && this.isRecurringSeries(editing, basePayload) ? editing.status : editing?.status;
    if (this.needsBillingDecision(this.form.status, billingPreviousStatus)) {
      purgeStaleOverlayLayers(this.document);
      this.document.dispatchEvent(new CustomEvent(APP_OVERLAY_LAYER_OPEN));
      this.showLessonForm.set(false);
      this.billingConfirm.set({ payload: basePayload, editing: editing ?? null });
      return;
    }
    this.persistLesson(basePayload, editing, false, null, billingPreviousStatus);
  }
  cancelBillingConfirm() {
    this.billingConfirm.set(null);
    this.closeLessonForm();
  }
  confirmBillingKeep() {
    const pending = this.billingConfirm();
    if (!pending) {
      return;
    }
    this.billingConfirm.set(null);
    this.persistLesson(pending.payload, pending.editing, false, pending);
  }
  confirmBillingDeduct() {
    const pending = this.billingConfirm();
    if (!pending) {
      return;
    }
    this.billingConfirm.set(null);
    this.persistLesson(pending.payload, pending.editing, true, pending);
  }
  isMissedOrCanceledStatus(status) {
    return status === "missed" || status === "canceled";
  }
  needsBillingDecision(nextStatus, previousStatus) {
    if (!this.isMissedOrCanceledStatus(nextStatus)) {
      return false;
    }
    if (previousStatus === void 0) {
      return true;
    }
    return !this.isMissedOrCanceledStatus(previousStatus);
  }
  withBillingFlag(payload, previousStatus, shouldDeduct) {
    if (!this.needsBillingDecision(payload.status, previousStatus)) {
      return payload;
    }
    return __spreadProps(__spreadValues({}, payload), { should_deduct_balance: shouldDeduct });
  }
  persistLesson(payload, editing, shouldDeduct, billingRestore = null, previousStatusForBilling) {
    this.savingLesson.set(true);
    const previousStatus = previousStatusForBilling ?? editing?.status;
    const body = this.withBillingFlag(payload, previousStatus, shouldDeduct);
    if (editing) {
      this.lessonsSvc.update(editing._id, body).subscribe({
        next: (updated) => {
          this.lessons.update((list) => list.map((l) => l._id === updated._id ? this.normalizeLesson(updated) : l));
          this.refreshStudentsList();
          this.savingLesson.set(false);
          this.closeLessonForm();
        },
        error: (err) => {
          this.savingLesson.set(false);
          this.restoreBillingOnSaveError(billingRestore);
          this.handleLessonSaveError(err);
        }
      });
      return;
    }
    this.lessonsSvc.create(body).subscribe({
      next: (created) => {
        this.lessons.update((list) => [...list, this.normalizeLesson(created)]);
        this.refreshStudentsList();
        this.savingLesson.set(false);
        this.closeLessonForm();
      },
      error: (err) => {
        this.savingLesson.set(false);
        this.restoreBillingOnSaveError(billingRestore);
        this.handleLessonSaveError(err);
      }
    });
  }
  restoreBillingOnSaveError(billingRestore) {
    if (!billingRestore) {
      return;
    }
    this.billingConfirm.set(billingRestore);
    this.showLessonForm.set(true);
  }
  handleLessonSaveError(err) {
    if (err.status === 409) {
      this.openScheduleConflict();
      return;
    }
    this.saveLessonError = this.formatLessonSaveError(err);
  }
  formatLessonSaveError(err) {
    return err?.error?.message ?? err?.error?.error ?? err?.message ?? this.i18n.calendarUi().saveLessonError;
  }
  deleteLesson() {
    const target = this.editLessonTarget();
    if (!target?._id) {
      return;
    }
    if (target.isRecurring) {
      this.deleteRecurringModalOpen.set(true);
      return;
    }
    if (!window.confirm(this.i18n.calendarUi().deleteLessonConfirm)) {
      return;
    }
    this.executeDeleteSeries(target._id);
  }
  closeDeleteRecurringModal() {
    this.deleteRecurringModalOpen.set(false);
  }
  confirmDeleteRecurringOccurrence() {
    const target = this.editLessonTarget();
    const occurrenceDate = this.editingOccurrenceDate() ?? (target?.scheduledAt ? dayKey(new Date(target.scheduledAt)) : null);
    if (!target?._id || !occurrenceDate) {
      return;
    }
    this.deletingLesson.set(true);
    this.saveLessonError = null;
    this.lessonsSvc.delete(target._id, { scope: "occurrence", occurrenceDate }).subscribe({
      next: (result) => {
        if (result && typeof result === "object" && "_id" in result) {
          this.lessons.update((list) => list.map((l) => l._id === result._id ? this.normalizeLesson(result) : l));
        }
        this.deletingLesson.set(false);
        this.closeDeleteRecurringModal();
        this.closeLessonForm();
      },
      error: (err) => {
        this.deletingLesson.set(false);
        this.saveLessonError = err?.error?.message ?? err?.message ?? this.i18n.calendarUi().deleteLessonError;
      }
    });
  }
  confirmDeleteRecurringSeries() {
    const id = this.editLessonTarget()?._id;
    if (!id) {
      return;
    }
    this.closeDeleteRecurringModal();
    if (!window.confirm(this.i18n.calendarUi().deleteLessonConfirm)) {
      return;
    }
    this.executeDeleteSeries(id);
  }
  executeDeleteSeries(id) {
    this.deletingLesson.set(true);
    this.saveLessonError = null;
    this.lessonsSvc.delete(id).subscribe({
      next: () => {
        this.lessons.update((list) => list.filter((l) => l._id !== id));
        this.deletingLesson.set(false);
        this.closeLessonForm();
      },
      error: (err) => {
        this.deletingLesson.set(false);
        this.saveLessonError = err?.error?.message ?? err?.message ?? this.i18n.calendarUi().deleteLessonError;
      }
    });
  }
  static \u0275fac = function CalendarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CalendarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CalendarComponent, selectors: [["app-calendar"]], viewQuery: function CalendarComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.gridScrollRef, _c0, 5)(ctx.scrollContainerRef, _c1, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(2);
    }
  }, decls: 38, vars: 36, consts: [["recurrenceFormTemplate", ""], ["gridScroll", "", "scrollContainer", ""], [1, "cal-page"], [1, "cal-page__inner"], [1, "cal-error"], ["role", "status", "aria-busy", "true", 1, "cal-skeleton"], ["role", "presentation", 1, "modal-overlay", "modal-overlay--sheet"], [3, "cancel", "confirm", "open", "title", "cancelLabel", "cancelDanger", "confirmLabel"], ["stackOnTop", "", 3, "cancel", "secondary", "confirm", "open", "closeOnOverlay", "title", "cancelLabel", "secondaryLabel", "confirmLabel"], [1, "cal-billing-balance-hint"], ["variant", "error", "iconSrc", "/assets/icons/icon-warning.svg", 3, "cancel", "confirm", "open", "title", "dismissLabel"], ["role", "presentation", 1, "modal-overlay", "modal-overlay--sheet", "modal-overlay--stack-top"], ["stackOnTop", "", "layout", "sheet", 3, "cancel", "open", "closeOnOverlay", "title", "cancelLabel"], [1, "cal-recurrence-delete"], ["type", "button", 1, "btn-secondary", "cal-recurrence-delete__btn", 3, "click", "disabled"], ["type", "button", 1, "cal-btn-delete", "cal-recurrence-delete__btn", 3, "click", "disabled"], [1, "sr-only"], [1, "cal-skeleton__header"], [1, "cal-skeleton__header-text"], [1, "skeleton", "skeleton--line", "skeleton--line-lg", 2, "width", "42%"], [1, "skeleton", "skeleton--line", "skeleton--line-sm", 2, "width", "28%"], [1, "cal-skeleton__toolbar"], [1, "skeleton", "skeleton--btn", 2, "width", "2.5rem"], [1, "cal-skeleton__grid-wrap"], [1, "cal-skeleton__day-headers"], [1, "cal-skeleton__corner"], [1, "cal-skeleton__day-row"], [1, "skeleton", "skeleton--line", "skeleton--line-sm"], [1, "cal-skeleton__body"], [1, "cal-skeleton__axis"], [1, "cal-skeleton__columns"], [1, "cal-skeleton__column"], [1, "skeleton", "skeleton--block", "cal-skeleton__hour"], ["role", "presentation", 1, "cal-backdrop"], [1, "cal-modes-drawer", 3, "cal-modes-drawer--open"], [1, "cal-header"], [1, "cal-header__start"], ["type", "button", 1, "cal-btn", "cal-btn--burger"], [1, "cal-header__titles"], [1, "cal-header__title"], [1, "cal-header__period"], [1, "cal-header__week"], [1, "cal-header__range"], [1, "cal-header__actions"], [1, "cal-toolbar"], ["type", "button", 1, "cal-btn"], ["type", "button", 1, "cal-btn", "cal-btn--today", 3, "click"], [1, "cal-btn-today__frame"], [1, "cal-btn-today__label"], ["size", "compact", "menuPlacement", "below", 1, "cal-toolbar__mode-select", 3, "ngModel", "options", "ariaLabel"], ["type", "button", 1, "cal-btn", "cal-btn--students", 3, "click"], ["src", "/assets/icons/icon-students.svg", "width", "22", "height", "22", "alt", "", 1, "cal-btn__icon"], [1, "cal-btn__label"], [1, "cal-layout"], [1, "cal-grid-section", 3, "touchstart", "touchend"], [1, "cal-period-shell"], [1, "cal-period-view", 3, "cal-period-view--enter-next", "cal-period-view--enter-prev"], [1, "cal-sidebar", "cal-sidebar--drawer"], [1, "cal-sidebar__head"], ["type", "button", 1, "cal-sidebar__clear", 3, "click"], ["type", "search", "autocomplete", "off", 1, "app-input", "cal-sidebar__search", 3, "ngModelChange", "placeholder", "ngModel"], [1, "cal-sidebar__list"], [1, "cal-sidebar__empty"], ["type", "button", 1, "cal-fab", 3, "click"], ["width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2.5", "aria-hidden", "true"], ["x1", "12", "y1", "5", "x2", "12", "y2", "19"], ["x1", "5", "y1", "12", "x2", "19", "y2", "12"], ["role", "presentation", 1, "cal-backdrop", 3, "click"], [1, "cal-modes-drawer"], [1, "cal-modes-drawer__head"], [1, "cal-modes-drawer__title"], ["type", "button", 1, "cal-modes-drawer__close", 3, "click"], ["src", "/assets/icons/icon-close.svg", "width", "20", "height", "20", "alt", ""], [1, "cal-modes-drawer__nav"], ["type", "button", 1, "cal-modes-drawer__item", 3, "cal-modes-drawer__item--active"], ["type", "button", 1, "cal-modes-drawer__item", 3, "click"], [1, "cal-modes-drawer__item-num"], [1, "cal-modes-drawer__item-label"], ["type", "button", 1, "cal-btn", "cal-btn--burger", 3, "click"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "aria-hidden", "true"], ["x1", "3", "y1", "6", "x2", "21", "y2", "6"], ["x1", "3", "y1", "12", "x2", "21", "y2", "12"], ["x1", "3", "y1", "18", "x2", "21", "y2", "18"], ["type", "button", 1, "cal-btn", 3, "click"], ["size", "compact", "menuPlacement", "below", 1, "cal-toolbar__mode-select", 3, "ngModelChange", "ngModel", "options", "ariaLabel"], [1, "cal-period-view"], [1, "cal-month"], [1, "cal-month__title"], [1, "cal-month__scroll"], [1, "cal-month__frame"], [1, "cal-month__weekdays"], [1, "cal-month__weekday"], [1, "cal-month__grid"], ["type", "button", 1, "cal-month__cell", 3, "cal-month__cell--outside", "cal-month__cell--today", "cal-month__cell--has-lessons"], ["type", "button", 1, "cal-month__cell", 3, "click"], [1, "cal-month__day-num"], ["aria-hidden", "true", 1, "cal-month__events"], [1, "cal-month__badge", 3, "background"], [1, "cal-month__badge"], [1, "cal-month__badge", "cal-month__badge--more"], [1, "cal-grid-headers"], [1, "cal-grid-headers__corner"], [1, "cal-grid-headers__scroll"], [1, "cal-grid-headers__row"], ["type", "button", 1, "cal-day-header", 3, "cal-day-header--today", "cal-day-header--off"], [1, "cal-grid-scroll", 3, "dragover"], [1, "cal-grid-body"], [1, "cal-time-axis"], [1, "cal-time-slot", 3, "height"], [1, "cal-time-axis__end"], [1, "cal-now-marker", 3, "top"], [1, "cal-days-scroll"], [1, "cal-days-grid"], [1, "cal-day-column", 3, "cal-day-column--drag-target", "cal-day-column--off"], ["aria-hidden", "true", 1, "cal-now-line-week", 3, "top"], ["type", "button", 1, "cal-day-header", 3, "click"], [1, "cal-time-slot"], [1, "cal-now-marker"], [1, "cal-day-column", 3, "click", "dragover", "drop"], [1, "cal-day-column__off-label"], [1, "cal-hour-line", 3, "height"], [1, "lesson-phantom", "cal-lesson-card", 3, "cal-lesson-card--scheduled", "cal-lesson-card--completed", "cal-lesson-card--missed", "cal-lesson-card--canceled", "border-left-color", "top"], [3, "class", "cal-lesson-card--last-paid", "top", "height", "border-left-color"], [1, "cal-hour-line"], [1, "lesson-phantom", "cal-lesson-card"], [1, "cal-lesson-card__meta", "lesson-phantom__time"], [1, "cal-lesson-card__title"], [1, "cal-lesson-card__meta"], [1, "cal-lesson-card__details"], [1, "cal-lesson-card__detail"], [1, "cal-lesson-card__lbl"], [3, "dragstart", "dragend", "pointerdown", "click"], ["aria-hidden", "true", 1, "cal-now-line-week"], ["type", "button", 1, "cal-sidebar__item-btn", 3, "click"], ["aria-hidden", "true", 1, "cal-sidebar__color-indicator"], [1, "cal-sidebar__info"], [1, "cal-sidebar__name"], [1, "cal-sidebar__meta"], [1, "cal-sidebar__balance"], [1, "cal-sidebar__last-hint"], [1, "cal-sidebar__rate"], ["role", "dialog", "aria-modal", "true", 1, "modal", "modal-sheet", "modal--lesson", 3, "click"], [1, "modal-header"], ["type", "button", 1, "modal-close", 3, "click"], ["src", "/assets/icons/icon-close.svg", "width", "24", "height", "24", "alt", ""], [1, "modal-sheet__scroll"], [1, "modal-body", 3, "ngSubmit"], [1, "cal-form-error"], [1, "cal-form-fields"], ["name", "student_id", "menuPlacement", "below", 3, "ngModelChange", "ngModel", "options", "placeholder", "emptyMessage"], ["role", "status", 1, "cal-form-last-paid-warning"], [1, "field", "field--datetime"], ["for", "scheduledAtLocal"], ["id", "scheduledAtLocal", "type", "datetime-local", "name", "scheduledAtLocal", 1, "app-input", "app-input--datetime", 3, "ngModelChange", "ngModel"], [1, "cal-chips"], ["type", "button", 1, "cal-chip", 3, "cal-chip--active"], [1, "cal-recurrence"], [1, "cal-recurrence__label"], ["type", "button", 1, "cal-recurrence-trigger", 3, "click"], [1, "cal-recurrence-trigger__text"], ["aria-hidden", "true", 1, "cal-recurrence-trigger__chevron"], ["name", "status", "menuPlacement", "below", "mobileBackdropSheet", "", 3, "ngModelChange", "ngModel", "options"], [1, "field"], ["for", "lesson-notes-edit"], ["id", "lesson-notes-edit", "name", "notes", "rows", "3", 3, "ngModelChange", "placeholder", "ngModel"], [1, "cal-form-actions", "cal-form-actions--wrap"], ["type", "button", 1, "cal-btn-delete", 3, "click", "disabled"], ["type", "button", 1, "btn-link", "cancel", 3, "click"], ["type", "submit", 1, "btn-primary", 3, "disabled"], [1, "cal-form-preview", "cal-form-preview--snapshot"], [1, "cal-form-preview", "cal-form-preview--hint"], ["type", "button", 1, "cal-chip", 3, "click"], ["for", "scheduledAtLocalNew"], ["id", "scheduledAtLocalNew", "type", "datetime-local", "name", "scheduledAtLocalNew", 1, "app-input", "app-input--datetime", 3, "ngModelChange", "ngModel"], [1, "cal-form-preview"], ["type", "button", 1, "btn-link", "secondary", 3, "click"], [1, "cal-form-actions__right", 2, "display", "flex", "gap", "0.5rem", "align-items", "center"], ["type", "button", 1, "btn-primary", 3, "click", "disabled"], ["for", "lesson-notes-new"], ["id", "lesson-notes-new", "name", "notesNew", "rows", "4", 3, "ngModelChange", "placeholder", "ngModel"], [1, "cal-form-actions"], ["role", "dialog", "aria-modal", "true", 1, "modal", "modal-sheet", "modal--recurrence"], ["role", "dialog", "aria-modal", "true", 1, "modal", "modal-sheet", "modal--recurrence", 3, "click"], [4, "ngTemplateOutlet"], [1, "modal-body", "cal-recurrence-modal"], ["name", "recurrencePreset", "menuPlacement", "below", "mobileBackdropSheet", "", 3, "ngModelChange", "ngModel", "options"], ["name", "recurrenceCustomFreq", "menuPlacement", "below", "mobileBackdropSheet", "", 3, "ngModel", "options"], [1, "cal-recurrence-modal__actions"], ["type", "button", 1, "btn-primary", 3, "click"], ["name", "recurrenceCustomFreq", "menuPlacement", "below", "mobileBackdropSheet", "", 3, "ngModelChange", "ngModel", "options"], [1, "cal-recurrence__hint"], [1, "cal-recurrence-interval"], ["role", "group", 1, "cal-recurrence__days"], [1, "cal-recurrence__section"], ["name", "recurrenceEndMode", "menuPlacement", "below", "mobileBackdropSheet", "", 3, "ngModelChange", "ngModel", "options"], [1, "field", "field--date"], ["for", "recurrenceInterval", 1, "cal-recurrence-interval__label"], ["id", "recurrenceInterval", "type", "number", "min", "1", "max", "99", "name", "recurrenceInterval", 1, "app-input", "cal-recurrence-interval__input", 3, "ngModelChange", "ngModel"], [1, "cal-recurrence-interval__unit"], ["type", "button", 1, "cal-recurrence-day", 3, "cal-recurrence-day--active"], ["type", "button", 1, "cal-recurrence-day", 3, "click"], ["for", "recurrenceUntilModal"], ["id", "recurrenceUntilModal", "type", "date", "name", "recurrenceUntilModal", 1, "app-input", 3, "ngModelChange", "ngModel"], ["for", "recurrenceCount", 1, "cal-recurrence-interval__label"], ["id", "recurrenceCount", "type", "number", "min", "1", "max", "999", "name", "recurrenceCount", 1, "app-input", "cal-recurrence-interval__input", 3, "ngModelChange", "ngModel"]], template: function CalendarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 2)(1, "div", 3);
      \u0275\u0275conditionalCreate(2, CalendarComponent_Conditional_2_Template, 2, 1, "p", 4)(3, CalendarComponent_Conditional_3_Template, 24, 2, "div", 5)(4, CalendarComponent_Conditional_4_Template, 41, 36);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(5, CalendarComponent_Conditional_5_Template, 15, 4, "div", 6);
      \u0275\u0275elementStart(6, "app-dialog", 7);
      \u0275\u0275listener("cancel", function CalendarComponent_Template_app_dialog_cancel_6_listener() {
        return ctx.cancelDragMove();
      })("confirm", function CalendarComponent_Template_app_dialog_confirm_6_listener() {
        return ctx.confirmDragMove();
      });
      \u0275\u0275elementStart(7, "p");
      \u0275\u0275text(8);
      \u0275\u0275elementStart(9, "strong");
      \u0275\u0275text(10);
      \u0275\u0275elementEnd();
      \u0275\u0275text(11);
      \u0275\u0275elementStart(12, "strong");
      \u0275\u0275text(13);
      \u0275\u0275elementEnd();
      \u0275\u0275text(14, ". ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "app-dialog", 8);
      \u0275\u0275listener("cancel", function CalendarComponent_Template_app_dialog_cancel_15_listener() {
        return ctx.cancelBillingConfirm();
      })("secondary", function CalendarComponent_Template_app_dialog_secondary_15_listener() {
        return ctx.confirmBillingKeep();
      })("confirm", function CalendarComponent_Template_app_dialog_confirm_15_listener() {
        return ctx.confirmBillingDeduct();
      });
      \u0275\u0275elementStart(16, "p");
      \u0275\u0275text(17);
      \u0275\u0275elementStart(18, "strong");
      \u0275\u0275text(19);
      \u0275\u0275elementEnd();
      \u0275\u0275text(20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "p", 9);
      \u0275\u0275text(22);
      \u0275\u0275elementStart(23, "strong");
      \u0275\u0275text(24);
      \u0275\u0275elementEnd();
      \u0275\u0275text(25);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "app-dialog", 10);
      \u0275\u0275listener("cancel", function CalendarComponent_Template_app_dialog_cancel_26_listener() {
        return ctx.closeScheduleConflict();
      })("confirm", function CalendarComponent_Template_app_dialog_confirm_26_listener() {
        return ctx.closeScheduleConflict();
      });
      \u0275\u0275elementStart(27, "p");
      \u0275\u0275text(28);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(29, CalendarComponent_Conditional_29_Template, 3, 1, "div", 11);
      \u0275\u0275template(30, CalendarComponent_ng_template_30_Template, 15, 8, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementStart(32, "app-dialog", 12);
      \u0275\u0275listener("cancel", function CalendarComponent_Template_app_dialog_cancel_32_listener() {
        return ctx.closeDeleteRecurringModal();
      });
      \u0275\u0275elementStart(33, "div", 13)(34, "button", 14);
      \u0275\u0275listener("click", function CalendarComponent_Template_button_click_34_listener() {
        return ctx.confirmDeleteRecurringOccurrence();
      });
      \u0275\u0275text(35);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "button", 15);
      \u0275\u0275listener("click", function CalendarComponent_Template_button_click_36_listener() {
        return ctx.confirmDeleteRecurringSeries();
      });
      \u0275\u0275text(37);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loadError ? 2 : !ctx.hasLoaded() ? 3 : 4);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.showLessonForm() ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("open", !!ctx.dragMoveConfirm())("title", ctx.i18n.calendarUi().moveLessonTitle)("cancelLabel", ctx.i18n.studentsUi().cancel)("cancelDanger", true)("confirmLabel", ctx.i18n.calendarUi().moveLessonConfirm);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.i18n.calendarUi().moveLessonBodyBefore, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.dragMoveConfirmStudentName());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.i18n.calendarUi().moveLessonBodyAfter, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.dragMoveConfirmTimeLabel());
      \u0275\u0275advance(2);
      \u0275\u0275property("open", !!ctx.billingConfirm())("closeOnOverlay", false)("title", ctx.i18n.calendarUi().billingTitle)("cancelLabel", ctx.i18n.studentsUi().cancel)("secondaryLabel", ctx.i18n.calendarUi().billingKeep)("confirmLabel", ctx.i18n.calendarUi().billingDeduct);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.i18n.calendarUi().billingBodyBefore, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.billingConfirmStudentName());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1("", ctx.i18n.calendarUi().billingBodyMiddle, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.i18n.calendarUi().billingBodyAfterDeduct, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.billingConfirmBalanceAfterDeduct());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.i18n.studentsUi().lessonsShort, " ");
      \u0275\u0275advance();
      \u0275\u0275property("open", !!ctx.scheduleConflictMessage())("title", ctx.i18n.calendarUi().timeBusyTitle)("dismissLabel", ctx.i18n.calendarUi().ok);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.scheduleConflictMessage());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.recurrenceModalOpen() ? 29 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275property("open", ctx.deleteRecurringModalOpen())("closeOnOverlay", false)("title", ctx.i18n.calendarUi().deleteRecurringTitle)("cancelLabel", ctx.i18n.studentsUi().cancel);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.deletingLesson());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.i18n.calendarUi().deleteRecurringOccurrence, " ");
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.deletingLesson());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.i18n.calendarUi().deleteRecurringSeries, " ");
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, MaxValidator, NgModel, NgForm, AppDialogComponent, AppSelectComponent, NgTemplateOutlet, CurrencyPipe], styles: ['@charset "UTF-8";\n\n\n[_nghost-%COMP%] {\n  --cal-time-axis-w: 4rem;\n  --cal-grid-height: 780px;\n  --cal-grid-bottom-air: 1rem;\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  flex: 1;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  box-sizing: border-box;\n}\n@media (max-width: 1023px) {\n  [_nghost-%COMP%] {\n    --cal-time-axis-w: 2.65rem;\n  }\n}\n.cal-page[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  min-height: 0;\n  flex: 1;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n  background: var(--page-bg);\n  box-sizing: border-box;\n}\n.cal-page__inner[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n  max-width: 1600px;\n  min-height: 0;\n  flex: 1;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n  box-sizing: border-box;\n  padding: 0.5rem 0.5rem 0;\n}\n@media (min-width: 640px) {\n  .cal-page__inner[_ngcontent-%COMP%] {\n    padding: 0.75rem 0.75rem 0;\n  }\n}\n@media (min-width: 1024px) {\n  .cal-page__inner[_ngcontent-%COMP%] {\n    padding: 1rem 1rem 0;\n  }\n}\n.cal-error[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: rgb(220, 38, 38);\n}\n.cal-skeleton[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 0;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.5rem;\n  overflow: hidden;\n}\n.cal-skeleton__header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-shrink: 0;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.cal-skeleton__header-text[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.35rem;\n}\n.cal-skeleton__toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  flex-shrink: 0;\n  gap: 0.35rem;\n}\n.cal-skeleton__grid-wrap[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 0;\n  flex: 1;\n  flex-direction: column;\n  overflow: hidden;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.cal-skeleton__day-headers[_ngcontent-%COMP%] {\n  display: flex;\n  flex-shrink: 0;\n  border-bottom: 1px solid var(--nav-border);\n}\n.cal-skeleton__corner[_ngcontent-%COMP%] {\n  width: var(--cal-time-axis-w, 4rem);\n  flex-shrink: 0;\n  border-right: 1px solid var(--nav-border);\n}\n.cal-skeleton__day-row[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n  flex: 1;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  gap: 0.5rem;\n  padding: 0.5rem 0.35rem;\n}\n.cal-skeleton__body[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 0;\n  flex: 1;\n  overflow: hidden;\n}\n.cal-skeleton__axis[_ngcontent-%COMP%] {\n  display: flex;\n  width: var(--cal-time-axis-w, 4rem);\n  flex-shrink: 0;\n  flex-direction: column;\n  gap: 1.125rem;\n  padding: 0.5rem 0.25rem;\n  border-right: 1px solid var(--nav-border);\n}\n.cal-skeleton__columns[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n  flex: 1;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n}\n.cal-skeleton__column[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n  padding: 0.35rem 0.25rem;\n  border-right: 1px solid var(--nav-border);\n}\n.cal-skeleton__column[_ngcontent-%COMP%]:last-child {\n  border-right: none;\n}\n.cal-skeleton__hour[_ngcontent-%COMP%] {\n  height: 2.75rem;\n  border-radius: 0.35rem;\n}\n.cal-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 55;\n  background: rgba(0, 0, 0, 0.3);\n}\n.cal-modes-drawer[_ngcontent-%COMP%] {\n  position: fixed;\n  inset-block: 0;\n  left: 0;\n  z-index: 60;\n  display: flex;\n  width: min(17.5rem, 82vw);\n  flex-direction: column;\n  border-right: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n  box-shadow: 8px 0 32px rgba(15, 23, 42, 0.12);\n  transform: translateX(-100%);\n  transition: transform 0.22s ease;\n}\n.cal-modes-drawer--open[_ngcontent-%COMP%] {\n  transform: translateX(0);\n}\n.cal-modes-drawer__head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n  border-bottom: 1px solid var(--nav-border);\n  padding: 1rem 0.875rem;\n}\n.cal-modes-drawer__title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1rem;\n  font-weight: 700;\n  color: var(--text-primary);\n}\n.cal-modes-drawer__close[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.25rem;\n  height: 2.25rem;\n  border: none;\n  border-radius: 0.5rem;\n  background: transparent;\n  cursor: pointer;\n}\n.cal-modes-drawer__close[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n}\n.cal-modes-drawer__nav[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n  padding: 0.75rem;\n}\n.cal-modes-drawer__item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  width: 100%;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.625rem;\n  background: var(--page-bg);\n  padding: 0.75rem 0.875rem;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    background-color 0.15s ease,\n    border-color 0.15s ease,\n    color 0.15s ease;\n}\n.cal-modes-drawer__item[_ngcontent-%COMP%]:hover {\n  border-color: var(--nav-accent);\n}\n.cal-modes-drawer__item--active[_ngcontent-%COMP%] {\n  border-color: var(--nav-accent);\n  background: var(--nav-active-bg);\n  color: var(--nav-accent);\n}\n.cal-modes-drawer__item-num[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 2rem;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.125rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n}\n.cal-modes-drawer__item-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n}\n.cal-modes-drawer__item--active[_ngcontent-%COMP%]   .cal-modes-drawer__item-label[_ngcontent-%COMP%] {\n  color: var(--nav-accent);\n  font-weight: 600;\n}\n.cal-header[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n  display: flex;\n  flex-shrink: 0;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n  color: var(--text-primary);\n  box-sizing: border-box;\n}\n.cal-header__start[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  align-items: center;\n  gap: 0.5rem;\n}\n.cal-header__actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.375rem;\n}\n.cal-header__titles[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.125rem;\n}\n.cal-header__title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.125rem;\n  font-weight: 700;\n  letter-spacing: -0.025em;\n  line-height: 1.2;\n}\n@media (min-width: 640px) {\n  .cal-header__title[_ngcontent-%COMP%] {\n    font-size: 1.375rem;\n  }\n}\n.cal-header__period[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.35rem 0.5rem;\n  margin: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: 1.25;\n}\n.cal-header__week[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  font-size: 0.8125rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  letter-spacing: 0.02em;\n  color: var(--nav-accent);\n}\n@media (min-width: 640px) {\n  .cal-header__week[_ngcontent-%COMP%] {\n    font-size: 0.875rem;\n  }\n}\n.cal-header__range[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  color: var(--text-primary);\n  text-transform: capitalize;\n}\n.cal-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.25rem;\n}\n.cal-btn[_ngcontent-%COMP%] {\n  border-radius: 0.5rem;\n  border: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n  padding: 0.375rem 0.5rem;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.cal-btn[_ngcontent-%COMP%]:hover {\n  filter: brightness(0.97);\n}\n.cal-btn--burger[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.5rem;\n  height: 2.5rem;\n  padding: 0;\n}\n.cal-btn__icon[_ngcontent-%COMP%] {\n  display: block;\n  flex-shrink: 0;\n}\n@media (max-width: 1023px) {\n  .cal-btn__label[_ngcontent-%COMP%] {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n  }\n}\n.cal-btn--students[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.375rem;\n}\n@media (max-width: 1023px) {\n  .cal-btn--students[_ngcontent-%COMP%] {\n    width: 2.5rem;\n    height: 2.5rem;\n    padding: 0;\n  }\n}\n.cal-btn--active[_ngcontent-%COMP%] {\n  background: var(--nav-active-bg);\n  border-color: var(--nav-accent);\n  color: var(--nav-accent);\n}\n.cal-btn--today[_ngcontent-%COMP%] {\n  background: var(--nav-accent);\n  border-color: var(--nav-accent);\n  color: #fff;\n  padding: 0.25rem 0.5rem;\n  min-width: 2.5rem;\n}\n@media (min-width: 1024px) {\n  .cal-btn--today[_ngcontent-%COMP%] {\n    min-width: auto;\n    padding: 0.375rem 0.75rem;\n  }\n}\n.cal-btn--today[_ngcontent-%COMP%]:hover {\n  filter: brightness(1.08);\n}\n.cal-btn-today__label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 600;\n  white-space: nowrap;\n  line-height: 1.2;\n}\n.cal-btn-today__frame[_ngcontent-%COMP%] {\n  display: inline-flex;\n  min-width: 1.625rem;\n  height: 1.625rem;\n  align-items: center;\n  justify-content: center;\n  border: 2px solid #fff;\n  border-radius: 0.375rem;\n  font-size: 0.875rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  line-height: 1;\n}\n.cal-toolbar__mode-select[_ngcontent-%COMP%] {\n  width: min(9.5rem, 38vw);\n  min-width: 6.5rem;\n  flex-shrink: 0;\n}\n.cal-fab[_ngcontent-%COMP%] {\n  position: fixed;\n  right: 1rem;\n  bottom: 1rem;\n  z-index: 50;\n  display: flex;\n  width: 3.5rem;\n  height: 3.5rem;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  border-radius: 9999px;\n  background: var(--nav-accent);\n  color: #fff;\n  cursor: pointer;\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.22);\n  transition:\n    transform 0.15s ease,\n    box-shadow 0.15s ease,\n    filter 0.15s ease;\n}\n.cal-fab[_ngcontent-%COMP%]:hover {\n  filter: brightness(1.05);\n  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.28);\n}\n.cal-fab[_ngcontent-%COMP%]:active {\n  transform: scale(0.96);\n}\n@media (max-width: 768px), (max-height: 440px) {\n  .cal-fab[_ngcontent-%COMP%] {\n    right: 0.875rem;\n    bottom: calc(56px + 0.875rem + env(safe-area-inset-bottom, 0px));\n  }\n}\n.cal-layout[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 0;\n  flex: 1 1 0;\n  flex-direction: column;\n  gap: 0.5rem;\n  overflow: hidden;\n  box-sizing: border-box;\n}\n.cal-grid-section[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 0;\n  min-width: 0;\n  flex: 1 1 0;\n  flex-direction: column;\n  overflow: hidden;\n  border-radius: 0.75rem;\n  border: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n  touch-action: pan-y;\n  box-sizing: border-box;\n}\n.cal-grid-section[_ngcontent-%COMP%]:not(.cal-grid-section--month) {\n  max-height: 100%;\n}\n.cal-period-shell[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 0;\n  flex: 1 1 0;\n  flex-direction: column;\n  overflow: hidden;\n}\n.cal-period-shell--exit-next[_ngcontent-%COMP%]   .cal-period-view[_ngcontent-%COMP%], \n.cal-period-shell--exit-prev[_ngcontent-%COMP%]   .cal-period-view[_ngcontent-%COMP%], \n.cal-period-shell--exit-fade[_ngcontent-%COMP%]   .cal-period-view[_ngcontent-%COMP%] {\n  pointer-events: none;\n  transition: opacity 0.2s ease, transform 0.2s ease;\n}\n.cal-period-shell--exit-next[_ngcontent-%COMP%]   .cal-period-view[_ngcontent-%COMP%] {\n  opacity: 0;\n  transform: translateX(-1.25rem);\n}\n.cal-period-shell--exit-prev[_ngcontent-%COMP%]   .cal-period-view[_ngcontent-%COMP%] {\n  opacity: 0;\n  transform: translateX(1.25rem);\n}\n.cal-period-shell--exit-fade[_ngcontent-%COMP%]   .cal-period-view[_ngcontent-%COMP%] {\n  opacity: 0;\n  transform: scale(0.992);\n}\n.cal-period-view[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 0;\n  flex: 1 1 0;\n  flex-direction: column;\n  opacity: 1;\n  transform: translateX(0);\n  transition: opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1), transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);\n}\n@starting-style {\n  .cal-period-view[_ngcontent-%COMP%] {\n    opacity: 0;\n    transform: translateX(1.25rem);\n  }\n}\n@starting-style {\n  .cal-period-view--enter-prev[_ngcontent-%COMP%] {\n    transform: translateX(-1.25rem);\n  }\n}\n.cal-header__week[_ngcontent-%COMP%], \n.cal-header__range[_ngcontent-%COMP%] {\n  transition: opacity 0.22s ease;\n}\n@media (prefers-reduced-motion: reduce) {\n  .cal-period-shell--exit-next[_ngcontent-%COMP%]   .cal-period-view[_ngcontent-%COMP%], \n   .cal-period-shell--exit-prev[_ngcontent-%COMP%]   .cal-period-view[_ngcontent-%COMP%], \n   .cal-period-shell--exit-fade[_ngcontent-%COMP%]   .cal-period-view[_ngcontent-%COMP%], \n   .cal-period-view[_ngcontent-%COMP%] {\n    transition: none !important;\n    transform: none !important;\n    opacity: 1 !important;\n  }\n}\n.cal-month[_ngcontent-%COMP%] {\n  display: flex;\n  height: 100%;\n  min-height: 0;\n  flex: 1;\n  flex-direction: column;\n  overflow: hidden;\n}\n.cal-month__title[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  margin: 0;\n  padding: 0.625rem 0.875rem;\n  border-bottom: 1px solid var(--nav-border);\n  font-size: 1.0625rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  text-transform: capitalize;\n}\n@media (max-width: 1023px) {\n  .cal-month__title[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n.cal-month__scroll[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1 1 0;\n  min-height: 0;\n  overflow: hidden;\n}\n.cal-month__frame[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  flex-direction: column;\n  overflow-x: hidden;\n  overflow-y: auto;\n  scroll-behavior: smooth;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  touch-action: pan-y;\n  padding-bottom: max(var(--cal-grid-bottom-air), env(safe-area-inset-bottom, 0px));\n  box-sizing: border-box;\n}\n.cal-month__weekdays[_ngcontent-%COMP%] {\n  display: grid;\n  flex-shrink: 0;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  border-bottom: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n}\n.cal-month__weekday[_ngcontent-%COMP%] {\n  padding: 0.4rem 0.25rem;\n  text-align: center;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  letter-spacing: 0.02em;\n  color: var(--text-secondary);\n  border-right: 1px solid var(--nav-border);\n}\n.cal-month__weekday[_ngcontent-%COMP%]:nth-child(7n) {\n  border-right: none;\n}\n.cal-month__grid[_ngcontent-%COMP%] {\n  display: grid;\n  height: 100%;\n  min-height: 0;\n  flex: 1;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  grid-template-rows: repeat(var(--cal-month-weeks, 6), minmax(0, 1fr));\n  gap: 0;\n}\n.cal-month__cell[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  min-width: 0;\n  min-height: 0;\n  height: 100%;\n  flex-direction: column;\n  align-items: stretch;\n  justify-content: flex-start;\n  border: none;\n  border-right: 1px solid var(--nav-border);\n  border-bottom: 1px solid var(--nav-border);\n  border-radius: 0;\n  background: var(--nav-bg);\n  padding: 0.2rem 0.35rem 0.25rem;\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 0.12s ease;\n}\n.cal-month__cell[_ngcontent-%COMP%]:nth-child(7n) {\n  border-right: none;\n}\n.cal-month__cell[_ngcontent-%COMP%]:nth-last-child(-n+7) {\n  border-bottom: none;\n}\n.cal-month__cell[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n}\n.cal-month__cell--outside[_ngcontent-%COMP%] {\n  background: var(--page-bg);\n}\n.cal-month__cell--outside[_ngcontent-%COMP%]   .cal-month__day-num[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n  font-weight: 500;\n}\n.cal-month__cell--today[_ngcontent-%COMP%] {\n  background: rgba(236, 253, 245, 0.65);\n}\n.cal-month__cell--today[_ngcontent-%COMP%]   .cal-month__day-num[_ngcontent-%COMP%] {\n  display: inline-flex;\n  width: 1.625rem;\n  height: 1.625rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  background: var(--nav-accent);\n  color: #fff;\n  font-weight: 700;\n}\n.cal-month__cell--has-lessons[_ngcontent-%COMP%]:not(.cal-month__cell--today)   .cal-month__day-num[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.cal-month__day-num[_ngcontent-%COMP%] {\n  align-self: flex-end;\n  margin-left: auto;\n  font-size: 0.75rem;\n  font-weight: 500;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-primary);\n  line-height: 1.625rem;\n}\n@media (min-width: 640px) {\n  .cal-month__day-num[_ngcontent-%COMP%] {\n    font-size: 0.8125rem;\n  }\n}\n.cal-month__events[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.125rem;\n  margin-top: 0.15rem;\n  overflow: hidden;\n}\n.cal-month__badge[_ngcontent-%COMP%] {\n  display: block;\n  height: 1.25rem;\n  max-width: 100%;\n  padding: 0 0.35rem;\n  border-radius: 0.25rem;\n  background: #0369a1;\n  color: #fff;\n  font-size: 0.625rem;\n  font-weight: 600;\n  line-height: 1.25rem;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n@media (min-width: 640px) {\n  .cal-month__badge[_ngcontent-%COMP%] {\n    height: 1.35rem;\n    font-size: 0.6875rem;\n    line-height: 1.35rem;\n  }\n}\n.cal-month__badge--more[_ngcontent-%COMP%] {\n  background: rgba(71, 85, 105, 0.88);\n  font-weight: 500;\n}\n.cal-grid-headers[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 5;\n  display: flex;\n  flex-shrink: 0;\n  border-bottom: 1px solid var(--nav-border);\n}\n.cal-grid-headers__corner[_ngcontent-%COMP%] {\n  width: var(--cal-time-axis-w, 4rem);\n  flex-shrink: 0;\n  border-right: 1px solid var(--nav-border);\n}\n.cal-grid-headers__scroll[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex: 1;\n  overflow: hidden;\n  scrollbar-gutter: stable;\n}\n.cal-grid-headers__row[_ngcontent-%COMP%] {\n  display: grid;\n  width: 100%;\n}\n.cal-day-header[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  border: none;\n  border-right: 1px solid var(--nav-border);\n  background: transparent;\n  padding: 0.35rem 0.2rem;\n  text-align: center;\n  font-size: 0.625rem;\n  font-weight: 600;\n  color: var(--text-primary);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: pointer;\n  font-family: inherit;\n}\n.cal-day-header[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 0, 0, 0.04);\n}\n@media (min-width: 640px) {\n  .cal-day-header[_ngcontent-%COMP%] {\n    padding: 0.5rem 0.25rem;\n    font-size: 0.75rem;\n  }\n}\n@media (min-width: 1024px) {\n  .cal-day-header[_ngcontent-%COMP%] {\n    font-size: 0.875rem;\n  }\n}\n.cal-day-header--today[_ngcontent-%COMP%] {\n  background: rgb(236, 253, 245);\n}\n.cal-day-header--off[_ngcontent-%COMP%] {\n  opacity: 0.55;\n  background: rgba(148, 163, 184, 0.1);\n}\n.cal-day-header[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--nav-accent);\n  outline-offset: -2px;\n}\n.cal-grid-scroll[_ngcontent-%COMP%], \n.schedule-grid-scroll[_ngcontent-%COMP%] {\n  flex: 1;\n  min-height: 0;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  scroll-behavior: smooth;\n  scroll-snap-type: y mandatory;\n  scroll-padding-top: 0.5rem;\n  -webkit-overflow-scrolling: touch;\n  touch-action: pan-y;\n  overscroll-behavior-y: contain;\n  padding-bottom: var(--cal-grid-bottom-air, 1rem);\n  box-sizing: border-box;\n}\n.cal-grid-body[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: flex-start;\n  height: var(--cal-grid-height);\n  min-height: var(--cal-grid-height);\n  max-height: var(--cal-grid-height);\n  box-sizing: border-box;\n}\n.cal-time-axis[_ngcontent-%COMP%] {\n  position: sticky;\n  left: 0;\n  z-index: 0;\n  isolation: isolate;\n  width: var(--cal-time-axis-w, 4rem);\n  height: var(--cal-grid-height);\n  flex-shrink: 0;\n  border-right: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n}\n.cal-time-axis__end[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.125rem;\n  bottom: 0;\n  transform: translateY(50%);\n  font-size: 9px;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-secondary);\n  line-height: 1.1;\n  pointer-events: none;\n}\n@media (min-width: 640px) {\n  .cal-time-axis__end[_ngcontent-%COMP%] {\n    right: 0.25rem;\n    font-size: 0.75rem;\n  }\n}\n.cal-time-slot[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: flex-end;\n  scroll-snap-align: start;\n  border-bottom: 1px solid var(--nav-border);\n  padding-right: 0.125rem;\n  padding-top: 0.125rem;\n  font-size: 9px;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-secondary);\n  line-height: 1.1;\n}\n@media (min-width: 640px) {\n  .cal-time-slot[_ngcontent-%COMP%] {\n    padding-right: 0.25rem;\n    font-size: 0.75rem;\n  }\n}\n.cal-days-scroll[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  min-height: var(--cal-grid-height);\n  flex: 1;\n  flex-shrink: 0;\n  overflow: visible;\n}\n.cal-days-grid[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  width: 100%;\n  min-height: var(--cal-grid-height);\n}\n.cal-now-marker[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.125rem;\n  z-index: 22;\n  transform: translateY(-50%);\n  padding: 0.125rem 0.375rem;\n  border-radius: 4px;\n  background: #e53935;\n  color: #fff;\n  font-size: 10px;\n  font-weight: 600;\n  font-variant-numeric: tabular-nums;\n  line-height: 1.2;\n  pointer-events: none;\n  box-shadow: 0 1px 3px rgba(229, 57, 53, 0.45);\n}\n@media (min-width: 640px) {\n  .cal-now-marker[_ngcontent-%COMP%] {\n    right: 0.25rem;\n    font-size: 0.6875rem;\n  }\n}\n.cal-now-line-week[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  z-index: 12;\n  height: 2px;\n  margin-top: -1px;\n  background: #e53935;\n  pointer-events: none;\n  box-shadow: 0 0 0 1px rgba(229, 57, 53, 0.25);\n}\n.cal-day-column[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 0;\n  height: var(--cal-grid-height);\n  flex-shrink: 0;\n  overflow: hidden;\n  border-right: 1px solid var(--nav-border);\n}\n.cal-day-column.cdk-drop-list-dragging[_ngcontent-%COMP%], \n.cal-day-column.cdk-drop-list-receiving[_ngcontent-%COMP%] {\n  overflow: visible;\n}\n.cal-day-column--drag-target[_ngcontent-%COMP%] {\n  background: rgba(14, 165, 233, 0.04);\n}\n.cal-day-column--off[_ngcontent-%COMP%] {\n  opacity: 0.5;\n  background: rgba(148, 163, 184, 0.12);\n}\n.cal-day-column__off-label[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.5rem;\n  color: var(--text-secondary);\n  font-size: 0.8125rem;\n  font-weight: 600;\n  letter-spacing: 0.02em;\n  opacity: 0.55;\n  pointer-events: none;\n  text-align: center;\n}\n.cal-hour-line[_ngcontent-%COMP%] {\n  pointer-events: none;\n  scroll-snap-align: start;\n  border-bottom: 1px solid var(--nav-border);\n  border-right: 1px solid var(--nav-border);\n  opacity: 0.4;\n}\n.cal-hour-line[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.cal-lesson-card[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.25rem;\n  right: 0.25rem;\n  z-index: 10;\n  overflow: hidden;\n  cursor: grab;\n  touch-action: none;\n  user-select: none;\n  -webkit-user-select: none;\n  -webkit-touch-callout: none;\n  border-left-width: 4px;\n  border-left-style: solid;\n  border-left-color: transparent;\n  border-radius: 0.375rem;\n  padding: 0.125rem 0.375rem;\n  font-size: 10px;\n  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);\n}\n@media (min-width: 640px) {\n  .cal-lesson-card[_ngcontent-%COMP%] {\n    font-size: 0.75rem;\n  }\n}\n.cal-lesson-card--dragging[_ngcontent-%COMP%] {\n  z-index: 5;\n  cursor: grabbing;\n  opacity: 0.32;\n  pointer-events: none;\n  box-shadow: none;\n  filter: saturate(0.75);\n}\n.cal-lesson-card[_ngcontent-%COMP%]:active {\n  cursor: grabbing;\n}\n.cal-lesson-card__title[_ngcontent-%COMP%] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-weight: 600;\n  line-height: 1.25;\n}\n.cal-lesson-card__meta[_ngcontent-%COMP%] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  opacity: 0.85;\n  font-variant-numeric: tabular-nums;\n  line-height: 1.2;\n}\n.cal-lesson-card__details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.0625rem;\n  margin-top: 0.0625rem;\n  line-height: 1.15;\n}\n.cal-lesson-card__detail[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.25rem;\n  overflow: hidden;\n  margin: 0;\n  font-variant-numeric: tabular-nums;\n}\n.cal-lesson-card__detail[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  text-align: right;\n  font-weight: 500;\n}\n.cal-lesson-card__lbl[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  opacity: 0.65;\n  font-size: 0.85em;\n}\n.cal-lesson-card--scheduled[_ngcontent-%COMP%] {\n  background: rgb(240, 249, 255);\n  color: rgb(12, 74, 110);\n}\n.cal-lesson-card--completed[_ngcontent-%COMP%] {\n  background: rgb(236, 253, 245);\n  color: rgb(6, 78, 59);\n}\n.cal-lesson-card--missed[_ngcontent-%COMP%] {\n  background: rgb(255, 251, 235);\n  color: rgb(146, 64, 14);\n}\n.cal-lesson-card--canceled[_ngcontent-%COMP%] {\n  background: rgb(254, 242, 242);\n  color: rgb(153, 27, 27);\n  opacity: 0.6;\n  text-decoration: line-through;\n}\n.cal-lesson-card--focus-active[_ngcontent-%COMP%] {\n  z-index: 20;\n  outline: 2px solid rgb(16, 185, 129);\n  outline-offset: 1px;\n  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);\n}\n.cal-lesson-card--focus-dim[_ngcontent-%COMP%] {\n  opacity: 0.2;\n  pointer-events: none;\n}\n.cal-lesson-card--last-paid[_ngcontent-%COMP%] {\n  border: 2px solid rgb(255, 179, 0) !important;\n  background: rgb(255, 248, 225) !important;\n  color: rgb(127, 96, 0) !important;\n  box-shadow: 0 1px 2px rgba(255, 179, 0, 0.2);\n}\n.cal-lesson-card--last-paid.cal-lesson-card--canceled[_ngcontent-%COMP%] {\n  opacity: 1;\n  text-decoration: none;\n}\n.cal-lesson-card--placeholder[_ngcontent-%COMP%] {\n  left: 0.25rem;\n  right: 0.25rem;\n  opacity: 0.38;\n  border: 2px dashed rgba(14, 165, 233, 0.65) !important;\n  background: rgba(14, 165, 233, 0.07) !important;\n  box-shadow: none;\n  cursor: grabbing;\n}\n.cal-lesson-card--drag-preview[_ngcontent-%COMP%] {\n  position: relative;\n  left: auto;\n  right: auto;\n  width: calc(100% - 0.5rem);\n  min-width: 7.5rem;\n  touch-action: none;\n  opacity: 0.94;\n  cursor: grabbing;\n  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.24);\n}\n.cal-drag-preview-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.625rem;\n  left: 50%;\n  z-index: 2;\n  transform: translateX(-50%);\n  padding: 0.125rem 0.5rem;\n  border-radius: 999px;\n  background: rgb(14, 165, 233);\n  color: #fff;\n  font-size: 0.6875rem;\n  font-weight: 600;\n  font-variant-numeric: tabular-nums;\n  line-height: 1.2;\n  white-space: nowrap;\n  pointer-events: none;\n  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.35);\n}\n.lesson-phantom[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 24;\n  left: 0.25rem;\n  right: 0.25rem;\n  min-height: 3rem;\n  border: 2px dashed rgba(59, 130, 246, 0.9);\n  border-radius: 0.375rem;\n  pointer-events: none;\n  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.16);\n}\n.lesson-phantom__time[_ngcontent-%COMP%] {\n  margin-top: 0.2rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  opacity: 0.95;\n}\n.lesson-phantom.cal-lesson-card--scheduled[_ngcontent-%COMP%] {\n  background: rgba(240, 249, 255, 0.6);\n  border-color: rgba(14, 165, 233, 0.85);\n}\n.lesson-phantom.cal-lesson-card--completed[_ngcontent-%COMP%] {\n  background: rgba(236, 253, 245, 0.6);\n  border-color: rgba(16, 185, 129, 0.85);\n}\n.lesson-phantom.cal-lesson-card--missed[_ngcontent-%COMP%] {\n  background: rgba(255, 251, 235, 0.6);\n  border-color: rgba(245, 158, 11, 0.85);\n}\n.lesson-phantom.cal-lesson-card--canceled[_ngcontent-%COMP%] {\n  background: rgba(254, 242, 242, 0.6);\n  border-color: rgba(239, 68, 68, 0.85);\n  opacity: 1;\n  text-decoration: none;\n}\n.dark[_nghost-%COMP%]   .lesson-phantom[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .lesson-phantom[_ngcontent-%COMP%] {\n  border-color: rgba(96, 165, 250, 0.95);\n  background: rgba(30, 58, 138, 0.3);\n  color: rgb(191, 219, 254);\n  box-shadow: 0 2px 12px rgba(30, 58, 138, 0.4);\n}\nhtml.cal-lesson-dragging[_nghost-%COMP%]   .cal-grid-scroll[_ngcontent-%COMP%], html.cal-lesson-dragging   [_nghost-%COMP%]   .cal-grid-scroll[_ngcontent-%COMP%] {\n  touch-action: none;\n  overscroll-behavior: contain;\n  scroll-snap-type: none;\n  scroll-behavior: auto;\n}\n.cal-sidebar[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  border-radius: 0.75rem;\n  border: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n}\n.cal-sidebar--drawer[_ngcontent-%COMP%] {\n  position: fixed;\n  inset-block: 0;\n  right: 0;\n  z-index: 58;\n  width: min(24rem, 92vw);\n  min-width: 0;\n  max-width: 24rem;\n  flex: none;\n  transform: translateX(100%);\n  transition: transform 0.22s ease;\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);\n}\n.cal-sidebar--open[_ngcontent-%COMP%] {\n  transform: translateX(0);\n}\n.cal-sidebar__head[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n  border-bottom: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n  padding: 0.75rem;\n}\n.cal-sidebar__clear[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: 0.5rem;\n  border: 1px solid var(--nav-border);\n  padding: 0.5rem;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  background: transparent;\n  cursor: pointer;\n}\n.cal-sidebar__clear[_ngcontent-%COMP%]:hover {\n  filter: brightness(0.97);\n}\n.cal-sidebar__search[_ngcontent-%COMP%] {\n  min-height: 2.25rem;\n}\n.cal-sidebar__color-indicator[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: 0.625rem;\n  height: 0.625rem;\n  border-radius: 9999px;\n  border: 1px solid rgba(15, 23, 42, 0.12);\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.6);\n}\n.cal-sidebar__list[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.25rem;\n  overflow-y: auto;\n  padding: 0.5rem;\n  min-height: 0;\n}\n.cal-sidebar__empty[_ngcontent-%COMP%] {\n  padding: 1.25rem 0.75rem;\n  text-align: center;\n  font-size: 0.8125rem;\n  line-height: 1.45;\n  color: var(--text-secondary);\n}\n.cal-sidebar__item-btn[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  align-items: center;\n  gap: 0.75rem;\n  border-radius: 0 0.5rem 0.5rem 0;\n  border: 1px solid transparent;\n  padding: 0.625rem 0.5rem 0.625rem 0.5rem;\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n.cal-sidebar__item-btn[_ngcontent-%COMP%]:hover {\n  background: rgba(248, 250, 252, 0.8);\n}\n.cal-sidebar__item-btn--active[_ngcontent-%COMP%] {\n  background: rgb(248, 250, 252);\n  border-left-width: 4px;\n  border-left-style: solid;\n}\n.cal-sidebar__info[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1;\n}\n.cal-sidebar__name[_ngcontent-%COMP%] {\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-weight: 500;\n  color: var(--text-primary);\n}\n.cal-sidebar__meta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.125rem;\n}\n.cal-sidebar__balance[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-variant-numeric: tabular-nums;\n  font-weight: 600;\n  color: var(--text-secondary);\n}\n.cal-sidebar__balance--last[_ngcontent-%COMP%] {\n  color: rgb(127, 96, 0);\n}\n.cal-sidebar__last-hint[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.cal-sidebar__rate[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-secondary);\n}\n.cal-form-last-paid-warning[_ngcontent-%COMP%] {\n  margin: 0;\n  border-radius: 0.5rem;\n  border: 2px solid rgb(255, 179, 0);\n  background: rgb(255, 248, 225);\n  padding: 0.625rem 0.75rem;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  line-height: 1.4;\n  color: rgb(127, 96, 0);\n}\n.cal-billing-balance-hint[_ngcontent-%COMP%] {\n  margin-top: 0.75rem;\n  font-size: 0.875rem;\n  line-height: 1.55;\n  color: var(--text-secondary);\n}\n.cal-billing-balance-hint[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--nav-accent);\n}\n.cal-billing-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  margin-top: 1.25rem;\n}\n.cal-billing-actions[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #6b7280;\n  border: none;\n  border-radius: 0.5rem;\n  font-weight: 500;\n  padding: 10px 16px;\n  cursor: pointer;\n  transition: color 0.2s;\n  font-size: 14px;\n}\n.cal-billing-actions[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%]:hover {\n  color: #1f2937;\n}\n.cal-billing-actions[_ngcontent-%COMP%]   .btn-keep-balance[_ngcontent-%COMP%] {\n  background: #f3f4f6;\n  color: #374151;\n  border: none;\n  border-radius: 8px;\n  font-weight: 500;\n  padding: 10px 18px;\n  cursor: pointer;\n  transition: background 0.2s;\n  font-size: 14px;\n}\n.cal-billing-actions[_ngcontent-%COMP%]   .btn-keep-balance[_ngcontent-%COMP%]:hover {\n  background: #e5e7eb;\n}\n.cal-billing-actions[_ngcontent-%COMP%]   .btn-deduct-lesson[_ngcontent-%COMP%] {\n  background: #1f2937;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  font-weight: 600;\n  padding: 10px 20px;\n  cursor: pointer;\n  transition: background 0.2s;\n  font-size: 14px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\n}\n.cal-billing-actions[_ngcontent-%COMP%]   .btn-deduct-lesson[_ngcontent-%COMP%]:hover {\n  background: #111827;\n}\n[data-theme=dark][_ngcontent-%COMP%]   .cal-billing-actions[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n}\n[data-theme=dark][_ngcontent-%COMP%]   .cal-billing-actions[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%]:hover {\n  color: var(--text-primary);\n}\n[data-theme=dark][_ngcontent-%COMP%]   .cal-billing-actions[_ngcontent-%COMP%]   .btn-keep-balance[_ngcontent-%COMP%] {\n  background: var(--nav-hover);\n  color: var(--text-primary);\n}\n[data-theme=dark][_ngcontent-%COMP%]   .cal-billing-actions[_ngcontent-%COMP%]   .btn-keep-balance[_ngcontent-%COMP%]:hover {\n  background: var(--nav-border);\n}\n[data-theme=dark][_ngcontent-%COMP%]   .cal-billing-actions[_ngcontent-%COMP%]   .btn-deduct-lesson[_ngcontent-%COMP%] {\n  background: #e8eaed;\n  color: #202124;\n}\n[data-theme=dark][_ngcontent-%COMP%]   .cal-billing-actions[_ngcontent-%COMP%]   .btn-deduct-lesson[_ngcontent-%COMP%]:hover {\n  background: #fff;\n}\n@media (min-width: 768px) {\n  [_nghost-%COMP%]   .modal--lesson[_ngcontent-%COMP%] {\n    max-width: 28rem;\n  }\n}\n[_nghost-%COMP%]   .modal-header[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n  flex-shrink: 0;\n  padding: 1rem 0.75rem 0.75rem 1rem;\n  background: var(--nav-bg);\n}\n[_nghost-%COMP%]   .modal-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  font-size: 1.125rem;\n  line-height: 1.35;\n  font-weight: 500;\n  color: var(--text-primary);\n}\n.modal-close[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: 2.5rem;\n  height: 2.5rem;\n  margin: 0;\n  padding: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  background: transparent;\n  color: var(--text-secondary);\n  border-radius: 0.5rem;\n  cursor: pointer;\n}\n.modal-close[_ngcontent-%COMP%]:hover {\n  background: var(--nav-hover);\n  color: var(--text-primary);\n}\n[_nghost-%COMP%]   .modal-body[_ngcontent-%COMP%] {\n  flex: 0 1 auto;\n  padding: 0.75rem 1rem calc(1.25rem + env(safe-area-inset-bottom, 0px));\n  overflow: visible;\n}\n.cal-form-error[_ngcontent-%COMP%] {\n  margin-bottom: 0.75rem;\n  font-size: 0.875rem;\n  color: rgb(220, 38, 38);\n}\n.cal-form-fields[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  overflow: visible;\n}\n.cal-form-fields[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.cal-form-fields[_ngcontent-%COMP%]   .field--datetime[_ngcontent-%COMP%]   .app-input--datetime[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.cal-form-fields[_ngcontent-%COMP%]   app-select[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 0;\n}\n.cal-form-preview[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-variant-numeric: tabular-nums;\n  color: rgb(100, 116, 139);\n}\n.cal-form-preview--snapshot[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--text-primary);\n}\n.cal-form-preview--hint[_ngcontent-%COMP%] {\n  color: var(--nav-accent);\n}\n.cal-chips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.cal-chip[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 9999px;\n  padding: 0.5rem 0.875rem;\n  font-size: 0.875rem;\n  font-weight: 500;\n  background: rgb(241, 245, 249);\n  color: rgb(71, 85, 105);\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.cal-chip[_ngcontent-%COMP%]:hover {\n  background: rgb(5, 150, 105);\n  transition: all 0.15s ease;\n}\n.cal-chip--active[_ngcontent-%COMP%] {\n  background: rgb(5, 150, 105);\n  color: #fff;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n}\n.cal-recurrence[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.cal-recurrence-trigger[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  width: 100%;\n  padding: 0.625rem 0.75rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  background: var(--nav-bg);\n  color: var(--text-primary);\n  font-size: 0.875rem;\n  text-align: left;\n  cursor: pointer;\n  transition: border-color 0.2s ease;\n}\n.cal-recurrence-trigger[_ngcontent-%COMP%]:hover {\n  border-color: var(--nav-accent);\n}\n.cal-recurrence-trigger__text[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  line-height: 1.35;\n}\n.cal-recurrence-trigger__chevron[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  font-size: 1.125rem;\n  color: var(--text-secondary);\n}\n.modal-overlay--stack-top[_ngcontent-%COMP%] {\n  z-index: var(--z-app-dialog-top);\n}\n@media (min-width: 768px) {\n  .modal--recurrence[_ngcontent-%COMP%] {\n    max-width: 24rem;\n  }\n}\n.cal-recurrence-modal__actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  flex-shrink: 0;\n  padding: 0.75rem 1rem calc(1rem + env(safe-area-inset-bottom, 0px));\n  border-top: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n}\n.cal-recurrence-modal__actions[_ngcontent-%COMP%]   .btn-link.cancel[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n}\n.cal-recurrence-modal[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  overflow: visible;\n}\n.cal-recurrence-modal[_ngcontent-%COMP%]   app-select[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 0;\n}\n.cal-recurrence__section[_ngcontent-%COMP%] {\n  margin: 0.25rem 0 0;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.cal-recurrence-interval[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  flex-wrap: wrap;\n}\n.cal-recurrence-interval__label[_ngcontent-%COMP%] {\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n}\n.cal-recurrence-interval__input[_ngcontent-%COMP%] {\n  width: 4.5rem;\n  min-width: 0;\n}\n.cal-recurrence-interval__unit[_ngcontent-%COMP%] {\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n}\n.cal-recurrence__label[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.cal-recurrence__hint[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n  line-height: 1.35;\n}\n.cal-recurrence__days[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.cal-recurrence-day[_ngcontent-%COMP%] {\n  width: 2.25rem;\n  height: 2.25rem;\n  padding: 0;\n  border: 1px solid var(--nav-border);\n  border-radius: 50%;\n  background: var(--nav-bg);\n  color: var(--text-secondary);\n  font-size: 0.6875rem;\n  font-weight: 700;\n  line-height: 1;\n  cursor: pointer;\n  transition:\n    background-color 0.2s ease,\n    border-color 0.2s ease,\n    color 0.2s ease,\n    transform 0.15s ease,\n    box-shadow 0.2s ease;\n}\n.cal-recurrence-day[_ngcontent-%COMP%]:hover {\n  border-color: var(--nav-accent);\n  color: var(--nav-accent);\n}\n.cal-recurrence-day--active[_ngcontent-%COMP%] {\n  border-color: var(--nav-accent);\n  background: var(--nav-accent);\n  color: #fff;\n  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.35);\n  transform: scale(1.06);\n}\n.cal-recurrence-day[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--nav-accent);\n  outline-offset: 2px;\n}\n.cal-recurrence-delete[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.cal-recurrence-delete__btn[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: center;\n}\n.cal-form-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.cal-form-actions--wrap[_ngcontent-%COMP%] {\n  flex-wrap: wrap;\n}\n.cal-btn-delete[_ngcontent-%COMP%] {\n  margin-right: auto;\n  border: 0;\n  background: transparent;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: rgb(168, 51, 51);\n  cursor: pointer;\n}\n.cal-btn-delete[_ngcontent-%COMP%]:active {\n  color: rgb(168, 51, 51);\n}\n.cal-btn-delete[_ngcontent-%COMP%]:hover {\n  background: rgb(254, 242, 242);\n}\n.cal-btn-delete[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=calendar.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalendarComponent, [{
    type: Component,
    args: [{ selector: "app-calendar", standalone: true, imports: [FormsModule, CurrencyPipe, AppDialogComponent, AppSelectComponent, NgTemplateOutlet], template: `<div class="cal-page">
  <div class="cal-page__inner">
    @if (loadError) {
      <p class="cal-error">{{ loadError }}</p>
    } @else if (!hasLoaded()) {
      <div
        class="cal-skeleton"
        role="status"
        aria-busy="true"
        [attr.aria-label]="i18n.calendarUi().loadSchedule"
      >
        <span class="sr-only">{{ i18n.sharedUi().loadingContent }}</span>
        <div class="cal-skeleton__header">
          <div class="cal-skeleton__header-text">
            <span class="skeleton skeleton--line skeleton--line-lg" style="width: 42%"></span>
            <span class="skeleton skeleton--line skeleton--line-sm" style="width: 28%"></span>
          </div>
          <div class="cal-skeleton__toolbar">
            <span class="skeleton skeleton--btn" style="width: 2.5rem"></span>
            <span class="skeleton skeleton--btn" style="width: 2.5rem"></span>
            <span class="skeleton skeleton--btn" style="width: 2.5rem"></span>
          </div>
        </div>
        <div class="cal-skeleton__grid-wrap">
          <div class="cal-skeleton__day-headers">
            <span class="cal-skeleton__corner"></span>
            <div class="cal-skeleton__day-row">
              @for (c of skeletonGridCols; track c) {
                <span class="skeleton skeleton--line skeleton--line-sm"></span>
              }
            </div>
          </div>
          <div class="cal-skeleton__body">
            <div class="cal-skeleton__axis">
              @for (h of skeletonHourRows; track h) {
                <span class="skeleton skeleton--line skeleton--line-sm"></span>
              }
            </div>
            <div class="cal-skeleton__columns">
              @for (c of skeletonGridCols; track c) {
                <div class="cal-skeleton__column">
                  @for (h of skeletonHourRows; track h) {
                    <span class="skeleton skeleton--block cal-skeleton__hour"></span>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    } @else {
      @if ((isBottomNavLayout() && modesMenuOpen()) || studentsSidebarOpen()) {
        <div
          class="cal-backdrop"
          role="presentation"
          (click)="modesMenuOpen.set(false); studentsSidebarOpen.set(false)"
        ></div>
      }

      @if (isBottomNavLayout()) {
        <aside class="cal-modes-drawer" [class.cal-modes-drawer--open]="modesMenuOpen()">
          <div class="cal-modes-drawer__head">
            <h2 class="cal-modes-drawer__title">{{ i18n.calendarUi().modeDrawerTitle }}</h2>
            <button
              type="button"
              class="cal-modes-drawer__close"
              (click)="modesMenuOpen.set(false)"
              [attr.aria-label]="i18n.studentsUi().close"
            >
              <img src="/assets/icons/icon-close.svg" width="20" height="20" alt="" />
            </button>
          </div>
          <nav class="cal-modes-drawer__nav">
            @for (mode of viewModes; track mode) {
              <button
                type="button"
                class="cal-modes-drawer__item"
                [class.cal-modes-drawer__item--active]="viewMode() === mode"
                (click)="setViewMode(mode)"
              >
                <span class="cal-modes-drawer__item-num">{{ mode }}</span>
                <span class="cal-modes-drawer__item-label">{{ viewModeLabel(mode) }}</span>
              </button>
            }
          </nav>
        </aside>
      }

      <header class="cal-header">
        <div class="cal-header__start">
          @if (isBottomNavLayout()) {
            <button
              type="button"
              class="cal-btn cal-btn--burger"
              (click)="toggleModesMenu()"
              [attr.aria-expanded]="modesMenuOpen()"
              [attr.aria-label]="i18n.calendarUi().modeDrawerTitle"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          }
          <div class="cal-header__titles">
            @if (!isCompactHeader()) {
              <h1 class="cal-header__title">{{ i18n.calendarUi().title }}</h1>
            }
            <p class="cal-header__period">
              <span class="cal-header__week">{{ calendarWeekLabel() }}</span>
              @if (periodRangeLabel(); as range) {
                <span class="cal-header__range">{{ range }}</span>
              }
            </p>
          </div>
        </div>

        <div class="cal-header__actions">
          <div class="cal-toolbar">
            @if (!isCompactHeader()) {
              <button
                type="button"
                class="cal-btn"
                (click)="navPrev()"
                [attr.aria-label]="i18n.calendarUi().prev"
              >
                \u2039
              </button>
            }
            <button
              type="button"
              class="cal-btn cal-btn--today"
              (click)="goToToday()"
              [attr.aria-label]="i18n.calendarUi().today"
              [attr.title]="i18n.calendarUi().today"
            >
              @if (isCompactHeader()) {
                <span class="cal-btn-today__frame">{{ todayDayOfMonth() }}</span>
              } @else {
                <span class="cal-btn-today__label">{{ i18n.calendarUi().today }}</span>
              }
            </button>
            @if (!isCompactHeader()) {
              <button
                type="button"
                class="cal-btn"
                (click)="navNext()"
                [attr.aria-label]="i18n.calendarUi().next"
              >
                \u203A
              </button>
            }
            @if (!isBottomNavLayout()) {
              <app-select
                class="cal-toolbar__mode-select"
                [ngModel]="viewMode()"
                (ngModelChange)="onViewModeSelect($event)"
                [options]="viewModeSelectOptions()"
                [ariaLabel]="i18n.calendarUi().modeDrawerTitle"
                size="compact"
                menuPlacement="below"
              />
            }
          </div>
          <button
            type="button"
            class="cal-btn cal-btn--students"
            [class.cal-btn--active]="studentsSidebarOpen()"
            (click)="toggleStudentsSidebar()"
            [attr.aria-expanded]="studentsSidebarOpen()"
            [attr.aria-label]="i18n.calendarUi().students"
            [attr.title]="i18n.calendarUi().students"
          >
            <img
              class="cal-btn__icon"
              src="/assets/icons/icon-students.svg"
              width="22"
              height="22"
              alt=""
            />
            <span class="cal-btn__label">{{ i18n.calendarUi().students }}</span>
          </button>
        </div>
      </header>

      <div class="cal-layout">
        <section
          class="cal-grid-section"
          [class.cal-grid-section--month]="isMonthOverview()"
          (touchstart)="onPeriodSwipeStart($event)"
          (touchend)="onPeriodSwipeEnd($event)"
        >
          <div
            class="cal-period-shell"
            [class.cal-period-shell--exit-next]="periodExitMode() === 'next'"
            [class.cal-period-shell--exit-prev]="periodExitMode() === 'prev'"
            [class.cal-period-shell--exit-fade]="periodExitMode() === 'fade'"
          >
            @for (periodKey of [periodViewKey()]; track periodKey) {
              <div
                class="cal-period-view"
                [class.cal-period-view--enter-next]="periodEnterFrom() === 'next'"
                [class.cal-period-view--enter-prev]="periodEnterFrom() === 'prev'"
              >
                @if (isMonthOverview()) {
                  <div class="cal-month">
                    <p class="cal-month__title">{{ formatMonthYearLabel() }}</p>
                    <div class="cal-month__scroll">
                      <div class="cal-month__frame">
                        <div class="cal-month__weekdays">
                          @for (label of weekdayLabels(); track label) {
                            <div class="cal-month__weekday">{{ label }}</div>
                          }
                        </div>
                        <div class="cal-month__grid" [style.--cal-month-weeks]="monthWeekRows()">
                          @for (cell of monthOverviewCells(); track dayKey(cell.date)) {
                            <button
                              type="button"
                              class="cal-month__cell"
                              [class.cal-month__cell--outside]="!cell.inMonth"
                              [class.cal-month__cell--today]="isToday(cell.date)"
                              [class.cal-month__cell--has-lessons]="
                                lessonCountForDay(cell.date) > 0
                              "
                              (click)="openDayView(cell.date)"
                            >
                              <span class="cal-month__day-num">{{ cell.date.getDate() }}</span>
                              <div class="cal-month__events" aria-hidden="true">
                                @for (
                                  lesson of monthBadgeLessons(cell.date);
                                  track lesson.occurrenceKey ?? lesson._id
                                ) {
                                  <span
                                    class="cal-month__badge"
                                    [style.background]="monthLessonBadgeColor(lesson)"
                                    >{{ monthLessonBadgeLabel(lesson) }}</span
                                  >
                                }
                                @if (monthHiddenLessonCount(cell.date); as hidden) {
                                  @if (hidden > 0) {
                                    <span class="cal-month__badge cal-month__badge--more">{{
                                      monthMoreLessonsLabel(hidden)
                                    }}</span>
                                  }
                                }
                              </div>
                            </button>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                } @else {
                  <div class="cal-grid-headers">
                    <div class="cal-grid-headers__corner"></div>
                    <div class="cal-grid-headers__scroll">
                      <div
                        class="cal-grid-headers__row"
                        [style.grid-template-columns]="gridTemplateColumns()"
                      >
                        @for (col of columns(); track dayKey(col)) {
                          <button
                            type="button"
                            class="cal-day-header"
                            [class.cal-day-header--today]="isToday(col)"
                            [class.cal-day-header--off]="isNonWorkingDay(col)"
                            [attr.aria-label]="formatColumnHeader(col)"
                            (click)="openDayView(col); $event.stopPropagation()"
                          >
                            {{ formatColumnHeader(col) }}
                          </button>
                        }
                      </div>
                    </div>
                  </div>

                  <div
                    class="cal-grid-scroll"
                    #gridScroll
                    #scrollContainer
                    (dragover)="onScrollContainerDragOver($event)"
                  >
                    <div
                      class="cal-grid-body"
                      [style.--cal-grid-height.px]="gridHeightPx()"
                      [style.--cal-grid-bottom-air.px]="gridBottomPaddingPx"
                    >
                      <div class="cal-time-axis" [style.height.px]="gridHeightPx()">
                        @for (hour of gridHours(); track hour) {
                          <div class="cal-time-slot" [style.height.px]="hourHeightPx">
                            {{ formatHourLabel(hour) }}
                          </div>
                        }
                        <span class="cal-time-axis__end">{{ formatHourLabel(gridEndHour()) }}</span>
                        @if (nowLineTopPx(); as nowTop) {
                          <div class="cal-now-marker" [style.top.px]="nowTop">
                            {{ nowTimeLabel() }}
                          </div>
                        }
                      </div>

                      <div class="cal-days-scroll">
                        <div
                          class="cal-days-grid"
                          [style.grid-template-columns]="gridTemplateColumns()"
                        >
                          @for (col of columns(); track dayKey(col)) {
                            <div
                              class="cal-day-column"
                              [attr.data-day-key]="dayKey(col)"
                              [class.cal-day-column--drag-target]="isDayDragTarget(col)"
                              [class.cal-day-column--off]="isNonWorkingDay(col)"
                              (click)="onDayColumnClick(col, $event)"
                              (dragover)="onDayColumnDragOver($event, col)"
                              (drop)="onDayColumnDrop($event)"
                            >
                              @if (isNonWorkingDay(col)) {
                                <div class="cal-day-column__off-label">
                                  {{ i18n.calendarUi().dayOffLabel }}
                                </div>
                              }
                              @for (hour of gridHours(); track hour) {
                                <div class="cal-hour-line" [style.height.px]="hourHeightPx"></div>
                              }

                              @if (showPhantomInColumn(col)) {
                                <div
                                  class="lesson-phantom cal-lesson-card"
                                  [class.cal-lesson-card--scheduled]="
                                    draggedLesson()?.status === 'scheduled'
                                  "
                                  [class.cal-lesson-card--completed]="
                                    draggedLesson()?.status === 'completed'
                                  "
                                  [class.cal-lesson-card--missed]="
                                    draggedLesson()?.status === 'missed'
                                  "
                                  [class.cal-lesson-card--canceled]="
                                    draggedLesson()?.status === 'canceled'
                                  "
                                  [style.border-left-color]="
                                    getStudentColor(draggedLesson()?.student_id)
                                  "
                                  [style.top.px]="phantomTopForColumn(col) ?? 0"
                                >
                                  @if (draggedLesson(); as phantomLesson) {
                                    <p class="cal-lesson-card__title">
                                      {{
                                        phantomLesson.student_name ||
                                          getStudentName(phantomLesson.student_id)
                                      }}
                                    </p>
                                    @if (lessonCardUseCompactMeta(phantomLesson)) {
                                      <p class="cal-lesson-card__meta">
                                        {{ formatLessonRegion(phantomLesson) }}
                                        \xB7 {{ formatLessonSnapshotRate(phantomLesson) }} \xB7
                                        {{ formatLessonDuration(phantomLesson.lesson_duration) }}
                                      </p>
                                    } @else {
                                      <div class="cal-lesson-card__details">
                                        <p class="cal-lesson-card__detail">
                                          <span class="cal-lesson-card__lbl">{{
                                            i18n.calendarUi().regionLabel
                                          }}</span>
                                          <span>{{ formatLessonRegion(phantomLesson) }}</span>
                                        </p>
                                        <p class="cal-lesson-card__detail">
                                          <span class="cal-lesson-card__lbl">{{
                                            i18n.calendarUi().rateLabel
                                          }}</span>
                                          <span>{{ formatLessonSnapshotRate(phantomLesson) }}</span>
                                        </p>
                                        <p class="cal-lesson-card__detail">
                                          <span class="cal-lesson-card__lbl">{{
                                            i18n.calendarUi().durationLabel
                                          }}</span>
                                          <span>{{
                                            formatLessonDuration(phantomLesson.lesson_duration)
                                          }}</span>
                                        </p>
                                      </div>
                                    }
                                  }
                                  <p class="cal-lesson-card__meta lesson-phantom__time">
                                    {{ phantomDropTimeLabel() }}
                                  </p>
                                </div>
                              }

                              @for (
                                lesson of lessonsForColumn(col);
                                track lesson.occurrenceKey ?? lesson._id
                              ) {
                                <div
                                  [class]="lessonCardClass(lesson)"
                                  [class.cal-lesson-card--last-paid]="lesson.isLastPaid"
                                  [style.top.px]="calculateTop(displayScheduledAt(lesson))"
                                  [style.height.px]="calculateHeight(lesson.lesson_duration)"
                                  [style.border-left-color]="getStudentColor(lesson.student_id)"
                                  [attr.draggable]="useNativeLessonDrag() ? true : null"
                                  (dragstart)="onLessonDragStart($event, lesson)"
                                  (dragend)="onLessonDragEnd()"
                                  (pointerdown)="onLessonPointerDown($event, lesson)"
                                  (click)="onLessonCardClick($event, lesson)"
                                >
                                  <p class="cal-lesson-card__title">
                                    {{ getStudentName(lesson.student_id) }}
                                  </p>
                                  @if (lessonCardUseCompactMeta(lesson)) {
                                    <p class="cal-lesson-card__meta">
                                      {{ formatLessonRegion(lesson) }}
                                      \xB7 {{ formatLessonSnapshotRate(lesson) }} \xB7
                                      {{ formatLessonDuration(lesson.lesson_duration) }}
                                    </p>
                                  } @else {
                                    <div class="cal-lesson-card__details">
                                      <p class="cal-lesson-card__detail">
                                        <span class="cal-lesson-card__lbl">{{
                                          i18n.calendarUi().regionLabel
                                        }}</span>
                                        <span>{{ formatLessonRegion(lesson) }}</span>
                                      </p>
                                      <p class="cal-lesson-card__detail">
                                        <span class="cal-lesson-card__lbl">{{
                                          i18n.calendarUi().rateLabel
                                        }}</span>
                                        <span>{{ formatLessonSnapshotRate(lesson) }}</span>
                                      </p>
                                      <p class="cal-lesson-card__detail">
                                        <span class="cal-lesson-card__lbl">{{
                                          i18n.calendarUi().durationLabel
                                        }}</span>
                                        <span>{{
                                          formatLessonDuration(lesson.lesson_duration)
                                        }}</span>
                                      </p>
                                    </div>
                                  }
                                </div>
                              }
                            </div>
                          }
                          @if (nowLineTopPx(); as nowTop) {
                            <div
                              class="cal-now-line-week"
                              [style.top.px]="nowTop"
                              aria-hidden="true"
                            ></div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </section>

        <aside
          class="cal-sidebar cal-sidebar--drawer"
          [class.cal-sidebar--open]="studentsSidebarOpen()"
        >
          <div class="cal-sidebar__head">
            <button type="button" class="cal-sidebar__clear" (click)="clearStudentFocus()">
              {{ i18n.calendarUi().showAllStudents }}
            </button>
            <input
              type="search"
              class="app-input cal-sidebar__search"
              [placeholder]="i18n.calendarUi().searchStudent"
              [ngModel]="studentsSidebarQuery()"
              (ngModelChange)="studentsSidebarQuery.set($event)"
              autocomplete="off"
            />
          </div>
          <ul class="cal-sidebar__list">
            @for (sidebarStudent of filteredStudentsForSidebar(); track sidebarStudent._id) {
              <li>
                <button
                  type="button"
                  class="cal-sidebar__item-btn"
                  [class.cal-sidebar__item-btn--active]="focusedStudentId() === sidebarStudent._id"
                  [style.border-left-color]="
                    focusedStudentId() === sidebarStudent._id
                      ? getStudentColor(sidebarStudent._id)
                      : null
                  "
                  (click)="selectSidebarStudent(sidebarStudent._id)"
                >
                  <span
                    class="cal-sidebar__color-indicator"
                    [style.background-color]="getStudentColor(sidebarStudent._id)"
                    aria-hidden="true"
                  ></span>
                  <span class="cal-sidebar__info">
                    <span class="cal-sidebar__name">{{ sidebarStudent.name }}</span>
                    <span class="cal-sidebar__meta">
                      <span
                        class="cal-sidebar__balance"
                        [class.cal-sidebar__balance--last]="isPackageLastBalance(sidebarStudent)"
                      >
                        {{ sidebarStudent.balance_lessons }}
                        {{ i18n.studentsUi().lessonsShort }}
                        @if (isPackageLastBalance(sidebarStudent)) {
                          <span class="cal-sidebar__last-hint">
                            \xB7 {{ i18n.calendarUi().lastLessonHint }}
                          </span>
                        }
                      </span>
                      <span class="cal-sidebar__rate">
                        {{
                          sidebarStudent.rate_per_hour
                            | currency: sidebarStudent.rate_currency ?? 'EUR' : 'code' : '1.0-0'
                        }}{{ i18n.studentsUi().perHour }}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            } @empty {
              <li class="cal-sidebar__empty">
                @if (students().length === 0) {
                  {{ i18n.calendarUi().studentsSidebarEmpty }}
                } @else {
                  {{ i18n.calendarUi().studentsSidebarNoResults }}
                }
              </li>
            }
          </ul>
        </aside>
      </div>

      <button
        type="button"
        class="cal-fab"
        (click)="openNewLessonFab()"
        [attr.aria-label]="i18n.calendarUi().addLesson"
        [attr.title]="i18n.calendarUi().addLesson"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    }
  </div>
</div>

@if (showLessonForm()) {
  <div
    class="modal-overlay modal-overlay--sheet"
    role="presentation"
    animate.leave="modal-overlay-leave"
  >
    <div
      class="modal modal-sheet modal--lesson"
      role="dialog"
      aria-modal="true"
      animate.leave="modal-sheet-leave"
      (click)="$event.stopPropagation()"
    >
      <div class="modal-header">
        <h2>
          @if (editLessonTarget()) {
            {{ i18n.calendarUi().editLesson }}
          } @else if (lessonFormStep() === 2) {
            {{ i18n.calendarUi().notesStep }}
          } @else {
            {{ i18n.calendarUi().newLesson }}
          }
        </h2>
        <button
          type="button"
          class="modal-close"
          (click)="closeLessonForm()"
          [attr.aria-label]="i18n.studentsUi().close"
        >
          <img src="/assets/icons/icon-close.svg" width="24" height="24" alt="" />
        </button>
      </div>

      <div class="modal-sheet__scroll">
        <form class="modal-body" (ngSubmit)="saveLesson()">
          @if (studentsLoadError) {
            <p class="cal-form-error">{{ studentsLoadError }}</p>
          }

          @if (editLessonTarget()) {
            <div class="cal-form-fields">
              <app-select
                name="student_id"
                [(ngModel)]="form.student_id"
                [options]="studentSelectOptions()"
                [placeholder]="i18n.calendarUi().studentPlaceholder"
                [emptyMessage]="i18n.calendarUi().noStudentsForLesson"
                menuPlacement="below"
              />

              @if (editLessonTarget()?.isLastPaid) {
                <p class="cal-form-last-paid-warning" role="status">
                  {{ i18n.calendarUi().lastPaidPackageWarning }}
                </p>
              }

              @if (editLessonTarget(); as editing) {
                <p class="cal-form-preview cal-form-preview--snapshot">
                  {{ i18n.calendarUi().snapshotRateLabel }}
                  @if (lessonHasSnapshotRate(editing)) {
                    {{
                      editing.lesson_price | currency: editing.lesson_currency : 'code' : '1.0-0'
                    }}/\u0447
                  } @else {
                    \u2014
                  }
                </p>
                @if (editLessonStudentChanged()) {
                  <p class="cal-form-preview cal-form-preview--hint">
                    {{ i18n.calendarUi().snapshotWillUpdate }}
                  </p>
                }
              }

              <div class="field field--datetime">
                <label for="scheduledAtLocal">{{ i18n.calendarUi().scheduledAtLabel }}</label>
                <input
                  id="scheduledAtLocal"
                  class="app-input app-input--datetime"
                  type="datetime-local"
                  name="scheduledAtLocal"
                  [ngModel]="scheduledAtLocal()"
                  (ngModelChange)="onScheduledAtLocalChange($event)"
                />
              </div>

              <div class="cal-chips">
                @for (presetMinutes of durationPresets; track presetMinutes) {
                  <button
                    type="button"
                    class="cal-chip"
                    [class.cal-chip--active]="
                      durationChipMode() === 'preset' && duration() === presetMinutes
                    "
                    (click)="selectDurationPreset(presetMinutes)"
                  >
                    {{ formatDurationPresetLabel(presetMinutes) }}
                  </button>
                }
              </div>

              <div class="cal-recurrence">
                <p class="cal-recurrence__label">{{ i18n.calendarUi().recurrenceLabel }}</p>
                <button
                  type="button"
                  class="cal-recurrence-trigger"
                  (click)="openRecurrenceModal()"
                >
                  <span class="cal-recurrence-trigger__text">{{ recurrenceSummary() }}</span>
                  <span class="cal-recurrence-trigger__chevron" aria-hidden="true">\u203A</span>
                </button>
              </div>

              <app-select
                name="status"
                [(ngModel)]="form.status"
                [options]="lessonStatusSelectOptions()"
                menuPlacement="below"
                mobileBackdropSheet
              />

              <div class="field">
                <label for="lesson-notes-edit">{{ i18n.calendarUi().notesPlaceholder }}</label>
                <textarea
                  id="lesson-notes-edit"
                  name="notes"
                  rows="3"
                  [placeholder]="i18n.calendarUi().notesPlaceholder"
                  [(ngModel)]="form.notes"
                ></textarea>
              </div>
            </div>

            @if (saveLessonError) {
              <p class="cal-form-error">{{ saveLessonError }}</p>
            }

            <div class="cal-form-actions cal-form-actions--wrap">
              <button
                type="button"
                class="cal-btn-delete"
                [disabled]="savingLesson() || deletingLesson()"
                (click)="deleteLesson()"
              >
                {{
                  deletingLesson()
                    ? i18n.calendarUi().deletingLesson
                    : i18n.calendarUi().deleteLesson
                }}
              </button>
              <button type="button" class="btn-link cancel" (click)="closeLessonForm()">
                {{ i18n.studentsUi().cancel }}
              </button>
              <button
                type="submit"
                class="btn-primary"
                [disabled]="savingLesson() || deletingLesson()"
              >
                {{ savingLesson() ? i18n.studentsUi().saving : i18n.studentsUi().save }}
              </button>
            </div>
          } @else if (lessonFormStep() === 1) {
            <div class="cal-form-fields">
              <app-select
                name="student_id"
                [(ngModel)]="form.student_id"
                [options]="studentSelectOptions()"
                [placeholder]="i18n.calendarUi().studentPlaceholder"
                [emptyMessage]="i18n.calendarUi().noStudentsForLesson"
                menuPlacement="below"
              />

              @if (selectedStudentForForm(); as picked) {
                <p class="cal-form-preview cal-form-preview--snapshot">
                  {{ i18n.calendarUi().snapshotWillFix }}
                  {{
                    picked.rate_per_hour
                      | currency: picked.rate_currency ?? 'EUR' : 'code' : '1.0-0'
                  }}/\u0447
                </p>
              }

              <div class="field field--datetime">
                <label for="scheduledAtLocalNew">{{ i18n.calendarUi().scheduledAtLabel }}</label>
                <input
                  id="scheduledAtLocalNew"
                  class="app-input app-input--datetime"
                  type="datetime-local"
                  name="scheduledAtLocalNew"
                  [ngModel]="scheduledAtLocal()"
                  (ngModelChange)="onScheduledAtLocalChange($event)"
                />
              </div>

              @if (getSchedulePreviewText(); as preview) {
                <p class="cal-form-preview">{{ preview }}</p>
              }

              <div class="cal-chips">
                @for (presetMinutes of durationPresets; track presetMinutes) {
                  <button
                    type="button"
                    class="cal-chip"
                    [class.cal-chip--active]="
                      durationChipMode() === 'preset' && duration() === presetMinutes
                    "
                    (click)="selectDurationPreset(presetMinutes)"
                  >
                    {{ formatDurationPresetLabel(presetMinutes) }}
                  </button>
                }
              </div>

              <div class="cal-recurrence">
                <p class="cal-recurrence__label">{{ i18n.calendarUi().recurrenceLabel }}</p>
                <button
                  type="button"
                  class="cal-recurrence-trigger"
                  (click)="openRecurrenceModal()"
                >
                  <span class="cal-recurrence-trigger__text">{{ recurrenceSummary() }}</span>
                  <span class="cal-recurrence-trigger__chevron" aria-hidden="true">\u203A</span>
                </button>
              </div>

              <app-select
                name="status"
                [(ngModel)]="form.status"
                [options]="lessonStatusSelectOptions()"
                menuPlacement="below"
                mobileBackdropSheet
              />
            </div>

            @if (saveLessonError) {
              <p class="cal-form-error">{{ saveLessonError }}</p>
            }

            <div class="cal-form-actions cal-form-actions--wrap">
              <button type="button" class="btn-link secondary" (click)="goToNotesStep()">
                {{ i18n.calendarUi().goToNotes }}
              </button>

              <div
                class="cal-form-actions__right"
                style="display: flex; gap: 0.5rem; align-items: center"
              >
                <button type="button" class="btn-link cancel" (click)="closeLessonForm()">
                  {{ i18n.studentsUi().cancel }}
                </button>
                <button
                  type="button"
                  class="btn-primary"
                  [disabled]="savingLesson()"
                  (click)="saveLesson()"
                >
                  {{ savingLesson() ? i18n.studentsUi().saving : i18n.studentsUi().save }}
                </button>
              </div>
            </div>
          } @else {
            <div class="field">
              <label for="lesson-notes-new">{{ i18n.calendarUi().notesNewPlaceholder }}</label>
              <textarea
                id="lesson-notes-new"
                name="notesNew"
                rows="4"
                [placeholder]="i18n.calendarUi().notesNewPlaceholder"
                [(ngModel)]="form.notes"
              ></textarea>
            </div>

            @if (saveLessonError) {
              <p class="cal-form-error">{{ saveLessonError }}</p>
            }

            <div class="cal-form-actions">
              <button type="button" class="btn-link cancel" (click)="backToMainStep()">
                {{ i18n.calendarUi().back }}
              </button>
              <button type="submit" class="btn-primary" [disabled]="savingLesson()">
                {{ savingLesson() ? i18n.studentsUi().saving : i18n.studentsUi().save }}
              </button>
            </div>
          }
        </form>
      </div>
    </div>
  </div>
}

<app-dialog
  [open]="!!dragMoveConfirm()"
  [title]="i18n.calendarUi().moveLessonTitle"
  [cancelLabel]="i18n.studentsUi().cancel"
  [cancelDanger]="true"
  [confirmLabel]="i18n.calendarUi().moveLessonConfirm"
  (cancel)="cancelDragMove()"
  (confirm)="confirmDragMove()"
>
  <p>
    {{ i18n.calendarUi().moveLessonBodyBefore }}
    <strong>{{ dragMoveConfirmStudentName() }}</strong>
    {{ i18n.calendarUi().moveLessonBodyAfter }}
    <strong>{{ dragMoveConfirmTimeLabel() }}</strong
    >.
  </p>
</app-dialog>

<app-dialog
  [open]="!!billingConfirm()"
  stackOnTop
  [closeOnOverlay]="false"
  [title]="i18n.calendarUi().billingTitle"
  [cancelLabel]="i18n.studentsUi().cancel"
  [secondaryLabel]="i18n.calendarUi().billingKeep"
  [confirmLabel]="i18n.calendarUi().billingDeduct"
  (cancel)="cancelBillingConfirm()"
  (secondary)="confirmBillingKeep()"
  (confirm)="confirmBillingDeduct()"
>
  <p>
    {{ i18n.calendarUi().billingBodyBefore }}
    <strong>{{ billingConfirmStudentName() }}</strong
    >{{ i18n.calendarUi().billingBodyMiddle }}
  </p>
  <p class="cal-billing-balance-hint">
    {{ i18n.calendarUi().billingBodyAfterDeduct }}
    <strong>{{ billingConfirmBalanceAfterDeduct() }}</strong>
    {{ i18n.studentsUi().lessonsShort }}
  </p>
</app-dialog>

<app-dialog
  [open]="!!scheduleConflictMessage()"
  variant="error"
  iconSrc="/assets/icons/icon-warning.svg"
  [title]="i18n.calendarUi().timeBusyTitle"
  [dismissLabel]="i18n.calendarUi().ok"
  (cancel)="closeScheduleConflict()"
  (confirm)="closeScheduleConflict()"
>
  <p>{{ scheduleConflictMessage() }}</p>
</app-dialog>

@if (recurrenceModalOpen()) {
  <div
    class="modal-overlay modal-overlay--sheet modal-overlay--stack-top"
    animate.enter="modal-overlay-out 0.24s ease-out reverse"
    animate.leave="modal-overlay-out 0.2s ease-in"
    role="presentation"
  >
    @if (isBottomNavLayout()) {
      <div
        class="modal modal-sheet modal--recurrence"
        animate.enter="modal-sheet-out-mobile 0.32s cubic-bezier(0.32, 0.72, 0, 1) reverse"
        animate.leave="modal-sheet-out-mobile 0.25s cubic-bezier(0.32, 0.72, 0, 1)"
        role="dialog"
        aria-modal="true"
        (click)="$event.stopPropagation()"
      >
        <ng-container *ngTemplateOutlet="recurrenceFormTemplate"></ng-container>
      </div>
    } @else {
      <div
        class="modal modal-sheet modal--recurrence"
        animate.enter="modal-sheet-out-desktop 0.28s cubic-bezier(0.22, 1, 0.36, 1) reverse"
        animate.leave="modal-sheet-out-desktop 0.22s cubic-bezier(0.22, 1, 0.36, 1)"
        role="dialog"
        aria-modal="true"
        (click)="$event.stopPropagation()"
      >
        <ng-container *ngTemplateOutlet="recurrenceFormTemplate"></ng-container>
      </div>
    }
  </div>
}

<ng-template #recurrenceFormTemplate>
  <div class="modal-header">
    <h2>{{ i18n.calendarUi().recurrenceModalTitle }}</h2>
    <button
      type="button"
      class="modal-close"
      (click)="closeRecurrenceModal()"
      [attr.aria-label]="i18n.studentsUi().close"
    >
      <img src="/assets/icons/icon-close.svg" width="24" height="24" alt="" />
    </button>
  </div>

  <div class="modal-sheet__scroll">
    <div class="modal-body cal-recurrence-modal">
      <app-select
        name="recurrencePreset"
        [ngModel]="recurrenceDraft().preset"
        (ngModelChange)="onRecurrencePresetChange($event)"
        [options]="recurrencePresetSelectOptions()"
        menuPlacement="below"
        mobileBackdropSheet
      />

      @if (recurrenceDraft().preset === 'custom') {
        <app-select
          name="recurrenceCustomFreq"
          [ngModel]="recurrenceDraft().customFreq"
          (ngModelChange)="onRecurrenceCustomFreqChange($event)"
          [options]="recurrenceCustomFreqSelectOptions()"
          menuPlacement="below"
          mobileBackdropSheet
        />
      }

      @if (recurrenceDraft().preset !== 'none') {
        @if (
          recurrenceDraft().preset === 'monthly' ||
          (recurrenceDraft().preset === 'custom' && recurrenceDraft().customFreq === 'monthly')
        ) {
          <p class="cal-recurrence__hint">{{ recurrenceDraftMonthlyHint() }}</p>
        }

        @if (recurrenceDraftShowsInterval()) {
          <div class="cal-recurrence-interval">
            <label class="cal-recurrence-interval__label" for="recurrenceInterval">
              {{ i18n.calendarUi().recurrenceEveryLabel }}
            </label>
            <input
              id="recurrenceInterval"
              class="app-input cal-recurrence-interval__input"
              type="number"
              min="1"
              max="99"
              name="recurrenceInterval"
              [ngModel]="recurrenceDraft().interval"
              (ngModelChange)="onRecurrenceIntervalChange($event)"
            />
            <span class="cal-recurrence-interval__unit">
              @if (recurrenceDraftIntervalUnit() === 'days') {
                {{ i18n.calendarUi().recurrenceUnitDays }}
              } @else if (recurrenceDraftIntervalUnit() === 'weeks') {
                {{ i18n.calendarUi().recurrenceUnitWeeks }}
              } @else {
                {{ i18n.calendarUi().recurrenceUnitMonths }}
              }
            </span>
          </div>
        }

        @if (recurrenceDraftShowsWeekdays()) {
          <div
            class="cal-recurrence__days"
            role="group"
            [attr.aria-label]="i18n.calendarUi().recurrenceWeekdaysLabel"
          >
            @for (day of recurrenceDayOptions(); track day.code) {
              <button
                type="button"
                class="cal-recurrence-day"
                [class.cal-recurrence-day--active]="isRecurrenceDraftDayActive(day.code)"
                (click)="toggleRecurrenceDraftDay(day.code)"
              >
                {{ day.label }}
              </button>
            }
          </div>
        }

        <p class="cal-recurrence__section">{{ i18n.calendarUi().recurrenceEndSection }}</p>
        <app-select
          name="recurrenceEndMode"
          [ngModel]="recurrenceDraft().endMode"
          (ngModelChange)="onRecurrenceEndModeChange($event)"
          [options]="recurrenceEndModeSelectOptions()"
          menuPlacement="below"
          mobileBackdropSheet
        />

        @if (recurrenceDraft().endMode === 'until') {
          <div class="field field--date">
            <label for="recurrenceUntilModal">{{ i18n.calendarUi().recurrenceUntilLabel }}</label>
            <input
              id="recurrenceUntilModal"
              class="app-input"
              type="date"
              name="recurrenceUntilModal"
              [ngModel]="recurrenceDraft().untilDate"
              (ngModelChange)="onRecurrenceUntilChange($event)"
            />
          </div>
        }

        @if (recurrenceDraft().endMode === 'count') {
          <div class="cal-recurrence-interval">
            <label class="cal-recurrence-interval__label" for="recurrenceCount">
              {{ i18n.calendarUi().recurrenceCountLabel }}
            </label>
            <input
              id="recurrenceCount"
              class="app-input cal-recurrence-interval__input"
              type="number"
              min="1"
              max="999"
              name="recurrenceCount"
              [ngModel]="recurrenceDraft().count"
              (ngModelChange)="onRecurrenceCountChange($event)"
            />
            <span class="cal-recurrence-interval__unit">
              {{ i18n.calendarUi().recurrenceUnitOccurrences }}
            </span>
          </div>
        }
      }
    </div>
  </div>

  <div class="cal-recurrence-modal__actions">
    <button type="button" class="btn-link cancel" (click)="closeRecurrenceModal()">
      {{ i18n.studentsUi().cancel }}
    </button>
    <button type="button" class="btn-primary" (click)="applyRecurrenceModal()">
      {{ i18n.calendarUi().recurrenceApply }}
    </button>
  </div>
</ng-template>

<app-dialog
  [open]="deleteRecurringModalOpen()"
  stackOnTop
  layout="sheet"
  [closeOnOverlay]="false"
  [title]="i18n.calendarUi().deleteRecurringTitle"
  [cancelLabel]="i18n.studentsUi().cancel"
  (cancel)="closeDeleteRecurringModal()"
>
  <div class="cal-recurrence-delete">
    <button
      type="button"
      class="btn-secondary cal-recurrence-delete__btn"
      [disabled]="deletingLesson()"
      (click)="confirmDeleteRecurringOccurrence()"
    >
      {{ i18n.calendarUi().deleteRecurringOccurrence }}
    </button>
    <button
      type="button"
      class="cal-btn-delete cal-recurrence-delete__btn"
      [disabled]="deletingLesson()"
      (click)="confirmDeleteRecurringSeries()"
    >
      {{ i18n.calendarUi().deleteRecurringSeries }}
    </button>
  </div>
</app-dialog>
`, styles: ['@charset "UTF-8";\n\n/* src/app/features/calendar/calendar.component.scss */\n:host {\n  --cal-time-axis-w: 4rem;\n  --cal-grid-height: 780px;\n  --cal-grid-bottom-air: 1rem;\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  flex: 1;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  box-sizing: border-box;\n}\n@media (max-width: 1023px) {\n  :host {\n    --cal-time-axis-w: 2.65rem;\n  }\n}\n.cal-page {\n  position: relative;\n  display: flex;\n  min-height: 0;\n  flex: 1;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n  background: var(--page-bg);\n  box-sizing: border-box;\n}\n.cal-page__inner {\n  display: flex;\n  width: 100%;\n  max-width: 1600px;\n  min-height: 0;\n  flex: 1;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n  box-sizing: border-box;\n  padding: 0.5rem 0.5rem 0;\n}\n@media (min-width: 640px) {\n  .cal-page__inner {\n    padding: 0.75rem 0.75rem 0;\n  }\n}\n@media (min-width: 1024px) {\n  .cal-page__inner {\n    padding: 1rem 1rem 0;\n  }\n}\n.cal-error {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: rgb(220, 38, 38);\n}\n.cal-skeleton {\n  display: flex;\n  min-height: 0;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.5rem;\n  overflow: hidden;\n}\n.cal-skeleton__header {\n  display: flex;\n  flex-shrink: 0;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.cal-skeleton__header-text {\n  display: flex;\n  min-width: 0;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.35rem;\n}\n.cal-skeleton__toolbar {\n  display: flex;\n  flex-shrink: 0;\n  gap: 0.35rem;\n}\n.cal-skeleton__grid-wrap {\n  display: flex;\n  min-height: 0;\n  flex: 1;\n  flex-direction: column;\n  overflow: hidden;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.75rem;\n  background: var(--nav-bg);\n}\n.cal-skeleton__day-headers {\n  display: flex;\n  flex-shrink: 0;\n  border-bottom: 1px solid var(--nav-border);\n}\n.cal-skeleton__corner {\n  width: var(--cal-time-axis-w, 4rem);\n  flex-shrink: 0;\n  border-right: 1px solid var(--nav-border);\n}\n.cal-skeleton__day-row {\n  display: grid;\n  min-width: 0;\n  flex: 1;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  gap: 0.5rem;\n  padding: 0.5rem 0.35rem;\n}\n.cal-skeleton__body {\n  display: flex;\n  min-height: 0;\n  flex: 1;\n  overflow: hidden;\n}\n.cal-skeleton__axis {\n  display: flex;\n  width: var(--cal-time-axis-w, 4rem);\n  flex-shrink: 0;\n  flex-direction: column;\n  gap: 1.125rem;\n  padding: 0.5rem 0.25rem;\n  border-right: 1px solid var(--nav-border);\n}\n.cal-skeleton__columns {\n  display: grid;\n  min-width: 0;\n  flex: 1;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n}\n.cal-skeleton__column {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n  padding: 0.35rem 0.25rem;\n  border-right: 1px solid var(--nav-border);\n}\n.cal-skeleton__column:last-child {\n  border-right: none;\n}\n.cal-skeleton__hour {\n  height: 2.75rem;\n  border-radius: 0.35rem;\n}\n.cal-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 55;\n  background: rgba(0, 0, 0, 0.3);\n}\n.cal-modes-drawer {\n  position: fixed;\n  inset-block: 0;\n  left: 0;\n  z-index: 60;\n  display: flex;\n  width: min(17.5rem, 82vw);\n  flex-direction: column;\n  border-right: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n  box-shadow: 8px 0 32px rgba(15, 23, 42, 0.12);\n  transform: translateX(-100%);\n  transition: transform 0.22s ease;\n}\n.cal-modes-drawer--open {\n  transform: translateX(0);\n}\n.cal-modes-drawer__head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n  border-bottom: 1px solid var(--nav-border);\n  padding: 1rem 0.875rem;\n}\n.cal-modes-drawer__title {\n  margin: 0;\n  font-size: 1rem;\n  font-weight: 700;\n  color: var(--text-primary);\n}\n.cal-modes-drawer__close {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.25rem;\n  height: 2.25rem;\n  border: none;\n  border-radius: 0.5rem;\n  background: transparent;\n  cursor: pointer;\n}\n.cal-modes-drawer__close:hover {\n  background: var(--nav-hover);\n}\n.cal-modes-drawer__nav {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n  padding: 0.75rem;\n}\n.cal-modes-drawer__item {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  width: 100%;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.625rem;\n  background: var(--page-bg);\n  padding: 0.75rem 0.875rem;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    background-color 0.15s ease,\n    border-color 0.15s ease,\n    color 0.15s ease;\n}\n.cal-modes-drawer__item:hover {\n  border-color: var(--nav-accent);\n}\n.cal-modes-drawer__item--active {\n  border-color: var(--nav-accent);\n  background: var(--nav-active-bg);\n  color: var(--nav-accent);\n}\n.cal-modes-drawer__item-num {\n  display: flex;\n  min-width: 2rem;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.125rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n}\n.cal-modes-drawer__item-label {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n}\n.cal-modes-drawer__item--active .cal-modes-drawer__item-label {\n  color: var(--nav-accent);\n  font-weight: 600;\n}\n.cal-header {\n  margin-bottom: 0.5rem;\n  display: flex;\n  flex-shrink: 0;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n  color: var(--text-primary);\n  box-sizing: border-box;\n}\n.cal-header__start {\n  display: flex;\n  min-width: 0;\n  align-items: center;\n  gap: 0.5rem;\n}\n.cal-header__actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.375rem;\n}\n.cal-header__titles {\n  display: flex;\n  min-width: 0;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.125rem;\n}\n.cal-header__title {\n  margin: 0;\n  font-size: 1.125rem;\n  font-weight: 700;\n  letter-spacing: -0.025em;\n  line-height: 1.2;\n}\n@media (min-width: 640px) {\n  .cal-header__title {\n    font-size: 1.375rem;\n  }\n}\n.cal-header__period {\n  display: flex;\n  min-width: 0;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.35rem 0.5rem;\n  margin: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: 1.25;\n}\n.cal-header__week {\n  flex-shrink: 0;\n  font-size: 0.8125rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  letter-spacing: 0.02em;\n  color: var(--nav-accent);\n}\n@media (min-width: 640px) {\n  .cal-header__week {\n    font-size: 0.875rem;\n  }\n}\n.cal-header__range {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  color: var(--text-primary);\n  text-transform: capitalize;\n}\n.cal-toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.25rem;\n}\n.cal-btn {\n  border-radius: 0.5rem;\n  border: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n  padding: 0.375rem 0.5rem;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.cal-btn:hover {\n  filter: brightness(0.97);\n}\n.cal-btn--burger {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.5rem;\n  height: 2.5rem;\n  padding: 0;\n}\n.cal-btn__icon {\n  display: block;\n  flex-shrink: 0;\n}\n@media (max-width: 1023px) {\n  .cal-btn__label {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n  }\n}\n.cal-btn--students {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.375rem;\n}\n@media (max-width: 1023px) {\n  .cal-btn--students {\n    width: 2.5rem;\n    height: 2.5rem;\n    padding: 0;\n  }\n}\n.cal-btn--active {\n  background: var(--nav-active-bg);\n  border-color: var(--nav-accent);\n  color: var(--nav-accent);\n}\n.cal-btn--today {\n  background: var(--nav-accent);\n  border-color: var(--nav-accent);\n  color: #fff;\n  padding: 0.25rem 0.5rem;\n  min-width: 2.5rem;\n}\n@media (min-width: 1024px) {\n  .cal-btn--today {\n    min-width: auto;\n    padding: 0.375rem 0.75rem;\n  }\n}\n.cal-btn--today:hover {\n  filter: brightness(1.08);\n}\n.cal-btn-today__label {\n  font-size: 0.875rem;\n  font-weight: 600;\n  white-space: nowrap;\n  line-height: 1.2;\n}\n.cal-btn-today__frame {\n  display: inline-flex;\n  min-width: 1.625rem;\n  height: 1.625rem;\n  align-items: center;\n  justify-content: center;\n  border: 2px solid #fff;\n  border-radius: 0.375rem;\n  font-size: 0.875rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  line-height: 1;\n}\n.cal-toolbar__mode-select {\n  width: min(9.5rem, 38vw);\n  min-width: 6.5rem;\n  flex-shrink: 0;\n}\n.cal-fab {\n  position: fixed;\n  right: 1rem;\n  bottom: 1rem;\n  z-index: 50;\n  display: flex;\n  width: 3.5rem;\n  height: 3.5rem;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  border-radius: 9999px;\n  background: var(--nav-accent);\n  color: #fff;\n  cursor: pointer;\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.22);\n  transition:\n    transform 0.15s ease,\n    box-shadow 0.15s ease,\n    filter 0.15s ease;\n}\n.cal-fab:hover {\n  filter: brightness(1.05);\n  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.28);\n}\n.cal-fab:active {\n  transform: scale(0.96);\n}\n@media (max-width: 768px), (max-height: 440px) {\n  .cal-fab {\n    right: 0.875rem;\n    bottom: calc(56px + 0.875rem + env(safe-area-inset-bottom, 0px));\n  }\n}\n.cal-layout {\n  display: flex;\n  min-height: 0;\n  flex: 1 1 0;\n  flex-direction: column;\n  gap: 0.5rem;\n  overflow: hidden;\n  box-sizing: border-box;\n}\n.cal-grid-section {\n  display: flex;\n  min-height: 0;\n  min-width: 0;\n  flex: 1 1 0;\n  flex-direction: column;\n  overflow: hidden;\n  border-radius: 0.75rem;\n  border: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n  touch-action: pan-y;\n  box-sizing: border-box;\n}\n.cal-grid-section:not(.cal-grid-section--month) {\n  max-height: 100%;\n}\n.cal-period-shell {\n  display: flex;\n  min-height: 0;\n  flex: 1 1 0;\n  flex-direction: column;\n  overflow: hidden;\n}\n.cal-period-shell--exit-next .cal-period-view,\n.cal-period-shell--exit-prev .cal-period-view,\n.cal-period-shell--exit-fade .cal-period-view {\n  pointer-events: none;\n  transition: opacity 0.2s ease, transform 0.2s ease;\n}\n.cal-period-shell--exit-next .cal-period-view {\n  opacity: 0;\n  transform: translateX(-1.25rem);\n}\n.cal-period-shell--exit-prev .cal-period-view {\n  opacity: 0;\n  transform: translateX(1.25rem);\n}\n.cal-period-shell--exit-fade .cal-period-view {\n  opacity: 0;\n  transform: scale(0.992);\n}\n.cal-period-view {\n  display: flex;\n  min-height: 0;\n  flex: 1 1 0;\n  flex-direction: column;\n  opacity: 1;\n  transform: translateX(0);\n  transition: opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1), transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);\n}\n@starting-style {\n  .cal-period-view {\n    opacity: 0;\n    transform: translateX(1.25rem);\n  }\n}\n@starting-style {\n  .cal-period-view--enter-prev {\n    transform: translateX(-1.25rem);\n  }\n}\n.cal-header__week,\n.cal-header__range {\n  transition: opacity 0.22s ease;\n}\n@media (prefers-reduced-motion: reduce) {\n  .cal-period-shell--exit-next .cal-period-view,\n  .cal-period-shell--exit-prev .cal-period-view,\n  .cal-period-shell--exit-fade .cal-period-view,\n  .cal-period-view {\n    transition: none !important;\n    transform: none !important;\n    opacity: 1 !important;\n  }\n}\n.cal-month {\n  display: flex;\n  height: 100%;\n  min-height: 0;\n  flex: 1;\n  flex-direction: column;\n  overflow: hidden;\n}\n.cal-month__title {\n  flex-shrink: 0;\n  margin: 0;\n  padding: 0.625rem 0.875rem;\n  border-bottom: 1px solid var(--nav-border);\n  font-size: 1.0625rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  text-transform: capitalize;\n}\n@media (max-width: 1023px) {\n  .cal-month__title {\n    display: none;\n  }\n}\n.cal-month__scroll {\n  position: relative;\n  flex: 1 1 0;\n  min-height: 0;\n  overflow: hidden;\n}\n.cal-month__frame {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  flex-direction: column;\n  overflow-x: hidden;\n  overflow-y: auto;\n  scroll-behavior: smooth;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  touch-action: pan-y;\n  padding-bottom: max(var(--cal-grid-bottom-air), env(safe-area-inset-bottom, 0px));\n  box-sizing: border-box;\n}\n.cal-month__weekdays {\n  display: grid;\n  flex-shrink: 0;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  border-bottom: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n}\n.cal-month__weekday {\n  padding: 0.4rem 0.25rem;\n  text-align: center;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  letter-spacing: 0.02em;\n  color: var(--text-secondary);\n  border-right: 1px solid var(--nav-border);\n}\n.cal-month__weekday:nth-child(7n) {\n  border-right: none;\n}\n.cal-month__grid {\n  display: grid;\n  height: 100%;\n  min-height: 0;\n  flex: 1;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  grid-template-rows: repeat(var(--cal-month-weeks, 6), minmax(0, 1fr));\n  gap: 0;\n}\n.cal-month__cell {\n  position: relative;\n  display: flex;\n  min-width: 0;\n  min-height: 0;\n  height: 100%;\n  flex-direction: column;\n  align-items: stretch;\n  justify-content: flex-start;\n  border: none;\n  border-right: 1px solid var(--nav-border);\n  border-bottom: 1px solid var(--nav-border);\n  border-radius: 0;\n  background: var(--nav-bg);\n  padding: 0.2rem 0.35rem 0.25rem;\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 0.12s ease;\n}\n.cal-month__cell:nth-child(7n) {\n  border-right: none;\n}\n.cal-month__cell:nth-last-child(-n+7) {\n  border-bottom: none;\n}\n.cal-month__cell:hover {\n  background: var(--nav-hover);\n}\n.cal-month__cell--outside {\n  background: var(--page-bg);\n}\n.cal-month__cell--outside .cal-month__day-num {\n  color: var(--text-secondary);\n  font-weight: 500;\n}\n.cal-month__cell--today {\n  background: rgba(236, 253, 245, 0.65);\n}\n.cal-month__cell--today .cal-month__day-num {\n  display: inline-flex;\n  width: 1.625rem;\n  height: 1.625rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  background: var(--nav-accent);\n  color: #fff;\n  font-weight: 700;\n}\n.cal-month__cell--has-lessons:not(.cal-month__cell--today) .cal-month__day-num {\n  font-weight: 700;\n}\n.cal-month__day-num {\n  align-self: flex-end;\n  margin-left: auto;\n  font-size: 0.75rem;\n  font-weight: 500;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-primary);\n  line-height: 1.625rem;\n}\n@media (min-width: 640px) {\n  .cal-month__day-num {\n    font-size: 0.8125rem;\n  }\n}\n.cal-month__events {\n  display: flex;\n  min-width: 0;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.125rem;\n  margin-top: 0.15rem;\n  overflow: hidden;\n}\n.cal-month__badge {\n  display: block;\n  height: 1.25rem;\n  max-width: 100%;\n  padding: 0 0.35rem;\n  border-radius: 0.25rem;\n  background: #0369a1;\n  color: #fff;\n  font-size: 0.625rem;\n  font-weight: 600;\n  line-height: 1.25rem;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n@media (min-width: 640px) {\n  .cal-month__badge {\n    height: 1.35rem;\n    font-size: 0.6875rem;\n    line-height: 1.35rem;\n  }\n}\n.cal-month__badge--more {\n  background: rgba(71, 85, 105, 0.88);\n  font-weight: 500;\n}\n.cal-grid-headers {\n  position: relative;\n  z-index: 5;\n  display: flex;\n  flex-shrink: 0;\n  border-bottom: 1px solid var(--nav-border);\n}\n.cal-grid-headers__corner {\n  width: var(--cal-time-axis-w, 4rem);\n  flex-shrink: 0;\n  border-right: 1px solid var(--nav-border);\n}\n.cal-grid-headers__scroll {\n  display: flex;\n  min-width: 0;\n  flex: 1;\n  overflow: hidden;\n  scrollbar-gutter: stable;\n}\n.cal-grid-headers__row {\n  display: grid;\n  width: 100%;\n}\n.cal-day-header {\n  min-width: 0;\n  overflow: hidden;\n  border: none;\n  border-right: 1px solid var(--nav-border);\n  background: transparent;\n  padding: 0.35rem 0.2rem;\n  text-align: center;\n  font-size: 0.625rem;\n  font-weight: 600;\n  color: var(--text-primary);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: pointer;\n  font-family: inherit;\n}\n.cal-day-header:hover {\n  background: rgba(0, 0, 0, 0.04);\n}\n@media (min-width: 640px) {\n  .cal-day-header {\n    padding: 0.5rem 0.25rem;\n    font-size: 0.75rem;\n  }\n}\n@media (min-width: 1024px) {\n  .cal-day-header {\n    font-size: 0.875rem;\n  }\n}\n.cal-day-header--today {\n  background: rgb(236, 253, 245);\n}\n.cal-day-header--off {\n  opacity: 0.55;\n  background: rgba(148, 163, 184, 0.1);\n}\n.cal-day-header:focus-visible {\n  outline: 2px solid var(--nav-accent);\n  outline-offset: -2px;\n}\n.cal-grid-scroll,\n.schedule-grid-scroll {\n  flex: 1;\n  min-height: 0;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  scroll-behavior: smooth;\n  scroll-snap-type: y mandatory;\n  scroll-padding-top: 0.5rem;\n  -webkit-overflow-scrolling: touch;\n  touch-action: pan-y;\n  overscroll-behavior-y: contain;\n  padding-bottom: var(--cal-grid-bottom-air, 1rem);\n  box-sizing: border-box;\n}\n.cal-grid-body {\n  position: relative;\n  display: flex;\n  align-items: flex-start;\n  height: var(--cal-grid-height);\n  min-height: var(--cal-grid-height);\n  max-height: var(--cal-grid-height);\n  box-sizing: border-box;\n}\n.cal-time-axis {\n  position: sticky;\n  left: 0;\n  z-index: 0;\n  isolation: isolate;\n  width: var(--cal-time-axis-w, 4rem);\n  height: var(--cal-grid-height);\n  flex-shrink: 0;\n  border-right: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n}\n.cal-time-axis__end {\n  position: absolute;\n  right: 0.125rem;\n  bottom: 0;\n  transform: translateY(50%);\n  font-size: 9px;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-secondary);\n  line-height: 1.1;\n  pointer-events: none;\n}\n@media (min-width: 640px) {\n  .cal-time-axis__end {\n    right: 0.25rem;\n    font-size: 0.75rem;\n  }\n}\n.cal-time-slot {\n  display: flex;\n  align-items: flex-start;\n  justify-content: flex-end;\n  scroll-snap-align: start;\n  border-bottom: 1px solid var(--nav-border);\n  padding-right: 0.125rem;\n  padding-top: 0.125rem;\n  font-size: 9px;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-secondary);\n  line-height: 1.1;\n}\n@media (min-width: 640px) {\n  .cal-time-slot {\n    padding-right: 0.25rem;\n    font-size: 0.75rem;\n  }\n}\n.cal-days-scroll {\n  display: flex;\n  min-width: 0;\n  min-height: var(--cal-grid-height);\n  flex: 1;\n  flex-shrink: 0;\n  overflow: visible;\n}\n.cal-days-grid {\n  position: relative;\n  display: grid;\n  width: 100%;\n  min-height: var(--cal-grid-height);\n}\n.cal-now-marker {\n  position: absolute;\n  right: 0.125rem;\n  z-index: 22;\n  transform: translateY(-50%);\n  padding: 0.125rem 0.375rem;\n  border-radius: 4px;\n  background: #e53935;\n  color: #fff;\n  font-size: 10px;\n  font-weight: 600;\n  font-variant-numeric: tabular-nums;\n  line-height: 1.2;\n  pointer-events: none;\n  box-shadow: 0 1px 3px rgba(229, 57, 53, 0.45);\n}\n@media (min-width: 640px) {\n  .cal-now-marker {\n    right: 0.25rem;\n    font-size: 0.6875rem;\n  }\n}\n.cal-now-line-week {\n  position: absolute;\n  left: 0;\n  right: 0;\n  z-index: 12;\n  height: 2px;\n  margin-top: -1px;\n  background: #e53935;\n  pointer-events: none;\n  box-shadow: 0 0 0 1px rgba(229, 57, 53, 0.25);\n}\n.cal-day-column {\n  position: relative;\n  min-width: 0;\n  height: var(--cal-grid-height);\n  flex-shrink: 0;\n  overflow: hidden;\n  border-right: 1px solid var(--nav-border);\n}\n.cal-day-column.cdk-drop-list-dragging,\n.cal-day-column.cdk-drop-list-receiving {\n  overflow: visible;\n}\n.cal-day-column--drag-target {\n  background: rgba(14, 165, 233, 0.04);\n}\n.cal-day-column--off {\n  opacity: 0.5;\n  background: rgba(148, 163, 184, 0.12);\n}\n.cal-day-column__off-label {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.5rem;\n  color: var(--text-secondary);\n  font-size: 0.8125rem;\n  font-weight: 600;\n  letter-spacing: 0.02em;\n  opacity: 0.55;\n  pointer-events: none;\n  text-align: center;\n}\n.cal-hour-line {\n  pointer-events: none;\n  scroll-snap-align: start;\n  border-bottom: 1px solid var(--nav-border);\n  border-right: 1px solid var(--nav-border);\n  opacity: 0.4;\n}\n.cal-hour-line:last-child {\n  border-bottom: none;\n}\n.cal-lesson-card {\n  position: absolute;\n  left: 0.25rem;\n  right: 0.25rem;\n  z-index: 10;\n  overflow: hidden;\n  cursor: grab;\n  touch-action: none;\n  user-select: none;\n  -webkit-user-select: none;\n  -webkit-touch-callout: none;\n  border-left-width: 4px;\n  border-left-style: solid;\n  border-left-color: transparent;\n  border-radius: 0.375rem;\n  padding: 0.125rem 0.375rem;\n  font-size: 10px;\n  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);\n}\n@media (min-width: 640px) {\n  .cal-lesson-card {\n    font-size: 0.75rem;\n  }\n}\n.cal-lesson-card--dragging {\n  z-index: 5;\n  cursor: grabbing;\n  opacity: 0.32;\n  pointer-events: none;\n  box-shadow: none;\n  filter: saturate(0.75);\n}\n.cal-lesson-card:active {\n  cursor: grabbing;\n}\n.cal-lesson-card__title {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-weight: 600;\n  line-height: 1.25;\n}\n.cal-lesson-card__meta {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  opacity: 0.85;\n  font-variant-numeric: tabular-nums;\n  line-height: 1.2;\n}\n.cal-lesson-card__details {\n  display: flex;\n  flex-direction: column;\n  gap: 0.0625rem;\n  margin-top: 0.0625rem;\n  line-height: 1.15;\n}\n.cal-lesson-card__detail {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.25rem;\n  overflow: hidden;\n  margin: 0;\n  font-variant-numeric: tabular-nums;\n}\n.cal-lesson-card__detail span:last-child {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  text-align: right;\n  font-weight: 500;\n}\n.cal-lesson-card__lbl {\n  flex-shrink: 0;\n  opacity: 0.65;\n  font-size: 0.85em;\n}\n.cal-lesson-card--scheduled {\n  background: rgb(240, 249, 255);\n  color: rgb(12, 74, 110);\n}\n.cal-lesson-card--completed {\n  background: rgb(236, 253, 245);\n  color: rgb(6, 78, 59);\n}\n.cal-lesson-card--missed {\n  background: rgb(255, 251, 235);\n  color: rgb(146, 64, 14);\n}\n.cal-lesson-card--canceled {\n  background: rgb(254, 242, 242);\n  color: rgb(153, 27, 27);\n  opacity: 0.6;\n  text-decoration: line-through;\n}\n.cal-lesson-card--focus-active {\n  z-index: 20;\n  outline: 2px solid rgb(16, 185, 129);\n  outline-offset: 1px;\n  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);\n}\n.cal-lesson-card--focus-dim {\n  opacity: 0.2;\n  pointer-events: none;\n}\n.cal-lesson-card--last-paid {\n  border: 2px solid rgb(255, 179, 0) !important;\n  background: rgb(255, 248, 225) !important;\n  color: rgb(127, 96, 0) !important;\n  box-shadow: 0 1px 2px rgba(255, 179, 0, 0.2);\n}\n.cal-lesson-card--last-paid.cal-lesson-card--canceled {\n  opacity: 1;\n  text-decoration: none;\n}\n.cal-lesson-card--placeholder {\n  left: 0.25rem;\n  right: 0.25rem;\n  opacity: 0.38;\n  border: 2px dashed rgba(14, 165, 233, 0.65) !important;\n  background: rgba(14, 165, 233, 0.07) !important;\n  box-shadow: none;\n  cursor: grabbing;\n}\n.cal-lesson-card--drag-preview {\n  position: relative;\n  left: auto;\n  right: auto;\n  width: calc(100% - 0.5rem);\n  min-width: 7.5rem;\n  touch-action: none;\n  opacity: 0.94;\n  cursor: grabbing;\n  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.24);\n}\n.cal-drag-preview-badge {\n  position: absolute;\n  top: -0.625rem;\n  left: 50%;\n  z-index: 2;\n  transform: translateX(-50%);\n  padding: 0.125rem 0.5rem;\n  border-radius: 999px;\n  background: rgb(14, 165, 233);\n  color: #fff;\n  font-size: 0.6875rem;\n  font-weight: 600;\n  font-variant-numeric: tabular-nums;\n  line-height: 1.2;\n  white-space: nowrap;\n  pointer-events: none;\n  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.35);\n}\n.lesson-phantom {\n  position: absolute;\n  z-index: 24;\n  left: 0.25rem;\n  right: 0.25rem;\n  min-height: 3rem;\n  border: 2px dashed rgba(59, 130, 246, 0.9);\n  border-radius: 0.375rem;\n  pointer-events: none;\n  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.16);\n}\n.lesson-phantom__time {\n  margin-top: 0.2rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  opacity: 0.95;\n}\n.lesson-phantom.cal-lesson-card--scheduled {\n  background: rgba(240, 249, 255, 0.6);\n  border-color: rgba(14, 165, 233, 0.85);\n}\n.lesson-phantom.cal-lesson-card--completed {\n  background: rgba(236, 253, 245, 0.6);\n  border-color: rgba(16, 185, 129, 0.85);\n}\n.lesson-phantom.cal-lesson-card--missed {\n  background: rgba(255, 251, 235, 0.6);\n  border-color: rgba(245, 158, 11, 0.85);\n}\n.lesson-phantom.cal-lesson-card--canceled {\n  background: rgba(254, 242, 242, 0.6);\n  border-color: rgba(239, 68, 68, 0.85);\n  opacity: 1;\n  text-decoration: none;\n}\n:host-context(.dark) .lesson-phantom {\n  border-color: rgba(96, 165, 250, 0.95);\n  background: rgba(30, 58, 138, 0.3);\n  color: rgb(191, 219, 254);\n  box-shadow: 0 2px 12px rgba(30, 58, 138, 0.4);\n}\n:host-context(html.cal-lesson-dragging) .cal-grid-scroll {\n  touch-action: none;\n  overscroll-behavior: contain;\n  scroll-snap-type: none;\n  scroll-behavior: auto;\n}\n.cal-sidebar {\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  border-radius: 0.75rem;\n  border: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n}\n.cal-sidebar--drawer {\n  position: fixed;\n  inset-block: 0;\n  right: 0;\n  z-index: 58;\n  width: min(24rem, 92vw);\n  min-width: 0;\n  max-width: 24rem;\n  flex: none;\n  transform: translateX(100%);\n  transition: transform 0.22s ease;\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);\n}\n.cal-sidebar--open {\n  transform: translateX(0);\n}\n.cal-sidebar__head {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n  border-bottom: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n  padding: 0.75rem;\n}\n.cal-sidebar__clear {\n  width: 100%;\n  border-radius: 0.5rem;\n  border: 1px solid var(--nav-border);\n  padding: 0.5rem;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  background: transparent;\n  cursor: pointer;\n}\n.cal-sidebar__clear:hover {\n  filter: brightness(0.97);\n}\n.cal-sidebar__search {\n  min-height: 2.25rem;\n}\n.cal-sidebar__color-indicator {\n  flex-shrink: 0;\n  width: 0.625rem;\n  height: 0.625rem;\n  border-radius: 9999px;\n  border: 1px solid rgba(15, 23, 42, 0.12);\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.6);\n}\n.cal-sidebar__list {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  gap: 0.25rem;\n  overflow-y: auto;\n  padding: 0.5rem;\n  min-height: 0;\n}\n.cal-sidebar__empty {\n  padding: 1.25rem 0.75rem;\n  text-align: center;\n  font-size: 0.8125rem;\n  line-height: 1.45;\n  color: var(--text-secondary);\n}\n.cal-sidebar__item-btn {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  align-items: center;\n  gap: 0.75rem;\n  border-radius: 0 0.5rem 0.5rem 0;\n  border: 1px solid transparent;\n  padding: 0.625rem 0.5rem 0.625rem 0.5rem;\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n.cal-sidebar__item-btn:hover {\n  background: rgba(248, 250, 252, 0.8);\n}\n.cal-sidebar__item-btn--active {\n  background: rgb(248, 250, 252);\n  border-left-width: 4px;\n  border-left-style: solid;\n}\n.cal-sidebar__info {\n  min-width: 0;\n  flex: 1;\n}\n.cal-sidebar__name {\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-weight: 500;\n  color: var(--text-primary);\n}\n.cal-sidebar__meta {\n  display: flex;\n  flex-direction: column;\n  gap: 0.125rem;\n}\n.cal-sidebar__balance {\n  font-size: 0.75rem;\n  font-variant-numeric: tabular-nums;\n  font-weight: 600;\n  color: var(--text-secondary);\n}\n.cal-sidebar__balance--last {\n  color: rgb(127, 96, 0);\n}\n.cal-sidebar__last-hint {\n  font-weight: 500;\n}\n.cal-sidebar__rate {\n  font-size: 0.75rem;\n  font-variant-numeric: tabular-nums;\n  color: var(--text-secondary);\n}\n.cal-form-last-paid-warning {\n  margin: 0;\n  border-radius: 0.5rem;\n  border: 2px solid rgb(255, 179, 0);\n  background: rgb(255, 248, 225);\n  padding: 0.625rem 0.75rem;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  line-height: 1.4;\n  color: rgb(127, 96, 0);\n}\n.cal-billing-balance-hint {\n  margin-top: 0.75rem;\n  font-size: 0.875rem;\n  line-height: 1.55;\n  color: var(--text-secondary);\n}\n.cal-billing-balance-hint strong {\n  font-weight: 600;\n  color: var(--nav-accent);\n}\n.cal-billing-actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  margin-top: 1.25rem;\n}\n.cal-billing-actions .btn-cancel {\n  background: transparent;\n  color: #6b7280;\n  border: none;\n  border-radius: 0.5rem;\n  font-weight: 500;\n  padding: 10px 16px;\n  cursor: pointer;\n  transition: color 0.2s;\n  font-size: 14px;\n}\n.cal-billing-actions .btn-cancel:hover {\n  color: #1f2937;\n}\n.cal-billing-actions .btn-keep-balance {\n  background: #f3f4f6;\n  color: #374151;\n  border: none;\n  border-radius: 8px;\n  font-weight: 500;\n  padding: 10px 18px;\n  cursor: pointer;\n  transition: background 0.2s;\n  font-size: 14px;\n}\n.cal-billing-actions .btn-keep-balance:hover {\n  background: #e5e7eb;\n}\n.cal-billing-actions .btn-deduct-lesson {\n  background: #1f2937;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  font-weight: 600;\n  padding: 10px 20px;\n  cursor: pointer;\n  transition: background 0.2s;\n  font-size: 14px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\n}\n.cal-billing-actions .btn-deduct-lesson:hover {\n  background: #111827;\n}\n[data-theme=dark] .cal-billing-actions .btn-cancel {\n  color: var(--text-secondary);\n}\n[data-theme=dark] .cal-billing-actions .btn-cancel:hover {\n  color: var(--text-primary);\n}\n[data-theme=dark] .cal-billing-actions .btn-keep-balance {\n  background: var(--nav-hover);\n  color: var(--text-primary);\n}\n[data-theme=dark] .cal-billing-actions .btn-keep-balance:hover {\n  background: var(--nav-border);\n}\n[data-theme=dark] .cal-billing-actions .btn-deduct-lesson {\n  background: #e8eaed;\n  color: #202124;\n}\n[data-theme=dark] .cal-billing-actions .btn-deduct-lesson:hover {\n  background: #fff;\n}\n@media (min-width: 768px) {\n  :host .modal--lesson {\n    max-width: 28rem;\n  }\n}\n:host .modal-header {\n  position: sticky;\n  top: 0;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n  flex-shrink: 0;\n  padding: 1rem 0.75rem 0.75rem 1rem;\n  background: var(--nav-bg);\n}\n:host .modal-header h2 {\n  flex: 1;\n  min-width: 0;\n  font-size: 1.125rem;\n  line-height: 1.35;\n  font-weight: 500;\n  color: var(--text-primary);\n}\n.modal-close {\n  flex-shrink: 0;\n  width: 2.5rem;\n  height: 2.5rem;\n  margin: 0;\n  padding: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  background: transparent;\n  color: var(--text-secondary);\n  border-radius: 0.5rem;\n  cursor: pointer;\n}\n.modal-close:hover {\n  background: var(--nav-hover);\n  color: var(--text-primary);\n}\n:host .modal-body {\n  flex: 0 1 auto;\n  padding: 0.75rem 1rem calc(1.25rem + env(safe-area-inset-bottom, 0px));\n  overflow: visible;\n}\n.cal-form-error {\n  margin-bottom: 0.75rem;\n  font-size: 0.875rem;\n  color: rgb(220, 38, 38);\n}\n.cal-form-fields {\n  margin-bottom: 1rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  overflow: visible;\n}\n.cal-form-fields .field {\n  margin-bottom: 0;\n}\n.cal-form-fields .field--datetime .app-input--datetime {\n  width: 100%;\n}\n.cal-form-fields app-select {\n  position: relative;\n  z-index: 0;\n}\n.cal-form-preview {\n  font-size: 0.75rem;\n  font-variant-numeric: tabular-nums;\n  color: rgb(100, 116, 139);\n}\n.cal-form-preview--snapshot {\n  font-weight: 500;\n  color: var(--text-primary);\n}\n.cal-form-preview--hint {\n  color: var(--nav-accent);\n}\n.cal-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.cal-chip {\n  border: 0;\n  border-radius: 9999px;\n  padding: 0.5rem 0.875rem;\n  font-size: 0.875rem;\n  font-weight: 500;\n  background: rgb(241, 245, 249);\n  color: rgb(71, 85, 105);\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.cal-chip:hover {\n  background: rgb(5, 150, 105);\n  transition: all 0.15s ease;\n}\n.cal-chip--active {\n  background: rgb(5, 150, 105);\n  color: #fff;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n}\n.cal-recurrence {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.cal-recurrence-trigger {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  width: 100%;\n  padding: 0.625rem 0.75rem;\n  border: 1px solid var(--nav-border);\n  border-radius: 0.5rem;\n  background: var(--nav-bg);\n  color: var(--text-primary);\n  font-size: 0.875rem;\n  text-align: left;\n  cursor: pointer;\n  transition: border-color 0.2s ease;\n}\n.cal-recurrence-trigger:hover {\n  border-color: var(--nav-accent);\n}\n.cal-recurrence-trigger__text {\n  flex: 1;\n  min-width: 0;\n  line-height: 1.35;\n}\n.cal-recurrence-trigger__chevron {\n  flex-shrink: 0;\n  font-size: 1.125rem;\n  color: var(--text-secondary);\n}\n.modal-overlay--stack-top {\n  z-index: var(--z-app-dialog-top);\n}\n@media (min-width: 768px) {\n  .modal--recurrence {\n    max-width: 24rem;\n  }\n}\n.cal-recurrence-modal__actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  flex-shrink: 0;\n  padding: 0.75rem 1rem calc(1rem + env(safe-area-inset-bottom, 0px));\n  border-top: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n}\n.cal-recurrence-modal__actions .btn-link.cancel {\n  color: var(--text-secondary);\n}\n.cal-recurrence-modal {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  overflow: visible;\n}\n.cal-recurrence-modal app-select {\n  position: relative;\n  z-index: 0;\n}\n.cal-recurrence__section {\n  margin: 0.25rem 0 0;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.cal-recurrence-interval {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  flex-wrap: wrap;\n}\n.cal-recurrence-interval__label {\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n}\n.cal-recurrence-interval__input {\n  width: 4.5rem;\n  min-width: 0;\n}\n.cal-recurrence-interval__unit {\n  font-size: 0.8125rem;\n  color: var(--text-secondary);\n}\n.cal-recurrence__label {\n  margin: 0;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.cal-recurrence__hint {\n  margin: 0;\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n  line-height: 1.35;\n}\n.cal-recurrence__days {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.cal-recurrence-day {\n  width: 2.25rem;\n  height: 2.25rem;\n  padding: 0;\n  border: 1px solid var(--nav-border);\n  border-radius: 50%;\n  background: var(--nav-bg);\n  color: var(--text-secondary);\n  font-size: 0.6875rem;\n  font-weight: 700;\n  line-height: 1;\n  cursor: pointer;\n  transition:\n    background-color 0.2s ease,\n    border-color 0.2s ease,\n    color 0.2s ease,\n    transform 0.15s ease,\n    box-shadow 0.2s ease;\n}\n.cal-recurrence-day:hover {\n  border-color: var(--nav-accent);\n  color: var(--nav-accent);\n}\n.cal-recurrence-day--active {\n  border-color: var(--nav-accent);\n  background: var(--nav-accent);\n  color: #fff;\n  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.35);\n  transform: scale(1.06);\n}\n.cal-recurrence-day:focus-visible {\n  outline: 2px solid var(--nav-accent);\n  outline-offset: 2px;\n}\n.cal-recurrence-delete {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.cal-recurrence-delete__btn {\n  width: 100%;\n  justify-content: center;\n}\n.cal-form-actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.cal-form-actions--wrap {\n  flex-wrap: wrap;\n}\n.cal-btn-delete {\n  margin-right: auto;\n  border: 0;\n  background: transparent;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: rgb(168, 51, 51);\n  cursor: pointer;\n}\n.cal-btn-delete:active {\n  color: rgb(168, 51, 51);\n}\n.cal-btn-delete:hover {\n  background: rgb(254, 242, 242);\n}\n.cal-btn-delete:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=calendar.component.css.map */\n'] }]
  }], () => [], { gridScrollRef: [{ type: ViewChild, args: ["gridScroll", { isSignal: true }] }], scrollContainerRef: [{ type: ViewChild, args: ["scrollContainer", { isSignal: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CalendarComponent, { className: "CalendarComponent", filePath: "app/features/calendar/calendar.component.ts", lineNumber: 108 });
})();
export {
  CalendarComponent
};
//# sourceMappingURL=chunk-GRT47Z53.js.map
