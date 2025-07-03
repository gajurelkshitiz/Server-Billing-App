import React from "react";
import DataTable from "@/pages/Admin/DataTable";
import { Admin } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const columns = [
  { key: 'sn', label: "S.N.", sortable: true},
  { key: "name", label: "Full Name", sortable: true },
  { key: "profileImage", label: "Profile"},
  { key: "email", label: "Email", sortable: true },
  { key: "phoneNo", label: "Phone", sortable: true },
  { key: "subsName", label: "Subscription", sortable: true },
];

type AdminTableProps = {
  data: Admin[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (admin: Admin) => void;
  handleDelete: (admin: Admin) => void;
};

export default function AdminTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  handleDelete,
}: AdminTableProps) {
  return (
    // <>
    <>
    {/* TODO: UI milau add button */}
      <div className="flex justify-between p-2 border-2 items-center">
        <CardTitle>Admins</CardTitle>
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
      />
    </>
  );
}
