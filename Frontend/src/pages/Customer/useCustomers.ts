import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/context/NotificationContext";
import { Customer } from "./types";
import { getAuthHeaders } from "@/utils/auth";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({});
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

  // Fetch customers with filters and pagination
  const fetchCustomers = async (pageParam = page, limitParam = limit, filterParams = filters) => {
    setLoading(true);
    const baseUrl = `${import.meta.env.REACT_APP_API_URL}/customer/`;

    // Read role and optionally companyId from localStorage
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
    if (filterParams.search) queryParams.append('search', filterParams.search);
    if (filterParams.status) queryParams.append('status', filterParams.status);
    if (filterParams.email) queryParams.append('email', filterParams.email);
    if (filterParams.minBalance) queryParams.append('minBalance', filterParams.minBalance);
    if (filterParams.maxBalance) queryParams.append('maxBalance', filterParams.maxBalance);

    const url = `${baseUrl}?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
        setTotalPages(data.pages || 1);
        return data.customers;
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch Customers",
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
    fetchCustomers(1, limit, newFilters); // Reset to page 1 when filters change
  }, [limit]);

  // Only fetch on page/limit changes, not on filters (filters are handled by handleFilterChange)
  useEffect(() => {
    fetchCustomers(page, limit, filters);
  }, [page, limit]);

  const addNewCustomerHandler = async () => {
    const url = `${import.meta.env.REACT_APP_API_URL}/customer/`;  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      const res_data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Customer Created Successfully.`,
        });

        // Add notification for successful customer creation
        addNotification({
          title: 'Customer Added',
          message: `Customer "${formData.name}" has been successfully created.`,
          type: 'success'
        });

        fetchCustomers();
        setFormData({});
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to create customer: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCustomerHandler = async () => {
    try {
      if (!formData._id) {
        toast({
          title: "Error",
          description: "No customer selected for update",
          variant: "destructive",
        });
        return false;
      }
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/customer/${formData._id}`,
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
          description: "Customer updated successfully",
        });

        // Add notification for successful customer update
        addNotification({
          title: 'Customer Updated',
          message: `Customer "${formData.name}" has been successfully updated.`,
          type: 'success'
        });

        fetchCustomers();
        setFormData({});
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to update Customer: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update Customer",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCustomer = async (customer: Customer) => {
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/customer/${customer._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        toast({ title: "Success", description: "Customer deleted successfully" });
        
        // Add notification for successful customer deletion
        addNotification({
          title: 'Customer Removed',
          message: `Customer "${customer.name}" has been successfully deleted.`,
          type: 'info'
        });

        fetchCustomers();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete Customer",
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
    customers,
    loading,
    fetchCustomers,
    updateCustomerHandler,
    deleteCustomer,
    addNewCustomerHandler,
    formData,
    setFormData,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleFilterChange,
    filters,
  };
}
