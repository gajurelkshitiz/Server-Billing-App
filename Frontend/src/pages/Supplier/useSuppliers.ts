import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Supplier } from "./types";
import { format } from "path";
import { getAuthHeaders } from "@/utils/auth";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  const { toast } = useToast();

  // const getAuthHeaders = () => {
  //   const token = localStorage.getItem("token");
  //   const role = localStorage.getItem("role");
    
  //   if (!token) {
  //     throw new Error("No authentication token found");
  //   }
    
  //   return {
  //     Authorization: `Bearer ${token}`,
  //     "Content-Type": "application/json",
  //     "X-Role": role || "",
  //   };
  // };

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/supplier/`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data.suppliers || []);
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

  useEffect(() => {
    fetchSuppliers();
  }, []);

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
    updateSupplierHandler,
    deleteSupplier,
    addNewSupplierHandler,
    formData,
    setFormData
  };
}
