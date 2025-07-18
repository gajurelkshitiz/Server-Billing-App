import React, { useRef, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import CompanyFormModal from "./CompanyFormModal";
import { useCompany } from "./useCompanies";
import { Company } from "./types";
import CompanyTable from "./CompanyPage";
import { useCompanyContext } from "@/context/CompanyContext";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {Upload} from 'lucide-react';
import { getAuthHeaders } from "@/utils/auth";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset file input
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    console.log('Inside formData of import file: ',formData);

    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/company/import/excel`,
        {
          method: "POST",
          body: formData,
          headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Role": localStorage.getItem("role") || "",
          // Do NOT set Content-Type, browser will set it for FormData
        },
        }
      );
      if (!response.ok) throw new Error("Import failed");
      toast({
        title: "Import Successful",
        description: "Company data imported successfully.",
      });
      // Optionally refresh company data here
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "There was an error importing the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Company Management
        </h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition"
          onClick={handleImport}
        >
         <Upload  size={18}/> Import
        </button>
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
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
