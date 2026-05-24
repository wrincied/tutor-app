import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ApplicationRef,
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  EmbeddedViewRef,
  forwardRef,
  HostListener,
  inject,
  Injector,
  input,
  OnDestroy,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  APP_OVERLAY_LAYER_OPEN,
  APP_SELECT_DROPDOWN_OPEN_CLASS,
  APP_SELECT_PORTAL_ROOT,
} from '../../core/constants/overlay-layer';
import { I18nService } from '../../core/services/i18n.service';

export interface AppSelectOption {
  value: string;
  label: string;
  /** Цветная точка слева (статусы урока и т.п.). */
  dotColor?: string;
}

type MenuAnchor = {
  left: number;
  top: number;
  bottom: number;
  width: number;
};

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [NgTemplateOutlet, NgStyle],
  templateUrl: './app-select.component.html',
  styleUrl: './app-select.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppSelectComponent),
      multi: true,
    },
  ],
})
export class AppSelectComponent implements ControlValueAccessor, OnDestroy {
  /** Сколько select-меню сейчас открыто (для z-index на html). */
  private static dropdownOpenCount = 0;

  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly i18n = inject(I18nService);
  private readonly document = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(Injector);
  private readonly vcr = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  private readonly bodyPortalTpl = viewChild<TemplateRef<unknown>>('bodyPortal');

  private portalHost: HTMLElement | null = null;
  private bodyOutlet: DomPortalOutlet | null = null;
  private attachedPortal: EmbeddedViewRef<unknown> | null = null;
  /** На touch-устройствах тот же tap закрывает меню через document:click — пропускаем один раз. */
  private ignoreNextOutsideClick = false;
  /** touchend + click на iOS/Android — не обрабатывать click сразу после touch. */
  private suppressClickUntil = 0;
  private dropdownTopLayerRaised = false;

  options = input.required<readonly AppSelectOption[]>();
  /** Текст, если options пустой (иначе общий «Нет данных»). */
  emptyMessage = input<string | null>(null);
  placeholder = input<string | null>(null);
  menuPlacement = input<'above' | 'below'>('below');
  /** overlay — поверх UI с затемнением (Material), auto — как раньше */
  panelMode = input<'auto' | 'overlay'>('auto');
  /** На телефоне: bottom sheet + затемнение поверх модалок (статус урока и т.п.). */
  mobileBackdropSheet = input(false, { transform: booleanAttribute });
  size = input<'default' | 'compact'>('default');
  disabled = input(false, { transform: booleanAttribute });
  name = input<string | undefined>();
  id = input<string | undefined>();
  ariaLabel = input<string | undefined>();

  protected readonly open = signal(false);
  protected readonly value = signal('');
  protected readonly mobileSheet = signal(this.readMobileViewport());
  private readonly menuAnchor = signal<MenuAnchor | null>(null);
  private readonly effectiveMenuPlacement = signal<'above' | 'below'>('below');

  protected readonly useOverlayPanel = computed(() => {
    if (this.panelMode() === 'overlay') {
      return true;
    }
    if (this.mobileBackdropSheet() && this.mobileSheet()) {
      return true;
    }
    // На desktop — выпадающий список у триггера; sheet только на узком экране
    return this.menuPlacement() === 'below' && this.mobileSheet();
  });

  protected readonly useMobileBackdropSheet = computed(
    () => this.useOverlayPanel() && this.mobileSheet() && this.mobileBackdropSheet(),
  );

