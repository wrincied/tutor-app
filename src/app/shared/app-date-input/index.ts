export { AppDateInputComponent } from './app-date-input.component';
export { AppDateRangeComponent } from './app-date-range.component';

import { AppDateInputComponent } from './app-date-input.component';
import { AppDateRangeComponent } from './app-date-range.component';

/** Для `imports` в standalone-компонентах. */
export const APP_DATE_IMPORTS = [AppDateInputComponent, AppDateRangeComponent] as const;
