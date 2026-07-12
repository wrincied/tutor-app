import { environment } from '@environment';

/**
 * signInWithRedirect ломается с hash-routing на GitHub Pages:
 * Firebase возвращает на URL без #/..., и OAuth-цикл не завершается.
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
