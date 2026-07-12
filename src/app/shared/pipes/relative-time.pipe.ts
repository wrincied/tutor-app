import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

@Pipe({ name: 'relativeTime', standalone: true, pure: true })
export class RelativeTimePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(value: string | null | undefined): string {
    const labels = this.i18n.adminUi();
    if (!value) {
      return labels.never;
    }
    const ms = Date.parse(value);
    if (Number.isNaN(ms)) {
      return labels.never;
    }

    const diffSec = Math.round((ms - Date.now()) / 1000);
    const abs = Math.abs(diffSec);
    const rtf = new Intl.RelativeTimeFormat(this.i18n.localeId(), { numeric: 'auto' });

    if (abs < 60) {
      return rtf.format(diffSec, 'second');
    }
    if (abs < 3600) {
      return rtf.format(Math.round(diffSec / 60), 'minute');
    }
    if (abs < 86400) {
      return rtf.format(Math.round(diffSec / 3600), 'hour');
    }
    if (abs < 86400 * 30) {
      return rtf.format(Math.round(diffSec / 86400), 'day');
    }
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(ms));
  }
}
