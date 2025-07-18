import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImagePreviewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  title?: string;
  altText?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  isOpen,
  onOpenChange,
  imageUrl,
  title = "Image Preview",
  altText = "Preview Image",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              alt={altText}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreview;