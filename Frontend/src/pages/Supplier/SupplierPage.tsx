import React from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { Supplier } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";

const columns = [
  { key: "name", label: "Full Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "address", label: "Address", sortable: true },
  { key: "phoneNo", label: "Phone", sortable: true },
  { key: "companyName", label: "Company", sortable: true },
  // { key: "departmentNo", label: "Department", sortable: true },
  {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: any) => <StatusBadge value={value} />,
  },
];

type SupplierTableProps = {
  data: Supplier[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (supplier: Supplier) => void;
  handleDelete: (supplier: Supplier) => void;
};

export default function SupplierTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  handleDelete,
}: SupplierTableProps) {
  return (
    // <>
    <>
    {/* TODO: UI milau add button */}
      <div className="flex justify-between p-2 border-2 items-center">
        <CardTitle>Suppliers</CardTitle>
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
        loadingTitle='Suppliers'
        previewTitle=""
        previewAltText=""
      />
    </>
  );
}
