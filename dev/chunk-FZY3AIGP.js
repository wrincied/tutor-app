import {
  DomPortalOutlet,
  TemplatePortal
} from "./chunk-JKSU2LPC.js";
import {
  purgeStaleOverlayLayers
} from "./chunk-MFN2ATQX.js";
import {
  APP_OVERLAY_LAYER_OPEN
} from "./chunk-Z5FPAOY7.js";
import {
  ApplicationRef,
  Component,
  DOCUMENT,
  DestroyRef,
  Injector,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  __spreadProps,
  __spreadValues,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
  setClassMetadata,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵanimateLeave,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵdomTemplate,
  ɵɵgetCurrentView,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵqueryAdvance,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuerySignal
} from "./chunk-27NINFBT.js";

// src/app/shared/app-dialog/app-dialog.component.ts
var _c0 = ["overlayPortal"];
var _c1 = ["*"];
function AppDialogComponent_ng_template_0_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 4);
    \u0275\u0275domElement(1, "img", 8);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275domProperty("src", ctx, \u0275\u0275sanitizeUrl);
  }
}
function AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "button", 12);
    \u0275\u0275domListener("click", function AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onCancelClick());
    });
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("app-dialog__btn--danger", ctx_r1.cancelDanger());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.cancelLabel(), " ");
  }
}
function AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "button", 13);
    \u0275\u0275domListener("click", function AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onSecondaryClick());
    });
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.secondaryLabel(), " ");
  }
}
function AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "button", 14);
    \u0275\u0275domListener("click", function AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onConfirmClick());
    });
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.confirmLabel(), " ");
  }
}
function AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "button", 14);
    \u0275\u0275domListener("click", function AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onDismiss());
    });
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.dismissLabel(), " ");
  }
}
function AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 7);
    \u0275\u0275conditionalCreate(1, AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Conditional_1_Template, 2, 3, "button", 9);
    \u0275\u0275conditionalCreate(2, AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Conditional_2_Template, 2, 1, "button", 10);
    \u0275\u0275conditionalCreate(3, AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Conditional_3_Template, 2, 1, "button", 11);
    \u0275\u0275conditionalCreate(4, AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Conditional_4_Template, 2, 1, "button", 11);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.cancelLabel() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.secondaryLabel() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.confirmLabel() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.dismissLabel() && !ctx_r1.confirmLabel() && !ctx_r1.cancelLabel() ? 4 : -1);
  }
}
function AppDialogComponent_ng_template_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 2);
    \u0275\u0275animateLeave("modal-overlay-leave");
    \u0275\u0275domListener("click", function AppDialogComponent_ng_template_0_Conditional_0_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onOverlayClick());
    });
    \u0275\u0275domElementStart(1, "div", 3);
    \u0275\u0275animateLeave(function AppDialogComponent_ng_template_0_Conditional_0_Template_animateleave_cb() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.layout() === "sheet" ? "modal-sheet-leave" : "modal-dialog-leave");
    });
    \u0275\u0275domListener("click", function AppDialogComponent_ng_template_0_Conditional_0_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275conditionalCreate(2, AppDialogComponent_ng_template_0_Conditional_0_Conditional_2_Template, 2, 1, "div", 4);
    \u0275\u0275domElementStart(3, "h2", 5);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "div", 6);
    \u0275\u0275projection(6);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(7, AppDialogComponent_ng_template_0_Conditional_0_Conditional_7_Template, 5, 4, "div", 7);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    let tmp_8_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("app-dialog-overlay--sheet", ctx_r1.layout() === "sheet")("app-dialog-overlay--on-top", ctx_r1.stackOnTop());
    \u0275\u0275advance();
    \u0275\u0275classProp("app-dialog--error", ctx_r1.variant() === "error")("app-dialog--sheet", ctx_r1.layout() === "sheet");
    \u0275\u0275attribute("aria-labelledby", "app-dialog-title");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_8_0 = ctx_r1.iconSrc()) ? 2 : -1, tmp_8_0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.title());
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.cancelLabel() || ctx_r1.secondaryLabel() || ctx_r1.confirmLabel() || ctx_r1.dismissLabel() && !ctx_r1.confirmLabel() && !ctx_r1.cancelLabel() && !ctx_r1.secondaryLabel() ? 7 : -1);
  }
}
function AppDialogComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppDialogComponent_ng_template_0_Conditional_0_Template, 8, 12, "div", 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.open() ? 0 : -1);
  }
}
var AppDialogComponent = class _AppDialogComponent {
  document = inject(DOCUMENT);
  appRef = inject(ApplicationRef);
  injector = inject(Injector);
  vcr = inject(ViewContainerRef);
  destroyRef = inject(DestroyRef);
  overlayPortalTpl = viewChild("overlayPortal", ...ngDevMode ? [{ debugName: "overlayPortalTpl" }] : (
    /* istanbul ignore next */
    []
  ));
  portalHost = null;
  bodyOutlet = null;
  attachedPortal = null;
  detachScheduled = null;
  /** Дольше самой leave-анимации (.modal-sheet-leave ≈ 320ms). */
  static LEAVE_MS = 360;
  open = input(false, __spreadProps(__spreadValues({}, ngDevMode ? { debugName: "open" } : (
    /* istanbul ignore next */
    {}
  )), { transform: booleanAttribute }));
  title = input.required(...ngDevMode ? [{ debugName: "title" }] : (
    /* istanbul ignore next */
    []
  ));
  variant = input("default", ...ngDevMode ? [{ debugName: "variant" }] : (
    /* istanbul ignore next */
    []
  ));
  layout = input("center", ...ngDevMode ? [{ debugName: "layout" }] : (
    /* istanbul ignore next */
    []
  ));
  iconSrc = input(null, ...ngDevMode ? [{ debugName: "iconSrc" }] : (
    /* istanbul ignore next */
    []
  ));
  cancelLabel = input(null, ...ngDevMode ? [{ debugName: "cancelLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Красная кнопка отмены (как btn-link.danger). */
  cancelDanger = input(false, __spreadProps(__spreadValues({}, ngDevMode ? { debugName: "cancelDanger" } : (
    /* istanbul ignore next */
    {}
  )), { transform: booleanAttribute }));
  confirmLabel = input(null, ...ngDevMode ? [{ debugName: "confirmLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Одна кнопка (например «Понятно») — если нет confirm/cancel. */
  dismissLabel = input(null, ...ngDevMode ? [{ debugName: "dismissLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Средняя кнопка между «Отмена» и основным подтверждением (три действия). */
  secondaryLabel = input(null, ...ngDevMode ? [{ debugName: "secondaryLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  closeOnOverlay = input(true, __spreadProps(__spreadValues({}, ngDevMode ? { debugName: "closeOnOverlay" } : (
    /* istanbul ignore next */
    {}
  )), { transform: booleanAttribute }));
  /** Поверх select-backdrop (z-index 1300). */
  stackOnTop = input(false, __spreadProps(__spreadValues({}, ngDevMode ? { debugName: "stackOnTop" } : (
    /* istanbul ignore next */
    {}
  )), { transform: booleanAttribute }));
  cancelled = output({ alias: "cancel" });
  secondaryAction = output({ alias: "secondary" });
  confirmed = output({ alias: "confirm" });
  constructor() {
    effect(() => {
      if (this.open()) {
        this.cancelScheduledDetach();
        purgeStaleOverlayLayers(this.document);
        this.document.dispatchEvent(new CustomEvent(APP_OVERLAY_LAYER_OPEN));
        this.syncPortal();
      } else if (this.bodyOutlet?.hasAttached()) {
        this.scheduleDetachPortal();
      }
    });
    this.destroyRef.onDestroy(() => this.destroyPortal());
  }
  ngOnDestroy() {
    this.destroyPortal();
  }
  onOverlayClick() {
    if (this.closeOnOverlay()) {
      this.cancelled.emit();
    }
  }
  onCancelClick() {
    this.cancelled.emit();
  }
  onSecondaryClick() {
    this.secondaryAction.emit();
  }
  onConfirmClick() {
    this.confirmed.emit();
  }
  onDismiss() {
    this.cancelled.emit();
  }
  syncPortal() {
    this.attachPortal();
  }
  getPortalHost() {
    if (!this.portalHost) {
      this.portalHost = this.document.createElement("div");
      this.portalHost.className = "app-dialog-portal-host";
    }
    this.document.body.appendChild(this.portalHost);
    return this.portalHost;
  }
  attachPortal() {
    const tpl = this.overlayPortalTpl();
    if (!tpl) {
      return;
    }
    const host = this.getPortalHost();
    if (!this.bodyOutlet) {
      this.bodyOutlet = new DomPortalOutlet(host, this.appRef, this.injector);
    }
    if (this.bodyOutlet.hasAttached()) {
      this.bodyOutlet.detach();
      this.attachedPortal = null;
    }
    this.attachedPortal = this.bodyOutlet.attach(new TemplatePortal(tpl, this.vcr));
  }
  cancelScheduledDetach() {
    if (this.detachScheduled !== null) {
      clearTimeout(this.detachScheduled);
      this.detachScheduled = null;
    }
  }
  /** Даём @if (open()) и animate.leave завершиться до detach CDK-портала. */
  scheduleDetachPortal() {
    if (this.detachScheduled !== null) {
      return;
    }
    this.detachScheduled = setTimeout(() => {
      this.detachScheduled = null;
      if (!this.open()) {
        this.detachPortal();
      }
    }, _AppDialogComponent.LEAVE_MS);
  }
  detachPortal() {
    this.cancelScheduledDetach();
    if (this.bodyOutlet?.hasAttached()) {
      this.bodyOutlet.detach();
    }
    this.attachedPortal = null;
    if (this.portalHost?.parentNode) {
      this.portalHost.parentNode.removeChild(this.portalHost);
    }
  }
  destroyPortal() {
    this.detachPortal();
    if (this.bodyOutlet) {
      this.bodyOutlet.dispose();
      this.bodyOutlet = null;
    }
    this.portalHost = null;
  }
  static \u0275fac = function AppDialogComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppDialogComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppDialogComponent, selectors: [["app-dialog"]], viewQuery: function AppDialogComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.overlayPortalTpl, _c0, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, inputs: { open: [1, "open"], title: [1, "title"], variant: [1, "variant"], layout: [1, "layout"], iconSrc: [1, "iconSrc"], cancelLabel: [1, "cancelLabel"], cancelDanger: [1, "cancelDanger"], confirmLabel: [1, "confirmLabel"], dismissLabel: [1, "dismissLabel"], secondaryLabel: [1, "secondaryLabel"], closeOnOverlay: [1, "closeOnOverlay"], stackOnTop: [1, "stackOnTop"] }, outputs: { cancelled: "cancel", secondaryAction: "secondary", confirmed: "confirm" }, ngContentSelectors: _c1, decls: 2, vars: 0, consts: [["overlayPortal", ""], ["role", "presentation", 1, "app-dialog-overlay", 3, "app-dialog-overlay--sheet", "app-dialog-overlay--on-top"], ["role", "presentation", 1, "app-dialog-overlay", 3, "click"], ["role", "alertdialog", "aria-modal", "true", 1, "app-dialog", 3, "click"], ["aria-hidden", "true", 1, "app-dialog__icon"], ["id", "app-dialog-title", 1, "app-dialog__title"], [1, "app-dialog__body"], [1, "app-dialog__actions"], ["width", "24", "height", "24", "alt", "", 3, "src"], ["type", "button", 1, "app-dialog__btn", "app-dialog__btn--secondary", 3, "app-dialog__btn--danger"], ["type", "button", 1, "app-dialog__btn", "app-dialog__btn--neutral"], ["type", "button", 1, "app-dialog__btn", "app-dialog__btn--primary"], ["type", "button", 1, "app-dialog__btn", "app-dialog__btn--secondary", 3, "click"], ["type", "button", 1, "app-dialog__btn", "app-dialog__btn--neutral", 3, "click"], ["type", "button", 1, "app-dialog__btn", "app-dialog__btn--primary", 3, "click"]], template: function AppDialogComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275domTemplate(0, AppDialogComponent_ng_template_0_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
  }, styles: ["/* src/app/shared/app-dialog/app-dialog.component.scss */\n.app-dialog-portal-host {\n  position: static;\n  display: contents;\n}\n.app-dialog-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: var(--z-app-dialog, var(--z-app-overlay));\n}\n.app-dialog-overlay--on-top {\n  z-index: var(--z-app-dialog-top, 1400);\n}\n.app-dialog-overlay {\n  display: flex;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  background: rgba(15, 23, 42, 0.45);\n  opacity: 1;\n  transition: opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1);\n}\n@starting-style {\n  .app-dialog-overlay {\n    opacity: 0;\n  }\n}\n@media (max-width: 767px) {\n  .app-dialog-overlay {\n    flex-direction: column;\n    justify-content: flex-end;\n    align-items: stretch;\n    padding: 0;\n    overflow: hidden;\n  }\n}\n@media (min-width: 768px) {\n  .app-dialog-overlay {\n    align-items: center;\n    justify-content: center;\n    padding: 1rem;\n    overflow-y: auto;\n  }\n}\n.app-dialog {\n  width: 100%;\n  height: auto;\n  color: var(--text-primary);\n  border: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n  -webkit-overflow-scrolling: touch;\n}\n@media (max-width: 767px) {\n  .app-dialog {\n    align-self: stretch;\n    max-width: 100%;\n    max-height: calc(100dvh - env(safe-area-inset-top, 0px) - 0.5rem);\n    max-height: calc(100svh - env(safe-area-inset-top, 0px) - 0.5rem);\n    overflow-x: hidden;\n    overflow-y: auto;\n    padding: 1rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom, 0px));\n    border-radius: 1rem 1rem 0 0;\n    box-shadow: 0 -12px 40px rgba(15, 23, 42, 0.18);\n    opacity: 1;\n    transform: translateY(0);\n    transform-origin: bottom center;\n  }\n}\n@media (min-width: 768px) {\n  .app-dialog {\n    max-width: 24rem;\n    max-height: min(90dvh, 100dvh - 2rem);\n    max-height: min(90svh, 100svh - 2rem);\n    overflow-x: hidden;\n    overflow-y: auto;\n    padding: 1.25rem 1.5rem 1.5rem;\n    border-radius: 1rem;\n    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n@media (max-width: 767px) {\n  .app-dialog--error {\n    max-width: 100%;\n  }\n}\n.app-dialog--error {\n  border-color: rgb(254, 202, 202);\n  background: rgb(254, 242, 242);\n  color: white;\n}\n.app-dialog--error .app-dialog__title {\n  color: rgb(153, 27, 27);\n}\n.app-dialog--error .app-dialog__body {\n  color: rgb(185, 28, 28);\n}\n.app-dialog--error .app-dialog__icon {\n  background: rgb(254, 226, 226);\n}\n.app-dialog--error .app-dialog__btn--primary {\n  color: white;\n  background: var(--nav-accent);\n}\n.app-dialog--error .app-dialog__btn--primary:hover {\n  background: var(--nav-accent);\n  opacity: 0.8;\n  transition: all 0.15s ease;\n}\n.app-dialog__icon {\n  display: flex;\n  width: 2.5rem;\n  height: 2.5rem;\n  align-items: center;\n  justify-content: center;\n  margin-bottom: 0.75rem;\n  border-radius: 999px;\n  background: rgb(241, 245, 249);\n}\n.app-dialog__title {\n  margin: 0 0 0.75rem;\n  font-size: 1.125rem;\n  font-weight: 600;\n  line-height: 1.3;\n}\n.app-dialog__body {\n  flex: 0 0 auto;\n  overflow: visible;\n  font-size: 0.875rem;\n  line-height: 1.55;\n  color: var(--text-secondary);\n}\n.app-dialog__body :where(p) {\n  margin: 0;\n}\n.app-dialog__body :where(strong) {\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.app-dialog--error .app-dialog__body :where(strong) {\n  color: rgb(153, 27, 27);\n}\n.app-dialog:not(.app-dialog--error) .app-dialog__body :where(strong) {\n  color: var(--nav-accent);\n}\n.app-dialog__actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  margin-top: 1.25rem;\n}\n.app-dialog__btn {\n  min-height: 2.75rem;\n  min-width: 2.75rem;\n  border-radius: 0.5rem;\n  padding: 8px 18px;\n  font-size: 0.875rem;\n  font-weight: 600;\n  cursor: pointer;\n}\n.app-dialog__btn--secondary {\n  border: 1px solid rgb(148, 163, 184);\n  background: #fff;\n  color: rgb(51, 65, 85);\n}\n.app-dialog__btn--secondary:hover {\n  background: rgb(210, 217, 227);\n  transition: all 0.15s ease;\n}\n.app-dialog__btn--danger {\n  border-color: rgb(248, 113, 113);\n  color: rgb(185, 28, 28);\n}\n.app-dialog__btn--danger:hover {\n  background: rgb(254, 242, 242);\n}\n.app-dialog__btn--neutral {\n  border: 1px solid rgb(148, 163, 184);\n  background: #fff;\n}\n.app-dialog__btn--neutral:hover {\n  background: var(--nav-accent);\n  color: #fff;\n}\n.app-dialog__btn--primary {\n  background: var(--nav-accent);\n  color: var(--text-main);\n}\n.app-dialog__btn--primary:hover {\n  background: rgb(185, 28, 28);\n  color: #fff;\n}\n.app-dialog__btn--primary:active {\n  transform: translateY(1px);\n}\n@media (prefers-reduced-motion: reduce) {\n  .app-dialog-overlay,\n  .app-dialog,\n  .app-dialog--sheet {\n    transition: none !important;\n  }\n}\n/*# sourceMappingURL=app-dialog.component.css.map */\n"], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppDialogComponent, [{
    type: Component,
    args: [{ selector: "app-dialog", standalone: true, encapsulation: ViewEncapsulation.None, template: `<ng-template #overlayPortal>
  @if (open()) {
    <div
      class="app-dialog-overlay"
      [class.app-dialog-overlay--sheet]="layout() === 'sheet'"
      [class.app-dialog-overlay--on-top]="stackOnTop()"
      role="presentation"
      animate.leave="modal-overlay-leave"
      (click)="onOverlayClick()"
    >
      <div
        class="app-dialog"
        [class.app-dialog--error]="variant() === 'error'"
        [class.app-dialog--sheet]="layout() === 'sheet'"
        role="alertdialog"
        aria-modal="true"
        [attr.aria-labelledby]="'app-dialog-title'"
        [animate.leave]="layout() === 'sheet' ? 'modal-sheet-leave' : 'modal-dialog-leave'"
        (click)="$event.stopPropagation()"
      >
        @if (iconSrc(); as src) {
          <div class="app-dialog__icon" aria-hidden="true">
            <img [src]="src" width="24" height="24" alt="" />
          </div>
        }

        <h2 id="app-dialog-title" class="app-dialog__title">{{ title() }}</h2>

        <div class="app-dialog__body">
          <ng-content />
        </div>

        @if (
          cancelLabel() ||
          secondaryLabel() ||
          confirmLabel() ||
          (dismissLabel() && !confirmLabel() && !cancelLabel() && !secondaryLabel())
        ) {
          <div class="app-dialog__actions">
            @if (cancelLabel()) {
              <button
                type="button"
                class="app-dialog__btn app-dialog__btn--secondary"
                [class.app-dialog__btn--danger]="cancelDanger()"
                (click)="onCancelClick()"
              >
                {{ cancelLabel() }}
              </button>
            }
            @if (secondaryLabel()) {
              <button
                type="button"
                class="app-dialog__btn app-dialog__btn--neutral"
                (click)="onSecondaryClick()"
              >
                {{ secondaryLabel() }}
              </button>
            }
            @if (confirmLabel()) {
              <button
                type="button"
                class="app-dialog__btn app-dialog__btn--primary"
                (click)="onConfirmClick()"
              >
                {{ confirmLabel() }}
              </button>
            }
            @if (dismissLabel() && !confirmLabel() && !cancelLabel()) {
              <button
                type="button"
                class="app-dialog__btn app-dialog__btn--primary"
                (click)="onDismiss()"
              >
                {{ dismissLabel() }}
              </button>
            }
          </div>
        }
      </div>
    </div>
  }
</ng-template>
`, styles: ["/* src/app/shared/app-dialog/app-dialog.component.scss */\n.app-dialog-portal-host {\n  position: static;\n  display: contents;\n}\n.app-dialog-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: var(--z-app-dialog, var(--z-app-overlay));\n}\n.app-dialog-overlay--on-top {\n  z-index: var(--z-app-dialog-top, 1400);\n}\n.app-dialog-overlay {\n  display: flex;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  background: rgba(15, 23, 42, 0.45);\n  opacity: 1;\n  transition: opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1);\n}\n@starting-style {\n  .app-dialog-overlay {\n    opacity: 0;\n  }\n}\n@media (max-width: 767px) {\n  .app-dialog-overlay {\n    flex-direction: column;\n    justify-content: flex-end;\n    align-items: stretch;\n    padding: 0;\n    overflow: hidden;\n  }\n}\n@media (min-width: 768px) {\n  .app-dialog-overlay {\n    align-items: center;\n    justify-content: center;\n    padding: 1rem;\n    overflow-y: auto;\n  }\n}\n.app-dialog {\n  width: 100%;\n  height: auto;\n  color: var(--text-primary);\n  border: 1px solid var(--nav-border);\n  background: var(--nav-bg);\n  -webkit-overflow-scrolling: touch;\n}\n@media (max-width: 767px) {\n  .app-dialog {\n    align-self: stretch;\n    max-width: 100%;\n    max-height: calc(100dvh - env(safe-area-inset-top, 0px) - 0.5rem);\n    max-height: calc(100svh - env(safe-area-inset-top, 0px) - 0.5rem);\n    overflow-x: hidden;\n    overflow-y: auto;\n    padding: 1rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom, 0px));\n    border-radius: 1rem 1rem 0 0;\n    box-shadow: 0 -12px 40px rgba(15, 23, 42, 0.18);\n    opacity: 1;\n    transform: translateY(0);\n    transform-origin: bottom center;\n  }\n}\n@media (min-width: 768px) {\n  .app-dialog {\n    max-width: 24rem;\n    max-height: min(90dvh, 100dvh - 2rem);\n    max-height: min(90svh, 100svh - 2rem);\n    overflow-x: hidden;\n    overflow-y: auto;\n    padding: 1.25rem 1.5rem 1.5rem;\n    border-radius: 1rem;\n    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n@media (max-width: 767px) {\n  .app-dialog--error {\n    max-width: 100%;\n  }\n}\n.app-dialog--error {\n  border-color: rgb(254, 202, 202);\n  background: rgb(254, 242, 242);\n  color: white;\n}\n.app-dialog--error .app-dialog__title {\n  color: rgb(153, 27, 27);\n}\n.app-dialog--error .app-dialog__body {\n  color: rgb(185, 28, 28);\n}\n.app-dialog--error .app-dialog__icon {\n  background: rgb(254, 226, 226);\n}\n.app-dialog--error .app-dialog__btn--primary {\n  color: white;\n  background: var(--nav-accent);\n}\n.app-dialog--error .app-dialog__btn--primary:hover {\n  background: var(--nav-accent);\n  opacity: 0.8;\n  transition: all 0.15s ease;\n}\n.app-dialog__icon {\n  display: flex;\n  width: 2.5rem;\n  height: 2.5rem;\n  align-items: center;\n  justify-content: center;\n  margin-bottom: 0.75rem;\n  border-radius: 999px;\n  background: rgb(241, 245, 249);\n}\n.app-dialog__title {\n  margin: 0 0 0.75rem;\n  font-size: 1.125rem;\n  font-weight: 600;\n  line-height: 1.3;\n}\n.app-dialog__body {\n  flex: 0 0 auto;\n  overflow: visible;\n  font-size: 0.875rem;\n  line-height: 1.55;\n  color: var(--text-secondary);\n}\n.app-dialog__body :where(p) {\n  margin: 0;\n}\n.app-dialog__body :where(strong) {\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.app-dialog--error .app-dialog__body :where(strong) {\n  color: rgb(153, 27, 27);\n}\n.app-dialog:not(.app-dialog--error) .app-dialog__body :where(strong) {\n  color: var(--nav-accent);\n}\n.app-dialog__actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  margin-top: 1.25rem;\n}\n.app-dialog__btn {\n  min-height: 2.75rem;\n  min-width: 2.75rem;\n  border-radius: 0.5rem;\n  padding: 8px 18px;\n  font-size: 0.875rem;\n  font-weight: 600;\n  cursor: pointer;\n}\n.app-dialog__btn--secondary {\n  border: 1px solid rgb(148, 163, 184);\n  background: #fff;\n  color: rgb(51, 65, 85);\n}\n.app-dialog__btn--secondary:hover {\n  background: rgb(210, 217, 227);\n  transition: all 0.15s ease;\n}\n.app-dialog__btn--danger {\n  border-color: rgb(248, 113, 113);\n  color: rgb(185, 28, 28);\n}\n.app-dialog__btn--danger:hover {\n  background: rgb(254, 242, 242);\n}\n.app-dialog__btn--neutral {\n  border: 1px solid rgb(148, 163, 184);\n  background: #fff;\n}\n.app-dialog__btn--neutral:hover {\n  background: var(--nav-accent);\n  color: #fff;\n}\n.app-dialog__btn--primary {\n  background: var(--nav-accent);\n  color: var(--text-main);\n}\n.app-dialog__btn--primary:hover {\n  background: rgb(185, 28, 28);\n  color: #fff;\n}\n.app-dialog__btn--primary:active {\n  transform: translateY(1px);\n}\n@media (prefers-reduced-motion: reduce) {\n  .app-dialog-overlay,\n  .app-dialog,\n  .app-dialog--sheet {\n    transition: none !important;\n  }\n}\n/*# sourceMappingURL=app-dialog.component.css.map */\n"] }]
  }], () => [], { overlayPortalTpl: [{ type: ViewChild, args: ["overlayPortal", { isSignal: true }] }], open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }], title: [{ type: Input, args: [{ isSignal: true, alias: "title", required: true }] }], variant: [{ type: Input, args: [{ isSignal: true, alias: "variant", required: false }] }], layout: [{ type: Input, args: [{ isSignal: true, alias: "layout", required: false }] }], iconSrc: [{ type: Input, args: [{ isSignal: true, alias: "iconSrc", required: false }] }], cancelLabel: [{ type: Input, args: [{ isSignal: true, alias: "cancelLabel", required: false }] }], cancelDanger: [{ type: Input, args: [{ isSignal: true, alias: "cancelDanger", required: false }] }], confirmLabel: [{ type: Input, args: [{ isSignal: true, alias: "confirmLabel", required: false }] }], dismissLabel: [{ type: Input, args: [{ isSignal: true, alias: "dismissLabel", required: false }] }], secondaryLabel: [{ type: Input, args: [{ isSignal: true, alias: "secondaryLabel", required: false }] }], closeOnOverlay: [{ type: Input, args: [{ isSignal: true, alias: "closeOnOverlay", required: false }] }], stackOnTop: [{ type: Input, args: [{ isSignal: true, alias: "stackOnTop", required: false }] }], cancelled: [{ type: Output, args: ["cancel"] }], secondaryAction: [{ type: Output, args: ["secondary"] }], confirmed: [{ type: Output, args: ["confirm"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppDialogComponent, { className: "AppDialogComponent", filePath: "app/shared/app-dialog/app-dialog.component.ts", lineNumber: 32 });
})();

export {
  AppDialogComponent
};
//# sourceMappingURL=chunk-FZY3AIGP.js.map
