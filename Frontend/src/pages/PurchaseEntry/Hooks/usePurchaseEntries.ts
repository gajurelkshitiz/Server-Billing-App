import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PurchaseEntry } from "./../types";

export function usePurchaseEntry() {
  const [purchaseEntries, setPurchaseEntries] = useState<PurchaseEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PurchaseEntry>>({});

  const { toast } = useToast();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    "X-Role": localStorage.getItem("role") || "",
  });

  const fetchPurchaseEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/purchaseEntry/`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
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
    setFormData
  };
}