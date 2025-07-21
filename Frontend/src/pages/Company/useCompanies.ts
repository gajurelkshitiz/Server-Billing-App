import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/context/NotificationContext";
import { Company } from "./types";
import { useCompanyContext } from "@/context/CompanyContext";
import { getAuthHeaders } from "@/utils/auth";

export function useCompany() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({});
  
  const { company, setCompany } = useCompanyContext(); // context only

  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // const getAuthHeaders = () => ({
  //   Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   "Content-Type": "application/json",
  //   "X-Role": localStorage.getItem("role") || "",
  // });

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/company/`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setCompany(data.companies || []);
        return data.companies || [];
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch companies",
          variant: "destructive",
        });
        return [];
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addNewCompanyHandler = async () => {
    const url = `${import.meta.env.REACT_APP_API_URL}/company/`;
    try {
      const form = new FormData();
      // Append all fields to FormData
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null) {
          form.append(key, formData[key]);
        }
      }
      console.log('inside add new company handler formData is: ', form);

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
          description: `Company Created Successfully.`,
        });

        // Add notification for successful company creation
        addNotification({
          title: 'Company Created',
          message: `Company "${formData.name}" has been successfully created and is ready for use.`,
          type: 'success'
        });

        setFormData({})
        // Refresh companies list after successful creation
        await fetchCompanies();
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to create Company: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create Company",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCompanyHandler = async () => {
    console.log('formData before update handler', formData);
    
    try {
      if (!formData._id) {
        toast({
          title: "Error",
          description: "No Company selected for update",
          variant: "destructive",
        });
        return false;
      }

      // Create FormData just like addNewCompanyHandler
      const form = new FormData();
      // Append all fields to FormData
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null) {
          form.append(key, formData[key]);
        }
      }

      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/company/${formData._id}`,
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
          description: "Company updated successfully",
        });
        fetchCompanies();
        setFormData({});
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to update Company: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update Company",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCompany = async (company: Company) => {
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/company/${company._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        toast({ title: "Success", description: "Company deleted successfully" });
        fetchCompanies();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete company",
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
    company, // context state only
    loading,
    updateCompanyHandler,
    deleteCompany,
    addNewCompanyHandler,
    formData,
    setFormData,
    setCompany, // expose for parent to update
  };
}