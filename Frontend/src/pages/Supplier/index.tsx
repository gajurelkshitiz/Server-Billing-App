import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import SupplierTable from "./SupplierPage";
import SupplierFormModal from "./SupplierFormModal";
import { useSuppliers } from "./useSuppliers";
import { Supplier } from "./types";
import { CompanyContextType, useCompanyStateGlobal } from "@/provider/companyState";
import { useNavigate } from "react-router-dom";

const SupplierPage = () => {
  const navigate = useNavigate();

  const {
    suppliers,
    loading,
    updateSupplierHandler,
    deleteSupplier,
    addNewSupplierHandler,
    formData,
    setFormData,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleFilterChange,
    filters
  } = useSuppliers();

  const { state, dispatch }: CompanyContextType = useCompanyStateGlobal();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (state.companyID === 'all') {
      navigate('/home/dashboard');
    }
  })


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingSupplier(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(true); // recently change the value inside from admin to true
    setFormData(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = async (supplier: Supplier) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      await deleteSupplier(supplier);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData)

    if (editingSupplier) {
      console.log(`Before UpdateHandler`);
      await updateSupplierHandler();
      setIsModalOpen(false);
    } else {
      console.log("New Supplier Creation");
      await addNewSupplierHandler?.();
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
      <SupplierTable
        data={suppliers}
        loading={loading}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        totalPages={totalPages}
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />
      <SupplierFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingSupplier={editingSupplier}
        title={editingSupplier ? "Edit Supplier" : "Add New Supplier"}
      />
    </div>
  );
};

export default SupplierPage;
