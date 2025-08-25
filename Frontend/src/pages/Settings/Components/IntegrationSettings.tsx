import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  CreditCard, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface IntegrationSettingsProps {
  settings: {
    paymentGateways: {
      stripe: { enabled: boolean; apiKey: string; };
      paypal: { enabled: boolean; clientId: string; };
      esewa: { enabled: boolean; merchantId: string; };
      khalti: { enabled: boolean; publicKey: string; };
    };
    emailService: {
      provider: 'smtp' | 'sendgrid' | 'mailgun';
      smtpHost: string;
      smtpPort: number;
      smtpUser: string;
      smtpPassword: string;
    };
    smsService: {
      provider: 'twillio' | 'nexmo' | 'local';
      apiKey: string;
      senderId: string;
    };
  };
  onChange: (section: string, subsection: string, key: string, value: any) => void;
  showPasswords: Record<string, boolean>;
  togglePasswordVisibility: (field: string) => void;
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ 
  settings, 
  onChange, 
  showPasswords, 
  togglePasswordVisibility 
}) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment Gateways</span>
        </CardTitle>
        <CardDescription>
          Configure payment gateway integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(settings.paymentGateways).map(([gateway, config]: [string, any]) => (
          <div key={gateway} className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label className="capitalize">{gateway}</Label>
                <p className="text-sm text-gray-500">
                  {gateway === 'esewa' ? 'Nepal Payment Gateway' :
                   gateway === 'khalti' ? 'Digital Wallet Nepal' :
                   gateway === 'stripe' ? 'International Payments' :
                   'Global Payment Service'}
                </p>
              </div>
              <Switch
                checked={config.enabled}
                onCheckedChange={(checked) => onChange('integrations', 'paymentGateways', `${gateway}.enabled`, checked)}
              />
            </div>
            
            {config.enabled && (
              <div className="space-y-2">
                <Label>
                  {gateway === 'stripe' ? 'API Key' :
                   gateway === 'paypal' ? 'Client ID' :
                   gateway === 'esewa' ? 'Merchant ID' :
                   'Public Key'}
                </Label>
                <div className="relative">
                  <Input
                    type={showPasswords[`${gateway}_key`] ? 'text' : 'password'}
                    value={config.apiKey || config.clientId || config.merchantId || config.publicKey || ''}
                    onChange={(e) => {
                      const field = gateway === 'stripe' ? 'apiKey' :
                                  gateway === 'paypal' ? 'clientId' :
                                  gateway === 'esewa' ? 'merchantId' : 'publicKey';
                      onChange('integrations', 'paymentGateways', `${gateway}.${field}`, e.target.value);
                    }}
                    placeholder={`Enter ${gateway} credentials`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility(`${gateway}_key`)}
                  >
                    {showPasswords[`${gateway}_key`] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5" />
          <span>Email Service</span>
        </CardTitle>
        <CardDescription>
          Configure email service for sending invoices and notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Email Provider</Label>
          <Select 
            value={settings.emailService.provider} 
            onValueChange={(value) => onChange('integrations', 'emailService', 'provider', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="smtp">SMTP</SelectItem>
              <SelectItem value="sendgrid">SendGrid</SelectItem>
              <SelectItem value="mailgun">Mailgun</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {settings.emailService.provider === 'smtp' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>SMTP Host</Label>
              <Input
                value={settings.emailService.smtpHost}
                onChange={(e) => onChange('integrations', 'emailService', 'smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input
                type="number"
                value={settings.emailService.smtpPort}
                onChange={(e) => onChange('integrations', 'emailService', 'smtpPort', parseInt(e.target.value))}
                placeholder="587"
              />
            </div>

            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={settings.emailService.smtpUser}
                onChange={(e) => onChange('integrations', 'emailService', 'smtpUser', e.target.value)}
                placeholder="your-email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.smtp_password ? 'text' : 'password'}
                  value={settings.emailService.smtpPassword}
                  onChange={(e) => onChange('integrations', 'emailService', 'smtpPassword', e.target.value)}
                  placeholder="App password or account password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePasswordVisibility('smtp_password')}
                >
                  {showPasswords.smtp_password ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Phone className="h-5 w-5" />
          <span>SMS Service</span>
        </CardTitle>
        <CardDescription>
          Configure SMS service for sending notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>SMS Provider</Label>
          <Select 
            value={settings.smsService.provider} 
            onValueChange={(value) => onChange('integrations', 'smsService', 'provider', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local Provider</SelectItem>
              <SelectItem value="twillio">Twilio</SelectItem>
              <SelectItem value="nexmo">Nexmo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="relative">
              <Input
                type={showPasswords.sms_api ? 'text' : 'password'}
                value={settings.smsService.apiKey}
                onChange={(e) => onChange('integrations', 'smsService', 'apiKey', e.target.value)}
                placeholder="Enter API key"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => togglePasswordVisibility('sms_api')}
              >
                {showPasswords.sms_api ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sender ID</Label>
            <Input
              value={settings.smsService.senderId}
              onChange={(e) => onChange('integrations', 'smsService', 'senderId', e.target.value)}
              placeholder="Your Company"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default IntegrationSettings;