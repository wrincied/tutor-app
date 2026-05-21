import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
})
export class App {
  auth = inject(AuthService);
  router = inject(Router);
  /** Глобальная тема (localStorage + data-theme). */
  private readonly _theme = inject(ThemeService);

  constructor() {
    void this._theme;
  }

  showNavbar(): boolean {
    return this.auth.isLoggedIn() && this.router.url.startsWith('/app');
  }
}
