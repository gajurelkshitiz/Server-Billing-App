import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import FiscalYearFormModal from "./FiscalYearFormModal";
import { useFiscalYear } from "./useFiscalYears";
import { FiscalYear } from "./types";
import FiscalYearTable from "./FiscalYearPage";

const FiscalYearPage = () => {
  
  const {
    fiscalYears,
    loading,
    updateFiscalYearHandler,
    deleteFiscalYear,
    addNewFiscalYearHandler,
    formData,
    setFormData,
  } = useFiscalYear();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFiscalYear, setEditingFiscalYear] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingFiscalYear(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (fiscalYear: FiscalYear) => {
    setEditingFiscalYear(true); // recently change the value inside from FiscalYear to true
    setFormData(fiscalYear);
    setIsModalOpen(true);
  };

  const handleDelete = async (fiscalYear: FiscalYear) => {
    if (window.confirm("Are you sure you want to delete this FiscalYear?")) {
      await deleteFiscalYear(fiscalYear);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // TODO: Name consistent for same ani clear naming baru laamo vaye farak pardain
  // FiscalYearFormSubmitHandler
  // fiscalYearFormSubmitHandler
  const handleSubmit = async (e : any) => {
    console.log(formData)
    e.preventDefault();

    if (editingFiscalYear) {
      await updateFiscalYearHandler();
      setIsModalOpen(false);
    } else {
      await addNewFiscalYearHandler();
      setIsModalOpen(false);
    }
  };
  // alert("FiscalYear create")
  // const success = await addOrUpdateFiscalYear(formData, editingFiscalYear);
  // if (success) setIsModalOpen(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Fiscal Year Management
      </h1>
      <FiscalYearTable
        data={fiscalYears}
        loading={loading}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <FiscalYearFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingFiscalYear={editingFiscalYear}
        title={editingFiscalYear ? "Edit FiscalYear" : "Add New FiscalYear"}
      />
    </div>
  );
};

export default FiscalYearPage;
