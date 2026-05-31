import {
  APP_SELECT_DROPDOWN_OPEN_CLASS,
  APP_SELECT_PORTAL_ROOT
} from "./chunk-Z5FPAOY7.js";

// src/app/core/utils/purge-stale-overlay-layers.ts
function purgeStaleOverlayLayers(doc) {
  const root = doc.querySelector(APP_SELECT_PORTAL_ROOT) ?? doc.body;
  root.querySelectorAll(".app-select-portal-host, .app-dialog-portal-host").forEach((node) => node.remove());
  doc.documentElement.classList.remove(APP_SELECT_DROPDOWN_OPEN_CLASS);
}

export {
  purgeStaleOverlayLayers
};
//# sourceMappingURL=chunk-MFN2ATQX.js.map
