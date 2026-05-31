// src/environments/environment.ts
var environment = {
  production: false,
  // TODO: URL Node-бэкенда (App Hosting / Cloud Run / ngrok), без слэша в конце
  // Пример ngrok: https://abc123.ngrok-free.app
  apiUrl: "https://YOUR-BACKEND-URL-HERE",
  // TODO: публичный URL dev-стенда на GitHub Pages
  appUrl: "https://YOUR-GITHUB-USERNAME.github.io/tutor-app/dev",
  firebaseConfig: {
    apiKey: "AIzaSyDI_O1K8uBbEIe2uJvY-8tzpJjfhgg0rlw",
    authDomain: "simple4u-64822.web.app",
    projectId: "tutorassis",
    storageBucket: "tutorassis.firebasestorage.app",
    messagingSenderId: "965411338053",
    appId: "1:965411338053:web:d98317afdb5602a53c702c",
    measurementId: "G-TXM74NGN6R"
  }
};

// src/app/core/config/api-url.ts
var base = environment.apiUrl.replace(/\/$/, "");
function apiUrl(path = "") {
  const segment = path.replace(/^\/+|\/+$/g, "");
  return segment ? `${base}/api/${segment}` : `${base}/api`;
}

export {
  environment,
  apiUrl
};
//# sourceMappingURL=chunk-ZSKR65RV.js.map
