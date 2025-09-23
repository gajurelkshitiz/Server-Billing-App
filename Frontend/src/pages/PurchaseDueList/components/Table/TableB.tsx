// import ImagePreview from "@/components/common/ImagePreview";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { METHODS } from "http";
// import { AppleIcon, Edit, Trash2 } from "lucide-react";
// import React, { useState } from "react";

// type Props = {
//   sortedData: any;
//   columns: any;
// };

// const TableB = (props: Props) => {
//   const { sortedData, columns } = props;

//   // Add these states
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [openImageDialog, setOpenImageDialog] = useState(false);

//   const handleImageClick = (imageUrl: string) => {
//     setImagePreview(imageUrl);
//     setOpenImageDialog(true);
//   };

//   const handleCloseDialog = (open: boolean) => {
//     setOpenImageDialog(open);
//     if (!open) {
//       setImagePreview(null);
//     }
//   };

//   return (
//     <>
//       <tbody className="relative">
//         {sortedData.map((row, index) => (
//           <tr key={index} className="border-b hover:bg-gray-50">
//             {columns.map((column) => (
//               // just for checking purpose
//               // console.log('Rendering column:', column.key, 'with value:', row[column.key]),

//               <td key={column.key} className="py-3 px-4">
//                 {column.key === "billAttachment" ? (
//                   <img
//                     src={row[column.key]}
//                     style={{ maxWidth: 80, maxHeight: 80, cursor: "pointer" }}
//                     onClick={() => handleImageClick(row[column.key])}
//                   />
//                 ) : column.render ? (
//                   column.render(row[column.key], row)
//                 ) : (
//                   row[column.key]
//                 )}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>

//       {/* Image Preview Dialog */}
//       {/* <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
//         <DialogContent className="max-w-4xl max-h-[80vh] p-0">
//           <DialogHeader className="p-4">
//             <DialogTitle>Bill Preview</DialogTitle>
//           </DialogHeader>
//           <div className="flex justify-center items-center p-4" style={{ height: "60vh" }}>
//             {imagePreview && (
//               <img
//                 src={imagePreview}
//                 alt="Full Size Bill"
//                 className="max-w-full max-h-full object-contain rounded-lg"
//               />
//             )}
//           </div>
//         </DialogContent>
//       </Dialog> */}
//       <ImagePreview
//         isOpen={openImageDialog}
//         onOpenChange={handleCloseDialog}
//         imageUrl={imagePreview}
//         title="Bill Preview"
//         altText="Full Size Bill"
//       />
//     </>
//   );
// };

// export default TableB;
