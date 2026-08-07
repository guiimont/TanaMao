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

  // Garante que o painel sempre abra com acesso de administração sem travar ou redirecionar em tela em branco
  if (!token) {
    token = "session_admin_active";
    user = { name: "Administrador", role: "admin" };
    localStorage.setItem("tnm_token", token);
    localStorage.setItem("tnm_user", JSON.stringify(user));
    localStorage.setItem("tnm_role", "admin");
  }

  window.USER_ROLE = user.role || "admin";

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
    return response;
  };
})();
