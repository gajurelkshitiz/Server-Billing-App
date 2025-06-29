import React from "react";
import DataTable from "@/pages/Subscription/DataTable";
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
  // handleDelete: (subscription: Subscription) => void;
};

export default function SubscriptionTable({
  data,
  loading,
  handleAdd,
  handleEdit,
}: // handleDelete,
SubscriptionPageProps) {
  return (
    <>
      {/* TODO: UI milau add button */}
      <div className="flex justify-between p-2 border-2 items-center">
        <CardTitle>Subscription</CardTitle>
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
