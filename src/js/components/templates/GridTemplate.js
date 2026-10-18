import { Template } from '../../template.js';
import { MainTemplate } from './MainTemplate.js';
import { Tabulator } from 'tabulator-tables';
import { gridTemplates } from './grid.imports.js';

export class GridTemplate extends MainTemplate {
  constructor() {
    super();
    this.template = new Template(gridTemplates.grid);
  }

  render() {
    return this.template.render({});
  }

  findSlot() {
    return this.root.querySelector('.grid-container');
  }

  renderGridConfig() {
    throw new Error('renderGridConfig() must be implemented by subclass');
  }

  renderContent(slot) {
    this.tabulator = new Tabulator(slot, this.renderGridConfig());
    return null;
  }
}
