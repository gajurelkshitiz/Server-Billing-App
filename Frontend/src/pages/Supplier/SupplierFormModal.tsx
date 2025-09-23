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
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Company } from "src/pages/Company/types";
import { fetchCompanies } from "../DataFetchingFunctions/fetchCompanies";
import { useToast } from "@/hooks/use-toast";
import { useCompanyStateGlobal, CompanyContextType } from "../../provider/companyState";

interface SupplierFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  formData: Record<string, any>;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: (e: any) => void;
  editingSupplier: boolean;
  title: string;
  loading?: boolean;
}

const SupplierFormModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  editingSupplier,
  title,
  loading = false,
}: SupplierFormModalProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const { toast } = useToast();
  const { state }: CompanyContextType = useCompanyStateGlobal();

  // Local loading for submit button
  const [localLoading, setLocalLoading] = useState(false);


  useEffect(() => {
    if (isModalOpen && state?.companyID && !formData.companyID) {
      handleInputChange("companyID", state.companyID);
    }
  }, [isModalOpen, state?.companyID]);


  // Validate required fields
  const validateForm = () => {
    if (!formData.name || formData.name.trim() === "") return "Full Name";
    if (!formData.companyID || formData.companyID.trim() === "") return "Company Name";
    if (!formData.prevClosingBalance || formData.prevClosingBalance === "") return "Prev Year Closing Balance";
    if (!formData.panNo || formData.panNo.trim() === "") return "PAN Number";
    if (!formData.address || formData.address.trim() === "") return "Address";
    if (!formData.email || formData.email.trim() === "") return "Email";
    if (!formData.phoneNo || !isValidPhoneNumber(formData.phoneNo)) return "Phone Number";
    if (formData.status === undefined || formData.status === "") return "Status";
    return null;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalLoading(true);

    try {
      const missing = validateForm();
      if (missing) {
        toast({
          title: "Warn",
          description: `Please fill the ${missing} field`,
          variant: "destructive",
        });
        return;
      }
      await handleSubmit(e);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
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
          {/* Full Name */}
          <div>
            <Label htmlFor="name">
              Full Name
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData["name"] || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter full name"
              required
              className="mt-1"
            />
          </div>

          {/* Company Name (disabled input, like CustomerFormModal) */}
          <div>
            <Label htmlFor="companyID">
              Company Name
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="companyID"
              type="text"
              value={state?.companyName || "No company selected"}
              disabled
              className="mt-1 bg-gray-50 text-gray-1000 cursor-not-allowed"
            />
          </div>

          {/* Prev Year Closing Balance with Dr/Cr toggle */}
          <div>
            <Label htmlFor="prevClosingBalance">
              Prev Year Closing Balance
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="flex mt-1 w-full max-w-full">
              {/* Dr./Cr. Toggle Buttons */}
              <div className="flex rounded-l border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  className={`px-4 py-1 font-semibold focus:outline-none transition-colors ${
                    formData.type !== "credit"
                      ? "bg-red-200 text-red-800"
                      : "bg-white text-gray-700"
                  }`}
                  style={{ borderRight: "1px solid #e5e7eb" }}
                  onClick={() => handleInputChange("type", "debit")}
                >
                  Dr.
                </button>
                <button
                  type="button"
                  className={`px-4 py-1 font-semibold focus:outline-none transition-colors ${
                    formData.type === "credit"
                      ? "bg-green-200 text-green-800"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => handleInputChange("type", "credit")}
                >
                  Cr.
                </button>
              </div>
              {/* Input field */}
              <Input
                id="prevClosingBalance"
                type="number"
                value={formData["prevClosingBalance"] || ""}
                onChange={(e) => handleInputChange("prevClosingBalance", e.target.value)}
                placeholder="Amount"
                required
                className="rounded-l-none rounded-r border border-l-0 border-gray-300 flex-1 min-w-0"
                style={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderLeft: "none"
                }}
              />
            </div>
          </div>

          {/* PAN Number */}
          <div>
            <Label htmlFor="panNo">
              PAN Number
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="panNo"
              type="text"
              value={formData["panNo"] || ""}
              onChange={(e) => handleInputChange("panNo", e.target.value)}
              placeholder="Enter PAN Number"
              required
              className="mt-1"
            />
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">
              Address
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="address"
              type="text"
              value={formData["address"] || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter address"
              required
              className="mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">
              Email
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData["email"] || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email (e.g. example@gmail.com)"
              required
              className="mt-1"
              disabled={editingSupplier}
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phoneNo">
              Phone Number
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <PhoneInput
              id="phoneNo"
              international
              defaultCountry="NP"
              countries={["IN", "BD", "NP", "CN", "BT", "US"]}
              value={formData.phoneNo || ""}
              onChange={(value) => handleInputChange("phoneNo", value)}
              inputComponent={Input}
              className="mt-1"
              required
              error={
                formData.phoneNo && !isValidPhoneNumber(formData.phoneNo)
                  ? "Invalid phone number"
                  : undefined
              }
            />
            {formData.phoneNo && !isValidPhoneNumber(formData.phoneNo) && (
              <p style={{ color: "red" }}>Invalid phone number</p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">
              Status
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={
                formData.status === true
                  ? "true"
                  : formData.status === false
                  ? "false"
                  : formData.status || ""
              }
              onValueChange={(value) => handleInputChange("status", value)}
              required
            >
              <SelectTrigger id="status" className="mt-1">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="true" value="true">Active</SelectItem>
                <SelectItem key="false" value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading || localLoading}
            >
              {(loading || localLoading)
                ? (
                  <>
                    <span className="loader mr-2"></span> Processing...
                  </>
                )
                : editingSupplier
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierFormModal;
