'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Target, TrendingUp, Brain, Lightbulb, BarChart3, Activity } from 'lucide-react';
import { mockDashboardData, aiInsights } from '@/data/mockData';
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

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function StrategicTeamDashboard() {
  const { user } = useAuth();
  const data = mockDashboardData;
  const insights = aiInsights;

  const radarData = data.pillars.map(p => ({
    pillar: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    score: p.overallScore,
    target: 100
  }));

  const pillarComparison = data.pillars.map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
    current: p.overallScore,
    target: 100,
    gap: 100 - p.overallScore
  }));

  const totalKPIs = data.pillars.reduce((sum, p) => sum + p.kpis.length, 0);
  const avgScore = Math.round(data.pillars.reduce((sum, p) => sum + p.overallScore, 0) / data.pillars.length);
  const atRiskPillars = data.pillars.filter(p => ['poor', 'critical'].includes(p.status)).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[var(--nigeria-green)]">Strategic Team Dashboard</h1>
          <p className="text-gray-600">Strategic analysis and cross-pillar performance monitoring</p>
        </div>
        <Badge variant="outline" className="text-[var(--nigeria-green)]">
          Welcome, {user?.fullName || 'Strategy Team Member'}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pillars</p>
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
              <BarChart3 className="h-8 w-8 text-[var(--nigeria-green)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-3xl text-[var(--nigeria-green)]">{avgScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[var(--nigeria-green)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">At Risk</p>
                <p className="text-3xl text-red-600">{atRiskPillars}</p>
              </div>
              <Activity className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Insights</p>
                <p className="text-3xl text-[var(--nigeria-green)]">{insights.length}</p>
              </div>
              <Brain className="h-8 w-8 text-[var(--nigeria-green)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="analysis">Strategic Analysis</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pillar Performance Radar</CardTitle>
                <CardDescription>Multi-dimensional view of all pillar scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="pillar" fontSize={10} />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="#004225" fill="#004225" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gap Analysis</CardTitle>
                <CardDescription>Current performance vs target across pillars</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={pillarComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="current" stackId="a" fill="#004225" name="Current Score" />
                    <Bar dataKey="gap" stackId="a" fill="#E8F5E9" name="Gap to Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-[var(--nigeria-green)]" />
                AI-Generated Strategic Insights
              </CardTitle>
              <CardDescription>Machine learning analysis for strategic decision-making</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 border-l-4 rounded ${
                    insight.type === 'risk'
                      ? 'bg-red-50 border-red-400'
                      : insight.type === 'recommendation'
                      ? 'bg-blue-50 border-blue-400'
                      : 'bg-green-50 border-green-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[var(--nigeria-green)] flex items-center gap-2">
                      {insight.type === 'risk' ? (
                        <Activity className="h-4 w-4 text-red-500" />
                      ) : (
                        <Lightbulb className="h-4 w-4 text-blue-500" />
                      )}
                      {insight.title}
                    </h4>
                    <Badge className={getSeverityColor(insight.severity)}>
                      {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{insight.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button size="sm" variant="outline">View Analysis</Button>
                    <Button size="sm" variant="ghost">Dismiss</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pillar Performance Summary</CardTitle>
              <CardDescription>Detailed breakdown of all pillars and their KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pillar</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>KPIs</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pillars.map((pillar) => (
                    <TableRow key={pillar.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{pillar.name}</p>
                          <p className="text-xs text-gray-500">{pillar.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-lg text-[var(--nigeria-green)]">{pillar.overallScore}%</span>
                      </TableCell>
                      <TableCell>{pillar.kpis.length}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(pillar.status)}>
                          {pillar.status.charAt(0).toUpperCase() + pillar.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-32">
                        <Progress value={pillar.overallScore} className="h-2" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
