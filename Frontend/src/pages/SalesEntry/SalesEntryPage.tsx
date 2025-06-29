import React from "react";
import DataTable from "@/pages/SalesEntry/Table/DataTable";
import { SalesEntry } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";

const columns = [
  { key: "date", label: "Bill Date", sortable: true },
  { key: "amount", label: "Total Amount", sortable: true },
  { key: "itemDescription", label: "Item Description"},
  { key: "billAttachment", label: "Bill"},
  { key: "paid", 
    label: "Status", 
    sortable: true,
    render: (value: boolean) => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <label>
        <input type="checkbox" checked={!!value} readOnly /> Paid
      </label>
      <label>
        <input type="checkbox" checked={!value} readOnly /> Due
      </label>
    </div>
    ),
  },
  { key: "dueAmount", label: "Due Amount", sortable: true}
];

type SalesEntryPageProps = {
  data: SalesEntry[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (salesEntry: SalesEntry) => void;
  // handleDelete: (subscription: Subscription) => void;
};

export default function SalesEntryTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  // handleDelete,
}: SalesEntryPageProps) {
  return (
    // <>
    <>
    {/* TODO: UI milau add button */}
      <div className="flex justify-between p-2 border-2 items-center">
        <CardTitle>Sales Entry</CardTitle>
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
