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
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  updateEmail,
  updatePassword,
} from '@angular/fire/auth';
import type { ActionCodeSettings, User } from 'firebase/auth';
import {
  catchError,
  from,
  map,
  Observable,
  switchMap,
  throwError,
  defer,
  of,
  shareReplay,
} from 'rxjs';
import {
  EmailAlreadyRegisteredError,
  getFirebaseAuthErrorCode,
  GoogleSignInRequiredError,
} from '../utils/auth-errors';

import { environment } from '../../../environments/environment';
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
  /** Вход по email/паролю — можно менять пароль в аккаунте. Только Google — нет. */
  readonly canChangePassword = computed(() => this.hasPasswordProvider(this.firebaseUser()));

  private hasPasswordProvider(user: User | null | undefined): boolean {
    return Boolean(
      user?.providerData.some((provider) => provider.providerId === EmailAuthProvider.PROVIDER_ID),
    );
  }

  private appBaseUrl(): string {
    return (
      environment.appUrl?.replace(/\/$/, '') ||
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200')
    );
  }

  private verificationActionCodeSettings(): ActionCodeSettings {
    return {
      url: `${this.appBaseUrl()}/login?verify=success`,
      handleCodeInApp: false,
    };
  }

  private passwordResetActionCodeSettings(): ActionCodeSettings {
    return {
      url: `${this.appBaseUrl()}/login`,
      handleCodeInApp: false,
    };
  }

  private fromAuth<T>(fn: () => Promise<T>): Observable<T> {
    return from(runInInjectionContext(this.injector, fn));
  }

  sendPasswordReset(email: string): Observable<void> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      throw new Error('Email is required');
    }
    return this.fromAuth(() =>
      sendPasswordResetEmail(this.auth, normalized, this.passwordResetActionCodeSettings()),
    );
  }

  register(email: string, password: string): Observable<User> {
    const normalized = email.trim().toLowerCase();
    return this.fromAuth(() => fetchSignInMethodsForEmail(this.auth, normalized)).pipe(
      switchMap((methods) => {
        if (methods.length > 0) {
          return throwError(() => new EmailAlreadyRegisteredError(methods));
        }
        return this.fromAuth(() => createUserWithEmailAndPassword(this.auth, normalized, password));
      }),
      switchMap((cred) =>
        this.fromAuth(() =>
          sendEmailVerification(cred.user, this.verificationActionCodeSettings()),
        ).pipe(map(() => cred.user)),
      ),
      switchMap((user) => this.bootstrapProfile().pipe(map(() => user))),
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
    void signInWithRedirect(this.auth, provider);
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
      this.redirectResult$ = defer(() => from(getRedirectResult(this.auth))).pipe(
        switchMap((cred) => (cred?.user ? of(cred.user) : of(null))),
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
    const path = postAuthPath(profile, user.emailVerified === true);
    const queryParams =
      profile.data_consent_accepted === false ? { consent: 'declined' } : undefined;
    void this.router.navigate([path], { queryParams });
  }

  /** Вызываем bootstrap для создания/синхронизации профиля на бэкенде Node.js */
  private afterFirebaseSignIn(user: User): Observable<User> {
    return this.bootstrapProfile().pipe(map(() => user));
  }

  resendVerificationEmail(): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Not signed in');
    }
    return this.fromAuth(() => sendEmailVerification(user, this.verificationActionCodeSettings()));
  }

  reloadUser(): Observable<User | null> {
    const user = this.auth.currentUser;
    if (!user) {
      return from(Promise.resolve(null));
    }
    return this.fromAuth(() => user.reload()).pipe(map(() => this.auth.currentUser));
  }

  bootstrapProfile(): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${API}/auth/bootstrap`, {});
  }

  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) {
      return null;
    }
    return user.getIdToken();
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
      switchMap(() =>
        this.fromAuth(() => sendEmailVerification(user, this.verificationActionCodeSettings())),
      ),
      switchMap(() => this.fromAuth(() => user.reload())),
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
      switchMap(() => {
        if (options.newEmail) {
          return this.fromAuth(() =>
            sendEmailVerification(user, this.verificationActionCodeSettings()),
          ).pipe(switchMap(() => this.fromAuth(() => user.reload())));
        }
        return this.fromAuth(() => user.reload());
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
