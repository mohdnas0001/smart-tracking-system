/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FolderPlus,
  ArrowUp,
  ArrowDown,
  AlertCircle
} from 'lucide-react';
import { KPI, Pillar, PillarFormData, User } from '@/types/srap';
import { toast } from 'sonner';

interface PillarManagementProps {
  pillars: Pillar[];
  kpis: KPI[];
  user: User;
  onCreatePillar: (pillar: PillarFormData) => void;
  onUpdatePillar: (id: string, pillar: Partial<Pillar>) => void;
  onDeletePillar: (id: string) => void;
  onReorderPillars: (pillars: Pillar[]) => void;
}

export default function PillarManagement({ 
  pillars, 
  kpis, 
  user, 
  onCreatePillar, 
  onUpdatePillar, 
  onDeletePillar,
  onReorderPillars 
}: PillarManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);
  const [formData, setFormData] = useState<PillarFormData>({
    name: '',
    description: '',
    objectives: [''],
    kpiIds: []
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof PillarFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setValidationErrors([]);
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData(prev => ({
      ...prev,
      objectives: newObjectives
    }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const removeObjective = (index: number) => {
    if (formData.objectives.length > 1) {
      setFormData(prev => ({
        ...prev,
        objectives: prev.objectives.filter((_, i) => i !== index)
      }));
    }
  };

  const handleKPIToggle = (kpiId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      kpiIds: checked 
        ? [...prev.kpiIds, kpiId]
        : prev.kpiIds.filter(id => id !== kpiId)
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) errors.push('Pillar name is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (formData.objectives.filter(obj => obj.trim()).length === 0) {
      errors.push('At least one objective is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const cleanedObjectives = formData.objectives.filter(obj => obj.trim());
    onCreatePillar({
      ...formData,
      objectives: cleanedObjectives
    });
    
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('Pillar created successfully', {
      description: `${formData.name} has been added to the system`
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      objectives: [''],
      kpiIds: []
    });
    setValidationErrors([]);
  };

  const handleDeletePillar = (pillar: Pillar) => {
    if (pillar.kpis.length > 0) {
      toast.error('Cannot delete pillar', {
        description: 'Remove all KPIs from this pillar before deleting it'
      });
      return;
    }

    if (confirm(`Are you sure you want to delete the pillar "${pillar.name}"? This action cannot be undone.`)) {
      onDeletePillar(pillar.id);
      toast.success('Pillar deleted successfully');
    }
  };

  const movePillar = (index: number, direction: 'up' | 'down') => {
    const newPillars = [...pillars];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newPillars.length) {
      [newPillars[index], newPillars[targetIndex]] = [newPillars[targetIndex], newPillars[index]];
      onReorderPillars(newPillars);
      toast.success('Pillar order updated');
    }
  };

  const getAvailableKPIs = () => {
    // KPIs that are not assigned to any pillar or assigned to the current pillar being edited
    const assignedKPIIds = new Set();
    pillars.forEach(pillar => {
      if (pillar.id !== selectedPillar?.id) {
        pillar.kpis.forEach(kpi => assignedKPIIds.add(kpi.id));
      }
    });
    
    return kpis.filter(kpi => !assignedKPIIds.has(kpi.id));
  };

  if (!user.permissions.canManagePillars) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don&apos;t have permission to manage pillars. Contact your administrator for access.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl text-[var(--nigeria-green)] mb-2">Pillar Management</h2>
          <p className="text-gray-600">Create and manage strategic pillars for SRAP 2.0</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)]">
              <Plus className="h-4 w-4 mr-2" />
              Create New Pillar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Pillar</DialogTitle>
              <DialogDescription>
                Define a new strategic pillar for the Smart Tracking System
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pillar-name">Pillar Name *</Label>
                  <Input
                    id="pillar-name"
                    placeholder="e.g., AI Innovation"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose and scope of this pillar"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Strategic Objectives *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addObjective}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Objective
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Objective ${index + 1}`}
                        value={objective}
                        onChange={(e) => handleObjectiveChange(index, e.target.value)}
                        className="flex-1"
                      />
                      {formData.objectives.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeObjective(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Assign KPIs (Optional)</Label>
                <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-4">
                  {getAvailableKPIs().length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No available KPIs to assign</p>
                  ) : (
                    getAvailableKPIs().map(kpi => (
                      <div key={kpi.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`kpi-${kpi.id}`}
                          checked={formData.kpiIds.includes(kpi.id)}
                          onCheckedChange={(checked) => handleKPIToggle(kpi.id, checked as boolean)}
                        />
                        <Label htmlFor={`kpi-${kpi.id}`} className="flex-1 cursor-pointer">
                          <div>
                            <div className="font-medium">{kpi.name}</div>
                            <div className="text-xs text-gray-500">{kpi.description}</div>
                          </div>
                        </Label>
                        <Badge variant="outline">{kpi.metricType}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>

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
                  Create Pillar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Pillars List */}
      <div className="space-y-4">
        <h3 className="text-lg text-[var(--nigeria-green)]">Strategic Pillars ({pillars.length})</h3>
        
        {pillars.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FolderPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg mb-2">No pillars created yet</h4>
              <p className="text-gray-600 mb-4">Start by creating your first strategic pillar to organize KPIs.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)]">
                <Plus className="h-4 w-4 mr-2" />
                Create First Pillar
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pillars.map((pillar, index) => (
              <Card key={pillar.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-[var(--nigeria-green)]">{pillar.name}</CardTitle>
                        {pillar.isCustom && <Badge variant="secondary">Custom</Badge>}
                      </div>
                      <CardDescription>{pillar.description}</CardDescription>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => movePillar(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => movePillar(index, 'down')}
                          disabled={index === pillars.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {pillar.isCustom && (
                          <Button variant="outline" size="sm" onClick={() => handleDeletePillar(pillar)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Objectives */}
                    <div>
                      <h5 className="text-sm text-gray-600 mb-2">Strategic Objectives:</h5>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {pillar.objectives.map((objective, idx) => (
                          <li key={idx}>{objective}</li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    {/* KPIs */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm text-gray-600">Assigned KPIs:</h5>
                        <Badge variant="outline">{pillar.kpis.length} KPIs</Badge>
                      </div>
                      
                      {pillar.kpis.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No KPIs assigned to this pillar</p>
                      ) : (
                        <div className="grid gap-2">
                          {pillar.kpis.map(kpi => (
                            <div key={kpi.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div>
                                <span className="text-sm font-medium">{kpi.name}</span>
                                <Badge variant="outline" className="ml-2 text-xs">{kpi.metricType}</Badge>
                              </div>
                              <Badge variant="outline" className={`text-xs ${
                                kpi.status === 'excellent' ? 'text-green-600 border-green-200' :
                                kpi.status === 'good' ? 'text-blue-600 border-blue-200' :
                                kpi.status === 'fair' ? 'text-yellow-600 border-yellow-200' :
                                'text-red-600 border-red-200'
                              }`}>
                                {kpi.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Overall Score */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Overall Score:</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${
                          pillar.overallScore >= 80 ? 'text-green-600 border-green-200' :
                          pillar.overallScore >= 50 ? 'text-yellow-600 border-yellow-200' :
                          'text-red-600 border-red-200'
                        }`}>
                          {pillar.overallScore}%
                        </Badge>
                        <span className="text-sm capitalize text-gray-600">({pillar.status})</span>
                      </div>
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
