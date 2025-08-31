import React, { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { Customer } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";
import { Link } from "react-router-dom";
import Pagination from "@/components/shared/Pagination";

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
  {
    key: "type",
    label: "Cr/Dr",
    sortable: false,
    render: (type: string) => (
      <span className={`font-bold flex items-center gap-1 ${type === 'credit' ? 'text-green-600' : type === 'debit' ? 'text-red-600' : ''}`}>
        {type === 'credit' && <span>Cr</span>}
        {type === 'debit' && <span>Dr</span>}
      </span>
    ),
  },
  { key: "prevClosingBalance", label: "Prev Year Closing Amt", sortable: true},
  { key: "address", label: "Address", sortable: true },
  { key: "phoneNo", label: "Phone", sortable: true },
  { key: "panNo", label: "PAN", sortable: true},
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
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalPages: number;
  onFilterChange?: (filters: any) => void;
  currentFilters?: any;
};

export default function CustomerTable({
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
}: CustomerTableProps) {
  // Filter state - now this will trigger backend calls
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    minBalance: "",
    maxBalance: "",
    email: "",
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
        <label className="block text-sm font-medium mb-1">Search by Name</label>
        <input
          type="text"
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          placeholder="Customer name..."
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="text"
          value={filters.email}
          onChange={e => setFilters(f => ({ ...f, email: e.target.value }))}
          placeholder="Email..."
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          className="border rounded px-2 py-1 w-full"
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Min Balance</label>
        <input
          type="number"
          value={filters.minBalance}
          onChange={e => setFilters(f => ({ ...f, minBalance: e.target.value }))}
          placeholder="Min"
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Max Balance</label>
        <input
          type="number"
          value={filters.maxBalance}
          onChange={e => setFilters(f => ({ ...f, maxBalance: e.target.value }))}
          placeholder="Max"
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="flex flex-col justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFilters({
            search: "",
            status: "",
            minBalance: "",
            maxBalance: "",
            email: "",
          })}
        >
          Reset
        </Button>
      </div>
    </>
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 border-2">
        <CardTitle className="text-lg sm:text-xl">Customers</CardTitle>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
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
        loadingTitle='Customers'
        previewTitle="Customer Profile"
        previewAltText="Full Customer Photo"
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
