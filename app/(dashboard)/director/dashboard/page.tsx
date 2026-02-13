'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Target, TrendingUp, Users, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import { mockDashboardData } from '@/data/mockData';
import { useAuth } from '@/lib/auth-context';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'bg-green-100 text-green-800';
    case 'good': return 'bg-green-100 text-green-700';
    case 'fair': return 'bg-yellow-100 text-yellow-800';
    case 'poor': return 'bg-orange-100 text-orange-800';
    case 'critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const COLORS = ['#004225', '#005c35', '#008751', '#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9', '#FFC107'];

export default function DirectorDashboard() {
  const { user } = useAuth();
  const data = mockDashboardData;

  // Director sees pillars relevant to their department
  const pillarData = data.pillars.map(p => ({
    name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
    score: p.overallScore,
    kpis: p.kpis.length
  }));

  const statusDistribution = [
    { name: 'Excellent', value: data.pillars.filter(p => p.status === 'excellent').length, color: '#4CAF50' },
    { name: 'Good', value: data.pillars.filter(p => p.status === 'good').length, color: '#81C784' },
    { name: 'Fair', value: data.pillars.filter(p => p.status === 'fair').length, color: '#FFC107' },
    { name: 'Poor', value: data.pillars.filter(p => p.status === 'poor').length, color: '#FF9800' },
    { name: 'Critical', value: data.pillars.filter(p => p.status === 'critical').length, color: '#F44336' },
  ].filter(s => s.value > 0);

  const pendingApprovals = data.pillars
    .flatMap(p => p.kpis)
    .filter(kpi => kpi.monthlyData?.some(md => !md.isApproved));

  const totalKPIs = data.pillars.reduce((sum, p) => sum + p.kpis.length, 0);
  const avgScore = Math.round(data.pillars.reduce((sum, p) => sum + p.overallScore, 0) / data.pillars.length);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[var(--nigeria-green)]">Director Dashboard</h1>
          <p className="text-gray-600">Pillar oversight and KPI approval management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[var(--nigeria-green)]">
            Welcome, {user?.fullName || 'Director'}
          </Badge>
          <Badge className="bg-orange-100 text-orange-800">
            {pendingApprovals.length} Pending Approvals
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pillars</p>
                <p className="text-3xl text-[var(--nigeria-green)]">{data.pillars.length}</p>
              </div>
              <Target className="h-8 w-8 text-[var(--nigeria-green)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total KPIs</p>
                <p className="text-3xl text-[var(--nigeria-green)]">{totalKPIs}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[var(--nigeria-green)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-3xl text-[var(--nigeria-green)]">{avgScore}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-[var(--nigeria-green)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-3xl text-orange-600">{pendingApprovals.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="pillars">Pillar Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pillar Performance</CardTitle>
                <CardDescription>Overall score across all SRAP 2.0 pillars</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pillarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={11} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="var(--nigeria-green)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Distribution of pillar statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value})`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Pending KPI Approvals
              </CardTitle>
              <CardDescription>Review and approve submitted KPI data from desk officers</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-300" />
                  <p>All submissions have been reviewed</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>KPI Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovals.slice(0, 10).map((kpi) => (
                      <TableRow key={kpi.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{kpi.name}</p>
                            <p className="text-xs text-gray-500">{kpi.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{kpi.department}</TableCell>
                        <TableCell>
                          <span className="text-[var(--nigeria-green)]">{kpi.current} {kpi.unit}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" className="bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)]">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">Reject</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pillars" className="space-y-4">
          {data.pillars.map((pillar) => (
            <Card key={pillar.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{pillar.name}</CardTitle>
                    <CardDescription>{pillar.description}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(pillar.status)}>
                    {pillar.status.charAt(0).toUpperCase() + pillar.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  <span className="text-lg text-[var(--nigeria-green)]">{pillar.overallScore}%</span>
                </div>
                <Progress value={pillar.overallScore} className="h-2 mb-4" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {pillar.kpis.slice(0, 4).map((kpi) => (
                    <div key={kpi.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">{kpi.name}</p>
                      <p className="text-sm text-[var(--nigeria-green)]">
                        {Math.round((kpi.current / kpi.target) * 100)}%
                      </p>
                      <Progress value={Math.round((kpi.current / kpi.target) * 100)} className="h-1 mt-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
