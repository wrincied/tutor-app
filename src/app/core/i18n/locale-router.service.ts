import { Injectable, inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { I18nService } from '../services/i18n.service';
import { asUrlLang, localizePath } from './locale-url';

/** Navigate / build URLs with the active `/{lang}` prefix. */
@Injectable({ providedIn: 'root' })
export class LocaleRouter {
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  /** Locale-agnostic path → `/{lang}/...`. */
  path(pathWithoutLang: string): string {
    return localizePath(pathWithoutLang, asUrlLang(this.i18n.lang()));
  }

  navigate(pathWithoutLang: string, extras?: NavigationExtras): Promise<boolean> {
    const localized = this.path(pathWithoutLang);
    const segments = localized.split('/').filter(Boolean);
    return this.router.navigate(['/', ...segments], extras);
  }

  navigateByUrl(pathWithoutLang: string, extras?: { replaceUrl?: boolean }): Promise<boolean> {
    return this.router.navigateByUrl(this.path(pathWithoutLang), extras);
  }
}
