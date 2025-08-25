import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Receipt } from 'lucide-react';

interface BillingSettingsProps {
  settings: {
    defaultCurrency: string;
    taxRate: number;
    invoicePrefix: string;
    invoiceNumbering: 'sequential' | 'date-based' | 'custom';
    paymentTerms: number;
    latePaymentFee: number;
    discountThreshold: number;
    autoSendReminders: boolean;
    reminderDays: number[];
    defaultPaymentMethods: string[];
  };
  onChange: (key: string, value: any) => void;
}

const BillingSettings: React.FC<BillingSettingsProps> = ({ settings, onChange }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Receipt className="h-5 w-5" />
          <span>Invoice Configuration</span>
        </CardTitle>
        <CardDescription>
          Configure invoice numbering, payment terms, and defaults
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Default Currency</Label>
            <Select value={settings.defaultCurrency} onValueChange={(value) => onChange('defaultCurrency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NPR">NPR - Nepalese Rupee</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="INR">INR - Indian Rupee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              value={settings.taxRate}
              onChange={(e) => onChange('taxRate', parseFloat(e.target.value))}
              placeholder="13"
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
            <Input
              id="invoicePrefix"
              value={settings.invoicePrefix}
              onChange={(e) => onChange('invoicePrefix', e.target.value)}
              placeholder="INV"
            />
          </div>

          <div className="space-y-2">
            <Label>Invoice Numbering</Label>
            <Select value={settings.invoiceNumbering} onValueChange={(value) => onChange('invoiceNumbering', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sequential">Sequential (1, 2, 3...)</SelectItem>
                <SelectItem value="date-based">Date-based (2024001, 2024002...)</SelectItem>
                <SelectItem value="custom">Custom Format</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms (Days)</Label>
            <Input
              id="paymentTerms"
              type="number"
              value={settings.paymentTerms}
              onChange={(e) => onChange('paymentTerms', parseInt(e.target.value))}
              placeholder="30"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="latePaymentFee">Late Payment Fee (%)</Label>
            <Input
              id="latePaymentFee"
              type="number"
              value={settings.latePaymentFee}
              onChange={(e) => onChange('latePaymentFee', parseFloat(e.target.value))}
              placeholder="2.5"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Send Payment Reminders</Label>
              <p className="text-sm text-gray-500">Automatically send reminders for overdue payments</p>
            </div>
            <Switch
              checked={settings.autoSendReminders}
              onCheckedChange={(checked) => onChange('autoSendReminders', checked)}
            />
          </div>

          {settings.autoSendReminders && (
            <div className="space-y-2">
              <Label>Reminder Schedule (Days before due date)</Label>
              <div className="flex space-x-2">
                {[7, 3, 1, 0].map((day) => (
                  <Badge
                    key={day}
                    variant={settings.reminderDays.includes(day) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const newDays = settings.reminderDays.includes(day)
                        ? settings.reminderDays.filter((d: number) => d !== day)
                        : [...settings.reminderDays, day].sort((a, b) => b - a);
                      onChange('reminderDays', newDays);
                    }}
                  >
                    {day === 0 ? 'Due Date' : `${day} day${day > 1 ? 's' : ''}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default BillingSettings;