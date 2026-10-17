import { Template } from '../../template.js';
import { MainTemplate } from './MainTemplate.js';
import { pageTemplates } from './page.imports.js';

export class PageTemplate extends MainTemplate {
  constructor({ title = '', subtitle = '' } = {}) {
    super({ title, subtitle });
    this.template = new Template(pageTemplates.page);
  }

  render() {
    return this.template.render({ title: this.title, subtitle: this.subtitle });
  }

  findSlot() {
    return this.root.querySelector('.page-content');
  }
}
