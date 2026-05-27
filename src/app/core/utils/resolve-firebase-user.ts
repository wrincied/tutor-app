import { Auth } from '@angular/fire/auth';
import type { User } from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Дожидается окончания восстановления сессии Firebase (после F5 / прямого URL).
 * Без этого authState.pipe(take(1)) часто даёт null и вечный редирект на /login.
 */
export function resolveFirebaseUser(auth: Auth): Observable<User | null> {
  return from(auth.authStateReady()).pipe(map(() => auth.currentUser));
}
