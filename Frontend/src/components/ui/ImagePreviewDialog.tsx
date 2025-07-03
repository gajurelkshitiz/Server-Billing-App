import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  imageUrl: string | null;
  title?: string;
}

const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title = "Image Preview"
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div
          className="flex justify-center items-center p-4"
          style={{ height: "60vh" }}
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Full Size Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;