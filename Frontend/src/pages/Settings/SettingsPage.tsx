import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Settings, 
  Building, 
  Receipt, 
  Calculator, 
  Palette, 
  Bell, 
  Shield, 
  Database,
  Save,
  RotateCcw,
  Server,
  ChevronDown,
  Menu
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Import the modular settings components
import CompanySettings from '@/components/Settings/CompanySettings';
import BillingSettings from '@/components/Settings/BillingSettings';
import FinancialSettings from '@/components/Settings/FinancialSettings';
import DisplaySettings from '@/components/Settings/DisplaySettings';
import NotificationSettings from '@/components/Settings/NotificationSettings';
import SecuritySettings from '@/components/Settings/SecuritySettings';
import BackupSettings from '@/components/Settings/BackupSettings';
import IntegrationSettings from '@/components/Settings/IntegrationSettings';

interface SettingsData {
  // Company Profile Settings
  company: {
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
  
  // Billing & Invoice Settings
  billing: {
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
  
  // Financial Settings
  financial: {
    fiscalYearStart: string;
    baseCurrency: string;
    decimalPlaces: number;
    thousandSeparator: string;
    decimalSeparator: string;
    showCurrencySymbol: boolean;
    roundingMethod: 'round' | 'floor' | 'ceil';
  };
  
  // Display & UI Settings
  display: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    timezone: string;
    itemsPerPage: number;
    compactMode: boolean;
    showTutorials: boolean;
  };
  
  // Notification Settings
  notifications: {
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
  
  // Security Settings
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    loginAttempts: number;
    ipRestriction: boolean;
    allowedIPs: string[];
    auditLogging: boolean;
    dataEncryption: boolean;
  };
  
  // Backup & Export Settings
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupTime: string;
    cloudStorage: boolean;
    retentionPeriod: number;
    emailReports: boolean;
    backupLocation: string;
  };
  
