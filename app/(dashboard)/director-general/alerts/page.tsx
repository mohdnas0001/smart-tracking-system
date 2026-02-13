'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Send, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetRole?: string;
  targetDepartment?: string;
  active: boolean;
  createdAt: Date;
  expiresAt?: Date;
  persistent: boolean;
}

const alertTypes = [
  { value: 'info', label: 'Information', icon: Info, color: 'text-blue-600' },
  { value: 'success', label: 'Success', icon: CheckCircle, color: 'text-green-600' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-yellow-600' },
  { value: 'error', label: 'Error', icon: AlertCircle, color: 'text-red-600' }
];

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
];

const roles = [
  { value: 'all', label: 'All Users' },
  { value: 'dg', label: 'Director General' },
  { value: 'director', label: 'Directors' },
  { value: 'desk-officer', label: 'Desk Officers' },
  { value: 'cps', label: 'CPS' },
  { value: 'strategy-team', label: 'Strategy Team' }
];

const departments = [
  { value: 'all', label: 'All Departments' },
  { value: 'NITDA', label: 'NITDA' },
  { value: 'NCC', label: 'NCC' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'Finance', label: 'Finance' },
  { value: 'IT', label: 'Information Technology' }
];

export default function AlertManagementPage() {
  const { user } = useAuth();
  const userRole = user?.role || '';

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Sunday 2:00-4:00 AM',
      type: 'warning',
      priority: 'medium',
      targetRole: 'all',
      active: true,
      createdAt: new Date(),
      persistent: false
    },
    {
      id: '2',
      title: 'Q4 Deadline Reminder',
      message: 'Quarterly reporting deadline in 5 days',
      type: 'info',
      priority: 'high',
      targetRole: 'desk-officer',
      active: true,
      createdAt: new Date(),
      persistent: true
    }
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as Alert['type'],
    priority: 'medium' as Alert['priority'],
    targetRole: 'all',
    targetDepartment: 'all',
    persistent: false,
    expiresAt: ''
  });

  const canManageAlerts = ['dg', 'director', 'strategy-team'].includes(userRole);

  if (!canManageAlerts) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
            <p className="text-gray-600">You don&apos;t have permission to manage system alerts.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateAlert = () => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      type: formData.type,
      priority: formData.priority,
      targetRole: formData.targetRole === 'all' ? undefined : formData.targetRole,
      targetDepartment: formData.targetDepartment === 'all' ? undefined : formData.targetDepartment,
      active: true,
      createdAt: new Date(),
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
      persistent: formData.persistent
    };

    setAlerts(prev => [...prev, newAlert]);
    setIsCreateOpen(false);
    resetForm();
    toast.success('Alert created successfully');
  };

  const handleUpdateAlert = () => {
    if (!editingAlert) return;

    setAlerts(prev => prev.map(alert =>
      alert.id === editingAlert.id
        ? {
            ...alert,
            title: formData.title,
            message: formData.message,
            type: formData.type,
            priority: formData.priority,
            targetRole: formData.targetRole === 'all' ? undefined : formData.targetRole,
            targetDepartment: formData.targetDepartment === 'all' ? undefined : formData.targetDepartment,
            persistent: formData.persistent,
            expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined
          }
        : alert
    ));

    setEditingAlert(null);
    resetForm();
    toast.success('Alert updated successfully');
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast.success('Alert deleted successfully');
  };

  const toggleAlertStatus = (id: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      targetRole: 'all',
      targetDepartment: 'all',
      persistent: false,
      expiresAt: ''
    });
  };

  const openEditDialog = (alert: Alert) => {
    setEditingAlert(alert);
    setFormData({
      title: alert.title,
      message: alert.message,
      type: alert.type,
      priority: alert.priority,
      targetRole: alert.targetRole || 'all',
      targetDepartment: alert.targetDepartment || 'all',
      persistent: alert.persistent,
      expiresAt: alert.expiresAt ? alert.expiresAt.toISOString().split('T')[0] : ''
    });
  };

  const AlertForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Alert Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter alert title"
        />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Enter alert message"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Alert Type</Label>
          <Select value={formData.type} onValueChange={(value: Alert['type']) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {alertTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className={`h-4 w-4 ${type.color}`} />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Priority</Label>
          <Select value={formData.priority} onValueChange={(value: Alert['priority']) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map(priority => (
                <SelectItem key={priority.value} value={priority.value}>
                  <Badge className={priority.color}>{priority.label}</Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Target Role</Label>
          <Select value={formData.targetRole} onValueChange={(value) => setFormData({ ...formData, targetRole: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Target Department</Label>
          <Select value={formData.targetDepartment} onValueChange={(value) => setFormData({ ...formData, targetDepartment: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="expiresAt">Expires At (Optional)</Label>
        <Input
          id="expiresAt"
          type="date"
          value={formData.expiresAt}
          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="persistent"
          checked={formData.persistent}
          onCheckedChange={(checked) => setFormData({ ...formData, persistent: checked })}
        />
        <Label htmlFor="persistent">Persistent Alert (won&apos;t auto-dismiss)</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          onClick={editingAlert ? handleUpdateAlert : handleCreateAlert}
          disabled={!formData.title || !formData.message}
        >
          <Send className="h-4 w-4 mr-2" />
          {editingAlert ? 'Update Alert' : 'Create Alert'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setIsCreateOpen(false);
            setEditingAlert(null);
            resetForm();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[var(--nigeria-green)]">Alert Management</h2>
          <p className="text-gray-600">Create and manage system-wide alerts and notifications</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingAlert(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
            </DialogHeader>
            <AlertForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => {
                const alertType = alertTypes.find(t => t.value === alert.type);
                const priority = priorities.find(p => p.value === alert.priority);

                return (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{alert.message}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {alertType && <alertType.icon className={`h-4 w-4 ${alertType.color}`} />}
                        {alertType?.label}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={priority?.color}>{priority?.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{alert.targetRole ? roles.find(r => r.value === alert.targetRole)?.label : 'All Roles'}</p>
                        {alert.targetDepartment && (
                          <p className="text-gray-500">{departments.find(d => d.value === alert.targetDepartment)?.label}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={alert.active ? 'default' : 'secondary'}>
                        {alert.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {alert.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAlertStatus(alert.id)}
                        >
                          {alert.active ? 'Deactivate' : 'Activate'}
                        </Button>

                        <Dialog open={editingAlert?.id === alert.id} onOpenChange={(open) => {
                          if (!open) {
                            setEditingAlert(null);
                            resetForm();
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(alert)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Alert</DialogTitle>
                            </DialogHeader>
                            <AlertForm />
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
