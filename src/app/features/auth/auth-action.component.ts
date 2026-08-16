import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, map, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { I18nService } from '../../core/services/i18n.service';
import { getFirebaseAuthErrorCode } from '../../core/utils/auth-errors';

type AuthActionMode = 'resetPassword' | 'verifyEmail' | 'recoverEmail' | 'verifyAndChangeEmail' | 'unknown';
type AuthActionPhase = 'loading' | 'form' | 'signingIn' | 'success' | 'error';

@Component({
  selector: 'app-auth-action',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './auth-action.component.html',
  styleUrl: './auth.scss',
})
export class AuthActionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly userSvc = inject(UserService);
  readonly i18n = inject(I18nService);

  readonly mode = signal<AuthActionMode>('unknown');
  readonly phase = signal<AuthActionPhase>('loading');
  readonly email = signal('');
  readonly error = signal('');
  readonly submitting = signal(false);

  password = '';
  passwordConfirm = '';

  private oobCode = '';

  readonly title = computed(() => {
    const t = this.i18n.authUi();
    switch (this.mode()) {
      case 'resetPassword':
        return t.authActionResetTitle;
      case 'verifyEmail':
      case 'verifyAndChangeEmail':
        return t.authActionVerifyTitle;
      case 'recoverEmail':
        return t.authActionRecoverTitle;
      default:
        return t.authActionInvalidTitle;
    }
  });

  readonly subtitle = computed(() => {
    const t = this.i18n.authUi();
    if (this.mode() === 'resetPassword' && this.phase() === 'form') {
      return t.authActionResetSubtitle;
    }
    return '';
  });

  readonly successMessage = computed(() => {
    const t = this.i18n.authUi();
    switch (this.mode()) {
      case 'resetPassword':
        return t.authActionResetSuccess;
      case 'recoverEmail':
        return t.authActionRecoverSuccess;
      default:
        return t.authActionVerifySuccess;
    }
  });

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    const modeRaw = (q.get('mode') || '').trim();
    this.oobCode = (q.get('oobCode') || '').trim();

    const mode = this.parseMode(modeRaw);
    this.mode.set(mode);

    if (!this.oobCode || mode === 'unknown') {
      this.phase.set('error');
      this.error.set(this.i18n.authUi().authActionInvalidLink);
      return;
    }

    if (mode === 'resetPassword') {
      this.auth.verifyPasswordResetCode(this.oobCode).subscribe({
        next: (resolvedEmail) => {
          this.email.set(resolvedEmail);
          this.phase.set('form');
        },
        error: (err) => this.fail(err),
      });
      return;
    }

    // verifyEmail / recoverEmail / verifyAndChangeEmail
    this.auth.applyActionCode(this.oobCode).subscribe({
      next: () => this.afterEmailAction(mode),
      error: (err) => this.fail(err),
    });
  }

  submitReset(): void {
    if (this.submitting() || this.phase() !== 'form') {
      return;
    }
    const t = this.i18n.authUi();
    this.error.set('');
    const pwd = this.password;
    if (pwd.length < 6) {
      this.error.set(t.authActionPasswordTooShort);
      return;
    }
    if (pwd !== this.passwordConfirm) {
      this.error.set(t.authActionPasswordMismatch);
      return;
    }
    const accountEmail = this.email();
    this.submitting.set(true);
    this.auth
      .confirmPasswordReset(this.oobCode, pwd)
      .pipe(
        switchMap(() => {
          this.phase.set('signingIn');
          this.password = '';
          this.passwordConfirm = '';
          return this.auth.login(accountEmail, pwd);
        }),
        switchMap((user) =>
          this.userSvc.ensureProfile().pipe(map((profile) => ({ user, profile }))),
        ),
      )
      .subscribe({
        next: ({ user, profile }) => {
          this.submitting.set(false);
          this.auth.navigateAfterAuth(profile, user);
        },
        error: () => {
          this.submitting.set(false);
          // Password already changed; link is spent. Offer manual sign-in.
          this.phase.set('success');
          this.error.set('');
        },
      });
  }

  private afterEmailAction(mode: AuthActionMode): void {
    const signedIn = this.auth.firebaseUser();
    if (!signedIn) {
      this.phase.set('success');
      return;
    }

    this.phase.set('signingIn');
    this.auth
      .reloadUser()
      .pipe(
        switchMap((user) => {
          if (!user) {
            return of(null);
          }
          return this.userSvc.ensureProfile().pipe(map((profile) => ({ user, profile })));
        }),
      )
      .subscribe({
        next: (result) => {
          if (!result) {
            this.phase.set('success');
            return;
          }
          if (mode === 'verifyEmail' || mode === 'verifyAndChangeEmail' || mode === 'recoverEmail') {
            this.auth.navigateAfterAuth(result.profile, result.user);
            return;
          }
          this.phase.set('success');
        },
        error: () => this.phase.set('success'),
      });
  }

  private parseMode(raw: string): AuthActionMode {
    if (
      raw === 'resetPassword' ||
      raw === 'verifyEmail' ||
      raw === 'recoverEmail' ||
      raw === 'verifyAndChangeEmail'
    ) {
      return raw;
    }
    return 'unknown';
  }

  private fail(err: unknown): void {
    this.phase.set('error');
    this.error.set(this.mapError(err));
  }

  private mapError(err: unknown): string {
    const t = this.i18n.authUi();
    const code = getFirebaseAuthErrorCode(err);
    switch (code) {
      case 'auth/expired-action-code':
        return t.authActionExpired;
      case 'auth/invalid-action-code':
        return t.authActionInvalidLink;
      case 'auth/weak-password':
        return t.authActionPasswordTooShort;
      case 'auth/user-disabled':
        return t.authActionUserDisabled;
      default:
        return t.authActionGenericError;
    }
  }
}
