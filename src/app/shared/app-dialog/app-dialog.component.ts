import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  booleanAttribute,
  Component,
  DestroyRef,
  effect,
  EmbeddedViewRef,
  inject,
  Injector,
  input,
  OnDestroy,
  output,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { APP_OVERLAY_LAYER_OPEN } from '../../core/constants/overlay-layer';
import { purgeStaleOverlayLayers } from '../../core/utils/purge-stale-overlay-layers';

export type AppDialogVariant = 'default' | 'error';
export type AppDialogSize = 'sm' | 'md' | 'lg' | 'lesson';

@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './app-dialog.component.html',
  styleUrl: './app-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppDialogComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(Injector);
  private readonly vcr = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  private readonly overlayPortalTpl = viewChild<TemplateRef<unknown>>('overlayPortal');

  private portalHost: HTMLElement | null = null;
  private bodyOutlet: DomPortalOutlet | null = null;
  private attachedPortal: EmbeddedViewRef<unknown> | null = null;
  private detachScheduled: ReturnType<typeof setTimeout> | null = null;

  /** Дольше самой leave-анимации (.modal-sheet-leave ≈ 320ms). */
  private static readonly LEAVE_MS = 360;

  open = input(false, { transform: booleanAttribute });
  title = input.required<string>();
  variant = input<AppDialogVariant>('default');
  /** `drawer` — телефон: bottom sheet; ≥768px: slide-over справа. */
  layout = input<'center' | 'sheet' | 'drawer'>('center');
  /**
   * Desktop width for center/sheet: sm 480 / md 560 / lg ~640+.
   * Ignored for drawer width. On &lt;768px always full-bleed bottom sheet.
   */
  size = input<AppDialogSize>('md');
  /** @deprecated Prefer size="lg". Kept as alias. */
  wide = input(false, { transform: booleanAttribute });
  iconSrc = input<string | null>(null);
  cancelLabel = input<string | null>(null);
  /** Красная кнопка отмены (как btn-link.danger). */
  cancelDanger = input(false, { transform: booleanAttribute });
  /** Левая кнопка в actions (например «Удалить»), отдельно от cancel/confirm. */
  leadingLabel = input<string | null>(null);
  leadingDanger = input(false, { transform: booleanAttribute });
  confirmLabel = input<string | null>(null);
  /** Красная кнопка подтверждения (удаление и т.п.). */
  confirmDanger = input(false, { transform: booleanAttribute });
  /** Блокирует кнопку подтверждения (например конфликт расписания). */
  confirmDisabled = input(false, { transform: booleanAttribute });
  /** Одна кнопка (например «Понятно») — если нет confirm/cancel. */
  dismissLabel = input<string | null>(null);
  /** Средняя кнопка между «Отмена» и основным подтверждением (три действия). */
  secondaryLabel = input<string | null>(null);
  closeOnOverlay = input(true, { transform: booleanAttribute });
  /** Поверх родительской app-dialog (nested backdrop 1100 / panel 1110). */
  stackOnTop = input(false, { transform: booleanAttribute });
  /** Скрыть стандартный title (кастомный header в content). */
  hideTitle = input(false, { transform: booleanAttribute });
  /** Drag-handle для sheet (мобильный bottom sheet). */
  showHandle = input(false, { transform: booleanAttribute });
  /** Кнопка × в шапке (закрывает через cancel). */
  showClose = input(false, { transform: booleanAttribute });
  /** aria-label для кнопки закрытия. */
  closeAriaLabel = input('Close');

  readonly cancelled = output<void>({ alias: 'cancel' });
  readonly secondaryAction = output<void>({ alias: 'secondary' });
  readonly confirmed = output<void>({ alias: 'confirm' });
  readonly leadingAction = output<void>({ alias: 'leading' });

  /** wide=true → lg for backward compatibility. */
  effectiveSize(): AppDialogSize {
    if (this.wide()) {
      return 'lg';
    }
    return this.size();
  }

  constructor() {
    effect(() => {
      if (this.open()) {
        this.cancelScheduledDetach();
        purgeStaleOverlayLayers(this.document);
        this.document.dispatchEvent(new CustomEvent(APP_OVERLAY_LAYER_OPEN));
        this.syncPortal();
        this.bindEscape();
      } else if (this.bodyOutlet?.hasAttached()) {
        this.unbindEscape();
        this.scheduleDetachPortal();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.unbindEscape();
      this.destroyPortal();
    });
  }

  ngOnDestroy(): void {
    this.unbindEscape();
    this.destroyPortal();
  }

  onOverlayClick(): void {
    if (this.closeOnOverlay()) {
      this.cancelled.emit();
    }
  }

  onCancelClick(): void {
    this.cancelled.emit();
  }

  onCloseClick(): void {
    this.cancelled.emit();
  }

  onLeadingClick(): void {
    this.leadingAction.emit();
  }

  onSecondaryClick(): void {
    this.secondaryAction.emit();
  }

  onConfirmClick(): void {
    this.confirmed.emit();
  }

  onDismiss(): void {
    this.cancelled.emit();
  }

  private readonly onEscapeKey = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.open()) {
      return;
    }
    // Только диалоги, которые можно закрыть overlay/крестиком (не «жёсткие» формы).
    if (!this.closeOnOverlay() && !this.showClose()) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.cancelled.emit();
  };

  private bindEscape(): void {
    this.document.addEventListener('keydown', this.onEscapeKey, true);
  }

  private unbindEscape(): void {
    this.document.removeEventListener('keydown', this.onEscapeKey, true);
  }

  private syncPortal(): void {
    this.attachPortal();
  }

  private getPortalHost(): HTMLElement {
    if (!this.portalHost) {
      this.portalHost = this.document.createElement('div');
      this.portalHost.className = 'app-dialog-portal-host';
    }
    this.document.body.appendChild(this.portalHost);
    return this.portalHost;
  }

  private attachPortal(): void {
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

  private cancelScheduledDetach(): void {
    if (this.detachScheduled !== null) {
      clearTimeout(this.detachScheduled);
      this.detachScheduled = null;
    }
  }

  /** Даём @if (open()) и animate.leave завершиться до detach CDK-портала. */
  private scheduleDetachPortal(): void {
    if (this.detachScheduled !== null) {
      return;
    }
    this.detachScheduled = setTimeout(() => {
      this.detachScheduled = null;
      if (!this.open()) {
        this.detachPortal();
      }
    }, AppDialogComponent.LEAVE_MS);
  }

  private detachPortal(): void {
    this.cancelScheduledDetach();
    if (this.bodyOutlet?.hasAttached()) {
      this.bodyOutlet.detach();
    }
    this.attachedPortal = null;
    if (this.portalHost?.parentNode) {
      this.portalHost.parentNode.removeChild(this.portalHost);
    }
  }

  private destroyPortal(): void {
    this.detachPortal();
    if (this.bodyOutlet) {
      this.bodyOutlet.dispose();
      this.bodyOutlet = null;
    }
    this.portalHost = null;
  }
}
