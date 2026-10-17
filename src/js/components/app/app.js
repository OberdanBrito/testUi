import { Template } from '../../template.js';
import { Router } from '../../router.js';
import { Sidebar } from '../sidebar/sidebar.js';
import { sidebarItems } from '../sidebar/sidebar.items.js';
import { Renderer } from './renderer.js';
import { templates } from './app.templates.js';

export class App {
  constructor(rootSelector, { title = 'Test UI' } = {}) {
    this.renderer = new Renderer(rootSelector);
    this.header = new Template(templates.header);
    this.sidebar = new Template(templates.sidebar);
    this.title = title;
    this.router = null;
    this.sidebarComponent = null;
    this.destroyed = false;
  }

  mount() {
    this.renderer.mount(`
      <div class="app-shell">
        ${this.header.render({ title: this.title })}
        <main class="app-main">
          ${this.sidebar.render({})}
        </main>
      </div>
    `);

    this.router = new Router('#route-container');

    this.sidebarComponent = new Sidebar(sidebarItems);
    this.sidebarComponent.setNavigateCallback((path) => this.router.navigate(path));
    this.sidebarComponent.init();

    // Sidebar conectado antes do init: a navegação inicial já destaca a rota certa
    this.router.setSidebar(this.sidebarComponent);
    this.router.init();

    return this;
  }

  destroy() {
    if (this.destroyed) return this;
    this.renderer.unmount();
    this.destroyed = true;
    return this;
  }
}
