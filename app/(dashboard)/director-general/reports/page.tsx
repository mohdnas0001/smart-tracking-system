'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, FileText, Filter, Calendar as CalendarIcon, TrendingUp, Settings, Share2 } from 'lucide-react';
import { mockDashboardData } from '@/data/mockData';
import { format } from 'date-fns';

const reportTemplates = [
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'High-level overview for leadership',
    duration: '2-3 pages',
    audience: 'DG, Ministers, Senior Leadership'
  },
  {
    id: 'quarterly-report',
    name: 'Quarterly Progress Report',
    description: 'Comprehensive quarterly assessment',
    duration: '15-20 pages',
    audience: 'Directors, Strategy Team, Stakeholders'
  },
  {
    id: 'pillar-specific',
    name: 'Pillar-Specific Report',
    description: 'Detailed analysis of selected pillars',
    duration: '5-10 pages',
    audience: 'Pillar Teams, Subject Matter Experts'
  },
  {
    id: 'ai-insights',
    name: 'AI Analytics Report',
    description: 'Data-driven insights and predictions',
    duration: '8-12 pages',
    audience: 'Strategy Team, Policy Makers'
  },
  {
    id: 'presidential-brief',
    name: 'Presidential Brief',
    description: 'Aligned with presidential priorities',
    duration: '1-2 pages',
    audience: 'Office of the President'
  }
];

const outputFormats = [
  { id: 'pdf', name: 'PDF Document', icon: FileText, description: 'Professional formatted document' },
  { id: 'csv', name: 'CSV Data Export', icon: Download, description: 'Raw data for analysis' },
  { id: 'dashboard', name: 'Interactive Dashboard', icon: TrendingUp, description: 'Web-based interactive report' }
];

