import React, { useEffect, useState, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import SalesEntryFormModal from "./Form/PurchaseEntryFormModal";
import { usePurchaseEntry } from "./Hooks/usePurchaseEntries";
import { PurchaseEntry } from "./types";
import PurchaseEntryTable from "./PurchaseEntryPage";
import { useCompanyStateGlobal, CompanyContextType } from "@/provider/companyState";
import { useNavigate } from "react-router-dom";
import { Upload } from 'lucide-react';
import ImportPreview from "@/components/ImportPreview/ImportPreview";
import BillPreviewModal from "@/components/common/BillPreviewModal";

interface ImportRow {
  index: number;
  data: {
    SupplierName: string;
    Bill_No: string;
    Bill_Date: string;
    Amount: number;
    Item_Description: string;
    Net_Total_Amount: number;  // change this to :: "Net_Due_Amount"
    Bill_Attachment: string;
    Discount?: number;
    Discount_Type?: string;
    VAT?: number;
  };
  isValid: boolean;
  errors: string[];
}

const ComputerizedPurchaseEntryPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    purchaseEntries,
    loading,
    updatePurchaseEntryHandler,
    addNewPurchaseEntryHandler,
    formData,
    setFormData,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleFilterChange, // Add this
    filters, // Add this
    // fetchSalesEntries, // Add fetchSalesEntries here
    isImportPreviewOpen,
    setIsImportPreviewOpen,
    importRows,
    setImportRows,
    importLoading,
    // setImportLoading,
    // currentFile,
    setCurrentFile,
    handleImportPreview,
    handleImportConfirm,
  } = usePurchaseEntry();

  const { state, dispatch }: CompanyContextType = useCompanyStateGlobal();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (state.companyID == 'all' && state.companyID) {
      navigate('/home/dashboard');
    }
  }, [state.companyID]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchaseEntry, setEditingPurchaseEntry] = useState<boolean>(false);
  // const [importLoadingLocal, setImportLoadingLocal] = useState(false);
  // const [currentFileLocal, setCurrentFileLocal] = useState<File | null>(null);
  const { toast } = useToast();
  const [isBillPreviewOpen, setIsBillPreviewOpen] = useState(false);
  const [previewPurchaseEntryId, setPreviewPurchaseEntryId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingPurchaseEntry(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (purchaseEntry: PurchaseEntry) => {
    setEditingPurchaseEntry(true);
    setFormData(purchaseEntry);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this Subscription?")) {
      // await deleteSubscription(subscription);
    }
  };

  const handleInputChange = (name: string, value: string) => {

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let newId = null;
    if (editingPurchaseEntry) {
      await updatePurchaseEntryHandler();
      setIsModalOpen(false);
    } 
    else {
      const result = await addNewPurchaseEntryHandler();
      // If addNewSalesEntryHandler returns the new entry or its ID, use it. Otherwise, fetch the latest entry.
      if (result) {
        newId = result.computerizedPurchaseEntry._id;
      } else if (purchaseEntries.length > 0) {  // this will not get updated, so shows the previous code: its a bug as of now:
        // newId = salesEntries[0]._id; // fallback: show the latest
        console.log('Purchase Entries: ', purchaseEntries);
        newId = purchaseEntries[purchaseEntries.length - 1]._id; // fallback: show the latest
      }
      setIsModalOpen(false);
      if (newId) {
        setPreviewPurchaseEntryId(newId);
        setIsBillPreviewOpen(true);
      }
    }
  };

  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Replace the existing validateRowData function with backend validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImportPreview(file);
  };

  // const handleImportConfirmLocal = async (importType: 'all' | 'partial') => {
  //   try {
  //     if (!currentFileLocal) return;

  //     setImportLoadingLocal(true);
      
  //     const formData = new FormData();
  //     formData.append("file", currentFileLocal);
      
  //     if (importType === 'partial') {
  //       const validRows = importRows.filter(row => row.isValid);
  //       console.log('validRows inside partially correct form data: ', validRows);
  //       formData.append("rowIndexes", JSON.stringify(validRows.map(row => row.index)));

  //       console.log('for partial submission formData is: ', formData);
  //     }

  //     const baseUrl = `${import.meta.env.REACT_APP_API_URL}/salesEntry/import/excel`;
  //     const role = localStorage.getItem("role");
  //     const isAdmin = role === "admin";
  //     const companyID = localStorage.getItem('companyID');

  //     // Remove preview parameter for actual import
  //     let url = baseUrl;
  //     if (isAdmin && companyID) {
  //       url += `?companyID=${encodeURIComponent(companyID)}`;
  //     }

  //     const response = await fetch(url, {
  //       method: "POST",
  //       body: formData,
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         "X-Role": localStorage.getItem("role") || "",
  //       },
  //     });

  //     const result = await response.json();
  //     if (!response.ok) {
  //       throw new Error(result.error || result.message || "Import failed");
  //     }

  //     // Refresh sales entries list
  //     await fetchSalesEntries();  // Add this function from useSalesEntry hook
      
  //     toast({
  //       title: "Import Successful",
  //       description: `Successfully imported ${result.imported} out of ${result.totalRows} entries.${
  //         result.errors ? ` ${result.errors.length} errors occurred.` : ''
  //       }`,
  //     });
      
  //     setIsImportPreviewOpen(false);
  //     setCurrentFileLocal(null);
  //     setImportRows([]);
      
  //   } catch (error) {
  //     toast({
  //       title: "Import Failed",
  //       description: "There was an error importing the data.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setImportLoadingLocal(false);
  //   }
  // };

  const handlePreview = (purchaseEntryId: string) => {
    setPreviewPurchaseEntryId(purchaseEntryId);
    setIsBillPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Purchase Entry Management Computerized Version
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
        <PurchaseEntryTable
          data={purchaseEntries}
          loading={loading}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          totalPages={totalPages}
          onFilterChange={handleFilterChange} // Add this
          currentFilters={filters} // Add this
          onPreview={handlePreview} // pass preview handler
        />
      )}
      
      
        <SalesEntryFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingPurchaseEntry={editingPurchaseEntry}
        title={
          editingPurchaseEntry
            ? "Edit Purchase Entry"
            : "Add New Purchase Entry"
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
        title="Purchase Entry Import Preview"
        columns={[
          { 
            header: 'Supplier Name', 
            accessor: (row: ImportRow) => row.data.SupplierName 
          },
          { 
            header: 'Bill No', 
            accessor: (row: ImportRow) => row.data.Bill_No 
          },
          { 
            header: 'Date', 
            accessor: (row: ImportRow) => row.data.Bill_Date 
          },
          { 
            header: 'Amount', 
            accessor: (row: ImportRow) => row.data.Amount.toString() 
          },
          { 
            header: 'Description', 
            accessor: (row: ImportRow) => row.data.Item_Description 
          },
          { 
            header: 'Net Total', 
            accessor: (row: ImportRow) => row.data.Net_Total_Amount.toString() 
          },
          { 
            header: 'Attachment', 
            accessor: (row: ImportRow) => row.data.Bill_Attachment 
          },
          {
            header: 'Status',
            accessor: (row: ImportRow) => row.isValid ? 'Valid' : 'Invalid'
          },
          {
            header: 'Errors',
            accessor: (row: ImportRow) => row.errors.join(', ')
          }
        ]}
      />
      <BillPreviewModal
        isOpen={isBillPreviewOpen}
        onClose={() => setIsBillPreviewOpen(false)}
        entryId={previewPurchaseEntryId || ''}
        title="Bill Preview"
        type="purchase"
      />
    </div>
  );
};

export default ComputerizedPurchaseEntryPage;
