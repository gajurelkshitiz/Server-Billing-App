import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import AdminTable from "./AdminPage";
import AdminFormModal from "./AdminFormModal";
import { useAdmins } from "./useAdmins";
import { Admin } from "./types";
import ConfirmDialog from "@/components/common/ConfirmDialog"; // <-- import

const AdminPage = () => {
  
  const {
    admins,
    loading,
    updateAdminHandler,
    deleteAdmin,
    addNewAdminHandler,
    formData,
    setFormData,
  } = useAdmins();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<boolean>(false);
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleAdd = () => {
    setEditingAdmin(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(true); // recently change the value inside from admin to true
    setFormData(admin);
    setIsModalOpen(true);
  };

  const handleDelete = (admin: Admin) => {
    setAdminToDelete(admin);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    setDeleteLoading(true);
    await deleteAdmin(adminToDelete);
    setDeleteLoading(false);
    setConfirmOpen(false);
    setAdminToDelete(null);
  };

  const handleInputChange = (name: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // TODO: Name consistent for same ani clear naming baru laamo vaye farak pardain
  // adminFormSubmitHandler
  // subscriptionFormSubmitHandler
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (editingAdmin) {
      console.log(`Before UpdateHandler`);
      await updateAdminHandler();
      setIsModalOpen(false);
    } else {
      console.log(formData)
      console.log("New Admin Creation");
      await addNewAdminHandler();
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
      <AdminTable
        data={admins}
        // TODO: Loading related kaam garna baki chha
        loading={loading}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <AdminFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        // addNewAdminHandler={addNewAdminHandler}
        // updateAdminHandler={updateAdminHandler}
        editingAdmin={editingAdmin}
        title={editingAdmin ? "Edit Admin" : "Add New Admin"}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Admin"
        description="Are you sure you want to delete this admin? This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminPage;
