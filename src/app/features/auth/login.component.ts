import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import { resolveLoginError } from '../../core/utils/auth-errors';
import { resolveFirebaseUser } from '../../core/utils/resolve-firebase-user';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { environment } from '@environment';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, AppDialogComponent],
  templateUrl: './login.component.html',
  styleUrl: './auth.scss',
})
export class LoginComponent implements OnInit {
  private firebaseAuth = inject(Auth);
  private auth = inject(AuthService);
  private userSvc = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly i18n = inject(I18nService);

  email = '';
  password = '';
  resetModalEmail = '';
  error = signal('');
  loading = signal(false);
  verifySuccess = signal(false);

  resetModalOpen = signal(false);
  resetLoading = signal(false);
  resetModalError = signal('');
  resetModalSuccess = signal(false);

  consentDeclined = signal(false);

  ngOnInit(): void {
    // 1. Чтение query-параметров из URL
    this.route.queryParamMap.subscribe((params) => {
      this.verifySuccess.set(params.get('verify') === 'success');
      this.consentDeclined.set(params.get('consent') === 'declined');
    });

    // 2. Перехват результата редиректа от Google
    this.checkGoogleRedirectResult();
  }

  private checkGoogleRedirectResult(): void {
    // Включаем индикатор загрузки на время проверки токенов в sessionStorage
    this.loading.set(true);

    this.auth.handleRedirectResult().subscribe({
      next: (user) => {
        if (!user) {
          this.resumeExistingSession();
          return;
        }

        // Пользователь только что успешно вернулся от Google
        if (!user.emailVerified) {
          void this.router.navigate(['/app/verify-email-notice']);
          this.loading.set(false);
          return;
        }

        // Синхронизируем/проверяем профиль на бэкенде Node.js
        this.userSvc.ensureProfile().subscribe({
          next: (profile) => {
            this.loading.set(false);
            this.auth.navigateAfterAuth(profile, user);
          },
          error: (err) => {
            this.error.set(this.profileLoadError(err));
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        console.error('[Google sign-in redirect error]', err);
        this.error.set(this.i18n.authUi().oauthError);
        this.loading.set(false);
      },
    });
  }

  /** Уже залогинен (email/Google) — уводим в app, если открыли /login напрямую. */
  private resumeExistingSession(): void {
    resolveFirebaseUser(this.firebaseAuth).subscribe({
      next: (user) => {
        if (!user) {
          this.loading.set(false);
          return;
        }
        if (!user.emailVerified) {
          void this.router.navigate(['/app/verify-email-notice']);
          this.loading.set(false);
          return;
        }
        this.userSvc.ensureProfile().subscribe({
          next: (profile) => {
            this.loading.set(false);
            this.auth.navigateAfterAuth(profile, user);
          },
          error: (err) => {
            this.error.set(this.profileLoadError(err));
            this.loading.set(false);
          },
        });
      },
      error: () => this.loading.set(false),
    });
  }

  submit() {
    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.email, this.password).subscribe({
      next: (user) => {
        this.loading.set(false);
        if (!user.emailVerified) {
          void this.router.navigate(['/app/verify-email-notice']);
          return;
        }
        this.userSvc.ensureProfile().subscribe({
          next: (profile) => this.auth.navigateAfterAuth(profile, user),
          error: (err) => this.error.set(this.profileLoadError(err)),
        });
      },
      error: (err) => {
        this.error.set(resolveLoginError(err, this.i18n.authUi()));
        this.loading.set(false);
      },
    });
  }

  openResetModal(): void {
    this.resetModalEmail = this.email.trim();
    this.resetModalError.set('');
    this.resetModalSuccess.set(false);
    this.resetModalOpen.set(true);
  }

  closeResetModal(): void {
    this.resetModalOpen.set(false);
    this.resetLoading.set(false);
    this.resetModalSuccess.set(false);
    this.resetModalError.set('');
  }

  onResetDialogConfirm(): void {
    if (this.resetModalSuccess()) {
      this.closeResetModal();
      return;
    }
    this.submitResetFromModal();
  }

  /** В dev используем popup (обход проблем redirect на localhost), в prod — redirect. */
  signInWithGoogle(): void {
    this.error.set('');
    this.loading.set(true);
    if (environment.production) {
      this.auth.loginWithGoogleRedirect();
      return;
    }

    this.auth.loginWithGooglePopup().subscribe({
      next: (user) => {
        if (!user.emailVerified) {
          void this.router.navigate(['/app/verify-email-notice']);
          this.loading.set(false);
          return;
        }
        this.userSvc.ensureProfile().subscribe({
          next: (profile) => {
            this.loading.set(false);
            this.auth.navigateAfterAuth(profile, user);
          },
          error: (err) => {
            this.error.set(this.profileLoadError(err));
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        console.error('[Google sign-in popup error]', err);
        this.error.set(this.i18n.authUi().oauthError);
        this.loading.set(false);
      },
    });
  }

  private profileLoadError(_err: unknown): string {
    return this.i18n.authUi().profileSyncError;
  }

  submitResetFromModal(): void {
    if (this.resetModalSuccess() || this.resetLoading()) {
      return;
    }
    this.resetModalError.set('');
    const normalized = this.resetModalEmail.trim().toLowerCase();
    if (!normalized) {
      this.resetModalError.set(this.i18n.authUi().enterEmailForReset);
      return;
    }
    this.resetLoading.set(true);
    this.auth.sendPasswordReset(normalized).subscribe({
      next: () => {
        this.resetModalSuccess.set(true);
        this.resetLoading.set(false);
        this.email = normalized;
      },
      error: () => {
        this.resetModalError.set(this.i18n.authUi().resetPasswordError);
        this.resetLoading.set(false);
      },
    });
  }
}