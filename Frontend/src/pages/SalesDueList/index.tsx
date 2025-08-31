import React, { useEffect, useState } from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { useCompanyStateGlobal } from "@/provider/companyState";
import PaymentStatusBadge from "@/components/ui/paymentStatusBadge";
import OptionsDropdown from "./components/OptionsDropdown";
import PaymentProcessModal from "@/components/shared/PaymentProcessModal";
import FollowUpModal from "@/components/shared/FollowUpModal";
import Pagination from "@/components/shared/Pagination";
import { useSalesDueList } from "./hooks/useSalesDueList";
import { Button } from "@/components/ui/button";

const SalesDueListPage = () => {
  const [selectedAction, setSelectedAction] = useState<'pay' | 'followup' | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { state } = useCompanyStateGlobal();
  const companyID = localStorage.getItem('companyID');
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    customerData,
    loading,
    fetchCustomerCompleteData,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleFilterChange,
    filters,
    applyQuickFilter,
  } = useSalesDueList();

  const handlePay = (customerData: any) => {
    setSelectedCustomer(customerData);
    setSelectedAction('pay');
  };

  const handleFollowUp = (customerData: any) => {
    setSelectedCustomer(customerData);
    setSelectedAction('followup');
  };

  const handlePaymentSuccess = () => {
    fetchCustomerCompleteData();
  };

  const handleScheduleFollowUp = (followUpData: any) => {
    toast({
      title: "Success",
      description: "Follow-up scheduled successfully",
    });
    handleModalClose();
  };

  const handleModalClose = () => {
    setSelectedAction(null);
    setSelectedCustomer(null);
  };

  const handleDelete = () => {
    return;
  };

  const handleEdit = () => {
    return;
  };

  const customerDataColumns = [
    { key: "sn", label: "S.N."},
    { 
      key: "name", 
      label: "Customer Name", 
      sortable: true,
      render: (name: string, rowData: any) => (
        <Link 
          to={`/customerInfo/${companyID}/${rowData.customerID}`}
          className="hover:text-blue-800 cursor-pointer"
        >
          {name}
        </Link>
      )
    },
    { key: "prevClosingBalance", label: "Prev Year Closing Amt", sortable: true },
    { key: "totalSales", label: "Total Sales", sortable: true},
    { key: "totalPayments", label: "Total Payment", sortable: true},
    { key: "totalDue", label: "Total Dues", sortable: true},
    { key: "lastSaleDate", label: "Last Sales Date", sortable: true},
    { key: "lastPaymentDate", label: "Last Payment Date", sortable: true},
    { 
      key: "status", 
      label: "Status", 
      sortable: true,
      render: (status: any) => <PaymentStatusBadge status={status} />
    },
    { 
      key: "actions", 
      label: "Actions",
      render: (value: any, rowData: any) => (
        <OptionsDropdown 
          onPay={() => handlePay(rowData)}
          onFollowUp={() => handleFollowUp(rowData)}
          rowData={rowData}
        />
      )
    }
  ];

  // Quick filter buttons
  const quickFilters = [
    { key: 'highDues', label: 'High Dues (>5K)', color: 'bg-red-500 hover:bg-red-600' },
    { key: 'noSales6Months', label: 'No Sales 6M', color: 'bg-orange-500 hover:bg-orange-600' },
    { key: 'noPayments3Months', label: 'No Payments 3M', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { key: 'highRisk', label: 'High Risk', color: 'bg-purple-500 hover:bg-purple-600' },
    { key: 'topDues', label: 'Top 10 Dues', color: 'bg-blue-500 hover:bg-blue-600' },
  ];

  // Filter form
  const filterForm = (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Customer Name</label>
        <input
          type="text"
          value={filters.customerName}
          onChange={e => handleFilterChange({ ...filters, customerName: e.target.value })}
          placeholder="Customer name..."
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Min Due Amount</label>
          <input
            type="number"
            value={filters.minDue}
            onChange={e => handleFilterChange({ ...filters, minDue: e.target.value })}
            placeholder="Min Due"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Due Amount</label>
          <input
            type="number"
            value={filters.maxDue}
            onChange={e => handleFilterChange({ ...filters, maxDue: e.target.value })}
            placeholder="Max Due"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Min Sales Amount</label>
          <input
            type="number"
            value={filters.minSales}
            onChange={e => handleFilterChange({ ...filters, minSales: e.target.value })}
            placeholder="Min Sales"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Sales Amount</label>
          <input
            type="number"
            value={filters.maxSales}
            onChange={e => handleFilterChange({ ...filters, maxSales: e.target.value })}
            placeholder="Max Sales"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          className="border rounded px-2 py-1 w-full"
          value={filters.status}
          onChange={e => handleFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="due">Due</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Last Sale From</label>
          <input
            type="date"
            value={filters.lastSaleDateFrom}
            onChange={e => handleFilterChange({ ...filters, lastSaleDateFrom: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Sale To</label>
          <input
            type="date"
            value={filters.lastSaleDateTo}
            onChange={e => handleFilterChange({ ...filters, lastSaleDateTo: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Due Ratio % (Min)</label>
          <input
            type="number"
            value={filters.dueRatio}
            onChange={e => handleFilterChange({ ...filters, dueRatio: e.target.value })}
            placeholder="e.g., 50 for 50%"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Inactive Days</label>
          <input
            type="number"
            value={filters.inactiveDays}
            onChange={e => handleFilterChange({ ...filters, inactiveDays: e.target.value })}
            placeholder="e.g., 180"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      <div className="flex flex-col justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleFilterChange({
            customerName: "",
            minDue: "",
            maxDue: "",
            minSales: "",
            maxSales: "",
            lastSaleDateFrom: "",
            lastSaleDateTo: "",
            lastPaymentDateFrom: "",
            lastPaymentDateTo: "",
            status: "",
            quickFilter: "",
            dueRatio: "",
            inactiveDays: "",
          })}
        >
          Reset
        </Button>
      </div>
    </>
  );

  useEffect(() => {
    if (state.companyID === 'all') {
      navigate('/dashboard');
    }
  }, [state.companyID]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Sales Due List Management</h1>
        
        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <Button
              key={filter.key}
              onClick={() => applyQuickFilter(filter.key)}
              className={`text-white text-xs px-3 py-1 ${filter.color}`}
              size="sm"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="relative">
        <DataTable
          data={customerData}
          columns={customerDataColumns}
          loading={loading}
          loadingTitle='Sales Due list'
          handleDelete={handleDelete}
          handleEdit={handleEdit}
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

        {selectedAction === 'pay' && selectedCustomer && (
          <PaymentProcessModal
            selectedCustomer={selectedCustomer}
            onClose={handleModalClose}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {selectedAction === 'followup' && selectedCustomer && (
          <FollowUpModal
            selectedCustomer={selectedCustomer}
            onClose={handleModalClose}
            onScheduleFollowUp={handleScheduleFollowUp}
          />
        )}
      </div>
    </div>
  );
};

export default SalesDueListPage;