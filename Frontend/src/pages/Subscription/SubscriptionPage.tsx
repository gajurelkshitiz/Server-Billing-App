import React from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { Subscription } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";

const columns = [
  { key: "name", label: "Subscription Name", sortable: true },
  { key: "maxCompanies", label: "Allowed Companies", sortable: true },
  { key: "period", label: "Period", sortable: true },
  { key: "price", label: "Price", sortable: true },
  // Active/ inactive ko lagi pachi status dekhaune yesma
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value: any) => <StatusBadge value={value} />,
  },
];

type SubscriptionPageProps = {
  data: Subscription[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (subscription: Subscription) => void;
  handleDelete: (subscription: Subscription) => void;
};

export default function SubscriptionTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  handleDelete,
}: 
SubscriptionPageProps) {
  return (
    <>
      {/* TODO: UI milau add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 border-2">
        <CardTitle className="text-lg sm:text-xl">Subscription</CardTitle>
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
        loadingTitle='Subscriptions'
        previewTitle=''
        previewAltText=""
      />
    </>
  );
}
