export class MainTemplate {
  constructor({ title = '', subtitle = '' } = {}) {
    this.title = title;
    this.subtitle = subtitle;
    this.root = null;
    this.slot = null;
  }

  render() {
    throw new Error('render() must be implemented by subclass');
  }

  findSlot() {
    throw new Error('findSlot() must be implemented by subclass');
  }

  renderContent() {
    throw new Error('renderContent() must be implemented by subclass');
  }

  mount(container) {
    container.innerHTML = this.render();
    this.root = container;
    this.slot = this.findSlot();
    this.setContent(this.renderContent());
    return this;
  }

  setContent(html) {
    if (this.slot) {
      this.slot.innerHTML = html;
    }
    return this;
  }
}
