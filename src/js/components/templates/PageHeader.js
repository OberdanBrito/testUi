import { sidebarItems } from '../sidebar/sidebar.items.js';

export class PageHeader {
  constructor(route = {}) {
    this.route = route;
    this.root = null;
    this.identity = this.buildIdentity(route);
  }

  buildIdentity(route) {
    const parent = this.findItemById(sidebarItems, route.parent_id);
    return {
      breadcrumb: parent ? [parent.label, route.label ?? ''] : [],
      pretitle: parent ? parent.label : '',
      title: route.label ?? '',
      subtitle: route.subtitle ?? '',
      icon: route.icon ?? ''
    };
  }

  findItemById(items, id) {
    if (id == null) return null;
    for (const item of items) {
      if (item.id === id) return item;
      if (item.submenu) {
        const found = this.findItemById(item.submenu, id);
        if (found) return found;
      }
    }
    return null;
  }

  mount(container) {
    this.root = container.querySelector('.page-header');
    if (!this.root) return this;
    this.renderBreadcrumb();
    this.setText('.page-pretitle', this.identity.pretitle);
    this.setText('.page-title', this.identity.title);
    this.setText('.page-subtitle', this.identity.subtitle);
    this.setText('.page-icon', this.identity.icon);
    return this;
  }

  renderBreadcrumb() {
    const nav = this.root.querySelector('.page-breadcrumb');
    if (!nav) return;
    const labels = this.identity.breadcrumb;
    if (!labels.length) {
      nav.innerHTML = '';
      return;
    }
    const items = labels.map((label, index) => {
      const isLast = index === labels.length - 1;
      return isLast
        ? `<li class="breadcrumb-item active" aria-current="page">${label}</li>`
        : `<li class="breadcrumb-item">${label}</li>`;
    });
    nav.innerHTML = `<ol class="breadcrumb">${items.join('')}</ol>`;
  }

  setText(selector, value) {
    const el = this.root.querySelector(selector);
    if (el) el.textContent = value;
  }

  setActions(html) {
    if (!this.root) return this;
    const zone = this.root.querySelector('.page-header-actions');
    if (zone) zone.innerHTML = html || '';
    return this;
  }
}
