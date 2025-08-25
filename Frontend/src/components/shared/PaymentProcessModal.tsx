import React, { useState } from 'react';
import { useCompanyStateGlobal } from "@/provider/companyState";
import { getAuthHeaders } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import PaymentModeDropdown from "@/components/customUI/PaymentModeDropdown";

interface PaymentProcessModalProps {
  selectedCustomer: any;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentProcessModal: React.FC<PaymentProcessModalProps> = ({
  selectedCustomer,
  onClose,
  onSuccess
}) => {
  const { state } = useCompanyStateGlobal();
  const { toast } = useToast();
  
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentMode, setPaymentMode] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Basic validation
    if (!amountPaid || amountPaid <= 0 || !paymentMode) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (amountPaid > selectedCustomer.totalDue) {
      toast({
        title: "Error",
        description: "Amount cannot be greater than total due",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/payment/customer`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          customerID: selectedCustomer.customerID || selectedCustomer.id,
          customerName: selectedCustomer.name,
          companyID: state.companyID,
          amountPaid,
          paymentMode,
          remarks,
        }),
      });

      if (!response.ok) throw new Error('Failed to process payment');

      toast({
        title: "Success",
        description: `Payment of Rs.${amountPaid} processed successfully`,
      });
      
      onSuccess();
      onClose();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-blue-800">
            Process Payment
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Customer:</span> {selectedCustomer.name}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Company:</span> {state.companyName}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Total Due:</span> 
              <span className="text-red-600 font-semibold"> Rs.{selectedCustomer.totalDue}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount *</label>
            <input
              type="number"
              value={amountPaid || ''}
              onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              max={selectedCustomer.totalDue}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Mode *</label>
            <PaymentModeDropdown 
              value={paymentMode}
              onChange={setPaymentMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Optional notes"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {isLoading ? 'Processing...' : 'Process Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessModal; 