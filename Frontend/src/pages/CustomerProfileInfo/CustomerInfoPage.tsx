import React from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, ShoppingBag, ArrowLeft, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCustomerData } from '@/pages/CustomerProfileInfo/hooks/useCustomerData';
import CustomerInfoHeader from '@/pages/CustomerProfileInfo/components/CustomerInfoHeader';
import FinancialOverview from '@/pages/CustomerProfileInfo/components/FinancialOverview';
import DataTable from '@/pages/CustomerProfileInfo/components/DataTable';

const CustomerInfoPage: React.FC = () => {
  const { companyID, customerID } = useParams<{ companyID: string; customerID: string }>();
  const { customer, paymentHistory, salesHistory, loading, error } = useCustomerData(companyID, customerID);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading customer information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-red-600 text-2xl font-bold">Error</div>
            <div className="text-muted-foreground">{error}</div>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center space-y-4">
            <div className="text-xl font-semibold">Customer not found</div>
            <div className="text-muted-foreground">The requested customer could not be found</div>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
    { 
      key: 'discount', 
      header: 'Discount', 
      render: (discount: number, row: any) => {
        const displayValue = row.discountType === 'percentage' 
          ? `${discount}%` 
          : `Rs.${discount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}`;
        
        return (
          <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
            {displayValue}
          </span>
        );
      },
      width: '100px'
    },
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
      render: (attachment: string) => (
        attachment ? (
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
        )
      ),
      width: '100px'
    }
  ];

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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Customer Basic Info */}
        <CustomerInfoHeader customer={customer} />
        
        {/* Financial Overview */}
        <FinancialOverview customer={customer} />

        {/* Transaction Tables */}
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
  );
};

export default CustomerInfoPage;