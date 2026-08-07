import {
  afterNextRender,
  booleanAttribute,
  Component,
  effect,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  OnDestroy,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import flatpickr from 'flatpickr';
import type { Instance } from 'flatpickr/dist/types/instance';
import { I18nService } from '../../core/services/i18n.service';
import { flatpickrAltFormat, flatpickrLocale } from './flatpickr-locale';

function toIsoDate(d: Date | undefined): string {
  if (!d || Number.isNaN(d.getTime())) {
    return '';
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

@Component({
  selector: 'app-date-input',
  standalone: true,
  template: `
    <input
      #host
      type="text"
      class="app-date-input__field"
      [class]="inputClass()"
      [id]="id() || null"
      [attr.name]="name() || null"
      [attr.aria-label]="ariaLabel() || null"
      [disabled]="isDisabled"
      autocomplete="off"
      inputmode="none"
    />
  `,
  styleUrl: './app-date-input.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'app-date-input',
    '[class.app-date-input--disabled]': 'isDisabled',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppDateInputComponent),
      multi: true,
    },
  ],
})
export class AppDateInputComponent implements ControlValueAccessor, OnDestroy {
  private readonly i18n = inject(I18nService);
  private readonly injector = inject(Injector);
  private readonly hostInput = viewChild.required<ElementRef<HTMLInputElement>>('host');

  private fp: Instance | null = null;
  private valueIso = '';
  private ready = false;

  protected isDisabled = false;
  private onChange: (v: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  id = input<string | undefined>();
  name = input<string | undefined>();
  ariaLabel = input<string | undefined>();
  inputClass = input<string>('');
  disabled = input(false, { transform: booleanAttribute });
  /** Inclusive min (YYYY-MM-DD). */
  minDate = input<string | null>(null);
  /** Inclusive max (YYYY-MM-DD). */
  maxDate = input<string | null>(null);

  constructor() {
    afterNextRender(
      () => {
        this.initFlatpickr();
        this.ready = true;
        this.syncFromValue();
        this.syncDisabled();
        this.syncMinMax();
      },
      { injector: this.injector },
    );

    effect(() => {
      this.disabled();
      if (this.ready) {
        this.syncDisabled();
      }
    });

    effect(() => {
      this.minDate();
      this.maxDate();
      if (this.ready) {
        this.syncMinMax();
      }
    });

    effect(() => {
      const lang = this.i18n.lang();
      if (!this.fp) {
        return;
      }
      this.fp.set('locale', flatpickrLocale(lang) ?? 'default');
      this.fp.set('altFormat', flatpickrAltFormat(lang));
      this.fp.redraw();
    });
  }

  ngOnDestroy(): void {
    this.fp?.destroy();
    this.fp = null;
  }

  writeValue(value: string | null): void {
    this.valueIso = typeof value === 'string' ? value.trim() : '';
    if (this.ready) {
      this.syncFromValue();
    }
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.ready) {
      this.syncDisabled();
    }
  }

  private initFlatpickr(): void {
    const el = this.hostInput().nativeElement;
    const lang = this.i18n.lang();

    this.fp = flatpickr(el, {
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: flatpickrAltFormat(lang),
      allowInput: false,
      disableMobile: true,
      locale: flatpickrLocale(lang),
      monthSelectorType: 'static',
      onChange: (dates) => {
        const next = toIsoDate(dates[0]);
        if (next === this.valueIso) {
          return;
        }
        this.valueIso = next;
        this.onChange(next);
      },
      onClose: () => this.onTouched(),
    });

    const alt = this.fp.altInput;
    if (alt) {
      alt.className = `${el.className} app-date-input__alt`.trim();
      if (this.id()) {
        alt.id = this.id()!;
        el.removeAttribute('id');
      }
      if (this.ariaLabel()) {
        alt.setAttribute('aria-label', this.ariaLabel()!);
      }
    }
  }

  private syncFromValue(): void {
    if (!this.fp) {
      return;
    }
    if (!this.valueIso) {
      this.fp.clear(false);
      return;
    }
    this.fp.setDate(this.valueIso, false, 'Y-m-d');
  }

  private syncDisabled(): void {
    const disabled = this.isDisabled || this.disabled();
    this.isDisabled = disabled;
    if (!this.fp) {
      return;
    }
    if (disabled) {
      this.fp.close();
      this.fp.set('clickOpens', false);
      this.fp._input.setAttribute('disabled', 'disabled');
      this.fp.altInput?.setAttribute('disabled', 'disabled');
    } else {
      this.fp.set('clickOpens', true);
      this.fp._input.removeAttribute('disabled');
      this.fp.altInput?.removeAttribute('disabled');
    }
  }

  private syncMinMax(): void {
    if (!this.fp) {
      return;
    }
    const min = this.minDate();
    const max = this.maxDate();
    this.fp.set('minDate', min || undefined);
    this.fp.set('maxDate', max || undefined);
  }
}
