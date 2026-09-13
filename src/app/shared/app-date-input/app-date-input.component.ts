import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
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
import type { Lang } from '@interfaces';
import { I18nService } from '../../core/services/i18n.service';
import {
  flatpickrAltFormat,
  flatpickrDatePlaceholder,
  flatpickrLocale,
} from './flatpickr-locale';

export type AppDateInputMode = 'date' | 'time' | 'datetime';

/** YYYY-MM-DD */
function toIsoDate(d: Date | undefined): string {
  if (!d || Number.isNaN(d.getTime())) {
    return '';
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** HH:mm */
function toTimeValue(d: Date | undefined): string {
  if (!d || Number.isNaN(d.getTime())) {
    return '';
  }
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/** datetime-local compatible: YYYY-MM-DDTHH:mm */
function toLocalDateTimeValue(d: Date | undefined): string {
  if (!d || Number.isNaN(d.getTime())) {
    return '';
  }
  return `${toIsoDate(d)}T${toTimeValue(d)}`;
}

function formatValue(mode: AppDateInputMode, d: Date | undefined): string {
  if (mode === 'time') {
    return toTimeValue(d);
  }
  if (mode === 'datetime') {
    return toLocalDateTimeValue(d);
  }
  return toIsoDate(d);
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
      [attr.placeholder]="placeholder()"
      [disabled]="isDisabled"
      autocomplete="off"
      [attr.inputmode]="resolvedMode() === 'datetime' ? 'text' : 'none'"
    />
  `,
  styleUrl: './app-date-input.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'app-date-input',
    '[class.app-date-input--disabled]': 'isDisabled',
    '[class.app-date-input--datetime]': 'resolvedMode() === "datetime"',
    '[class.app-date-input--time]': 'resolvedMode() === "time"',
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
  /**
   * `date` → YYYY-MM-DD
   * `time` → HH:mm
   * `datetime` → YYYY-MM-DDTHH:mm (visible field shows d.m.Y H:i)
   */
  mode = input<AppDateInputMode>('date');
  /** @deprecated Prefer mode="datetime". */
  enableTime = input(false, { transform: booleanAttribute });
  minDate = input<string | null>(null);
  maxDate = input<string | null>(null);

  protected readonly resolvedMode = computed<AppDateInputMode>(() => {
    if (this.enableTime() && this.mode() === 'date') {
      return 'datetime';
    }
    return this.mode();
  });

  protected readonly placeholder = computed(() => {
    const lang = this.i18n.lang();
    const mode = this.resolvedMode();
    if (mode === 'time') {
      return 'HH:mm';
    }
    const datePh = flatpickrDatePlaceholder(lang);
    return mode === 'datetime' ? `${datePh} HH:mm` : datePh;
  });

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
      const mode = this.resolvedMode();
      if (!this.fp) {
        return;
      }
      this.fp.set('locale', flatpickrLocale(lang) ?? 'default');
      if (mode === 'datetime') {
        this.fp.set('dateFormat', this.displayFormat(lang, mode));
      } else {
        this.fp.set('altFormat', this.displayFormat(lang, mode));
      }
      this.fp.redraw();
      this.syncFromValue();
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

  private displayFormat(lang: Lang, mode: AppDateInputMode): string {
    if (mode === 'time') {
      return 'H:i';
    }
    const datePart = flatpickrAltFormat(lang);
    return mode === 'datetime' ? `${datePart} H:i` : datePart;
  }

  private modelFormat(mode: AppDateInputMode): string {
    if (mode === 'time') {
      return 'H:i';
    }
    return mode === 'datetime' ? 'Y-m-d\\TH:i' : 'Y-m-d';
  }

  private initFlatpickr(): void {
    const el = this.hostInput().nativeElement;
    const lang = this.i18n.lang();
    const mode = this.resolvedMode();
    const timeOnly = mode === 'time';
    const withTime = mode === 'time' || mode === 'datetime';
    /** Datetime: one visible editable field (no hidden altInput). */
    const useAlt = mode === 'date';

    this.fp = flatpickr(el, {
      // Visible format in the input for datetime; ISO only in CVA value.
      dateFormat: mode === 'datetime' ? this.displayFormat(lang, mode) : this.modelFormat(mode),
      altInput: useAlt,
      altFormat: useAlt ? this.displayFormat(lang, mode) : undefined,
      allowInput: true,
      disableMobile: true,
      enableTime: withTime,
      noCalendar: timeOnly,
      time_24hr: true,
      minuteIncrement: 5,
      locale: flatpickrLocale(lang),
      monthSelectorType: 'static',
      appendTo: typeof document !== 'undefined' ? document.body : undefined,
      onReady: (_dates, _str, instance) => {
        instance.calendarContainer.classList.add('app-flatpickr');
      },
      onChange: (dates) => this.emitFromDates(mode, dates),
      onValueUpdate: (dates) => this.emitFromDates(mode, dates),
      onClose: (dates) => {
        this.emitFromDates(mode, dates);
        this.onTouched();
      },
    });

    if (useAlt) {
      const alt = this.fp.altInput;
      if (alt) {
        const visibleClass = String(this.inputClass() || 'app-input').trim();
        alt.className = `app-date-input__alt ${visibleClass}`.trim();
        if (this.id()) {
          alt.id = this.id()!;
          el.removeAttribute('id');
        }
        if (this.ariaLabel()) {
          alt.setAttribute('aria-label', this.ariaLabel()!);
        }
        if (this.name()) {
          alt.setAttribute('name', this.name()!);
        }
      }
    }
  }

  private emitFromDates(mode: AppDateInputMode, dates: Date[]): void {
    const next = formatValue(mode, dates[0]);
    if (next === this.valueIso) {
      return;
    }
    this.valueIso = next;
    this.onChange(next);
  }

  private syncFromValue(): void {
    if (!this.fp) {
      return;
    }
    if (!this.valueIso) {
      this.fp.clear(false);
      return;
    }
    const mode = this.resolvedMode();
    if (mode === 'time') {
      const m = /^(\d{1,2}):(\d{2})$/.exec(this.valueIso);
      if (!m) {
        this.fp.clear(false);
        return;
      }
      const seed = new Date(1970, 0, 1, Number(m[1]), Number(m[2]), 0, 0);
      this.fp.setDate(seed, false);
      return;
    }
    // Parse model ISO / date into the picker (display format is separate for datetime).
    this.fp.setDate(this.valueIso, false, this.modelFormat(mode));
  }

  private syncDisabled(): void {
    const disabled = this.isDisabled || this.disabled();
    this.isDisabled = disabled;
    if (!this.fp) {
      return;
    }
    const inputs = [this.fp._input, this.fp.altInput].filter(Boolean) as HTMLInputElement[];
    if (disabled) {
      this.fp.close();
      this.fp.set('clickOpens', false);
      for (const inputEl of inputs) {
        inputEl.setAttribute('disabled', 'disabled');
      }
    } else {
      this.fp.set('clickOpens', true);
      for (const inputEl of inputs) {
        inputEl.removeAttribute('disabled');
      }
    }
  }

  private syncMinMax(): void {
    if (!this.fp) {
      return;
    }
    if (this.resolvedMode() === 'time') {
      return;
    }
    const min = this.minDate();
    const max = this.maxDate();
    this.fp.set('minDate', min || undefined);
    this.fp.set('maxDate', max || undefined);
  }
}
