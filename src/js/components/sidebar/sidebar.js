export class Sidebar {
  constructor(items) {
    this.items = items;
    this.root = document.body;
    // O slot #sidebar envolve o aside.sidebar; a lógica de collapsed opera no aside
    this.sidebar = document.querySelector('#sidebar .sidebar');
    if (!this.sidebar) {
      this.sidebar = document.querySelector('.sidebar');
    }
    this.onNavigate = null;
  }

  setNavigateCallback(callback) {
    this.onNavigate = callback;
  }

  init() {
    this.renderMenu();
    this.bindSidebarToggle();
    this.bindOutsideClick();
    this.expandOnLargeScreens();
  }

  renderMenu() {
    const menuList = this.sidebar.querySelector('.menu-list');
    if (!menuList) return;

    menuList.innerHTML = this.items.map(item => {
      if (item.submenu) {
        return this.renderCategory(item);
      } else {
        return this.renderSimpleItem(item);
      }
    }).join('');

    this.bindSubmenuToggles();
  }

  renderSimpleItem(item) {
    return `
      <li class="menu-item">
        <a href="${item.path || '#'}" class="menu-link ${item.active ? 'active' : ''}" data-id="${item.id}">
          <span class="material-symbols-rounded" aria-hidden="true">${item.icon}</span>
          <span class="menu-label">${item.label}</span>
        </a>
      </li>
    `;
  }

  renderCategory(item) {
    return `
      <li class="menu-item menu-category">
        <a href="${item.path || '#'}" class="menu-link ${item.active ? 'active' : ''}" data-id="${item.id}" data-submenu-toggle>
          <span class="material-symbols-rounded" aria-hidden="true">${item.icon}</span>
          <span class="menu-label">${item.label}</span>
          <span class="material-symbols-rounded submenu-arrow" aria-hidden="true">expand_more</span>
        </a>
        <ul class="submenu">
          ${item.submenu.map(subItem => `
            <li class="menu-item">
              <a href="${subItem.path || '#'}" class="menu-link ${subItem.active ? 'active' : ''}" data-id="${subItem.id}">
                <span class="material-symbols-rounded" aria-hidden="true">${subItem.icon}</span>
                <span class="menu-label">${subItem.label}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </li>
    `;
  }

  bindSubmenuToggles() {
    const toggles = this.sidebar.querySelectorAll('[data-submenu-toggle]');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const submenu = toggle.nextElementSibling;
        const arrow = toggle.querySelector('.submenu-arrow');

        if (submenu) {
          submenu.classList.toggle('expanded');
          arrow.textContent = submenu.classList.contains('expanded') ? 'expand_less' : 'expand_more';
        }
      });
    });

    // Clique em itens de submenu - expande o pai se estiver fechado e navega
    const submenuLinks = this.sidebar.querySelectorAll('.submenu .menu-link');
    submenuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const submenu = link.closest('.submenu');
        if (submenu && !submenu.classList.contains('expanded')) {
          submenu.classList.add('expanded');
          const toggle = submenu.previousElementSibling;
          const arrow = toggle.querySelector('.submenu-arrow');
          if (arrow) {
            arrow.textContent = 'expand_less';
          }
        }
        // Navega para a rota
        if (this.onNavigate) {
          const path = link.getAttribute('href');
          if (path && path !== '#') {
            this.onNavigate(path);
          }
        }
      });
    });

    // Clique em itens simples da raiz - navega
    const simpleLinks = this.sidebar.querySelectorAll('.menu-item:not(.menu-category) .menu-link');
    simpleLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('href');
        if (path && path !== '#' && this.onNavigate) {
          this.onNavigate(path);
        }
      });
    });
  }

  // Theme logic moved to Header component


  bindSidebarToggle() {
    const toggleButtons = document.querySelectorAll('.sidebar-toggle');
    toggleButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sidebar.classList.toggle('collapsed');
      });
    });
  }

  bindOutsideClick() {
    document.addEventListener('click', (event) => {
      if (window.innerWidth > 768 || this.sidebar.classList.contains('collapsed')) return;
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('.sidebar, .sidebar-toggle')) return;
      this.sidebar.classList.add('collapsed');
    });
  }

  expandOnLargeScreens() {
    if (window.innerWidth > 768) {
      // Remove collapsed sem animação no load (evita "slide" a cada carregamento)
      this.sidebar.style.transition = 'none';
      this.sidebar.classList.remove('collapsed');
      requestAnimationFrame(() => {
        this.sidebar.style.transition = '';
      });
    }
  }

  // Métodos públicos para gerenciar itens ativos

  setActiveItem(id) {
    // Remove active from existing nodes
    if (this.sidebar) {
      this.sidebar.querySelectorAll('.menu-link.active').forEach((link) => {
        link.classList.remove('active');
      });
    }
    this.clearActiveItems();

    const item = this.findItemById(id);
    if (item) {
      item.active = true;
      if (this.sidebar) {
        const link = this.sidebar.querySelector(`.menu-link[data-id="${id}"]`);
        if (link) {
          link.classList.add('active');
        }
      }
    }
  }

  clearActiveItems() {
    this.clearActiveItemsRecursive(this.items);
  }

  getActiveItem() {
    return this.findActiveItemRecursive(this.items);
  }

  // Métodos privados helper

  findItemById(id) {
    for (const item of this.items) {
      if (item.id === id) return item;
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (subItem.id === id) return subItem;
        }
      }
    }
    return null;
  }

  clearActiveItemsRecursive(items) {
    items.forEach(item => {
      item.active = false;
      if (item.submenu) {
        item.submenu.forEach(subItem => {
          subItem.active = false;
        });
      }
    });
  }

  findActiveItemRecursive(items) {
    for (const item of items) {
      if (item.active) return item;
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (subItem.active) return subItem;
        }
      }
    }
    return null;
  }
}
