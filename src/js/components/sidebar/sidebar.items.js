import { features } from './sidebar.imports.js';

export const sidebarItems = [
  {
    id: 1,
    parent_id: null,
    path: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
    subtitle: 'Overview of your activity at a glance',
    active: true,
    feature: features.dashboard // referência futura à feature
  },
  {
    id: 2,
    parent_id: null,
    path: '/analytics',
    icon: 'insert_chart',
    label: 'Analytics',
    subtitle: 'Track performance across your workspace',
    active: false,
    redirectTo: '/analytics/reports', // redireciona para primeira sub-rota
    feature: features.analytics,
    submenu: [
      { id: 3, parent_id: 2, path: '/analytics/reports', icon: 'bar_chart', label: 'Reports', subtitle: 'Detailed reports across your analytics', active: false, feature: features.reports },
      { id: 4, parent_id: 2, path: '/analytics/statistics', icon: 'pie_chart', label: 'Statistics', subtitle: 'Metrics and trends in charts', active: false, feature: features.statistics },
      { id: 5, parent_id: 2, path: '/analytics/realtime', icon: 'timeline', label: 'Real-time', subtitle: 'Live activity as it happens', active: false, feature: features.realtime }
    ]
  },
  {
    id: 6,
    parent_id: null,
    path: '/notifications',
    icon: 'notifications',
    label: 'Notifications',
    subtitle: 'Recent alerts and updates',
    active: false,
    feature: features.notifications
  },
  {
    id: 7,
    parent_id: null,
    path: '/favourites',
    icon: 'star',
    label: 'Favourites',
    subtitle: 'Items you saved for quick access',
    active: false,
    feature: features.favourites
  },
  {
    id: 8,
    parent_id: null,
    path: '/products',
    icon: 'storefront',
    label: 'Products',
    subtitle: 'Everything you sell, in one place',
    active: false,
    redirectTo: '/products/inventory', // redireciona para primeira sub-rota
    feature: features.products,
    submenu: [
      { id: 9, parent_id: 8, path: '/products/inventory', icon: 'inventory', label: 'Inventory', subtitle: 'Stock levels and product availability', active: false, feature: features.inventory },
      { id: 10, parent_id: 8, path: '/products/orders', icon: 'shopping_cart', label: 'Orders', subtitle: 'Purchase orders and fulfillment status', active: false, feature: features.orders },
      { id: 11, parent_id: 8, path: '/products/invoices', icon: 'receipt', label: 'Invoices', subtitle: 'Billing history and payment status', active: false, feature: features.invoices }
    ]
  },
  {
    id: 12,
    parent_id: null,
    path: '/customers',
    icon: 'group',
    label: 'Customers',
    subtitle: 'Your customer directory and segments',
    active: false,
    feature: features.customers
  },
  {
    id: 13,
    parent_id: null,
    path: '/settings',
    icon: 'settings',
    label: 'Settings',
    subtitle: 'Manage how the app works for you',
    active: false,
    redirectTo: '/settings/account', // redireciona para primeira sub-rota
    feature: features.settings,
    submenu: [
      { id: 14, parent_id: 13, path: '/settings/account', icon: 'account', label: 'Account', subtitle: 'Your profile and personal details', active: false, feature: features.account },
      { id: 15, parent_id: 13, path: '/settings/security', icon: 'security', label: 'Security', subtitle: 'Password, sessions and access control', active: false, feature: features.security },
      { id: 16, parent_id: 13, path: '/settings/preferences', icon: 'tune', label: 'Preferences', subtitle: 'Customize the app to your needs', active: false, feature: features.preferences }
    ]
  }
];
