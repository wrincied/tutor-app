import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';

let helpTipSeq = 0;

@Component({
  selector: 'app-help-tip',
  standalone: true,
  templateUrl: './help-tip.component.html',
  styleUrl: './help-tip.component.scss',
})
export class HelpTipComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Accessible name for the "?" control */
  readonly label = input.required<string>();
  /** Explanation shown in the bubble */
  readonly text = input.required<string>();

  readonly open = signal(false);
  readonly panelId = `help-tip-panel-${++helpTipSeq}`;

  toggle(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.open.update((v) => !v);
  }

  onPointerEnter(): void {
    if (this.supportsHover()) {
      this.open.set(true);
    }
  }

  onPointerLeave(): void {
    if (this.supportsHover()) {
      this.open.set(false);
    }
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (!this.open()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && this.host.nativeElement.contains(target)) {
      return;
    }
    this.open.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open.set(false);
  }

  private supportsHover(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
  }
}
