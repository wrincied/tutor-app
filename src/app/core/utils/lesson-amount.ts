/**
 * Lesson amount from snapshot price.
 * `fixed`  — lesson_price is the full lesson fee
 * `hourly` — lesson_price is an hourly rate
 */
export type LessonPriceMode = 'fixed' | 'hourly';

export function normalizeLessonPriceMode(
  raw?: string | null,
  rateUnit?: string | null,
): LessonPriceMode {
  const mode = String(raw ?? '')
    .trim()
    .toLowerCase();
  if (mode === 'fixed' || mode === 'lesson') {
    return 'fixed';
  }
  if (mode === 'hourly' || mode === 'hour') {
    return 'hourly';
  }
  const unit = String(rateUnit ?? '')
    .trim()
    .toLowerCase();
  return unit === 'lesson' ? 'fixed' : 'hourly';
}

export function lessonAmountFromPrice(
  price: number,
  durationMinutes: number,
  priceMode: LessonPriceMode = 'hourly',
): number {
  const amount = Number(price);
  if (Number.isNaN(amount) || amount <= 0) {
    return 0;
  }
  if (priceMode === 'fixed') {
    return amount;
  }
  const minutes = Number(durationMinutes);
  const hours = Math.max(0, Number.isNaN(minutes) ? 60 : minutes) / 60;
  return amount * hours;
}
