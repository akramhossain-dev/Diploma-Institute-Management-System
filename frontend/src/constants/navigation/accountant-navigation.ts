import { NavItem } from '@/types/shared/ui.types';

export const accountantNavigation: NavItem[] = [
  {
    label: 'Dashboard',
    route: '/accountant/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Fees & Payments',
    route: '/accountant/fees',
    icon: 'CreditCard',
  },
  {
    label: 'Collection Reports',
    route: '/accountant/reports/daily',
    icon: 'LineChart',
  },
  {
    label: 'Defaulters List',
    route: '/accountant/reports/defaulters',
    icon: 'AlertTriangle',
  },
  {
    label: 'Notifications',
    route: '/accountant/notifications',
    icon: 'BellRing',
  },
  {
    label: 'Notices',
    route: '/accountant/notices',
    icon: 'Bell',
  },
];
