import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { User } from "./types";
import { format } from "path";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  const { toast } = useToast();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    "X-Role": localStorage.getItem("role") || "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/user/`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUsers(data.users || []);
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
    fetchUsers();
  }, []);

  const addNewUserHandler = async () => {
    const url = `${import.meta.env.REACT_APP_API_URL}/user/`;  
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
      console.log(`Response Data from server after user create: `);
      console.log(res_data);

      if (response.ok) {
        toast({
          title: "Success",
          description: `User Created Successfully.`,
        });
        fetchUsers();
        setFormData({})
        // TODO: close the model
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to create user: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUserHandler = async () => {
    try {
      console.log(`After updateHandler Call`)
      console.log(formData);
      if (!formData._id) {
      toast({
        title: "Error",
        description: "No user selected for update",
        variant: "destructive",
      });
      return false;
      }
      const response = await fetch(
      `${import.meta.env.REACT_APP_API_URL}/user/${formData._id}`,
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
        description: "User updated successfully",
      });
      fetchUsers();
      setFormData({});
      return true;
      } else {
      toast({
        title: "Error",
        description: `Failed to update user: ${res_data.msg}`,
        variant: "destructive",
      });
      return false;
      }
    } catch (error) {
      toast({
      title: "Error",
      description: "Failed to update user",
      variant: "destructive",
      });
      return false;
    }
  };

  const deleteUser = async (admin: User) => {
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/admin/${admin._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        toast({ title: "Success", description: "User deleted successfully" });
        fetchUsers();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete User",
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
    users,
    loading,
    updateUserHandler,
    deleteUser,
    addNewUserHandler,
    formData,
    setFormData
  };
}
