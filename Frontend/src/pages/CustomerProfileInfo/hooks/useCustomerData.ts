import { useState, useEffect } from 'react';
import { getAuthHeaders } from '@/utils/auth';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalDue: number;
  prevClosingBalance: number;
  totalPayment: number;
  totalSales: number;
  status: 'due' | 'paid' | 'overdue';
  lastSalesDate: string;
  lastPaymentDate: string;
  creditLimitAmount?: Number;
  creditTimePeriodInDays?: Number;
}

export interface PaymentHistory {
  id: string;
  sn: number;
  date: string;
  amount: number;
  method: string;
  remarks: string;
}

export interface SalesHistory {
  id: string;
  sn: number;
  date: string;
  billNo: string;
  billAttachment: string;
  amount: number;
  vat: number;
  discount: number;
  discountType: string;
  itemDescription: string;
  netTotalAmount: number;
}

export const useCustomerData = (companyID: string | undefined, customerID: string | undefined) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [salesHistory, setSalesHistory] = useState<SalesHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingCredit, setUpdatingCredit] = useState(false);
  const [creditError, setCreditError] = useState<string | null>(null);

  // Update credit limit and time period for customer
  const updateCustomerCreditLimit = async (creditLimitAmount: number, creditTimePeriodInDays: number) => {
    if (!customerID) return;
    setUpdatingCredit(true);
    setCreditError(null);
    console.log('Customer ID inside the updateCustomerCreditLimit is: ', customerID);
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/customer/${customerID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ creditLimitAmount, creditTimePeriodInDays }),
      });
      if (!response.ok) throw new Error('Failed to update credit limit');
      setCustomer((prev) => prev ? { ...prev, creditLimitAmount, creditTimePeriodInDays } : prev);
      setUpdatingCredit(false);
      return true;
    } catch (err) {
      setCreditError(err instanceof Error ? err.message : 'An error occurred');
      setUpdatingCredit(false);
      return false;
    }
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      // for debugging:
      console.log("fetch customer data request received.");

      if (!companyID || !customerID) {
        setError('Company ID or Customer ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch customer basic data
        const response = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/due/getSingleCustomerCompleteData?companyID=${companyID}&customerID=${customerID}`,
          { headers: getAuthHeaders() }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        console.log('After fetching One Customer Data: ', data.customer);

        if (data.success && data.customer) {
          const customerData = data.customer;
          setCustomer({
            id: customerData.customerID,
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            address: customerData.address,
            totalDue: customerData.totalDue,
            totalPayment: customerData.totalPayments,
            totalSales: customerData.totalSales,
            prevClosingBalance: customerData.prevClosingBalance,
            status: customerData.status,
            lastSalesDate: customerData.lastSaleDate || '',
            lastPaymentDate: customerData.lastPaymentDate || '',
            creditLimitAmount: customerData.creditLimitAmount || null,
            creditTimePeriodInDays: customerData.creditTimePeriodInDays || null
          });

          // Fetch payment and sales data in parallel
          await Promise.all([
            fetchPaymentHistory(companyID, customerID),
            fetchSalesHistory(companyID, customerID)
          ]);
        } else {
          setError('Failed to fetch customer data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchPaymentHistory = async (companyID: string, customerID: string) => {
      try {
        const response = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/payment/getSalesPaymentList?companyID=${companyID}&customerID=${customerID}`,
          { headers: getAuthHeaders() }
        );

        if (response.ok) {
          const paymentData = await response.json();
          if (paymentData) {
            const mappedPayments = paymentData.map((payment: any, index: number) => ({
              id: payment._id || index.toString(),
              sn: index + 1,
              date: payment.createdAt,
              amount: payment.amountPaid,
              method: payment.paymentMode,
              remarks: payment.remarks
            }));
            setPaymentHistory(mappedPayments);
          }
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };

    const fetchSalesHistory = async (companyID: string, customerID: string) => {
      try {
        const response = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/due/getSalesDuesList?companyID=${companyID}&customerID=${customerID}`,
          { headers: getAuthHeaders() }
        );

        if (response.ok) {
          const salesData = await response.json();
          if (salesData && Array.isArray(salesData)) {
            const mappedSales = salesData.map((sale: any, index: number) => ({
              id: sale._id,
              sn: index + 1,
              date: sale.date,
              billNo: sale.billNo,
              billAttachment: sale.billAttachment,
              itemDescription: sale.itemDescription,
              amount: sale.amount,
              vat: sale.vat,
              discount: sale.discount,
              discountType: sale.discountType,
              netTotalAmount: sale.netTotalAmount,
            }));
            setSalesHistory(mappedSales);
          }
        }
      } catch (error) {
        console.error('Error fetching sales history:', error);
      }
    };

    fetchCustomerData();
  }, [companyID, customerID]);


  return {
    customer,
    paymentHistory,
    salesHistory,
    loading,
    error,
    updateCustomerCreditLimit,
    updatingCredit,
    creditError,
  };
};