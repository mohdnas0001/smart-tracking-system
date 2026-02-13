import { User } from '@/types/srap';

export const getRolePermissions = (role: string): User['permissions'] => {
  switch (role) {
    case 'dg':
      return {
        canEdit: false,
        canApprove: true,
        canExport: true,
        canViewAll: true,
        canManageKPIs: true,
        canManagePillars: true
      };
    case 'director':
      return {
        canEdit: true,
        canApprove: true,
        canExport: true,
        canViewAll: true,
        canManageKPIs: true,
        canManagePillars: true
      };
    case 'desk-officer':
      return {
        canEdit: true,
        canApprove: false,
        canExport: false,
        canViewAll: false,
        canManageKPIs: false,
        canManagePillars: false
      };
    case 'cps':
      return {
        canEdit: false,
        canApprove: false,
        canExport: true,
        canViewAll: true,
        canManageKPIs: false,
        canManagePillars: false
      };
    case 'strategy-team':
      return {
        canEdit: true,
        canApprove: false,
        canExport: true,
        canViewAll: true,
        canManageKPIs: true,
        canManagePillars: true
      };
    default:
      return {
        canEdit: false,
        canApprove: false,
        canExport: false,
        canViewAll: false,
        canManageKPIs: false,
        canManagePillars: false
      };
  }
};

/** Role-based route mapping for post-login redirects */
export const getRoleDashboardPath = (role: string): string => {
  switch (role) {
    case 'dg':
      return '/director-general/dashboard';
    case 'director':
      return '/director/dashboard';
    case 'desk-officer':
      return '/desk-officer/dashboard';
    case 'cps':
      return '/director-general/dashboard'; // CPS views the DG dashboard read-only
    case 'strategy-team':
      return '/strategic-team/dashboard';
    default:
      return '/director-general/dashboard';
  }
};

/** Navigation items filtered by role */
export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  description: string;
  roles: string[];
  badge?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    description: 'Overview & metrics',
    roles: ['dg', 'director', 'desk-officer', 'cps', 'strategy-team']
  },
  {
    id: 'kpi-tracking',
    name: 'KPI Tracking',
    href: '/kpi-tracking',
    description: 'Monitor indicators',
    roles: ['director', 'strategy-team'],
    badge: '28/40'
  },
  {
    id: 'ai-analytics',
    name: 'AI Analytics',
    href: '/ai-analytics',
    description: 'Insights & predictions',
    roles: ['dg', 'director', 'strategy-team'],
    badge: '4 alerts'
  },
  {
    id: 'reports',
    name: 'Reports',
    href: '/reports',
    description: 'Generate reports',
    roles: ['dg', 'director', 'cps', 'strategy-team']
  },
  {
    id: 'alert-management',
    name: 'Alert Management',
    href: '/alert-management',
    description: 'Manage notifications',
    roles: ['dg', 'director', 'strategy-team']
  },
  {
    id: 'settings',
    name: 'Settings',
    href: '/settings',
    description: 'System configuration',
    roles: ['director', 'strategy-team']
  },
  {
    id: 'help',
    name: 'Help & Support',
    href: '/help',
    description: 'Documentation',
    roles: ['dg', 'director', 'desk-officer', 'cps', 'strategy-team']
  }
];

export const getNavigationForRole = (role: string): NavigationItem[] => {
  return navigationItems.filter(item => item.roles.includes(role));
};
