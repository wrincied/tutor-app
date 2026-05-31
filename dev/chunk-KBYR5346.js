import {
  AuthService
} from "./chunk-LS4RMPGH.js";
import {
  apiUrl
} from "./chunk-EWPFDTJG.js";
import {
  HttpClient,
  HttpErrorResponse,
  Injectable,
  catchError,
  inject,
  setClassMetadata,
  switchMap,
  throwError,
  ɵɵdefineInjectable
} from "./chunk-27NINFBT.js";

// src/app/core/services/user.service.ts
var API = apiUrl("");
var UserService = class _UserService {
  http = inject(HttpClient);
  auth = inject(AuthService);
  getProfile() {
    return this.http.get(`${API}/auth/me`);
  }
  /** GET /me или bootstrap, если документа в Firestore ещё нет. */
  ensureProfile() {
    return this.getProfile().pipe(catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 404) {
        return this.auth.bootstrapProfile();
      }
      return throwError(() => err);
    }));
  }
  updateProfile(payload) {
    return this.http.put(`${API}/auth/me`, payload);
  }
  updateMarketingCookies(accepted) {
    return this.http.patch(`${API}/auth/me/marketing-cookies`, { accepted });
  }
  completeOnboarding(payload) {
    return this.ensureProfile().pipe(switchMap(() => this.http.post(`${API}/auth/onboarding`, payload)));
  }
  declineOnboarding() {
    return this.http.post(`${API}/auth/onboarding/decline`, {});
  }
  static \u0275fac = function UserService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UserService, factory: _UserService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  UserService
};
//# sourceMappingURL=chunk-KBYR5346.js.map
