import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/context/NotificationContext";
import { SalesEntry } from "./../types";
import { getAuthHeaders } from "@/utils/auth";

export interface ImportRow {
  index: number;
  data: {
    CustomerName: string;
    Bill_No: string;
    Bill_Date: string;
    Amount: number;
    Item_Description: string;
    Net_Total_Amount: number;
    Bill_Attachment: string;
    Discount?: number;
    Discount_Type?: string;
    VAT?: number;
  };
  isValid: boolean;
  errors: string[];
}

export function useSalesEntry() {
  // Existing state
  const [salesEntries, setSalesEntries] = useState<SalesEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<SalesEntry>>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    customerID: "",
    minAmount: "",
    maxAmount: "",
  });

  // Import-related state
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Fetch sales entries with filters
  const fetchSalesEntries = async (pageParam = page, limitParam = limit, filterParams = filters) => {
    setLoading(true);
    const baseUrl = `${import.meta.env.REACT_APP_API_URL}/salesEntry/`;
    const role = localStorage.getItem("role");
    const isAdmin = role === "admin";
    const companyID = localStorage.getItem('companyID'); 

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: pageParam.toString(),
      limit: limitParam.toString(),
    });

    // Add company ID
    if (isAdmin && companyID) {
      queryParams.append('companyID', companyID);
    }

    // Add filter parameters
    if (filterParams.startDate) queryParams.append('startDate', filterParams.startDate);
    if (filterParams.endDate) queryParams.append('endDate', filterParams.endDate);
    if (filterParams.customerID) queryParams.append('customerID', filterParams.customerID);
    if (filterParams.minAmount) queryParams.append('minAmount', filterParams.minAmount);
    if (filterParams.maxAmount) queryParams.append('maxAmount', filterParams.maxAmount);

    const url = `${baseUrl}?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setSalesEntries(data.salesEntries || []);
        setTotalPages(data.pages || 1);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch sales entries",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes - memoize this function
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    fetchSalesEntries(1, limit, newFilters); // Reset to page 1 when filters change
  }, [limit]);

  // Only fetch on page/limit changes, not on filters (filters are handled by handleFilterChange)
  useEffect(() => {
    fetchSalesEntries(page, limit, filters);
  }, [page, limit]);

  // --- IMPORT FUNCTIONALITY ---

  // Preview import
  const handleImportPreview = async (file: File) => {
    setCurrentFile(file);
    setImportLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const baseUrl = `${import.meta.env.REACT_APP_API_URL}/salesEntry/import/excel`;
      const role = localStorage.getItem("role");
      const isAdmin = role === "admin";
      const companyID = localStorage.getItem('companyID');

      let url = `${baseUrl}?preview=true`;
      if (isAdmin && companyID) {
        url += `&companyID=${encodeURIComponent(companyID)}`;
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Role": role || "",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Preview failed');
      }

      const result = await response.json();

      // Transform backend response to match ImportRow interface
      const processedRows: ImportRow[] = result.data.map((row: any, index: number) => ({
        index,
        data: row,
        isValid: !result.errors.some((error: string) => 
          error.startsWith(`Row ${index + 2}:`)
        ),
        errors: result.errors
          .filter((error: string) => error.startsWith(`Row ${index + 2}:`))
          .map((error: string) => error.split(': ')[1])
      }));

      setImportRows(processedRows);
      setIsImportPreviewOpen(true);

      // Show preview summary
      if (result.validRecords === result.totalRows) {
        toast({
          title: "Preview Complete",
          description: `${result.validRecords} valid records out of ${result.totalRows} total rows.`
        });
      } else {
        toast({
          title: "Preview Complete",
          description: `${result.validRecords} valid records out of ${result.totalRows} total rows.`,
          variant: "destructive"
        });
      }

    } catch (error) {
      toast({
        title: "Preview Failed",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setImportLoading(false);
    }
  };

  // Confirm import (all or partial)
  const handleImportConfirm = async (importType: 'all' | 'partial') => {
    try {
      if (!currentFile) return;

      setImportLoading(true);

      const formData = new FormData();
      formData.append("file", currentFile);

      if (importType === 'partial') {
        const validRows = importRows.filter(row => row.isValid);
        formData.append("rowIndexes", JSON.stringify(validRows.map(row => row.index)));
      }

      const baseUrl = `${import.meta.env.REACT_APP_API_URL}/salesEntry/import/excel`;
      const role = localStorage.getItem("role");
      const isAdmin = role === "admin";
      const companyID = localStorage.getItem('companyID');

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

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || result.message || "Import failed");
      }

      // Refresh sales entries list
      await fetchSalesEntries();

      toast({
        title: "Import Successful",
        description: `Successfully imported ${result.imported} out of ${result.totalRows} entries.${
          result.errors ? ` ${result.errors.length} errors occurred.` : ''
        }`,
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

  // --- END IMPORT FUNCTIONALITY ---

  const addNewSalesEntryHandler = async () => {
    // const url = `${import.meta.env.REACT_APP_API_URL}/salesEntry/`;

    const baseUrl = `${import.meta.env.REACT_APP_API_URL}/salesEntry/`;
  
    // Read role and optionally companyId from formData or another source
    const role = localStorage.getItem("role");
    const isAdmin = role === "admin";
    const companyID = localStorage.getItem('companyID'); 

    // Build the URL based on role
    const url = isAdmin && companyID
      ? `${baseUrl}?companyID=${encodeURIComponent(companyID)}`
      : baseUrl;

    try {
      const form = new FormData();
      // Append all fields to FormData
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null) {
          form.append(key, formData[key]);
        }
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Role": localStorage.getItem("role") || "",
          // Do NOT set Content-Type, browser will set it for FormData
        },
        body: form,
      });
      const res_data = await response.json();
      console.log(res_data);
      if (response.ok) {
        toast({
          title: "Success",
          description: `Sales Entry Created Successfully.`,
        });

        // Add notification for successful sales entry creation
        addNotification({
          title: 'New Sale Recorded',
          message: `Sales entry has been successfully created and saved to the system.`,
          type: 'success'
        });

        fetchSalesEntries();
        setFormData({});
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to create sales entry: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create sales entry",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSalesEntryHandler = async () => {
    try {
      console.log(`After updateHandler Call`)
      console.log(formData);
      if (!formData._id) {
        toast({
          title: "Error",
          description: "No sales entry selected for update",
          variant: "destructive",
        });
        return false;
      }

      // Create FormData for file upload (same as in addNewSalesEntryHandler)
      const form = new FormData();
      // Append all fields to FormData
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null && key !== '_id') {
          form.append(key, formData[key]);
        }
      }

      console.log('filled form for update', form);

      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/salesEntry/${formData._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Role": localStorage.getItem("role") || "",
            // Do NOT set Content-Type, browser will set it for FormData
          },
          body: form, // Use FormData instead of JSON.stringify
        }
      );
      const res_data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Sales Entry updated successfully",
        });
        fetchSalesEntries();
        setFormData({});
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to update sales entry: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update sales entry",
        variant: "destructive",
      });
      return false;
    }
  };

  // const deleteAdmin = async (subscription: Subscription) => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.REACT_APP_API_URL}/admin/${subscription._id}`,
  //       {
  //         method: "DELETE",
  //         headers: getAuthHeaders(),
  //       }
  //     );
  //     if (response.ok) {
  //       toast({ title: "Success", description: "Admin deleted successfully" });
  //       fetchAdmins();
  //     } else {
  //       toast({
  //         title: "Error",
  //         description: "Failed to delete admin",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch {
  //     toast({
  //       title: "Error",
  //       description: "Failed to connect to server",
  //       variant: "destructive",
  //     });
  //   }
  // };

  return {
    salesEntries,
    loading,
    fetchSalesEntries,
    updateSalesEntryHandler,
    addNewSalesEntryHandler,
    formData,
    setFormData,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleFilterChange, // Add this new function
    filters, // Add this to expose current filters

    // Import-related state and handlers
    isImportPreviewOpen,
    setIsImportPreviewOpen,
    importRows,
    setImportRows,
    importLoading,
    setImportLoading,
    currentFile,
    setCurrentFile,
    handleImportPreview,
    handleImportConfirm,
  };
}