import { PageTemplate } from '../../components/templates/PageTemplate.js';

export class DashboardFeature extends PageTemplate {
  constructor() {
    super();
  }

  renderHeader() {
    return `
      <button type="button" class="btn">
        <i class="ti ti-download"></i>
        Export
      </button>
      <button type="button" class="btn btn-primary">
        <i class="ti ti-plus"></i>
        New report
      </button>
    `;
  }

  renderContent() {
    return `
      <div class="route-placeholder">
        <p>Dashboard em desenvolvimento...</p>
      </div>
    `;
  }
}
