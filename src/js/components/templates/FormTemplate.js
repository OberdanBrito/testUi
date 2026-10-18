import { Template } from '../../template.js';
import { MainTemplate } from './MainTemplate.js';
import { formTemplates } from './form.imports.js';
import { SearchParams } from '../../controller/SearchParams.js';

export class FormTemplate extends MainTemplate {
  constructor() {
    super();
    this.template = new Template(formTemplates.form);
    this.searchParams = SearchParams.parse();
  }

  render() {
    return this.template.render({});
  }

  findSlot() {
    return this.root.querySelector('.form-container');
  }

  renderFormConfig() {
    throw new Error('renderFormConfig() must be implemented by subclass');
  }

  renderContent(slot) {
    const formConfig = this.renderFormConfig();
    const initialData = this.getInitialData(this.searchParams);

    const form = this.buildForm(formConfig, initialData);
    slot.innerHTML = form;

    const formElement = slot.querySelector('form');
    if (formElement) {
      formElement.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    const cancelButtons = slot.querySelectorAll('.btn:not(.btn-primary)');
    cancelButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleCancel();
      });
    });

    return null;
  }

  buildForm(config, initialData = null) {
    const fields = config.fields || [];
    const isEditMode = this.searchParams.id !== null;

    const fieldsHtml = fields.map((field) => {
      const value = initialData ? initialData[field.name] : '';
      return this.renderField(field, value);
    }).join('');

    return `
      <form class="card" novalidate>
        <div class="card-body">
          ${fieldsHtml}
        </div>
        <div class="card-footer text-end">
          <button type="submit" class="btn btn-primary">
            <i class="ti ti-device-floppy"></i>
            ${isEditMode ? 'Save Changes' : 'Create'}
          </button>
          <button type="button" class="btn">
            <i class="ti ti-x"></i>
            Cancel
          </button>
        </div>
      </form>
    `;
  }

  renderField(config, value = '') {
    const {
      name,
      label,
      type = 'text',
      required = false,
      placeholder = '',
      options = [],
      rows = 3,
      min,
      max,
      pattern,
    } = config;

    const requiredAttr = required ? 'required' : '';
    const placeholderAttr = placeholder ? `placeholder="${placeholder}"` : '';
    const minAttr = min !== undefined ? `min="${min}"` : '';
    const maxAttr = max !== undefined ? `max="${max}"` : '';
    const patternAttr = pattern ? `pattern="${pattern}"` : '';

    const requiredClass = required ? 'required' : '';

    let inputHtml = '';

    switch (type) {
      case 'select':
        const optionsHtml = options.map((opt) => {
          const isSelected = value === opt ? 'selected' : '';
          return `<option value="${opt}" ${isSelected}>${opt}</option>`;
        }).join('');
        inputHtml = `
          <select class="form-select" name="${name}" ${requiredAttr}>
            <option value="">Select ${label}</option>
            ${optionsHtml}
          </select>
        `;
        break;

      case 'textarea':
        inputHtml = `
          <textarea class="form-control" name="${name}" rows="${rows}" ${requiredAttr} ${placeholderAttr}>${value}</textarea>
        `;
        break;

      case 'radio':
        inputHtml = options.map((opt) => {
          const isChecked = value === opt ? 'checked' : '';
          return `
            <label class="form-check">
              <input class="form-check-input" type="radio" name="${name}" value="${opt}" ${isChecked} ${requiredAttr}>
              <span class="form-check-label">${opt}</span>
            </label>
          `;
        }).join('');
        break;

      case 'checkbox':
        const isChecked = value ? 'checked' : '';
        inputHtml = `
          <label class="form-check">
            <input class="form-check-input" type="checkbox" name="${name}" ${isChecked}>
            <span class="form-check-label">${label}</span>
          </label>
        `;
        break;

      case 'number':
        inputHtml = `
          <input type="number" class="form-control" name="${name}" value="${value}" ${requiredAttr} ${placeholderAttr} ${minAttr} ${maxAttr}>
        `;
        break;

      case 'date':
        inputHtml = `
          <input type="date" class="form-control" name="${name}" value="${value}" ${requiredAttr}>
        `;
        break;

      case 'datetime':
        inputHtml = `
          <input type="datetime-local" class="form-control" name="${name}" value="${value}" ${requiredAttr}>
        `;
        break;

      case 'email':
        inputHtml = `
          <input type="email" class="form-control" name="${name}" value="${value}" ${requiredAttr} ${placeholderAttr}>
        `;
        break;

      case 'password':
        inputHtml = `
          <input type="password" class="form-control" name="${name}" value="${value}" ${requiredAttr} ${placeholderAttr}>
        `;
        break;

      case 'text':
      default:
        inputHtml = `
          <input type="text" class="form-control" name="${name}" value="${value}" ${requiredAttr} ${placeholderAttr} ${patternAttr}>
        `;
        break;
    }

    if (type === 'checkbox') {
      return `
        <div class="mb-3">
          ${inputHtml}
        </div>
      `;
    }

    if (type === 'radio') {
      return `
        <div class="mb-3">
          <label class="form-label ${requiredClass}">${label}</label>
          <div>
            ${inputHtml}
          </div>
        </div>
      `;
    }

    return `
      <div class="mb-3">
        <label class="form-label ${requiredClass}">${label}</label>
        ${inputHtml}
      </div>
    `;
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData) {
      data[key] = value;
    }

    this.onSubmit(data, this.searchParams);
  }

  onSubmit(formData, searchParams) {
    throw new Error('onSubmit() must be implemented by subclass');
  }

  getInitialData(searchParams) {
    return null;
  }

  handleCancel() {
    window.history.back();
  }
}
