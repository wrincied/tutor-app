import { Component } from '@angular/core';

/** Официальный флаг Беларуси (1:2), орнамент 1/9, полосы 2:1 — только CSS. */
@Component({
  selector: 'app-belarus-flag',
  standalone: true,
  template: `
    <span class="by-flag" aria-hidden="true">
      <span class="by-flag__ornament">
        <span class="by-flag__pattern"></span>
      </span>
      <span class="by-flag__field">
        <span class="by-flag__stripe by-flag__stripe--red"></span>
        <span class="by-flag__stripe by-flag__stripe--green"></span>
      </span>
    </span>
  `,
  styleUrl: './belarus-flag.component.scss',
})
export class BelarusFlagComponent {}
