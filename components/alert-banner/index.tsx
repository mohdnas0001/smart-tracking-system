'use client';

import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';

export interface SystemAlert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  dismissible: boolean;
  persistent?: boolean;
  actionLabel?: string;
  actionCallback?: () => void;
}

interface AlertBannerProps {
  alerts: SystemAlert[];
  onDismiss: (id: string) => void;
}

const alertIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle
};

const alertStyles = {
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  success: 'border-green-200 bg-green-50 text-green-800',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  error: 'border-red-200 bg-red-50 text-red-800'
};

export function AlertBanner({ alerts, onDismiss }: AlertBannerProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const IconComponent = alertIcons[alert.type];

        return (
          <Alert key={alert.id} className={`${alertStyles[alert.type]} border-l-4`}>
            <IconComponent className="h-4 w-4" />
            <div className="flex-1">
              <AlertDescription className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="font-medium">{alert.title}</span>
                  {alert.message && <span className="ml-2">{alert.message}</span>}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {alert.actionLabel && alert.actionCallback && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={alert.actionCallback}
                      className="h-7 text-xs"
                    >
                      {alert.actionLabel}
                    </Button>
                  )}

                  {alert.dismissible && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismiss(alert.id)}
                      className="h-7 w-7 p-0 hover:bg-white/50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </div>
          </Alert>
        );
      })}
    </div>
  );
}

/** Hook for managing system alerts */
export function useSystemAlerts() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: 'maintenance',
      type: 'warning',
      title: 'Scheduled Maintenance',
      message: 'System maintenance scheduled for Sunday 2:00-4:00 AM. Some features may be temporarily unavailable.',
      dismissible: true,
      persistent: false
    },
    {
      id: 'quarterly-deadline',
      type: 'info',
      title: 'Q4 Reporting Deadline Approaching',
      message: 'Quarterly KPI submissions due in 5 days. Ensure all data is entered and validated.',
      dismissible: true,
      actionLabel: 'View KPIs',
      actionCallback: () => {
        console.log('Navigate to KPI tracking');
      }
    }
  ]);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const addAlert = (alert: Omit<SystemAlert, 'id'>) => {
    const newAlert: SystemAlert = {
      ...alert,
      id: Date.now().toString()
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  return {
    alerts,
    dismissAlert,
    addAlert,
    clearAllAlerts
  };
}
