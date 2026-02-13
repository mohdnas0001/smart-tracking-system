'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Book, MessageCircle, Phone, Mail, ExternalLink } from 'lucide-react';

const faqs = [
  {
    question: 'How do I submit monthly KPI data?',
    answer: 'Navigate to your Dashboard and select the "Monthly Input" tab. For each assigned KPI, enter the monthly achievement value, add comments, upload supporting evidence, then click "Submit for Approval".'
  },
  {
    question: 'What are the SRAP 2.0 performance thresholds?',
    answer: 'Performance is rated on a 5-point scale: Excellent (90-100%), Good (70-89%), Fair (50-69%), Poor (30-49%), and Critical (below 30%). These thresholds apply to all KPIs across pillars.'
  },
  {
    question: 'How does the AI Analytics system work?',
    answer: 'The AI Analytics engine uses machine learning models trained on historical SRAP data to identify trends, predict future performance, and generate strategic recommendations. The system continuously improves as more data is collected.'
  },
  {
    question: 'What is the reporting deadline schedule?',
    answer: 'Monthly data submissions are due by the 5th of each month. Quarterly reports are generated automatically on the 15th of the quarter-end month. Annual assessments are compiled in December.'
  },
  {
    question: 'How do I generate a report?',
    answer: 'Go to the Report Generation page, select a template, choose the pillars to include, set your output format and filters, then click "Generate Report". Reports can be exported as PDF, CSV, or interactive dashboards.'
  },
  {
    question: 'Who can approve KPI submissions?',
    answer: 'Directors and the Director General can approve KPI submissions. The approval workflow goes: Desk Officer submits → Director reviews and approves → DG receives aggregated reports.'
  },
  {
    question: 'What do the different alert types mean?',
    answer: 'Information (blue) - General announcements. Success (green) - Positive updates. Warning (yellow) - Items needing attention. Error (red) - Critical issues requiring immediate action.'
  },
  {
    question: 'How do I manage pillars and KPIs?',
    answer: 'Users with appropriate permissions can manage pillars through the Pillar Management page and KPIs through the KPI Management page. The DG and Strategy Team have full management access.'
  }
];

export default function HelpPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <HelpCircle className="h-8 w-8 text-[var(--nigeria-green)]" />
        <div>
          <h1 className="text-2xl text-[var(--nigeria-green)]">Help & Support</h1>
          <p className="text-gray-600">Get help with the NITDA Smart Tracking System</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Quick Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                SRAP 2.0 Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                User Guide
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                Video Tutorials
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                API Documentation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[var(--nigeria-green)]" />
                <div>
                  <p className="text-sm font-medium">Email Support</p>
                  <p className="text-sm text-gray-500">support@nitda.gov.ng</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[var(--nigeria-green)]" />
                <div>
                  <p className="text-sm font-medium">Phone Support</p>
                  <p className="text-sm text-gray-500">+234 (0) 9-461-2360</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-[var(--nigeria-green)]" />
                <div>
                  <p className="text-sm font-medium">Live Chat</p>
                  <Badge variant="outline" className="text-green-600">Available</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Version</span>
                <span className="text-[var(--nigeria-green)]">2.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-[var(--nigeria-green)]">Sep 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Environment</span>
                <Badge variant="outline">Production</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about the Smart Tracking System</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
