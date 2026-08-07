// auth.js - Gerenciador de Sessão e Interceptador de API
(function() {
  let token = localStorage.getItem("tnm_token");
  let userRaw = localStorage.getItem("tnm_user");
  let user = {};

  try {
    user = JSON.parse(userRaw || "{}");
  } catch {
    user = {};
  }

  // Define o cargo globalmente para a interface
  window.USER_ROLE = user.role || localStorage.getItem("tnm_role") || "admin";

  // Interceptador global do Fetch API para injetar Header Authorization em TODAS as chamadas
  const originalFetch = window.fetch;
  window.fetch = async function(resource, config) {
    config = config || {};

    // Normaliza cabeçalhos da requisição
    let headers = {};
    if (config.headers) {
      if (config.headers instanceof Headers) {
        config.headers.forEach((val, key) => { headers[key] = val; });
      } else if (typeof config.headers === "object") {
        headers = { ...config.headers };
      }
    }

    // Injeta o token de autenticação salvo no localStorage
    const activeToken = localStorage.getItem("tnm_token");
    if (activeToken) {
      headers["Authorization"] = `Bearer ${activeToken}`;
    }

    if (!headers["Content-Type"] && !(config.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    config.headers = headers;
    return originalFetch(resource, config);
  };
})();
