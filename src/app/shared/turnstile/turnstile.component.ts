import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    __turnstileScriptPromise?: Promise<void>;
  }
}

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }
  if (window.turnstile) {
    return Promise.resolve();
  }
  if (window.__turnstileScriptPromise) {
    return window.__turnstileScriptPromise;
  }
  window.__turnstileScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-cf-turnstile]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Turnstile script failed')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.dataset['cfTurnstile'] = '1';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Turnstile script failed'));
    document.head.appendChild(script);
  });
  return window.__turnstileScriptPromise;
}

@Component({
  selector: 'app-turnstile',
  standalone: true,
  template: `
    @if (siteKey) {
      <div #host class="turnstile-host" aria-live="polite"></div>
    }
  `,
  styles: `
    :host {
      display: block;
      min-height: 1px;
    }
    .turnstile-host {
      min-height: 65px;
    }
  `,
})
export class TurnstileComponent implements AfterViewInit, OnDestroy {
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  readonly theme = input<'light' | 'dark' | 'auto'>('auto');
  readonly tokenChange = output<string | null>();

  readonly siteKey = (environment as { turnstileSiteKey?: string }).turnstileSiteKey?.trim() || '';
  readonly ready = signal(false);
  private widgetId: string | null = null;

  ngAfterViewInit(): void {
    if (!this.siteKey) {
      this.tokenChange.emit(null);
      return;
    }
    void this.mount();
  }

  ngOnDestroy(): void {
    if (this.widgetId && window.turnstile) {
      try {
        window.turnstile.remove(this.widgetId);
      } catch {
        /* ignore */
      }
    }
  }

  reset(): void {
    if (this.widgetId && window.turnstile) {
      window.turnstile.reset(this.widgetId);
    }
    this.tokenChange.emit(null);
  }

  private async mount(): Promise<void> {
    try {
      await loadTurnstileScript();
      const host = this.hostRef.nativeElement.querySelector('.turnstile-host') as HTMLElement | null;
      if (!host || !window.turnstile) {
        return;
      }
      this.widgetId = window.turnstile.render(host, {
        sitekey: this.siteKey,
        theme: this.theme(),
        callback: (token) => {
          this.tokenChange.emit(token);
          this.ready.set(true);
        },
        'expired-callback': () => this.tokenChange.emit(null),
        'error-callback': () => this.tokenChange.emit(null),
      });
    } catch {
      this.tokenChange.emit(null);
    }
  }
}
