import { environment } from '@environment';

/**
 * Выбор способа входа через Google.
 *
 * На GitHub Pages (wrincied.github.io) используем popup:
 * signInWithRedirect часто возвращает на origin без /tutor-app/dev/,
 * и OAuth-цикл не завершается.
 *
 * На Firebase Hosting (simple4u-64822.web.app) оставляем redirect — там он работает штатно.
 */
export function shouldUseGoogleSignInPopup(): boolean {
  if (!environment.production) {
    return true;
  }
  if (typeof window === 'undefined') {
    return false;
  }
  return window.location.hostname === 'wrincied.github.io';
}
