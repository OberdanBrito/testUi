import { features } from './sidebar.imports.js';

export const sidebarItems = [
  {
    id: 1,
    parent_id: null,
    path: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
    active: true,
    feature: features.dashboard // referência futura à feature
  },
  {
    id: 2,
    parent_id: null,
    path: '/analytics',
    icon: 'insert_chart',
    label: 'Analytics',
    active: false,
    redirectTo: '/analytics/reports', // redireciona para primeira sub-rota
    feature: features.analytics,
    submenu: [
      { id: 3, parent_id: 2, path: '/analytics/reports', icon: 'bar_chart', label: 'Reports', active: false, feature: features.reports },
      { id: 4, parent_id: 2, path: '/analytics/statistics', icon: 'pie_chart', label: 'Statistics', active: false, feature: features.statistics },
      { id: 5, parent_id: 2, path: '/analytics/realtime', icon: 'timeline', label: 'Real-time', active: false, feature: features.realtime }
    ]
  },
  {
    id: 6,
    parent_id: null,
    path: '/notifications',
    icon: 'notifications',
    label: 'Notifications',
    active: false,
    feature: features.notifications
  },
  {
    id: 7,
    parent_id: null,
    path: '/favourites',
    icon: 'star',
    label: 'Favourites',
    active: false,
    feature: features.favourites
  },
  {
    id: 8,
    parent_id: null,
    path: '/products',
    icon: 'storefront',
    label: 'Products',
    active: false,
    redirectTo: '/products/inventory', // redireciona para primeira sub-rota
    feature: features.products,
    submenu: [
      { id: 9, parent_id: 8, path: '/products/inventory', icon: 'inventory', label: 'Inventory', active: false, feature: features.inventory },
      { id: 10, parent_id: 8, path: '/products/orders', icon: 'shopping_cart', label: 'Orders', active: false, feature: features.orders },
      { id: 11, parent_id: 8, path: '/products/invoices', icon: 'receipt', label: 'Invoices', active: false, feature: features.invoices }
    ]
  },
  {
    id: 12,
    parent_id: null,
    path: '/customers',
    icon: 'group',
    label: 'Customers',
    active: false,
    feature: features.customers
  },
  {
    id: 13,
    parent_id: null,
    path: '/settings',
    icon: 'settings',
    label: 'Settings',
    active: false,
    redirectTo: '/settings/account', // redireciona para primeira sub-rota
    feature: features.settings,
    submenu: [
      { id: 14, parent_id: 13, path: '/settings/account', icon: 'account', label: 'Account', active: false, feature: features.account },
      { id: 15, parent_id: 13, path: '/settings/security', icon: 'security', label: 'Security', active: false, feature: features.security },
      { id: 16, parent_id: 13, path: '/settings/preferences', icon: 'tune', label: 'Preferences', active: false, feature: features.preferences }
    ]
  }
];
