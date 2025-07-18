import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Mail, 
  Phone, 
  Globe, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Database, 
  Settings 
} from 'lucide-react';

interface NotificationSettingsProps {
  settings: {
    email: boolean;
    sms: boolean;
    browser: boolean;
    invoiceCreated: boolean;
    paymentReceived: boolean;
    paymentOverdue: boolean;
    lowInventory: boolean;
    systemUpdates: boolean;
    marketingEmails: boolean;
  };
  onChange: (key: string, value: any) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ settings, onChange }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Bell className="h-5 w-5" />
        <span>Notification Preferences</span>
      </CardTitle>
      <CardDescription>
        Configure when and how you receive notifications
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Notification Channels</h4>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
          </div>
          <Switch
            checked={settings.email}
            onCheckedChange={(checked) => onChange('email', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-500" />
            <div>
              <Label>SMS Notifications</Label>
              <p className="text-sm text-gray-500">Receive SMS alerts</p>
            </div>
          </div>
          <Switch
            checked={settings.sms}
            onCheckedChange={(checked) => onChange('sms', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="h-4 w-4 text-gray-500" />
            <div>
              <Label>Browser Notifications</Label>
              <p className="text-sm text-gray-500">Show browser push notifications</p>
            </div>
          </div>
          <Switch
            checked={settings.browser}
            onCheckedChange={(checked) => onChange('browser', checked)}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Event Notifications</h4>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-4 w-4 text-blue-500" />
            <div>
              <Label>Invoice Created</Label>
              <p className="text-sm text-gray-500">When new invoices are created</p>
            </div>
          </div>
          <Switch
            checked={settings.invoiceCreated}
            onCheckedChange={(checked) => onChange('invoiceCreated', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <div>
              <Label>Payment Received</Label>
              <p className="text-sm text-gray-500">When payments are received</p>
            </div>
          </div>
          <Switch
            checked={settings.paymentReceived}
            onCheckedChange={(checked) => onChange('paymentReceived', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <div>
              <Label>Payment Overdue</Label>
              <p className="text-sm text-gray-500">When payments are overdue</p>
            </div>
          </div>
          <Switch
            checked={settings.paymentOverdue}
            onCheckedChange={(checked) => onChange('paymentOverdue', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="h-4 w-4 text-orange-500" />
            <div>
              <Label>Low Inventory</Label>
              <p className="text-sm text-gray-500">When stock levels are low</p>
            </div>
          </div>
          <Switch
            checked={settings.lowInventory}
            onCheckedChange={(checked) => onChange('lowInventory', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="h-4 w-4 text-purple-500" />
            <div>
              <Label>System Updates</Label>
              <p className="text-sm text-gray-500">Important system notifications</p>
            </div>
          </div>
          <Switch
            checked={settings.systemUpdates}
            onCheckedChange={(checked) => onChange('systemUpdates', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <div>
              <Label>Marketing Emails</Label>
              <p className="text-sm text-gray-500">Product updates and tips</p>
            </div>
          </div>
          <Switch
            checked={settings.marketingEmails}
            onCheckedChange={(checked) => onChange('marketingEmails', checked)}
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default NotificationSettings;