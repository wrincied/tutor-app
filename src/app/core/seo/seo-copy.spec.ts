import { describe, expect, it } from 'vitest';
import { isNoindexPage, pageDescription } from './seo-copy';

describe('seo-copy', () => {
  it('marks app shell as noindex', () => {
    expect(isNoindexPage('/app/home', 'home')).toBe(true);
    expect(isNoindexPage('/admin-login', 'adminLogin')).toBe(true);
    expect(isNoindexPage('/', 'landing')).toBe(false);
    expect(isNoindexPage('/pricing', 'pricing')).toBe(false);
  });

  it('mentions simple4u.at and disambiguates .io in default copy', () => {
    const de = pageDescription('landing', 'de');
    expect(de.toLowerCase()).toContain('simple4u.at');
    expect(de.toLowerCase()).toContain('simple4u.io');
  });
});
