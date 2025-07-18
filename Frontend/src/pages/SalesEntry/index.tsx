import React, { useEffect, useState, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import SalesEntryFormModal from "./Form/SalesEntryFormModal";
import { useSalesEntry } from "./Hooks/useSalesEntries";
import { SalesEntry } from "./types";
import SalesEntryTable from "./SalesEntryPage";
import { useCompanyStateGlobal, CompanyContextType } from "@/provider/companyState";
import { useNavigate } from "react-router-dom";
import { Upload } from 'lucide-react';
import ImportPreview from "@/components/ImportPreview/ImportPreview";

interface ImportRow {
  index: number;
  data: any;
  isValid: boolean;
  errors: string[];
}

const SalesEntryPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    salesEntries,
    loading,
    updateSalesEntryHandler,
    addNewSalesEntryHandler,
    formData,
    setFormData,
  } = useSalesEntry();

  const { state, dispatch }: CompanyContextType = useCompanyStateGlobal();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (state.companyID == 'all' && state.companyID) {
      navigate('/dashboard');
    }
  }, [state.companyID]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSalesEntry, setEditingSalesEntry] = useState<boolean>(false);
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingSalesEntry(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (salesEntry: SalesEntry) => {
    setEditingSalesEntry(true);
    setFormData(salesEntry);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this Subscription?")) {
      // await deleteSubscription(subscription);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    if (name === "billNo" && typeof value === "string") {
      const isDuplicate = salesEntries.some(entry => 
        entry.billNo === value && 
        (!editingSalesEntry || entry._id !== formData._id)
      );
      
      if (isDuplicate) {
        toast({
          title: "Validation Error",
          description: "Bill number already exists. Please use a unique bill number.",
          variant: "destructive",
        });
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (editingSalesEntry) {
      await updateSalesEntryHandler();
      setIsModalOpen(false);
    } else {
      console.log(formData);
      await addNewSalesEntryHandler();
      setIsModalOpen(false);
    }
  };

  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const validateRowData = (data: any, index: number, allRows: any[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Map Excel column names to expected field names
    const billNo = data.Bill_No || data.billNo;
    const customerName = data.CustomerName || data.customerName;
    const amount = data.Amount || data.amount;
    
    // Basic validation
    if (!billNo || billNo.toString().trim() === '') {
      errors.push('Bill number is required');
    }
    
    if (!customerName || customerName.toString().trim() === '') {
      errors.push('Customer name is required');
    }
    
    if (!amount || isNaN(parseFloat(amount))) {
      errors.push('Valid amount is required');
    }
    
    // Check for duplicate bill numbers in existing sales entries
    if (billNo) {
      const isDuplicateInSystem = salesEntries.some(entry => 
        entry.billNo === billNo.toString().trim()
      );
      if (isDuplicateInSystem) {
        errors.push('Bill number already exists in the system');
      }

      // Check for duplicate bill numbers within the imported data itself
      // Only mark as duplicate if this is NOT the first occurrence
      const firstOccurrenceIndex = allRows.findIndex((row, rowIndex) => {
        const rowBillNo = row.Bill_No || row.billNo;
        return rowBillNo && rowBillNo.toString().trim() === billNo.toString().trim();
      });
      
      if (firstOccurrenceIndex !== -1 && firstOccurrenceIndex !== index) {
        errors.push('Bill number is duplicated within the import file');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCurrentFile(file);
    setImportLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const baseUrl = `${import.meta.env.REACT_APP_API_URL}/salesEntry/import/excel`;
      const role = localStorage.getItem("role");
      const isAdmin = role === "admin";
      const companyID = localStorage.getItem('companyID');

      // Add preview parameter
      let url = `${baseUrl}?preview=true`;
      if (isAdmin && companyID) {
        url += `&companyID=${encodeURIComponent(companyID)}`;
      }

      console.log('Making request to:', url);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Role": localStorage.getItem("role") || "",
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Preview failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Preview result:', result);
      
      // Check if result has the expected structure
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Invalid response format - expected data array");
      }
      
      // Process the data and validate each row - pass all rows for duplicate checking
      const processedRows: ImportRow[] = result.data.map((rowData: any, index: number) => {
        const validation = validateRowData(rowData, index, result.data);
        return {
          index,
          data: rowData,
          isValid: validation.isValid,
          errors: validation.errors
        };
      });

      console.log('Processed rows with validation:', processedRows);
      setImportRows(processedRows);
      setIsImportPreviewOpen(true);
    } catch (error) {
      console.error('Full error details:', error);
      toast({
        title: "Preview Failed",
        description: error instanceof Error ? error.message : "There was an error processing the file.",
        variant: "destructive",
      });
    } finally {
      setImportLoading(false);
    }
  };

  const handleImportConfirm = async (importType: 'all' | 'partial') => {
    if (!currentFile) return;

    setImportLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", currentFile);
      
      if (importType === 'partial') {
        const validRows = importRows.filter(row => row.isValid);
        console.log('validRows inside partially correct form data: ', validRows);
        formData.append("rowIndexes", JSON.stringify(validRows.map(row => row.index)));

        console.log('for partial submission formData is: ', formData);
      }

      const baseUrl = `${import.meta.env.REACT_APP_API_URL}/salesEntry/import/excel`;
      const role = localStorage.getItem("role");
      const isAdmin = role === "admin";
      const companyID = localStorage.getItem('companyID');

      // Remove preview parameter for actual import
      let url = baseUrl;
      if (isAdmin && companyID) {
        url += `?companyID=${encodeURIComponent(companyID)}`;
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Role": localStorage.getItem("role") || "",
        },
      });

      if (!response.ok) throw new Error("Import failed");

      const validCount = importType === 'all' ? importRows.length : importRows.filter(row => row.isValid).length;
      
      toast({
        title: "Import Successful",
        description: `Successfully imported ${validCount} sales entries.`,
      });
      
      setIsImportPreviewOpen(false);
      setCurrentFile(null);
      setImportRows([]);
      
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "There was an error importing the data.",
        variant: "destructive",
      });
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Sales Entry Management
        </h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition"
          onClick={handleImport}
          disabled={importLoading}
        >
          <Upload size={18} /> Import
        </button>
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {importLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading Import Preview...</p>
          </div>
        </div>
      )}

      {!importLoading && (
        <SalesEntryTable
          data={salesEntries}
          loading={loading}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}

      <SalesEntryFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingSalesEntry={editingSalesEntry}
        title={
          editingSalesEntry
            ? "Edit Sales Entry"
            : "Add New Sales Entry"
        }
      />

      <ImportPreview
        isOpen={isImportPreviewOpen}
        onClose={() => {
          setIsImportPreviewOpen(false);
          setCurrentFile(null);
          setImportRows([]);
        }}
        rows={importRows}
        onImportAll={() => handleImportConfirm('all')}
        onImportPartial={() => handleImportConfirm('partial')}
        loading={importLoading}
        title="Sales Entry"
      />
    </div>
  );
};

export default SalesEntryPage;
