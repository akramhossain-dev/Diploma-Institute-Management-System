import { NavItem } from '@/types/shared/ui.types';

export const studentNavigation: NavItem[] = [
  {
    label: 'Dashboard',
    route: '/student/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'My Courses',
    route: '/student/courses',
    icon: 'BookOpen',
  },
  {
    label: 'Attendance Records',
    route: '/student/attendance',
    icon: 'CalendarCheck',
  },
  {
    label: 'Exam Results',
    route: '/student/results',
    icon: 'FileSpreadsheet',
  },
  {
    label: 'Fee Ledger',
    route: '/student/fees',
    icon: 'Receipt',
  },
  {
    label: 'Notice Board',
    route: '/student/notices',
    icon: 'Bell',
  },
];
