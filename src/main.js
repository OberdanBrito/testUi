// Tabler (tabler.io) — CSS/JS antes do style.css para permitir overrides
import '@tabler/core/dist/css/tabler.min.css';
import '@tabler/core/dist/js/tabler.min.js';
import '@tabler/icons-webfont/dist/tabler-icons.min.css';
import './css/style.css';
import './css/sidebar.css';

// Templates HTML em arquivos .raw importados como string (Vite ?raw)
import cardTemplate from '../templates/card.raw?raw';
import headerTemplate from '../templates/header.raw?raw';
import sidebarTemplate from '../templates/sidebar.raw?raw';

import { Sidebar } from './js/components/sidebar/sidebar.js';
import { sidebarItems } from './js/components/sidebar/sidebar.items.js';
import { Router } from './js/router.js';

class Template {
  constructor(source) {
    this.source = source;
  }

  render(data) {
    return this.source.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '');
  }
}

class App {
  constructor(rootSelector) {
    this.root = document.querySelector(rootSelector);
    this.header = new Template(headerTemplate);
    this.sidebar = new Template(sidebarTemplate);
  }

  mount() {
    this.root.innerHTML = `
      <div class="app-shell">
        ${this.header.render({ title: 'Test UI' })}
        <main class="app-main">
          ${this.sidebar.render({})}
        </main>
      </div>
    `;

    // Inicializar router primeiro
    const router = new Router('#route-container');
    router.init();

    // Inicializar sidebar com callback de navegação
    const sidebar = new Sidebar(sidebarItems);
    sidebar.setNavigateCallback((path) => router.navigate(path));
    sidebar.init();

    // Conectar sidebar ao router para sincronização
    router.setSidebar(sidebar);
  }
}

new App('#app').mount();
