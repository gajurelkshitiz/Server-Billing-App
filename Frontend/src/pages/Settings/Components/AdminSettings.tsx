import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, Upload, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';


import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/context/ProfileContext';
import { getAuthHeaders } from '@/utils/auth';




const emptyAdmin = {
  name: '',
  email: '',
  phoneNo: '',
  profileImage: '',
  subsName: '',
  mode: '',
  role: '',
  isVerified: false,
  lastLogin: '',
  country: '',
};

const AdminSettings: React.FC = () => {
  const [localSettings, setLocalSettings] = useState(emptyAdmin);
  const [original, setOriginal] = useState(emptyAdmin);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { toast } = useToast();
  const { profile } = useProfile();

  // for debugging work; Checking the context api (for profile) to see its content;
  console.log('profile context api has: ', profile);

  console.log(`complete URL for admin: ${import.meta.env.REACT_APP_API_URL}/admin/${profile?._id || ''}` )

  // Fetch admin data when profile._id is available
  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      try {
        if (!profile?._id) throw new Error('No admin ID found in profile');
        const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/admin/${profile._id}`,
          { headers: getAuthHeaders() }
        );
        if (!res.ok) throw new Error('Failed to fetch admin');
        const data = await res.json();
        console.log('Response from Admin fetch (AdminSetting): ', data);
        const adminData = { ...emptyAdmin, ...data.admin };
        const mergedOriginal = { ...adminData, ...data.admin };
        setLocalSettings(adminData);
        setOriginal(mergedOriginal);
        setDataLoaded(true);
      } catch (err) {
        setLocalSettings(emptyAdmin);
        setOriginal(emptyAdmin);
        setDataLoaded(true);
        toast({
          title: "Error",
          description: "Could not load admin data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    if (profile?._id) {
      fetchAdmin();
    }
  }, [profile?._id]);

  
  // testing the output of the the localStorage:
  console.log('LocalSetting for Admin contains: ', localSettings);

  const handleChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange('profileImage', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSave = async () => {
    if (!(profile?.adminID || profile?.id)) return;
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/admin/${profile?.adminID || profile?.id}`,
        {
          method: 'PATCH',
          headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(localSettings),
        }
      );
      if (!res.ok) throw new Error('Failed to update admin');
      const data = await res.json();
      setOriginal({ ...localSettings, ...data.admin });
      toast({
        title: "Saved",
        description: "Admin profile updated.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not update admin profile.",
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Admin Profile</span>
          </CardTitle>
          <CardDescription>
            Configure your admin profile information and settings
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
        {/* Profile Image Section */}
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              {localSettings.profileImage ? (
                <img
                  src={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${localSettings.profileImage}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="h-8 w-8" />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <Label htmlFor="profileImageUpload" className="text-sm font-medium">
              Profile Image
            </Label>
            <div className="mt-1 flex items-center space-x-2">
              <Input
                id="profileImageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('profileImageUpload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <p className="text-xs text-gray-500">JPG, PNG up to 2MB</p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="adminName">Full Name</Label>
            <Input
              id="adminName"
              value={localSettings.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your Full Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email Address</Label>
            <Input
              id="adminEmail"
              type="email"
              value={localSettings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="admin@company.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminPhone">Phone Number</Label>
            <Input
              id="adminPhone"
              value={localSettings.phoneNo}
              onChange={(e) => handleChange('phoneNo', e.target.value)}
              placeholder="+977-9876543210"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminCountry">Country</Label>
            <Input
              id="adminCountry"
              value={localSettings.country || ''}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder="Nepal"
            />
          </div>
        </div>

        {/* Subscription Information (Read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Subscription Plan</Label>
            <Input
              value={localSettings.subsName || ''}
              disabled
              className="bg-gray-50"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label>Billing Mode</Label>
            <Input
              value={localSettings.mode || ''}
              disabled
              className="bg-gray-50"
              readOnly
            />
          </div>
        </div>

        {/* Status Information (Read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Role</Label>
            <Input
              value={localSettings.role}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Verification Status</Label>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${localSettings.isVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm ${localSettings.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                {localSettings.isVerified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Last Login</Label>
            <Input
              value={localSettings.lastLogin ? new Date(localSettings.lastLogin).toLocaleDateString() : 'Never'}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
  {/* Save/Reset buttons are now only in the header if hasChanges */}
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
