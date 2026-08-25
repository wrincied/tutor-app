import {
  EnvironmentInjector,
  Injectable,
  computed,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  applyActionCode,
  checkActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  signInWithPopup,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  updateEmail,
  updatePassword,
  verifyPasswordResetCode,
} from '@angular/fire/auth';
import type { User } from 'firebase/auth';
import {
  catchError,
  from,
  map,
  Observable,
  switchMap,
  throwError,
  of,
  shareReplay,
} from 'rxjs';
import {
  EmailAlreadyRegisteredError,
  getFirebaseAuthErrorCode,
  GoogleSignInRequiredError,
} from '../utils/auth-errors';
import { isBlockedBrandEmail } from '../utils/brand-email';

import { apiUrl } from '../config/api-url';
import type { UserProfile } from '@interfaces';
import { postAuthPath } from '../utils/post-auth-navigation';

const API = apiUrl('');

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly injector = inject(EnvironmentInjector);

  /**
   * getRedirectResult() можно вызвать только один раз за OAuth-цикл.
   * Общий Observable гарантирует это при подписке из App, /login и /register.
   */
  private redirectResult$?: Observable<User | null>;

  readonly firebaseUser = toSignal(authState(this.auth), { initialValue: null });
  readonly isLoggedIn = computed(() => this.firebaseUser() !== null);
  readonly emailVerified = computed(() => this.firebaseUser()?.emailVerified === true);

  /**
   * Провайдер текущей сессии (password / google.com / …), не весь список linked accounts.
   * Нужен, чтобы не показывать пароль после входа через Google, даже если password когда-то линковали.
   */
  private readonly sessionSignInProvider = toSignal(
    authState(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
        }
        return from(user.getIdTokenResult()).pipe(
          map((token) => token.signInProvider ?? null),
          catchError(() => of(null)),
        );
      }),
    ),
    { initialValue: null as string | null },
  );

  /** Смена пароля в UI — только если сейчас вошли email/паролем. */
  readonly canChangePassword = computed(
    () => this.sessionSignInProvider() === EmailAuthProvider.PROVIDER_ID,
  );

  /** Текущий вход через Google — пароль в аккаунте не показываем. */
  readonly isGoogleOnlyAuth = computed(
    () => this.sessionSignInProvider() === GoogleAuthProvider.PROVIDER_ID,
  );

  private fromAuth<T>(fn: () => Promise<T>): Observable<T> {
    return from(runInInjectionContext(this.injector, fn));
  }

  /** Resend SMTP + SPA /auth/action (same pattern as password reset). */
  private requestVerificationEmail(): Observable<void> {
    return this.http
      .post<{ ok: boolean }>(`${API}/auth/send-verification-email`, {})
      .pipe(map(() => undefined));
  }

  sendPasswordReset(email: string): Observable<void> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      throw new Error('Email is required');
    }
    // Backend rewrites Firebase oob links to /auth/action (Console custom action URL is blocked).
    return this.http
      .post<{ ok: boolean }>(`${API}/auth/password-reset`, { email: normalized })
      .pipe(map(() => undefined));
  }

  /** Resolve email for a password-reset oobCode (throws if invalid/expired). */
  verifyPasswordResetCode(oobCode: string): Observable<string> {
    return this.fromAuth(() => verifyPasswordResetCode(this.auth, oobCode));
  }

  confirmPasswordReset(oobCode: string, newPassword: string): Observable<void> {
    return this.fromAuth(() => confirmPasswordReset(this.auth, oobCode, newPassword));
  }

  /** verifyEmail / recoverEmail / verifyAndChangeEmail */
  applyActionCode(oobCode: string): Observable<void> {
    return this.fromAuth(() => applyActionCode(this.auth, oobCode));
  }

  checkActionCode(oobCode: string): Observable<{ operation: string; email: string | null }> {
    return this.fromAuth(() => checkActionCode(this.auth, oobCode)).pipe(
      map((info) => ({
        operation: String(info.operation || ''),
        email: info.data.email ?? info.data.previousEmail ?? null,
      })),
    );
  }

  register(email: string, password: string): Observable<User> {
    const normalized = email.trim().toLowerCase();
    if (isBlockedBrandEmail(normalized)) {
      return throwError(() => new EmailAlreadyRegisteredError([]));
    }
    return this.fromAuth(() => fetchSignInMethodsForEmail(this.auth, normalized)).pipe(
      switchMap((methods) => {
        if (methods.length > 0) {
          return throwError(() => new EmailAlreadyRegisteredError(methods));
        }
        return this.fromAuth(() => createUserWithEmailAndPassword(this.auth, normalized, password));
      }),
      switchMap((cred) =>
        this.bootstrapProfile().pipe(
          switchMap(() => this.requestVerificationEmail()),
          map(() => cred.user),
        ),
      ),
    );
  }

  login(email: string, password: string): Observable<User> {
    const normalized = email.trim().toLowerCase();
    return this.fromAuth(() => signInWithEmailAndPassword(this.auth, normalized, password)).pipe(
      switchMap((cred) => this.afterFirebaseSignIn(cred.user)),
      catchError((err) => this.enrichLoginError(err, normalized)),
    );
  }

  private enrichLoginError(err: unknown, email: string): Observable<never> {
    const code = getFirebaseAuthErrorCode(err);
    if (
      code !== 'auth/invalid-credential' &&
      code !== 'auth/wrong-password' &&
      code !== 'auth/user-not-found' &&
      code !== 'auth/invalid-login-credentials'
    ) {
      return throwError(() => err);
    }
    return this.fromAuth(() => fetchSignInMethodsForEmail(this.auth, email)).pipe(
      switchMap((methods) => {
        const hasGoogle = methods.includes(GoogleAuthProvider.PROVIDER_ID);
        const hasPassword = methods.includes(EmailAuthProvider.PROVIDER_ID);
        if (hasGoogle && !hasPassword) {
          return throwError(() => new GoogleSignInRequiredError());
        }
        return throwError(() => err);
      }),
      catchError(() => throwError(() => err)),
    );
  }

  /** Google OAuth через redirect (prod flow). */
  loginWithGoogleRedirect(): void {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    void runInInjectionContext(this.injector, () => signInWithRedirect(this.auth, provider));
  }

  /** Google OAuth через popup (dev fallback). */
  loginWithGooglePopup(): Observable<User> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return this.fromAuth(() => signInWithPopup(this.auth, provider)).pipe(
      switchMap((cred) => this.afterFirebaseSignIn(cred.user)),
    );
  }

  /**
   * Завершает signInWithRedirect (один вызов getRedirectResult на приложение).
   * Bootstrap профиля — в UserService.ensureProfile() на странице login/register.
   */
  handleRedirectResult(): Observable<User | null> {
    if (!this.redirectResult$) {
      this.redirectResult$ = this.fromAuth(() => getRedirectResult(this.auth)).pipe(
        map((cred) => cred?.user ?? null),
        catchError((err) => {
          this.redirectResult$ = undefined;
          return throwError(() => err);
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.redirectResult$;
  }

  navigateAfterAuth(profile: UserProfile, user: User): void {
    const tree = this.router.parseUrl(this.router.url);
    const returnUrl =
      typeof tree.queryParams['returnUrl'] === 'string' ? tree.queryParams['returnUrl'] : null;
    const path = postAuthPath(profile, user.emailVerified === true, returnUrl);
    void this.router.navigateByUrl(path);
  }

  /** Вызов bootstrap для создания/синхронизации профиля на бэкенде Node.js */
  private afterFirebaseSignIn(user: User): Observable<User> {
    if (isBlockedBrandEmail(user.email)) {
      return this.fromAuth(() => signOut(this.auth)).pipe(
        switchMap(() => throwError(() => new EmailAlreadyRegisteredError([]))),
      );
    }
    return this.bootstrapProfile().pipe(map(() => user));
  }

  resendVerificationEmail(): Observable<void> {
    if (!this.auth.currentUser) {
      throw new Error('Not signed in');
    }
    return this.requestVerificationEmail();
  }

  reloadUser(): Observable<User | null> {
    const user = this.auth.currentUser;
    if (!user) {
      return from(Promise.resolve(null));
    }
    // После клика по письму локальный user ещё со старым emailVerified —
    // reload + force token refresh, иначе API видит email_verified: false в JWT.
    return this.fromAuth(() => user.reload()).pipe(
      switchMap(() => {
        const fresh = this.auth.currentUser;
        if (!fresh) {
          return of(null);
        }
        return this.fromAuth(() => fresh.getIdToken(true)).pipe(map(() => this.auth.currentUser));
      }),
    );
  }

  bootstrapProfile(): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${API}/auth/bootstrap`, {});
  }

  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) {
      return null;
    }
    return user.getIdToken(forceRefresh);
  }

  updateEmailWithGoogleReauth(newEmail: string): Observable<User | null> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Not signed in');
    }
    const normalized = newEmail.trim().toLowerCase();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'none' });
    return this.fromAuth(() => reauthenticateWithPopup(user, provider)).pipe(
      switchMap(() => this.fromAuth(() => updateEmail(user, normalized))),
      switchMap(() => this.reloadUser()),
      switchMap(() => this.requestVerificationEmail()),
      map(() => this.auth.currentUser),
    );
  }

  updateCredentials(options: {
    currentPassword: string;
    newEmail?: string;
    newPassword?: string;
  }): Observable<User | null> {
    const user = this.auth.currentUser;
    if (!user?.email) {
      throw new Error('Not signed in');
    }
    const credential = EmailAuthProvider.credential(user.email, options.currentPassword);
    return this.fromAuth(() => reauthenticateWithCredential(user, credential)).pipe(
      switchMap(() => {
        const tasks: Promise<unknown>[] = [];
        if (options.newPassword) {
          tasks.push(updatePassword(user, options.newPassword));
        }
        if (options.newEmail) {
          tasks.push(updateEmail(user, options.newEmail.trim().toLowerCase()));
        }
        return tasks.length ? this.fromAuth(() => Promise.all(tasks)) : from(Promise.resolve());
      }),
      switchMap(() => this.reloadUser()),
      switchMap(() => {
        if (options.newEmail) {
          return this.requestVerificationEmail();
        }
        return of(undefined);
      }),
      map(() => this.auth.currentUser),
    );
  }

  logout(): Observable<void> {
    return this.fromAuth(() => signOut(this.auth)).pipe(
      map(() => {
        void this.router.navigate(['/login']);
      }),
    );
  }
}
