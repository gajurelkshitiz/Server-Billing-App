import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building } from 'lucide-react';

interface CompanySettingsProps {
  settings: {
    name: string;
    logo: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    vatNumber: string;
    panNumber: string;
    registrationNumber: string;
    industryType: string;
  };
  onChange: (key: string, value: any) => void;
}

const CompanySettings: React.FC<CompanySettingsProps> = ({ settings, onChange }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Building className="h-5 w-5" />
        <span>Company Profile</span>
      </CardTitle>
      <CardDescription>
        Configure your company information and branding
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={settings.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Your Company Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyEmail">Email Address</Label>
          <Input
            id="companyEmail"
            type="email"
            value={settings.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="contact@company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyPhone">Phone Number</Label>
          <Input
            id="companyPhone"
            value={settings.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+977-1-4567890"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyWebsite">Website</Label>
          <Input
            id="companyWebsite"
            value={settings.website}
            onChange={(e) => onChange('website', e.target.value)}
            placeholder="https://yourcompany.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyAddress">Address</Label>
        <Textarea
          id="companyAddress"
          value={settings.address}
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="Complete company address"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="vatNumber">VAT Number</Label>
          <Input
            id="vatNumber"
            value={settings.vatNumber}
            onChange={(e) => onChange('vatNumber', e.target.value)}
            placeholder="123456789"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="panNumber">PAN Number</Label>
          <Input
            id="panNumber"
            value={settings.panNumber}
            onChange={(e) => onChange('panNumber', e.target.value)}
            placeholder="123456789"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Registration Number</Label>
          <Input
            id="registrationNumber"
            value={settings.registrationNumber}
            onChange={(e) => onChange('registrationNumber', e.target.value)}
            placeholder="REG-2024-001"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Industry Type</Label>
        <Select value={settings.industryType} onValueChange={(value) => onChange('industryType', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="wholesale">Wholesale</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="restaurant">Restaurant/Food</SelectItem>
            <SelectItem value="construction">Construction</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="it">IT/Technology</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>
);

export default CompanySettings;