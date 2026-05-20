import { booleanAttribute, Component, input, output } from '@angular/core';

export type AppDialogVariant = 'default' | 'error';

@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './app-dialog.component.html',
  styleUrl: './app-dialog.component.scss',
})
export class AppDialogComponent {
  open = input(false, { transform: booleanAttribute });
  title = input.required<string>();
  variant = input<AppDialogVariant>('default');
  layout = input<'center' | 'sheet'>('center');
  iconSrc = input<string | null>(null);
  cancelLabel = input<string | null>(null);
  confirmLabel = input<string | null>(null);
  /** Одна кнопка (например «Понятно») — если нет confirm/cancel. */
  dismissLabel = input<string | null>(null);
  closeOnOverlay = input(true, { transform: booleanAttribute });

  readonly cancel = output<void>();
  readonly confirm = output<void>();

  onOverlayClick(): void {
    if (this.closeOnOverlay()) {
      this.cancel.emit();
    }
  }

  onDismiss(): void {
    this.confirm.emit();
  }
}
