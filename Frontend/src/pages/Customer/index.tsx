import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import CustomerTable from "./CustomerPage";
import CustomerFormModal from "./CustomerFormModal";
import { useCustomers } from "./useCustomers";
import { Customer } from "./types";
import { useCompanyStateGlobal, CompanyContextType } from "@/provider/companyState";
import { useNavigate } from "react-router-dom";

const CustomerPage = () => {
  const navigate = useNavigate();
  
  const {
    customers,
    loading,
    updateCustomerHandler,
    deleteCustomer,
    addNewCustomerHandler,
    formData,
    setFormData,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleFilterChange,
    filters,
  } = useCustomers();

  const { state, dispatch }: CompanyContextType = useCompanyStateGlobal();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (state.companyID === 'all') {
      navigate('/dashboard');
    }
  }, [state.companyID]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingCustomer(false);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(true);
    setFormData(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (customer: Customer) => {
    if (window.confirm("Are you sure you want to delete this Customer?")) {
      await deleteCustomer(customer);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (editingCustomer) {
      await updateCustomerHandler();
      setIsModalOpen(false);
    } else {
      await addNewCustomerHandler?.();
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
      
      <div className="relative">
        <CustomerTable
          data={customers}
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
        
        <CustomerFormModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          editingCustomer={editingCustomer}
          title={editingCustomer ? "Edit Customer" : "Add New Customer"}
        />
      </div>
    </div>
  );
};

export default CustomerPage;
