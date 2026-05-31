import {
  NG_VALUE_ACCESSOR
} from "./chunk-3XYGRFFE.js";
import {
  DomPortalOutlet,
  TemplatePortal
} from "./chunk-JKSU2LPC.js";
import {
  APP_OVERLAY_LAYER_OPEN,
  APP_SELECT_DROPDOWN_OPEN_CLASS,
  APP_SELECT_PORTAL_ROOT
} from "./chunk-Z5FPAOY7.js";
import {
  ApplicationRef,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  HostListener,
  I18nService,
  Injector,
  Input,
  NgStyle,
  NgTemplateOutlet,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  __spreadProps,
  __spreadValues,
  afterNextRender,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  setClassMetadata,
  signal,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵanimateLeave,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuerySignal
} from "./chunk-27NINFBT.js";

// src/app/shared/app-select/app-select.component.ts
var _c0 = ["bodyPortal"];
var _forTrack0 = ($index, $item) => $item.value;
function AppSelectComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 7);
  }
  if (rf & 2) {
    \u0275\u0275styleProp("background-color", ctx);
  }
}
function AppSelectComponent_ng_template_6_Conditional_0_For_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 7);
  }
  if (rf & 2) {
    const option_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275styleProp("background-color", option_r2.dotColor);
  }
}
function AppSelectComponent_ng_template_6_Conditional_0_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 9)(1, "button", 10);
    \u0275\u0275listener("click", function AppSelectComponent_ng_template_6_Conditional_0_For_1_Template_button_click_1_listener($event) {
      const option_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.selectOption(option_r2, $event));
    });
    \u0275\u0275conditionalCreate(2, AppSelectComponent_ng_template_6_Conditional_0_For_1_Conditional_2_Template, 1, 2, "span", 4);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const option_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275classProp("app-select__option--active", ctx_r2.isSelected(option_r2));
    \u0275\u0275attribute("aria-selected", ctx_r2.isSelected(option_r2));
    \u0275\u0275advance();
    \u0275\u0275conditional(option_r2.dotColor ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r2.label, " ");
  }
}
function AppSelectComponent_ng_template_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AppSelectComponent_ng_template_6_Conditional_0_For_1_Template, 4, 5, "li", 9, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r2.options());
  }
}
function AppSelectComponent_ng_template_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 8)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.resolvedEmptyMessage());
  }
}
function AppSelectComponent_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppSelectComponent_ng_template_6_Conditional_0_Template, 2, 0)(1, AppSelectComponent_ng_template_6_Conditional_1_Template, 3, 1, "li", 8);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r2.hasOptions() ? 0 : 1);
  }
}
function AppSelectComponent_ng_template_8_Conditional_0_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AppSelectComponent_ng_template_8_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 14);
    \u0275\u0275animateLeave("app-select-backdrop-leave");
    \u0275\u0275listener("click", function AppSelectComponent_ng_template_8_Conditional_0_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.closeMenu($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "ul", 15);
    \u0275\u0275animateLeave("app-select-menu-leave");
    \u0275\u0275listener("click", function AppSelectComponent_ng_template_8_Conditional_0_Template_ul_click_2_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275template(3, AppSelectComponent_ng_template_8_Conditional_0_ng_container_3_Template, 1, 0, "ng-container", 16);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    const menuListTpl_r5 = \u0275\u0275reference(7);
    \u0275\u0275classProp("app-select-portal--overlay", ctx_r2.panelMode() === "overlay")("app-select-portal--above-modal", ctx_r2.useMobileBackdropSheet());
    \u0275\u0275advance(2);
    \u0275\u0275classProp("app-select__menu--overlay", ctx_r2.panelMode() === "overlay");
    \u0275\u0275attribute("aria-label", ctx_r2.ariaLabel() ?? ctx_r2.placeholder());
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", menuListTpl_r5);
  }
}
function AppSelectComponent_ng_template_8_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AppSelectComponent_ng_template_8_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 17);
    \u0275\u0275animateLeave("app-select-menu-leave");
    \u0275\u0275template(1, AppSelectComponent_ng_template_8_Conditional_1_ng_container_1_Template, 1, 0, "ng-container", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    const menuListTpl_r5 = \u0275\u0275reference(7);
    \u0275\u0275classProp("app-select__menu--placement-below", ctx_r2.effectiveMenuPlacement() === "below")("app-select__menu--placement-above", ctx_r2.effectiveMenuPlacement() === "above");
    \u0275\u0275property("ngStyle", ctx_r2.floatingMenuStyle());
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", menuListTpl_r5);
  }
}
function AppSelectComponent_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppSelectComponent_ng_template_8_Conditional_0_Template, 4, 8, "div", 11);
    \u0275\u0275conditionalCreate(1, AppSelectComponent_ng_template_8_Conditional_1_Template, 2, 6, "ul", 12);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r2.open() && ctx_r2.useOverlayPanel() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.open() && !ctx_r2.useOverlayPanel() ? 1 : -1);
  }
}
var AppSelectComponent = class _AppSelectComponent {
  /** Сколько select-меню сейчас открыто (для z-index на html). */
  static dropdownOpenCount = 0;
  hostEl = inject(ElementRef);
  i18n = inject(I18nService);
  document = inject(DOCUMENT);
  appRef = inject(ApplicationRef);
  injector = inject(Injector);
  vcr = inject(ViewContainerRef);
  destroyRef = inject(DestroyRef);
  bodyPortalTpl = viewChild("bodyPortal", ...ngDevMode ? [{ debugName: "bodyPortalTpl" }] : (
    /* istanbul ignore next */
    []
  ));
  portalHost = null;
  bodyOutlet = null;
  attachedPortal = null;
  /** На touch-устройствах тот же tap закрывает меню через document:click — пропускаем один раз. */
  ignoreNextOutsideClick = false;
  /** touchend + click на iOS/Android — не обрабатывать click сразу после touch. */
  suppressClickUntil = 0;
  dropdownTopLayerRaised = false;
  options = input.required(...ngDevMode ? [{ debugName: "options" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Текст, если options пустой (иначе общий «Нет данных»). */
  emptyMessage = input(null, ...ngDevMode ? [{ debugName: "emptyMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  placeholder = input(null, ...ngDevMode ? [{ debugName: "placeholder" }] : (
    /* istanbul ignore next */
    []
  ));
  menuPlacement = input("below", ...ngDevMode ? [{ debugName: "menuPlacement" }] : (
    /* istanbul ignore next */
    []
  ));
  /** overlay — поверх UI с затемнением (Material), auto — как раньше */
  panelMode = input("auto", ...ngDevMode ? [{ debugName: "panelMode" }] : (
    /* istanbul ignore next */
    []
  ));
  /** На телефоне: bottom sheet + затемнение поверх модалок (статус урока и т.п.). */
  mobileBackdropSheet = input(false, __spreadProps(__spreadValues({}, ngDevMode ? { debugName: "mobileBackdropSheet" } : (
    /* istanbul ignore next */
    {}
  )), { transform: booleanAttribute }));
  size = input("default", ...ngDevMode ? [{ debugName: "size" }] : (
    /* istanbul ignore next */
    []
  ));
  disabled = input(false, __spreadProps(__spreadValues({}, ngDevMode ? { debugName: "disabled" } : (
    /* istanbul ignore next */
    {}
  )), { transform: booleanAttribute }));
  name = input(...ngDevMode ? [void 0, { debugName: "name" }] : (
    /* istanbul ignore next */
    []
  ));
  id = input(...ngDevMode ? [void 0, { debugName: "id" }] : (
    /* istanbul ignore next */
    []
  ));
  ariaLabel = input(...ngDevMode ? [void 0, { debugName: "ariaLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  open = signal(false, ...ngDevMode ? [{ debugName: "open" }] : (
    /* istanbul ignore next */
    []
  ));
  value = signal("", ...ngDevMode ? [{ debugName: "value" }] : (
    /* istanbul ignore next */
    []
  ));
  mobileSheet = signal(this.readMobileViewport(), ...ngDevMode ? [{ debugName: "mobileSheet" }] : (
    /* istanbul ignore next */
    []
  ));
  menuAnchor = signal(null, ...ngDevMode ? [{ debugName: "menuAnchor" }] : (
    /* istanbul ignore next */
    []
  ));
  effectiveMenuPlacement = signal("below", ...ngDevMode ? [{ debugName: "effectiveMenuPlacement" }] : (
    /* istanbul ignore next */
    []
  ));
  useOverlayPanel = computed(() => {
    if (this.panelMode() === "overlay") {
      return true;
    }
    if (this.mobileBackdropSheet() && this.mobileSheet()) {
      return true;
    }
    return this.menuPlacement() === "below" && this.mobileSheet();
  }, ...ngDevMode ? [{ debugName: "useOverlayPanel" }] : (
    /* istanbul ignore next */
    []
  ));
  useMobileBackdropSheet = computed(() => this.useOverlayPanel() && this.mobileSheet() && this.mobileBackdropSheet(), ...ngDevMode ? [{ debugName: "useMobileBackdropSheet" }] : (
    /* istanbul ignore next */
    []
  ));
  floatingMenuStyle = computed(() => {
    const anchor = this.menuAnchor();
    if (!anchor) {
      return {};
    }
    const base = {
      position: "fixed",
      zIndex: "var(--z-app-dropdown)",
      left: `${anchor.left}px`,
      width: `${anchor.width}px`,
      margin: "0"
    };
    if (this.effectiveMenuPlacement() === "below") {
      return __spreadProps(__spreadValues({}, base), { top: `${anchor.bottom + 4}px`, bottom: "auto" });
    }
    const viewportH = this.document.defaultView?.innerHeight ?? 0;
    return __spreadProps(__spreadValues({}, base), {
      top: "auto",
      bottom: `${viewportH - anchor.top + 4}px`
    });
  }, ...ngDevMode ? [{ debugName: "floatingMenuStyle" }] : (
    /* istanbul ignore next */
    []
  ));
  onChange = () => {
  };
  onTouched = () => {
  };
  cvaDisabled = signal(false, ...ngDevMode ? [{ debugName: "cvaDisabled" }] : (
    /* istanbul ignore next */
    []
  ));
  isDisabled = computed(() => this.disabled() || this.cvaDisabled(), ...ngDevMode ? [{ debugName: "isDisabled" }] : (
    /* istanbul ignore next */
    []
  ));
  hasOptions = computed(() => this.options().length > 0, ...ngDevMode ? [{ debugName: "hasOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  resolvedEmptyMessage = computed(() => this.emptyMessage() ?? this.i18n.sharedUi().selectNoData, ...ngDevMode ? [{ debugName: "resolvedEmptyMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedOption = computed(() => this.options().find((opt) => opt.value === this.value()), ...ngDevMode ? [{ debugName: "selectedOption" }] : (
    /* istanbul ignore next */
    []
  ));
  displayLabel = computed(() => {
    if (!this.hasOptions()) {
      return this.resolvedEmptyMessage();
    }
    const selected = this.selectedOption();
    if (selected) {
      return selected.label;
    }
    const placeholder = this.placeholder();
    if (placeholder && !this.value()) {
      return placeholder;
    }
    return this.value() || placeholder || "";
  }, ...ngDevMode ? [{ debugName: "displayLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  displayDotColor = computed(() => this.selectedOption()?.dotColor ?? null, ...ngDevMode ? [{ debugName: "displayDotColor" }] : (
    /* istanbul ignore next */
    []
  ));
  hasDisplayValue = computed(() => this.value().trim().length > 0, ...ngDevMode ? [{ debugName: "hasDisplayValue" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    afterNextRender(() => {
      const mq = window.matchMedia("(max-width: 767px)");
      const sync = () => this.mobileSheet.set(mq.matches);
      sync();
      mq.addEventListener("change", sync);
      this.destroyRef.onDestroy(() => mq.removeEventListener("change", sync));
      const onViewportChange = () => {
        if (this.open() && !this.useOverlayPanel()) {
          this.updateMenuAnchor();
        }
      };
      window.addEventListener("resize", onViewportChange);
      window.addEventListener("scroll", onViewportChange, true);
      this.destroyRef.onDestroy(() => {
        window.removeEventListener("resize", onViewportChange);
        window.removeEventListener("scroll", onViewportChange, true);
      });
    });
  }
  ngOnDestroy() {
    this.lowerDropdownTopLayer();
    this.destroyBodyPortal();
  }
  writeValue(value) {
    this.value.set(value ?? "");
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.cvaDisabled.set(isDisabled);
  }
  onTriggerTouchEnd(event) {
    if (this.isDisabled()) {
      return;
    }
    event.preventDefault();
    this.suppressClickUntil = Date.now() + 500;
    this.toggleFromUser(event);
  }
  toggle(event) {
    event.stopPropagation();
    if (this.isDisabled()) {
      return;
    }
    if (Date.now() < this.suppressClickUntil) {
      event.preventDefault();
      return;
    }
    this.toggleFromUser(event);
  }
  toggleFromUser(event) {
    event.stopPropagation();
    if (this.isDisabled()) {
      return;
    }
    const willOpen = !this.open();
    if (willOpen) {
      this.armIgnoreOutsideClick();
      this.document.dispatchEvent(new CustomEvent(APP_OVERLAY_LAYER_OPEN));
      this.open.set(true);
      this.raiseDropdownTopLayer();
      this.syncPortalLayer();
      this.appRef.tick();
      this.onTouched();
      return;
    }
    this.setClosed();
  }
  setClosed() {
    this.lowerDropdownTopLayer();
    this.open.set(false);
    this.detachBodyPortal();
    this.removePortalHostFromBody();
  }
  raiseDropdownTopLayer() {
    if (this.dropdownTopLayerRaised) {
      return;
    }
    this.dropdownTopLayerRaised = true;
    _AppSelectComponent.dropdownOpenCount++;
    this.syncDropdownTopLayerClass();
  }
  lowerDropdownTopLayer() {
    if (!this.dropdownTopLayerRaised) {
      return;
    }
    this.dropdownTopLayerRaised = false;
    _AppSelectComponent.dropdownOpenCount = Math.max(0, _AppSelectComponent.dropdownOpenCount - 1);
    this.syncDropdownTopLayerClass();
  }
  syncDropdownTopLayerClass() {
    this.document.documentElement.classList.toggle(APP_SELECT_DROPDOWN_OPEN_CLASS, _AppSelectComponent.dropdownOpenCount > 0);
  }
  syncPortalLayer() {
    this.attachBodyPortal();
    this.bringPortalToFront();
    if (!this.useOverlayPanel()) {
      this.updateMenuAnchor();
    }
  }
  selectOption(option, event) {
    event.stopPropagation();
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.setClosed();
  }
  closeMenu(event) {
    event.stopPropagation();
    if (!this.open()) {
      return;
    }
    this.setClosed();
    this.onTouched();
  }
  isSelected(option) {
    return this.value() === option.value;
  }
  closeOnEscape() {
    if (this.open()) {
      this.setClosed();
      this.onTouched();
    }
  }
  closeOnOverlayLayerOpen() {
    if (this.open()) {
      this.setClosed();
    }
  }
  closeOnOutsideClick(event) {
    if (this.ignoreNextOutsideClick) {
      return;
    }
    if (!this.open()) {
      return;
    }
    const target = event.target;
    if (!(target instanceof Node)) {
      this.setClosed();
      this.onTouched();
      return;
    }
    if (this.hostEl.nativeElement.contains(target)) {
      return;
    }
    if (this.portalHost?.contains(target)) {
      return;
    }
    this.setClosed();
    this.onTouched();
  }
  readMobileViewport() {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(max-width: 767px)").matches;
  }
  armIgnoreOutsideClick() {
    this.ignoreNextOutsideClick = true;
    const delay = this.mobileSheet() ? 600 : 400;
    this.document.defaultView?.setTimeout(() => {
      this.ignoreNextOutsideClick = false;
    }, delay);
  }
  updateMenuAnchor() {
    const trigger = this.hostEl.nativeElement.querySelector(".app-select__trigger");
    if (!trigger) {
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const viewportH = this.document.defaultView?.innerHeight ?? 0;
    const optionCount = Math.max(this.options().length, 1);
    const estimatedMenuHeight = Math.min(256, optionCount * 44 + 20);
    const spaceBelow = viewportH - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    let placement = this.menuPlacement();
    if (placement === "below" && spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow) {
      placement = "above";
    } else if (placement === "above" && spaceAbove < estimatedMenuHeight && spaceBelow > spaceAbove) {
      placement = "below";
    }
    this.effectiveMenuPlacement.set(placement);
    this.menuAnchor.set({
      left: rect.left,
      top: rect.top,
      bottom: rect.bottom,
      width: rect.width
    });
  }
  getPortalRoot() {
    return this.document.querySelector(APP_SELECT_PORTAL_ROOT) ?? this.document.body;
  }
  getOrCreatePortalHost() {
    if (!this.portalHost) {
      this.portalHost = this.document.createElement("div");
      this.portalHost.className = "app-select-portal-host";
    }
    this.portalHost.classList.toggle("app-select-portal-host--overlay", this.useOverlayPanel());
    this.getPortalRoot().appendChild(this.portalHost);
    return this.portalHost;
  }
  bringPortalToFront() {
    if (this.portalHost) {
      this.getPortalRoot().appendChild(this.portalHost);
    }
  }
  removePortalHostFromBody() {
    if (this.portalHost?.parentNode) {
      this.portalHost.parentNode.removeChild(this.portalHost);
    }
  }
  attachBodyPortal() {
    const tpl = this.bodyPortalTpl();
    if (!tpl) {
      return;
    }
    const host = this.getOrCreatePortalHost();
    if (!this.bodyOutlet) {
      this.bodyOutlet = new DomPortalOutlet(host, this.appRef, this.injector);
    }
    if (this.bodyOutlet.hasAttached()) {
      this.bodyOutlet.detach();
      this.attachedPortal = null;
    }
    this.attachedPortal = this.bodyOutlet.attach(new TemplatePortal(tpl, this.vcr));
  }
  detachBodyPortal() {
    if (this.bodyOutlet?.hasAttached()) {
      this.bodyOutlet.detach();
    }
    this.attachedPortal = null;
  }
  destroyBodyPortal() {
    this.detachBodyPortal();
    if (this.bodyOutlet) {
      this.bodyOutlet.dispose();
      this.bodyOutlet = null;
    }
    this.removePortalHostFromBody();
    this.portalHost = null;
  }
  static \u0275fac = function AppSelectComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppSelectComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppSelectComponent, selectors: [["app-select"]], viewQuery: function AppSelectComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.bodyPortalTpl, _c0, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, hostVars: 2, hostBindings: function AppSelectComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function AppSelectComponent_keydown_escape_HostBindingHandler() {
        return ctx.closeOnEscape();
      }, \u0275\u0275resolveDocument)("app-overlay-layer-open", function AppSelectComponent_app_overlay_layer_open_HostBindingHandler() {
        return ctx.closeOnOverlayLayerOpen();
      }, \u0275\u0275resolveDocument)("click", function AppSelectComponent_click_HostBindingHandler($event) {
        return ctx.closeOnOutsideClick($event);
      }, \u0275\u0275resolveDocument);
    }
    if (rf & 2) {
      \u0275\u0275classProp("app-select--has-value", ctx.hasDisplayValue());
    }
  }, inputs: { options: [1, "options"], emptyMessage: [1, "emptyMessage"], placeholder: [1, "placeholder"], menuPlacement: [1, "menuPlacement"], panelMode: [1, "panelMode"], mobileBackdropSheet: [1, "mobileBackdropSheet"], size: [1, "size"], disabled: [1, "disabled"], name: [1, "name"], id: [1, "id"], ariaLabel: [1, "ariaLabel"] }, features: [\u0275\u0275ProvidersFeature([
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _AppSelectComponent),
      multi: true
    }
  ])], decls: 10, vars: 15, consts: [["menuListTpl", ""], ["bodyPortal", ""], [1, "app-select", 3, "click", "pointerdown"], ["type", "button", "aria-haspopup", "listbox", 1, "app-select__trigger", 3, "click", "pointerdown", "touchend", "disabled"], ["aria-hidden", "true", 1, "app-select__dot", 3, "background-color"], [1, "app-select__value"], ["aria-hidden", "true", 1, "app-select__chevron"], ["aria-hidden", "true", 1, "app-select__dot"], ["role", "presentation", 1, "app-select__empty"], ["role", "presentation"], ["type", "button", "role", "option", 1, "app-select__option", 3, "click"], ["role", "presentation", 1, "app-select-portal", 3, "app-select-portal--overlay", "app-select-portal--above-modal"], ["role", "listbox", 1, "app-select__menu", "app-select__menu--floating", 3, "app-select__menu--placement-below", "app-select__menu--placement-above", "ngStyle"], ["role", "presentation", 1, "app-select-portal"], ["role", "presentation", 1, "app-select__backdrop", 3, "click"], ["role", "listbox", 1, "app-select__menu", "app-select__menu--sheet", 3, "click"], [4, "ngTemplateOutlet"], ["role", "listbox", 1, "app-select__menu", "app-select__menu--floating", 3, "ngStyle"]], template: function AppSelectComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 2);
      \u0275\u0275listener("click", function AppSelectComponent_Template_div_click_0_listener($event) {
        return $event.stopPropagation();
      })("pointerdown", function AppSelectComponent_Template_div_pointerdown_0_listener($event) {
        return $event.stopPropagation();
      });
      \u0275\u0275elementStart(1, "button", 3);
      \u0275\u0275listener("click", function AppSelectComponent_Template_button_click_1_listener($event) {
        return ctx.toggle($event);
      })("pointerdown", function AppSelectComponent_Template_button_pointerdown_1_listener($event) {
        return $event.stopPropagation();
      })("touchend", function AppSelectComponent_Template_button_touchend_1_listener($event) {
        return ctx.onTriggerTouchEnd($event);
      });
      \u0275\u0275conditionalCreate(2, AppSelectComponent_Conditional_2_Template, 1, 2, "span", 4);
      \u0275\u0275elementStart(3, "span", 5);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd();
      \u0275\u0275element(5, "span", 6);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(6, AppSelectComponent_ng_template_6_Template, 2, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(8, AppSelectComponent_ng_template_8_Template, 2, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    }
    if (rf & 2) {
      let tmp_11_0;
      \u0275\u0275classProp("app-select--open", ctx.open())("app-select--above", ctx.menuPlacement() === "above")("app-select--below", ctx.menuPlacement() === "below")("app-select--compact", ctx.size() === "compact");
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.isDisabled());
      \u0275\u0275attribute("id", ctx.id())("name", ctx.name())("aria-label", ctx.ariaLabel())("aria-expanded", ctx.open());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_11_0 = ctx.displayDotColor()) ? 2 : -1, tmp_11_0);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.displayLabel());
    }
  }, dependencies: [NgTemplateOutlet, NgStyle], styles: ['@charset "UTF-8";\n\n/* src/app/shared/app-select/app-select.component.scss */\n:host {\n  display: block;\n  width: 100%;\n}\n.field--select app-select .app-select__trigger,\n:host-context(.field--select) .app-select__trigger {\n  align-items: flex-end;\n  min-height: 2.75rem;\n  padding-top: 1.125rem;\n  padding-bottom: 0.375rem;\n}\n.app-select {\n  position: relative;\n  width: 100%;\n}\n.app-select--open {\n  z-index: 30;\n}\n.app-select__trigger {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  width: 100%;\n  min-height: 2.5rem;\n  padding: 8px 12px;\n  border: 1px solid var(--nav-border);\n  border-radius: 6px;\n  background: var(--page-bg);\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--text-primary);\n  text-align: left;\n  cursor: pointer;\n  transition:\n    border-color 0.15s ease,\n    background-color 0.15s ease,\n    box-shadow 0.15s ease;\n}\n.app-select__trigger:hover:not(:disabled) {\n  border-color: var(--text-secondary);\n}\n.app-select__trigger:focus-visible {\n  border-color: var(--nav-accent);\n  outline: none;\n  box-shadow: 0 0 0 1px var(--nav-accent);\n}\n.app-select__trigger:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.app-select--compact .app-select__trigger {\n  min-height: 2.5rem;\n  border-radius: 0.5rem;\n  font-size: 0.8125rem;\n}\n.app-select__value {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.app-select__dot {\n  width: 0.5rem;\n  height: 0.5rem;\n  border-radius: 50%;\n  flex-shrink: 0;\n}\n.app-select__chevron {\n  flex-shrink: 0;\n  width: 0.5rem;\n  height: 0.5rem;\n  margin-left: auto;\n  border-right: 2px solid var(--text-secondary);\n  border-bottom: 2px solid var(--text-secondary);\n  transform: rotate(45deg) translateY(-2px);\n  transition: transform 0.15s ease;\n}\n.app-select--open .app-select__chevron {\n  transform: rotate(-135deg) translateY(2px);\n}\n.app-select__menu {\n  position: absolute;\n  left: 0;\n  right: 0;\n  z-index: 40;\n  margin: 0;\n  padding: 0.375rem;\n  list-style: none;\n  max-height: min(16rem, 40dvh);\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  border: 1px solid var(--nav-border);\n  border-radius: 6px;\n  background: var(--nav-bg);\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);\n  opacity: 1;\n  transform: translateY(0) scale(1);\n  transition: opacity 0.22s ease-out, transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);\n}\n@starting-style {\n  .app-select__menu {\n    opacity: 0;\n    transform: translateY(-0.375rem) scale(0.98);\n  }\n}\n.app-select--below .app-select__menu {\n  top: calc(100% + 0.25rem);\n  transform-origin: top center;\n}\n@starting-style {\n  .app-select--below .app-select__menu {\n    transform: translateY(-0.375rem) scale(0.98);\n  }\n}\n.app-select--above .app-select__menu {\n  bottom: calc(100% + 0.25rem);\n  transform-origin: bottom center;\n}\n@starting-style {\n  .app-select--above .app-select__menu {\n    transform: translateY(0.375rem) scale(0.98);\n  }\n}\n.app-select__empty {\n  padding: 1rem 1.25rem;\n  text-align: center;\n}\n.app-select__empty p {\n  margin: 0;\n  font-size: 0.875rem;\n  line-height: 1.45;\n  color: var(--text-secondary);\n}\n.app-select__option {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  width: 100%;\n  border: 0;\n  border-radius: 0.75rem;\n  padding: 0.625rem 0.75rem;\n  background: transparent;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n.app-select__option:hover {\n  background: var(--nav-hover);\n}\n.app-select__option--active {\n  background: rgb(241, 245, 249);\n}\n.app-select-portal-host {\n  position: absolute;\n  width: 0;\n  height: 0;\n  overflow: visible;\n  pointer-events: none;\n  z-index: auto;\n}\n.app-select-portal-host--overlay {\n  position: fixed;\n  inset: 0;\n  width: auto;\n  height: auto;\n  z-index: var(--z-app-dropdown);\n  pointer-events: none;\n  overflow: visible;\n  isolation: isolate;\n}\nhtml.app-select-dropdown-open .app-select-portal-host--overlay {\n  z-index: var(--z-app-dropdown);\n}\n.app-select__menu--floating {\n  position: fixed;\n  z-index: var(--z-app-dropdown);\n  margin: 0;\n  padding: 0.375rem;\n  list-style: none;\n  max-height: min(16rem, 40dvh);\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  pointer-events: auto;\n  border: 1px solid var(--nav-border);\n  border-radius: 6px;\n  background: var(--nav-bg);\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);\n  opacity: 1;\n  transform: translateY(0) scale(1);\n  transition: opacity 0.22s ease-out, transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);\n}\n.app-select__menu--floating.app-select__menu--placement-below {\n  transform-origin: top center;\n}\n@starting-style {\n  .app-select__menu--floating.app-select__menu--placement-below {\n    opacity: 0;\n    transform: translateY(-0.375rem) scale(0.98);\n  }\n}\n.app-select__menu--floating.app-select__menu--placement-above {\n  transform-origin: bottom center;\n}\n@starting-style {\n  .app-select__menu--floating.app-select__menu--placement-above {\n    opacity: 0;\n    transform: translateY(0.375rem) scale(0.98);\n  }\n}\n.app-select__menu--floating .app-select__option {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  width: 100%;\n  border: 0;\n  border-radius: 0.5rem;\n  padding: 0.625rem 0.75rem;\n  background: transparent;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n.app-select__menu--floating .app-select__option:hover {\n  background: var(--nav-hover);\n}\n.app-select__menu--floating .app-select__option--active {\n  background: rgb(241, 245, 249);\n}\n.app-select__menu--floating .app-select__empty {\n  display: flex;\n  min-height: 3rem;\n  align-items: center;\n  justify-content: center;\n  padding: 1rem 1.25rem;\n}\n.app-select__menu--floating .app-select__empty p {\n  margin: 0;\n  font-size: 0.875rem;\n  color: var(--text-secondary);\n}\n.app-select-portal {\n  position: fixed;\n  inset: 0;\n  z-index: var(--z-app-dropdown);\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  align-items: stretch;\n  pointer-events: none;\n}\n@media (min-width: 768px) {\n  .app-select-portal--overlay {\n    justify-content: center;\n    align-items: center;\n    padding: 1rem;\n  }\n}\n.app-select-portal .app-select__backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: calc(var(--z-app-dropdown) - 1);\n  pointer-events: auto;\n  background: rgba(15, 23, 42, 0.45);\n  opacity: 1;\n  transition: opacity 0.22s ease-out;\n}\n@starting-style {\n  .app-select-portal .app-select__backdrop {\n    opacity: 0;\n  }\n}\n.app-select-portal--overlay .app-select__backdrop {\n  background: rgba(0, 0, 0, 0.52);\n}\n.app-select-portal--above-modal .app-select__backdrop {\n  background: rgba(0, 0, 0, 0.55);\n  touch-action: manipulation;\n}\n.app-select-portal--above-modal .app-select__menu--sheet {\n  touch-action: manipulation;\n}\n.app-select-portal .app-select__menu--sheet {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: var(--z-app-dropdown);\n  flex: 0 1 auto;\n  align-self: stretch;\n  display: flex;\n  flex-direction: column;\n  align-content: flex-start;\n  width: 100%;\n  height: auto;\n  max-height: min(70dvh, 100dvh - env(safe-area-inset-top, 0px) - 1rem);\n  max-height: min(70svh, 100svh - env(safe-area-inset-top, 0px) - 1rem);\n  margin: 0;\n  padding: 0.5rem 0 calc(0.75rem + env(safe-area-inset-bottom, 0px));\n  border: none;\n  border-radius: 1rem 1rem 0 0;\n  background: var(--nav-bg);\n  box-shadow: 0 -12px 40px rgba(15, 23, 42, 0.18);\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  pointer-events: auto;\n  list-style: none;\n  transform: translateY(0);\n  transform-origin: bottom center;\n  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);\n}\n@starting-style {\n  .app-select-portal .app-select__menu--sheet {\n    transform: translateY(100%);\n  }\n}\n.app-select-portal .app-select__menu--sheet::before {\n  content: "";\n  display: block;\n  width: 2.5rem;\n  height: 0.25rem;\n  flex-shrink: 0;\n  margin: 0.35rem auto 0.5rem;\n  border-radius: 999px;\n  background: rgba(148, 163, 184, 0.55);\n}\n@media (min-width: 768px) {\n  .app-select-portal .app-select__menu--overlay {\n    align-self: center;\n    width: min(100%, 22rem);\n    max-height: min(70dvh, 100dvh - 2rem);\n    max-height: min(70svh, 100svh - 2rem);\n    margin: 0;\n    padding: 0.375rem;\n    border: 1px solid var(--nav-border);\n    border-radius: 1rem;\n    box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.18), 0 24px 38px 3px rgba(0, 0, 0, 0.12);\n    transform: translateY(0) scale(1);\n    transform-origin: center center;\n    transition: opacity 0.28s cubic-bezier(0.32, 0.72, 0, 1), transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);\n  }\n  @starting-style {\n    .app-select-portal .app-select__menu--overlay {\n      opacity: 0;\n      transform: translateY(0.75rem) scale(0.97);\n    }\n  }\n  .app-select-portal .app-select__menu--overlay::before {\n    display: none;\n  }\n}\n.app-select-portal .app-select__empty {\n  display: flex;\n  min-height: 5rem;\n  align-items: center;\n  justify-content: center;\n  padding: 1.25rem 1.5rem;\n}\n.app-select-portal .app-select__option {\n  flex-shrink: 0;\n  border-radius: 0.5rem;\n  margin: 0 0.5rem;\n  padding: 0.875rem 1rem;\n  font-size: 1rem;\n}\n.app-select-backdrop-leave {\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.18s ease-in;\n}\n.app-select-menu-leave {\n  opacity: 0;\n  transform: translateY(-0.375rem) scale(0.98);\n  transition: opacity 0.18s ease-in, transform 0.22s cubic-bezier(0.32, 0.72, 0, 1);\n}\n.app-select--above .app-select-menu-leave {\n  transform: translateY(0.375rem) scale(0.98);\n}\n.app-select-portal .app-select-menu-leave {\n  opacity: 1;\n  transform: translateY(100%);\n  transition: transform 0.26s cubic-bezier(0.32, 0.72, 0, 1);\n}\n@media (min-width: 768px) {\n  .app-select-portal--overlay .app-select-portal .app-select-menu-leave {\n    opacity: 0;\n    transform: translateY(0.75rem) scale(0.97);\n    transition: opacity 0.22s ease-in, transform 0.22s ease-in;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .app-select__menu,\n  .app-select__menu--floating,\n  .app-select__backdrop,\n  .app-select-backdrop-leave,\n  .app-select-menu-leave {\n    transition: none !important;\n    animation: none !important;\n  }\n  @starting-style {\n    .app-select__menu,\n    .app-select__menu--floating,\n    .app-select__menu--sheet {\n      opacity: 1;\n      transform: none;\n    }\n  }\n}\n/*# sourceMappingURL=app-select.component.css.map */\n'], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppSelectComponent, [{
    type: Component,
    args: [{ selector: "app-select", standalone: true, imports: [NgTemplateOutlet, NgStyle], encapsulation: ViewEncapsulation.None, host: {
      "[class.app-select--has-value]": "hasDisplayValue()"
    }, providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AppSelectComponent),
        multi: true
      }
    ], template: `<div
  class="app-select"
  [class.app-select--open]="open()"
  [class.app-select--above]="menuPlacement() === 'above'"
  [class.app-select--below]="menuPlacement() === 'below'"
  [class.app-select--compact]="size() === 'compact'"
  (click)="$event.stopPropagation()"
  (pointerdown)="$event.stopPropagation()"
>
  <button
    type="button"
    class="app-select__trigger"
    [attr.id]="id()"
    [attr.name]="name()"
    [attr.aria-label]="ariaLabel()"
    [attr.aria-expanded]="open()"
    [disabled]="isDisabled()"
    aria-haspopup="listbox"
    (click)="toggle($event)"
    (pointerdown)="$event.stopPropagation()"
    (touchend)="onTriggerTouchEnd($event)"
  >
    @if (displayDotColor(); as dotColor) {
      <span class="app-select__dot" [style.background-color]="dotColor" aria-hidden="true"></span>
    }
    <span class="app-select__value">{{ displayLabel() }}</span>
    <span class="app-select__chevron" aria-hidden="true"></span>
  </button>
</div>

<ng-template #menuListTpl>
  @if (hasOptions()) {
    @for (option of options(); track option.value) {
      <li role="presentation">
        <button
          type="button"
          class="app-select__option"
          role="option"
          [attr.aria-selected]="isSelected(option)"
          [class.app-select__option--active]="isSelected(option)"
          (click)="selectOption(option, $event)"
        >
          @if (option.dotColor) {
            <span
              class="app-select__dot"
              [style.background-color]="option.dotColor"
              aria-hidden="true"
            ></span>
          }
          {{ option.label }}
        </button>
      </li>
    }
  } @else {
    <li class="app-select__empty" role="presentation">
      <p>{{ resolvedEmptyMessage() }}</p>
    </li>
  }
</ng-template>

<ng-template #bodyPortal>
  @if (open() && useOverlayPanel()) {
    <div
      class="app-select-portal"
      [class.app-select-portal--overlay]="panelMode() === 'overlay'"
      [class.app-select-portal--above-modal]="useMobileBackdropSheet()"
      role="presentation"
    >
      <div
        class="app-select__backdrop"
        role="presentation"
        animate.leave="app-select-backdrop-leave"
        (click)="closeMenu($event)"
      ></div>
      <ul
        class="app-select__menu app-select__menu--sheet"
        [class.app-select__menu--overlay]="panelMode() === 'overlay'"
        role="listbox"
        [attr.aria-label]="ariaLabel() ?? placeholder()"
        animate.leave="app-select-menu-leave"
        (click)="$event.stopPropagation()"
      >
        <ng-container *ngTemplateOutlet="menuListTpl" />
      </ul>
    </div>
  }

  @if (open() && !useOverlayPanel()) {
    <ul
      class="app-select__menu app-select__menu--floating"
      [class.app-select__menu--placement-below]="effectiveMenuPlacement() === 'below'"
      [class.app-select__menu--placement-above]="effectiveMenuPlacement() === 'above'"
      role="listbox"
      [ngStyle]="floatingMenuStyle()"
      animate.leave="app-select-menu-leave"
    >
      <ng-container *ngTemplateOutlet="menuListTpl" />
    </ul>
  }
</ng-template>
`, styles: ['@charset "UTF-8";\n\n/* src/app/shared/app-select/app-select.component.scss */\n:host {\n  display: block;\n  width: 100%;\n}\n.field--select app-select .app-select__trigger,\n:host-context(.field--select) .app-select__trigger {\n  align-items: flex-end;\n  min-height: 2.75rem;\n  padding-top: 1.125rem;\n  padding-bottom: 0.375rem;\n}\n.app-select {\n  position: relative;\n  width: 100%;\n}\n.app-select--open {\n  z-index: 30;\n}\n.app-select__trigger {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  width: 100%;\n  min-height: 2.5rem;\n  padding: 8px 12px;\n  border: 1px solid var(--nav-border);\n  border-radius: 6px;\n  background: var(--page-bg);\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--text-primary);\n  text-align: left;\n  cursor: pointer;\n  transition:\n    border-color 0.15s ease,\n    background-color 0.15s ease,\n    box-shadow 0.15s ease;\n}\n.app-select__trigger:hover:not(:disabled) {\n  border-color: var(--text-secondary);\n}\n.app-select__trigger:focus-visible {\n  border-color: var(--nav-accent);\n  outline: none;\n  box-shadow: 0 0 0 1px var(--nav-accent);\n}\n.app-select__trigger:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.app-select--compact .app-select__trigger {\n  min-height: 2.5rem;\n  border-radius: 0.5rem;\n  font-size: 0.8125rem;\n}\n.app-select__value {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.app-select__dot {\n  width: 0.5rem;\n  height: 0.5rem;\n  border-radius: 50%;\n  flex-shrink: 0;\n}\n.app-select__chevron {\n  flex-shrink: 0;\n  width: 0.5rem;\n  height: 0.5rem;\n  margin-left: auto;\n  border-right: 2px solid var(--text-secondary);\n  border-bottom: 2px solid var(--text-secondary);\n  transform: rotate(45deg) translateY(-2px);\n  transition: transform 0.15s ease;\n}\n.app-select--open .app-select__chevron {\n  transform: rotate(-135deg) translateY(2px);\n}\n.app-select__menu {\n  position: absolute;\n  left: 0;\n  right: 0;\n  z-index: 40;\n  margin: 0;\n  padding: 0.375rem;\n  list-style: none;\n  max-height: min(16rem, 40dvh);\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  border: 1px solid var(--nav-border);\n  border-radius: 6px;\n  background: var(--nav-bg);\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);\n  opacity: 1;\n  transform: translateY(0) scale(1);\n  transition: opacity 0.22s ease-out, transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);\n}\n@starting-style {\n  .app-select__menu {\n    opacity: 0;\n    transform: translateY(-0.375rem) scale(0.98);\n  }\n}\n.app-select--below .app-select__menu {\n  top: calc(100% + 0.25rem);\n  transform-origin: top center;\n}\n@starting-style {\n  .app-select--below .app-select__menu {\n    transform: translateY(-0.375rem) scale(0.98);\n  }\n}\n.app-select--above .app-select__menu {\n  bottom: calc(100% + 0.25rem);\n  transform-origin: bottom center;\n}\n@starting-style {\n  .app-select--above .app-select__menu {\n    transform: translateY(0.375rem) scale(0.98);\n  }\n}\n.app-select__empty {\n  padding: 1rem 1.25rem;\n  text-align: center;\n}\n.app-select__empty p {\n  margin: 0;\n  font-size: 0.875rem;\n  line-height: 1.45;\n  color: var(--text-secondary);\n}\n.app-select__option {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  width: 100%;\n  border: 0;\n  border-radius: 0.75rem;\n  padding: 0.625rem 0.75rem;\n  background: transparent;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n.app-select__option:hover {\n  background: var(--nav-hover);\n}\n.app-select__option--active {\n  background: rgb(241, 245, 249);\n}\n.app-select-portal-host {\n  position: absolute;\n  width: 0;\n  height: 0;\n  overflow: visible;\n  pointer-events: none;\n  z-index: auto;\n}\n.app-select-portal-host--overlay {\n  position: fixed;\n  inset: 0;\n  width: auto;\n  height: auto;\n  z-index: var(--z-app-dropdown);\n  pointer-events: none;\n  overflow: visible;\n  isolation: isolate;\n}\nhtml.app-select-dropdown-open .app-select-portal-host--overlay {\n  z-index: var(--z-app-dropdown);\n}\n.app-select__menu--floating {\n  position: fixed;\n  z-index: var(--z-app-dropdown);\n  margin: 0;\n  padding: 0.375rem;\n  list-style: none;\n  max-height: min(16rem, 40dvh);\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  pointer-events: auto;\n  border: 1px solid var(--nav-border);\n  border-radius: 6px;\n  background: var(--nav-bg);\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);\n  opacity: 1;\n  transform: translateY(0) scale(1);\n  transition: opacity 0.22s ease-out, transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);\n}\n.app-select__menu--floating.app-select__menu--placement-below {\n  transform-origin: top center;\n}\n@starting-style {\n  .app-select__menu--floating.app-select__menu--placement-below {\n    opacity: 0;\n    transform: translateY(-0.375rem) scale(0.98);\n  }\n}\n.app-select__menu--floating.app-select__menu--placement-above {\n  transform-origin: bottom center;\n}\n@starting-style {\n  .app-select__menu--floating.app-select__menu--placement-above {\n    opacity: 0;\n    transform: translateY(0.375rem) scale(0.98);\n  }\n}\n.app-select__menu--floating .app-select__option {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  width: 100%;\n  border: 0;\n  border-radius: 0.5rem;\n  padding: 0.625rem 0.75rem;\n  background: transparent;\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n.app-select__menu--floating .app-select__option:hover {\n  background: var(--nav-hover);\n}\n.app-select__menu--floating .app-select__option--active {\n  background: rgb(241, 245, 249);\n}\n.app-select__menu--floating .app-select__empty {\n  display: flex;\n  min-height: 3rem;\n  align-items: center;\n  justify-content: center;\n  padding: 1rem 1.25rem;\n}\n.app-select__menu--floating .app-select__empty p {\n  margin: 0;\n  font-size: 0.875rem;\n  color: var(--text-secondary);\n}\n.app-select-portal {\n  position: fixed;\n  inset: 0;\n  z-index: var(--z-app-dropdown);\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  align-items: stretch;\n  pointer-events: none;\n}\n@media (min-width: 768px) {\n  .app-select-portal--overlay {\n    justify-content: center;\n    align-items: center;\n    padding: 1rem;\n  }\n}\n.app-select-portal .app-select__backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: calc(var(--z-app-dropdown) - 1);\n  pointer-events: auto;\n  background: rgba(15, 23, 42, 0.45);\n  opacity: 1;\n  transition: opacity 0.22s ease-out;\n}\n@starting-style {\n  .app-select-portal .app-select__backdrop {\n    opacity: 0;\n  }\n}\n.app-select-portal--overlay .app-select__backdrop {\n  background: rgba(0, 0, 0, 0.52);\n}\n.app-select-portal--above-modal .app-select__backdrop {\n  background: rgba(0, 0, 0, 0.55);\n  touch-action: manipulation;\n}\n.app-select-portal--above-modal .app-select__menu--sheet {\n  touch-action: manipulation;\n}\n.app-select-portal .app-select__menu--sheet {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: var(--z-app-dropdown);\n  flex: 0 1 auto;\n  align-self: stretch;\n  display: flex;\n  flex-direction: column;\n  align-content: flex-start;\n  width: 100%;\n  height: auto;\n  max-height: min(70dvh, 100dvh - env(safe-area-inset-top, 0px) - 1rem);\n  max-height: min(70svh, 100svh - env(safe-area-inset-top, 0px) - 1rem);\n  margin: 0;\n  padding: 0.5rem 0 calc(0.75rem + env(safe-area-inset-bottom, 0px));\n  border: none;\n  border-radius: 1rem 1rem 0 0;\n  background: var(--nav-bg);\n  box-shadow: 0 -12px 40px rgba(15, 23, 42, 0.18);\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  pointer-events: auto;\n  list-style: none;\n  transform: translateY(0);\n  transform-origin: bottom center;\n  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);\n}\n@starting-style {\n  .app-select-portal .app-select__menu--sheet {\n    transform: translateY(100%);\n  }\n}\n.app-select-portal .app-select__menu--sheet::before {\n  content: "";\n  display: block;\n  width: 2.5rem;\n  height: 0.25rem;\n  flex-shrink: 0;\n  margin: 0.35rem auto 0.5rem;\n  border-radius: 999px;\n  background: rgba(148, 163, 184, 0.55);\n}\n@media (min-width: 768px) {\n  .app-select-portal .app-select__menu--overlay {\n    align-self: center;\n    width: min(100%, 22rem);\n    max-height: min(70dvh, 100dvh - 2rem);\n    max-height: min(70svh, 100svh - 2rem);\n    margin: 0;\n    padding: 0.375rem;\n    border: 1px solid var(--nav-border);\n    border-radius: 1rem;\n    box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.18), 0 24px 38px 3px rgba(0, 0, 0, 0.12);\n    transform: translateY(0) scale(1);\n    transform-origin: center center;\n    transition: opacity 0.28s cubic-bezier(0.32, 0.72, 0, 1), transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);\n  }\n  @starting-style {\n    .app-select-portal .app-select__menu--overlay {\n      opacity: 0;\n      transform: translateY(0.75rem) scale(0.97);\n    }\n  }\n  .app-select-portal .app-select__menu--overlay::before {\n    display: none;\n  }\n}\n.app-select-portal .app-select__empty {\n  display: flex;\n  min-height: 5rem;\n  align-items: center;\n  justify-content: center;\n  padding: 1.25rem 1.5rem;\n}\n.app-select-portal .app-select__option {\n  flex-shrink: 0;\n  border-radius: 0.5rem;\n  margin: 0 0.5rem;\n  padding: 0.875rem 1rem;\n  font-size: 1rem;\n}\n.app-select-backdrop-leave {\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.18s ease-in;\n}\n.app-select-menu-leave {\n  opacity: 0;\n  transform: translateY(-0.375rem) scale(0.98);\n  transition: opacity 0.18s ease-in, transform 0.22s cubic-bezier(0.32, 0.72, 0, 1);\n}\n.app-select--above .app-select-menu-leave {\n  transform: translateY(0.375rem) scale(0.98);\n}\n.app-select-portal .app-select-menu-leave {\n  opacity: 1;\n  transform: translateY(100%);\n  transition: transform 0.26s cubic-bezier(0.32, 0.72, 0, 1);\n}\n@media (min-width: 768px) {\n  .app-select-portal--overlay .app-select-portal .app-select-menu-leave {\n    opacity: 0;\n    transform: translateY(0.75rem) scale(0.97);\n    transition: opacity 0.22s ease-in, transform 0.22s ease-in;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .app-select__menu,\n  .app-select__menu--floating,\n  .app-select__backdrop,\n  .app-select-backdrop-leave,\n  .app-select-menu-leave {\n    transition: none !important;\n    animation: none !important;\n  }\n  @starting-style {\n    .app-select__menu,\n    .app-select__menu--floating,\n    .app-select__menu--sheet {\n      opacity: 1;\n      transform: none;\n    }\n  }\n}\n/*# sourceMappingURL=app-select.component.css.map */\n'] }]
  }], () => [], { bodyPortalTpl: [{ type: ViewChild, args: ["bodyPortal", { isSignal: true }] }], options: [{ type: Input, args: [{ isSignal: true, alias: "options", required: true }] }], emptyMessage: [{ type: Input, args: [{ isSignal: true, alias: "emptyMessage", required: false }] }], placeholder: [{ type: Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], menuPlacement: [{ type: Input, args: [{ isSignal: true, alias: "menuPlacement", required: false }] }], panelMode: [{ type: Input, args: [{ isSignal: true, alias: "panelMode", required: false }] }], mobileBackdropSheet: [{ type: Input, args: [{ isSignal: true, alias: "mobileBackdropSheet", required: false }] }], size: [{ type: Input, args: [{ isSignal: true, alias: "size", required: false }] }], disabled: [{ type: Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], name: [{ type: Input, args: [{ isSignal: true, alias: "name", required: false }] }], id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: false }] }], ariaLabel: [{ type: Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }], closeOnEscape: [{
    type: HostListener,
    args: ["document:keydown.escape"]
  }], closeOnOverlayLayerOpen: [{
    type: HostListener,
    args: [`document:${APP_OVERLAY_LAYER_OPEN}`]
  }], closeOnOutsideClick: [{
    type: HostListener,
    args: ["document:click", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppSelectComponent, { className: "AppSelectComponent", filePath: "app/shared/app-select/app-select.component.ts", lineNumber: 64 });
})();

export {
  AppSelectComponent
};
//# sourceMappingURL=chunk-VZTTL7NS.js.map
