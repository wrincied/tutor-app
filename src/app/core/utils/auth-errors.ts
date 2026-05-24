import { EmailAuthProvider, GoogleAuthProvider } from '@angular/fire/auth';
import type { AuthStrings } from '@interfaces';

export class EmailAlreadyRegisteredError extends Error {
  readonly signInMethods: string[];

  constructor(signInMethods: string[]) {
    super('auth/email-already-in-use');
    this.name = 'EmailAlreadyRegisteredError';
    this.signInMethods = signInMethods;
  }
}

export class GoogleSignInRequiredError extends Error {
  constructor() {
    super('auth/google-sign-in-required');
    this.name = 'GoogleSignInRequiredError';
  }
}

const LOGIN_CREDENTIAL_CODES = new Set([
  'auth/invalid-credential',
  'auth/wrong-password',
  'auth/user-not-found',
  'auth/invalid-login-credentials',
]);

export function getFirebaseAuthErrorCode(error: unknown): string | null {
  if (!error || typeof error !== 'object') {
    return null;
  }
  const code = (error as { code?: string }).code;
  return typeof code === 'string' ? code : null;
}

export function resolveRegisterError(error: unknown, strings: AuthStrings): string {
  const methods =
    error instanceof EmailAlreadyRegisteredError
      ? error.signInMethods
      : [];

  if (getFirebaseAuthErrorCode(error) === 'auth/email-already-in-use' || methods.length > 0) {
    const hasGoogle = methods.includes(GoogleAuthProvider.PROVIDER_ID);
    const hasPassword = methods.includes(EmailAuthProvider.PROVIDER_ID);
    if (hasGoogle && !hasPassword) {
      return strings.emailAlreadyInUseGoogle;
    }
    return strings.emailAlreadyInUse;
  }

  const code = getFirebaseAuthErrorCode(error);
  if (code === 'auth/invalid-email') {
    return strings.invalidEmail;
  }
  if (code === 'auth/weak-password') {
    return strings.passwordMinLength;
  }
  if (code === 'auth/operation-not-allowed') {
    return strings.registerError;
  }

  return strings.registerError;
}

export function resolveLoginError(error: unknown, strings: AuthStrings): string {
  if (error instanceof GoogleSignInRequiredError) {
    return strings.emailAlreadyInUseGoogle;
  }
  const code = getFirebaseAuthErrorCode(error);
  if (code && LOGIN_CREDENTIAL_CODES.has(code)) {
    return strings.wrongCredentials;
  }
  return strings.wrongCredentials;
}
