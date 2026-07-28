import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  private readonly auth = inject(AuthService);
  readonly i18n = inject(I18nService);

  readonly loggedIn = computed(() => this.auth.isLoggedIn());

  readonly primaryLink = computed(() => (this.loggedIn() ? '/app/home' : '/'));

  readonly primaryLabel = computed(() =>
    this.loggedIn() ? this.i18n.authUi().notFoundGoApp : this.i18n.authUi().backHome,
  );
}
