'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Globe, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getRoleDashboardPath } from '@/lib/permissions';

interface RoleOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface DepartmentOption {
  value: string;
  label: string;
}

const ROLES: RoleOption[] = [
  { value: 'dg', label: 'Director General (DG)', icon: Shield, description: 'High-level overview and strategic decisions' },
  { value: 'director', label: 'Director/SA', icon: Users, description: 'Full access to scorecards with edit/approval' },
  { value: 'desk-officer', label: 'Desk Officer', icon: BarChart3, description: 'KPI input and evidence uploads' },
  { value: 'cps', label: 'CPS', icon: Globe, description: 'Aggregated data for quarterly reports' },
  { value: 'strategy-team', label: 'Strategy Team', icon: Users, description: 'Strategic planning and analysis' }
];

const DEPARTMENTS: DepartmentOption[] = [
  { value: 'DLCB', label: 'Digital Literacy and Capacity Building (DLCB)' },
  { value: 'R&D', label: 'Research and Development (R&D)' },
  { value: 'SGF', label: 'Secretary to the Government of the Federation (SGF)' },
  { value: 'EGDR', label: 'E-Government Development and Regulation (EGDR)' },
  { value: 'DED', label: 'Digital Economy Development (DED)' },
  { value: 'ITIS', label: 'IT Infrastructure and Services (ITIS)' },
  { value: 'CS', label: 'Cyber Security (CS)' },
  { value: 'ONDI', label: 'Office of the National Digital Innovation (ONDI)' },
  { value: 'CPS', label: 'Cabinet Policy Secretariat (CPS)' },
  { value: 'HR', label: 'Human Resources (HR)' },
  { value: 'DGO', label: "Director General's Office (DGO)" },
  { value: 'SERVICOM', label: 'Service Compact (SERVICOM)' }
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const { login } = useAuth();

  const isDeskOfficer = selectedRole === 'desk-officer';
  const isFormValid = selectedRole && username && password && (!isDeskOfficer || selectedDepartment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      login(selectedRole, username, selectedDepartment || undefined);
      const dashboardPath = getRoleDashboardPath(selectedRole);
      router.push(dashboardPath);
    }
  };

  const RoleSelectItem = ({ role }: { role: RoleOption }) => {
    const IconComponent = role.icon;
    return (
      <SelectItem key={role.value} value={role.value}>
        <div className="flex items-center gap-3 py-2">
          <IconComponent className="h-4 w-4 text-[var(--nigeria-green)] flex-shrink-0" aria-hidden="true" />
          <div className="flex flex-col items-start justify-start">
            <div className="font-medium">{role.label}</div>
            <div className="text-xs text-gray-500">{role.description}</div>
          </div>
        </div>
      </SelectItem>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--nigeria-green)] via-[var(--nigeria-light-green)] to-[var(--nigeria-green)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative h-16 w-16">
              <Image
                src="/logo/nitda-logo.png"
                alt="NITDA Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl text-[var(--nigeria-green)]">NITDA Smart Tracking System</CardTitle>
            <CardDescription className="text-gray-600">
              National Information Technology Development <br />Agency | SRAP 2.0
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role">Select Your Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="border-[var(--nigeria-green)]/20 focus:border-[var(--nigeria-green)]" id="role">
                  <SelectValue placeholder="Choose your role..." />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <RoleSelectItem key={role.value} role={role} />
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isDeskOfficer && (
              <div className="space-y-2">
                <Label htmlFor="department">Select Your Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="border-[var(--nigeria-green)]/20 focus:border-[var(--nigeria-green)]" id="department">
                    <SelectValue placeholder="Choose your department..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-[var(--nigeria-green)]/20 focus:border-[var(--nigeria-green)]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[var(--nigeria-green)]/20 focus:border-[var(--nigeria-green)]"
                required
              />
            </div>

            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
              <Shield className="h-4 w-4 inline mr-2" aria-hidden="true" />
              Secured with PKI framework authentication
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)] text-white"
            >
              Access Dashboard
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}