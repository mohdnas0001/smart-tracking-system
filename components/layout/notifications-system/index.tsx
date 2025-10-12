import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, X, AlertTriangle, CheckCircle, Info, AlertCircle, Clock, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'kpi-alert' | 'deadline' | 'approval';
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  department?: string;
  kpiId?: string;
  actionRequired?: boolean;
}

interface NotificationSystemProps {
  userRole: string;
  department?: string;
}

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  'kpi-alert': TrendingUp,
  deadline: Clock,
  approval: Calendar
};

const notificationColors = {
  info: 'text-blue-600 bg-blue-50',
  success: 'text-green-600 bg-green-50',
  warning: 'text-yellow-600 bg-yellow-50',
  error: 'text-red-600 bg-red-50',
  'kpi-alert': 'text-purple-600 bg-purple-50',
  deadline: 'text-orange-600 bg-orange-50',
  approval: 'text-indigo-600 bg-indigo-50'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

// Mock notification data
const generateMockNotifications = (userRole: string, department?: string): Notification[] => {
  const baseNotifications: Notification[] = [
    {
      id: '1',
      title: 'KPI Target Alert',
      message: 'Digital Literacy Training completion rate is below quarterly target (45% vs 60% target)',
      type: 'kpi-alert',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      priority: 'high',
      department: 'NITDA',
      kpiId: 'kpi-digital-literacy',
      actionRequired: true
    },
    {
      id: '2',
      title: 'Monthly Reporting Deadline',
      message: 'Monthly KPI data submission deadline is in 3 days',
      type: 'deadline',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      priority: 'medium',
      actionRequired: true
    },
    {
      id: '3',
      title: 'Data Approved',
      message: 'Your September KPI submissions have been approved by Director',
      type: 'success',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      title: 'System Maintenance',
      message: 'Scheduled system maintenance on Sunday, 2:00 AM - 4:00 AM',
      type: 'info',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      title: 'Critical KPI Variance',
      message: 'Cybersecurity Awareness metric shows significant negative trend (-15%)',
      type: 'error',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      read: false,
      priority: 'critical',
      department: 'NCC',
      actionRequired: true
    }
  ];

  // Filter notifications based on user role and department
  if (userRole === 'desk-officer' && department) {
    return baseNotifications.filter(n => !n.department || n.department === department);
  }

  return baseNotifications;
};

export function NotificationSystem({ userRole, department }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setNotifications(generateMockNotifications(userRole, department));
  }, [userRole, department]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60 * 60 * 1000) { // Less than 1 hour
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes}m ago`;
    } else if (diff < 24 * 60 * 60 * 1000) { // Less than 1 day
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days}d ago`;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.actionRequired) {
      toast(notification.title, {
        description: 'This notification requires your attention. Would you like to take action?',
        action: {
          label: 'View Details',
          onClick: () => {
            // Here you would navigate to the relevant page
            console.log('Navigate to:', notification);
          }
        }
      });
    }
  };

  // Auto-show critical notifications as toasts
  useEffect(() => {
    notifications
      .filter(n => n.priority === 'critical' && !n.read)
      .forEach(notification => {
        toast.error(notification.title, {
          description: notification.message,
          duration: 10000, // 10 seconds for critical alerts
          action: {
            label: 'View',
            onClick: () => handleNotificationClick(notification)
          }
        });
      });
  }, [notifications]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative border-none">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className={`absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0 ${
                criticalCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-[var(--nigeria-green)] text-white'
              }`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => {
                    const IconComponent = notificationIcons[notification.type];
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full flex-shrink-0 ${notificationColors[notification.type]}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge 
                                    className={`text-xs ${priorityColors[notification.priority]}`}
                                  >
                                    {notification.priority}
                                  </Badge>
                                  
                                  {notification.department && (
                                    <Badge variant="outline" className="text-xs">
                                      {notification.department}
                                    </Badge>
                                  )}
                                  
                                  {notification.actionRequired && (
                                    <Badge className="text-xs bg-orange-100 text-orange-800">
                                      Action Required
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatTimestamp(notification.timestamp)}
                                </p>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dismissNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full absolute right-2 top-4"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}