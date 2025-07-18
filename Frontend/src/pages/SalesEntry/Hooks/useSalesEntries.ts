import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { SalesEntry } from "./../types";
import { getAuthHeaders } from "@/utils/auth";

export function useSalesEntry() {
  const [salesEntries, setSalesEntries] = useState<SalesEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<SalesEntry>>({});

  const { toast } = useToast();

  const fetchSalesEntries = async () => {
    setLoading(true);
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
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSalesEntries(data.salesEntries || []);
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

  useEffect(() => {
    fetchSalesEntries();
  }, []);

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
    // deleteAdmin,
    addNewSalesEntryHandler,
    formData,
    setFormData
  };
}