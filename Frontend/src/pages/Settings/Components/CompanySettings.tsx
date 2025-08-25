import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCompanyStateGlobal, CompanyContextType } from '@/provider/companyState';
import { getAuthHeaders } from '@/utils/auth';



const emptyCompany = {
  name: '',
  logo: '',
  email: '',
  phoneNo: '',
  address: '',
  website: '',
  vat: '',
  panNumber: '',
  registrationNumber: '',
  industrytype: '',
};

const CompanySettings: React.FC = () => {
  const { state }: CompanyContextType = useCompanyStateGlobal();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(emptyCompany);
  const [original, setOriginal] = useState(emptyCompany);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);


  console.log("For user/admin, the 'state.companyID' will have the value of:  ", state.companyID);

  // Fetch company data on mount or when companyID changes
  useEffect(() => {
    const fetchCompany = async () => {
      if (!state?.companyID) return;
      console.log('checkpoint1');
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/company/${state.companyID}`,{
            headers: getAuthHeaders(),
          }
        );
        if (!res.ok) throw new Error('Failed to fetch company');
        const data = await res.json();
        // Merge backend fields into both localSettings and original
        const companyData = { ...emptyCompany, ...data.company };
        // If backend has extra fields, preserve them in original
        const mergedOriginal = { ...companyData, ...data.company };
        setLocalSettings(companyData);
        setOriginal(mergedOriginal);
        // for debugging:
        console.log('companyData Is: ', companyData);
        setDataLoaded(true);
      } catch (err) {
        setLocalSettings(emptyCompany);
        setOriginal(emptyCompany);
        setDataLoaded(true);
        toast({
          title: "Error",
          description: "Could not load company data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.companyID]);


  const handleChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };


  const handleSave = async () => {
    if (!state?.companyID) return;
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/company/${state.companyID}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(localSettings),
      });
      if (!res.ok) throw new Error('Failed to update company');
      const data = await res.json();
      setOriginal(data.company);
      toast({
        title: "Saved",
        description: "Company profile updated.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not update company profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocalSettings(original);
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to last saved values.",
    });
  };

  const hasChanges = dataLoaded && JSON.stringify(localSettings) !== JSON.stringify(original);


  // for debug-purpose:
  console.log('Inside localStorage: company value is: ', localSettings);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Company Profile</span>
          </CardTitle>
          <CardDescription>
            Configure your company information and branding
          </CardDescription>
        </div>
  {hasChanges && (
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={saving}
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={localSettings.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email Address</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={localSettings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contact@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone Number</Label>
                <Input
                  id="companyPhone"
                  value={localSettings.phoneNo}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+977-1-4567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Website</Label>
                <Input
                  id="companyWebsite"
                  value={localSettings.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Address</Label>
              <Textarea
                id="companyAddress"
                value={localSettings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Complete company address"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vatNumber">VAT Number</Label>
                <Input
                  id="vatNumber"
                  value={localSettings.vat}
                  onChange={(e) => handleChange('vatNumber', e.target.value)}
                  placeholder="123456789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input
                  id="panNumber"
                  value={localSettings.panNumber}
                  onChange={(e) => handleChange('panNumber', e.target.value)}
                  placeholder="123456789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={localSettings.registrationNumber}
                  onChange={(e) => handleChange('registrationNumber', e.target.value)}
                  placeholder="REG-2024-001"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Industry Type</Label>
              <Select
              value={localSettings.industrytype || undefined}
              onValueChange={(value) => handleChange('industrytype', value)}
              >
              <SelectTrigger>
                <SelectValue placeholder="Select industry type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
              </Select>
            </div>
            {/* Save/Reset buttons are now only in the header if hasChanges */}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanySettings;