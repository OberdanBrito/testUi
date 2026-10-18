import { GridTemplate } from '../../components/templates/GridTemplate.js';
import {CustomerFormFeature} from "./CustomerFormFeature.js";

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

  renderButtons() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-primary';
    button.innerHTML = `
      <i class="ti ti-plus"></i>
      New customer
    `;
    button.addEventListener('click', () => {
      new CustomerFormFeature().render();
    });

    return button.innerHTML;
  }

  renderHeader() {
    return this.renderButtons();
  }

  renderGridConfig() {
    return {
      data: customerData,
      columns: [
        { title: 'ID', field: 'id', width: 80 },
        { title: 'Name', field: 'name' },
        { title: 'Email', field: 'email' },
        { title: 'Status', field: 'status' },
        {
          title: 'Actions',
          field: 'actions',
          width: 100,
          formatter: (cell) => {
            const rowData = cell.getRow().getData();
            return `
              <button class="btn btn-sm" onclick="window.location.href='/customers/edit?id=${rowData.id}'">
                <i class="ti ti-edit"></i>
              </button>
            `;
          },
        },
      ],
    };
  }
}
