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
import {useSuppliers} from "@/pages/Supplier/useSuppliers";
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
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage");


  // Use the hook to get fetchSuppliers
  const { fetchSuppliers } = useSuppliers();


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
      console.log('suppliers data is: ', suppliersData);
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

  // Function to calculate net total amount
  const calculateNetTotal = () => {
    const amount = parseFloat(formData["dueAmount"] || "0");
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
    if (netTotal !== formData["netDueAmount"]) {
      handleInputChange("netDueAmount", netTotal);
    }
  }, [formData["dueAmount"], formData["vat"], formData["discount"], discountType]);


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

            {/* Suppliers Name (Select) */}
            <div>
              <Label htmlFor="supplierID">
                Supplier Name
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData["supplierID"] || ""}
                onValueChange={(value) => handleInputChange("supplierID", value)}
                disabled={loadingSuppliers}
              >
                <SelectTrigger id="supplierID">
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


            {/* Total Due Amount */}
            <div>
              <Label htmlFor="dueAmount">
                Total Due Amount<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="dueAmount"
                type="number"
                value={formData["dueAmount"] || ""}
                onChange={(e) => {
                  // only allow integer value:
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    handleInputChange("dueAmount", e.target.value)}
                  }
                }
                placeholder="Enter total due amount"
                required
                className="mt-1"
              />
            </div>

            {/* Vat Percentage  */}
            <div>
              <Label htmlFor="vat">
                VAT [in %]
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input 
                id='vat'
                type='number'
                value={formData['vat'] || ""}
                onChange={(e) => handleInputChange("vat", e.target.value)}
                placeholder="Enter VAT in %"
              />
            </div>

            {/* Discount Percentage/Amount  */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="discount">
                  Discount 
                  <span className="text-red-500 ml-1">(optional)</span>
                </Label>
                <Select
                  value={discountType}
                  onValueChange={(value: "percentage"  | "amount") => {
                    setDiscountType(value);
                    handleInputChange("discountType", value);
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
              <Label htmlFor="netDueAmount">
                Net Due Amount
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="netDueAmount"
                type="number"
                value={formData["netDueAmount"] || ""}
                placeholder="Net Due amount"
                readOnly
                disabled
              />


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
                // required
                // className="mt-1"
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
                {(loading || localLoading)
                  ? (
                    <>
                      <span className="loader mr-2"></span> Processing...
                    </>
                  ) : editingPurchaseEntry ? "Update"
                  : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>


        {/* Use the separate ImagePreview component */}
        {/* <ImagePreview
          isOpen={openImageDialog}
          onOpenChange={setOpenImageDialog}
          imageUrl={imagePreview}
          title="Bill Preview"
          altText="Full Size Bill"
        /> */}
      </Dialog>
    </>
  );
};



export default PurchaseEntryFormModal;