  protected readonly floatingMenuStyle = computed((): Record<string, string> => {
    const anchor = this.menuAnchor();
    if (!anchor) {
      return {};
    }
    const base: Record<string, string> = {
      position: 'fixed',
      zIndex: 'var(--z-app-dropdown)',
      left: `${anchor.left}px`,
      width: `${anchor.width}px`,
      margin: '0',
    };
    if (this.effectiveMenuPlacement() === 'below') {
      return { ...base, top: `${anchor.bottom + 4}px`, bottom: 'auto' };
    }
    const viewportH = this.document.defaultView?.innerHeight ?? 0;
    return {
      ...base,
      top: 'auto',
      bottom: `${viewportH - anchor.top + 4}px`,
    };
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private readonly cvaDisabled = signal(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected readonly hasOptions = computed(() => this.options().length > 0);

  protected readonly resolvedEmptyMessage = computed(
    () => this.emptyMessage() ?? this.i18n.sharedUi().selectNoData,
  );

  protected readonly selectedOption = computed(() =>
    this.options().find((opt) => opt.value === this.value()),
  );

  protected readonly displayLabel = computed(() => {
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
    return this.value() || placeholder || '';
  });

  protected readonly displayDotColor = computed(
    () => this.selectedOption()?.dotColor ?? null,
  );

  constructor() {
    afterNextRender(() => {
      const mq = window.matchMedia('(max-width: 767px)');
      const sync = () => this.mobileSheet.set(mq.matches);
      sync();
      mq.addEventListener('change', sync);
      this.destroyRef.onDestroy(() => mq.removeEventListener('change', sync));

      const onViewportChange = () => {
        if (this.open() && !this.useOverlayPanel()) {
          this.updateMenuAnchor();
        }
      };
      window.addEventListener('resize', onViewportChange);
      window.addEventListener('scroll', onViewportChange, true);
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('resize', onViewportChange);
        window.removeEventListener('scroll', onViewportChange, true);
      });
    });
  }

  ngOnDestroy(): void {
    this.lowerDropdownTopLayer();
    this.destroyBodyPortal();
  }

  writeValue(value: string | null | undefined): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  onTriggerTouchEnd(event: TouchEvent): void {
    if (this.isDisabled()) {
      return;
    }
    event.preventDefault();
    this.suppressClickUntil = Date.now() + 500;
    this.toggleFromUser(event);
  }

  toggle(event: MouseEvent): void {
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

  private toggleFromUser(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) {
      return;
    }
    const willOpen = !this.open();
    if (willOpen) {
      this.armIgnoreOutsideClick();
      // Сначала закрыть другие оверлеи; open ещё false — иначе closeOnOverlayLayerOpen закроет нас же
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

  private setClosed(): void {
    this.lowerDropdownTopLayer();
    this.open.set(false);
    this.detachBodyPortal();
    this.removePortalHostFromBody();
  }

  private raiseDropdownTopLayer(): void {
    if (this.dropdownTopLayerRaised) {
      return;
    }
    this.dropdownTopLayerRaised = true;
    AppSelectComponent.dropdownOpenCount++;
    this.syncDropdownTopLayerClass();
  }

  private lowerDropdownTopLayer(): void {
    if (!this.dropdownTopLayerRaised) {
      return;
    }
    this.dropdownTopLayerRaised = false;
    AppSelectComponent.dropdownOpenCount = Math.max(0, AppSelectComponent.dropdownOpenCount - 1);
    this.syncDropdownTopLayerClass();
  }

  private syncDropdownTopLayerClass(): void {
    this.document.documentElement.classList.toggle(
      APP_SELECT_DROPDOWN_OPEN_CLASS,
      AppSelectComponent.dropdownOpenCount > 0,
    );
  }

  private syncPortalLayer(): void {
    this.attachBodyPortal();
    this.bringPortalToFront();
    if (!this.useOverlayPanel()) {
      this.updateMenuAnchor();
    }
  }

  selectOption(option: AppSelectOption, event: MouseEvent): void {
    event.stopPropagation();
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.setClosed();
  }

  closeMenu(event: Event): void {
    event.stopPropagation();
    if (!this.open()) {
      return;
    }
    this.setClosed();
    this.onTouched();
  }

  isSelected(option: AppSelectOption): boolean {
    return this.value() === option.value;
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (this.open()) {
      this.setClosed();
      this.onTouched();
    }
  }

  @HostListener(`document:${APP_OVERLAY_LAYER_OPEN}`)
  closeOnOverlayLayerOpen(): void {
    if (this.open()) {
      this.setClosed();
    }
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent): void {
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

  private readMobileViewport(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(max-width: 767px)').matches;
  }

  private armIgnoreOutsideClick(): void {
    this.ignoreNextOutsideClick = true;
    const delay = this.mobileSheet() ? 600 : 400;
    this.document.defaultView?.setTimeout(() => {
      this.ignoreNextOutsideClick = false;
    }, delay);
  }

  private updateMenuAnchor(): void {
    const trigger = this.hostEl.nativeElement.querySelector(
      '.app-select__trigger',
    ) as HTMLElement | null;
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
    if (placement === 'below' && spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow) {
      placement = 'above';
    } else if (placement === 'above' && spaceAbove < estimatedMenuHeight && spaceBelow > spaceAbove) {
      placement = 'below';
    }

    this.effectiveMenuPlacement.set(placement);
    this.menuAnchor.set({
      left: rect.left,
      top: rect.top,
      bottom: rect.bottom,
      width: rect.width,
    });
  }

  private getPortalRoot(): HTMLElement {
    return this.document.querySelector(APP_SELECT_PORTAL_ROOT) ?? this.document.body;
  }

  private getOrCreatePortalHost(): HTMLElement {
    if (!this.portalHost) {
      this.portalHost = this.document.createElement('div');
      this.portalHost.className = 'app-select-portal-host';
    }
    this.portalHost.classList.toggle('app-select-portal-host--overlay', this.useOverlayPanel());
    this.getPortalRoot().appendChild(this.portalHost);
    return this.portalHost;
  }

  private bringPortalToFront(): void {
    if (this.portalHost) {
      this.getPortalRoot().appendChild(this.portalHost);
    }
  }

  private removePortalHostFromBody(): void {
    if (this.portalHost?.parentNode) {
      this.portalHost.parentNode.removeChild(this.portalHost);
    }
  }

  private attachBodyPortal(): void {
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

  private detachBodyPortal(): void {
    if (this.bodyOutlet?.hasAttached()) {
      this.bodyOutlet.detach();
    }
    this.attachedPortal = null;
  }

  private destroyBodyPortal(): void {
    this.detachBodyPortal();
    if (this.bodyOutlet) {
      this.bodyOutlet.dispose();
      this.bodyOutlet = null;
    }
    this.removePortalHostFromBody();
    this.portalHost = null;
  }
}
