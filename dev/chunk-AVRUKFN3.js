import {
  UserService
} from "./chunk-ODVTALVQ.js";
import {
  AuthService
} from "./chunk-VVVNTCL2.js";
import "./chunk-ZSKR65RV.js";
import "./chunk-HPUTEZXI.js";
import {
  Component,
  I18nService,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵnextContext,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-27NINFBT.js";

// src/app/features/auth/verify-email-notice.component.ts
function VerifyEmailNoticeComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.email);
  }
}
function VerifyEmailNoticeComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.message());
  }
}
function VerifyEmailNoticeComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
var VerifyEmailNoticeComponent = class _VerifyEmailNoticeComponent {
  auth = inject(AuthService);
  userSvc = inject(UserService);
  i18n = inject(I18nService);
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  message = signal("", ...ngDevMode ? [{ debugName: "message" }] : (
    /* istanbul ignore next */
    []
  ));
  error = signal("", ...ngDevMode ? [{ debugName: "error" }] : (
    /* istanbul ignore next */
    []
  ));
  email = this.auth.firebaseUser()?.email ?? "";
  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      return;
    }
    this.userSvc.ensureProfile().subscribe({
      error: () => {
        this.error.set(this.i18n.authUi().profileSyncError);
      }
    });
  }
  resend() {
    this.loading.set(true);
    this.error.set("");
    this.message.set("");
    this.auth.resendVerificationEmail().subscribe({
      next: () => {
        this.message.set(this.i18n.authUi().checkEmailResent);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.i18n.authUi().checkEmailResendError);
        this.loading.set(false);
      }
    });
  }
  checkVerified() {
    this.loading.set(true);
    this.error.set("");
    this.auth.reloadUser().subscribe({
      next: (user) => {
        this.loading.set(false);
        if (user?.emailVerified) {
          this.userSvc.ensureProfile().subscribe({
            next: (profile) => {
              if (user) {
                this.auth.navigateAfterAuth(profile, user);
              }
            },
            error: () => {
              this.error.set(this.i18n.authUi().profileSyncError);
            }
          });
        } else {
          this.error.set(this.i18n.authUi().verifyNotYet);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set(this.i18n.authUi().verifyFailed);
      }
    });
  }
  signOut() {
    this.auth.logout().subscribe();
  }
  static \u0275fac = function VerifyEmailNoticeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VerifyEmailNoticeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VerifyEmailNoticeComponent, selectors: [["app-verify-email-notice"]], decls: 20, vars: 11, consts: [[1, "auth-page"], [1, "auth-logo"], [1, "auth-card"], [1, "subtitle"], [1, "auth-email-display"], [1, "auth-hint"], [1, "auth-success"], [1, "auth-error"], [1, "auth-actions", "auth-actions--stack"], ["type", "button", 1, "btn-primary", 3, "click", "disabled"], ["type", "button", 1, "btn-secondary", 3, "click", "disabled"], ["type", "button", 1, "btn-link", "danger", 3, "click"]], template: function VerifyEmailNoticeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "span", 1);
      \u0275\u0275text(2, "Simple4U");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "div", 2)(4, "h1");
      \u0275\u0275text(5);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(6, "p", 3);
      \u0275\u0275text(7);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(8, VerifyEmailNoticeComponent_Conditional_8_Template, 2, 1, "p", 4);
      \u0275\u0275domElementStart(9, "p", 5);
      \u0275\u0275text(10);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(11, VerifyEmailNoticeComponent_Conditional_11_Template, 2, 1, "p", 6);
      \u0275\u0275conditionalCreate(12, VerifyEmailNoticeComponent_Conditional_12_Template, 2, 1, "div", 7);
      \u0275\u0275domElementStart(13, "div", 8)(14, "button", 9);
      \u0275\u0275domListener("click", function VerifyEmailNoticeComponent_Template_button_click_14_listener() {
        return ctx.resend();
      });
      \u0275\u0275text(15);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(16, "button", 10);
      \u0275\u0275domListener("click", function VerifyEmailNoticeComponent_Template_button_click_16_listener() {
        return ctx.checkVerified();
      });
      \u0275\u0275text(17);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(18, "button", 11);
      \u0275\u0275domListener("click", function VerifyEmailNoticeComponent_Template_button_click_18_listener() {
        return ctx.signOut();
      });
      \u0275\u0275text(19);
      \u0275\u0275domElementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().verifyNoticeTitle);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().verifyNoticeSubtitle);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.email ? 8 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.i18n.authUi().checkEmailPurgeHint);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.message() ? 11 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 12 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275domProperty("disabled", ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.loading() ? ctx.i18n.authUi().checkEmailSending : ctx.i18n.authUi().resendVerification, " ");
      \u0275\u0275advance();
      \u0275\u0275domProperty("disabled", ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.i18n.authUi().verifyRefreshStatus, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.i18n.authUi().signOut, " ");
    }
  }, styles: ['\n.auth-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background-color: #f8f9fa;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-logo[_ngcontent-%COMP%] {\n  font-size: 22px;\n  font-weight: 500;\n  color: #202124;\n  letter-spacing: -0.3px;\n  margin-bottom: 28px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-card[_ngcontent-%COMP%] {\n  background: #fff;\n  border: 1px solid #dadce0;\n  border-radius: 8px;\n  width: 100%;\n  max-width: 396px;\n  padding: 48px 40px 36px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 400;\n  color: #202124;\n  text-align: center;\n  margin-bottom: 8px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-card[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #5f6368;\n  text-align: center;\n  margin-bottom: 28px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-error[_ngcontent-%COMP%] {\n  background: #fce8e6;\n  color: #c5221f;\n  font-size: 13px;\n  border-radius: 4px;\n  padding: 8px 12px;\n  margin-bottom: 16px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-success[_ngcontent-%COMP%] {\n  color: #0f9d58;\n  font-size: 13px;\n  margin-bottom: 12px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-hint[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #5f6368;\n  text-align: center;\n  margin-bottom: 16px;\n  line-height: 1.45;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-hint[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #0f9d58;\n  text-decoration: none;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-hint[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-email-display[_ngcontent-%COMP%] {\n  text-align: center;\n  font-weight: 500;\n  color: #202124;\n  margin-bottom: 12px;\n  word-break: break-all;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-forgot-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  margin-top: -8px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-link-button[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  padding: 0;\n  font-size: 13px;\n  color: #0f9d58;\n  cursor: pointer;\n  text-decoration: underline;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-link-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%] {\n  position: relative;\n}\n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid #dadce0;\n  border-radius: 4px;\n  padding: 13px 12px 8px;\n  font-size: 14px;\n  color: #202124;\n  background: #fff;\n  outline: none;\n  transition: border-color 0.15s, box-shadow 0.15s;\n}\n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  border-color: #0f9d58;\n  box-shadow: 0 0 0 1px #0f9d58;\n}\n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus    + label[_ngcontent-%COMP%], \n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:not(:placeholder-shown)    + label[_ngcontent-%COMP%] {\n  top: 6px;\n  font-size: 11px;\n  color: #5f6368;\n}\n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus    + label[_ngcontent-%COMP%] {\n  color: #0f9d58;\n}\n.auth-page[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 14px;\n  color: #5f6368;\n  pointer-events: none;\n  transition:\n    top 0.15s,\n    font-size 0.15s,\n    color 0.15s;\n  background: #fff;\n  padding: 0 2px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%] {\n  flex-direction: column;\n  gap: 12px;\n  align-items: stretch;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%] {\n  width: 100%;\n  background: #0f9d58;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  padding: 10px 24px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%] {\n  width: 100%;\n  background: #fff;\n  color: #202124;\n  border: 1px solid #dadce0;\n  border-radius: 4px;\n  padding: 10px 24px;\n  font-size: 14px;\n  cursor: pointer;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions--stack[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: #5f6368;\n  font-size: 13px;\n  cursor: pointer;\n  text-decoration: underline;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-dialog-hint[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #5f6368;\n  margin: 0 0 16px;\n  line-height: 1.45;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-dialog-success[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #137333;\n  margin: 0;\n  line-height: 1.45;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-dialog-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-dialog-status[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #5f6368;\n  margin: 12px 0 0;\n  text-align: center;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-error--dialog[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-banner-success[_ngcontent-%COMP%] {\n  background: #e6f4ea;\n  color: #137333;\n  font-size: 13px;\n  border-radius: 4px;\n  padding: 10px 12px;\n  margin-bottom: 16px;\n  text-align: center;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: 8px;\n}\n@media (max-width: 400px) {\n  .auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n    font-size: 13px;\n  }\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #0f9d58;\n  text-decoration: none;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  background: #0f9d58;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  padding: 9px 24px;\n}\n@media (max-width: 400px) {\n  .auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    padding: 10px 18px !important;\n    font-size: 11.5px !important;\n  }\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.15s;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  background: #066535;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page.auth-page--onboarding[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  min-height: 0;\n  justify-content: flex-start;\n  align-items: stretch;\n  padding: 0;\n  overflow: hidden;\n}\n.auth-page.auth-page--onboarding[_ngcontent-%COMP%]   .auth-page__scroll[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.auth-page.auth-page--submitting[_ngcontent-%COMP%]   .auth-page__scroll[_ngcontent-%COMP%] {\n  filter: blur(10px);\n  opacity: 0.35;\n  pointer-events: none;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-page__scroll[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  width: 100%;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 16px 16px 0;\n  -webkit-overflow-scrolling: touch;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-card--onboarding[_ngcontent-%COMP%] {\n  max-width: 480px;\n  margin: 0 auto;\n  padding: 40px 32px 24px;\n  background: #fff;\n  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.14);\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-submit-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 500;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1.5rem;\n  background: rgba(255, 255, 255, 0.55);\n  backdrop-filter: blur(14px) saturate(0.85);\n  -webkit-backdrop-filter: blur(14px) saturate(0.85);\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-submit-overlay__panel[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 1rem;\n  max-width: 20rem;\n  padding: 1.5rem 1.75rem;\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.92);\n  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.18);\n  text-align: center;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-submit-overlay__panel[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.9375rem;\n  font-weight: 500;\n  color: #202124;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-submit-overlay__spinner[_ngcontent-%COMP%] {\n  width: 2.25rem;\n  height: 2.25rem;\n  border: 3px solid #dadce0;\n  border-top-color: #0f9d58;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_onboarding-spin 0.75s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_onboarding-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-legal__link[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin-bottom: 12px;\n  font-size: 13px;\n  font-weight: 500;\n  color: #0f9d58;\n  text-decoration: underline;\n}\n.auth-page[_ngcontent-%COMP%]   .field--readonly[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  background: #f8f9fa;\n  color: #5f6368;\n  cursor: default;\n}\n.auth-page[_ngcontent-%COMP%]   .field.field--select[_ngcontent-%COMP%]   app-select[_ngcontent-%COMP%] {\n  display: block;\n}\n.auth-page[_ngcontent-%COMP%]   .field.field--select[_ngcontent-%COMP%]    > label[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 6px;\n  left: 12px;\n  z-index: 2;\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 1.2;\n  transform: none;\n  background: #fff;\n  padding: 0 2px;\n  color: #5f6368;\n  pointer-events: none;\n}\n.auth-page[_ngcontent-%COMP%]   .field--select.onboarding-country[_ngcontent-%COMP%] {\n  margin-top: 0;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-legal[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  padding: 14px 14px 12px;\n  border: 1px solid #dadce0;\n  border-radius: 8px;\n  background: #f8f9fa;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-legal__title[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  font-size: 14px;\n  font-weight: 500;\n  color: #202124;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-legal__text[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #5f6368;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-legal__text[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #0f9d58;\n  text-decoration: underline;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-legal__list[_ngcontent-%COMP%] {\n  margin: 0 0 12px;\n  padding-left: 1.15rem;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #5f6368;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-consent[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #202124;\n  cursor: pointer;\n}\n.auth-page[_ngcontent-%COMP%]   .onboarding-consent[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  margin-top: 3px;\n  flex-shrink: 0;\n  accent-color: #0f9d58;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-btn-primary[_ngcontent-%COMP%] {\n  width: 100%;\n  background: #0f9d58;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  padding: 10px 24px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-btn-primary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-link-button--block[_ngcontent-%COMP%] {\n  width: 100%;\n  text-align: center;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-divider[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin: 4px 0;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-divider[_ngcontent-%COMP%]::before, \n.auth-page[_ngcontent-%COMP%]   .auth-divider[_ngcontent-%COMP%]::after {\n  content: "";\n  flex: 1;\n  height: 1px;\n  background: #dadce0;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-divider[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #5f6368;\n  white-space: nowrap;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-oauth-btn[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid #dadce0;\n  border-radius: 4px;\n  padding: 10px 16px;\n  font-size: 14px;\n  font-weight: 500;\n  background: #fff;\n  color: #202124;\n  cursor: pointer;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-oauth-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #f8f9fa;\n}\n.auth-page[_ngcontent-%COMP%]   .auth-oauth-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.onboarding-shell[_ngcontent-%COMP%] {\n  --onboarding-cookie-bar-space: 12.5rem;\n  display: flex;\n  flex-direction: column;\n  min-height: 100dvh;\n  min-height: 100svh;\n  position: relative;\n}\n@media (min-width: 640px) {\n  .onboarding-shell[_ngcontent-%COMP%] {\n    --onboarding-cookie-bar-space: 10rem;\n  }\n}\n.onboarding-shell[_ngcontent-%COMP%]   .auth-page--onboarding[_ngcontent-%COMP%]   .auth-page__scroll[_ngcontent-%COMP%] {\n  padding-bottom: calc(var(--onboarding-cookie-bar-space) + env(safe-area-inset-bottom, 0px));\n}\n.onboarding-shell--cookie-dismissed[_ngcontent-%COMP%] {\n  --onboarding-cookie-bar-space: 0px;\n}\n.onboarding-shell--cookie-dismissed[_ngcontent-%COMP%]   .auth-page--onboarding[_ngcontent-%COMP%]   .auth-page__scroll[_ngcontent-%COMP%] {\n  padding-bottom: env(safe-area-inset-bottom, 0px);\n}\n.onboarding-cookie-bar[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 2000;\n  pointer-events: auto;\n  touch-action: manipulation;\n  isolation: isolate;\n  max-height: min(44dvh, 17rem);\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  border-top: 1px solid #dadce0;\n  background: rgba(255, 255, 255, 0.98);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.1);\n  padding: 0 calc(16px + env(safe-area-inset-right, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)) calc(16px + env(safe-area-inset-left, 0px));\n}\n@media (min-width: 640px) {\n  .onboarding-cookie-bar[_ngcontent-%COMP%] {\n    max-height: none;\n  }\n}\n.onboarding-cookie-bar__inner[_ngcontent-%COMP%] {\n  max-width: 480px;\n  margin: 0 auto;\n  padding-top: 12px;\n}\n.onboarding-cookie-bar__title[_ngcontent-%COMP%] {\n  margin: 0 0 6px;\n  font-size: 14px;\n  font-weight: 600;\n  color: #202124;\n}\n.onboarding-cookie-bar__text[_ngcontent-%COMP%] {\n  margin: 0 0 6px;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #5f6368;\n}\n.onboarding-cookie-bar__link[_ngcontent-%COMP%] {\n  color: #0f9d58;\n  font-weight: 500;\n  text-decoration: underline;\n}\n.onboarding-cookie-bar__hint[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n  font-size: 12px;\n  line-height: 1.4;\n  color: #80868b;\n}\n.onboarding-cookie-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.onboarding-cookie-btn[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 7rem;\n  border: 1px solid #dadce0;\n  border-radius: 6px;\n  padding: 8px 12px;\n  font-size: 13px;\n  font-weight: 500;\n  background: #fff;\n  color: #202124;\n  cursor: pointer;\n  pointer-events: auto;\n  transition:\n    border-color 0.15s ease,\n    background 0.15s ease,\n    color 0.15s ease,\n    box-shadow 0.15s ease;\n}\n.onboarding-cookie-btn[_ngcontent-%COMP%]:hover {\n  border-color: #0f9d58;\n}\n.onboarding-cookie-btn[_ngcontent-%COMP%]:active {\n  transform: scale(0.98);\n}\n.onboarding-cookie-btn--accept[_ngcontent-%COMP%] {\n  border-color: #0f9d58;\n  background: #0f9d58;\n  color: #fff;\n}\n.onboarding-cookie-btn--accept[_ngcontent-%COMP%]:hover {\n  background: #0b8043;\n  border-color: #0b8043;\n}\n.onboarding-cookie-btn--muted[_ngcontent-%COMP%] {\n  color: #5f6368;\n  background: #fff;\n}\n.onboarding-cookie-btn--active[_ngcontent-%COMP%] {\n  border-color: #0f9d58;\n  box-shadow: 0 0 0 1px #0f9d58;\n  color: #0f9d58;\n}\n.onboarding-cookie-btn--accept.onboarding-cookie-btn--active[_ngcontent-%COMP%] {\n  background: #0b8043;\n  border-color: #0b8043;\n  color: #fff;\n  box-shadow: 0 0 0 1px #0b8043;\n}\n/*# sourceMappingURL=auth.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VerifyEmailNoticeComponent, [{
    type: Component,
    args: [{ selector: "app-verify-email-notice", imports: [], template: '<div class="auth-page">\n  <span class="auth-logo">Simple4U</span>\n\n  <div class="auth-card">\n    <h1>{{ i18n.authUi().verifyNoticeTitle }}</h1>\n    <p class="subtitle">{{ i18n.authUi().verifyNoticeSubtitle }}</p>\n\n    @if (email) {\n      <p class="auth-email-display">{{ email }}</p>\n    }\n\n    <p class="auth-hint">{{ i18n.authUi().checkEmailPurgeHint }}</p>\n\n    @if (message()) {\n      <p class="auth-success">{{ message() }}</p>\n    }\n    @if (error()) {\n      <div class="auth-error">{{ error() }}</div>\n    }\n\n    <div class="auth-actions auth-actions--stack">\n      <button type="button" class="btn-primary" [disabled]="loading()" (click)="resend()">\n        {{ loading() ? i18n.authUi().checkEmailSending : i18n.authUi().resendVerification }}\n      </button>\n      <button type="button" class="btn-secondary" [disabled]="loading()" (click)="checkVerified()">\n        {{ i18n.authUi().verifyRefreshStatus }}\n      </button>\n      <button type="button" class="btn-link danger" (click)="signOut()">\n        {{ i18n.authUi().signOut }}\n      </button>\n    </div>\n  </div>\n</div>\n', styles: ['/* src/app/features/auth/auth.scss */\n.auth-page {\n  min-height: 100vh;\n  background-color: #f8f9fa;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n}\n.auth-page .auth-logo {\n  font-size: 22px;\n  font-weight: 500;\n  color: #202124;\n  letter-spacing: -0.3px;\n  margin-bottom: 28px;\n}\n.auth-page .auth-card {\n  background: #fff;\n  border: 1px solid #dadce0;\n  border-radius: 8px;\n  width: 100%;\n  max-width: 396px;\n  padding: 48px 40px 36px;\n}\n.auth-page .auth-card h1 {\n  font-size: 24px;\n  font-weight: 400;\n  color: #202124;\n  text-align: center;\n  margin-bottom: 8px;\n}\n.auth-page .auth-card .subtitle {\n  font-size: 14px;\n  color: #5f6368;\n  text-align: center;\n  margin-bottom: 28px;\n}\n.auth-page .auth-error {\n  background: #fce8e6;\n  color: #c5221f;\n  font-size: 13px;\n  border-radius: 4px;\n  padding: 8px 12px;\n  margin-bottom: 16px;\n}\n.auth-page .auth-success {\n  color: #0f9d58;\n  font-size: 13px;\n  margin-bottom: 12px;\n}\n.auth-page .auth-hint {\n  font-size: 13px;\n  color: #5f6368;\n  text-align: center;\n  margin-bottom: 16px;\n  line-height: 1.45;\n}\n.auth-page .auth-hint a {\n  color: #0f9d58;\n  text-decoration: none;\n}\n.auth-page .auth-hint a:hover {\n  text-decoration: underline;\n}\n.auth-page .auth-email-display {\n  text-align: center;\n  font-weight: 500;\n  color: #202124;\n  margin-bottom: 12px;\n  word-break: break-all;\n}\n.auth-page .auth-forgot-row {\n  display: flex;\n  justify-content: flex-end;\n  margin-top: -8px;\n}\n.auth-page .auth-link-button {\n  background: none;\n  border: none;\n  padding: 0;\n  font-size: 13px;\n  color: #0f9d58;\n  cursor: pointer;\n  text-decoration: underline;\n}\n.auth-page .auth-link-button:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page .auth-form {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.auth-page .field {\n  position: relative;\n}\n.auth-page .field input {\n  width: 100%;\n  border: 1px solid #dadce0;\n  border-radius: 4px;\n  padding: 13px 12px 8px;\n  font-size: 14px;\n  color: #202124;\n  background: #fff;\n  outline: none;\n  transition: border-color 0.15s, box-shadow 0.15s;\n}\n.auth-page .field input:focus {\n  border-color: #0f9d58;\n  box-shadow: 0 0 0 1px #0f9d58;\n}\n.auth-page .field input:focus + label,\n.auth-page .field input:not(:placeholder-shown) + label {\n  top: 6px;\n  font-size: 11px;\n  color: #5f6368;\n}\n.auth-page .field input:focus + label {\n  color: #0f9d58;\n}\n.auth-page .field label {\n  position: absolute;\n  left: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 14px;\n  color: #5f6368;\n  pointer-events: none;\n  transition:\n    top 0.15s,\n    font-size 0.15s,\n    color 0.15s;\n  background: #fff;\n  padding: 0 2px;\n}\n.auth-page .auth-actions--stack {\n  flex-direction: column;\n  gap: 12px;\n  align-items: stretch;\n}\n.auth-page .auth-actions--stack .btn-primary {\n  width: 100%;\n  background: #0f9d58;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  padding: 10px 24px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n}\n.auth-page .auth-actions--stack .btn-primary:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page .auth-actions--stack a {\n  text-align: center;\n}\n.auth-page .auth-actions--stack .btn-secondary {\n  width: 100%;\n  background: #fff;\n  color: #202124;\n  border: 1px solid #dadce0;\n  border-radius: 4px;\n  padding: 10px 24px;\n  font-size: 14px;\n  cursor: pointer;\n}\n.auth-page .auth-actions--stack .btn-secondary:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page .auth-actions--stack .btn-link {\n  background: none;\n  border: none;\n  color: #5f6368;\n  font-size: 13px;\n  cursor: pointer;\n  text-decoration: underline;\n}\n.auth-page .auth-dialog-hint {\n  font-size: 14px;\n  color: #5f6368;\n  margin: 0 0 16px;\n  line-height: 1.45;\n}\n.auth-page .auth-dialog-success {\n  font-size: 14px;\n  color: #137333;\n  margin: 0;\n  line-height: 1.45;\n}\n.auth-page .auth-dialog-field {\n  margin-bottom: 0;\n}\n.auth-page .auth-dialog-status {\n  font-size: 13px;\n  color: #5f6368;\n  margin: 12px 0 0;\n  text-align: center;\n}\n.auth-page .auth-error--dialog {\n  margin-bottom: 12px;\n}\n.auth-page .auth-banner-success {\n  background: #e6f4ea;\n  color: #137333;\n  font-size: 13px;\n  border-radius: 4px;\n  padding: 10px 12px;\n  margin-bottom: 16px;\n  text-align: center;\n}\n.auth-page .auth-actions {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: 8px;\n}\n@media (max-width: 400px) {\n  .auth-page .auth-actions a {\n    font-size: 13px;\n  }\n}\n.auth-page .auth-actions a {\n  font-size: 14px;\n  color: #0f9d58;\n  text-decoration: none;\n}\n.auth-page .auth-actions a:hover {\n  text-decoration: underline;\n}\n.auth-page .auth-actions button {\n  background: #0f9d58;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  padding: 9px 24px;\n}\n@media (max-width: 400px) {\n  .auth-page .auth-actions button {\n    padding: 10px 18px !important;\n    font-size: 11.5px !important;\n  }\n}\n.auth-page .auth-actions button {\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.15s;\n}\n.auth-page .auth-actions button:hover {\n  background: #066535;\n}\n.auth-page .auth-actions button:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page.auth-page--onboarding {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  min-height: 0;\n  justify-content: flex-start;\n  align-items: stretch;\n  padding: 0;\n  overflow: hidden;\n}\n.auth-page.auth-page--onboarding .auth-page__scroll {\n  position: relative;\n  z-index: 1;\n}\n.auth-page.auth-page--submitting .auth-page__scroll {\n  filter: blur(10px);\n  opacity: 0.35;\n  pointer-events: none;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.auth-page .auth-page__scroll {\n  flex: 1 1 auto;\n  width: 100%;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 16px 16px 0;\n  -webkit-overflow-scrolling: touch;\n}\n.auth-page .auth-card--onboarding {\n  max-width: 480px;\n  margin: 0 auto;\n  padding: 40px 32px 24px;\n  background: #fff;\n  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.14);\n}\n.auth-page .onboarding-submit-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 500;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1.5rem;\n  background: rgba(255, 255, 255, 0.55);\n  backdrop-filter: blur(14px) saturate(0.85);\n  -webkit-backdrop-filter: blur(14px) saturate(0.85);\n}\n.auth-page .onboarding-submit-overlay__panel {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 1rem;\n  max-width: 20rem;\n  padding: 1.5rem 1.75rem;\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.92);\n  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.18);\n  text-align: center;\n}\n.auth-page .onboarding-submit-overlay__panel p {\n  margin: 0;\n  font-size: 0.9375rem;\n  font-weight: 500;\n  color: #202124;\n}\n.auth-page .onboarding-submit-overlay__spinner {\n  width: 2.25rem;\n  height: 2.25rem;\n  border: 3px solid #dadce0;\n  border-top-color: #0f9d58;\n  border-radius: 50%;\n  animation: onboarding-spin 0.75s linear infinite;\n}\n@keyframes onboarding-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.auth-page .onboarding-legal__link {\n  display: inline-block;\n  margin-bottom: 12px;\n  font-size: 13px;\n  font-weight: 500;\n  color: #0f9d58;\n  text-decoration: underline;\n}\n.auth-page .field--readonly input {\n  background: #f8f9fa;\n  color: #5f6368;\n  cursor: default;\n}\n.auth-page .field.field--select app-select {\n  display: block;\n}\n.auth-page .field.field--select > label {\n  position: absolute;\n  top: 6px;\n  left: 12px;\n  z-index: 2;\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 1.2;\n  transform: none;\n  background: #fff;\n  padding: 0 2px;\n  color: #5f6368;\n  pointer-events: none;\n}\n.auth-page .field--select.onboarding-country {\n  margin-top: 0;\n}\n.auth-page .onboarding-legal {\n  margin-top: 4px;\n  padding: 14px 14px 12px;\n  border: 1px solid #dadce0;\n  border-radius: 8px;\n  background: #f8f9fa;\n}\n.auth-page .onboarding-legal__title {\n  margin: 0 0 8px;\n  font-size: 14px;\n  font-weight: 500;\n  color: #202124;\n}\n.auth-page .onboarding-legal__text {\n  margin: 0 0 10px;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #5f6368;\n}\n.auth-page .onboarding-legal__text a {\n  color: #0f9d58;\n  text-decoration: underline;\n}\n.auth-page .onboarding-legal__list {\n  margin: 0 0 12px;\n  padding-left: 1.15rem;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #5f6368;\n}\n.auth-page .onboarding-consent {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #202124;\n  cursor: pointer;\n}\n.auth-page .onboarding-consent input {\n  margin-top: 3px;\n  flex-shrink: 0;\n  accent-color: #0f9d58;\n}\n.auth-page .auth-btn-primary {\n  width: 100%;\n  background: #0f9d58;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  padding: 10px 24px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n}\n.auth-page .auth-btn-primary:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.auth-page .auth-link-button--block {\n  width: 100%;\n  text-align: center;\n}\n.auth-page .auth-divider {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin: 4px 0;\n}\n.auth-page .auth-divider::before,\n.auth-page .auth-divider::after {\n  content: "";\n  flex: 1;\n  height: 1px;\n  background: #dadce0;\n}\n.auth-page .auth-divider span {\n  font-size: 12px;\n  color: #5f6368;\n  white-space: nowrap;\n}\n.auth-page .auth-oauth-btn {\n  width: 100%;\n  border: 1px solid #dadce0;\n  border-radius: 4px;\n  padding: 10px 16px;\n  font-size: 14px;\n  font-weight: 500;\n  background: #fff;\n  color: #202124;\n  cursor: pointer;\n}\n.auth-page .auth-oauth-btn:hover:not(:disabled) {\n  background: #f8f9fa;\n}\n.auth-page .auth-oauth-btn:disabled {\n  opacity: 0.6;\n  cursor: default;\n}\n.onboarding-shell {\n  --onboarding-cookie-bar-space: 12.5rem;\n  display: flex;\n  flex-direction: column;\n  min-height: 100dvh;\n  min-height: 100svh;\n  position: relative;\n}\n@media (min-width: 640px) {\n  .onboarding-shell {\n    --onboarding-cookie-bar-space: 10rem;\n  }\n}\n.onboarding-shell .auth-page--onboarding .auth-page__scroll {\n  padding-bottom: calc(var(--onboarding-cookie-bar-space) + env(safe-area-inset-bottom, 0px));\n}\n.onboarding-shell--cookie-dismissed {\n  --onboarding-cookie-bar-space: 0px;\n}\n.onboarding-shell--cookie-dismissed .auth-page--onboarding .auth-page__scroll {\n  padding-bottom: env(safe-area-inset-bottom, 0px);\n}\n.onboarding-cookie-bar {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 2000;\n  pointer-events: auto;\n  touch-action: manipulation;\n  isolation: isolate;\n  max-height: min(44dvh, 17rem);\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  border-top: 1px solid #dadce0;\n  background: rgba(255, 255, 255, 0.98);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.1);\n  padding: 0 calc(16px + env(safe-area-inset-right, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)) calc(16px + env(safe-area-inset-left, 0px));\n}\n@media (min-width: 640px) {\n  .onboarding-cookie-bar {\n    max-height: none;\n  }\n}\n.onboarding-cookie-bar__inner {\n  max-width: 480px;\n  margin: 0 auto;\n  padding-top: 12px;\n}\n.onboarding-cookie-bar__title {\n  margin: 0 0 6px;\n  font-size: 14px;\n  font-weight: 600;\n  color: #202124;\n}\n.onboarding-cookie-bar__text {\n  margin: 0 0 6px;\n  font-size: 13px;\n  line-height: 1.45;\n  color: #5f6368;\n}\n.onboarding-cookie-bar__link {\n  color: #0f9d58;\n  font-weight: 500;\n  text-decoration: underline;\n}\n.onboarding-cookie-bar__hint {\n  margin: 0 0 10px;\n  font-size: 12px;\n  line-height: 1.4;\n  color: #80868b;\n}\n.onboarding-cookie-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.onboarding-cookie-btn {\n  flex: 1 1 auto;\n  min-width: 7rem;\n  border: 1px solid #dadce0;\n  border-radius: 6px;\n  padding: 8px 12px;\n  font-size: 13px;\n  font-weight: 500;\n  background: #fff;\n  color: #202124;\n  cursor: pointer;\n  pointer-events: auto;\n  transition:\n    border-color 0.15s ease,\n    background 0.15s ease,\n    color 0.15s ease,\n    box-shadow 0.15s ease;\n}\n.onboarding-cookie-btn:hover {\n  border-color: #0f9d58;\n}\n.onboarding-cookie-btn:active {\n  transform: scale(0.98);\n}\n.onboarding-cookie-btn--accept {\n  border-color: #0f9d58;\n  background: #0f9d58;\n  color: #fff;\n}\n.onboarding-cookie-btn--accept:hover {\n  background: #0b8043;\n  border-color: #0b8043;\n}\n.onboarding-cookie-btn--muted {\n  color: #5f6368;\n  background: #fff;\n}\n.onboarding-cookie-btn--active {\n  border-color: #0f9d58;\n  box-shadow: 0 0 0 1px #0f9d58;\n  color: #0f9d58;\n}\n.onboarding-cookie-btn--accept.onboarding-cookie-btn--active {\n  background: #0b8043;\n  border-color: #0b8043;\n  color: #fff;\n  box-shadow: 0 0 0 1px #0b8043;\n}\n/*# sourceMappingURL=auth.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VerifyEmailNoticeComponent, { className: "VerifyEmailNoticeComponent", filePath: "app/features/auth/verify-email-notice.component.ts", lineNumber: 12 });
})();
export {
  VerifyEmailNoticeComponent
};
//# sourceMappingURL=chunk-AVRUKFN3.js.map
