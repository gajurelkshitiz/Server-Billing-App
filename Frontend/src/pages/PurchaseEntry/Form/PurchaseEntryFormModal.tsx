import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchSuppliers } from "../../DataFetchingFunctions/fetchSuppliers";
import { Supplier } from "../../Supplier/types";
import NepaliDate from "../../../components/common/DatePicker"
import ImagePreview from "@/components/common/ImagePreview";


// Extend the Window interface to include the '$' property for jQuery
declare global {
  interface Window {
    $: any;
  }
}

// --- Props interface for the modal component ---
interface PurchaseEntryFormModalProps {
  isModalOpen: boolean; // Controls modal visibility
  setIsModalOpen: (open: boolean) => void; // Function to open/close modal
  formData: Record<string, any>; // Holds current form values
  handleInputChange: (name: string, value: string | File | null) => void; // Updates form values
  handleSubmit: (e: any) => void; // Handles form submission
  editingPurchaseEntry: boolean; // True if editing, false if creating
  title: string; // Modal title
  loading?: boolean; // Loading state for submit button
}

// --- Main component definition ---
const PurchaseEntryFormModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  editingPurchaseEntry,
  title,
  loading = false,
}: PurchaseEntryFormModalProps) => {
  // --- State for supplier dropdown (dynamic options) ---
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  // --- State for image preview and dialog for full-size image ---
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  // --- Add local loading state for submit button ---
  const [localLoading, setLocalLoading] = useState(false);

  // --- Load suppliers when modal opens ---
  useEffect(() => {
    if (isModalOpen) {
      loadSuppliers();
      // Set image preview for existing purchase entry when editing
      if (editingPurchaseEntry && formData.billAttachment) {
        setImagePreview(formData.billAttachment);
      } else {
        setImagePreview(null);
      }
    }
  }, [isModalOpen, editingPurchaseEntry, formData.billAttachment]);

  // --- Fetch supplier data from API ---
  const loadSuppliers = async () => {
    setLoadingSuppliers(true);
    try {
      const suppliersData = await fetchSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Failed to load suppliers:", error);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  // --- Handles file input changes and sets preview for images ---
  const handleImageFileChange = (name: string, file: File | null) => {
    if (!file) {
      setImagePreview(null);
      handleInputChange(name, null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    handleInputChange(name, file);
  };

  // --- Handles form submission, resets image preview after submit ---
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      await handleSubmit(e);
      setImagePreview(null);
    } finally {
      setLocalLoading(false);
    }
  };

  // --- Main render: Dialog with form and full-size image preview dialog ---
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent className="max-w-md h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleFormSubmit}
            className="space-y-4 flex-1 overflow-y-auto p-2"
            style={{ minHeight: 0 }}
          >
            {/* Bill Date (English) */}
            {/* <div>
              <Label htmlFor="date">
                Bill Date (AD)<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData["date"] || ""}
                onChange={e => handleInputChange("date", e.target.value)}
                required
                className="mt-1 w-full border rounded p-2"
              />
            </div> */}

            {/* Bill Date (Nepali) */}
            <div>
              <Label htmlFor="nepaliDate" className="mt-4">
                Bill Date (BS)<span className="text-red-500 ml-1">*</span>
              </Label>
              <NepaliDate 
                  handleInputChange={handleInputChange} 
                  formData={formData}
                  fieldName="date"
                />
            </div>

            {/* Total Amount */}
            <div>
              <Label htmlFor="amount">
                Total Amount<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData["amount"] || ""}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="Enter total amount"
                required
                className="mt-1"
              />
            </div>

            {/* Bill Photo (File Input) */}
            <div>
              <Label htmlFor="billAttachment">
                Bill Photo<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="billAttachment"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageFileChange(
                    "billAttachment",
                    e.target.files?.[0] || null
                  )
                }
                required
                className="mt-1"
              />
              {imagePreview && (
                <div className="mt-2">
                  <span className="text-sm font-medium">Preview:</span>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 border rounded cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setOpenImageDialog(true)}
                    style={{
                      width: "50%",
                      maxHeight: "100px",
                      objectFit: "contain",
                    }}
                  />
                  <div className="mt-1">
                    <span className="text-xs text-gray-500">
                      Click to view full size
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Supplier Name (Select) */}
            <div>
              <Label htmlFor="supplierID">
                Supplier Name<span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData["supplierID"] || ""}
                onValueChange={(value) => handleInputChange("supplierID", value)}
                disabled={loadingSuppliers}
              >
                <SelectTrigger id="supplierID" className="mt-1">
                  <SelectValue
                    placeholder={
                      loadingSuppliers ? "Loading..." : "Select Supplier"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {loadingSuppliers ? (
                    <SelectItem value="__loading__" disabled>
                      Loading...
                    </SelectItem>
                  ) : suppliers.length === 0 ? (
                    <SelectItem value="__none__" disabled>
                      No suppliers found
                    </SelectItem>
                  ) : (
                    suppliers.map((supplier) => (
                      <SelectItem key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Description of Items (Textarea) */}
            <div>
              <Label htmlFor="itemDescription">
                Description of Items<span className="text-red-500 ml-1">*</span>
              </Label>
              <textarea
                id="itemDescription"
                value={formData["itemDescription"] || ""}
                onChange={(e) =>
                  handleInputChange("itemDescription", e.target.value)
                }
                placeholder="Enter item description"
                required
                rows={4}
                className="mt-1 w-full border rounded p-2"
              />
            </div>

            {/* Status (Checkboxes) */}
            <div>
              <Label>
                Status<span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData["paid"] === "true"}
                    onChange={() => {
                      handleInputChange("paid", "true");
                      handleInputChange("dueAmount", "0");
                    }}
                  />
                  Paid
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData["paid"] === "false"}
                    onChange={() => {
                      handleInputChange("paid", "false");
                      handleInputChange("dueAmount", "");
                    }}
                  />
                  Due
                </label>
              </div>
            </div>

            {/* Due Amount (only if paid is false) */}
            {formData["paid"] === "false" && (
              <div>
                <Label htmlFor="dueAmount">Due Amount</Label>
                <Input
                  id="dueAmount"
                  type="text"
                  value={formData["dueAmount"] || ""}
                  onChange={(e) => handleInputChange("dueAmount", e.target.value)}
                  placeholder="Enter Amount Left to pay"
                  className="mt-1"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
                disabled={loading || localLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading || localLoading}
              >
                {(loading || localLoading)
                  ? (
                    <>
                      <span className="loader mr-2"></span> Processing...
                    </>
                  )
                  : editingPurchaseEntry
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>

        {/* Full Size Image Preview Dialog
        <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] p-0">
            <DialogHeader className="p-4">
              <DialogTitle>Bill Preview</DialogTitle>
            </DialogHeader>
            <div
              className="flex justify-center items-center p-4"
              style={{ height: "60vh" }}
            >
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Full Size Bill"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              )}
            </div>
          </DialogContent>
        </Dialog> */}

        {/* Use the separate ImagePreview component */}
        <ImagePreview
          isOpen={openImageDialog}
          onOpenChange={setOpenImageDialog}
          imageUrl={imagePreview}
          title="Bill Preview"
          altText="Full Size Bill"
        />
      </Dialog>
    </>
  );
};



export default PurchaseEntryFormModal;
