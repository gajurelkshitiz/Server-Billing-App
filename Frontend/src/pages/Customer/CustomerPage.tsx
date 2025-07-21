import React from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { Customer } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";
import { Link } from "react-router-dom";

const columns = [
  { key: 'sn', label: "S.N.", sortable: true},
  { 
    key: "name", 
    label: "Full Name", 
    sortable: true,
    render: (name: string, rowData: any) => (
      <Link 
        to={`/customerInfo/${rowData.companyID}/${rowData._id}`}
        className="hover:text-blue-800 cursor-pointer"
      >
        {name}
      </Link>
    )
  },
  { key: "email", label: "Email", sortable: true },
  { key: "prevClosingBalance", label: "Prev Year Closing Amt", sortable: true},
  { key: "address", label: "Address", sortable: true },
  { key: "phoneNo", label: "Phone", sortable: true },
  { key: "panNo", label: "PAN", sortable: true},

  // { key: "companyName", label: "Company", sortable: true },
  {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: any) => <StatusBadge value={value} />,
  },
];

type CustomerTableProps = {
  data: Customer[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (customer: Customer) => void;
  handleDelete: (customer: Customer) => void;
};

export default function CustomerTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  handleDelete,
}: CustomerTableProps) {
  return (
    // <>
    <>
    {/* TODO: UI milau add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 border-2">
        <CardTitle className="text-lg sm:text-xl">Customers</CardTitle>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
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
        loadingTitle='Customers'
        previewTitle="Customer Profile"
        previewAltText="Full Customer Photo"
      />
    </>
  );
}
