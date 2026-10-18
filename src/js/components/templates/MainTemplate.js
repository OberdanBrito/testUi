import { PageHeader } from './PageHeader.js';

export class MainTemplate {
  constructor() {
    this.root = null;
    this.slot = null;
    this.route = null;
    this.header = null;
  }

  render() {
    throw new Error('render() must be implemented by subclass');
  }

  findSlot() {
    throw new Error('findSlot() must be implemented by subclass');
  }

  renderContent(slot) {
    throw new Error('renderContent() must be implemented by subclass');
  }

  renderHeader() {
    return '';
  }

  mount(container, route) {
    this.route = route ?? null;
    container.innerHTML = this.render();
    this.root = container;
    this.header = new PageHeader(this.route);
    this.header.mount(container);
    this.slot = this.findSlot();
    this.setHeaderContent(this.renderHeader());
    const content = this.renderContent(this.slot);
    if (content) {
      this.setContent(content);
    }
    return this;
  }

  setHeaderContent(html) {
    if (this.header) {
      this.header.setActions(html);
    }
    return this;
  }

  setContent(html) {
    if (this.slot) {
      this.slot.innerHTML = html;
    }
    return this;
  }
}
