// Centraliza imports das classes de feature usadas pelo sidebar.items.js
import { DashboardFeature } from '../../features/dashboard/DashboardFeature.js';
import { CustomersFeature } from '../../features/customers/CustomersFeature.js';

// Features ainda não implementadas ficam nulas: o Router exibe o placeholder simples
export const features = {
  dashboard: DashboardFeature,
  analytics: null,
  reports: null,
  statistics: null,
  realtime: null,
  notifications: null,
  favourites: null,
  products: null,
  inventory: null,
  orders: null,
  invoices: null,
  customers: CustomersFeature,
  settings: null,
  account: null,
  security: null,
  preferences: null
};
