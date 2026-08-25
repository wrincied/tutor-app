import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import type { Lang } from '@interfaces';
import { I18nService } from '../../core/services/i18n.service';
import { LangFlagComponent } from './lang-flag.component';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [LangFlagComponent],
  templateUrl: './lang-switcher.component.html',
  styleUrl: './lang-switcher.component.scss',
})
export class LangSwitcherComponent {
  readonly i18n = inject(I18nService);
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Landing (dark) or account settings (light). */
  readonly variant = input<'landing' | 'account'>('landing');

  readonly menuOpen = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.host.nativeElement.contains(target)) {
      this.menuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.menuOpen.set(false);
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  pickLang(lang: Lang): void {
    this.i18n.setLang(lang);
    this.menuOpen.set(false);
  }
}
