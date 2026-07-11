export interface NavItem {
  label: string;
  route: string;
  icon?: string; 
  permission?: string; // Placeholder string for future RBAC mapping
  children?: NavItem[];
}
