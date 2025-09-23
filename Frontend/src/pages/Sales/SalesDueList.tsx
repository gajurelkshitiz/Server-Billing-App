// import React, { useEffect, useState } from "react";
// import CustomerSearch from "../Sales Due List/components/CustomerSearch";
// import DueSummary from "../Sales Due List/components/DueSummary";
// import { getAuthHeaders } from "@/utils/auth";
// import DataTable from "../Sales Due List/components/Table/DataTable";
// import { useToast } from "@/hooks/use-toast";
// import { FaArrowLeft } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useCompanyStateGlobal } from "@/provider/companyState";
// import PayNowForm from "../Sales Due List/components/PayNowForm";

// /**
//  * SalesDueList Component
//  * 
//  * This component manages the sales due list functionality within the Sales module.
//  * It provides customer search, due summary display, and payment management.
//  * 
//  * Features:
//  * - Customer search with autocomplete
//  * - Due amount summary display
//  * - Detailed due list table
//  * - Payment form integration
//  * - Back navigation support
//  * 
//  * State Management:
//  * - selectedCustomer: Currently selected customer
//  * - summary: Due amounts summary for selected customer
//  * - dues: List of due entries for selected customer
//  * - loading: Loading state for API calls
//  * - showPayForm: Controls payment form visibility
//  */

// interface CompanyContext {
//     state?: {
//         companyID: string,
//     };
//     dispatch?: (value: { type: "SET_COMPANYID", payload: any }) => void;
// }

// const SalesDueList = () => {
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [summary, setSummary] = useState(null);
//   const [dues, setDues] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showPayForm, setShowPayForm] = useState(false);
//   const companyID = localStorage.getItem('companyID'); // Company ID from localStorage
//   const { state, dispatch }: CompanyContext = useCompanyStateGlobal() // Global company state management

//   const { toast } = useToast();
//   const navigate = useNavigate();

//   // Table columns configuration for due list display
//   const dueColumns = [
//     { key: "date", label: "Bill Date", sortable: true },
//     { key: "amount", label: "Total Amount", sortable: true },
//     { key: "itemDescription", label: "Item Description" },
//     { key: "billAttachment", label: "Bill" },
//     { key: "dueAmount", label: "Due Amount", sortable: true }
//   ];

//   // Redirect to dashboard if company selection is invalid
//   useEffect(() => {
//     if (state.companyID == 'all' && state.companyID) {
//       navigate('/home/dashboard');
//     }
//   }, [state.companyID])

//   /**
//    * Handles customer selection and fetches related due data
//    * @param customer - Selected customer object
//    */
//   const handleSubmit = async (customer) => {
//     setLoading(true);
//     setSelectedCustomer(customer);
    
//     try {
//       // Fetch due summary for selected customer
//       const summaryRes = await fetch(
//         `${import.meta.env.REACT_APP_API_URL}/due/getSalesDuesSummary?customerID=${customer._id}&companyID=${companyID}`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );
//       if (!summaryRes.ok) throw new Error("Failed to fetch summary");
//       const summaryData = await summaryRes.json();
//       setSummary(summaryData);

//       // Fetch detailed due list for selected customer
//       const duesRes = await fetch(
//         `${import.meta.env.REACT_APP_API_URL}/due/getSalesDuesList?customerID=${customer._id}&companyID=${companyID}`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );
//       if (!duesRes.ok) throw new Error("Failed to fetch dues list");
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
//       <h1 className="text-3xl font-bold text-gray-900">Sales Due List Management</h1>
      
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

//       {/* Due Summary Section - Show when customer is selected and summary is available */}
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
//         />
//       )}

//       {/* Due List Table - Show when customer is selected and dues data is available */}
//       {selectedCustomer && dues && (
//         <DataTable
//           data={dues}
//           columns={dueColumns}
//         />
//       )}
//     </div>
//   );
// };

// export default SalesDueList;
