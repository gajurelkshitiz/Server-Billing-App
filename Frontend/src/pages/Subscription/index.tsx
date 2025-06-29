import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import SubscriptionFormModal from "./SubscriptionFormModal";
import { useSubscription } from "./useSubscriptions";
import { Subscription } from "./types";
import SubscriptionTable from "./SubscriptionPage";

const SubscriptionPage = () => {
  
  const {
    subscriptions,
    loading,
    updateSubscriptionHandler,
    // deleteSubscription,
    addNewSubscriptionHandler,
    formData,
    setFormData,
  } = useSubscription();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingSubscription(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(true); // recently change the value inside from Subscription to true
    setFormData(subscription);
    setIsModalOpen(true);
  };

  // const handleDelete = async (subscription: Subscription) => {
  //   if (window.confirm("Are you sure you want to delete this Subscription?")) {
  //     await deleteSubscription(subscription);
  //   }
  // };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // TODO: Name consistent for same ani clear naming baru laamo vaye farak pardain
  // SubscriptionFormSubmitHandler
  // subscriptionFormSubmitHandler
  const handleSubmit = async (e : any) => {
    e.preventDefault();

    if (editingSubscription) {
      await updateSubscriptionHandler();
      setIsModalOpen(false);
    } else {
      await addNewSubscriptionHandler();
      setIsModalOpen(false);
    }
  };
  // alert("Subscription create")
  // const success = await addOrUpdateSubscription(formData, editingSubscription);
  // if (success) setIsModalOpen(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Subscription Management
      </h1>
      <SubscriptionTable
        data={subscriptions}
        loading={loading}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        // handleDelete={handleDelete}
      />
      <SubscriptionFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingSubscription={editingSubscription}
        title={editingSubscription ? "Edit Subscription" : "Add New Subscription"}
      />
    </div>
  );
};

export default SubscriptionPage;
