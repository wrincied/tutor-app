import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { asUrlLang, localizePath } from '../../core/i18n/locale-url';
import { LocaleRouter } from '../../core/i18n/locale-router.service';

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
  private readonly localeRouter = inject(LocaleRouter);
  /** Locale-aware absolute path for routerLink. */
  lp(path: string): string {
    return this.localeRouter.path(path);
  }

  readonly loggedIn = computed(() => this.auth.isLoggedIn());

  readonly primaryLink = computed(() =>
    localizePath(this.loggedIn() ? '/app/home' : '/', asUrlLang(this.i18n.lang())),
  );

  readonly primaryLabel = computed(() =>
    this.loggedIn() ? this.i18n.authUi().notFoundGoApp : this.i18n.authUi().backHome,
  );
}
