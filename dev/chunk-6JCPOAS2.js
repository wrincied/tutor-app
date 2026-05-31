import {
  from,
  map
} from "./chunk-27NINFBT.js";

// src/app/core/utils/resolve-firebase-user.ts
function resolveFirebaseUser(auth) {
  return from(auth.authStateReady()).pipe(map(() => auth.currentUser));
}

export {
  resolveFirebaseUser
};
//# sourceMappingURL=chunk-6JCPOAS2.js.map
