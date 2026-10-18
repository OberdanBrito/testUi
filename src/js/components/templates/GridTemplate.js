import { Template } from '../../template.js';
import { MainTemplate } from './MainTemplate.js';
import { CustomTabulator } from '../tabulator/CustomTabulator.js';
import { gridTemplates } from './grid.imports.js';

const CHEVRON_LEFT =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="icon"><path d="M15 6l-6 6l6 6"></path></svg>';
const CHEVRON_RIGHT =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="icon"><path d="M9 6l6 6l-6 6"></path></svg>';

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
    this.tabulator = new CustomTabulator(slot, this.renderGridConfig());
    this.bindGridChrome();
    return null;
  }

  bindGridChrome() {
    this.pageSizeInput = this.root.querySelector('.grid-page-size');
    this.searchInput = this.root.querySelector('.grid-search');
    this.pageInfo = this.root.querySelector('.grid-page-info');
    this.paginationList = this.root.querySelector('.grid-pagination');

    this.pageSizeInput.addEventListener('change', () => {
      const size = Number.parseInt(this.pageSizeInput.value, 10);
      if (Number.isInteger(size) && size > 0) {
        this.tabulator.setPageSize(size);
      } else {
        this.pageSizeInput.value = String(this.tabulator.getPageSize());
      }
    });

    this.searchInput.addEventListener('input', () => {
      const term = this.searchInput.value;
      if (term) {
        this.tabulator.setFilter(globalRowFilter, { term });
      } else {
        this.tabulator.clearFilter();
      }
    });

    this.paginationList.addEventListener('click', (event) => {
      const link = event.target.closest('[data-page]');
      if (!link) return;
      event.preventDefault();
      const action = link.dataset.page;
      const page = this.tabulator.getPage();
      if (action === 'prev') {
        this.tabulator.setPage(page - 1);
      } else if (action === 'next') {
        this.tabulator.setPage(page + 1);
      } else {
        this.tabulator.setPage(Number.parseInt(action, 10));
      }
    });

    this.tabulator.on('tableBuilt', () => {
      this.gridReady = true;
      this.refreshGridFooter();
    });
    this.tabulator.on('dataLoaded', () => this.refreshGridFooter());
    this.tabulator.on('dataFiltered', () => this.refreshGridFooter());
    this.tabulator.on('pageLoaded', () => this.refreshGridFooter());
    this.tabulator.on('renderComplete', () => this.refreshGridFooter());
  }

  refreshGridFooter() {
    if (!this.gridReady) return;
    const total = this.tabulator.getDataCount('active');
    const size = this.tabulator.getPageSize();
    const page = this.tabulator.getPage();
    const pageCount = this.tabulator.getPageMax();
    const from = total === 0 ? 0 : (page - 1) * size + 1;
    const to = total === 0 ? 0 : Math.min(page * size, total);

    this.pageInfo.innerHTML = `Showing <strong>${from} to ${to}</strong> of <strong>${total} entries</strong>`;
    this.paginationList.innerHTML = [
      paginationItem('prev', CHEVRON_LEFT, 'Previous page', page <= 1),
      ...Array.from({ length: pageCount }, (_, index) => {
        const item = index + 1;
        return paginationItem(String(item), String(item), `Page ${item}`, false, item === page);
      }),
      paginationItem('next', CHEVRON_RIGHT, 'Next page', page >= pageCount),
    ].join('');
  }
}

function paginationItem(action, content, label, disabled, active = false) {
  const classes = `page-item${active ? ' active' : ''}${disabled ? ' disabled' : ''}`;
  const state = disabled ? ' tabindex="-1" aria-disabled="true"' : active ? ' aria-current="page"' : '';
  return `<li class="${classes}"><a class="page-link" href="#" data-page="${action}" aria-label="${label}"${state}>${content}</a></li>`;
}

function globalRowFilter(data, filterParams) {
  const term = String(filterParams?.term ?? '').toLowerCase();
  if (!term) return true;
  return Object.values(data).some((value) => String(value ?? '').toLowerCase().includes(term));
}
