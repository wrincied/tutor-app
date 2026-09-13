import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import './grecaptcha-globals';

function loadV3Script(siteKey: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }
  if (window.grecaptcha?.execute) {
    return Promise.resolve();
  }
  if (window.__recaptchaV3Promise) {
    return window.__recaptchaV3Promise;
  }
  window.__recaptchaV3Promise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha-v3]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('reCAPTCHA v3 script failed')));
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset['recaptchaV3'] = '1';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('reCAPTCHA v3 script failed'));
    document.head.appendChild(script);
  });
  return window.__recaptchaV3Promise;
}

/**
 * Google reCAPTCHA v3 (score-based, no checkbox).
 * Tokens are verified server-side via classic siteverify.
 */
@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  readonly siteKey =
    (environment as { recaptchaSiteKey?: string }).recaptchaSiteKey?.trim() || '';

  get enabled(): boolean {
    return Boolean(this.siteKey);
  }

  warmUp(): void {
    if (!this.enabled) {
      return;
    }
    void loadV3Script(this.siteKey).catch(() => undefined);
  }

  async execute(action = 'contact'): Promise<string | null> {
    if (!this.enabled) {
      return null;
    }
    try {
      await loadV3Script(this.siteKey);
      const api = window.grecaptcha;
      if (!api?.execute) {
        return null;
      }
      return await new Promise<string>((resolve, reject) => {
        const run = () => {
          api
            .execute!(this.siteKey, { action })
            .then(resolve)
            .catch(reject);
        };
        if (api.ready) {
          api.ready(run);
        } else {
          run();
        }
      });
    } catch (err) {
      console.warn('[recaptcha] execute failed', err);
      return null;
    }
  }
}
