import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "./types";
import { format } from "path";
import { getAuthHeaders } from "@/utils/auth";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({});

  const { toast } = useToast();

  const fetchCustomers = async () => {
    setLoading(true);
    const baseUrl = `${import.meta.env.REACT_APP_API_URL}/customer/`

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
        setCustomers(data.customers || []);
        return data.customers
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

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addNewCustomerHandler = async () => {
    const url = `${import.meta.env.REACT_APP_API_URL}/customer/`;  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      const res_data = await response.json();
      console.log(`Response Data from server after Customer create: `);
      console.log(res_data);

      if (response.ok) {
        toast({
          title: "Success",
          description: `Customer Created Successfully.`,
        });
        fetchCustomers();
        setFormData({})
        // TODO: close the model
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
      console.log(`After updateHandler Call`)
      console.log(formData);
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
    setFormData
  };
}
