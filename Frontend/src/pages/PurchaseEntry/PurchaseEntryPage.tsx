import React from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { PurchaseEntry } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";
import DateNepali from "../../components/common/DatePicker";


const columns = [
  { key: "sn", label: "S.N.", sortable: true},
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

type PurchaseEntryPageProps = {
  data: PurchaseEntry[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (purchaseEntry: PurchaseEntry) => void;
  handleDelete: (subscription: PurchaseEntry) => void;
};

export default function PurchaseEntryTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  handleDelete,
}: PurchaseEntryPageProps) {
  return (
    <>
    {/* TODO: UI milau add button */}
      <div className="flex justify-between p-2 border-2 items-center">
        <CardTitle>Purchase Entry</CardTitle>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Add New
        </Button>
      </div>


    <DataTable
        data={data}
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        loading={loading}
        loadingTitle='Purchase Entries'
        previewTitle="Bill Preview"
        previewAltText="Full Size Bill"
      />
    </>
  );
}
