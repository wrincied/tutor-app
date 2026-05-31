// src/environments/environment.ts
var environment = {
  production: false,
  apiUrl: "http://localhost:3001",
  appUrl: "http://localhost:4200",
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
//# sourceMappingURL=chunk-EWPFDTJG.js.map
