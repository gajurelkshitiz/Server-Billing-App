import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "./types";

interface TableBodyProps {
  data: any[];
  columns: Column[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  showActions?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  customActions?: (row: any) => React.ReactNode;
}

const TableBody: React.FC<TableBodyProps> = ({
  data,
  columns,
  onEdit,
  onDelete,
  showActions = true,
  showEditAction = true,
  showDeleteAction = true,
  customActions
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  const handleImageClick = (imageSrc: string) => {
    setImagePreview(imageSrc);
    setOpenImageDialog(true);
  };

  return (
    <>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className="border-b hover:bg-gray-50">
            {columns.map((column) => (
              <td key={column.key} className="py-3 px-4">
                {column.key === "billAttachment" && row[column.key] ? (
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
            {showActions && (
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  {customActions ? (
                    customActions(row)
                  ) : (
                    <>
                      {showEditAction && onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(row)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </Button>
                      )}
                      {showDeleteAction && onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(row)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>

      {/* Image Preview Dialog */}
      <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="p-4">
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-4" style={{ height: "60vh" }}>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Full Size Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableBody;