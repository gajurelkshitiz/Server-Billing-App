import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Admin } from "./types";
import { format } from "path";
import { getAuthHeaders } from "@/utils/auth";

export function useAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Admin>>({});

  const { toast } = useToast();

  // const getAuthHeaders = () => ({
  //   Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   "Content-Type": "application/json",
  //   "X-Role": localStorage.getItem("role") || "",
  // });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/admin/`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setAdmins(data.admins || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch admins",
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
    fetchAdmins();
  }, []);

  const addNewAdminHandler = async () => {
    const url = `${import.meta.env.REACT_APP_API_URL}/admin`;  
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
      console.log(`Response Data from server after admin create: `);
      console.log(res_data);

      if (response.ok) {
        toast({
          title: "Success",
          description: `Admin Created Successfully.`,
        });
        fetchAdmins();
        setFormData({})
        // TODO: close the model
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to create admin: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create admin",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateAdminHandler = async () => {
    try {
      console.log(`After updateHandler Call`)
      console.log(formData);
      if (!formData._id) {
        toast({
          title: "Error",
          description: "No admin selected for update",
          variant: "destructive",
        });
        return false;
      }

      // Create FormData just like addNewAdminHandler
      const form = new FormData();
      // Append all fields to FormData
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null) {
          form.append(key, formData[key]);
        }
      }

      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/admin/${formData._id}`,
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
          description: "Admin updated successfully",
        });
        fetchAdmins();
        setFormData({});
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to update admin: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update admin",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteAdmin = async (admin: Admin) => {
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/admin/${admin._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        toast({ title: "Success", description: "Admin deleted successfully" });
        fetchAdmins();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete admin",
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
    admins,
    loading,
    updateAdminHandler,
    deleteAdmin,
    addNewAdminHandler,
    formData,
    setFormData
  };
}
