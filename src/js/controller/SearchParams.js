export class SearchParams {
  constructor() {
    this.url = new URL(window.location.href);
    this.pathname = this.url.pathname;
    this.searchParams = this.url.searchParams;
  }

  static parse() {
    const instance = new SearchParams();
    return instance.toObject();
  }

  static get() {
    return new SearchParams();
  }

  toObject() {
    const params = this.parseQueryString();
    const id = this.getId();

    return {
      id,
      params,
    };
  }

  parseQueryString() {
    const params = {};
    for (const [key, value] of this.searchParams) {
      params[key] = value;
    }
    return params;
  }

  parsePathSegments(pattern, path) {
    const patternSegments = pattern.split('/').filter(Boolean);
    const pathSegments = path.split('/').filter(Boolean);

    const params = {};

    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      if (patternSegment.startsWith(':')) {
        const paramName = patternSegment.slice(1);
        if (pathSegments[i]) {
          params[paramName] = pathSegments[i];
        }
      }
    }

    return params;
  }

  getId() {
    return this.searchParams.get('id') || null;
  }

  getParam(key) {
    return this.searchParams.get(key);
  }

  hasParam(key) {
    return this.searchParams.has(key);
  }

  getPathname() {
    return this.pathname;
  }
}
