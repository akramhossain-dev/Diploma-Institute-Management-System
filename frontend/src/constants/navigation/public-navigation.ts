import { NavItem } from '@/types/shared/ui.types';

export const publicNavigation: NavItem[] = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'About',
    route: '/about',
    children: [
      { label: 'About MRIST', route: '/about' },
      { label: 'At a Glance', route: '/at-a-glance' },
      { label: 'Mission & Vision', route: '/about#mission-vision' },
    ],
  },
  {
    label: 'Departments',
    route: '/departments',
  },
  {
    label: 'Notices',
    route: '/notices',
  },
  {
    label: 'Admission',
    route: '/admission',
  },
  {
    label: 'Contact',
    route: '/contact',
  },
];
