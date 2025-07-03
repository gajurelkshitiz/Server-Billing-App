import React, { useEffect, useState } from "react";
import SupplierSearch from "./components/CustomerSearch";
import DueSummary from "./components/DueSummary";
import { getAuthHeaders } from "@/utils/auth";
import DataTable from "./components/Table/DataTable";
import { useToast } from "@/hooks/use-toast";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCompanyStateGlobal, CompanyContextType } from "@/provider/companyState";
// import { sortData } from "@/utils/tableUtils";
import PaymentStatusBadge from "@/components/ui/paymentStatusBadge";
import OptionsDropdown from "./components/OptionsDropdown";
import PaymentProcessModal from "./components/PaymentProcessModal";
import FollowUpModal from "./components/FollowUpModal";

const SalesDueListPage = () => {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'pay' | 'followup' | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  const {state, dispatch}:CompanyContextType = useCompanyStateGlobal() 
  const companyID = localStorage.getItem('companyID');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle Pay action
  const handlePay = (customerData: any) => {
    setSelectedCustomer(customerData);
    setSelectedAction('pay');
    console.log('Pay action triggered for customer:', customerData);
    toast({
      title: "Payment",
      description: `Initiating payment for ${customerData.name}`,
    });
  };

  // Handle Follow Up action
  const handleFollowUp = (customerData: any) => {
    setSelectedCustomer(customerData);
    setSelectedAction('followup');
    console.log('Follow up action triggered for customer:', customerData);
    toast({
      title: "Follow Up",
      description: `Follow up scheduled for ${customerData.name}`,
      variant: "default",
    });
  };

  // Handle Process Payment
  const handleProcessPayment = () => {
    // Add your payment processing logic here
    console.log('Processing payment for:', selectedCustomer);
    toast({
      title: "Success",
      description: `Payment processed for ${selectedCustomer.name}`,
    });
    setSelectedAction(null);
  };

  // Handle Schedule Follow Up
  const handleScheduleFollowUp = (followUpData: { type: string; notes: string }) => {
    // Add your follow up scheduling logic here
    console.log('Scheduling follow up for:', selectedCustomer, followUpData);
    toast({
      title: "Follow Up Scheduled",
      description: `${followUpData.type} follow up scheduled for ${selectedCustomer.name}`,
    });
    setSelectedAction(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setSelectedAction(null);
    setSelectedCustomer(null);
  };

  const customerDataColumns = [
    { key: "sn", label: "S.N."},
    { key: "name", label: "Customer Name", sortable: true },
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

  useEffect(() => {
    if (state.companyID === 'all' && state.companyID) {
      navigate('/dashboard');
    }
  }, [state.companyID]);
  
  // TODO: State.companyID is not getting companyID value during initial render. Please fix this error
  console.log('company ID from the companyID',state.companyID); 

  // Fetch customer complete data function
  const fetchCustomerCompleteData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/due/getAllCustomerCompleteData?companyID=${companyID}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch customer Data");
      const data = await response.json();
      console.log('getAllCustomersData', data);
      setCustomerData(data.customers);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customer data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerCompleteData();
  }, []);

  return (
    <div className="space-y-6 relative">
      <h1 className="text-3xl font-bold text-gray-900">Sales Due List Management</h1>
      
      {/* Table Container */}
      <div className="relative overflow-visible">
        <DataTable
          data={customerData}
          columns={customerDataColumns}
        />

        {/* Payment Process Modal */}
        {selectedAction === 'pay' && selectedCustomer && (
          <PaymentProcessModal
            selectedCustomer={selectedCustomer}
            onClose={handleModalClose}
            onProcessPayment={handleProcessPayment}
          />
        )}

        {/* Follow Up Modal */}
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