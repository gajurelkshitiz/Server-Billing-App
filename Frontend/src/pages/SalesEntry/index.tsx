import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import SalesEntryFormModal from "./Form/SalesEntryFormModal";
import { useSalesEntry } from "./Hooks/useSalesEntries";
import { SalesEntry } from "./types";
import SalesEntryTable from "./SalesEntryPage";
import { useCompanyStateGlobal } from "@/provider/companyState";
import { useNavigate } from "react-router-dom";


interface CompanyContext {
    state?: {
        companyID: string,
    };
    dispatch?: (value: { type: "SET_COMPANYID", payload: any }) =>  void;

}


const SalesEntryPage = () => {
  const navigate = useNavigate();

  // yaha yo loading haru le k kaam gariraxa ???
  const {
    salesEntries,
    loading,
    updateSalesEntryHandler,
    // deleteSubscription,
    addNewSalesEntryHandler,
    formData,
    setFormData,
  } = useSalesEntry();

  const {state, dispatch}:CompanyContext = useCompanyStateGlobal()
  const role = localStorage.getItem('role')

  
  useEffect(() => {
    if (state.companyID == 'all' && state.companyID) {
      navigate('/dashboard');
    }
  },[state.companyID])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSalesEntry, setEditingSalesEntry] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingSalesEntry(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (salesEntry: SalesEntry) => {
    setEditingSalesEntry(true);
    setFormData(salesEntry);
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

  // TODO: Name consistent for same ani clear naming baru laamo vaye farak pardain
  // SubscriptionFormSubmitHandler
  // subscriptionFormSubmitHandler
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (editingSalesEntry) {
      await updateSalesEntryHandler();
      setIsModalOpen(false);
    } else {
      console.log(formData);
      await addNewSalesEntryHandler();
      setIsModalOpen(false);
    }
  };
  // alert("Subscription create")
  // const success = await addOrUpdateSubscription(formData, editingSubscription);
  // if (success) setIsModalOpen(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Sales Entry Management
      </h1>
      <SalesEntryTable
        data={salesEntries}
        loading={loading}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        // handleDelete={handleDelete}
      />
      <SalesEntryFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingSalesEntry={editingSalesEntry}
        title={
          editingSalesEntry
            ? "Edit Sales Entry"
            : "Add New Sales Entry"
        }
      />
    </div>
  );
};

export default SalesEntryPage;
