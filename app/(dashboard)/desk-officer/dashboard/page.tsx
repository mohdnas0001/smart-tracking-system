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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  Save,
  Lock,
  Unlock,
  FileText,
  Calendar as CalendarIcon,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Calculator
} from 'lucide-react';
import { KPI, MonthlyData } from '@/types/srap';
import { mockDashboardData } from '@/data/mockData';
import { useAuth } from '@/lib/auth-context';
import { format } from 'date-fns';

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

const calculateQuarterlyTotal = (monthlyData: MonthlyData[], quarter: number, year: number = 2024): number => {
  const quarterMonths: Record<number, string[]> = {
    1: ['01', '02', '03'],
    2: ['04', '05', '06'],
    3: ['07', '08', '09'],
    4: ['10', '11', '12']
  };

  const relevantMonths = quarterMonths[quarter];
  return monthlyData
    .filter(d => {
      const [dataYear, dataMonth] = d.month.split('-');
      return parseInt(dataYear) === year && relevantMonths.includes(dataMonth) && d.isApproved;
    })
    .reduce((sum, d) => sum + d.value, 0);
};

const calculateAnnualTotal = (monthlyData: MonthlyData[], year: number = 2024): number => {
  return monthlyData
    .filter(d => {
      const [dataYear] = d.month.split('-');
      return parseInt(dataYear) === year && d.isApproved;
    })
    .reduce((sum, d) => sum + d.value, 0);
};

const getCurrentMonth = () => {
  return format(new Date(), 'yyyy-MM');
};

