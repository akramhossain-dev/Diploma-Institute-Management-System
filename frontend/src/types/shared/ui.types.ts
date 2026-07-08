export interface NavItem {
  label: string;
  route: string;
  icon?: string; // String matching a Lucide icon name (e.g., 'Home', 'Users')
  permission?: string; // Placeholder string for future RBAC mapping
  children?: NavItem[];
}
