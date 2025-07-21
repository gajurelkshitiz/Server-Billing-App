import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Admin } from "./types";
import { getAuthHeaders } from "@/utils/auth";

export function useAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Admin>>({});
  const [verificationLoading, setVerificationLoading] = useState<Set<string | number>>(new Set()); // Add this

  const { toast } = useToast();

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

  const handleSendVerification = async (admin: Admin) => {
    const adminId = admin._id || admin.email; // Make sure this matches what you use in TableB
    
    console.log("Starting verification for admin:", adminId); // Debug log
    
    // Add admin to loading set
    setVerificationLoading(prev => {
      const newSet = new Set(prev);
      newSet.add(adminId);
      console.log("Loading set after adding:", newSet); // Debug log
      return newSet;
    });
    
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/auth/reVerificationEmail`,
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: admin.email,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.status === "success") {
          toast({
            title: "Success",
            description: responseData.message || "Verification email sent successfully",
          });
        } else if (responseData.status === "info") {
          toast({
            title: "Info",
            description: responseData.message || "Verification token is still valid",
            variant: "default",
          });
        } else {
          toast({
            title: "Warning",
            description: responseData.message || "Unexpected response",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: responseData.message || "Failed to send verification email",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      // Remove admin from loading set
      console.log("Removing from loading set:", adminId); // Debug log
      setVerificationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(adminId);
        console.log("Loading set after removing:", newSet); // Debug log
        return newSet;
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
    setFormData,
    handleSendVerification,
    verificationLoading, // Export this
  };
}
