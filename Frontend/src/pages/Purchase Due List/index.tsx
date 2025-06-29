import React, { useEffect, useState } from "react";
import SupplierSearch from "./components/SupplierSearch";
import DueSummary from "./components/DueSummary";
import { getAuthHeaders } from "@/utils/auth";
import DataTable from "./components/Table/DataTable";
import { useToast } from "@/hooks/use-toast";
import { FaArrowLeft } from "react-icons/fa";
import { useCompanyStateGlobal } from "@/provider/companyState";
import { useNavigate } from "react-router-dom";
import PayNowForm from "./components/PayNowForm";

interface CompanyContext {
  state?: {
    companyID: string;
  };
  dispatch?: (value: { type: "SET_COMPANYID"; payload: any }) => void;
}

const PurchaseDueListPage = () => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [summary, setSummary] = useState(null);
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);
  const companyID = localStorage.getItem("companyID"); //instead paxi, context api bata linu parchaa.
  const { state, dispatch }: CompanyContext = useCompanyStateGlobal();


  const { toast } = useToast();
  const navigate = useNavigate();

  const dueColumns = [
    { key: "date", label: "Bill Date", sortable: true },
    { key: "amount", label: "Total Amount", sortable: true },
    { key: "itemDescription", label: "Item Description" },
    { key: "billAttachment", label: "Bill" },
    { key: "dueAmount", label: "Due Amount", sortable: true },
    // Add more columns as per your dues data structure
  ];

  useEffect(() => {
    if (state.companyID == "all" && state.companyID) {
      navigate("/dashboard");
    }
  }, [state.companyID]);

  const handleSubmit = async (supplier) => {
    setLoading(true);
    setSelectedSupplier(supplier);
    // Fetch summary
    try {
      // console.log('for summary of data:')
      // console.log(`${import.meta.env.REACT_APP_API_URL}/due/getPurchaseDuesSummary?supplierID=${supplier._id}&companyID=${companyID}`)
      const summaryRes = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/purchase/summary?supplierID=${supplier._id}&companyID=${companyID}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!summaryRes.ok) throw new Error("Failed to fetch summary");
      const summaryData = await summaryRes.json();
      console.log(summaryData);
      setSummary(summaryData);

      // console.log('to check the list of data:')
      // console.log(`${import.meta.env.REACT_APP_API_URL}/due/getPurchaseDuesList?supplierID=${supplier._id}&companyID=${companyID}`)
      const duesRes = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/due/getPurchaseDuesList?supplierID=${supplier._id}&companyID=${companyID}`,
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
    setSelectedSupplier(null);
    setSummary(null);
    setDues([]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Due List Management</h1>
      {!selectedSupplier && (
        <SupplierSearch
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      )}
      {selectedSupplier && (
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
      {selectedSupplier && summary && 
          <DueSummary 
            summary={summary} 
            selectedSupplier={selectedSupplier} 
            showPayForm={showPayForm} 
            setShowPayForm={setShowPayForm} 
          />}

      {selectedSupplier && showPayForm && (
        <PayNowForm
          selectedSupplier = {selectedSupplier}
          name={selectedSupplier?.name}
          totalDue={summary?.totalDueLeft}
          totalAmount={summary?.totalAmount}
          onClose={() => setShowPayForm(false)}
          onPaymentSuccess={() => handleSubmit(selectedSupplier)}
        />
      )}
      {/* {selectedSupplier && dues && <DueTable dues={dues} />} */}
      {selectedSupplier && dues && (
        <DataTable data={dues} columns={dueColumns} />
      )}
    </div>
  );
};

export default PurchaseDueListPage;
