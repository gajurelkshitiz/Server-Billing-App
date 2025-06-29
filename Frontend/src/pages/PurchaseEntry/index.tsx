import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import PurchaseEntryFormModal from "./Form/PurchaseEntryFormModal";
import { usePurchaseEntry } from "./Hooks/usePurchaseEntries";
import { PurchaseEntry } from "./types";
import PurchaseEntryTable from "./PurchaseEntryPage";
import { useCompanyStateGlobal } from "@/provider/companyState";
import { useNavigate } from "react-router-dom";


interface CompanyContext {
    state?: {
        companyID: string,
    };
    dispatch?: (value: { type: "SET_COMPANYID", payload: any }) =>  void;

}

const PurchaseEntryPage = () => {
  const navigate = useNavigate();

  const {
    purchaseEntries,
    loading,
    updatePurchaseEntryHandler,
    // deleteSubscription,
    addNewPurchaseEntryHandler,
    formData,
    setFormData,
  } = usePurchaseEntry();

  const {state, dispatch}:CompanyContext = useCompanyStateGlobal()
  const role = localStorage.getItem('role')

  
  useEffect(() => {
    if (state.companyID == 'all' && state.companyID) {
      navigate('/dashboard');
    }
  },[state.companyID])
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchaseEntry, setEditingPurchaseEntry] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingPurchaseEntry(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (purchaseEntry: PurchaseEntry) => {
    console.log('this is before edit')
    console.log(purchaseEntry)
    setEditingPurchaseEntry(true);
    setFormData(purchaseEntry);
    setIsModalOpen(true);
  };

  // const handleDelete = async (subscription: Subscription) => {
  //   if (window.confirm("Are you sure you want to delete this Subscription?")) {
  //     await deleteSubscription(subscription);
  //   }
  // };

  const handleInputChange = (name: string, value: string) => {
    // Only validate if dueAmount is being changed and amount is present
    if (name === "dueAmount" && typeof value === "string") {
      const due = parseFloat(value);
      const amount = parseFloat(String(formData.amount ?? "0"));
      if (due > amount) {
        // alert("Due Amount cannot be greater than Total Amount!");
        toast({
          title: "Error",
          description: `Due Amount cannot be greater than ${formData.amount}`,
          variant: "destructive",
        });
        return; // Prevent update
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (editingPurchaseEntry) {
      await updatePurchaseEntryHandler();
      setIsModalOpen(false);
    } else {
      console.log(formData);
      await addNewPurchaseEntryHandler();
      setIsModalOpen(false);
    }
  };
  // alert("Subscription create")
  // const success = await addOrUpdateSubscription(formData, editingSubscription);
  // if (success) setIsModalOpen(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Purchase Entry Management
      </h1>
      <PurchaseEntryTable
        data={purchaseEntries}
        loading={loading}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        // handleDelete={handleDelete}
      />
      <PurchaseEntryFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingPurchaseEntry={editingPurchaseEntry}
        title={
          editingPurchaseEntry
            ? "Edit Purchase Entry"
            : "Add New Purchase Entry"
        }
      />
    </div>
  );
};

export default PurchaseEntryPage;
