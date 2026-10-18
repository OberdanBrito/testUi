import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { GRID_DEFAULTS, SYSTEM_OWNED_KEYS } from './tabulator.defaults.js';

export class CustomTabulator extends Tabulator {
  constructor(element, featureOptions = {}) {
    super(element, resolveGridOptions(featureOptions));
  }
}

function resolveGridOptions(featureOptions = {}) {
  const options = { ...GRID_DEFAULTS, ...featureOptions };

  for (const key of SYSTEM_OWNED_KEYS) {
    if (key in GRID_DEFAULTS) {
      options[key] = GRID_DEFAULTS[key];
    }
  }

  options.columnDefaults = {
    ...GRID_DEFAULTS.columnDefaults,
    ...featureOptions.columnDefaults,
  };

  return options;
}
