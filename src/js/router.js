import { sidebarItems } from './components/sidebar/sidebar.items.js';

const defaultRoute = '/dashboard';
const notFoundRoute = '/dashboard';

export class Router {
  constructor(containerSelector = '#content') {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      this.container = document.querySelector('#route-container');
    }
    this.sidebar = null;
    this.currentRoute = null;
    this.routeHistory = [];
    this.currentFeature = null;
  }

  setSidebar(sidebarInstance) {
    this.sidebar = sidebarInstance;
  }

  init() {
    // Escutar mudanças de URL (back/forward do navegador)
    window.addEventListener('popstate', (event) => {
      this.handlePopState(event);
    });

    // Intercepta cliques em links para SPA navigation
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (link && this.shouldInterceptLink(link)) {
        event.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });

    // Carregar rota inicial
    const initialPath = window.location.pathname || defaultRoute;
    this.navigate(initialPath, false);
  }

  shouldInterceptLink(link) {
    const href = link.getAttribute('href');
    // Ignora links externos, âncoras, mailto, etc.
    // Ignora links dentro do sidebar (tratados pelo sidebar)
    const isInSidebar = link.closest('.sidebar');
    return href &&
           href.startsWith('/') &&
           !href.startsWith('//') &&
           !link.target &&
           !link.hasAttribute('download') &&
           !isInSidebar;
  }

  navigate(path, addToHistory = true) {
    const route = this.resolveRoute(path);

    if (!route) {
      this.navigate(notFoundRoute, addToHistory);
      return;
    }

    // Se for redirecionamento (categorias sem sub-rotas selecionadas)
    if (route.redirectTo) {
      this.navigate(route.redirectTo, addToHistory);
      return;
    }

    // Atualizar URL no navegador
    if (addToHistory) {
      window.history.pushState({ path }, '', path);
    }

    // Sincronizar com sidebar
    if (this.sidebar && route.id) {
      this.sidebar.setActiveItem(route.id);
    }

    // Renderizar componente
    this.renderRoute(route);

    // Atualizar histórico
    if (addToHistory) {
      this.routeHistory.push(path);
    }

    this.currentRoute = route;
  }

  resolveRoute(path) {
    // Busca rota em sidebar.items (fonte única de verdade)
    const item = this.findItemByPath(sidebarItems, path);

    if (item) {
      // title/subtitle não vêm daqui: a feature os define no constructor (super({ title, subtitle }))
      return {
        id: item.id,
        path: item.path,
        label: item.label,
        icon: item.icon,
        component: item.feature
      };
    }

    return null;
  }

  findItemByPath(items, path) {
    for (const item of items) {
      if (item.path === path) return item;
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (subItem.path === path) return subItem;
        }
      }
    }
    return null;
  }

  renderRoute(route) {
    if (!this.container) return;

    // Destruir feature anterior, se existir
    if (this.currentFeature && typeof this.currentFeature.destruir === 'function') {
      this.currentFeature.destruir();
    }
    this.currentFeature = null;

    // Contrato de recurso: classe que extende um template base e implementa renderContent()
    const feature = route.component;
    if (typeof feature === 'function') {
      const featureInstance = new feature();
      featureInstance.mount(this.container);
      this.currentFeature = featureInstance;
      return;
    }

    // Sem feature: placeholder simples, sem scaffold de template
    this.container.innerHTML = `
      <div class="route-placeholder">
        <p>Feature em desenvolvimento...</p>
      </div>
    `;
  }

  handlePopState(event) {
    const path = window.location.pathname;
    this.navigate(path, false);
  }

  // Métodos públicos para controle de navegação

  back() {
    if (this.routeHistory.length > 1) {
      this.routeHistory.pop(); // Remove rota atual
      const previousPath = this.routeHistory[this.routeHistory.length - 1];
      window.history.back();
    }
  }

  forward() {
    window.history.forward();
  }

  go(delta) {
    window.history.go(delta);
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  getRouteHistory() {
    return [...this.routeHistory];
  }
}