export default function ReportGenerationPage() {
  const data = mockDashboardData;
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedPillars, setSelectedPillars] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [customFilters, setCustomFilters] = useState({
    gender: '',
    location: '',
    department: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePillarToggle = (pillarId: string) => {
    setSelectedPillars(prev =>
      prev.includes(pillarId)
        ? prev.filter(id => id !== pillarId)
        : [...prev, pillarId]
    );
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));

    const reportData = {
      template: selectedTemplate,
      pillars: selectedPillars,
      format: selectedFormat,
      dateRange,
      filters: customFilters,
      generatedAt: new Date().toISOString()
    };

    console.log('Generating report with data:', reportData);

    const blob = new Blob(['Sample report content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SRAP-2.0-Report-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[var(--nigeria-green)]">Report Generation</h1>
          <p className="text-gray-600">Generate comprehensive reports with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[var(--nigeria-green)]">
            Auto-aligned with Presidential Priorities
          </Badge>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share Template
          </Button>
        </div>
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="configuration">Configure</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-6">
          {/* Report Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Report Template</CardTitle>
              <CardDescription>Choose a pre-configured template optimized for your audience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-[var(--nigeria-green)] bg-[var(--nigeria-green)]/5'
                        : 'border-gray-200 hover:border-[var(--nigeria-green)]/50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[var(--nigeria-green)]">{template.name}</h4>
                      {selectedTemplate === template.id && (
                        <div className="h-2 w-2 bg-[var(--nigeria-green)] rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    <div className="text-xs text-gray-500">
                      <p>Length: {template.duration}</p>
                      <p>Audience: {template.audience}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pillar Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Pillars to Include</CardTitle>
              <CardDescription>Choose which SRAP 2.0 pillars to include in your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.pillars.map((pillar) => (
                  <div key={pillar.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={pillar.id}
                      checked={selectedPillars.includes(pillar.id)}
                      onCheckedChange={() => handlePillarToggle(pillar.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={pillar.id} className="text-sm cursor-pointer">
                        {pillar.name}
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {pillar.overallScore}% Complete
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {pillar.kpis.length} KPIs
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPillars(data.pillars.map(p => p.id))}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPillars([])}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output Format & Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Output Format</CardTitle>
                <CardDescription>Choose how you want to receive your report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {outputFormats.map((fmt) => {
                  const IconComponent = fmt.icon;
                  return (
                    <div
                      key={fmt.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedFormat === fmt.id
                          ? 'border-[var(--nigeria-green)] bg-[var(--nigeria-green)]/5'
                          : 'border-gray-200 hover:border-[var(--nigeria-green)]/50'
                      }`}
                      onClick={() => setSelectedFormat(fmt.id)}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-[var(--nigeria-green)]" />
                        <div>
                          <h4 className="text-sm text-[var(--nigeria-green)]">{fmt.name}</h4>
                          <p className="text-xs text-gray-500">{fmt.description}</p>
                        </div>
                        {selectedFormat === fmt.id && (
                          <div className="ml-auto h-2 w-2 bg-[var(--nigeria-green)] rounded-full"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Advanced Filters
                </CardTitle>
                <CardDescription>Customize your report with specific criteria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, 'PPP') : 'Start Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <span className="text-sm text-gray-500">to</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, 'PPP') : 'End Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender Focus</Label>
                  <Select value={customFilters.gender} onValueChange={(value) => setCustomFilters(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="male">Male Participants</SelectItem>
                      <SelectItem value="female">Female Participants</SelectItem>
                      <SelectItem value="gender-analysis">Gender Gap Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Geographic Focus</Label>
                  <Select value={customFilters.location} onValueChange={(value) => setCustomFilters(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">National Overview</SelectItem>
                      <SelectItem value="north">Northern States</SelectItem>
                      <SelectItem value="south">Southern States</SelectItem>
                      <SelectItem value="lagos">Lagos State</SelectItem>
                      <SelectItem value="abuja">FCT Abuja</SelectItem>
                      <SelectItem value="regional">Regional Comparison</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Department Focus</Label>
                  <Select value={customFilters.department} onValueChange={(value) => setCustomFilters(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="nitda">NITDA</SelectItem>
                      <SelectItem value="ncc">NCC</SelectItem>
                      <SelectItem value="nipost">NIPOST</SelectItem>
                      <SelectItem value="naptip">NAPTIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generate Report */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[var(--nigeria-green)] mb-1">Ready to Generate Report</h4>
                  <p className="text-sm text-gray-600">
                    {selectedPillars.length} pillar(s) selected • {selectedTemplate ? reportTemplates.find(t => t.id === selectedTemplate)?.name : 'No template selected'}
                  </p>
                </div>
                <Button
                  onClick={handleGenerateReport}
                  disabled={!selectedTemplate || selectedPillars.length === 0 || isGenerating}
                  className="bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)]"
                >
                  {isGenerating ? (
                    <>
                      <Settings className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>Preview of your configured report before generation</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="text-lg text-[var(--nigeria-green)] mb-2">
                      {reportTemplates.find(t => t.id === selectedTemplate)?.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Included Pillars:</p>
                        <ul className="mt-1">
                          {selectedPillars.length > 0 ? (
                            selectedPillars.map(pillarId => {
                              const pillar = data.pillars.find(p => p.id === pillarId);
                              return (
                                <li key={pillarId} className="text-[var(--nigeria-green)]">
                                  • {pillar?.name}
                                </li>
                              );
                            })
                          ) : (
                            <li className="text-gray-500">No pillars selected</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="text-gray-600">Report Details:</p>
                        <ul className="mt-1 space-y-1">
                          <li>Format: {outputFormats.find(f => f.id === selectedFormat)?.name}</li>
                          <li>Period: {dateRange.from && dateRange.to ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd, yyyy')}` : 'Full period'}</li>
                          <li>Filters: {Object.values(customFilters).filter(Boolean).length || 'None'} active</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Full preview will be available after report generation</p>
                    <p className="text-sm">Configure your settings and click &quot;Generate Report&quot; to continue</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a report template to see preview</p>
                  <p className="text-sm">Go to the Configuration tab to choose your report settings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Generation History</CardTitle>
              <CardDescription>Previously generated reports and templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Q3 2024 Executive Summary', date: '2024-09-28', type: 'Executive Summary', status: 'Completed' },
                  { name: 'Digital Literacy Analysis', date: '2024-09-25', type: 'Pillar-Specific', status: 'Completed' },
                  { name: 'Presidential Brief - September', date: '2024-09-20', type: 'Presidential Brief', status: 'Completed' },
                  { name: 'AI Insights Q3 Report', date: '2024-09-15', type: 'AI Analytics', status: 'Completed' }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[var(--nigeria-green)]" />
                      <div>
                        <h4 className="text-sm text-[var(--nigeria-green)]">{report.name}</h4>
                        <p className="text-xs text-gray-500">{report.type} • Generated on {report.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {report.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
