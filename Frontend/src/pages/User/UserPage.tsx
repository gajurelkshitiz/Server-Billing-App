import React from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { User } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const columns = [
  { key: "sn", label: "S.N.", sortable: true},
  { key: "name", label: "Full Name", sortable: true },
  { key: "profileImage", label: "Profile"},
  { key: "email", label: "Email", sortable: true },
  { key: "phoneNo", label: "Phone", sortable: true },
  { key: "companyName", label: "Company", sortable: true },
  { key: "departmentNo", label: "Department", sortable: true },
];

type UserTableProps = {
  data: User[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (user: User) => void;
  handleDelete: (user: User) => void;
};

export default function UserTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  handleDelete,
}: UserTableProps) {
  return (
    // <>
    <>
    {/* TODO: UI milau add button */}
      <div className="flex justify-between p-2 border-2 items-center">
        <CardTitle>Users</CardTitle>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Add New
        </Button>
      </div>

      {/* input: onChange
      button: onClick */}

      <DataTable
        data={data}
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        loading={loading}
        loadingTitle='Users'
        previewTitle="Profile Preview"
        previewAltText="Full Size User Profile"
      />
    </>
  );
}
