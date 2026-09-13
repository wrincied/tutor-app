import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
  signal,
} from '@angular/core';

/** Scroll-into-view fade/rise. Adds `.u-reveal` + `.u-reveal--in` when visible. */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    class: 'u-reveal',
    '[class.u-reveal--in]': 'inView()',
  },
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  /** Root margin for earlier/later trigger (CSS margin syntax). */
  readonly rootMargin = input('0px 0px -8% 0px');
  /** If true, reveal immediately without waiting for scroll. */
  readonly immediate = input(false);

  private readonly el = inject(ElementRef<HTMLElement>);
  readonly inView = signal(false);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      this.inView.set(true);
      return;
    }
    if (this.immediate() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.inView.set(true);
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.inView.set(true);
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { root: null, rootMargin: this.rootMargin(), threshold: 0.12 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
