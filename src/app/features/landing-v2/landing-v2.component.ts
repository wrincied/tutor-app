import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Lang } from '@interfaces';
import { I18nService } from '../../core/services/i18n.service';
import { PublicContentService } from '../../core/services/public-content.service';

const DEMO_AUTOPLAY_MS = 10_000;

/** Design-only landing preview. Shown at `/` when designMode is on. */
@Component({
  selector: 'app-landing-v2',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-v2.component.html',
  styleUrl: './landing-v2.component.scss',
})
export class LandingV2Component implements OnInit, OnDestroy {
  readonly i18n = inject(I18nService);
  private readonly publicContent = inject(PublicContentService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly contactEmail = signal('support@simple4u.com');
  readonly demoSlide = signal(0);
  readonly demoSlideCount = 3;
  readonly langMenuOpen = signal(false);
  readonly currentLangCode = computed(() => this.i18n.lang().toUpperCase());

  private pointerStartX: number | null = null;
  private autoplayId: ReturnType<typeof setInterval> | null = null;

  /** Stack depth relative to the active slide (0 = front). */
  demoStack(index: number): 0 | 1 | 2 {
    const cur = this.demoSlide();
    const n = this.demoSlideCount;
    return ((index - cur + n) % n) as 0 | 1 | 2;
  }

  ngOnInit(): void {
    this.publicContent.getContact().subscribe({
      next: (info) => {
        if (info.email) {
          this.contactEmail.set(info.email);
        }
      },
      error: () => {
        /* keep default */
      },
    });
    this.startDemoAutoplay();
  }

  ngOnDestroy(): void {
    this.stopDemoAutoplay();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.langMenuOpen()) {
      return;
    }
    const langRoot = this.host.nativeElement.querySelector('.landing-v2__lang');
    const target = event.target as Node | null;
    if (langRoot && target && !langRoot.contains(target)) {
      this.langMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.langMenuOpen.set(false);
  }

  toggleLangMenu(): void {
    this.langMenuOpen.update((open) => !open);
  }

  pickLang(lang: Lang): void {
    this.i18n.setLang(lang);
    this.langMenuOpen.set(false);
  }

  isLang(lang: Lang): boolean {
    return this.i18n.lang() === lang;
  }

  setDemoSlide(index: number, restartAutoplay = true): void {
    const next = ((index % this.demoSlideCount) + this.demoSlideCount) % this.demoSlideCount;
    this.demoSlide.set(next);
    if (restartAutoplay) {
      this.startDemoAutoplay();
    }
  }

  onSideSlideClick(index: number): void {
    if (this.demoStack(index) === 0) {
      return;
    }
    this.setDemoSlide(index);
  }

  onDemoPointerDown(event: PointerEvent): void {
    this.pointerStartX = event.clientX;
  }

  onDemoPointerUp(event: PointerEvent): void {
    if (this.pointerStartX === null) {
      return;
    }
    const dx = event.clientX - this.pointerStartX;
    this.pointerStartX = null;
    if (Math.abs(dx) < 40) {
      return;
    }
    this.setDemoSlide(this.demoSlide() + (dx < 0 ? 1 : -1));
  }

  onDemoPointerCancel(): void {
    this.pointerStartX = null;
  }

  private startDemoAutoplay(): void {
    this.stopDemoAutoplay();
    if (typeof window === 'undefined') {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    this.autoplayId = setInterval(() => {
      this.setDemoSlide(this.demoSlide() + 1, false);
    }, DEMO_AUTOPLAY_MS);
  }

  private stopDemoAutoplay(): void {
    if (this.autoplayId !== null) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }
}
