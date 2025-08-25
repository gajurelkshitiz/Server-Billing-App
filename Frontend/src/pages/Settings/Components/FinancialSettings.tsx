import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calculator } from 'lucide-react';

interface FinancialSettingsProps {
  settings: {
    fiscalYearStart: string;
    baseCurrency: string;
    decimalPlaces: number;
    thousandSeparator: string;
    decimalSeparator: string;
    showCurrencySymbol: boolean;
    roundingMethod: 'round' | 'floor' | 'ceil';
  };
  onChange: (key: string, value: any) => void;
}

const FinancialSettings: React.FC<FinancialSettingsProps> = ({ settings, onChange }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Calculator className="h-5 w-5" />
        <span>Financial Configuration</span>
      </CardTitle>
      <CardDescription>
        Configure fiscal year, currency formatting, and financial calculations
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fiscalYearStart">Fiscal Year Start Date</Label>
          <Input
            id="fiscalYearStart"
            value={settings.fiscalYearStart}
            onChange={(e) => onChange('fiscalYearStart', e.target.value)}
            placeholder="07-16 (MM-DD)"
          />
        </div>

        <div className="space-y-2">
          <Label>Base Currency</Label>
          <Select value={settings.baseCurrency} onValueChange={(value) => onChange('baseCurrency', value)}>
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
          <Label htmlFor="decimalPlaces">Decimal Places</Label>
          <Select value={settings.decimalPlaces.toString()} onValueChange={(value) => onChange('decimalPlaces', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 (No decimals)</SelectItem>
              <SelectItem value="2">2 (Default)</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Rounding Method</Label>
          <Select value={settings.roundingMethod} onValueChange={(value) => onChange('roundingMethod', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="round">Round (Normal)</SelectItem>
              <SelectItem value="floor">Floor (Round Down)</SelectItem>
              <SelectItem value="ceil">Ceil (Round Up)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="thousandSeparator">Thousand Separator</Label>
          <Select value={settings.thousandSeparator} onValueChange={(value) => onChange('thousandSeparator', value === 'none' ? '' : value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=",">, (Comma)</SelectItem>
              <SelectItem value=".">.  (Period)</SelectItem>
              <SelectItem value=" ">   (Space)</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="decimalSeparator">Decimal Separator</Label>
          <Select value={settings.decimalSeparator} onValueChange={(value) => onChange('decimalSeparator', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=".">. (Period)</SelectItem>
              <SelectItem value=",">, (Comma)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Show Currency Symbol</Label>
          <p className="text-sm text-gray-500">Display currency symbol in amounts</p>
        </div>
        <Switch
          checked={settings.showCurrencySymbol}
          onCheckedChange={(checked) => onChange('showCurrencySymbol', checked)}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <Label className="text-sm font-medium">Preview</Label>
        <p className="text-lg font-semibold mt-2">
          {settings.showCurrencySymbol && (
            <span className="mr-1">
              {settings.baseCurrency === 'NPR' ? 'Rs.' : 
               settings.baseCurrency === 'USD' ? '$' : 
               settings.baseCurrency === 'EUR' ? '€' : 
               settings.baseCurrency === 'INR' ? '₹' : ''}
            </span>
          )}
          1{settings.thousandSeparator}234{settings.decimalSeparator}
          {settings.decimalPlaces > 0 ? '56'.padEnd(settings.decimalPlaces, '0') : ''}
        </p>
      </div>
    </CardContent>
  </Card>
);

export default FinancialSettings;