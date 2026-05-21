import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './auth.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  readonly i18n = inject(I18nService);

  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  submit() {
    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/app/home']),
      error: (err) => {
        console.error('[Login error]', err);
        this.error.set(this.i18n.authUi().wrongCredentials);
        this.loading.set(false);
      },
    });
  }
}
