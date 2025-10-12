/* eslint-disable @typescript-eslint/no-explicit-any */
// components/KPIManagement.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Target, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { KPI, KPIFormData, Pillar, User, Department } from '@/types/srap';
import { toast } from 'sonner';

interface KPIManagementProps {
  kpis: KPI[];
  pillars: Pillar[];
  user: User;
  onCreateKPI: (kpi: KPIFormData) => void;
  onUpdateKPI: (id: string, kpi: Partial<KPI>) => void;
  onDeleteKPI: (id: string) => void;
}

const departments: Department[] = [
  { id: 'dlcb', name: 'Digital Literacy and Capacity Building', abbreviation: 'DLCB' },
  { id: 'rnd', name: 'Research & Development', abbreviation: 'R&D' },
  { id: 'sgf', name: 'Strategic Growth & Finance', abbreviation: 'SGF' },
  { id: 'ncc', name: 'Nigerian Communications Commission', abbreviation: 'NCC' },
  { id: 'nitda', name: 'NITDA', abbreviation: 'NITDA' },
  { id: 'hr', name: 'Human Resources', abbreviation: 'HR' },
  { id: 'ops', name: 'Operations', abbreviation: 'OPS' }
];

const metricTypes = [
  { value: '%', label: 'Percentage (%)', description: 'Used for completion rates, adoption rates' },
  { value: '#', label: 'Number (#)', description: 'Used for counts, quantities' },
  { value: '$', label: 'Currency ($)', description: 'Used for financial metrics' },
  { value: 'days', label: 'Days', description: 'Used for time-based metrics' },
  { value: 'ratio', label: 'Ratio', description: 'Used for proportional metrics' }
];

export default function KPIManagement({ kpis, pillars, user, onCreateKPI, onUpdateKPI, onDeleteKPI }: KPIManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [formData, setFormData] = useState<KPIFormData>({
    name: '',
    description: '',
    metricType: '%',
    calculationFormula: '',
    yearlyTargets: {},
    responsibleDepartment: '',
    dataSource: '',
    reportingFrequency: 'monthly',
    successIndicator: '',
    pillarId: ''
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  // Generate years from 2024 to 2030
  const years = Array.from({ length: 7 }, (_, i) => 2024 + i);

  const handleInputChange = (field: keyof KPIFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setValidationErrors([]);
  };

  const handleYearlyTargetChange = (year: string, target: number) => {
    setFormData(prev => ({
      ...prev,
      yearlyTargets: {
        ...prev.yearlyTargets,
        [year]: target
      }
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) errors.push('KPI name is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.responsibleDepartment) errors.push('Responsible department is required');
    if (Object.keys(formData.yearlyTargets).length === 0) errors.push('At least one yearly target is required');
    if (formData.metricType === '%' && Object.values(formData.yearlyTargets).some(target => target > 100)) {
      errors.push('Percentage targets cannot exceed 100%');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onCreateKPI(formData);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('KPI created successfully', {
      description: `${formData.name} has been added to the system`
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      metricType: '%',
      calculationFormula: '',
      yearlyTargets: {},
      responsibleDepartment: '',
      dataSource: '',
      reportingFrequency: 'monthly',
      successIndicator: '',
      pillarId: ''
    });
    setValidationErrors([]);
    setPreviewMode(false);
  };

  const handleDeleteKPI = (kpi: KPI) => {
    if (confirm(`Are you sure you want to delete the KPI "${kpi.name}"? This action cannot be undone.`)) {
      onDeleteKPI(kpi.id);
      toast.success('KPI deleted successfully');
    }
  };

  const getPreviewScore = () => {
    // Mock calculation for preview
    const currentTarget = formData.yearlyTargets['2024'] || 0;
    const mockCurrent = currentTarget * 0.67; // 67% completion for demo
    return {
      current: mockCurrent,
      target: currentTarget,
      percentage: currentTarget > 0 ? (mockCurrent / currentTarget) * 100 : 0
    };
  };

  if (!user.permissions.canManageKPIs) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don&apos;t have permission to manage KPIs. Contact your administrator for access.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl text-[var(--nigeria-green)] mb-2">KPI Management</h2>
          <p className="text-gray-600">Create and manage Key Performance Indicators for SRAP 2.0</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)]">
              <Plus className="h-4 w-4 mr-2" />
              Create New KPI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New KPI</DialogTitle>
              <DialogDescription>
                Define a new Key Performance Indicator for the Smart Tracking System
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="targets">Targets & Calculation</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kpi-name">KPI Name *</Label>
                    <Input
                      id="kpi-name"
                      placeholder="e.g., % AI adoption rate"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metric-type">Metric Type *</Label>
                    <Select value={formData.metricType} onValueChange={(value) => handleInputChange('metricType', value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {metricTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this KPI measures and its importance"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Responsible Department *</Label>
                    <Select value={formData.responsibleDepartment} onValueChange={(value) => handleInputChange('responsibleDepartment', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>
                            <div>
                              <div className="font-medium">{dept.abbreviation}</div>
                              <div className="text-xs text-gray-500">{dept.name}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Reporting Frequency</Label>
                    <Select value={formData.reportingFrequency} onValueChange={(value) => handleInputChange('reportingFrequency', value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pillar">Assign to Pillar (Optional)</Label>
                  <Select value={formData.pillarId} onValueChange={(value) => handleInputChange('pillarId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pillar" />
                    </SelectTrigger>
                    <SelectContent>
                      {pillars.map(pillar => (
                        <SelectItem key={pillar.id} value={pillar.id}>
                          {pillar.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="targets" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="formula">Calculation Formula (Optional)</Label>
                  <Input
                    id="formula"
                    placeholder="e.g., A/B*100 (where A = adopters, B = total organizations)"
                    value={formData.calculationFormula}
                    onChange={(e) => handleInputChange('calculationFormula', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Describe how this KPI is calculated. Use variables like A, B, C for components.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Yearly Targets (2024-2030) *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {years.map(year => (
                      <div key={year} className="space-y-2">
                        <Label htmlFor={`target-${year}`}>{year}</Label>
                        <Input
                          id={`target-${year}`}
                          type="number"
                          placeholder={`Target for ${year}`}
                          value={formData.yearlyTargets[year.toString()] || ''}
                          onChange={(e) => handleYearlyTargetChange(year.toString(), Number(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-source">Data Source</Label>
                  <Input
                    id="data-source"
                    placeholder="Where is this data collected from?"
                    value={formData.dataSource}
                    onChange={(e) => handleInputChange('dataSource', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="success-indicator">Success Indicator</Label>
                  <Textarea
                    id="success-indicator"
                    placeholder="Describe what success looks like for this KPI"
                    value={formData.successIndicator}
                    onChange={(e) => handleInputChange('successIndicator', e.target.value)}
                    rows={2}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="text-lg mb-4">KPI Preview</h4>
                  {formData.name ? (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-[var(--nigeria-green)]">{formData.name}</CardTitle>
                            <CardDescription>{formData.description}</CardDescription>
                          </div>
                          <Badge variant="outline">{formData.metricType}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Current</p>
                              <p className="text-2xl text-[var(--nigeria-green)]">
                                {getPreviewScore().current.toFixed(1)}{formData.metricType === '#' ? '' : formData.metricType}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Target</p>
                              <p className="text-2xl">
                                {getPreviewScore().target}{formData.metricType === '#' ? '' : formData.metricType}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Progress</p>
                              <Progress value={getPreviewScore().percentage} className="h-2" />
                              <p className="text-sm text-gray-600 mt-1">{getPreviewScore().percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Department:</span>
                              <span>{departments.find(d => d.id === formData.responsibleDepartment)?.abbreviation || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Reporting:</span>
                              <span className="capitalize">{formData.reportingFrequency}</span>
                            </div>
                            {formData.calculationFormula && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Formula:</span>
                                <span className="font-mono text-xs">{formData.calculationFormula}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <p className="text-gray-500 italic">Fill in the basic information to see a preview</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)]">
                <Save className="h-4 w-4 mr-2" />
                Create KPI
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing KPIs List */}
      <div className="grid gap-4">
        <h3 className="text-lg text-[var(--nigeria-green)]">Existing KPIs ({kpis.length})</h3>
        
        {kpis.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg mb-2">No KPIs created yet</h4>
              <p className="text-gray-600 mb-4">Start by creating your first KPI to track performance metrics.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)]">
                <Plus className="h-4 w-4 mr-2" />
                Create First KPI
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {kpis.map(kpi => (
              <Card key={kpi.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-[var(--nigeria-green)]">{kpi.name}</CardTitle>
                      <CardDescription>{kpi.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{kpi.metricType}</Badge>
                      {kpi.isCustom && <Badge variant="secondary">Custom</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-gray-600">Department:</span>
                        <span className="ml-2">{departments.find(d => d.id === kpi.responsibleDepartment)?.abbreviation}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Frequency:</span>
                        <span className="ml-2 capitalize">{kpi.reportingFrequency}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <Badge variant="outline" className={`ml-2 ${
                          kpi.status === 'excellent' ? 'text-green-600 border-green-200' :
                          kpi.status === 'good' ? 'text-blue-600 border-blue-200' :
                          kpi.status === 'fair' ? 'text-yellow-600 border-yellow-200' :
                          'text-red-600 border-red-200'
                        }`}>
                          {kpi.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {kpi.isCustom && (
                        <Button variant="outline" size="sm" onClick={() => handleDeleteKPI(kpi)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}