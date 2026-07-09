import { NavItem } from '@/types/shared/ui.types';

export const teacherNavigation: NavItem[] = [
  {
    label: 'Dashboard',
    route: '/teacher/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Assigned Courses',
    route: '/teacher/courses',
    icon: 'BookOpen',
  },
  {
    label: 'Mark Attendance',
    route: '/teacher/attendance',
    icon: 'CalendarDays',
  },
  {
    label: 'Result Entry',
    route: '/teacher/results',
    icon: 'Award',
  },
  {
    label: 'Students List',
    route: '/teacher/students',
    icon: 'Users',
  },
  {
    label: 'Notifications',
    route: '/teacher/notifications',
    icon: 'BellRing',
  },
  {
    label: 'Department Notices',
    route: '/teacher/notices',
    icon: 'Bell',
  },
];
