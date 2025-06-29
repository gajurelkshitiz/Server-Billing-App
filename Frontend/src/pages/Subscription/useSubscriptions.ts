import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Subscription } from "./types";

export function useSubscription() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Subscription>>({});

  const { toast } = useToast();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    "X-Role": localStorage.getItem("role") || "",
  });

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/subscription/`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
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
    fetchSubscriptions();
  }, []);

  const addNewSubscriptionHandler = async () => {
    const url = `${import.meta.env.REACT_APP_API_URL}/subscription/`;
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
          description: `Subscription Created Successfully.`,
        });
        fetchSubscriptions();
        setFormData({})
        // TODO: close the model
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to create subscription: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subscription",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSubscriptionHandler = async () => {
    try {
      if (!formData._id) {
      toast({
        title: "Error",
        description: "No Subscription selected for update",
        variant: "destructive",
      });
      return false;
      }
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/subscription/${formData._id}`,
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
      fetchSubscriptions();
      setFormData({});
      return true;
      } else {
      toast({
        title: "Error",
        description: `Failed to update subscription: ${res_data.msg}`,
        variant: "destructive",
      });
      return false;
      }
    } catch (error) {
      toast({
      title: "Error",
      description: "Failed to update subscription",
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
    subscriptions,
    loading,
    updateSubscriptionHandler,
    // deleteAdmin,
    addNewSubscriptionHandler,
    formData,
    setFormData
  };
}