import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import React, { useState } from "react";
import ImagePreviewDialog from "@/components/ui/ImagePreviewDialog";

type Props = {
  sortedData: any;
  columns: any;
  handleEdit: any;
};

const TableB = (props: Props) => {
  const { handleEdit, sortedData, columns } = props;

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

  return (
    <>
      <tbody>
        {sortedData.map((row, index) => (
          <tr key={index} className="border-b hover:bg-gray-50">
            {columns.map((column) => (
              <td key={column.key} className="py-3 px-4">
                {column.key === "billAttachment" ? (
                  <img
                    src={row[column.key]}
                    alt="Bill Attachment"
                    style={{ maxWidth: 80, maxHeight: 80, cursor: "pointer" }}
                    onClick={() => handleImageClick(row[column.key])}
                  />
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
                  onClick={() => handleEdit(row)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={16} />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>

      <ImagePreviewDialog
        isOpen={openImageDialog}
        onClose={handleCloseDialog}
        imageUrl={imagePreview}
        title="Bill Preview"
      />
    </>
  );
};

export default TableB;
