import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Shield } from 'lucide-react';

interface SecuritySettingsProps {
  settings: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    loginAttempts: number;
    ipRestriction: boolean;
    allowedIPs: string[];
    auditLogging: boolean;
    dataEncryption: boolean;
  };
  onChange: (key: string, value: any) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ settings, onChange }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Shield className="h-5 w-5" />
        <span>Security Configuration</span>
      </CardTitle>
      <CardDescription>
        Manage authentication, session, and security policies
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-gray-500">Add extra security to your account</p>
          </div>
          <Switch
            checked={settings.twoFactorAuth}
            onCheckedChange={(checked) => onChange('twoFactorAuth', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Audit Logging</Label>
            <p className="text-sm text-gray-500">Log all user activities</p>
          </div>
          <Switch
            checked={settings.auditLogging}
            onCheckedChange={(checked) => onChange('auditLogging', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Data Encryption</Label>
            <p className="text-sm text-gray-500">Encrypt sensitive data</p>
          </div>
          <Switch
            checked={settings.dataEncryption}
            onCheckedChange={(checked) => onChange('dataEncryption', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>IP Restriction</Label>
            <p className="text-sm text-gray-500">Restrict access to specific IP addresses</p>
          </div>
          <Switch
            checked={settings.ipRestriction}
            onCheckedChange={(checked) => onChange('ipRestriction', checked)}
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Session Timeout (minutes)</Label>
          <Select value={settings.sessionTimeout.toString()} onValueChange={(value) => onChange('sessionTimeout', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
              <SelectItem value="480">8 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Password Expiry (days)</Label>
          <Select value={settings.passwordExpiry.toString()} onValueChange={(value) => onChange('passwordExpiry', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="60">60 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="180">180 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
              <SelectItem value="0">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Max Login Attempts</Label>
          <Select value={settings.loginAttempts.toString()} onValueChange={(value) => onChange('loginAttempts', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 attempts</SelectItem>
              <SelectItem value="5">5 attempts</SelectItem>
              <SelectItem value="10">10 attempts</SelectItem>
              <SelectItem value="0">Unlimited</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {settings.ipRestriction && (
        <div className="space-y-2">
          <Label>Allowed IP Addresses</Label>
          <Textarea
            value={settings.allowedIPs.join('\n')}
            onChange={(e) => onChange('allowedIPs', e.target.value.split('\n').filter(ip => ip.trim()))}
            placeholder="Enter IP addresses, one per line"
            rows={4}
          />
          <p className="text-sm text-gray-500">Enter one IP address per line (e.g., 192.168.1.100)</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default SecuritySettings;