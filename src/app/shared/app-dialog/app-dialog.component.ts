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

  open = input(false, { transform: booleanAttribute });
  title = input.required<string>();
  variant = input<AppDialogVariant>('default');
  layout = input<'center' | 'sheet'>('center');
  iconSrc = input<string | null>(null);
  cancelLabel = input<string | null>(null);
  /** Красная кнопка отмены (как btn-link.danger). */
  cancelDanger = input(false, { transform: booleanAttribute });
  confirmLabel = input<string | null>(null);
  /** Одна кнопка (например «Понятно») — если нет confirm/cancel. */
  dismissLabel = input<string | null>(null);
  /** Средняя кнопка между «Отмена» и основным подтверждением (три действия). */
  secondaryLabel = input<string | null>(null);
  closeOnOverlay = input(true, { transform: booleanAttribute });
  /** Поверх select-backdrop (z-index 1300). */
  stackOnTop = input(false, { transform: booleanAttribute });

  readonly cancel = output<void>();
  readonly secondary = output<void>();
  readonly confirm = output<void>();

  constructor() {
    effect(() => {
      if (this.open()) {
        purgeStaleOverlayLayers(this.document);
        this.document.dispatchEvent(new CustomEvent(APP_OVERLAY_LAYER_OPEN));
        this.syncPortal();
      } else {
        this.detachPortal();
      }
    });

    this.destroyRef.onDestroy(() => this.destroyPortal());
  }

  ngOnDestroy(): void {
    this.destroyPortal();
  }

  onOverlayClick(): void {
    if (this.closeOnOverlay()) {
      this.cancel.emit();
    }
  }

  onCancelClick(): void {
    this.cancel.emit();
  }

  onSecondaryClick(): void {
    this.secondary.emit();
  }

  onConfirmClick(): void {
    this.confirm.emit();
  }

  onDismiss(): void {
    this.cancel.emit();
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

  private detachPortal(): void {
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