  // Integration Settings
  integrations: {
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
}

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  const [settings, setSettings] = useState<SettingsData>({
    company: {
      name: 'Your Company Name',
      logo: '',
      email: 'contact@company.com',
      phone: '+977-1-4567890',
      address: 'Kathmandu, Nepal',
      website: 'https://yourcompany.com',
      vatNumber: '12345678901',
      panNumber: '123456789',
      registrationNumber: 'REG-2024-001',
      industryType: 'retail',
    },
    billing: {
      defaultCurrency: 'NPR',
      taxRate: 13,
      invoicePrefix: 'INV',
      invoiceNumbering: 'sequential',
      paymentTerms: 30,
      latePaymentFee: 2.5,
      discountThreshold: 5000,
      autoSendReminders: true,
      reminderDays: [7, 3, 1],
      defaultPaymentMethods: ['cash', 'bank'],
    },
    financial: {
      fiscalYearStart: '07-16',
      baseCurrency: 'NPR',
      decimalPlaces: 2,
      thousandSeparator: ',',
      decimalSeparator: '.',
      showCurrencySymbol: true,
      roundingMethod: 'round',
    },
    display: {
      theme: (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'light',
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Asia/Kathmandu',
      itemsPerPage: 25,
      compactMode: false,
      showTutorials: true,
    },
    notifications: {
      email: true,
      sms: false,
      browser: true,
      invoiceCreated: true,
      paymentReceived: true,
      paymentOverdue: true,
      lowInventory: false,
      systemUpdates: true,
      marketingEmails: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipRestriction: false,
      allowedIPs: [],
      auditLogging: true,
      dataEncryption: true,
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'weekly',
      backupTime: '02:00',
      cloudStorage: false,
      retentionPeriod: 90,
      emailReports: true,
      backupLocation: 'local',
    },
    integrations: {
      paymentGateways: {
        stripe: { enabled: false, apiKey: '' },
        paypal: { enabled: false, clientId: '' },
        esewa: { enabled: true, merchantId: '' },
        khalti: { enabled: true, publicKey: '' },
      },
      emailService: {
        provider: 'smtp',
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
      },
      smsService: {
        provider: 'local',
        apiKey: '',
        senderId: '',
      },
    },
  });

  const [originalSettings, setOriginalSettings] = useState<SettingsData>(settings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const savedSettings = localStorage.getItem('billingSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setOriginalSettings(parsed);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings. Using defaults.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (section: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleNestedSettingChange = (section: keyof SettingsData, subsection: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [key]: value
        }
      }
    }));
  };

  // Add this missing function
  const handleImportSettings = (importedSettings: SettingsData) => {
    setSettings(importedSettings);
    toast({
      title: "Settings Imported",
      description: "Settings have been imported successfully. Remember to save changes.",
    });
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Save to localStorage (replace with API call)
      localStorage.setItem('billingSettings', JSON.stringify(settings));
      localStorage.setItem('theme', settings.display.theme);
      
      // Apply theme changes
      document.documentElement.setAttribute('data-theme', settings.display.theme);
      
      setOriginalSettings(settings);
      
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings(originalSettings);
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to last saved values.",
    });
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const settingsTabs = [
    { id: 'company', label: 'Company Profile', icon: Building },
    { id: 'billing', label: 'Billing & Invoice', icon: Receipt },
    { id: 'financial', label: 'Financial', icon: Calculator },
    { id: 'display', label: 'Display & UI', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backup', label: 'Backup & Export/Import', icon: Database },
    { id: 'integrations', label: 'Integrations', icon: Server },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm sm:text-base text-gray-500">Configure your billing system preferences</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {hasChanges && (
            <>
              <Button
                variant="outline"
                onClick={resetSettings}
                disabled={saving}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={saveSettings}
                disabled={saving}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </div>

      {isMobile ? (
        // Mobile Layout
        <div className="space-y-4">
          {/* Mobile Tab Selector */}
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {settingsTabs.find(tab => tab.id === activeTab)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {settingsTabs.map((tab) => (
                <SelectItem key={tab.id} value={tab.id}>
                  <div className="flex items-center space-x-2">
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile Content */}
          <div className="space-y-4">
            {activeTab === 'company' && (
              <CompanySettings
                settings={settings.company}
                onChange={(key, value) => handleSettingChange('company', key, value)}
              />
            )}
            
            {activeTab === 'billing' && (
              <BillingSettings
                settings={settings.billing}
                onChange={(key, value) => handleSettingChange('billing', key, value)}
              />
            )}
            
            {activeTab === 'financial' && (
              <FinancialSettings
                settings={settings.financial}
                onChange={(key, value) => handleSettingChange('financial', key, value)}
              />
            )}
            
            {activeTab === 'display' && (
              <DisplaySettings
                settings={settings.display}
                onChange={(key, value) => handleSettingChange('display', key, value)}
              />
            )}
            
            {activeTab === 'notifications' && (
              <NotificationSettings
                settings={settings.notifications}
                onChange={(key, value) => handleSettingChange('notifications', key, value)}
              />
            )}
            
            {activeTab === 'security' && (
              <SecuritySettings
                settings={settings.security}
                onChange={(key, value) => handleSettingChange('security', key, value)}
              />
            )}
            
            {activeTab === 'backup' && (
              <BackupSettings
                settings={settings.backup}
                onChange={(key, value) => handleSettingChange('backup', key, value)}
                allSettings={settings}
                onImportSettings={handleImportSettings}
              />
            )}
            
            {activeTab === 'integrations' && (
              <IntegrationSettings
                settings={settings.integrations}
                onChange={handleNestedSettingChange}
                showPasswords={showPasswords}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            )}
          </div>
        </div>
      ) : (
        // Desktop Layout
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 space-y-1">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-4 w-4 mr-3" />
                  {tab.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {activeTab === 'company' && (
              <CompanySettings
                settings={settings.company}
                onChange={(key, value) => handleSettingChange('company', key, value)}
              />
            )}
            
            {activeTab === 'billing' && (
              <BillingSettings
                settings={settings.billing}
                onChange={(key, value) => handleSettingChange('billing', key, value)}
              />
            )}
            
            {activeTab === 'financial' && (
              <FinancialSettings
                settings={settings.financial}
                onChange={(key, value) => handleSettingChange('financial', key, value)}
              />
            )}
            
            {activeTab === 'display' && (
              <DisplaySettings
                settings={settings.display}
                onChange={(key, value) => handleSettingChange('display', key, value)}
              />
            )}
            
            {activeTab === 'notifications' && (
              <NotificationSettings
                settings={settings.notifications}
                onChange={(key, value) => handleSettingChange('notifications', key, value)}
              />
            )}
            
            {activeTab === 'security' && (
              <SecuritySettings
                settings={settings.security}
                onChange={(key, value) => handleSettingChange('security', key, value)}
              />
            )}
            
            {activeTab === 'backup' && (
              <BackupSettings
                settings={settings.backup}
                onChange={(key, value) => handleSettingChange('backup', key, value)}
                allSettings={settings}
                onImportSettings={handleImportSettings}
              />
            )}
            
            {activeTab === 'integrations' && (
              <IntegrationSettings
                settings={settings.integrations}
                onChange={handleNestedSettingChange}
                showPasswords={showPasswords}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
