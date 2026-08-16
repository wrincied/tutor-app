/** Shared Window typings for Google reCAPTCHA (v2 widget + Enterprise). */
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
  enterprise?: {
    ready: (cb: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  };
};

declare global {
  interface Window {
    grecaptcha?: GrecaptchaApi;
    __recaptchaEnterprisePromise?: Promise<void>;
    __recaptchaV2Promise?: Promise<void>;
  }
}

export {};