export default function DeskOfficerDashboard() {
  const { user } = useAuth();
  const data = mockDashboardData;
  const [monthlyInputs, setMonthlyInputs] = useState<Record<string, Record<string, string | number>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departmentKPIs = data.pillars
    .flatMap(pillar => pillar.kpis)
    .filter(kpi => kpi.department === user?.department);

  const currentMonthStr = getCurrentMonth();

  const handleMonthlyInput = (kpiId: string, field: string, value: string | number) => {
    setMonthlyInputs(prev => ({
      ...prev,
      [kpiId]: {
        ...prev[kpiId],
        [field]: value
      }
    }));
  };

  const handleSubmitMonthlyData = async (kpiId: string) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const inputData = monthlyInputs[kpiId];
    console.log('Submitting monthly data:', {
      kpiId,
      month: currentMonthStr,
      data: inputData,
      submittedBy: user?.username
    });
    setMonthlyInputs(prev => ({ ...prev, [kpiId]: {} }));
    setIsSubmitting(false);
  };

  const getCurrentMonthData = (kpi: KPI): MonthlyData | undefined => {
    return kpi.monthlyData?.find(d => d.month === currentMonthStr);
  };

  const isPendingApproval = (kpi: KPI): boolean => {
    const currentData = getCurrentMonthData(kpi);
    return currentData ? !currentData.isApproved : false;
  };

  const getQuarterlyProgress = (kpi: KPI, quarter: number): { actual: number; target: number; percentage: number } => {
    const actual = calculateQuarterlyTotal(kpi.monthlyData || [], quarter);
    const target = kpi.quarterlyTargets?.[`Q${quarter}` as keyof typeof kpi.quarterlyTargets] || 0;
    const percentage = target > 0 ? Math.round((actual / target) * 100) : 0;
    return { actual, target, percentage };
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[var(--nigeria-green)]">
            {user?.department} Department Dashboard
          </h1>
          <p className="text-gray-600">Monthly data input and KPI tracking for your department</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-[var(--nigeria-green)]">
            {departmentKPIs.length} KPIs Assigned
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            Current Period: {format(new Date(), 'MMMM yyyy')}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned KPIs</p>
                <p className="text-3xl text-[var(--nigeria-green)]">{departmentKPIs.length}</p>
              </div>
              <Target className="h-8 w-8 text-[var(--nigeria-green)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-3xl text-orange-600">
                  {departmentKPIs.filter(kpi => isPendingApproval(kpi)).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month&apos;s Inputs</p>
                <p className="text-3xl text-[var(--nigeria-green)]">
                  {departmentKPIs.filter(kpi => getCurrentMonthData(kpi)).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-[var(--nigeria-green)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Deadline</p>
                <p className="text-lg text-orange-600">5 days</p>
                <p className="text-xs text-gray-500">Oct 5, 2024</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly-input" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="monthly-input">Monthly Input</TabsTrigger>
          <TabsTrigger value="progress-tracking">Progress</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly-input" className="space-y-4">
          {departmentKPIs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg text-gray-600 mb-2">No KPIs Assigned</h3>
                <p className="text-gray-500">No KPIs are currently assigned to the {user?.department} department.</p>
              </CardContent>
            </Card>
          ) : (
            departmentKPIs.map((kpi) => {
              const currentMonthData = getCurrentMonthData(kpi);
              const isLocked = currentMonthData?.isApproved || kpi.isLocked;
              const isPending = isPendingApproval(kpi);

              return (
                <Card key={kpi.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{kpi.name}</CardTitle>
                        <CardDescription>{kpi.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {isPending && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending Approval
                          </Badge>
                        )}
                        {currentMonthData?.isApproved && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Approved
                          </Badge>
                        )}
                        {isLocked ? (
                          <Lock className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Unlock className="h-4 w-4 text-[var(--nigeria-green)]" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-[var(--nigeria-green)] mb-3 flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        {format(new Date(), 'MMMM yyyy')} Achievement Input
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`monthly-${kpi.id}`}>Monthly Achievement</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id={`monthly-${kpi.id}`}
                              type="number"
                              placeholder={`Enter ${kpi.unit} achieved this month`}
                              value={
                                currentMonthData?.value ||
                                monthlyInputs[kpi.id]?.value ||
                                ''
                              }
                              onChange={(e) => handleMonthlyInput(kpi.id, 'value', parseInt(e.target.value) || 0)}
                              disabled={isLocked}
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-500">{kpi.unit}</span>
                          </div>
                        </div>

                        <div>
                          <Label>Auto-Calculated Impact</Label>
                          <div className="p-2 bg-white border rounded">
                            <div className="text-sm text-gray-600">
                              <div>New Total: <span className="text-[var(--nigeria-green)]">
                                {(kpi.current + (Number(monthlyInputs[kpi.id]?.value) || 0)).toLocaleString()} {kpi.unit}
                              </span></div>
                              <div>Progress: <span className="text-[var(--nigeria-green)]">
                                {Math.round(((kpi.current + (Number(monthlyInputs[kpi.id]?.value) || 0)) / kpi.target) * 100)}%
                              </span></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`comments-${kpi.id}`}>Comments & Context</Label>
                        <Textarea
                          id={`comments-${kpi.id}`}
                          placeholder="Provide context about this month's achievement..."
                          value={
                            currentMonthData?.comments ||
                            String(monthlyInputs[kpi.id]?.comments || '')
                          }
                          onChange={(e) => handleMonthlyInput(kpi.id, 'comments', e.target.value)}
                          disabled={isLocked}
                          rows={3}
                        />
                      </div>

                      <div className="mt-4 space-y-2">
                        <Label>Evidence Upload</Label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" disabled={isLocked}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Evidence
                          </Button>
                          {currentMonthData?.evidence && currentMonthData.evidence.length > 0 && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-[var(--nigeria-green)]" />
                              <span className="text-sm text-gray-600">
                                {currentMonthData.evidence.length} files attached
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {!isLocked && (
                        <div className="flex items-center justify-between pt-4 border-t mt-4">
                          <p className="text-xs text-gray-500">
                            Submit by: {format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5), 'MMM dd, yyyy')}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">Save Draft</Button>
                            <Button
                              size="sm"
                              onClick={() => handleSubmitMonthlyData(kpi.id)}
                              disabled={!monthlyInputs[kpi.id]?.value || isSubmitting}
                              className="bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)]"
                            >
                              {isSubmitting ? (
                                <>
                                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Save className="mr-2 h-4 w-4" />
                                  Submit for Approval
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {currentMonthData?.isApproved && (
                        <Alert className="mt-4">
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            This month&apos;s data has been approved by {currentMonthData.approvedBy} on{' '}
                            {currentMonthData.approvedAt && format(new Date(currentMonthData.approvedAt), 'MMM dd, yyyy')}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {kpi.quarterlyTargets && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(quarter => {
                          const progress = getQuarterlyProgress(kpi, quarter);
                          return (
                            <div key={quarter} className="p-3 bg-gray-50 border rounded-lg">
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Q{quarter} 2024</p>
                                <p className="text-lg text-[var(--nigeria-green)]">
                                  {progress.actual.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Target: {progress.target.toLocaleString()}
                                </p>
                                <Progress value={progress.percentage} className="mt-1 h-1" />
                                <p className="text-xs text-gray-600 mt-1">
                                  {progress.percentage}%
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="progress-tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department KPI Progress Overview</CardTitle>
              <CardDescription>Track your department&apos;s performance across all assigned KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departmentKPIs.map((kpi) => {
                  const annualProgress = calculateAnnualTotal(kpi.monthlyData || [], 2024);
                  const annualPercentage = kpi.annualTarget ? Math.round((annualProgress / kpi.annualTarget) * 100) : 0;

                  return (
                    <div key={kpi.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[var(--nigeria-green)]">{kpi.name}</h4>
                        <Badge className={getStatusColor(kpi.status)}>
                          {kpi.status.charAt(0).toUpperCase() + kpi.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Annual Progress</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl text-[var(--nigeria-green)]">
                              {annualProgress.toLocaleString()} {kpi.unit}
                            </span>
                            <span className="text-sm text-gray-500">{annualPercentage}%</span>
                          </div>
                          <Progress value={annualPercentage} className="mt-1" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Current Month</p>
                          <div className="text-lg text-[var(--nigeria-green)]">
                            {getCurrentMonthData(kpi)?.value?.toLocaleString() || '0'} {kpi.unit}
                          </div>
                          <p className="text-xs text-gray-500">
                            {getCurrentMonthData(kpi)?.isApproved ? 'Approved' : 'Pending/Not Submitted'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Annual Target</p>
                          <div className="text-lg text-[var(--nigeria-green)]">
                            {(kpi.annualTarget || kpi.target).toLocaleString()} {kpi.unit}
                          </div>
                          <p className="text-xs text-gray-500">
                            Remaining: {((kpi.annualTarget || kpi.target) - annualProgress).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Submission History</CardTitle>
              <CardDescription>View all your monthly submissions and their approval status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>KPI</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Achievement</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Approved By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentKPIs.flatMap(kpi =>
                    (kpi.monthlyData || []).map(monthData => (
                      <TableRow key={`${kpi.id}-${monthData.month}`}>
                        <TableCell>
                          <div className="text-sm">
                            <div>{kpi.name}</div>
                            <div className="text-gray-500 text-xs">{kpi.unit}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(monthData.month + '-01'), 'MMM yyyy')}
                        </TableCell>
                        <TableCell>
                          <span className="text-[var(--nigeria-green)]">
                            {monthData.value.toLocaleString()} {kpi.unit}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={monthData.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {monthData.isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{format(new Date(monthData.submittedAt), 'MMM dd, yyyy')}</div>
                            <div className="text-gray-500 text-xs">by {monthData.submittedBy}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {monthData.approvedBy ? (
                            <div className="text-sm">
                              <div>{monthData.approvedBy}</div>
                              <div className="text-gray-500 text-xs">
                                {monthData.approvedAt && format(new Date(monthData.approvedAt), 'MMM dd, yyyy')}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
