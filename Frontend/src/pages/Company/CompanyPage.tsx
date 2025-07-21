import React from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { Company } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";

const columns = [
  { key: "sn", label: "S.N.", sortable: true},
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 border-2">
        <CardTitle className="text-lg sm:text-xl">Company</CardTitle>
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
        loadingTitle='Companies'
        previewTitle='Company Logo'
        previewAltText='Full Size Company Logo'
      />
    </>
  );
}
