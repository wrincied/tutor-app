import { Component } from '@angular/core';

/** Eager shell while lazy landing chunk loads (kept out of landing feature chunk). */
@Component({
  selector: 'app-landing-skeleton',
  standalone: true,
  templateUrl: './landing-skeleton.component.html',
  styleUrl: './landing-skeleton.component.scss',
})
export class LandingSkeletonComponent {}
