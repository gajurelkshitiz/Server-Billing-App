import React from "react";
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
import { useToast } from "@/hooks/use-toast";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface CompanyFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  formData: Record<string, any>;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: (e: any) => void;
  editingCompany: boolean;
  title: string;
  loading?: boolean;
}

const CompanyFormModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  editingCompany,
  title,
  loading = false,
}: CompanyFormModalProps) => {
  const { toast } = useToast();

  const validateForm = () => {
    if (!formData.name?.trim()) return "Company Name";
    if (!formData.email?.trim()) return "Email";
    if (!formData.address?.trim()) return "Address";
    if (!formData.vat?.trim()) return "Vat";
    if (!formData.industrytype?.trim()) return "Industry";
    if (!formData.phoneNo || !isValidPhoneNumber(formData.phoneNo)) {
      return "Phone Number";
    }
    return null;
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    const missing = validateForm();
    if (missing) {
      toast({
        title: "Warn",
        description: `Please fill the ${missing} field`,
        variant: "destructive",
      });
      return;
    }
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
          {/* Company Name */}
          <Label htmlFor="name">
            Company Name<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            value={formData["name"] || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="name of your business"
            required
            className="mt-1"
            disabled={editingCompany}
          />

          {/* Email */}
          <Label htmlFor="email">
            Email<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData["email"] || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="email address (e.g. example@gmail.com)"
            required
            className="mt-1"
            disabled={editingCompany}
          />

          {/* Address */}
          <Label htmlFor="address">
            Address<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="address"
            type="text"
            value={formData["address"] || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="your company address"
            required
            className="mt-1"
          />

          {/* Vat */}
          <Label htmlFor="vat">
            Vat<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="vat"
            type="text"
            value={formData["vat"] || ""}
            onChange={(e) => handleInputChange("vat", e.target.value)}
            placeholder="your vat number"
            required
            className="mt-1"
            disabled={editingCompany}
          />

          {/* Industry */}
          <Label htmlFor="industrytype">
            Industry<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData["industrytype"] || ""}
            onValueChange={(value) => handleInputChange("industrytype", value)}
            required
            disabled={editingCompany}
          >
            <SelectTrigger id="industrytype" className="mt-1">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IT">Information Technology</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Healthcare">HealthCare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Phone Number */}
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
                : editingCompany
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyFormModal;
