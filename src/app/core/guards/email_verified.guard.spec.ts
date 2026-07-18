/**
 * Тесты emailVerifiedGuard.
 *
 * Гард должен вызывать user.reload() перед проверкой emailVerified,
 * иначе браузер может отдать устаревший кэш Firebase (emailVerified: false
 * после того, как пользователь уже подтвердил почту по ссылке).
 */
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom, of, type Observable } from 'rxjs';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GuardResult } from '@angular/router';
import { emailVerifiedGuard } from './auth.guard';
import { resolveFirebaseUser } from '../utils/resolve-firebase-user';
import { UserService } from '../services/user.service';

// Проект использует Vitest (не Jest): моки через vi.fn / vi.mock.
vi.mock('../utils/resolve-firebase-user', () => ({
  resolveFirebaseUser: vi.fn(),
}));

vi.mock('../services/user.service', () => ({
  UserService: class UserService {},
}));

describe('emailVerifiedGuard', () => {
  let routerMock: { createUrlTree: ReturnType<typeof vi.fn> };
  let authMock: Record<string, never>;
  let userMock: {
    emailVerified: boolean;
    reload: ReturnType<typeof vi.fn>;
  };

  // Angular TestBed требует однократной инициализации окружения для unit-тестов.
  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
    routerMock = { createUrlTree: vi.fn() };
    // emailVerified: false — имитация устаревшего локального стейта до reload().
    userMock = {
      emailVerified: false,
      reload: vi.fn(() => Promise.resolve()),
    };
    authMock = {};

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: Auth, useValue: authMock },
        {
          provide: UserService,
          useValue: {
            ensureProfile: vi.fn(() => of({ role: 'tutor' })),
          },
        },
      ],
    });

    vi.mocked(resolveFirebaseUser).mockReset();
  });

  it('должен пропустить пользователя, только если вызван reload() и почта подтверждена', async () => {
    // reload() подтягивает актуальный emailVerified с серверов Firebase.
    userMock.reload.mockImplementation(() => {
      userMock.emailVerified = true;
      return Promise.resolve();
    });
    vi.mocked(resolveFirebaseUser).mockReturnValue(of(userMock as never));

    // CanActivateFn использует inject() — запускаем гард в контексте TestBed.
    const result$ = TestBed.runInInjectionContext(
      () => emailVerifiedGuard(null!, null!),
    ) as Observable<GuardResult>;
    const result = await firstValueFrom(result$);

    expect(userMock.reload).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
