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
      { label: 'Semesters', route: '/admin/semesters' },
      { label: 'Sessions', route: '/admin/sessions' },
      { label: 'Courses', route: '/admin/courses' },
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
    label: 'System Control',
    route: '#',
    icon: 'Database',
    children: [
      { label: 'Notifications', route: '/admin/notifications' },
      { label: 'File Manager', route: '/admin/files' },
      { label: 'Audit Logs', route: '/admin/audit-logs' },
      { label: 'Import & Export', route: '/admin/import-export' },
    ],
  },
  {
    label: 'Settings',
    route: '/admin/settings',
    icon: 'Building',
  },
];
