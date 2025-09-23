import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/context/NotificationContext";
import { Supplier } from "./types";
import { getAuthHeaders } from "@/utils/auth";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    minBalance: "",
    maxBalance: "",
    email: "",
  });

  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Updated fetchSuppliers with pagination and filters
  const fetchSuppliers = async (
    pageParam = page,
    limitParam = limit,
    filterParams = filters
  ) => {
    setLoading(true);
    const baseUrl = `${import.meta.env.REACT_APP_API_URL}/supplier/`;

    // Read role and optionally companyId from localStorage
    const role = localStorage.getItem("role");
    const isAdmin = role === "admin";
    const companyID = localStorage.getItem("companyID");

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: pageParam.toString(),
      limit: limitParam.toString(),
    });

    // Add company ID
    if (isAdmin && companyID) {
      queryParams.append("companyID", companyID);
    }

    // Add filter parameters
    if (filterParams.search) queryParams.append("search", filterParams.search);
    if (filterParams.status) queryParams.append("status", filterParams.status);
    if (filterParams.email) queryParams.append("email", filterParams.email);
    if (filterParams.minBalance) queryParams.append("minBalance", filterParams.minBalance);
    if (filterParams.maxBalance) queryParams.append("maxBalance", filterParams.maxBalance);

    const url = `${baseUrl}?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data.suppliers || []);
        setTotalPages(data.pages || 1);
        return data.suppliers;
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch suppliers",
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
    fetchSuppliers(1, limit, newFilters); // Reset to page 1 when filters change
  }, [limit]);

  // Only fetch on page/limit changes, not on filters (filters are handled by handleFilterChange)
  useEffect(() => {
    fetchSuppliers(page, limit, filters);
  }, [page, limit]);

  const addNewSupplierHandler = async () => {
    const url = `${import.meta.env.REACT_APP_API_URL}/supplier/`;  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      const res_data = await response.json();
      console.log(`Response Data from server after supplier create: `);
      console.log(res_data);

      if (response.ok) {
        toast({
          title: "Success",
          description: `Supplier Created Successfully.`,
        });

        // Add notification for successful supplier creation
        addNotification({
          title: 'Supplier Added',
          message: `Supplier "${formData.name}" has been successfully created.`,
          type: 'success'
        });

        fetchSuppliers();
        setFormData({})
        // TODO: close the model
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to create supplier: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create supplier",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSupplierHandler = async () => {
    try {
      console.log(`After updateHandler Call`)
      console.log(formData);
      if (!formData._id) {
      toast({
        title: "Error",
        description: "No supplier selected for update",
        variant: "destructive",
      });
      return false;
      }
      const response = await fetch(
      `${import.meta.env.REACT_APP_API_URL}/supplier/${formData._id}`,
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
        description: "Admin updated successfully",
      });
      fetchSuppliers();
      setFormData({});
      return true;
      } else {
      toast({
        title: "Error",
        description: `Failed to update supplier: ${res_data.msg}`,
        variant: "destructive",
      });
      return false;
      }
    } catch (error) {
      toast({
      title: "Error",
      description: "Failed to update supplier",
      variant: "destructive",
      });
      return false;
    }
  };

  const deleteSupplier = async (supplier: Supplier) => {
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/supplier/${supplier._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        toast({ title: "Success", description: "Supplier deleted successfully" });
        fetchSuppliers();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete supplier",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    }
  };

  return {
    suppliers,
    loading,
    fetchSuppliers,
    updateSupplierHandler,
    deleteSupplier,
    addNewSupplierHandler,
    formData,
    setFormData,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleFilterChange,
    filters,
    setFilters,
  };
}
