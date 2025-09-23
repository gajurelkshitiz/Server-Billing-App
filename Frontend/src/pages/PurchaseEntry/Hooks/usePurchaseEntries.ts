import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { PurchaseEntry } from "./../types";
import { getAuthHeaders } from "@/utils/auth";
import { useNotifications } from "@/context/NotificationContext";

export function usePurchaseEntry() {
  const [purchaseEntries, setPurchaseEntries] = useState<PurchaseEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PurchaseEntry>>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    supplierID: "",
    minAmount: "",
    maxAmount: "",
  });


  const { toast } = useToast();
  const { addNotification } = useNotifications();


  const fetchPurchaseEntries = async (pageParam = page, limitParam = limit, filterParams = filters) => {
    setLoading(true);
    const baseUrl = `${import.meta.env.REACT_APP_API_URL}/purchaseEntry/`;
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
    if (filterParams.supplierID) queryParams.append('supplierID', filterParams.supplierID);
    if (filterParams.minAmount) queryParams.append('minAmount', filterParams.minAmount);
    if (filterParams.maxAmount) queryParams.append('maxAmount', filterParams.maxAmount);

    const url = `${baseUrl}?${queryParams.toString()}`;

    console.log("url for fetching purchase entries is: ", url);

    try {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('purchaseEntries from purchase entry hook is: ', data.purchaseEntries);
        setPurchaseEntries(data.purchaseEntries || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch purchase entry",
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

  useEffect(() => {
    fetchPurchaseEntries();
  }, []);

  // Handle filter changes - memoize this function
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    fetchPurchaseEntries(1, limit, newFilters); // Reset to page 1 when filters change
  }, [limit]);

  // Only fetch on page/limit changes, not on filters (filters are handled by handleFilterChange)
  useEffect(() => {
    fetchPurchaseEntries(page, limit, filters);
  }, [page, limit]);

  const addNewPurchaseEntryHandler = async () => {
    // const url = `${import.meta.env.REACT_APP_API_URL}/purchaseEntry/`;

    const baseUrl = `${import.meta.env.REACT_APP_API_URL}/purchaseEntry/`;
  
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
      if (response.ok) {
        toast({
          title: "Success",
          description: `Purchase Entry Created Successfully.`,
        });
        fetchPurchaseEntries();
        setFormData({});
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to create purchase entry: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create purchase entry",
        variant: "destructive",
      });
      return false;
    }
  };

  const updatePurchaseEntryHandler = async () => {
    try {
      console.log(`After updateHandler Call`)
      console.log(formData);
      if (!formData._id) {
      toast({
        title: "Error",
        description: "No purchase entry selected for update",
        variant: "destructive",
      });
      return false;
      }
      const response = await fetch(
      `${import.meta.env.REACT_APP_API_URL}/purchaseEntry/${formData._id}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      }
      );
      const res_data = await response.json();
      if (response.ok) {
      toast({
        title: "Success",
        description: "Purchase Entry updated successfully",
      });
      fetchPurchaseEntries();
      setFormData({});
      return true;
      } else {
      toast({
        title: "Error",
        description: `Failed to update purchase entry: ${res_data.msg}`,
        variant: "destructive",
      });
      return false;
      }
    } catch (error) {
      toast({
      title: "Error",
      description: "Failed to update purchase entry",
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
    purchaseEntries,
    loading,
    fetchPurchaseEntries,
    updatePurchaseEntryHandler,
    // deleteAdmin,
    addNewPurchaseEntryHandler,
    formData,
    setFormData,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleFilterChange, // Add this new function
    filters, // Add this to expose current filters
  };
}