'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types/srap';
import { getRolePermissions, getRoleDashboardPath } from '@/lib/permissions';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: string, username: string, department?: string) => void;
  logout: () => void;
  getDashboardPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'smart-tracking-user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      // Ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  const login = useCallback((role: string, username: string, department?: string) => {
    const roleNameMap: Record<string, string> = {
      'dg': 'Director General',
      'director': 'Director',
      'desk-officer': 'Desk Officer',
      'cps': 'CPS',
      'strategy-team': 'Strategy Team Member'
    };
    const newUser: User = {
      username,
      fullName: roleNameMap[role] || username,
      email: `${username}@nitda.gov.ng`,
      role: role as User['role'],
      department,
      permissions: getRolePermissions(role)
    };
    setUser(newUser);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const getDashboardPath = useCallback(() => {
    if (!user) return '/login';
    return getRoleDashboardPath(user.role);
  }, [user]);

  // Prevent flash of wrong content during hydration
  if (!isHydrated) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
