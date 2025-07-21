import ImagePreview from "@/components/common/ImagePreview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { METHODS } from "http";
import { AppleIcon, Edit, Trash2, Mail, Loader2 } from "lucide-react";
import React, { useState } from "react";

type Props = {
  sortedData: any;
  columns: any;
  handleEdit: any;
  handleDelete: any;
  previewTitle: string;
  previewAltText: string;
  showVerificationAction?: boolean;
  handleSendVerification?: (row: any) => Promise<void>;
  verificationLoading?: Set<string | number>; // Track which rows are loading
};

const TableB = (props: Props) => {
  const { 
    handleEdit, 
    sortedData, 
    columns, 
    handleDelete, 
    previewTitle, 
    previewAltText,
    showVerificationAction = false,
    handleSendVerification,
    verificationLoading = new Set()
  } = props;

  // Add debug log
  console.log("Verification loading state:", verificationLoading);

  // Add these states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  const handleImageClick = (imageUrl: string) => {
    setImagePreview(imageUrl);
    setOpenImageDialog(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setOpenImageDialog(open);
    if (!open) {
      setImagePreview(null);
    }
  };

  console.log("Inside common Table Body: ", sortedData);
  
  return (
    <>
      <tbody>
        {sortedData.map((row, index) => {
          const rowId = row._id || row.email;
          const isLoading = verificationLoading.has(rowId);
          
          // Debug log for each row
          console.log(`Row ${rowId} loading state:`, isLoading);
          
          return (
            <tr key={index} className="border-b hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="py-3 px-4">
                  {column.key === "profileImage" || column.key === "logo"  || column.key === "billAttachment" ? (
                    row[column.key] ? (
                    <img
                      src={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${row[column.key]}`}
                      alt={previewTitle}
                      style={{ maxWidth: 80, maxHeight: 80, cursor: "pointer" }}
                      onClick={() => handleImageClick(row[column.key])}
                    />
                    ) : null
                  ) : column.render ? (
                    column.render(row[column.key], row)
                  ) : (
                    row[column.key]
                  )}
                </td>
              ))}
              <td className="py-3 px-4">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">

                  {/* Conditional Verification Button */}
                  {showVerificationAction && 
                   row.hasOwnProperty('isVerified') && 
                   !row.isVerified && 
                   handleSendVerification && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        console.log("Send verification to:", row);
                        console.log("Current loading state before click:", isLoading);
                        handleSendVerification(row);
                      }}
                      className="text-orange-600 hover:text-orange-800 w-full sm:w-auto justify-start"
                      title="Send verification link"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Mail size={16} />
                      )}
                    </Button>
                  )}

                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log("Edit row:", row);
                      handleEdit(row);
                    }}
                    className="text-blue-600 hover:text-blue-800 w-full sm:w-auto justify-start"
                  >
                    <Edit size={16} />
                  </Button>

                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log("Delete row:", row);
                      handleDelete(row);
                    }}
                    className="text-red-600 hover:text-red-800 w-full sm:w-auto justify-start"
                  >
                    <Trash2 size={16} />
                  </Button>
                  
                  
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>

      {/* For Image Preview  */}
      <ImagePreview
        isOpen={openImageDialog}
        onOpenChange={handleCloseDialog}
        imageUrl={imagePreview}
        title={previewTitle}
        altText={previewAltText}
      />
    </>
  );
};

export default TableB;