import React, { useEffect, useState } from "react";
import { getAuthHeaders } from "@/utils/auth";
import DataTable from "@/components/shared/Table/DataTable";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { useCompanyStateGlobal } from "@/provider/companyState";
import PaymentStatusBadge from "@/components/ui/paymentStatusBadge";
import OptionsDropdown from "./components/OptionsDropdown";
import PaymentProcessModal from "./components/PaymentProcessModal";
import FollowUpModal from "./components/FollowUpModal";

const SalesDueListPage = () => {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading to true
  const [selectedAction, setSelectedAction] = useState<'pay' | 'followup' | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  const { state } = useCompanyStateGlobal();
  const companyID = localStorage.getItem('companyID');
  const { toast } = useToast();
  const navigate = useNavigate();

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
    // Handle follow-up scheduling logic here
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
    return
  }

  const handleEdit = () => {
    return
  }

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
    if (state.companyID === 'all') {
      navigate('/dashboard');
    }
  }, [state.companyID]);

  useEffect(() => {
    fetchCustomerCompleteData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Sales Due List Management</h1>
      
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