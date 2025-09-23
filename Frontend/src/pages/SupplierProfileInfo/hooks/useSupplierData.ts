// useSupplierData.ts
// Scaffold based on useCustomerData
import { useState, useEffect } from 'react';
import { getAuthHeaders } from '@/utils/auth';


export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalDue: number;
  prevClosingBalance: number;
  totalPayment: number;
  totalPurchase: number;
  status: 'due' | 'paid' | 'overdue';
  lastPurchaseDate: string;
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

export interface PurchaseHistory {
  id: string;
  sn: number;
  date: string;
  billNo: string;
  billAttachment: string;
  dueAmount: number;
  vat: number;
  discount: number;
  discountType: string;
  itemDescription: string;
  netDueAmount: number;
}

const useSupplierData = (companyID: string | undefined, supplierID: string | undefined) => {
  const [supplier, setSupplier] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingCredit, setUpdatingCredit] = useState(false);
  const [creditError, setCreditError] = useState<string | null>(null);

  // Update credit limit and time period for customer
  const updateSupplierCreditLimit = async (creditLimitAmount: number, creditTimePeriodInDays: number) => {
    if (!supplierID) return;
    setUpdatingCredit(true);
    setCreditError(null);
    console.log('Supplier ID inside the updateCustomerCreditLimit is: ', supplierID);
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/supplier/${supplierID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ creditLimitAmount, creditTimePeriodInDays }),
      });
      if (!response.ok) throw new Error('Failed to update credit limit');
      setSupplier((prev) => prev ? { ...prev, creditLimitAmount, creditTimePeriodInDays } : prev);
      setUpdatingCredit(false);
      return true;
    } catch (err) {
      setCreditError(err instanceof Error ? err.message : 'An error occurred');
      setUpdatingCredit(false);
      return false;
    }
  };


  useEffect(() => {
    const fetchSupplierData = async () => {
      if (!companyID || !supplierID) {
        setError('CompanyID or SupplierID is missing.')
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);


        const response = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/due/getSingleSupplierCompleteData?companyID=${companyID}&supplierID=${supplierID}`,
          { headers: getAuthHeaders() }
        )

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        console.log('After fetching One Supplier Data: ', data.supplier);

        if(data.success && data.supplier) {
          const supplierData = data.supplier;
          setSupplier({
            id: supplierData.supplierID,
            name: supplierData.name,
            email: supplierData.email,
            phone: supplierData.phone,
            address: supplierData.address,
            totalDue: supplierData.totalDue,
            totalPayment: supplierData.totalPayment,
            totalPurchase: supplierData.totalPurchase,
            prevClosingBalance: supplierData.prevClosingBalance,
            status: supplierData.status,
            lastPurchaseDate: supplierData.lastPurchaseDate || '',
            lastPaymentData: supplierData.lastPaymentData || '',
            creditLimitAmount: supplierData.creditLimitAmount || null,
            creditTimePeriodInDays: supplierData.creditTimePeriodInDays || null
          })

          // fetch payment and purchase data in parallel
          await Promise.all([
            fetchPaymentHistory(companyID, supplierID),
            fetchPurchaseHistory(companyID, supplierID)
          ]);
        } else {
          setError('Failed to fetch supplier data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An Error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchPaymentHistory = async (companyID: string, supplierID: string) => {
      try {
        const response = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/payment/getPurchasePaymentList?companyID=${companyID}&supplierID=${supplierID}`,
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


    const fetchPurchaseHistory = async (companyID: string, supplierID: string) => {
      try {
        const response = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/due/getPurchaseDuesList?companyID=${companyID}&supplierID=${supplierID}`,
          { headers: getAuthHeaders() }
        );

        if (response.ok) {
          const purchaseData = await response.json();
          console.log('purchaseData is: ', purchaseData);
          if (purchaseData && Array.isArray(purchaseData)) {
            const mappedPurchase = purchaseData.map((purchase: any, index: number) => ({
              id: purchase._id,
              sn: index + 1,
              date: purchase.date,
              billNo: purchase.billNo,
              billAttachment: purchase.billAttachment,
              itemDescription: purchase.itemDescription,
              dueAmount: purchase.amount,
              vat: purchase.vat,
              discount: purchase.discount,
              discountType: purchase.discountType,
              netDueAmount: purchase.netTotalAmount,
            }));

            // for debuggging purpose:
            console.log('Purchase History is: ', purchaseData);

            setPurchaseHistory(mappedPurchase);
          }
        }
      } catch (error) {
        console.error('Error fetching purchase history:', error);
      }
    };

    fetchSupplierData();
  }, [companyID, supplierID]);


  return {
    supplier,
    paymentHistory,
    purchaseHistory,
    loading,
    error,
    updateSupplierCreditLimit,
    updatingCredit,
    creditError,
  }

}  
export default useSupplierData;
