// auth.js - Gerenciador de Sessão e interceptador da API
(function() {
  "use strict";

  const TOKEN_KEY = "tnm_token";
  const API_ORIGIN = "https://tanamao-backend.onrender.com";
  let redirectingToLogin = false;
  let userRaw = localStorage.getItem("tnm_user");
  let user = {};

  try {
    user = JSON.parse(userRaw || "{}");
  } catch {
    user = {};
  }

  // Define o cargo globalmente para a interface
  window.USER_ROLE = user.role || localStorage.getItem("tnm_role") || "admin";

  function clearSessionAndRedirect() {
    if (redirectingToLogin) return;
    redirectingToLogin = true;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("tnm_user");
    localStorage.removeItem("tnm_role");
    localStorage.removeItem("token");

    if (!window.location.pathname.endsWith("/login.html")) {
      window.location.replace("login.html?session=expired");
    }
  }

  function isApiRequest(resource) {
    try {
      const rawUrl = resource instanceof Request ? resource.url : resource;
      return new URL(rawUrl, window.location.href).origin === API_ORIGIN;
    } catch {
      return false;
    }
  }

  // Instala o interceptador antes de qualquer script do painel.
  const originalFetch = window.fetch.bind(window);
  window.fetch = async function(resource, config) {
    const requestConfig = { ...(config || {}) };
    const requestHeaders = resource instanceof Request ? resource.headers : undefined;
    const headers = new Headers(requestConfig.headers || requestHeaders || undefined);

    // O token só pode sair para o backend do Tá na Mão.
    if (isApiRequest(resource)) {
      const activeToken = localStorage.getItem(TOKEN_KEY);
      if (activeToken) headers.set("Authorization", `Bearer ${activeToken}`);
    }

    if (!headers.has("Content-Type") && requestConfig.body && !(requestConfig.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    requestConfig.headers = headers;
    const response = await originalFetch(resource, requestConfig);

    // Um JWT presente, mas rejeitado, não deve deixar as abas em branco.
    if (isApiRequest(resource) && response.status === 401) {
      clearSessionAndRedirect();
    }

    return response;
  };

  window.TNM_AUTH_READY = true;
})();
