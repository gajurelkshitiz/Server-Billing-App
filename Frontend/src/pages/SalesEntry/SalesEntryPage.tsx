import React, { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { SalesEntry } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";
import Pagination from "@/components/shared/Pagination";
import NepaliDate from "@/components/common/DatePicker";

import { useCustomers } from "@/pages/Customer/useCustomers";

const columns = [
  { key: "sn", label: "S.N.", sortable: true},
  { key: "billNo", label: "Bill Number", sortable: true },
  { key: "date", label: "Bill Date", sortable: true },
  { key: "customerName", label: "Customer", sortable: true },
  { key: "itemDescription", label: "Item Description"},
  { key: "billAttachment", label: "Bill"},
  { key: "amount", label: "Amount", sortable: true },
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
  { key: "netTotalAmount", label: "Net Total Amount", sortable: true },
];

type SalesEntryPageProps = {
  data: SalesEntry[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (salesEntry: SalesEntry) => void;
  handleDelete: (subscription: SalesEntry) => void;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalPages: number;
  onFilterChange?: (filters: any) => void;
  currentFilters?: any;
};

export default function SalesEntryTable({
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
}) {
  const { customers} = useCustomers();

  // Filter state - now this will trigger backend calls
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    customerID: "",
    minAmount: "",
    maxAmount: "",
  });

  // Memoize the filter change handler to prevent infinite re-renders
  const handleFilterChange = useCallback((newFilters: any) => {
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  }, [onFilterChange]);

  // Apply filters to backend when they change - use a ref to track if filters actually changed
  const prevFiltersRef = React.useRef(filters);
  
  useEffect(() => {
    // Only trigger if filters actually changed (not just object reference)
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

  // The filter form to render inside DataTable
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
        <label className="block text-sm font-medium mb-1">Customer</label>
        <select
          className="border rounded px-2 py-1"
          value={filters.customerID}
          onChange={e => setFilters(f => ({ ...f, customerID: e.target.value }))}
        >
          <option value="">All Customers</option>
          {customers.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
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
            customerID: "",
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
        <CardTitle>Sales Entry</CardTitle>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Add New
        </Button>
      </div>

      <DataTable
        data={data} // Use original data, not filtered data
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        loading={loading}
        loadingTitle='Sales Entries'
        previewTitle="Bill Preview"
        previewAltText="Full Size Bill"
        filterForm={filterForm}
        currentPage={page}
        pageSize={limit}
      />

      {/* Pagination UI */}
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
