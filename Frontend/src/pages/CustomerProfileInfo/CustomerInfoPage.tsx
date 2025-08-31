import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, ShoppingBag, ArrowLeft, Download, Printer, DollarSign, UserCheck } from 'lucide-react';
import { MdTableRows } from "react-icons/md";
import { Button } from '@/components/ui/button';
import { useCustomerData } from '@/pages/CustomerProfileInfo/hooks/useCustomerData';
import CustomerInfoHeader from '@/pages/CustomerProfileInfo/components/CustomerInfoHeader';
import FinancialOverview from '@/pages/CustomerProfileInfo/components/FinancialOverview';
import DataTable from '@/pages/CustomerProfileInfo/components/DataTable';
import AdditionalDocuments from '@/pages/CustomerProfileInfo/components/AdditionalDocuments';
import PaymentProcessModal from '@/components/shared/PaymentProcessModal';
import FollowUpModal from '@/components/shared/FollowUpModal';
import { useToast } from '@/hooks/use-toast';
import BillPreviewModal from '@/components/common/BillPreviewModal';
import LedgerTable from '@/pages/CustomerProfileInfo/components/LedgerTable';

const CustomerInfoPage: React.FC = () => {
  const { companyID, customerID } = useParams<{ companyID: string; customerID: string }>();
  const { customer, paymentHistory, salesHistory, loading, error } = useCustomerData(companyID, customerID);
  const { toast } = useToast();
  
  const [selectedAction, setSelectedAction] = useState<'pay' | 'followup' | null>(null);
  const mode = localStorage.getItem('mode');
  const [previewSalesEntryId, setPreviewSalesEntryId] = useState<string | null>(null);
  const [isBillPreviewOpen, setIsBillPreviewOpen] = useState(false);

  // Ledger modal state
  const [showLedger, setShowLedger] = useState(false);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [ledgerData, setLedgerData] = useState<any>(null);

  // for debug purpose:
  // console.log('companyID and customerID are: ', companyID, customerID);
  // console.log('Customer object is: ', customer);

  const handlePay = () => {
    setSelectedAction('pay');
  };

  const handleFollowUp = () => {
    setSelectedAction('followup');
  };

  const handlePaymentSuccess = () => {
    window.location.reload();
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
  };

  const handlePreview = (salesEntryId: string) => {
    setPreviewSalesEntryId(salesEntryId);
    setIsBillPreviewOpen(true);
  };

  // Fetch ledger data when View Ledger is clicked
  const handleViewLedger = async () => {
    if (!customerID) return;
    setLedgerLoading(true);
    setShowLedger(true);
    
    try {
      const res = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/ledger/customers/${customerID}`
      );
      if (!res.ok) throw new Error("Failed to fetch ledger data");
      const data = await res.json();
      console.log('ledger data is: ', data);
      setLedgerData(data);
    } catch (err: any) {
      setLedgerData(null);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch ledger data",
        variant: "destructive"
      });
    } finally {
      setLedgerLoading(false);
    }
  };

  const handleCloseLedger = () => {
    setShowLedger(false);
    setLedgerData(null);
  };

  const paymentColumns = [
    { 
      key: 'sn', 
      header: 'S.N.', 
      className: 'font-medium text-muted-foreground',
      width: '80px'
    },
    { 
      key: 'date', 
      header: 'Date', 
      render: (date: string) => (
        <span className="font-medium">
          {new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
      width: '120px'
    },
    { 
      key: 'amount', 
      header: 'Amount', 
      render: (amount: number) => (
        <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
          Rs.{amount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}
        </span>
      ),
      width: '140px'
    },
    { 
      key: 'method', 
      header: 'Payment Method',
      render: (method: string) => {
        // Payment method mapping with images
        const paymentModes: { [key: string]: { label: string; logo: string } } = {
          'fonepay': { label: 'FonePay', logo: '/paymentDropdown/fone pay.png' },
          'esewa': { label: 'eSewa', logo: '/paymentDropdown/esewa.png' },
          'khalti': { label: 'Khalti', logo: '/paymentDropdown/khalti.jpeg' },
          'bank': { label: 'Bank Transfer', logo: '/paymentDropdown/Bank.jpg' },
          'cash': { label: 'Cash', logo: '/paymentDropdown/cash.jpeg' },
          'cheque': { label: 'Cheque', logo: '/paymentDropdown/cheque.jpeg' },
          'connectips': { label: 'ConnectIPS', logo: '/paymentDropdown/connect_IPS.png' },
          'card': { label: 'Card', logo: '/paymentDropdown/card.jpeg' },
          'other': { label: 'Other', logo: '/paymentDropdown/other.png' }
        };

        const paymentMode = paymentModes[method.toLowerCase()] || paymentModes['other'];
        
        return (
          <div className="inline-flex items-center gap-1 px-2.5 py-1.5 ">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white p-0.5">
              <img 
                src={paymentMode.logo} 
                alt={paymentMode.label}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-medium">
              {paymentMode.label}
            </span>
          </div>
        );
      }
    },
    { 
      key: 'remarks', 
      header: 'Remarks',
      render: (remarks: string) => (
        <span className="text-muted-foreground text-sm">
          {remarks || 'No remarks'}
        </span>
      )
    }
  ];

  const salesColumns = [
    { 
      key: 'sn', 
      header: 'S.N.', 
      className: 'font-medium text-muted-foreground',
      width: '80px'
    },
    { 
      key: 'date', 
      header: 'Date', 
      render: (date: string) => (
        <span className="font-medium">
          {new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
      width: '120px'
    },
    { 
      key: 'billNo', 
      header: 'Bill No', 
      render: (billNo: string) => (
        <span className="font-mono font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {billNo}
        </span>
      ),
      width: '120px'
    },
    { 
      key: 'itemDescription', 
      header: 'Description',
      render: (description: string) => (
        <span className="text-sm line-clamp-2" title={description}>
          {description}
        </span>
      )
    },
    { 
      key: 'amount', 
      header: 'Amount', 
      render: (amount: number) => (
        <span className="font-semibold text-blue-600">
          Rs.{amount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}
        </span>
      ),
      width: '120px'
    },
    { 
      key: 'vat', 
      header: 'VAT', 
      render: (vat: number) => (
        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
          {vat}%
        </span>
      ),
      width: '80px'
    },
    // { 
    //   key: 'discount', 
    //   header: 'Discount', 
    //   render: (discount: number, row: any) => {
    //     const displayValue = row.discountType === 'percentage' 
    //       ? `${discount}%` 
    //       : `Rs.${discount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}`;
        
    //     return (
    //       <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
    //         {displayValue}
    //       </span>
    //     );
    //   },
    //   width: '100px'
    // },
    { 
      key: 'netTotalAmount', 
      header: 'Net Total', 
      render: (amount: number) => (
        <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
          Rs.{amount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}
        </span>
      ),
      width: '140px'
    },
    { 
      key: 'billAttachment', 
      header: 'Attachment',
      render: (attachment: string, row: any) => {
        if (mode === 'computerized') {
          const salesEntryId = row.computerizedSalesEntryID || row.salesEntryId || row.id ;
          // console.log('row in Attachment column: ', row);
          // console.log('salesEntryId = row.computerizedSalesEntryID || row.salesEntryId || row._id', salesEntryId);
          return salesEntryId ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3"
              onClick={() => handlePreview(salesEntryId)}
            >
              Preview
            </Button>
          ) : (
            <span className="text-muted-foreground text-xs">No file</span>
          );
        }
        return attachment ? (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 px-3"
          >
            <a 
              href={attachment} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View
            </a>
          </Button>
        ) : (
          <span className="text-muted-foreground text-xs">No file</span>
        );
      },
      width: '100px'
    }
  ];

  // Show loading spinner while data is loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <span className="text-lg text-muted-foreground">Loading customer data...</span>
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <span className="text-lg text-red-600">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.history.back()}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Customer Profile</h1>
              <p className="text-muted-foreground mt-1">
                Complete customer information and transaction history
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Ledger Button */}
            <Button 
              onClick={handleViewLedger}
              className="p-2 text-sm font-medium text-white border-green-600 hover:border-green-700 bg-cyan-600 hover:bg-cyan-700 shadow-sm transition-colors"
            >
              <MdTableRows className="h-4 w-4 mr-2" />
              View Ledger
            </Button>

            {/* Pay Now Button - Only show if customer has dues */}
            {customer.totalDue > 0 && (
              <Button 
                onClick={handlePay}
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 transition-colors duration-200 shadow-sm"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            )}
            
            {/* Follow Up Button */}
            <Button 
              onClick={handleFollowUp}
              className="p-2 text-sm font-medium text-white border-green-600 hover:border-green-700 bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Follow Up
            </Button>
          </div>
        </div>

        {/* Render LedgerTable below the header when showLedger is true */}
        {showLedger && (
          <div className="my-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">Customer Ledger</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseLedger}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Close Ledger
              </Button>
            </div>
            {/* Show loading spinner while fetching ledger */}
            {ledgerLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                <span className="text-lg text-muted-foreground">Loading ledger...</span>
              </div>
            ) : ledgerData ? (
              <LedgerTable ledger={ledgerData} onClose={handleCloseLedger} />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No ledger data available.
              </div>
            )}
          </div>
        )}

        {/* Customer Basic Info */}
        <CustomerInfoHeader customer={customer} />
        
        {/* Financial Overview */}
        <FinancialOverview customer={customer} />

        {/* Additional Documents Section */}
        <AdditionalDocuments customerId={customerID || ''} />

        {/* Transaction Tables */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Transaction History</h2>
            <div className="space-y-8">
              <DataTable
                title="Payment History"
                data={paymentHistory}
                columns={paymentColumns}
                icon={<CreditCard className="h-5 w-5" />}
                emptyMessage="No payments recorded yet"
              />

              <DataTable
                title="Sales History"
                data={salesHistory}
                columns={salesColumns}
                icon={<ShoppingBag className="h-5 w-5" />}
                emptyMessage="No sales transactions found"
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        {selectedAction === 'pay' && customer && (
          <PaymentProcessModal
            selectedCustomer={customer}
            onClose={handleModalClose}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {selectedAction === 'followup' && customer && (
          <FollowUpModal
            selectedCustomer={customer}
            onClose={handleModalClose}
            onScheduleFollowUp={handleScheduleFollowUp}
          />
        )}

        {mode === 'computerized' && (
          <BillPreviewModal
            isOpen={isBillPreviewOpen}
            onClose={() => setIsBillPreviewOpen(false)}
            salesEntryId={previewSalesEntryId || ''}
            title="Bill Preview"
          />
        )}
      </div>
    </div>
  );
};

export default CustomerInfoPage;