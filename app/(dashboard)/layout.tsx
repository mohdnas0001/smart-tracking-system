"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Navigation } from '@/components/layout/navigation';
import { Header } from '@/components/layout/header';

interface DashboardLayoutProps {
  userRole: string;
  username: string;
  department?: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ userRole, username, department, children }: DashboardLayoutProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('User logged out');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
        <Header
          userRole={userRole}
          username={username}
          department={department}
          onLogout={handleLogout}
        />
          
     
      {/* Main Content */}
      <div className="flex-1 flex flex-row">
         {/* Sidebar */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          isSidebarCollapsed ? 'w-16' : 'w-64',
          'flex-shrink-0'
        )}
      >
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          userRole={userRole}
          onLogout={handleLogout}
        />
      </div>


        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}