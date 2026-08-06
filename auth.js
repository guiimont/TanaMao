// auth.js - Gerenciador de Sessão e Interceptador de API
(function() {
  const token = localStorage.getItem("tnm_token");
  const user = JSON.parse(localStorage.getItem("tnm_user") || "{}");

  const isLoginPage = window.location.pathname.endsWith("login.html") || window.location.pathname.endsWith("reset-password.html");

  // 1. Redirecionamento se não estiver logado
  if (!token && !isLoginPage) {
    window.location.href = "login.html";
    return;
  }

  // 2. Define o cargo globalmente para o painel funcionar
  window.USER_ROLE = user.role || localStorage.getItem("tnm_role") || "admin";

  // 3. Interceptador global do Fetch API
  const originalFetch = window.fetch;
  window.fetch = async function() {
    let [resource, config] = arguments;
    if (!config) config = {};
    if (!config.headers) config.headers = {};
    
    const activeToken = localStorage.getItem("tnm_token");
    if (activeToken) {
      config.headers['Authorization'] = `Bearer ${activeToken}`;
    }
    
    if (!config.headers['Content-Type'] && !(config.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await originalFetch(resource, config);
    
    if (response.status === 401 && !isLoginPage) {
      localStorage.removeItem("tnm_token");
      localStorage.removeItem("tnm_user");
      localStorage.removeItem("tnm_role");
      window.location.href = "login.html";
    }
    return response;
  };
})();
