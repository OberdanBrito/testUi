export class Header {
  constructor() {
    this.root = document.body;
    this.themeToggleBtn = document.querySelector('.theme-toggle');
    this.themeIcon = this.themeToggleBtn ? this.themeToggleBtn.querySelector('.theme-icon') : null;
  }

  init() {
    this.applySavedTheme();
    this.updateThemeIcon();
    this.bindThemeToggle();
    return this;
  }

  updateThemeIcon() {
    if (!this.themeIcon || !this.themeToggleBtn) return;
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
    if (!this.themeToggleBtn) return;
    this.themeToggleBtn.addEventListener('click', () => {
      const isDark = this.applyTheme(!this.root.classList.contains('dark-theme'));
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      this.updateThemeIcon();
    });
  }
}
