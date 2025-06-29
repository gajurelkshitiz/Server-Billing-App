import React, { useState } from "react";
import { getAuthHeaders } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import { useCompanyStateGlobal } from "@/provider/companyState";

interface CompanyContext {
    state?: {
        companyID: string,
    };
    dispatch?: (value: { type: "SET_COMPANYID", payload: any }) =>  void;

}

const paymentModes = ["Bank", "Wallet", "Cheque", "Cash", "Other"];

const PayNowForm = ({ name, selectedSupplier, totalDue, totalAmount, onClose, onPaymentSuccess }) => {
  const [amountPaid, setAmountPaid] = useState("");
  const [mode, setMode] = useState(paymentModes[0]);
  const [remarks, setRemarks] = useState("");
  const {state, dispatch}:CompanyContext = useCompanyStateGlobal()

  const { toast } = useToast();


  const addNewCustomerPaymentHandler = async () => {
    const url = `${import.meta.env.REACT_APP_API_URL}/payment/supplier`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          supplierID: selectedSupplier._id,
          supplierName: selectedSupplier.name,
          companyID: state.companyID,
          totalDueLeft: totalDue,
          amountPaid: amountPaid,
          paymentMode: mode,
          remarks: remarks,
        }),
      });
      const res_data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `${selectedSupplier.name} Payment was Successfully.`,
        });
        // fetchFiscalYears();
        
        // TODO: close the model
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to create Payment: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create Payment",
        variant: "destructive",
      });
      return false;
    }
  };


  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (!isNaN(val) && Number(val) <= Number(totalDue)) {
      setAmountPaid(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log()
    // Add backend logic here
    const success = await addNewCustomerPaymentHandler();
    if (success) {
      onClose();
      // Refresh the data after successful payment
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    }
  };

  return (
    <form
      className="bg-white p-4 rounded shadow space-y-4"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-3 gap-5">
        {/* First row */}
        <div className="col-span-1">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            disabled
            className="w-full border rounded px-2 py-1 text-gray-500 bg-white"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-semibold">Total Due Left</label>
          <input
            type="text"
            value={totalDue}
            disabled
            className="w-full border rounded px-2 py-1 text-gray-500 bg-white font-semibold"
          />
        </div>
        {/* Remarks spans two rows */}
        <div
          className="row-span-2 col-span-1 flex flex-col h-full"
          style={{ height: "105px" }} // Adjust this value as needed
        >
          <label className="block text-sm font-medium">Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border rounded px-2 py-1 flex-1 resize-none align-top"
            style={{ minHeight: "100%", verticalAlign: "top" }}
          />
        </div>
        {/* Second row */}
        <div className="col-span-1">
          <label className="block text-sm font-medium">Amount To Pay</label>
          <input
            type="number"
            value={amountPaid}
            onChange={handleAmountChange}
            max={totalDue}
            min={1}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium">Mode of Payment</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            {paymentModes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default PayNowForm;