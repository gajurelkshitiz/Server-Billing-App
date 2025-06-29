import React from "react";
import DataTable from "@/pages/Company/DataTable";
import { Company } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";

const columns = [
  { key: "name", label: "Company Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phoneNo", label: "Phone Number", sortable: true },
  { key: "address", label: "Address", sortable: true },
  { key: "logo", label: 'Company Logo'},
  { key: "vat", label: "Vat", sortable: true },
  // Active/ inactive ko lagi pachi status dekhaune yesma
  {
    key: "industrytype",
    label: "Industry",
    sortable: true,
  },
];

type CompanyPageProps = {
  data: Company[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (company: Company) => void;
  handleDelete: (company: Company) => void;
};

export default function CompanyTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  handleDelete,
}: 
CompanyPageProps) {
  return (
    <>
      {/* TODO: UI milau add button */}
      <div className="flex justify-between p-2 border-2 items-center">
        <CardTitle>Company</CardTitle>
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
