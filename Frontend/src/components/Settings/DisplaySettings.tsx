import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Palette } from 'lucide-react';

interface DisplaySettingsProps {
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    timezone: string;
    itemsPerPage: number;
    compactMode: boolean;
    showTutorials: boolean;
  };
  onChange: (key: string, value: any) => void;
}

const DisplaySettings: React.FC<DisplaySettingsProps> = ({ settings, onChange }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Palette className="h-5 w-5" />
        <span>Display & Interface</span>
      </CardTitle>
      <CardDescription>
        Customize the appearance and behavior of the interface
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select value={settings.theme} onValueChange={(value) => onChange('theme', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300"></div>
                  <span>Light</span>
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                  <span>Dark</span>
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-white to-gray-800 border border-gray-300"></div>
                  <span>System</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={settings.language} onValueChange={(value) => onChange('language', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇺🇸 English</SelectItem>
              <SelectItem value="np">🇳🇵 नेपाली</SelectItem>
              <SelectItem value="hi">🇮🇳 हिंदी</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date Format</Label>
          <Select value={settings.dateFormat} onValueChange={(value) => onChange('dateFormat', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Time Format</Label>
          <Select value={settings.timeFormat} onValueChange={(value) => onChange('timeFormat', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
              <SelectItem value="24h">24 Hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Timezone</Label>
          <Select value={settings.timezone} onValueChange={(value) => onChange('timezone', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Kathmandu">Asia/Kathmandu (UTC+5:45)</SelectItem>
              <SelectItem value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</SelectItem>
              <SelectItem value="UTC">UTC (UTC+0:00)</SelectItem>
              <SelectItem value="America/New_York">America/New_York (UTC-5:00)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Items Per Page</Label>
          <Select value={settings.itemsPerPage.toString()} onValueChange={(value) => onChange('itemsPerPage', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Compact Mode</Label>
            <p className="text-sm text-gray-500">Reduce spacing for more content</p>
          </div>
          <Switch
            checked={settings.compactMode}
            onCheckedChange={(checked) => onChange('compactMode', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Show Tutorials</Label>
            <p className="text-sm text-gray-500">Display helpful tips and tutorials</p>
          </div>
          <Switch
            checked={settings.showTutorials}
            onCheckedChange={(checked) => onChange('showTutorials', checked)}
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default DisplaySettings;