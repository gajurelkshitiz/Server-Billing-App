import React, { useEffect, useState } from "react";
import SupplierSearch from "./components/CustomerSearch";
import DueSummary from "./components/DueSummary";
import { getAuthHeaders } from "@/utils/auth";
import DataTable from "./components/Table/DataTable";
import { useToast } from "@/hooks/use-toast";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCompanyStateGlobal } from "@/provider/companyState";
import PayNowForm from "./components/PayNowForm";


interface CompanyContext {
    state?: {
        companyID: string,
    };
    dispatch?: (value: { type: "SET_COMPANYID", payload: any }) =>  void;

}

const SalesPaymentListPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [summary, setSummary] = useState(null);
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);
  const companyID = localStorage.getItem('companyID'); //instead paxi, context api bata linu parchaa.
  const {state, dispatch}:CompanyContext = useCompanyStateGlobal() // for navigation to the login page aaile lai, paxi aru kaam ma use hunxa hola

  const { toast } = useToast();
  const navigate = useNavigate();

  const dueColumns = [
  { key: "createdAt", label: "Payment Date", sortable: true },
  { key: "amountPaid", label: "Amount Paid", sortable: true },
  { key: "paymentMode", label: "Payment Mode", sortable: true},
  { key: "remarks", label: "Remarks"}
  // Add more columns as per your dues data structure
  ];

  useEffect(() => {
    if (state.companyID == 'all' && state.companyID) {
      navigate('/dashboard');
    }
  },[state.companyID])


  const handleSubmit = async (customer) => {
    setLoading(true);
    setSelectedCustomer(customer);
    // Fetch summary
    try {
      // console.log('for summary of data:')
      // console.log(`${import.meta.env.REACT_APP_API_URL}/due/getPurchaseDuesSummary?customerID=${customer._id}&companyID=${companyID}`)
      const summaryRes = await fetch(
      `${import.meta.env.REACT_APP_API_URL}/sales/summary?customerID=${customer._id}&companyID=${companyID}`,
      {
        headers: getAuthHeaders(),
      }
      );
      if (!summaryRes.ok) throw new Error("Failed to fetch summary");
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      // console.log('to check the list of data:')
      // console.log(`${import.meta.env.REACT_APP_API_URL}/due/getPurchaseDuesList?customerID=${customer._id}&companyID=${companyID}`)
      const duesRes = await fetch(
      `${import.meta.env.REACT_APP_API_URL}/payment/getSalesPaymentList?customerID=${customer._id}&companyID=${companyID}`,
      {
        headers: getAuthHeaders(),
      }
      );
      if (!duesRes.ok) throw new Error("Failed to fetch dues list");
      const duesData = await duesRes.json();
      setDues(duesData || []);
    } catch (error: any) {
      // Replace with your toast implementation
      toast({
        title: "Error",
        description: `Failed to display: ${error.message}`,
        variant: "destructive",
      });
      // window?.toast?.error?.(error.message || "An error occurred");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setSelectedCustomer(null);
    setSummary(null);
    setDues([]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Sales Payment List Management</h1>
      {!selectedCustomer && (
        <SupplierSearch onSubmit={handleSubmit} onCancel={handleCancel} loading={loading} />
      )}
      {selectedCustomer && (
        <button
          className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 transition-colors"
          onClick={handleCancel}
          type="button"
        >
          <span>
            <FaArrowLeft size={20} />
          </span>
          <span>Back</span>
        </button>
      )}

      {selectedCustomer && summary && 
          <DueSummary 
            summary={summary} 
            selectedCustomer={selectedCustomer} 
            showPayForm={showPayForm} 
            setShowPayForm={setShowPayForm} 
            />}

      {/* {selectedSupplier && !showPayForm && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={() => setShowPayForm(true)}
        >
          Pay Now
        </button>
      )} */}

      {selectedCustomer && showPayForm && (
        <PayNowForm
          selectedCustomer = {selectedCustomer}
          name={selectedCustomer?.name}
          totalDue={summary?.totalDueLeft}
          totalAmount={summary?.totalAmount}
          onClose={() => setShowPayForm(false)}
          onPaymentSuccess={() => handleSubmit(selectedCustomer)}
        />
      )}

      {selectedCustomer && dues && (
        <DataTable
          data={dues}
          columns={dueColumns}
        />
      )}
    </div>
  );
};

export default SalesPaymentListPage;