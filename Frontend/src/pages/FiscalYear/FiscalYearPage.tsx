import React from "react";
import DataTable from "@/pages/FiscalYear/DataTable";
import { FiscalYear } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";

const columns = [
  { key: "name", label: "Fiscal Year", sortable: true },
  { key: "startDate", label: "Start Date", sortable: true },
  { key: "endDate", label: "End Date", sortable: true },
  // Active/ inactive ko lagi pachi status dekhaune yesma
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value: any) => <StatusBadge value={value} />,
  },
];

type FiscalYearPageProps = {
  data: FiscalYear[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (subscription: FiscalYear) => void;
  // handleDelete: (subscription: FiscalYear) => void;
};

export default function FiscalYearTable({
  data,
  loading,
  handleAdd,
  handleEdit,
}: // handleDelete,
FiscalYearPageProps) {
  return (
    <>
      {/* TODO: UI milau add button */}
      <div className="flex justify-between p-2 border-2 items-center">
        <CardTitle>Fiscal year</CardTitle>
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
        // handleDelete={handleDelete}
        loading={loading}
      />
    </>
  );
}
