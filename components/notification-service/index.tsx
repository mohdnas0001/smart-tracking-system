'use client';

import React, { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, Clock, Users, TrendingDown } from 'lucide-react';

interface NotificationServiceProviderProps {
  userRole: string;
  department?: string;
  children: React.ReactNode;
}

interface RealTimeEvent {
  type: 'kpi-threshold' | 'deadline-warning' | 'data-approval' | 'system-alert' | 'user-activity';
  data: Record<string, unknown>;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

/** Mock WebSocket service for real-time events */
class MockWebSocketService {
  private listeners: ((event: RealTimeEvent) => void)[] = [];
  private interval: ReturnType<typeof setInterval> | null = null;

  connect() {
    this.interval = setInterval(() => {
      this.generateRandomEvent();
    }, 30000);

    setTimeout(() => {
      this.generateRandomEvent();
    }, 5000);
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  subscribe(callback: (event: RealTimeEvent) => void) {
    this.listeners.push(callback);
  }

  unsubscribe(callback: (event: RealTimeEvent) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private generateRandomEvent() {
    const events: RealTimeEvent[] = [
      {
        type: 'kpi-threshold',
        data: {
          kpiName: 'Digital Literacy Training',
          currentValue: 42,
          threshold: 60,
          trend: 'declining',
          department: 'NITDA'
        },
        timestamp: new Date(),
        priority: 'high'
      },
      {
        type: 'deadline-warning',
        data: {
          task: 'Monthly KPI Submission',
          daysLeft: 2,
          department: 'NCC'
        },
        timestamp: new Date(),
        priority: 'medium'
      },
      {
        type: 'data-approval',
        data: {
          submitter: 'John Doe',
          period: 'September 2024',
          status: 'approved',
          department: 'HR'
        },
        timestamp: new Date(),
        priority: 'low'
      },
      {
        type: 'system-alert',
        data: {
          message: 'Database backup completed successfully',
          component: 'backup-service'
        },
        timestamp: new Date(),
        priority: 'low'
      },
      {
        type: 'user-activity',
        data: {
          action: 'bulk-data-update',
          user: 'Jane Smith',
          recordsUpdated: 25,
          department: 'Finance'
        },
        timestamp: new Date(),
        priority: 'medium'
      }
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    this.listeners.forEach(listener => listener(randomEvent));
  }
}

const wsService = new MockWebSocketService();

function shouldShowEventToUser(event: RealTimeEvent, userRole: string, department?: string): boolean {
  if (event.type === 'system-alert') {
    return ['dg', 'director', 'strategy-team'].includes(userRole);
  }
  if (event.type === 'kpi-threshold') {
    if (userRole === 'desk-officer') {
      return department === event.data.department;
    }
    return ['dg', 'director', 'strategy-team'].includes(userRole);
  }
  if (event.type === 'deadline-warning') {
    if (userRole === 'desk-officer') {
      return department === event.data.department;
    }
    return true;
  }
  if (event.type === 'data-approval') {
    if (userRole === 'desk-officer') {
      return department === event.data.department;
    }
    return ['director', 'strategy-team'].includes(userRole);
  }
  if (event.type === 'user-activity') {
    return ['dg', 'director', 'strategy-team'].includes(userRole);
  }
  return false;
}

function showToastForEvent(event: RealTimeEvent) {
  const toastConfig = {
    duration: event.priority === 'critical' ? 10000 : 5000,
  };

  switch (event.type) {
    case 'kpi-threshold':
      if (event.priority === 'critical' || event.priority === 'high') {
        toast.error('KPI Alert', {
          description: `${event.data.kpiName} requires immediate attention`,
          ...toastConfig,
        });
      }
      break;
    case 'deadline-warning':
      if ((event.data.daysLeft as number) <= 3) {
        toast.warning('Deadline Alert', {
          description: `${event.data.task} due in ${event.data.daysLeft} days`,
          ...toastConfig,
        });
      }
      break;
    case 'data-approval':
      toast.success('Data Approved', {
        description: `${event.data.period} submission approved`,
        ...toastConfig,
      });
      break;
    case 'system-alert':
      if (event.priority === 'high' || event.priority === 'critical') {
        toast(event.data.message as string, {
          ...toastConfig,
        });
      }
      break;
    case 'user-activity':
      if (event.priority === 'high') {
        toast('User Activity Alert', {
          description: `${event.data.user} performed ${event.data.action}`,
          ...toastConfig,
        });
      }
      break;
  }
}

export function NotificationServiceProvider({ userRole, department, children }: NotificationServiceProviderProps) {
  const handleRealTimeEvent = useCallback((event: RealTimeEvent) => {
    const shouldShow = shouldShowEventToUser(event, userRole, department);
    if (!shouldShow) return;
    showToastForEvent(event);
  }, [userRole, department]);

  useEffect(() => {
    wsService.connect();
    wsService.subscribe(handleRealTimeEvent);

    return () => {
      wsService.unsubscribe(handleRealTimeEvent);
      wsService.disconnect();
    };
  }, [handleRealTimeEvent]);

  return <>{children}</>;
}
