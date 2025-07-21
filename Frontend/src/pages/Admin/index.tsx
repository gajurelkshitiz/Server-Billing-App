import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import AdminTable from "./AdminPage";
import AdminFormModal from "./AdminFormModal";
import { useAdmins } from "./useAdmins";
import { Admin } from "./types";
import ConfirmDialog from "@/components/common/ConfirmDialog"; // <-- import
import { Button } from '@/components/ui/button';
import { Download, Printer } from "lucide-react";
import { getAuthHeaders } from "@/utils/auth";

const AdminPage = () => {
  
  const {
    admins,
    loading,
    updateAdminHandler,
    deleteAdmin,
    addNewAdminHandler,
    formData,
    setFormData,
    handleSendVerification,
    verificationLoading, // Make sure this is destructured
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
    console.log('Inside admin profileimage is: ', formData.profileImage);
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

  const handleExport = async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/admin/export/excel`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admins-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Admin data exported successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error", 
        description: "Failed to export admin data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <AdminTable
        data={admins}
        // TODO: Loading related kaam garna baki chha
        loading={loading}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleSendVerification={handleSendVerification}
        verificationLoading={verificationLoading} // Make sure this is passed
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
