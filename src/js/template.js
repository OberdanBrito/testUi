export class Template {
  constructor(source) {
    this.source = source;
  }

  render(data) {
    return this.source.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '');
  }
}
