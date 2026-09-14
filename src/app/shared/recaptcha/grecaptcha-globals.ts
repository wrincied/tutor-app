/** Shared Window typings for Google reCAPTCHA (v3 score + optional v2 widget). */
export type GrecaptchaApi = {
  ready?: (cb: () => void) => void;
  execute?: (siteKey: string, options: { action: string }) => Promise<string>;
  render?: (
    container: HTMLElement,
    parameters: {
      sitekey: string;
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      theme?: 'light' | 'dark';
    },
  ) => number;
  reset?: (widgetId?: number) => void;
  getResponse?: (widgetId?: number) => string;
  /** Legacy Enterprise namespace — unused; backend uses classic siteverify. */
  enterprise?: {
    ready: (cb: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  };
};

declare global {
  interface Window {
    grecaptcha?: GrecaptchaApi;
    __recaptchaV3Promise?: Promise<void>;
    __recaptchaV2Promise?: Promise<void>;
  }
}

export {};
