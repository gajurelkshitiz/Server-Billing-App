import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import UserTable from "./UserPage";
import UserFormModal from "./UserFormModal";
import { useUsers } from "./useUsers";
import { User } from "./types";

const UserPage = () => {
  
  const {
    users,
    loading,
    updateUserHandler,
    deleteUser,
    addNewUserHandler,
    formData,
    setFormData,
  } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(true); // recently change the value inside from admin to true
    setFormData(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(user);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // TODO: Name consistent for same ani clear naming baru laamo vaye farak pardain
  // adminFormSubmitHandler
  // subscriptionFormSubmitHandler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingUser) {
      console.log(`Before UpdateHandler`);
      await updateUserHandler();
      setIsModalOpen(false);
    } else {
      console.log("New User Creation");
      await addNewUserHandler();
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      <UserTable
        data={users}
        // TODO: Loading related kaam garna baki chha
        loading={loading}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <UserFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        addNewUserHandler={addNewUserHandler}
        updateUserHandler={updateUserHandler}
        editingUser={editingUser}
        title={editingUser ? "Edit User" : "Add New User"}
      />
    </div>
  );
};

export default UserPage;
