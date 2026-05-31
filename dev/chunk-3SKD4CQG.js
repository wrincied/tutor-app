import {
  apiUrl
} from "./chunk-ZSKR65RV.js";
import {
  HttpClient,
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-27NINFBT.js";

// src/app/core/services/student.service.ts
var API = apiUrl("/students");
var StudentService = class _StudentService {
  http = inject(HttpClient);
  getAll() {
    return this.http.get(API);
  }
  getOne(id) {
    return this.http.get(`${API}/${id}`);
  }
  create(data) {
    return this.http.post(API, data);
  }
  update(id, data) {
    return this.http.put(`${API}/${id}`, data);
  }
  remove(id) {
    return this.http.delete(`${API}/${id}`);
  }
  topup(id, lessons) {
    return this.http.post(`${API}/${id}/topup`, { lessons });
  }
  static \u0275fac = function StudentService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StudentService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _StudentService, factory: _StudentService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StudentService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/utils/pastel-color.ts
function generatePastelColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 45%, 88%)`;
}
var DEFAULT_STUDENT_BORDER_COLOR = "rgb(14 165 233)";
function colorToHexForPicker(color) {
  if (!color) {
    return "#bae6fd";
  }
  const trimmed = color.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const r = trimmed[1];
    const g = trimmed[2];
    const b = trimmed[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  const hslMatch = trimmed.match(/hsl\(\s*([\d.]+)\s*(?:,|\s)\s*([\d.]+)%\s*(?:,|\s)\s*([\d.]+)%\s*\)/i);
  if (hslMatch) {
    return hslToHex(Number(hslMatch[1]), Number(hslMatch[2]), Number(hslMatch[3]));
  }
  const rgbMatch = trimmed.match(/rgb\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/i);
  if (rgbMatch) {
    return rgbToHex(Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3]));
  }
  return "#bae6fd";
}
function hexToStoredColor(hex) {
  const rgb = parseHexRgb(hex);
  if (!rgb) {
    return generatePastelColor();
  }
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}
function hslToHex(h, s, l) {
  const sat = s / 100;
  const lit = l / 100;
  const chroma = sat * Math.min(lit, 1 - lit);
  const channel = (n) => {
    const k = (n + h / 30) % 12;
    const v = lit - chroma * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * v).toString(16).padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}
function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")}`;
}
function parseHexRgb(hex) {
  const normalized = colorToHexForPicker(hex);
  const m = normalized.match(/^#([0-9a-fA-F]{6})$/);
  if (!m) {
    return null;
  }
  const n = Number.parseInt(m[1], 16);
  return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
}
function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      default:
        h = ((rn - gn) / d + 4) / 6;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export {
  StudentService,
  generatePastelColor,
  DEFAULT_STUDENT_BORDER_COLOR,
  colorToHexForPicker,
  hexToStoredColor
};
//# sourceMappingURL=chunk-3SKD4CQG.js.map
