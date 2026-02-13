'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Save, Lock, Unlock, FileText, Calendar, Target, TrendingUp, AlertCircle } from 'lucide-react';
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

const calculatePercentage = (current: number, target: number) => {
  return Math.round((current / target) * 100);
};

const getThresholdLabel = (score: number) => {
  if (score >= 90) return 'Excellent (5)';
  if (score >= 70) return 'Good (4)';
  if (score >= 50) return 'Fair (3)';
  if (score >= 30) return 'Poor (2)';
  return 'Critical (1)';
};

export default function KPITrackingPage() {
  const { user } = useAuth();
  const data = mockDashboardData;

  const [selectedPillar, setSelectedPillar] = useState(data.pillars[0]?.id || '');
  const [kpiValues, setKpiValues] = useState<Record<string, Record<string, string | number>>>({});

  const currentPillar = data.pillars.find(p => p.id === selectedPillar);
  const allKPIs = data.pillars.flatMap(p => p.kpis);

  const handleKPIEdit = (kpiId: string, field: string, value: string | number) => {
    setKpiValues(prev => ({
      ...prev,
      [kpiId]: {
        ...prev[kpiId],
        [field]: value
      }
    }));
  };

  const handleSaveKPI = (kpiId: string) => {
    console.log('Saving KPI:', kpiId, kpiValues[kpiId]);
  };

  const canEdit = user?.permissions?.canEdit ?? false;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[var(--nigeria-green)]">KPI Tracking & Management</h1>
          <p className="text-gray-600">Monitor and update Key Performance Indicators across all pillars</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-[var(--nigeria-green)]">
            Q4 2024 Reporting Period
          </Badge>
          <Button className="bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)]">
            <Calendar className="mr-2 h-4 w-4" />
            Deadline: Oct 15
          </Button>
        </div>
      </div>

      <Tabs defaultValue="by-pillar" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="by-pillar">By Pillar</TabsTrigger>
          <TabsTrigger value="all-kpis">All KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="by-pillar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Pillar</CardTitle>
              <CardDescription>Choose a pillar to view and manage its KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedPillar} onValueChange={setSelectedPillar}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a pillar..." />
                </SelectTrigger>
                <SelectContent>
                  {data.pillars.map((pillar) => (
                    <SelectItem key={pillar.id} value={pillar.id}>
                      <div className="flex items-center gap-3">
                        <div>
                          <div>{pillar.name}</div>
                          <div className="text-xs text-gray-500">{pillar.kpis.length} KPIs • {pillar.overallScore}% completion</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {currentPillar && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{currentPillar.name}</CardTitle>
                    <CardDescription>{currentPillar.description}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(currentPillar.status)}>
                    {currentPillar.status.charAt(0).toUpperCase() + currentPillar.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Overall Progress</span>
                  <span className="text-2xl text-[var(--nigeria-green)]">{currentPillar.overallScore}%</span>
                </div>
                <Progress value={currentPillar.overallScore} className="h-3" />

                <div className="mt-4">
                  <h4 className="mb-2">Objectives:</h4>
                  <ul className="space-y-1">
                    {currentPillar.objectives.map((objective, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <Target className="h-4 w-4 text-[var(--nigeria-green)] mt-0.5 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {currentPillar && (
            <div className="space-y-4">
              {currentPillar.kpis.map((kpi) => (
                <Card key={kpi.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{kpi.name}</CardTitle>
                        <CardDescription>{kpi.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(kpi.status)}>
                          {getThresholdLabel(calculatePercentage(kpi.current, kpi.target))}
                        </Badge>
                        {kpi.isLocked ? (
                          <Lock className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Unlock className="h-4 w-4 text-[var(--nigeria-green)]" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`current-${kpi.id}`}>Current Value</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`current-${kpi.id}`}
                            type="number"
                            value={kpiValues[kpi.id]?.current ?? kpi.current}
                            onChange={(e) => handleKPIEdit(kpi.id, 'current', parseInt(e.target.value))}
                            disabled={kpi.isLocked || !canEdit}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500">{kpi.unit}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Target Value</Label>
                        <div className="flex items-center gap-2">
                          <Input value={kpi.target} disabled className="flex-1" />
                          <span className="text-sm text-gray-500">{kpi.unit}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Progress</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl text-[var(--nigeria-green)]">
                              {calculatePercentage(Number(kpiValues[kpi.id]?.current ?? kpi.current), kpi.target)}%
                            </span>
                            <TrendingUp className="h-5 w-5 text-[var(--nigeria-green)]" />
                          </div>
                          <Progress value={calculatePercentage(Number(kpiValues[kpi.id]?.current ?? kpi.current), kpi.target)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Evidence & Documentation</Label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled={kpi.isLocked || !canEdit}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Evidence
                        </Button>
                        {kpi.evidence && kpi.evidence.length > 0 && (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[var(--nigeria-green)]" />
                            <span className="text-sm text-gray-600">{kpi.evidence.length} files attached</span>
                          </div>
                        )}
                      </div>
                      {kpi.evidence && kpi.evidence.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {kpi.evidence.map((evidence, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <FileText className="h-3 w-3" />
                              {evidence}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`comments-${kpi.id}`}>Comments & Justification</Label>
                      <Textarea
                        id={`comments-${kpi.id}`}
                        placeholder="Provide context, justification, or notes about this KPI..."
                        value={String(kpiValues[kpi.id]?.comments ?? kpi.comments)}
                        onChange={(e) => handleKPIEdit(kpi.id, 'comments', e.target.value)}
                        disabled={kpi.isLocked || !canEdit}
                        rows={3}
                      />
                    </div>

                    {canEdit && !kpi.isLocked && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-xs text-gray-500">
                          Last updated: {new Date(kpi.lastUpdated).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">Reset</Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveKPI(kpi.id)}
                            className="bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)]"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    )}

                    {kpi.isLocked && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
                        <Lock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">This KPI is locked and cannot be edited until next reporting period.</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all-kpis">
          <Card>
            <CardHeader>
              <CardTitle>All KPIs Overview</CardTitle>
              <CardDescription>Complete list of KPIs across all pillars</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>KPI Name</TableHead>
                    <TableHead>Pillar</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allKPIs.map((kpi) => {
                    const pillar = data.pillars.find(p => p.kpis.includes(kpi));
                    const progress = calculatePercentage(kpi.current, kpi.target);

                    return (
                      <TableRow key={kpi.id}>
                        <TableCell>
                          <div>
                            <div className="text-sm">{kpi.name}</div>
                            <div className="text-xs text-gray-500">{kpi.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{pillar?.name}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{kpi.current} {kpi.unit}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{kpi.target} {kpi.unit}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="w-16 h-2" />
                            <span className="text-sm">{progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(kpi.status)}>
                            {kpi.status.charAt(0).toUpperCase() + kpi.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {kpi.isLocked ? (
                              <Lock className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Button variant="ghost" size="sm">Edit</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
