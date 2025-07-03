import React, { useState } from 'react';
import { useCompanyStateGlobal, CompanyContextType } from "@/provider/companyState";
import { getAuthHeaders } from "@/utils/auth";

interface PaymentProcessModalProps {
  selectedCustomer: any;
  onClose: () => void;
  onProcessPayment: (paymentData: PaymentData) => void;
}

interface PaymentData {
  amountPaid: number;
  paymentMode: string;
  remarks: string;
}

const PaymentProcessModal: React.FC<PaymentProcessModalProps> = ({
  selectedCustomer,
  onClose,
  onProcessPayment
}) => {
  const { state, dispatch }: CompanyContextType = useCompanyStateGlobal();
  
  const [formData, setFormData] = useState<PaymentData>({
    amountPaid: 0,
    paymentMode: '',
    remarks: ''
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const paymentModes = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'cheque', label: 'Cheque', icon: '🏦' },
    { value: 'bank', label: 'Bank Transfer', icon: '🏛️' },
    { value: 'wallet', label: 'Digital Wallet', icon: '📱' },
    { value: 'other', label: 'Other', icon: '💳' }
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.amountPaid || formData.amountPaid <= 0) {
      newErrors.amountPaid = 'Amount must be greater than 0';
    } else if (formData.amountPaid > selectedCustomer.totalDue) {
      newErrors.amountPaid = 'Amount cannot be greater than total due';
    }
    
    if (!formData.paymentMode) {
      newErrors.paymentMode = 'Please select a payment mode';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PaymentData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addNewPaymentHandler = async (paymentData: PaymentData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/payment/customer`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          customerID: selectedCustomer.customerID,
          customerName: selectedCustomer.name,
          companyID: state.companyID, // Assuming you have companyId in state
          amountPaid: paymentData.amountPaid,
          paymentMode: paymentData.paymentMode,
          remarks: paymentData.remarks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process payment');
      }

      const result = await response.json();
      console.log('Payment processed successfully:', result);
      
      // Call the parent component's callback
      onProcessPayment(paymentData);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      // You might want to show an error message to the user
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await addNewPaymentHandler(formData);
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
              <span className="text-red-600 font-semibold"> ${selectedCustomer.totalDue}</span>
            </p>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            {/* Amount to Pay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount to Pay <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.amountPaid || ''}
                  onChange={(e) => handleInputChange('amountPaid', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.amountPaid ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max={selectedCustomer.totalDue}
                />
              </div>
              {errors.amountPaid && (
                <p className="text-red-500 text-xs mt-1">{errors.amountPaid}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Maximum: ${selectedCustomer.totalDue}
              </p>
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Mode <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.paymentMode}
                onChange={(e) => handleInputChange('paymentMode', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.paymentMode ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select payment mode</option>
                {paymentModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.icon} {mode.label}
                  </option>
                ))}
              </select>
              {errors.paymentMode && (
                <p className="text-red-500 text-xs mt-1">{errors.paymentMode}</p>
              )}
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Additional notes (optional)"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!formData.amountPaid || !formData.paymentMode || isLoading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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