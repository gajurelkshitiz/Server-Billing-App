import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/utils/auth";

export function useSalesDueList() {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    customerName: "",
    minDue: "",
    maxDue: "",
    minSales: "",
    maxSales: "",
    lastSaleDateFrom: "",
    lastSaleDateTo: "",
    lastPaymentDateFrom: "",
    lastPaymentDateTo: "",
    status: "",
    quickFilter: "",
    dueRatio: "",
    inactiveDays: "",
  });

  const { toast } = useToast();

  // Fetch customer complete data with filters and pagination
  const fetchCustomerCompleteData = async (pageParam = page, limitParam = limit, filterParams = filters) => {
    setLoading(true);
    const companyID = localStorage.getItem('companyID');
    const baseUrl = `${import.meta.env.REACT_APP_API_URL}/due/getAllCustomerCompleteData`;

    // Build query parameters
    const queryParams = new URLSearchParams({
      companyID: companyID || '',
      page: pageParam.toString(),
      limit: limitParam.toString(),
    });

    // Add filter parameters
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${baseUrl}?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) throw new Error("Failed to fetch customer Data");
      
      const data = await response.json();
      setCustomerData(data.customers || []);
      setTotalPages(data.pages || 1);
      return data.customers;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customer data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes - memoize this function
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    fetchCustomerCompleteData(1, limit, newFilters); // Reset to page 1 when filters change
  }, [limit]);

  // Only fetch on page/limit changes, not on filters (filters are handled by handleFilterChange)
  useEffect(() => {
    fetchCustomerCompleteData(page, limit, filters);
  }, [page, limit]);

  // Apply quick filters
  const applyQuickFilter = useCallback((quickFilterType: string) => {
    const newFilters = { ...filters, quickFilter: quickFilterType };
    setFilters(newFilters);
    fetchCustomerCompleteData(1, limit, newFilters);
  }, [filters, limit]);

  return {
    customerData,
    loading,
    fetchCustomerCompleteData,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleFilterChange,
    filters,
    applyQuickFilter,
  };
}