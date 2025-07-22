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
import { MobileForm, FormField, FormGrid } from "@/components/ui/mobile-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface CompanyFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  formData: Record<string, any>;
  handleInputChange: (name: string, value: string | File | null) => void;
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
  const isMobile = useIsMobile();

  // --- State for image preview and dialog for full-size image ---
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  // --- Add local loading state for submit button ---
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      // Set image preview for existing company when editing
      if (editingCompany && formData.logo) {
        setImagePreview(formData.logo);
      } else {
        setImagePreview(null);
      }
    }
  }, [isModalOpen, editingCompany, formData.logo]);

  const handleImageFileChange = (name: string, file: File | null) => {
    if (!file) {
      setImagePreview(null);
      handleInputChange(name, null); // allow empty image
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
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] h-[90vh]' : 'max-w-md h-[500px]'} flex flex-col`}>
        <DialogHeader className="pb-4">
          <DialogTitle className={isMobile ? 'text-lg' : ''}>{title}</DialogTitle>
        </DialogHeader>
        
        <form
          onSubmit={handleFormSubmit}
          className="space-y-4 flex-1 overflow-y-auto px-2"
          style={{ minHeight: 0 }}
        >
          {/* Company Name */}
          <FormField 
            label="Company Name" 
            required 
            error={undefined}
          >
            <Input
              id="name"
              type="text"
              value={formData["name"] || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="name of your business"
              required
              disabled={editingCompany}
              className={isMobile ? 'h-12' : ''}
            />
          </FormField>

          {/* Company Logo Upload */}
          <FormField 
            label="Company Logo" 
            error={undefined}
          >
            <div className="space-y-2">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageFileChange(
                    "logo",
                    e.target.files?.[0] || null
                  )
                }
                className={isMobile ? 'h-12' : ''}
              />
              <span className="text-xs text-gray-500">Optional</span>
            </div>
          </FormField>

          {(imagePreview || (editingCompany && formData.logo)) && (
            <div className="mt-2">
              <span className="text-sm font-medium">Preview:</span>
              <img
                src={imagePreview || `${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${formData.profileImage}`}
                alt="Logo Preview"
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

          {/* Email */}
          <FormField 
            label="Email" 
            required 
            error={undefined}
          >
            <Input
              id="email"
              type="email"
              value={formData["email"] || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="email address (e.g. example@gmail.com)"
              required
              disabled={editingCompany}
              className={isMobile ? 'h-12' : ''}
            />
          </FormField>

          {/* Address */}
          <FormField 
            label="Address" 
            required 
            error={undefined}
          >
            <Input
              id="address"
              type="text"
              value={formData["address"] || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="your company address"
              required
              className={isMobile ? 'h-12' : ''}
            />
          </FormField>

          {/* Vat */}
          <FormField 
            label="VAT Number" 
            required 
            error={undefined}
          >
            <Input
              id="vat"
              type="text"
              value={formData["vat"] || ""}
              onChange={(e) => handleInputChange("vat", e.target.value)}
              placeholder="your vat number"
              required
              disabled={editingCompany}
              className={isMobile ? 'h-12' : ''}
            />
          </FormField>

          {/* Industry */}
          <FormField 
            label="Industry" 
            required 
            error={undefined}
          >
            <Select
              value={formData["industrytype"] || ""}
              onValueChange={(value) => handleInputChange("industrytype", value)}
              required
              disabled={editingCompany}
            >
              <SelectTrigger className={isMobile ? 'h-12' : ''}>
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
          </FormField>

          {/* Phone Number */}
          <FormField 
            label="Phone Number" 
            required 
            error={formData.phoneNo && !isValidPhoneNumber(formData.phoneNo) ? "Invalid phone number" : undefined}
          >
            <PhoneInput
              id="phoneNo"
              international
              defaultCountry="NP"
              countries={["IN", "BD", "NP", "CN", "BT", "US"]}
              value={formData.phoneNo || ""}
              onChange={(value) => handleInputChange("phoneNo", value)}
              inputComponent={Input}
              className={isMobile ? 'h-12' : ''}
              required
            />
          </FormField>

          <div className={`flex gap-3 pt-4 ${isMobile ? 'flex-col' : 'flex-row'}`}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className={`${isMobile ? 'w-full h-12' : 'flex-1'}`}
              disabled={loading || localLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`${isMobile ? 'w-full h-12' : 'flex-1'} bg-blue-600 hover:bg-blue-700`}
              disabled={loading || localLoading}
            >
              {(loading || localLoading)
                ? (
                  <>
                    <span className="loader mr-2"></span> Processing...
                  </>
                )
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
