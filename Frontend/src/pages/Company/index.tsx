import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import CompanyFormModal from "./CompanyFormModal";
import { useCompany } from "./useCompanies";
import { Company } from "./types";
import CompanyTable from "./CompanyPage";
import { useCompanyContext } from "@/context/CompanyContext";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const CompanyPage = () => {
  
  const {
    loading,
    updateCompanyHandler,
    deleteCompany,
    addNewCompanyHandler,
    formData,
    setFormData,
  } = useCompany();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<boolean>(false);
  const { company, setCompany } = useCompanyContext(); // context only
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  

  console.log('value after fetching company in context api', company);

  const handleAdd = () => {
    setEditingCompany(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(true); 
    setFormData(company);
    setIsModalOpen(true);
  };

  const handleDelete = async (company: Company) => {
    // if (window.confirm("Are you sure you want to delete this Company?")) {
    //   await deleteCompany(company);
    // }
    setCompanyToDelete(company);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;
    setDeleteLoading(true);
    await deleteCompany(companyToDelete);
    setDeleteLoading(false);
    setConfirmOpen(false);
    setCompanyToDelete(null);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // TODO: Name consistent for same ani clear naming baru laamo vaye farak pardain
  // SubscriptionFormSubmitHandler
  // subscriptionFormSubmitHandler
  const handleSubmit = async (e : any) => {
    e.preventDefault();
    console.log('before update the formData is:', formData);
    if (editingCompany) {
      await updateCompanyHandler();
      setIsModalOpen(false);
    } else {
      await addNewCompanyHandler();
      setIsModalOpen(false);
    }
  };
  // alert("Subscription create")
  // const success = await addOrUpdateSubscription(formData, editingSubscription);
  // if (success) setIsModalOpen(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Company Management
      </h1>
      <CompanyTable
        data={Array.isArray(company) ? company : company ? [company] : []}
        loading={loading}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <CompanyFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingCompany={editingCompany}
        title={editingCompany ? "Edit Company" : "Add New Company"}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Company"
        description="Are you sure you want to delete this company? This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default CompanyPage;
