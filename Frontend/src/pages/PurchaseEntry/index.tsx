import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import PurchaseEntryFormModal from "./Form/PurchaseEntryFormModal";
import { usePurchaseEntry } from "./Hooks/usePurchaseEntries";
import { PurchaseEntry } from "./types";
import PurchaseEntryTable from "./PurchaseEntryPage";
import { CompanyContextType, useCompanyStateGlobal } from "@/provider/companyState";
import { useNavigate } from "react-router-dom";


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
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleFilterChange, // Add this
    filters, // Add this
  } = usePurchaseEntry();

  const {state, dispatch}:CompanyContextType = useCompanyStateGlobal()
  const role = localStorage.getItem('role')

  
  useEffect(() => {
    if (state.companyID == 'all' && state.companyID) {
      navigate('/home/dashboard');
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
  
    // Just update the formData here:
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();


    if (editingPurchaseEntry) {
      await updatePurchaseEntryHandler();
      setIsModalOpen(false);
    } else {
      console.log('checking the status of formData', formData);
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
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        totalPages={totalPages}
        onFilterChange={handleFilterChange} // Add this
        currentFilters={filters} // Add this
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
