import { NavItem } from '@/types/shared/ui.types';

export const adminNavigation: NavItem[] = [
  {
    label: 'Dashboard',
    route: '/admin/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Academic Management',
    route: '#',
    icon: 'GraduationCap',
    children: [
      { label: 'Departments', route: '/admin/departments' },
      { label: 'Courses', route: '/admin/courses' },
      { label: 'Batches', route: '/admin/batches' },
    ],
  },
  {
    label: 'User Management',
    route: '#',
    icon: 'Users',
    children: [
      { label: 'Students', route: '/admin/students' },
      { label: 'Teachers', route: '/admin/teachers' },
      { label: 'Accountants', route: '/admin/accountants' },
      { label: 'Admissions', route: '/admin/admissions' },
    ],
  },
  {
    label: 'Operations',
    route: '#',
    icon: 'Settings2',
    children: [
      { label: 'Attendance', route: '/admin/attendance' },
      { label: 'Exams & Grades', route: '/admin/exams' },
      { label: 'Fee Invoicing', route: '/admin/fees' },
      { label: 'Notices', route: '/admin/notices' },
    ],
  },
  {
    label: 'Settings',
    route: '/admin/institute',
    icon: 'Building',
  },
];
