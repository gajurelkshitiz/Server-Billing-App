// import React, { useState } from 'react';

// interface FollowUpModalProps {
//   selectedCustomer: any;
//   onClose: () => void;
//   onScheduleFollowUp: (followUpData: { type: string; notes: string }) => void;
// }

// const FollowUpModal: React.FC<FollowUpModalProps> = ({
//   selectedCustomer,
//   onClose,
//   onScheduleFollowUp
// }) => {
//   const [followUpType, setFollowUpType] = useState('Phone Call');
//   const [notes, setNotes] = useState('');

//   const handleScheduleFollowUp = () => {
//     onScheduleFollowUp({
//       type: followUpType,
//       notes: notes
//     });
//   };

//   return (
//     <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-green-800">
//             Follow Up Management
//           </h3>
//           <button 
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-xl"
//           >
//             ×
//           </button>
//         </div>
        
//         <div className="space-y-3">
//           <p className="text-gray-700">
//             <span className="font-medium">Customer:</span> {selectedCustomer.name}
//           </p>
//           <p className="text-gray-700">
//             <span className="font-medium">Last Payment:</span> {selectedCustomer.lastPaymentDate}
//           </p>
//           <p className="text-gray-700">
//             <span className="font-medium">Outstanding:</span> 
//             <span className="text-red-600 font-semibold"> ${selectedCustomer.totalDue}</span>
//           </p>
          
//           {/* Follow up form fields */}
//           <div className="pt-4 space-y-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Follow Up Type
//               </label>
//               <select 
//                 value={followUpType}
//                 onChange={(e) => setFollowUpType(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 <option>Phone Call</option>
//                 <option>Email</option>
//                 <option>Visit</option>
//                 <option>SMS</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Notes
//               </label>
//               <textarea 
//                 rows={3}
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Add follow up notes..."
//               ></textarea>
//             </div>
//           </div>
          
//           <div className="flex gap-2 pt-4">
//             <button 
//               onClick={onClose}
//               className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
//             >
//               Cancel
//             </button>
//             <button 
//               onClick={handleScheduleFollowUp}
//               className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//             >
//               Schedule Follow Up
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FollowUpModal;