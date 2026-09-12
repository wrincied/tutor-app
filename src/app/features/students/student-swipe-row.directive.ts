import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
} from '@angular/core';

export type StudentSwipeTouchPayload = {
  id: string;
  x: number;
  y: number;
  base: number;
};

export type StudentSwipeMovePayload = {
  id: string;
  dx: number;
  dy: number;
};

@Directive({
  selector: '[appStudentSwipeRow]',
  standalone: true,
})
export class StudentSwipeRowDirective {
  readonly rowId = input.required<string>({ alias: 'appStudentSwipeRow' });
  readonly swipeBase = input(0);
  readonly swipeEnabled = input(true);

  readonly rowSwipeStart = output<StudentSwipeTouchPayload>();
  readonly rowSwipeMove = output<StudentSwipeMovePayload>();
  readonly rowSwipeEnd = output<StudentSwipeMovePayload>();

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private tracking = false;
  private lockHorizontal = false;
  private startX = 0;
  private startY = 0;

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;

      const onStart = (event: TouchEvent) => {
        if (!this.swipeEnabled()) {
          return;
        }
        const touch = event.touches[0];
        if (!touch) {
          return;
        }
        this.tracking = true;
        this.lockHorizontal = false;
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.rowSwipeStart.emit({
          id: this.rowId(),
          x: touch.clientX,
          y: touch.clientY,
          base: this.swipeBase(),
        });
      };

      const onMove = (event: TouchEvent) => {
        if (!this.tracking || !this.swipeEnabled()) {
          return;
        }
        const touch = event.touches[0];
        if (!touch) {
          return;
        }
        const dx = touch.clientX - this.startX;
        const dy = touch.clientY - this.startY;
        if (!this.lockHorizontal) {
          if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
            return;
          }
          this.lockHorizontal = Math.abs(dx) >= Math.abs(dy);
        }
        if (this.lockHorizontal) {
          event.preventDefault();
        }
        this.rowSwipeMove.emit({
          id: this.rowId(),
          dx,
          dy,
        });
      };

      const onEnd = (event: TouchEvent) => {
        if (!this.tracking) {
          return;
        }
        this.tracking = false;
        const touch = event.changedTouches[0];
        if (!touch) {
          return;
        }
        this.rowSwipeEnd.emit({
          id: this.rowId(),
          dx: touch.clientX - this.startX,
          dy: touch.clientY - this.startY,
        });
        this.lockHorizontal = false;
      };

      node.addEventListener('touchstart', onStart, { passive: true });
      node.addEventListener('touchmove', onMove, { passive: false });
      node.addEventListener('touchend', onEnd, { passive: true });
      node.addEventListener('touchcancel', onEnd, { passive: true });

      this.destroyRef.onDestroy(() => {
        node.removeEventListener('touchstart', onStart);
        node.removeEventListener('touchmove', onMove);
        node.removeEventListener('touchend', onEnd);
        node.removeEventListener('touchcancel', onEnd);
      });
    });
  }
}
