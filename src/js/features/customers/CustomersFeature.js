import { GridTemplate } from '../../components/templates/GridTemplate.js';

const customerData = [
  { id: 1, name: 'Acme Corp', email: 'contact@acme.com', status: 'active' },
  { id: 2, name: 'Globex', email: 'hi@globex.com', status: 'active' },
  { id: 3, name: 'Initech', email: 'support@initech.com', status: 'inactive' },
  { id: 4, name: 'Umbrella', email: 'hello@umbrella.com', status: 'pending' },
];

export class CustomersFeature extends GridTemplate {
  constructor() {
    super();
  }

  renderHeader() {
    return `
      <button type="button" class="btn btn-primary">
        <i class="ti ti-plus"></i>
        New customer
      </button>
    `;
  }

  renderGridConfig() {
    return {
      data: customerData,
      columns: [
        { title: 'ID', field: 'id', width: 80 },
        { title: 'Name', field: 'name' },
        { title: 'Email', field: 'email' },
        { title: 'Status', field: 'status' },
      ],
    };
  }
}
