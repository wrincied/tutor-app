import { describe, expect, it } from 'vitest';
import type { UserProfile } from '@interfaces';
import { postAuthPath, safeReturnUrl } from './post-auth-navigation';

describe('safeReturnUrl', () => {
  it('accepts in-app paths and localizes them', () => {
    expect(safeReturnUrl('/app/students', 'de')).toBe('/de/app/students');
    expect(safeReturnUrl('/app/calendar?student=1', 'en')).toBe('/en/app/calendar?student=1');
    expect(safeReturnUrl('/ru/app/students', 'de')).toBe('/de/app/students');
  });

  it('rejects open redirects and non-app paths', () => {
    expect(safeReturnUrl('https://evil.example')).toBeNull();
    expect(safeReturnUrl('//evil.example')).toBeNull();
    expect(safeReturnUrl('/login')).toBeNull();
    expect(safeReturnUrl('/app/onboarding')).toBeNull();
  });
});

describe('postAuthPath', () => {
  const profile = {
    onboarding_completed: true,
    data_consent_accepted: true,
  } as UserProfile;

  it('prefers safe returnUrl when onboarding is done', () => {
    expect(postAuthPath(profile, true, '/app/finance', 'de')).toBe('/de/app/finance');
  });

  it('falls back to home without returnUrl', () => {
    expect(postAuthPath(profile, true, null, 'uk')).toBe('/uk/app/home');
  });

  it('sends declined consent back to onboarding so the user can accept', () => {
    expect(
      postAuthPath(
        { onboarding_completed: false, data_consent_accepted: false } as UserProfile,
        true,
        '/app/home',
        'en',
      ),
    ).toBe('/en/app/onboarding');
  });

  it('sends incomplete onboarding to onboarding', () => {
    expect(
      postAuthPath(
        { onboarding_completed: false, data_consent_accepted: true } as UserProfile,
        true,
        null,
        'ru',
      ),
    ).toBe('/ru/app/onboarding');
  });
});
