import { FormTemplate } from '../../components/templates/FormTemplate.js';

const customerData = [
  { id: 1, name: 'Acme Corp', email: 'contact@acme.com', phone: '1234567890', status: 'active', notes: '', birthDate: '' },
  { id: 2, name: 'Globex', email: 'hi@globex.com', phone: '0987654321', status: 'active', notes: '', birthDate: '' },
  { id: 3, name: 'Initech', email: 'support@initech.com', phone: '1122334455', status: 'inactive', notes: '', birthDate: '' },
  { id: 4, name: 'Umbrella', email: 'hello@umbrella.com', phone: '5566778899', status: 'pending', notes: '', birthDate: '' },
];

export class CustomerFormFeature extends FormTemplate {
  constructor() {
    super();
  }

  renderHeader() {
    return '';
  }

  renderFormConfig() {
    return {
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter customer name' },
        { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'customer@example.com' },
        { name: 'phone', label: 'Phone', type: 'tel', pattern: '\\d{10,11}', placeholder: '1234567890' },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'pending'], required: true },
        { name: 'notes', label: 'Notes', type: 'textarea', rows: 4, placeholder: 'Additional notes...' },
        { name: 'birthDate', label: 'Birth Date', type: 'date' },
      ],
    };
  }

  getInitialData(searchParams) {
    if (searchParams.id) {
      const customer = customerData.find((c) => c.id === parseInt(searchParams.id));
      if (customer) {
        return customer;
      }
    }
    return null;
  }

  onSubmit(formData, searchParams) {
    console.log('Form submitted:', formData);
    console.log('Search params:', searchParams);

    if (searchParams.id) {
      console.log('Updating customer with ID:', searchParams.id);
    } else {
      console.log('Creating new customer');
    }

    alert('Form submitted successfully! Check console for details.');
  }

  handleCancel() {
    window.location.href = '/customers';
  }
}
