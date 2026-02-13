'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Calendar, ArrowRight } from 'lucide-react';
import { aiInsights } from '@/data/mockData';

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const digitalLiteracyTrend = [
  { year: 2024, actual: 34, projected: 34, target: 50 },
  { year: 2025, actual: null, projected: 42, target: 60 },
  { year: 2026, actual: null, projected: 55, target: 70 },
  { year: 2027, actual: null, projected: 68, target: 80 }
];

const threeMTTTrend = [
  { quarter: 'Q1 2024', enrollment: 28000, target: 25000 },
  { quarter: 'Q2 2024', enrollment: 41000, target: 50000 },
  { quarter: 'Q3 2024', enrollment: 53000, target: 75000 },
  { quarter: 'Q4 2024', enrollment: null, projected: 65000, target: 100000 }
];

const riskMatrix = [
  { pillar: 'Digital Literacy', riskLevel: 3, impact: 4, likelihood: 3 },
  { pillar: 'Digital Infrastructure', riskLevel: 2, impact: 3, likelihood: 2 },
  { pillar: 'Digital Government', riskLevel: 1, impact: 2, likelihood: 1 },
  { pillar: 'Digital Economy', riskLevel: 2, impact: 3, likelihood: 3 },
  { pillar: 'Trust & Security', riskLevel: 2, impact: 4, likelihood: 2 },
  { pillar: 'Digital Society', riskLevel: 3, impact: 3, likelihood: 3 },
  { pillar: 'Emerging Tech', riskLevel: 4, impact: 4, likelihood: 4 },
  { pillar: 'Digital Collaboration', riskLevel: 2, impact: 2, likelihood: 2 }
];

export default function AIAnalyticsPage() {
  const insights = aiInsights;
  const riskInsights = insights.filter(insight => insight.type === 'risk');
  const recommendations = insights.filter(insight => insight.type === 'recommendation');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-[var(--nigeria-green)]" />
          <div>
            <h1 className="text-2xl text-[var(--nigeria-green)]">AI Analytics & Insights</h1>
            <p className="text-gray-600">Intelligent analysis and predictive insights for SRAP 2.0</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[var(--nigeria-green)]">
            Last Updated: {new Date().toLocaleDateString()}
          </Badge>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Risk Alerts
              </CardTitle>
              <CardDescription>AI-identified risks requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {riskInsights.map((insight) => (
                <div key={insight.id} className="flex items-start gap-4 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[var(--nigeria-green)]">{insight.title}</h4>
                      <Badge className={getSeverityColor(insight.severity)}>
                        {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{insight.description}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Details <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Matrix</CardTitle>
              <CardDescription>Risk levels across all pillars (Impact vs Likelihood)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskMatrix}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="pillar" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="riskLevel" fill="var(--nigeria-green)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Digital Literacy Progress (2024-2027)</CardTitle>
              <CardDescription>Actual vs projected vs target performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={digitalLiteracyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="actual" stroke="#008751" strokeWidth={3} name="Actual" />
                  <Line type="monotone" dataKey="projected" stroke="#4CAF50" strokeDasharray="5 5" name="AI Projection" />
                  <Line type="monotone" dataKey="target" stroke="#FFC107" strokeWidth={2} name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3MTT Program Enrollment Trend</CardTitle>
              <CardDescription>Quarterly enrollment progress with AI forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={threeMTTTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="enrollment" stroke="#008751" fill="#008751" fillOpacity={0.3} name="Actual Enrollment" />
                  <Area type="monotone" dataKey="projected" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.2} strokeDasharray="5 5" name="AI Projection" />
                  <Line type="monotone" dataKey="target" stroke="#FFC107" strokeWidth={2} name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--nigeria-green)]" />
                AI Predictions & Forecasting
              </CardTitle>
              <CardDescription>Machine learning models predicting future performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[var(--nigeria-green)]">2025 Overall Score Prediction</h4>
                    <Badge className="bg-blue-100 text-blue-800">High Confidence</Badge>
                  </div>
                  <p className="text-2xl text-[var(--nigeria-green)] mb-1">67%</p>
                  <p className="text-sm text-gray-600">Based on current trajectory and seasonal patterns</p>
                  <div className="mt-2 text-xs text-gray-500">Range: 62% - 72% (95% confidence interval)</div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[var(--nigeria-green)]">At-Risk Pillars by 2026</h4>
                    <Badge className="bg-yellow-100 text-yellow-800">Medium Confidence</Badge>
                  </div>
                  <p className="text-2xl text-[var(--nigeria-green)] mb-1">3 Pillars</p>
                  <p className="text-sm text-gray-600">Digital Literacy, Emerging Tech, Digital Society</p>
                  <div className="mt-2 text-xs text-gray-500">Likelihood of missing targets: 68%</div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[var(--nigeria-green)]">Budget Optimization Impact</h4>
                    <Badge className="bg-green-100 text-green-800">High Confidence</Badge>
                  </div>
                  <p className="text-2xl text-[var(--nigeria-green)] mb-1">+12%</p>
                  <p className="text-sm text-gray-600">Projected improvement with recommended reallocation</p>
                  <div className="mt-2 text-xs text-gray-500">Focus on Digital Literacy and Infrastructure</div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[var(--nigeria-green)]">Regional Performance Gap</h4>
                    <Badge className="bg-purple-100 text-purple-800">Medium Confidence</Badge>
                  </div>
                  <p className="text-2xl text-[var(--nigeria-green)] mb-1">28%</p>
                  <p className="text-sm text-gray-600">North-South digital divide expected to persist</p>
                  <div className="mt-2 text-xs text-gray-500">Requires targeted intervention programs</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="text-[var(--nigeria-green)] mb-2">Model Performance Metrics</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Accuracy</p>
                    <p className="text-[var(--nigeria-green)]">87.3%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Data Quality Score</p>
                    <p className="text-[var(--nigeria-green)]">92.1%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Training</p>
                    <p className="text-[var(--nigeria-green)]">Sep 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                AI-Generated Recommendations
              </CardTitle>
              <CardDescription>Actionable insights aligned with presidential priorities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <div key={recommendation.id} className="flex items-start gap-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[var(--nigeria-green)]">{recommendation.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(recommendation.severity)}>
                          {recommendation.severity.charAt(0).toUpperCase() + recommendation.severity.slice(1)} Priority
                        </Badge>
                        <Badge variant="outline">Action #{index + 1}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{recommendation.description}</p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-[var(--nigeria-green)] hover:bg-[var(--nigeria-light-green)]">
                        Implement Action
                      </Button>
                      <Button variant="outline" size="sm">More Details</Button>
                      <Button variant="ghost" size="sm">Dismiss</Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--nigeria-green)]/10 to-[var(--nigeria-light-green)]/10 border border-[var(--nigeria-green)]/20 rounded-lg">
                <h4 className="text-[var(--nigeria-green)] mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Strategic Focus Areas for Q4 2024
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="text-sm text-[var(--nigeria-green)]">Immediate Actions (Next 30 Days)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Accelerate 3MTT enrollment in northern states</li>
                      <li>• Launch women-in-tech initiative</li>
                      <li>• Expedite rural fiber optic deployment</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-sm text-[var(--nigeria-green)]">Medium-term Goals (Next 90 Days)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Establish 5 new digital literacy centers</li>
                      <li>• Complete cybersecurity framework draft</li>
                      <li>• Launch AI strategy consultation process</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
