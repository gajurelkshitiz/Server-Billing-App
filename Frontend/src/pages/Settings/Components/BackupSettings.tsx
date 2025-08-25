import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from "@/utils/auth";
import { CompanyContextType, useCompanyStateGlobal } from '@/provider/companyState'; // Add this import
import { 
  Database, 
  Download, 
  Upload,
  FileSpreadsheet, 
  Printer,
  FileText,
  HardDrive,
  FileJson,
  FileX
} from 'lucide-react';

interface BackupSettingsProps {
  settings: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupTime: string;
    cloudStorage: boolean;
    retentionPeriod: number;
    emailReports: boolean;
    backupLocation: string;
  };
  onChange: (key: string, value: any) => void;
  allSettings?: any;
  onImportSettings?: (settings: any) => void;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ 
  settings, 
  onChange, 
  allSettings,
  onImportSettings 
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // const { state }: CompanyContextType = useCompanyStateGlobal();
  
  // Add this line to get company state
  const { state: companyState } = useCompanyStateGlobal();

  // Export database functionality with API calls
  const exportDatabase = async (format: 'json' | 'csv' | 'excel') => {
    setIsExporting(true);
    try {
      // Build query parameters
      let queryParams = `format=${format}`;
      
      // Only add companyID if it exists and is not 'all'
      if (companyState?.companyID && companyState.companyID !== 'all') {
        queryParams += `&companyID=${companyState.companyID}`;
      }
      
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/databaseExport/files?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Handle file download
      const blob = await response.blob();
      const timestamp = new Date().toISOString().split('T')[0];
      
      let filename = '';
      
      // Include company info in filename if specific company is selected
      const companyInfo = companyState?.companyID && companyState.companyID !== 'all' 
        ? `-${companyState.companyName || companyState.companyID}` 
        : '';
      
      switch (format) {
        case 'json':
          filename = `database-json-backup${companyInfo}-${timestamp}.zip`;
          break;
        case 'csv':
          filename = `database-csv-backup${companyInfo}-${timestamp}.zip`;
          break;
        case 'excel':
          filename = `database-excel-backup${companyInfo}-${timestamp}.xlsx`;
          break;
      }

      downloadFile(blob, filename);
      
      // Show appropriate success message
      const scopeMessage = companyState?.companyID && companyState.companyID !== 'all'
        ? ` for ${companyState.companyName || 'selected company'}`
        : '';
      
      toast({
        title: "Export Complete",
        description: `Database exported successfully as ${format.toUpperCase()}${scopeMessage}.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Helper function to download files
  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import database functionality with API calls
  const importDatabase = async (file: File) => {
    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('replaceExisting', 'true'); // Add safety option
      
      const response = await fetch('/api/database/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add auth if needed
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Import failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      toast({
        title: "Import Complete",
        description: `Database imported successfully. ${result.recordsImported || 'Records'} imported.`,
      });

      // Optionally refresh the page or update state
      // window.location.reload();
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Handle file selection for import
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const supportedFormats = ['json', 'csv', 'xls', 'xlsx'];
    
    if (!supportedFormats.includes(fileExtension || '')) {
      toast({
        title: "Unsupported Format",
        description: "Please select a JSON, CSV, or Excel file.",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation dialog for dangerous operation
    const confirmed = window.confirm(
      "⚠️ WARNING: This will replace ALL existing data in your database!\n\nThis action cannot be undone. Make sure you have a backup before proceeding.\n\nDo you want to continue?"
    );

    if (confirmed) {
      importDatabase(file);
    }
    
    // Clear the input value
    event.target.value = '';
  };

  // Create complete database backup
  const createCompleteBackup = async () => {
    try {
      setIsExporting(true);
      
      const response = await fetch('/api/database/backup/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          includeSettings: true,
          includeData: true,
          compression: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Backup failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const timestamp = new Date().toISOString().split('T')[0];
      downloadFile(blob, `complete-backup-${timestamp}.json`);
      
      toast({
        title: "Backup Created",
        description: "Complete database backup created successfully.",
      });
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        title: "Backup Failed",
        description: "Failed to create database backup.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Generate system report
  const generateSystemReport = async () => {
    try {
      const response = await fetch('/api/database/report', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Report generation failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const timestamp = new Date().toISOString().split('T')[0];
      downloadFile(blob, `system-report-${timestamp}.txt`);
      
      toast({
        title: "Report Generated",
        description: "System report generated successfully.",
      });
    } catch (error) {
      console.error('Report error:', error);
      toast({
        title: "Report Failed",
        description: "Failed to generate system report.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Import/Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Database Management</span>
          </CardTitle>
          <CardDescription>
            Import or export your complete system database in multiple formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Import Section - Only show for specific company */}
          {companyState?.companyID && companyState.companyID !== 'all' && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <Label className="text-base font-medium">Import Database</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      ⚠️ Warning: This will replace ALL existing data! Create a backup first.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept=".json,.csv,.xls,.xlsx,.zip"
                      onChange={handleImportFile}
                      className="hidden"
                      id="import-database"
                      disabled={isImporting}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('import-database')?.click()}
                      disabled={isImporting}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isImporting ? "Importing..." : "Choose File"}
                    </Button>
                  </div>
                </div>
                
                {/* Supported formats info */}
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Supported formats:</strong> JSON, CSV, Excel (.xls, .xlsx), ZIP archives
                  </p>
                </div>
              </div>
              
              <Separator />
            </>
          )}

          {/* Export Section - Always show */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <Label className="text-base font-medium">Export Database</Label>
                </div>
                <p className="text-sm text-gray-500">
                  {companyState?.companyID && companyState.companyID !== 'all' 
                    ? `Export data for ${companyState.companyName || 'selected company'}`
                    : 'Export your complete database in your preferred format'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportDatabase('json')}
                  disabled={isExporting}
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "JSON"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportDatabase('csv')}
                  disabled={isExporting}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "CSV"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportDatabase('excel')}
                  disabled={isExporting}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Excel"}
                </Button>
              </div>
            </div>

            {/* Format Information */}
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <div className="text-xs text-yellow-700 space-y-1">
                <p><strong>JSON:</strong> Complete database with relationships (recommended for backup)</p>
                <p><strong>CSV:</strong> Multiple CSV files in ZIP archive (good for analysis)</p>
                <p><strong>Excel:</strong> Multiple worksheets in single file (readable format)</p>
                {companyState?.companyID && companyState.companyID !== 'all' && (
                  <p className="mt-2 font-medium">Note: Export will include data for the selected company only.</p>
                )}
                {(!companyState?.companyID || companyState.companyID === 'all') && (
                  <p className="mt-2 font-medium">Note: Export will include all data based on your permissions.</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Selection Info */}
          {(!companyState?.companyID || companyState.companyID === 'all') && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Tip:</strong> Select a specific company from the dropdown to enable import functionality and company-specific exports.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Backup Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure automatic backups and data retention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Automatic Backup</Label>
                <p className="text-sm text-gray-500">Automatically backup your data</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => onChange('autoBackup', checked)}
              />
            </div>

            {settings.autoBackup && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select value={settings.backupFrequency} onValueChange={(value) => onChange('backupFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Time</Label>
                    <Input
                      type="time"
                      value={settings.backupTime}
                      onChange={(e) => onChange('backupTime', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Retention Period (days)</Label>
                    <Select value={settings.retentionPeriod.toString()} onValueChange={(value) => onChange('retentionPeriod', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Location</Label>
                    <Select value={settings.backupLocation} onValueChange={(value) => onChange('backupLocation', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local Storage</SelectItem>
                        <SelectItem value="cloud">Cloud Storage</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cloud Storage</Label>
                      <p className="text-sm text-gray-500">Store backups in cloud storage</p>
                    </div>
                    <Switch
                      checked={settings.cloudStorage}
                      onCheckedChange={(checked) => onChange('cloudStorage', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Reports</Label>
                      <p className="text-sm text-gray-500">Send backup status via email</p>
                    </div>
                    <Switch
                      checked={settings.emailReports}
                      onCheckedChange={(checked) => onChange('emailReports', checked)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Operations</CardTitle>
          <CardDescription>
            Perform manual backup and export operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={createCompleteBackup}
              disabled={isExporting}
            >
              <HardDrive className="h-4 w-4 mr-2" />
              {isExporting ? "Creating..." : "Create Complete Backup"}
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={generateSystemReport}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate System Report
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Configuration
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => exportDatabase('json')}
              disabled={isExporting}
            >
              <Database className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export All Data"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupSettings;