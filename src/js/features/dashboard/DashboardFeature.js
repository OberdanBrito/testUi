import { PageTemplate } from '../../components/templates/PageTemplate.js';

export class DashboardFeature extends PageTemplate {
  constructor() {
    super({ title: 'Dashboard', subtitle: 'Overview and insights' });
  }

  renderContent() {
    return `
      <div class="route-placeholder">
        <p>Dashboard em desenvolvimento...</p>
      </div>
    `;
  }
}
