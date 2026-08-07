// Camada de UX: títulos contextuais e acessibilidade sem alterar regras de negócio.
(() => {
  const pages = {
    'aba-config': ['Visão geral', 'Acompanhe vendas, resultados e a saúde da operação.'],
    'aba-vendas': ['Pedidos e produção', 'Organize a cozinha e acompanhe cada pedido até a entrega.'],
    'aba-cardapio': ['Catálogo e estoque de produtos', 'Gerencie produtos, disponibilidade e planejamento de produção.'],
    'aba-compras': ['Estoque e compras', 'Controle insumos, fornecedores, entradas e alertas de reposição.'],
    'aba-cadastro-produto': ['Cadastro de produto', 'Configure preço, ficha técnica, disponibilidade e apresentação na loja.'],
    'aba-textos': ['Administração do site', 'Ajuste regras comerciais, conteúdo e funcionamento da loja.']
  };

  function enhanceTab(tab) {
    if (!tab || tab.querySelector(':scope > .erp-page-heading')) return;
    const data = pages[tab.id];
    if (!data) return;
    const heading = document.createElement('div');
    heading.className = 'erp-page-heading';
    heading.innerHTML = '<div><h1></h1><p></p></div>';
    heading.querySelector('h1').textContent = data[0];
    heading.querySelector('p').textContent = data[1];
    tab.prepend(heading);
  }

  function syncNavigation() {
    document.querySelectorAll('.tab-content').forEach(enhanceTab);
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const active = link.classList.contains('active');
      link.setAttribute('aria-current', active ? 'page' : 'false');
      link.setAttribute('role', 'button');
      link.tabIndex = 0;
      if (!link.dataset.erpKeyboard) {
        link.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            link.click();
          }
        });
        link.dataset.erpKeyboard = 'true';
      }
    });
  }

  const observer = new MutationObserver(syncNavigation);
  document.addEventListener('DOMContentLoaded', () => {
    syncNavigation();
    const nav = document.querySelector('.sidebar-nav');
    if (nav) observer.observe(nav, {subtree:true, attributes:true, attributeFilter:['class']});
  });
})();