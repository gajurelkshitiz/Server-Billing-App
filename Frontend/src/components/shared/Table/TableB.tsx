import ImagePreview from "@/components/common/ImagePreview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { METHODS } from "http";
import { AppleIcon, Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";

type Props = {
  sortedData: any;
  columns: any;
  handleEdit: any;
  handleDelete: any;
  previewTitle: string;
  previewAltText: string;
};

const TableB = (props: Props) => {
  const { handleEdit, sortedData, columns, handleDelete, previewTitle, previewAltText } = props;

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
        {sortedData.map((row, index) => (
          <tr key={index} className="border-b hover:bg-gray-50">
            {columns.map((column) => (
              <td key={column.key} className="py-3 px-4">
                {column.key === "profileImage" || column.key === "logo"  || column.key === "billAttachment" ? (
                  row[column.key] ? (
                  <img
                    src={row[column.key]}
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
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log("Edit row:", row);
                    handleEdit(row);
                  }}
                  className="text-blue-600 hover:text-blue-800"
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
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </td>
          </tr>
        ))}
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