//auth.js
(function() {
  const token = localStorage.getItem("tnm_token");
  const user = JSON.parse(localStorage.getItem("tnm_user") || "{}");

  // 1. Redirecionamento se não estiver logado
  if (!token && !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
    return;
  }

  // 2. Define o cargo globalmente para o painel funcionar
  // Isso faz com que o USER_ROLE no painel.html não seja "undefined"
  window.USER_ROLE = user.role || 'operador';

  // 3. Interceptador global do Fetch API
  const originalFetch = window.fetch;
  window.fetch = async function() {
    let [resource, config] = arguments;
    if (!config) config = {};
    if (!config.headers) config.headers = {};
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (!config.headers['Content-Type'] && !(config.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await originalFetch(resource, config);
    
    if (response.status === 401 && !window.location.pathname.includes("login.html")) {
      localStorage.removeItem("tnm_token");
      localStorage.removeItem("tnm_user");
      window.location.href = "login.html";
    }
    return response;
  };
})();
