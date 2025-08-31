import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCompanyStateGlobal, CompanyContextType } from '@/provider/companyState';
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
  Menu,
  User
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Import the modular settings components
import CompanySettings from './Components/CompanySettings';
import AdminSettings from './Components/AdminSettings';
import BillingSettings from './Components/BillingSettings';
import FinancialSettings from './Components/FinancialSettings';
import DisplaySettings from './Components/DisplaySettings';
import NotificationSettings from './Components/NotificationSettings';
import SecuritySettings from './Components/SecuritySettings';
import BackupSettings from './Components/BackupSettings';
import IntegrationSettings from './Components/IntegrationSettings';

interface SettingsData {
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
  financial: {
    fiscalYearStart: string;
    baseCurrency: string;
    decimalPlaces: number;
    thousandSeparator: string;
    decimalSeparator: string;
    showCurrencySymbol: boolean;
    roundingMethod: 'round' | 'floor' | 'ceil';
  };
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
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupTime: string;
    cloudStorage: boolean;
    retentionPeriod: number;
    emailReports: boolean;
    backupLocation: string;
  };
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


// --- Default values for each settings section ---
const defaultSettings: SettingsData = {
  billing: {
    defaultCurrency: 'NPR',
    taxRate: 13,
    invoicePrefix: 'INV',
    invoiceNumbering: 'sequential',
    paymentTerms: 30,
    latePaymentFee: 2.5,
    discountThreshold: 0,
    autoSendReminders: false,
    reminderDays: [7, 3, 1, 0],
    defaultPaymentMethods: [],
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
    theme: 'system',
    language: 'en',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    timezone: 'Asia/Kathmandu',
    itemsPerPage: 10,
    compactMode: false,
    showTutorials: true,
  },
  notifications: {
    email: true,
    sms: false,
    browser: false,
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
    auditLogging: false,
    dataEncryption: false,
  },
  backup: {
    autoBackup: false,
    backupFrequency: 'weekly',
    backupTime: '02:00',
    cloudStorage: false,
    retentionPeriod: 30,
    emailReports: false,
    backupLocation: '',
  },
  integrations: {
    paymentGateways: {
      stripe: { enabled: false, apiKey: '' },
      paypal: { enabled: false, clientId: '' },
      esewa: { enabled: false, merchantId: '' },
      khalti: { enabled: false, publicKey: '' },
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
};

// --- Utility to get user-specific key ---
function getUserSettingsKey(section: keyof SettingsData, userId: string) {
  return `settings_${section}_${userId}`;
}

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { state }: CompanyContextType = useCompanyStateGlobal();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Get user id (use a unique identifier, fallback to 'default')
  const userId = localStorage.getItem('userId') || 'default';

  // --- State for each settings section ---
  const [billing, setBilling] = useState<SettingsData['billing']>(() => {
    const key = getUserSettingsKey('billing', userId);
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(defaultSettings.billing));
    return defaultSettings.billing;
  });
  const [financial, setFinancial] = useState<SettingsData['financial']>(() => {
    const key = getUserSettingsKey('financial', userId);
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(defaultSettings.financial));
    return defaultSettings.financial;
  });
  const [display, setDisplay] = useState<SettingsData['display']>(() => {
    const key = getUserSettingsKey('display', userId);
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(defaultSettings.display));
    return defaultSettings.display;
  });
  const [notifications, setNotifications] = useState<SettingsData['notifications']>(() => {
    const key = getUserSettingsKey('notifications', userId);
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(defaultSettings.notifications));
    return defaultSettings.notifications;
  });
  const [security, setSecurity] = useState<SettingsData['security']>(() => {
    const key = getUserSettingsKey('security', userId);
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(defaultSettings.security));
    return defaultSettings.security;
  });
  const [backup, setBackup] = useState<SettingsData['backup']>(() => {
    const key = getUserSettingsKey('backup', userId);
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(defaultSettings.backup));
    return defaultSettings.backup;
  });
  const [integrations, setIntegrations] = useState<SettingsData['integrations']>(() => {
    const key = getUserSettingsKey('integrations', userId);
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(defaultSettings.integrations));
    return defaultSettings.integrations;
  });

  // --- Update localStorage on change ---
  const updateSection = <T,>(section: keyof SettingsData, value: T) => {
    const key = getUserSettingsKey(section, userId);
    localStorage.setItem(key, JSON.stringify(value));
    switch (section) {
      case 'billing': setBilling(value as SettingsData['billing']); break;
      case 'financial': setFinancial(value as SettingsData['financial']); break;
      case 'display': setDisplay(value as SettingsData['display']); break;
      case 'notifications': setNotifications(value as SettingsData['notifications']); break;
      case 'security': setSecurity(value as SettingsData['security']); break;
      case 'backup': setBackup(value as SettingsData['backup']); break;
      case 'integrations': setIntegrations(value as SettingsData['integrations']); break;
    }
  };

  // --- Remove old keys (e.g., 'billingSettings', 'userSettings', etc) ---
  useEffect(() => {
    const oldKeys = [
      'billingSettings', 'userSettings', 'displaySettings', 'notificationSettings',
      'securitySettings', 'backupSettings', 'integrationSettings',
    ];
    oldKeys.forEach(k => localStorage.removeItem(k));
  }, []);


  // --- Per-section onChange handlers for new settings pages ---
  const handleSectionChange = (section: keyof SettingsData, key: string, value: any) => {
    updateSection(section, {
      ...getSectionState(section),
      [key]: value,
    });
  };

  const handleNestedSectionChange = (section: keyof SettingsData, subsection: string, key: string, value: any) => {
    updateSection(section, {
      ...getSectionState(section),
      [subsection]: {
        ...(getSectionState(section) as any)[subsection],
        [key]: value,
      },
    });
  };

  // Helper to get current section state
  function getSectionState(section: keyof SettingsData) {
    switch (section) {
      case 'billing': return billing;
      case 'financial': return financial;
      case 'display': return display;
      case 'notifications': return notifications;
      case 'security': return security;
      case 'backup': return backup;
      case 'integrations': return integrations;
      default: return {};
    }
  }

  // --- Password visibility toggle for integrations ---
  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // --- Tabs for settings (with Admin/Company as first tab) ---
  const isAdmin = state?.companyID === 'all';
  const userRole = localStorage.getItem('role') || 'user';
  const settingsTabs = [
    { id: 'profile', label: isAdmin ? 'Admin Profile' : 'Company Profile', icon: isAdmin ? User : Building },
    { id: 'display', label: 'Display & UI', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing & Invoice', icon: Receipt },
    { id: 'financial', label: 'Financial', icon: Calculator },
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Settings
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Configure your preferences for the billing system
            </p>
          </div>
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-4">
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

          <div className="space-y-4">
            {activeTab === 'profile' && (
              isAdmin ? (
                <AdminSettings />
              ) : (
                <CompanySettings />
              )
            )}
            {activeTab === 'billing' && (
              <BillingSettings
                settings={billing}
                onChange={(key, value) => handleSectionChange('billing', key, value)}
              />
            )}
            {activeTab === 'financial' && (
              <FinancialSettings
                settings={financial}
                onChange={(key, value) => handleSectionChange('financial', key, value)}
              />
            )}
            {activeTab === 'display' && (
              <DisplaySettings
                settings={display}
                onChange={(key, value) => handleSectionChange('display', key, value)}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationSettings
                settings={notifications}
                onChange={(key, value) => handleSectionChange('notifications', key, value)}
              />
            )}
            {activeTab === 'security' && (
              <SecuritySettings
                settings={security}
                onChange={(key, value) => handleSectionChange('security', key, value)}
              />
            )}
            {activeTab === 'backup' && (
              <BackupSettings
                settings={backup}
                onChange={(key, value) => handleSectionChange('backup', key, value)}
                allSettings={{ billing, financial, display, notifications, security, backup, integrations }}
                onImportSettings={(imported) => {
                  // Only update non-admin/company sections
                  if (imported) {
                    if (imported.billing) updateSection('billing', imported.billing);
                    if (imported.financial) updateSection('financial', imported.financial);
                    if (imported.display) updateSection('display', imported.display);
                    if (imported.notifications) updateSection('notifications', imported.notifications);
                    if (imported.security) updateSection('security', imported.security);
                    if (imported.backup) updateSection('backup', imported.backup);
                    if (imported.integrations) updateSection('integrations', imported.integrations);
                  }
                  toast({
                    title: "Settings Imported",
                    description: "Settings have been imported successfully. Remember to save changes.",
                  });
                }}
              />
            )}
            {activeTab === 'integrations' && (
              <IntegrationSettings
                settings={integrations}
                onChange={handleNestedSectionChange}
                showPasswords={showPasswords}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex gap-6">
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
          <div className="flex-1 space-y-6">
            {activeTab === 'profile' && (
              isAdmin ? (
                <AdminSettings />
              ) : (
                <CompanySettings />
              )
            )}
            {activeTab === 'billing' && (
              <BillingSettings
                settings={billing}
                onChange={(key, value) => handleSectionChange('billing', key, value)}
              />
            )}
            {activeTab === 'financial' && (
              <FinancialSettings
                settings={financial}
                onChange={(key, value) => handleSectionChange('financial', key, value)}
              />
            )}
            {activeTab === 'display' && (
              <DisplaySettings
                settings={display}
                onChange={(key, value) => handleSectionChange('display', key, value)}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationSettings
                settings={notifications}
                onChange={(key, value) => handleSectionChange('notifications', key, value)}
              />
            )}
            {activeTab === 'security' && (
              <SecuritySettings
                settings={security}
                onChange={(key, value) => handleSectionChange('security', key, value)}
              />
            )}
            {activeTab === 'backup' && (
              <BackupSettings
                settings={backup}
                onChange={(key, value) => handleSectionChange('backup', key, value)}
                allSettings={{ billing, financial, display, notifications, security, backup, integrations }}
                onImportSettings={(imported) => {
                  if (imported) {
                    if (imported.billing) updateSection('billing', imported.billing);
                    if (imported.financial) updateSection('financial', imported.financial);
                    if (imported.display) updateSection('display', imported.display);
                    if (imported.notifications) updateSection('notifications', imported.notifications);
                    if (imported.security) updateSection('security', imported.security);
                    if (imported.backup) updateSection('backup', imported.backup);
                    if (imported.integrations) updateSection('integrations', imported.integrations);
                  }
                  toast({
                    title: "Settings Imported",
                    description: "Settings have been imported successfully. Remember to save changes.",
                  });
                }}
              />
            )}
            {activeTab === 'integrations' && (
              <IntegrationSettings
                settings={integrations}
                onChange={handleNestedSectionChange}
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
