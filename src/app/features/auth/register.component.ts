import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import { resolveRegisterError } from '../../core/utils/auth-errors';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './auth.scss',
})
export class RegisterComponent implements OnInit {
  private auth = inject(AuthService);
  private userSvc = inject(UserService);
  private router = inject(Router);
  readonly i18n = inject(I18nService);

  email = '';
  password = '';
  passwordConfirm = '';
  error = signal('');
  loading = signal(false);

  ngOnInit(): void {
    // Перехватываем результат, если пользователь вернулся после OAuth-редиректа от Google
    this.checkGoogleRedirectResult();
  }

  private checkGoogleRedirectResult(): void {
    this.loading.set(true);

    this.auth.handleRedirectResult().subscribe({
      next: (user) => {
        if (!user) {
          // Редиректа не было, пользователь просто открыл страницу регистрации
          this.loading.set(false);
          return;
        }

        // Пользователь успешно авторизован через Google
        if (!user.emailVerified) {
          void this.router.navigate(['/app/verify-email-notice']);
          this.loading.set(false);
          return;
        }

        // Синхронизируем профиль на бэкенде Node.js
        this.userSvc.ensureProfile().subscribe({
          next: (profile) => {
            this.loading.set(false);
            this.auth.navigateAfterAuth(profile, user);
          },
          error: () => {
            this.error.set(this.i18n.authUi().oauthError);
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
          error: () => {
            this.error.set(this.i18n.authUi().oauthError);
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

  submit() {
    if (this.password !== this.passwordConfirm) {
      this.error.set(this.i18n.authUi().passwordsMismatch);
      return;
    }
    if (this.password.length < 6) {
      this.error.set(this.i18n.authUi().passwordMinLength);
      return;
    }
    this.error.set('');
    this.loading.set(true);
    this.auth.register(this.email, this.password).subscribe({
      next: () => void this.router.navigate(['/app/verify-email-notice']),
      error: (err) => {
        this.error.set(resolveRegisterError(err, this.i18n.authUi()));
        this.loading.set(false);
      },
    });
  }
}