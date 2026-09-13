import { Component, input } from '@angular/core';
import type { Lang } from '@interfaces';

@Component({
  selector: 'app-lang-flag',
  standalone: true,
  template: `
    <span class="lang-flag" [attr.aria-hidden]="true">
      @switch (code()) {
        @case ('de') {
          <svg viewBox="0 0 5 3" focusable="false">
            <rect width="5" height="1" y="0" fill="#000" />
            <rect width="5" height="1" y="1" fill="#d00" />
            <rect width="5" height="1" y="2" fill="#ffce00" />
          </svg>
        }
        @case ('ru') {
          <svg viewBox="0 0 9 6" focusable="false">
            <rect width="9" height="2" fill="#fff" />
            <rect width="9" height="2" y="2" fill="#0039a6" />
            <rect width="9" height="2" y="4" fill="#d52b1e" />
          </svg>
        }
        @default {
          <svg viewBox="0 0 60 30" focusable="false">
            <rect width="60" height="30" fill="#012169" />
            <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" stroke-width="6" />
            <path d="M0,0 60,30 M60,0 0,30" stroke="#c8102e" stroke-width="4" />
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6" />
          </svg>
        }
      }
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
      line-height: 0;
    }
    .lang-flag {
      display: block;
      width: 1.35rem;
      height: 0.95rem;
      overflow: hidden;
      border-radius: 0.18rem;
      box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.18);
    }
    .lang-flag svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class LangFlagComponent {
  readonly code = input.required<Lang>();
}
