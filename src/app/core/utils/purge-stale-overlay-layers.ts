import {
  APP_SELECT_DROPDOWN_OPEN_CLASS,
  APP_SELECT_PORTAL_ROOT,
} from '../constants/overlay-layer';

/**
 * Удаляет «зависшие» select-порталы — после HMR или destroy они перехватывают клики по UI.
 *
 * Не трогаем `.app-dialog-portal-host`: при открытии второй модалки (invite поверх topup)
 * purge сносил portal ещё открытого dialog → невидимый «открытый» стейт и блок других модалок.
 */
export function purgeStaleOverlayLayers(doc: Document): void {
  const root = doc.querySelector(APP_SELECT_PORTAL_ROOT) ?? doc.body;
  root.querySelectorAll('.app-select-portal-host').forEach((node) => node.remove());
  doc.documentElement.classList.remove(APP_SELECT_DROPDOWN_OPEN_CLASS);
}
