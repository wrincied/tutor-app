import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  OnDestroy,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import flatpickr from 'flatpickr';
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin';
import type { Instance } from 'flatpickr/dist/types/instance';
import { I18nService } from '../../core/services/i18n.service';
import {
  flatpickrAltFormat,
  flatpickrDatePlaceholder,
  flatpickrLocale,
} from './flatpickr-locale';

function toIsoDate(d: Date | undefined): string {
  if (!d || Number.isNaN(d.getTime())) {
    return '';
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseIso(iso: string): Date | null {
  const t = iso.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    return null;
  }
  const d = new Date(`${t}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

@Component({
  selector: 'app-date-range',
  standalone: true,
  template: `
    <span class="app-date-range__prefix">{{ fromText() }}</span>
    <div class="app-date-range__field">
      <label class="app-date-range__sr" [attr.for]="startId()">{{ startAriaLabel() }}</label>
      <input
        #startEl
        type="text"
        class="app-date-range__input"
        [id]="startId()"
        [attr.name]="startName() || null"
        [attr.aria-label]="startAriaLabel()"
        [attr.placeholder]="placeholder()"
        [disabled]="disabled()"
        autocomplete="off"
        inputmode="none"
        readonly
      />
    </div>
    <span class="app-date-range__prefix">{{ toText() }}</span>
    <div class="app-date-range__field">
      <label class="app-date-range__sr" [attr.for]="endId()">{{ endAriaLabel() }}</label>
      <input
        #endEl
        type="text"
        class="app-date-range__input"
        [id]="endId()"
        [attr.name]="endName() || null"
        [attr.aria-label]="endAriaLabel()"
        [attr.placeholder]="placeholder()"
        [disabled]="disabled()"
        autocomplete="off"
        inputmode="none"
        readonly
      />
    </div>
  `,
  styleUrl: './app-date-range.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'app-date-range',
    role: 'group',
    '[class.app-date-range--disabled]': 'disabled()',
  },
})
export class AppDateRangeComponent implements OnDestroy {
  private readonly i18n = inject(I18nService);
  private readonly injector = inject(Injector);
  private readonly startRef = viewChild.required<ElementRef<HTMLInputElement>>('startEl');
  private readonly endRef = viewChild.required<ElementRef<HTMLInputElement>>('endEl');

  private fp: Instance | null = null;
  private ready = false;
  private syncing = false;

  start = model<string>('');
  end = model<string>('');

  fromText = input.required<string>();
  toText = input.required<string>();
  startAriaLabel = input.required<string>();
  endAriaLabel = input.required<string>();
  startId = input('date-range-start');
  endId = input('date-range-end');
  startName = input<string | undefined>();
  endName = input<string | undefined>();
  disabled = input(false, { transform: booleanAttribute });

  protected readonly placeholder = computed(() => flatpickrDatePlaceholder(this.i18n.lang()));

  constructor() {
    afterNextRender(
      () => {
        this.initFlatpickr();
        this.ready = true;
        this.syncFromModels();
        this.syncDisabled();
      },
      { injector: this.injector },
    );

    effect(() => {
      this.start();
      this.end();
      if (this.ready && !this.syncing) {
        this.syncFromModels();
      }
    });

    effect(() => {
      this.disabled();
      if (this.ready) {
        this.syncDisabled();
      }
    });

    effect(() => {
      const lang = this.i18n.lang();
      if (!this.fp) {
        return;
      }
      this.fp.set('locale', flatpickrLocale(lang) ?? 'default');
      this.fp.set('dateFormat', flatpickrAltFormat(lang));
      this.fp.redraw();
      this.syncFromModels();
    });
  }

  ngOnDestroy(): void {
    this.fp?.destroy();
    this.fp = null;
  }

  private initFlatpickr(): void {
    const startEl = this.startRef().nativeElement;
    const endEl = this.endRef().nativeElement;
    const lang = this.i18n.lang();

    this.fp = flatpickr(startEl, {
      mode: 'range',
      dateFormat: flatpickrAltFormat(lang),
      allowInput: false,
      disableMobile: true,
      locale: flatpickrLocale(lang),
      monthSelectorType: 'static',
      plugins: [rangePlugin({ input: endEl })],
      onReady: (_dates, _str, instance) => {
        instance.calendarContainer.classList.add('app-flatpickr');
      },
      onChange: (dates) => {
        if (this.syncing) {
          return;
        }
        const nextStart = toIsoDate(dates[0]);
        const nextEnd = dates.length > 1 ? toIsoDate(dates[1]) : '';
        this.syncing = true;
        this.start.set(nextStart);
        // Partial range: clear end until the second day is picked
        this.end.set(nextEnd);
        this.syncing = false;
      },
    });
  }

  private syncFromModels(): void {
    if (!this.fp) {
      return;
    }
    const s = parseIso(this.start());
    const e = parseIso(this.end());
    this.syncing = true;
    if (!s && !e) {
      this.fp.clear(false);
    } else if (s && e) {
      this.fp.setDate([s, e], false);
    } else if (s) {
      this.fp.setDate([s], false);
    } else {
      this.fp.clear(false);
    }
    this.syncing = false;
  }

  private syncDisabled(): void {
    if (!this.fp) {
      return;
    }
    const disabled = this.disabled();
    const endEl = this.endRef().nativeElement;
    if (disabled) {
      this.fp.close();
      this.fp.set('clickOpens', false);
      this.fp._input.setAttribute('disabled', 'disabled');
      endEl.setAttribute('disabled', 'disabled');
    } else {
      this.fp.set('clickOpens', true);
      this.fp._input.removeAttribute('disabled');
      endEl.removeAttribute('disabled');
    }
  }
}
