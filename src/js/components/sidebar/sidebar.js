export class Sidebar {
  constructor(items) {
    this.items = items;
    this.root = document.body;
    this.sidebar = document.querySelector('.sidebar');
    this.themeToggleBtn = document.querySelector('.theme-toggle');
    this.themeIcon = this.themeToggleBtn.querySelector('.theme-icon');
    this.toggleButtons = document.querySelectorAll('.sidebar-toggle');
    this.onNavigate = null;
  }

  setNavigateCallback(callback) {
    this.onNavigate = callback;
  }

  init() {
    this.renderMenu();
    this.applySavedTheme();
    this.updateThemeIcon();
    this.bindThemeToggle();
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
        const path = link.getAttribute('href');
        if (path && path !== '#' && this.onNavigate) {
          this.onNavigate(path);
        }
      });
    });
  }

  updateThemeIcon() {
    const isDark = this.root.classList.contains('dark-theme');
    this.themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
    this.themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  applyTheme(isDark) {
    this.root.classList.toggle('dark-theme', isDark);
    document.documentElement.dataset.bsTheme = isDark ? 'dark' : 'light';
    return isDark;
  }

  applySavedTheme() {
    this.applyTheme(localStorage.getItem('theme') === 'dark');
  }

  bindThemeToggle() {
    this.themeToggleBtn.addEventListener('click', () => {
      const isDark = this.applyTheme(!this.root.classList.contains('dark-theme'));
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      this.updateThemeIcon();
    });
  }


  bindSidebarToggle() {
    this.toggleButtons.forEach((btn) => {
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
    if (window.innerWidth > 768) this.sidebar.classList.remove('collapsed');
  }

  // Métodos públicos para gerenciar itens ativos

  setActiveItem(id) {
    this.clearActiveItems();
    const item = this.findItemById(id);
    if (item) {
      item.active = true;
      this.renderMenu();
    }
  }

  clearActiveItems() {
    this.clearActiveItemsRecursive(this.items);
    this.renderMenu();
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
