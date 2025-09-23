import React, { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { PurchaseEntry } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";
import Pagination from "@/components/shared/Pagination";
import NepaliDate from "@/components/common/DatePicker";
import { useSuppliers } from "@/pages/Supplier/useSuppliers";

const columns = [
  { key: "sn", label: "S.N.", sortable: true},
  { key: "billNo", label: "Bill Number", sortable: true },
  { key: "date", label: "Bill Date", sortable: true },
  { key: "supplierName", label: "Supplier", sortable: true },
  { key: "itemDescription", label: "Item Description"},
  { key: "billAttachment", label: "Bill"},
  { key: "dueAmount", label: "Total Due", sortable: true },
  { 
    key: "vat", 
    label: "Vat %", 
    sortable: true, 
    render: (value: any, row: any) => {
      if (!value) return '-';
      return `${value}%`
    }
  },
  { 
    key: "discount", 
    label: "Discount", 
    sortable: true,
    render: (value: any, row: any) => {
      if (!value) return '-';
      return row.discountType === 'percentage' 
        ? `${value}%` 
        : `Rs. ${value}`;
    }
  },
  { key: "netDueAmount", label: "Net Due Amount", sortable: true },
];

type PurchaseEntryPageProps = {
  data: PurchaseEntry[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (purchaseEntry: PurchaseEntry) => void;
  handleDelete: (subscription: PurchaseEntry) => void;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalPages: number;
  onFilterChange?: (filters: any) => void;
  currentFilters?: any;
};

export default function PurchaseEntryTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  handleDelete,
  page,
  setPage,
  limit,
  setLimit,
  totalPages,
  onFilterChange,
  currentFilters,
}: PurchaseEntryPageProps) {
  const { suppliers } = useSuppliers();

  // Filter state
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    supplierID: "",
    minAmount: "",
    maxAmount: "",
  });

  // Memoize filter change handler
  const handleFilterChange = useCallback((newFilters: any) => {
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  }, [onFilterChange]);

  // Track previous filters to avoid unnecessary calls
  const prevFiltersRef = React.useRef(filters);

  useEffect(() => {
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
    if (filtersChanged && onFilterChange) {
      prevFiltersRef.current = filters;
      handleFilterChange(filters);
    }
  }, [filters, handleFilterChange]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, setPage]);

  // Filter form
  const filterForm = (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Start Date (BS)</label>
        <NepaliDate
          handleInputChange={(name, value) => setFilters(f => ({ ...f, [name]: value }))}
          formData={filters}
          fieldName="startDate"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">End Date (BS)</label>
        <NepaliDate
          handleInputChange={(name, value) => setFilters(f => ({ ...f, [name]: value }))}
          formData={filters}
          fieldName="endDate"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Supplier</label>
        <select
          className="border rounded px-2 py-1"
          value={filters.supplierID}
          onChange={e => setFilters(f => ({ ...f, supplierID: e.target.value }))}
        >
          <option value="">All Suppliers</option>
          {suppliers.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Min Amount</label>
        <input
          type="number"
          value={filters.minAmount}
          onChange={e => setFilters(f => ({ ...f, minAmount: e.target.value }))}
          placeholder="Min"
          className="border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Max Amount</label>
        <input
          type="number"
          value={filters.maxAmount}
          onChange={e => setFilters(f => ({ ...f, maxAmount: e.target.value }))}
          placeholder="Max"
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFilters({
            startDate: "",
            endDate: "",
            supplierID: "",
            minAmount: "",
            maxAmount: "",
          })}
        >
          Reset
        </Button>
      </div>
    </>
  );

  return (
    <>
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
        filterForm={filterForm}
        currentPage={page}
        pageSize={limit}
      />

      <Pagination
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        totalPages={totalPages}
      />
    </>
  );
}
