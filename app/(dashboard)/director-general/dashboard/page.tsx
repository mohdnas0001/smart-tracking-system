// components/DGDashboard.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target, Settings, Shield } from 'lucide-react';
import { DashboardData, User } from '@/types/srap';
import KPIManagement from '@/components/kpi-management';
import PillarManagement from '@/components/pillar-management';


interface DGDashboardProps {
  data: DashboardData;
  user?: User;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'bg-green-500';
    case 'good': return 'bg-green-400';
    case 'fair': return 'bg-yellow-500';
    case 'poor': return 'bg-orange-500';
    case 'critical': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'bg-green-100 text-green-800';
    case 'good': return 'bg-green-100 text-green-700';
    case 'fair': return 'bg-yellow-100 text-yellow-800';
    case 'poor': return 'bg-orange-100 text-orange-800';
    case 'critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const COLORS = ['#004225', '#005c35', '#008751', '#4CAF50', '#81C784', '#A5D6A7', '#FFC107', '#FF5722'];

export default function DGDashboard({ data, user }: DGDashboardProps) {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const overallScore = Math.round(data?.pillars.reduce((sum, pillar) => sum + pillar.overallScore, 0) / data?.pillars.length);

  const chartData = data?.pillars.map(pillar => ({
    name: pillar.name.replace(' & ', '\n& '),
    score: pillar.overallScore,
    status: pillar.status
  }));

  const statusDistribution = data?.pillars.reduce((acc, pillar) => {
    acc[pillar.status] = (acc[pillar.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusDistribution).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: getStatusColor(status).replace('bg-', '')
  }));

  const completionRate = Math.round((data.completedKPIs / data.totalKPIs) * 100);

  return (
    <div className="space-y-6 p-6">
      {/* DG Management Banner */}
      {user?.role === 'dg' && (
        <Card className="bg-gradient-to-r from-[var(--nigeria-green)]/10 to-[var(--nigeria-light-green)]/10 border-[var(--nigeria-green)]/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-[var(--nigeria-green)]" />
                <div>
                  <h3 className="text-lg text-[var(--nigeria-green)]">Director General Dashboard</h3>
                  <p className="text-sm text-gray-600">Full system management access including KPI and Pillar creation</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-[var(--nigeria-green)] text-white">
                  <Settings className="mr-1 h-3 w-3" />
                  KPI Management Active
                </Badge>
                <Badge className="bg-[var(--nigeria-light-green)] text-white">
                  <Target className="mr-1 h-3 w-3" />
                  Pillar Management Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className="text-3xl text-[var(--nigeria-green)]">{overallScore}%</p>
              </div>
              <Target className="h-8 w-8 text-[var(--nigeria-green)]" />
            </div>
            <Progress value={overallScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">KPI Completion</p>
                <p className="text-3xl text-[var(--nigeria-green)]">{completionRate}%</p>
                <p className="text-xs text-gray-500">{data.completedKPIs}/{data.totalKPIs} KPIs</p>
              </div>
              <CheckCircle className="h-8 w-8 text-[var(--nigeria-green)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Pillars</p>
                <p className="text-3xl text-[var(--nigeria-green)]">{data.pillars.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[var(--nigeria-green)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Deadline</p>
                <p className="text-lg text-[var(--nigeria-green)]">15 days</p>
                <p className="text-xs text-gray-500">Oct 15, 2025</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-4xl grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pillars">Pillars</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="kpi-management" className="bg-[var(--nigeria-green)]/10 border border-[var(--nigeria-green)]/20">
              <Settings className="mr-2 h-4 w-4" />
              Manage KPIs
            </TabsTrigger>
            <TabsTrigger value="pillar-management" className="bg-[var(--nigeria-green)]/10 border border-[var(--nigeria-green)]/20">
              <Target className="mr-2 h-4 w-4" />
              Manage Pillars
            </TabsTrigger>
          </TabsList>

          <Button className="bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)]">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pillar Scores Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Pillar Performance Overview</CardTitle>
              <CardDescription>Current scores across all 8 SRAP 2.0 pillars</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="var(--nigeria-green)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Breakdown of pillar performance levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`#${entry.color.replace(/^(bg|text)-/, '')}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pillars" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.pillars.map((pillar) => (
              <Card key={pillar.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{pillar.name}</CardTitle>
                    <Badge className={getStatusBadgeColor(pillar.status)}>
                      {pillar.status.charAt(0).toUpperCase() + pillar.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{pillar.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl text-[var(--nigeria-green)]">{pillar.overallScore}%</span>
                      {pillar?.overallScore >= 70 ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : pillar?.overallScore >= 50 ? (
                        <TrendingUp className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <Progress value={pillar?.overallScore} className="h-2" />
                    <div className="text-xs text-gray-500">
                      {pillar?.kpis?.length} KPIs • {pillar?.objectives?.length} Objectives
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>Performance trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Trend data will be available after 3 months of data collection</p>
                  <p className="text-sm">Historical comparison and predictive analytics coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KPI Management Tab */}
        {user?.permissions.canManageKPIs && (
          <TabsContent value="kpi-management">
            <KPIManagement
              kpis={data?.pillars.flatMap(pillar => pillar.kpis)}
              pillars={data?.pillars}
              user={user}
              onCreateKPI={(kpiData) => {
                console.log('Creating KPI:', kpiData);
              }}
              onUpdateKPI={(id, updates) => {
                console.log('Updating KPI:', id, updates);
              }}
              onDeleteKPI={(id) => {
                console.log('Deleting KPI:', id);
              }}
            />
          </TabsContent>
        )}

        {/* Pillar Management Tab */}
        {user?.permissions.canManagePillars && (
          <TabsContent value="pillar-management">
            <PillarManagement
              pillars={data.pillars}
              kpis={data.pillars.flatMap(pillar => pillar.kpis)}
              user={user}
              onCreatePillar={(pillarData) => {
                console.log('Creating pillar:', pillarData);
              }}
              onUpdatePillar={(id, updates) => {
                console.log('Updating pillar:', id, updates);
              }}
              onDeletePillar={(id) => {
                console.log('Deleting pillar:', id);
              }}
              onReorderPillars={(pillars) => {
                console.log('Reordering pillars:', pillars);
              }}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Key Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Key Alerts & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-400 rounded">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm">3MTT Program at 53% enrollment - Risk of missing 2025 target</p>
                <p className="text-xs text-gray-600">Recommend accelerated recruitment in northern states</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm">Digital literacy progress slower than target trajectory</p>
                <p className="text-xs text-gray-600">Focus needed on rural areas and female participation</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm">Digital Government services on track to meet targets</p>
                <p className="text-xs text-gray-600">156 of 200 services now available online</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}