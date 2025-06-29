import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FiscalYear } from "./types";

export function useFiscalYear() {
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<FiscalYear>>({});

  const { toast } = useToast();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    "X-Role": localStorage.getItem("role") || "",
  });

  const fetchFiscalYears = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/fiscalYear/`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setFiscalYears(data.fiscalYears || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch Fiscal Years",
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
    fetchFiscalYears();
  }, []);

  const addNewFiscalYearHandler = async () => {
    const url = `${import.meta.env.REACT_APP_API_URL}/fiscalYear/`;
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
          description: `FiscalYear Created Successfully.`,
        });
        fetchFiscalYears();
        setFormData({})
        // TODO: close the model
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to create fiscalYear: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create fiscalYear",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateFiscalYearHandler = async () => {
    try {
      if (!formData._id) {
      toast({
        title: "Error",
        description: "No FiscalYear selected for update",
        variant: "destructive",
      });
      return false;
      }
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/fiscalYear/${formData._id}`,
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
        description: "Fiscal Year updated successfully",
      });
      fetchFiscalYears();
      setFormData({});
      return true;
      } else {
      toast({
        title: "Error",
        description: `Failed to update fiscalYear: ${res_data.msg}`,
        variant: "destructive",
      });
      return false;
      }
    } catch (error) {
      toast({
      title: "Error",
      description: "Failed to update fiscalYear",
      variant: "destructive",
      });
      return false;
    }
  };

  // const deleteAdmin = async (fiscalYear: FiscalYear) => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.REACT_APP_API_URL}/admin/${fiscalYear._id}`,
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
    fiscalYears,
    loading,
    updateFiscalYearHandler,
    // deleteAdmin,
    addNewFiscalYearHandler,
    formData,
    setFormData
  };
}