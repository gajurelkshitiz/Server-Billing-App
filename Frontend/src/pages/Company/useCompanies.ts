import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Company } from "./types";
import { useCompanyContext } from "@/context/CompanyContext";
import { getAuthHeaders } from "@/utils/auth";

export function useCompany() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({});
  
  const { company, setCompany } = useCompanyContext(); // context only

  const { toast } = useToast();

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
      const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      const res_data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Company Created Successfully.`,
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
    try {
      if (!formData._id) {
        toast({
          title: "Error",
          description: "No Company selected for update",
          variant: "destructive",
        });
        return false;
      }
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/company/${formData._id}`,
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
          description: "Company updated successfully",
        });
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