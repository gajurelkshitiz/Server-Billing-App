import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import CustomerTable from "./CustomerPage";
import CustomerFormModal from "./CustomerFormModal";
import { useCustomers } from "./useCustomers";
import { Customer } from "./types";

const CustomerPage = () => {
  
  const {
    customers,
    loading,
    updateCustomerHandler,
    deleteCustomer,
    addNewCustomerHandler,
    formData,
    setFormData,
  } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingCustomer(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(true); // recently change the value inside from admin to true
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

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData)

    if (editingCustomer) {
      console.log(`Before UpdateHandler`);
      await updateCustomerHandler();
      setIsModalOpen(false);
    } else {
      console.log("New Customer Creation");
      await addNewCustomerHandler?.();
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
      <CustomerTable
        data={customers}
        // TODO: Loading related kaam garna baki chha
        loading={loading}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <CustomerFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        // addNewCustomerHandler={addNewCustomerHandler}
        // updateCustomerHandler={updateCustomerHandler}
        editingCustomer={editingCustomer}
        title={editingCustomer ? "Edit Customer" : "Add New Customer"}
      />
    </div>
  );
};

export default CustomerPage;
