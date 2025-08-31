// import React, { useEffect, useState } from "react";
// import CustomerSearch from "../Sales Payment List/components/CustomerSearch";
// import DueSummary from "../Sales Payment List/components/DueSummary";
// import { getAuthHeaders } from "@/utils/auth";
// import DataTable from "../Sales Payment List/components/Table/DataTable";
// import { useToast } from "@/hooks/use-toast";
// import { FaArrowLeft } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useCompanyStateGlobal } from "@/provider/companyState";
// import PayNowForm from "../Sales Payment List/components/PayNowForm";

// /**
//  * SalesPaymentList Component
//  * 
//  * This component manages the sales payment list functionality within the Sales module.
//  * It provides customer search, payment summary display, and payment history management.
//  * 
//  * Features:
//  * - Customer search with autocomplete
//  * - Payment summary display for selected customer
//  * - Detailed payment history table
//  * - Payment form integration for new payments
//  * - Back navigation support
//  * 
//  * State Management:
//  * - selectedCustomer: Currently selected customer
//  * - summary: Payment summary for selected customer
//  * - dues: List of payment entries for selected customer (using 'dues' for consistency)
//  * - loading: Loading state for API calls
//  * - showPayForm: Controls payment form visibility
//  */

// interface CompanyContext {
//     state?: {
//         companyID: string,
//     };
//     dispatch?: (value: { type: "SET_COMPANYID", payload: any }) => void;
// }

// const SalesPaymentList = () => {
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [summary, setSummary] = useState(null);
//   const [dues, setDues] = useState([]); // Using 'dues' for consistency with original code
//   const [loading, setLoading] = useState(false);
//   const [showPayForm, setShowPayForm] = useState(false);
//   const companyID = localStorage.getItem('companyID'); // Company ID from localStorage
//   const { state, dispatch }: CompanyContext = useCompanyStateGlobal() // Global company state management

//   const { toast } = useToast();
//   const navigate = useNavigate();

//   // Table columns configuration for payment list display
//   const dueColumns = [
//     { key: "createdAt", label: "Payment Date", sortable: true },
//     { key: "amountPaid", label: "Amount Paid", sortable: true },
//     { key: "paymentMode", label: "Payment Mode", sortable: true },
//     { key: "remarks", label: "Remarks" }
//   ];

//   // Redirect to dashboard if company selection is invalid
//   useEffect(() => {
//     if (state.companyID == 'all' && state.companyID) {
//       navigate('/dashboard');
//     }
//   }, [state.companyID])

//   /**
//    * Handles customer selection and fetches related payment data
//    * @param customer - Selected customer object
//    */
//   const handleSubmit = async (customer) => {
//     setLoading(true);
//     setSelectedCustomer(customer);
    
//     try {
//       // Fetch payment summary for selected customer
//       const summaryRes = await fetch(
//         `${import.meta.env.REACT_APP_API_URL}/payment/getSalesPaymentSummary?customerID=${customer._id}&companyID=${companyID}`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );
//       if (!summaryRes.ok) throw new Error("Failed to fetch summary");
//       const summaryData = await summaryRes.json();
//       setSummary(summaryData);

//       // Fetch detailed payment list for selected customer
//       const duesRes = await fetch(
//         `${import.meta.env.REACT_APP_API_URL}/payment/getSalesPaymentList?customerID=${customer._id}&companyID=${companyID}`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );
//       if (!duesRes.ok) throw new Error("Failed to fetch payment list");
//       const duesData = await duesRes.json();
//       setDues(duesData || []);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: `Failed to display: ${error.message}`,
//         variant: "destructive",
//       });
//     }
//     setLoading(false);
//   };

//   /**
//    * Handles cancellation and resets all states
//    */
//   const handleCancel = () => {
//     setSelectedCustomer(null);
//     setSummary(null);
//     setDues([]);
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-gray-900">Sales Payment List Management</h1>
      
//       {/* Customer Search Section - Only show when no customer is selected */}
//       {!selectedCustomer && (
//         <CustomerSearch onSubmit={handleSubmit} onCancel={handleCancel} loading={loading} />
//       )}
      
//       {/* Back Button - Show when customer is selected */}
//       {selectedCustomer && (
//         <button
//           className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 transition-colors"
//           onClick={handleCancel}
//           type="button"
//         >
//           <span>
//             <FaArrowLeft size={20} />
//           </span>
//           <span>Back</span>
//         </button>
//       )}

//       {/* Payment Summary Section - Show when customer is selected and summary is available */}
//       {selectedCustomer && summary && 
//         <DueSummary 
//           summary={summary} 
//           selectedCustomer={selectedCustomer} 
//           showPayForm={showPayForm} 
//           setShowPayForm={setShowPayForm} 
//         />
//       }

//       {/* Payment Form Section - Show when payment form is active */}
//       {selectedCustomer && showPayForm && (
//         <PayNowForm
//           selectedCustomer={selectedCustomer}
//           name={selectedCustomer?.name}
//           totalDue={summary?.totalDueAmount}
//           totalAmount={summary?.totalAmount}
//           onClose={() => setShowPayForm(false)}
//           onPaymentSuccess={() => handleSubmit(selectedCustomer)} // this was added just to remove the error, not require here 
//         />
//       )}

//       {/* Payment List Table - Show when customer is selected and payment data is available */}
//       {selectedCustomer && dues && (
//         <DataTable
//           data={dues}
//           columns={dueColumns}
//         />
//       )}
//     </div>
//   );
// };

// export default SalesPaymentList;
