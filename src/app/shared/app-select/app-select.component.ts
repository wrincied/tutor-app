import {
  booleanAttribute,
  Component,
  computed,
  forwardRef,
  HostListener,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface AppSelectOption {
  value: string;
  label: string;
  /** Цветная точка слева (статусы урока и т.п.). */
  dotColor?: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './app-select.component.html',
  styleUrl: './app-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppSelectComponent),
      multi: true,
    },
  ],
})
export class AppSelectComponent implements ControlValueAccessor {
  options = input.required<readonly AppSelectOption[]>();
  placeholder = input<string | null>(null);
  menuPlacement = input<'above' | 'below'>('below');
  size = input<'default' | 'compact'>('default');
  disabled = input(false, { transform: booleanAttribute });
  name = input<string | undefined>();
  id = input<string | undefined>();
  ariaLabel = input<string | undefined>();

  protected readonly open = signal(false);
  protected readonly value = signal('');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private readonly cvaDisabled = signal(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly selectedOption = computed(() =>
    this.options().find((opt) => opt.value === this.value()),
  );

  protected readonly displayLabel = computed(() => {
    const selected = this.selectedOption();
    if (selected) {
      return selected.label;
    }
    const placeholder = this.placeholder();
    if (placeholder && !this.value()) {
      return placeholder;
    }
    return this.value() || placeholder || '';
  });

  protected readonly displayDotColor = computed(
    () => this.selectedOption()?.dotColor ?? null,
  );

  writeValue(value: string | null | undefined): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    if (this.isDisabled()) {
      return;
    }
    this.open.update((isOpen) => !isOpen);
    if (this.open()) {
      this.onTouched();
    }
  }

  selectOption(option: AppSelectOption, event: MouseEvent): void {
    event.stopPropagation();
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.open.set(false);
  }

  isSelected(option: AppSelectOption): boolean {
    return this.value() === option.value;
  }

  @HostListener('document:click')
  closeOnOutsideClick(): void {
    if (this.open()) {
      this.open.set(false);
    }
  }
}
