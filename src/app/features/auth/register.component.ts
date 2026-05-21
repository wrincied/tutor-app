import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './auth.scss',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  readonly i18n = inject(I18nService);

  email = '';
  password = '';
  passwordConfirm = '';
  error = signal('');
  loading = signal(false);

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
      next: () => this.router.navigate(['/app/home']),
      error: (err) => {
        console.error('[Register error]', err);
        this.error.set(err?.error?.message || this.i18n.authUi().registerError);
        this.loading.set(false);
      },
    });
  }
}
