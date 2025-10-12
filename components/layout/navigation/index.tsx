/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Target, 
  Brain, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle,
  ChevronRight,
  Bell,
  LogOut
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: string;
  onLogout: () => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview & metrics',
    roles: ['dg', 'director', 'desk-officer', 'cps', 'strategy-team']
  },
  {
    id: 'kpi-tracking',
    name: 'KPI Tracking',
    icon: Target,
    description: 'Monitor indicators',
    roles: ['director', 'strategy-team'],
    badge: '28/40'
  },
  {
    id: 'ai-analytics',
    name: 'AI Analytics',
    icon: Brain,
    description: 'Insights & predictions',
    roles: ['dg', 'director', 'strategy-team'],
    badge: '4 alerts'
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: FileText,
    description: 'Generate reports',
    roles: ['dg', 'director', 'cps', 'strategy-team']
  },
  {
    id: 'alert-management',
    name: 'Alert Management',
    icon: Bell,
    description: 'Manage notifications',
    roles: ['dg', 'director', 'strategy-team']
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    description: 'System configuration',
    roles: ['director', 'strategy-team']
  },
  {
    id: 'help',
    name: 'Help & Support',
    icon: HelpCircle,
    description: 'Documentation',
    roles: ['dg', 'director', 'desk-officer', 'cps', 'strategy-team']
  }
];

export function Navigation({ currentPage, onNavigate, userRole, onLogout }: NavigationProps) {
  const availableItems = navigationItems.filter(item => 
    item.roles.includes(userRole as any)
  );

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-[var(--nigeria-green)]/20 h-full">
      <div className="p-4">
        <div className="space-y-2">
          {availableItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3 text-left",
                  isActive 
                    ? "bg-[var(--nigeria-green)] text-white hover:bg-[var(--nigeria-light-green)]" 
                    : "hover:bg-[var(--nigeria-green)]/10"
                )}
                onClick={() => onNavigate(item.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5" />
                    <div>
                      <div className="text-sm">{item.name}</div>
                      <div className={cn(
                        "text-xs",
                        isActive ? "text-white/80" : "text-gray-500"
                      )}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <Badge 
                        variant={isActive ? "secondary" : "outline"}
                        className={cn(
                          "text-xs",
                          isActive 
                            ? "bg-white/20 text-white border-white/30" 
                            : "border-[var(--nigeria-green)]/30 text-[var(--nigeria-green)]"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-white/80" />
                    )}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gradient-to-r from-[var(--nigeria-green)]/10 to-[var(--nigeria-light-green)]/10 rounded-lg border border-[var(--nigeria-green)]/20">
          <h4 className="text-sm text-[var(--nigeria-green)] mb-3">Quick Stats</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Overall Score</span>
              <span className="text-[var(--nigeria-green)]">67%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">KPIs on Track</span>
              <span className="text-[var(--nigeria-green)]">28/40</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Next Deadline</span>
              <span className="text-orange-600">15 days</span>
            </div>
          </div>
        </div>

        {/* DG Management Tip */}
        {userRole === 'dg' && (
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
            <div className="flex items-start gap-2">
              <Settings className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs text-blue-800 font-medium">KPI Management</p>
                <p className="text-xs text-blue-600">
                  Access KPI & Pillar management in your Dashboard tabs
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Role Badge */}
        <div className="mt-4 p-3 bg-white border border-[var(--nigeria-green)]/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[var(--nigeria-green)]" />
            <div>
              <p className="text-xs text-gray-600">Current Role</p>
              <p className="text-sm text-[var(--nigeria-green)] capitalize">
                {userRole?.replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-3 text-left border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            onClick={onLogout}
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5" />
              <div>
                <div className="text-sm">Logout</div>
                <div className="text-xs text-red-500">
                  Sign out of system
                </div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </nav>
  );
}