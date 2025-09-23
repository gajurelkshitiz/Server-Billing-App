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
import { usePurchaseDueList } from "./hooks/usePurchaseDueList";
import { Button } from "@/components/ui/button";

const PurchaseDueListPage = () => {
  const [selectedAction, setSelectedAction] = useState<'pay' | 'followup' | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { state } = useCompanyStateGlobal();
  const companyID = localStorage.getItem('companyID');
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    supplierData,
    loading,
    fetchSupplierCompleteData,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleFilterChange,
    filters,
    applyQuickFilter,
  } = usePurchaseDueList();

  const handlePay = (customerData: any) => {
    setSelectedSupplier(customerData);
    setSelectedAction('pay');
  };

  const handleFollowUp = (customerData: any) => {
    setSelectedSupplier(customerData);
    setSelectedAction('followup');
  };

  const handlePaymentSuccess = () => {
    fetchSupplierCompleteData();
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
    setSelectedSupplier(null);
  };

  const handleDelete = () => {
    return;
  };

  const handleEdit = () => {
    return;
  };

  const supplierDataColumns = [
    { key: "sn", label: "S.N."},
    { 
      key: "name", 
      label: "Supplier Name", 
      sortable: true,
      render: (name: string, rowData: any) => (
        <Link 
          to={`/supplierInfo/${companyID}/${rowData.supplierID}`}
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
    { key: "lastPurchaseDate", label: "Last Purchase Date", sortable: true},
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
        <label className="block text-sm font-medium mb-1">Supplier Name</label>
        <input
          type="text"
          value={filters.supplierName}
          onChange={e => handleFilterChange({ ...filters, supplierName: e.target.value })}
          placeholder="Supplier name..."
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
          <label className="block text-sm font-medium mb-1">Min Purchase Amount</label>
          <input
            type="number"
            value={filters.minPurchase}
            onChange={e => handleFilterChange({ ...filters, minPurchase: e.target.value })}
            placeholder="Min Purchase"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Purchase Amount</label>
          <input
            type="number"
            value={filters.maxPurchase}
            onChange={e => handleFilterChange({ ...filters, maxPurchase: e.target.value })}
            placeholder="Max Purchase"
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
          <label className="block text-sm font-medium mb-1">Last Purchase From</label>
          <input
            type="date"
            value={filters.lastPurchaseDateFrom}
            onChange={e => handleFilterChange({ ...filters, lastPurchaseDateFrom: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Purchase To</label>
          <input
            type="date"
            value={filters.lastPurchaseDateTo}
            onChange={e => handleFilterChange({ ...filters, lastPurchaseDateTo: e.target.value })}
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
            supplierName: "",
            minDue: "",
            maxDue: "",
            minPurchase: "",
            maxPurchase: "",
            lastPurchaseDateFrom: "",
            lastPurchaseDateTo: "",
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
      navigate('/home/dashboard');
    }
  }, [state.companyID]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Due List Management</h1>
        
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
          data={supplierData}
          columns={supplierDataColumns}
          loading={loading}
          loadingTitle='Purchase Due list'
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

        {selectedAction === 'pay' && selectedSupplier && (
          <PaymentProcessModal
            partyType="supplier"
            selectedParty={{
              id:  selectedSupplier.supplierID,
              name: selectedSupplier.name,
              totalDue: selectedSupplier.totalDue,
            }}
            // selectedCustomer={selectedCustomer}
            onClose={handleModalClose}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {selectedAction === 'followup' && selectedSupplier && (
          <FollowUpModal
            selectedCustomer={selectedSupplier}
            onClose={handleModalClose}
            onScheduleFollowUp={handleScheduleFollowUp}
          />
        )}
      </div>
    </div>
  );
};

export default PurchaseDueListPage;