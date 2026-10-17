// Tabler (tabler.io) — JS do Tabler; CSS vem via <link> no index.html (evita FOUC)
import '@tabler/core/dist/js/tabler.min.js';

import { Header } from './js/components/header/header.js';
import { Sidebar } from './js/components/sidebar/sidebar.js';
import { sidebarItems } from './js/components/sidebar/sidebar.items.js';
import { Router } from './js/router.js';

const header = new Header();
header.init();

const sidebar = new Sidebar(sidebarItems);
const router = new Router('#content');

sidebar.setNavigateCallback((path) => router.navigate(path));
sidebar.init();

router.setSidebar(sidebar);
router.init();
