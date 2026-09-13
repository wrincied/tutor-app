/** Placeholder only. Real env files are gitignored and created by
 * `scripts/prepare-environment.mjs` (local copies or CI/Vercel generation).
 * Do not commit environment.ts / development-* / production — edit them locally. */
export const environment = {
  production: false,
  designMode: false,
  apiUrl: 'http://localhost:3001',
  appUrl: 'http://localhost:4200',
  /** Cloudflare Turnstile site key (legacy; prefer recaptchaSiteKey). */
  turnstileSiteKey: '',
  /** Google reCAPTCHA v3 site key (public). Empty = captcha off. */
  recaptchaSiteKey: '',
  firebaseConfig: {
    apiKey: 'PLACEHOLDER',
    authDomain: 'PLACEHOLDER',
    projectId: 'PLACEHOLDER',
    storageBucket: 'PLACEHOLDER',
    messagingSenderId: 'PLACEHOLDER',
    appId: 'PLACEHOLDER',
    measurementId: 'PLACEHOLDER',
  },
};
