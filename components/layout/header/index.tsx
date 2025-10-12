"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {  LogOut, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { NotificationSystem } from '@/components/layout/notifications-system';
import Image from 'next/image';

interface HeaderProps {
  userRole: string;
  username: string;
  department?: string;
  onLogout: () => void;
}

const roleLabels: Record<string, string> = {
  'dg': 'Director General',
  'director': 'Director/SA',
  'desk-officer': 'Desk Officer',
  'cps': 'CPS',
  'strategy-team': 'Strategy Team'
};

const roleColors: Record<string, string> = {
  'dg': 'bg-green-900/10 text-green-900',
  'director': 'bg-green-800/10 text-green-800',
  'desk-officer': 'bg-green-700/10 text-green-700',
  'cps': 'bg-green-600/10 text-green-600',
  'strategy-team': 'bg-green-500/10 text-green-500'
};

export function Header({ userRole, username, department, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-[var(--nigeria-green)]/20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* NITDA Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image 
                  src={"/logo/nitda-logo.png"} 
                    alt="NITDA Logo" 
                    width={44}
                    height={44}
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl text-[var(--nigeria-green)]">NITDA Smart Tracking System</h1>
                <p className="text-sm text-gray-500">National Information Technology Development Agency | SRAP 2.0</p>
              </div>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <NotificationSystem userRole={userRole} department={department} />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 h-auto p-2 border-none">
                  <div className="text-right">
                    <p className="text-sm">{username}</p>
                    <Badge className={`text-xs ${roleColors[userRole] || 'bg-gray-100 text-gray-800'}`}>
                      {roleLabels[userRole] || 'Unknown Role'}
                    </Badge>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[var(--nigeria-green)] text-white">
                      {username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}