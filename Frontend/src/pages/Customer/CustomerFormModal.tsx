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
import { Company } from "../Company/types";
import { fetchCompanies } from "../DataFetchingFunctions/fetchCompanies";
import { useToast } from "@/hooks/use-toast";
import { useCompanyStateGlobal, CompanyContextType } from "../../provider/companyState";


interface CustomerFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  formData: Record<string, any>;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: (e: any) => void;
  editingCustomer: boolean;
  title: string;
  loading?: boolean;
}

const CustomerFormModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  editingCustomer,
  title,
  loading = false,
}: CustomerFormModalProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const { toast } = useToast();
  const { state, dispatch }: CompanyContextType = useCompanyStateGlobal();
  const role = localStorage.getItem('role');

  // Add more detailed logging
  // console.log(`Using as a role: ${role} and global company context value is: ${state?.companyID} and company Name is: ${state?.companyName}`);

  // useEffect(() => {
  //   if (isModalOpen) {
  //     loadCompanies();
  //   }
  // }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen && state?.companyID && !formData.companyID) {
      handleInputChange("companyID", state.companyID);
    }
  }, [isModalOpen, state?.companyID]);

  // const loadCompanies = async () => {
  //   setLoadingCompanies(true);
  //   try {
  //     const companiesData = await fetchCompanies();
  //     setCompanies(companiesData);
  //   } catch (error) {
  //     console.error("Failed to load companies:", error);
  //   } finally {
  //     setLoadingCompanies(false);
  //   }
  // };


  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    handleSubmit(e);
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
              Full Name<span className="text-red-500 ml-1">*</span>
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

          {/* Company Name */}
          <div>
            <Label htmlFor="companyID">
              Company Name<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="companyID"
              type="text"
              value={state?.companyName || "No company selected"}
              disabled
              className="mt-1 bg-gray-50 text-gray-1000 cursor-not-allowed"
            />
          </div>

          {/* Closing Balance */}
          <div>
            <Label htmlFor="prevClosingBalance">
              Prev Year Closing Balance<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="prevClosingBalance"
              type="Number"
              value={formData["prevClosingBalance"] || ""}
              onChange={(e) => handleInputChange("prevClosingBalance", e.target.value)}
              placeholder="Enter Previous Year Closing Amount"
              required
              className="mt-1"
            />
          </div>

          {/* PAN Number */}
          <div>
            <Label htmlFor="panNo">
              PAN Number<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="panNo"
              type="Number"
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
              Address<span className="text-red-500 ml-1">*</span>
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
              Email<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData["email"] || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email (e.g. example@gmail.com)"
              required
              className="mt-1"
              disabled={editingCustomer}
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phoneNo">
              Phone Number<span className="text-red-500 ml-1">*</span>
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
              Status<span className="text-red-500 ml-1">*</span>
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : editingCustomer
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerFormModal;
