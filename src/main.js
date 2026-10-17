// Tabler (tabler.io) — CSS/JS antes do style.css para permitir overrides
import '@tabler/core/dist/css/tabler.min.css';
import '@tabler/core/dist/js/tabler.min.js';
import '@tabler/icons-webfont/dist/tabler-icons.min.css';
import './css/style.css';
import './css/sidebar.css';

import { App } from './js/components/app/app.js';

new App('#app').mount();
