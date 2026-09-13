import { describe, expect, it } from 'vitest';
import { toTitleCaseName } from './to-title-case';

describe('toTitleCaseName', () => {
  it('title-cases latin and cyrillic names', () => {
    expect(toTitleCaseName('anna petrova')).toBe('Anna Petrova');
    expect(toTitleCaseName('АННА ПЕТРОВА')).toBe('Анна Петрова');
    expect(toTitleCaseName('іван коваленко')).toBe('Іван Коваленко');
  });

  it('keeps hyphenated and slashed parts', () => {
    expect(toTitleCaseName('anna-maria von-west')).toBe('Anna-Maria Von-West');
    expect(toTitleCaseName('jean/luc')).toBe('Jean/Luc');
  });

  it('trims empty input', () => {
    expect(toTitleCaseName('')).toBe('');
    expect(toTitleCaseName('   ')).toBe('');
    expect(toTitleCaseName(null)).toBe('');
  });
});
