import React, { useState, useEffect } from "react";
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
import { fetchCustomers } from "../../DataFetchingFunctions/fetchCustomers";
import { Customer } from "../../Customer/types";
import NepaliDate from "../../../components/common/DatePicker";

// Extend the Window interface to include the '$' property for jQuery
declare global {
  interface Window {
    $: any;
  }
}

// --- Props interface for the modal component ---
interface SalesEntryFormModalProps {
  isModalOpen: boolean; // Controls modal visibility
  setIsModalOpen: (open: boolean) => void; // Function to open/close modal
  formData: Record<string, any>; // Holds current form values
  handleInputChange: (name: string, value: string | File | null) => void; // Updates form values
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // Handles form submission
  editingSalesEntry: boolean; // True if editing, false if creating
  title: string; // Modal title
  loading?: boolean; // Loading state for submit button
}

// --- Main component definition ---
const SalesEntryFormModal: React.FC<SalesEntryFormModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  editingSalesEntry,
  title,
  loading = false,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      loadCustomers();
    }
  }, [isModalOpen]);

  const loadCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const customersData = await fetchCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) setImagePreview(null);
  };

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

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-md h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleFormSubmit}
            className="space-y-4 flex-1 overflow-y-auto p-2"
            style={{ minHeight: 0 }}
          >
            {/* Bill Date (AD) */}
            {/* <Label htmlFor="date">
              Bill Date (AD)
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={formData["date"] || ""}
              onChange={(e) => handleInputChange("date", e.target.value)}
              required
              className="mt-1 w-full border rounded p-2"
            /> */}

            {/* Bill Date (Nepali) */}
            <Label htmlFor="nepaliDate" className="mt-4">
              Bill Date (BS)<span className="text-red-500 ml-1">*</span>
            </Label>
            <NepaliDate
              handleInputChange={handleInputChange}
              formData={formData}
              fieldName="date"
            />

            {/* Total Amount */}
            <Label htmlFor="amount">
              Total Amount
              <span className="text-red-500 ml-1">*</span>
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

            {/* Bill Photo (File Input) */}
            <Label htmlFor="billAttachment">
              Bill Photo
              <span className="text-red-500 ml-1">*</span>
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

            {/* Customer Name (Select) */}
            <Label htmlFor="customerID">
              Customer Name
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData["customerID"] || ""}
              onValueChange={(value) => handleInputChange("customerID", value)}
              disabled={loadingCustomers}
            >
              <SelectTrigger id="customerID" className="mt-1">
                <SelectValue
                  placeholder={
                    loadingCustomers ? "Loading..." : "Select customer"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {loadingCustomers ? (
                  <SelectItem value="__loading__" disabled>
                    Loading...
                  </SelectItem>
                ) : customers.length === 0 ? (
                  <SelectItem value="__none__" disabled>
                    No customers found
                  </SelectItem>
                ) : (
                  customers.map((customer) => (
                    <SelectItem key={customer._id} value={customer._id}>
                      {customer.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Description of Items (Textarea) */}
            <Label htmlFor="itemDescription">
              Description of Items
              <span className="text-red-500 ml-1">*</span>
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

            {/* Status (Checkboxes) */}
            <Label>
              Status
              <span className="text-red-500 ml-1">*</span>
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

            {/* Due Amount (only if paid is false) */}
            {formData["paid"] === "false" && (
              <>
                <Label htmlFor="dueAmount">Due Amount</Label>
                <Input
                  id="dueAmount"
                  type="text"
                  value={formData["dueAmount"] || ""}
                  onChange={(e) =>
                    handleInputChange("dueAmount", e.target.value)
                  }
                  placeholder="Enter Amount Left to pay"
                  className="mt-1"
                />
              </>
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                disabled={loading || localLoading}
              >
                {(loading || localLoading) ? (
                  <>
                    <span className="loader mr-2"></span> Processing...
                  </>
                ) : (
                  editingSalesEntry ? "Update" : "Create"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>

        {/* Full Size Image Preview Dialog */}
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
        </Dialog>
      </Dialog>
    </>
  );
};

export default SalesEntryFormModal;

/* Add this CSS for a simple spinner if you don't have a spinner component */
/*
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/
