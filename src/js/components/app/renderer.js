export class Renderer {
  constructor(rootSelector) {
    this.root = document.querySelector(rootSelector);
    if (!this.root) {
      throw new Error(`Renderer: elemento raiz "${rootSelector}" não encontrado no DOM`);
    }
    this.mounted = false;
  }

  mount(html) {
    this.root.innerHTML = html;
    this.mounted = true;
    return this;
  }

  update(html) {
    return this.mount(html);
  }

  unmount() {
    this.root.innerHTML = '';
    this.mounted = false;
    return this;
  }

  isMounted() {
    return this.mounted;
  }
}
