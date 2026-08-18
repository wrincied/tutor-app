import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import './grecaptcha-globals';

function loadEnterpriseScript(siteKey: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }
  if (window.grecaptcha?.enterprise?.execute) {
    return Promise.resolve();
  }
  if (window.__recaptchaEnterprisePromise) {
    return window.__recaptchaEnterprisePromise;
  }
  window.__recaptchaEnterprisePromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha-enterprise]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('reCAPTCHA Enterprise script failed')));
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset['recaptchaEnterprise'] = '1';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('reCAPTCHA Enterprise script failed'));
    document.head.appendChild(script);
  });
  return window.__recaptchaEnterprisePromise;
}

/**
 * Google reCAPTCHA Enterprise (score-based, no checkbox).
 * Token is obtained on form submit via grecaptcha.enterprise.execute.
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
    void loadEnterpriseScript(this.siteKey).catch(() => undefined);
  }

  async execute(action = 'contact'): Promise<string | null> {
    if (!this.enabled) {
      return null;
    }
    try {
      await loadEnterpriseScript(this.siteKey);
      const api = window.grecaptcha?.enterprise;
      if (!api?.execute) {
        return null;
      }
      return await new Promise<string>((resolve, reject) => {
        api.ready(() => {
          api
            .execute(this.siteKey, { action })
            .then(resolve)
            .catch(reject);
        });
      });
    } catch (err) {
      console.warn('[recaptcha] execute failed', err);
      return null;
    }
  }
}
