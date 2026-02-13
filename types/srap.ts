export interface MonthlyData {
  month: string; // Format: "2024-10"
  value: number;
  isApproved: boolean;
  submittedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  evidence?: string[];
  comments?: string;
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  threshold: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  lastUpdated: string;
  evidence?: string[];
  comments?: string;
  isLocked?: boolean;
  department?: string;
  monthlyData?: MonthlyData[];
  quarterlyTargets?: {
    Q1: number;
    Q2: number;
    Q3: number;
    Q4: number;
  };
  annualTarget?: number;
  // New fields for dynamic KPI creation
  metricType: '%' | '#' | '$' | 'days' | 'ratio';
  calculationFormula?: string;
  yearlyTargets?: {
    [year: string]: number;
  };
  responsibleDepartment: string;
  dataSource?: string;
  reportingFrequency: 'monthly' | 'quarterly';
  successIndicator?: string;
  createdBy?: string;
  createdAt?: string;
  isCustom?: boolean;
}

export interface Pillar {
  id: string;
  name: string;
  description: string;
  kpis: KPI[];
  overallScore: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  objectives: string[];
  // New fields for dynamic pillar creation
  createdBy?: string;
  createdAt?: string;
  isCustom?: boolean;
  order?: number;
}

export interface DashboardData {
  pillars: Pillar[];
  lastUpdated: string;
  nextDeadline: string;
  totalKPIs: number;
  completedKPIs: number;
}

export interface User {
  username: string;
  fullName?: string;
  email?: string;
  role: 'dg' | 'director' | 'desk-officer' | 'cps' | 'strategy-team';
  department?: string;
  permissions: {
    canEdit: boolean;
    canApprove: boolean;
    canExport: boolean;
    canViewAll: boolean;
    canManageKPIs?: boolean;
    canManagePillars?: boolean;
  };
}

export interface AIInsight {
  id: string;
  type: 'risk' | 'recommendation' | 'trend';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  pillarId?: string;
  kpiId?: string;
}

export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'kpi' | 'pillar';
  entityId: string;
  entityName: string;
  userId: string;
  username: string;
  timestamp: string;
  changes?: any;
}

export interface Department {
  id: string;
  name: string;
  abbreviation: string;
  description?: string;
}

export interface KPIFormData {
  name: string;
  description: string;
  metricType: '%' | '#' | '$' | 'days' | 'ratio';
  calculationFormula?: string;
  yearlyTargets: {
    [year: string]: number;
  };
  responsibleDepartment: string;
  dataSource?: string;
  reportingFrequency: 'monthly' | 'quarterly';
  successIndicator?: string;
  pillarId?: string;
}

export interface PillarFormData {
  name: string;
  description: string;
  objectives: string[];
  kpiIds: string[];
}