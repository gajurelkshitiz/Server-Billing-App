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
import { useCustomers } from "@/pages/Customer/useCustomers";
import { Customer } from "../../Customer/types";
import NepaliDate from "../../../components/common/DatePicker";
import ImagePreview from "../../../components/common/ImagePreview";

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
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage");


  // Use the hook to get fetchCustomers
  const { fetchCustomers } = useCustomers();


  // Initialize discount type in formData when component mounts or modal opens
  useEffect(() => {
    if (isModalOpen && !formData["discountType"]) {
      handleInputChange("discountType", "percentage");
    }
  }, [isModalOpen]);

  // Initialize discount type from form data when editing
  useEffect(() => {
    if (formData["discountType"]) {
      setDiscountType(formData["discountType"]);
    }
  }, [formData["discountType"]]);

  useEffect(() => {
    if (isModalOpen) {
      loadCustomers();
      // Set image preview for existing sales entry when editing
      if (editingSalesEntry && formData.billAttachment) {
        setImagePreview(formData.billAttachment);
      } else {
        setImagePreview(null);
      }
    }
  }, [isModalOpen, editingSalesEntry, formData.billAttachment]);

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
      console.log('discount Type before form Submit button', discountType);
      console.log('formData discountType:', formData["discountType"]);
      // discountType should already be in formData now
      await handleSubmit(e);
      setImagePreview(null);
    } finally {
      setLocalLoading(false);
    }
  };

  // Function to calculate net total amount
  const calculateNetTotal = () => {
    const amount = parseFloat(formData["amount"] || "0");
    const vat = parseFloat(formData["vat"] || "0");
    const discount = parseFloat(formData["discount"] || "0");
    
    if (isNaN(amount)) return "";
    
    const vatAmount = (amount * vat) / 100;
    let discountAmount = 0;
    
    if (discountType === "percentage") {
      discountAmount = (amount * discount) / 100;
    } else {
      discountAmount = discount;
    }
    
    const netTotal = amount + vatAmount - discountAmount;
    return netTotal.toFixed(2);
  };

  // Update netTotalAmount in formData whenever dependent values change
  useEffect(() => {
    const netTotal = calculateNetTotal();
    if (netTotal !== formData["netTotalAmount"]) {
      handleInputChange("netTotalAmount", netTotal);
    }
  }, [formData["amount"], formData["vat"], formData["discount"], discountType]);

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
            {/* Customer Name (Select) */}
            <div>
              <Label htmlFor="customerID">
                Customer Name
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData["customerID"] || ""}
                onValueChange={(value) =>
                  handleInputChange("customerID", value)
                }
                disabled={loadingCustomers}
              >
                <SelectTrigger id="customerID">
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
            </div>
            
            {/* Bill Date (Nepali) */}
            <div>
              <Label htmlFor="nepaliDate">
                Bill Date (BS)<span className="text-red-500 ml-1">*</span>
              </Label>
              <NepaliDate
                handleInputChange={handleInputChange}
                formData={formData}
                fieldName="date"
              />
            </div>


            {/* Bill Number */}
            <div>
              <Label htmlFor="billNo">
                Bill Number
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="billNo"
                type="text"
                value={formData["billNo"] || ""}
                onChange={(e) => handleInputChange("billNo", e.target.value)}
                placeholder="Enter Bill Number"
                required
              />
            </div>

           
            {/* Total Amount */}
            <div>
              <Label htmlFor="amount">
                Total Amount
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="1"
                value={formData["amount"] || ""}
                onChange={(e) => {
                  // Only allow integer values
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    handleInputChange("amount", value);
                  }
                }}
                placeholder="Enter total amount"
                required
              />
            </div>

            {/* Vat Percentage*/}
            <div>
              <Label htmlFor="vat">
                VAT [in %]
                <span className="text-red-500 ml-1"> (optional) </span>
              </Label>
              <Input
                id="vat"
                type="number"
                value={formData["vat"] || ""}
                onChange={(e) => handleInputChange("vat", e.target.value)}
                placeholder="Enter VAT in %"
              />
            </div>

            {/* Discount Percentage/Amount*/}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="discount">
                  Discount
                  <span className="text-red-500 ml-1"> (optional) </span>
                </Label>
                <Select
                  value={discountType}
                  onValueChange={(value: "percentage" | "amount") => {
                    console.log('value selected from discount dropdown: ', value);
                    
                    setDiscountType(value);
                    // Update formData immediately when discount type changes
                    handleInputChange("discountType", value);
                    // Clear discount value when switching types
                    handleInputChange("discount", "");
                  }}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue placeholder="%" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="amount">रुपैयाँ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                id="discount"
                type="number"
                value={formData["discount"] || ""}
                onChange={(e) => handleInputChange("discount", e.target.value)}
                placeholder={
                  discountType === "percentage" 
                    ? "Enter Discount in %" 
                    : "Enter Discount Amount"
                }
              />
            </div>

            {/* Net Total Amount (Read-only, calculated) */}
            <div>
              <Label htmlFor="netTotalAmount">
                Net Total Amount
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="netTotalAmount"
                type="number"
                value={formData["netTotalAmount"] || ""}
                placeholder="Net total amount"
                readOnly
                disabled
              />
            </div>


            {/* Description of Items (Textarea) */}
            <div>
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
                className="w-full border rounded p-2"
              />
            </div>

            {/* Bill Photo (File Input) */}
            <div>
              <Label htmlFor="billAttachment">
                Bill Photo
                {/* <span className="text-red-500 ml-1">*</span> */}
                <span className="text-red-500 ml-1">[Optional]</span>
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
                // required
              />
            </div>
            {imagePreview && (
              <div className="mt-2">
                <span className="text-sm font-medium">Preview:</span>
                <img
                  src={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${imagePreview}`}
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
                {loading || localLoading ? (
                  <>
                    <span className="loader mr-2"></span> Processing...
                  </>
                ) : editingSalesEntry ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Use the separate ImagePreview component */}
      {/* <ImagePreview
        isOpen={openImageDialog}
        onOpenChange={setOpenImageDialog}
        imageUrl={imagePreview}
        title="Bill Preview"
        altText="Full Size Bill"
      /> */}
    </>
  );
};

export default SalesEntryFormModal;
