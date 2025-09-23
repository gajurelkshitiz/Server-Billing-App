// import React from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { useState } from "react";
// type Props = {
//   columns: any;
//   setSortField: any;
//   setSortDirection: any;
//   sortDirection: any;
//   sortField: any;
// };

// const TableH = (props: Props) => {
//   const { setSortField, setSortDirection, columns, sortDirection, sortField } =
//     props;

//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };
//   return (
//     <thead>
//       <tr className="border-b">
//         {columns.map((column) => (
//           <th
//             key={column.key}
//             className="text-left py-3 px-4 font-semibold cursor-pointer hover:bg-gray-50"
//             onClick={() => column.sortable && handleSort(column.key)}
//           >
//             <div className="flex items-center space-x-1">
//               <span>{column.label}</span>
//               {column.sortable && (
//                 <div className="flex flex-col">
//                   <ChevronUp
//                     size={12}
//                     className={`${
//                       sortField === column.key && sortDirection === "asc"
//                         ? "text-blue-600"
//                         : "text-gray-400"
//                     }`}
//                   />
//                   <ChevronDown
//                     size={12}
//                     className={`${
//                       sortField === column.key && sortDirection === "desc"
//                         ? "text-blue-600"
//                         : "text-gray-400"
//                     }`}
//                   />
//                 </div>
//               )}
//             </div>
//           </th>
//         ))}
//         {/* <th className="text-left py-3 px-4 font-semibold">Actions</th> */}
//       </tr>
//     </thead>
//   );
// };

// export default TableH;
