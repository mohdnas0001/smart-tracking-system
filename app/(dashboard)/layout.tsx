"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Navigation } from '@/components/layout/navigation';
import { Header } from '@/components/layout/header';
import { AlertBanner, useSystemAlerts } from '@/components/alert-banner';
import { NotificationServiceProvider } from '@/components/notification-service';
import { AuthProvider, useAuth } from '@/lib/auth-context';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { alerts, dismissAlert } = useSystemAlerts();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    router.push('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Derive current page from pathname for nav highlighting
  const lastSegment = pathname.split('/').pop() || 'dashboard';
  // Map URL segments back to nav item IDs
  const segmentToNavMap: Record<string, string> = {
    'alerts': 'alert-management',
    'ai-analytics': 'ai-analytics',
    'kpi-tracking': 'kpi-tracking',
    'reports': 'reports',
    'dashboard': 'dashboard',
    'settings': 'settings',
    'help': 'help',
  };
  const currentPage = segmentToNavMap[lastSegment] || lastSegment;

  const handleNavigate = (page: string) => {
    // Map page IDs to actual routes based on user role
    const rolePrefix = getRolePrefix(user.role);
    const routeMap: Record<string, string> = {
      'dashboard': `/${rolePrefix}/dashboard`,
      'kpi-tracking': `/${rolePrefix}/kpi-tracking`,
      'ai-analytics': `/${rolePrefix}/ai-analytics`,
      'reports': `/${rolePrefix}/reports`,
      'alert-management': `/${rolePrefix}/alerts`,
      'kpi-management': `/${rolePrefix}/dashboard`,
      'pillar-management': `/${rolePrefix}/dashboard`,
      'settings': `/settings`,
      'help': `/help`,
    };
    
    const route = routeMap[page] || `/${rolePrefix}/dashboard`;
    router.push(route);
  };

  return (
    <NotificationServiceProvider userRole={user.role} department={user.department}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          userRole={user.role}
          username={user.username}
          department={user.department}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-row">
          <div className="w-64 flex-shrink-0">
            <Navigation
              currentPage={currentPage}
              onNavigate={handleNavigate}
              userRole={user.role}
              onLogout={handleLogout}
            />
          </div>

          <main className="flex-1 overflow-auto">
            <div className="p-4">
              <AlertBanner alerts={alerts} onDismiss={dismissAlert} />
            </div>
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </NotificationServiceProvider>
  );
}

function getRolePrefix(role: string): string {
  switch (role) {
    case 'dg': return 'director-general';
    case 'director': return 'director';
    case 'desk-officer': return 'desk-officer';
    case 'cps': return 'director-general';
    case 'strategy-team': return 'strategic-team';
    default: return 'director-general';
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}