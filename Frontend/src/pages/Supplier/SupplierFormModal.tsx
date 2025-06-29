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
import { Supplier } from "./types";
import { useToast } from "@/hooks/use-toast";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Company } from "src/pages/Company/types";
import { fetchCompanies } from "../DataFetchingFunctions/fetchCompanies";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "tel" | "select";
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  dynamicOptions?: boolean; // Add this property
}

const fields: FormField[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "enter full name",
    required: true,
  },
  {
    name: "companyID",
    label: "Company Name",
    type: "select",
    required: true,
    dynamicOptions: true, // Mark as dynamic
    placeholder: "Select Company",
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "enter your address",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email (eg. example@gmail.com)",
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    dynamicOptions: false, // Mark as static
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
];

interface SupplierFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  formData: Record<string, any>;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: (e: any) => void;
  addNewSupplierHandler?: () => Promise<boolean>;
  updateSupplierHandler?: () => Promise<boolean>;
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
  addNewSupplierHandler,
  updateSupplierHandler,
  editingSupplier,
  title,
  loading = false,
}: SupplierFormModalProps) => {
  // State for dynamic options
  const [companies, setCompanies] = useState<Company[]>([]); // Rename from suppliers
  const [loadingCompanies, setLoadingCompanies] = useState(false); // Rename from loadingSuppliers

  // Load companies when modal opens
  useEffect(() => {
    if (isModalOpen) {
      console.log("Before loading companies");
      loadCompanies(); // Rename function
      console.log("After loading companies");
      console.log(companies);
    }
  }, [isModalOpen]);

  const loadCompanies = async () => {
    // Rename function
    setLoadingCompanies(true);
    try {
      const companiesData = await fetchCompanies();
      setCompanies(companiesData);
    } catch (error) {
      console.error("Failed to load companies:", error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  // Function to get dynamic options
  const getDynamicOptions = (fieldName: string) => {
    switch (fieldName) {
      case "companyID":
        return companies.map((company) => ({
          // Use companies instead of suppliers
          label: company.name,
          value: company._id,
        }));
      // Add more cases for other dynamic fields
      default:
        return [];
    }
  };

  const validateForm = () => {
    for (const field of fields) {
      if (
        field.required &&
        (!formData[field.name] || formData[field.name].toString().trim() === "")
      ) {
        return field.label; // Return the label of the missing field
      }
    }
    // Phone number validation
    if (!formData.phoneNo || !isValidPhoneNumber(formData.phoneNo)) {
      return "Phone Number";
    }
    return null;
  };

  const { toast } = useToast();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const missing = validateForm();
    if (missing) {
      toast({
        title: "Warn",
        description: `Please fill the ${missing} feild`,
        variant: "destructive",
      });
      // toast.error(`Please fill the ${missing} feild`);
      return;
    }
    handleSubmit(e);
  };

  return (
    // TODO: yaha pani modal close gara
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
          {/* Name Field */}
          <Label htmlFor="name">
            Full Name
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            value={formData["name"] || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="enter your name"
            required={true}
            className="mt-1"
          />

          {/* for company name dropdown */}
          <Label htmlFor="companyID">
            Company Name
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData["companyID"] || ""}
            onValueChange={(value) => handleInputChange("companyID", value)}
            disabled={loadingCompanies || editingSupplier}
          >
            <SelectTrigger id="companyID" className="mt-1">
              <SelectValue
                placeholder={loadingCompanies ? "Loading..." : "Select Company"}
              />
            </SelectTrigger>
            <SelectContent>
              {loadingCompanies ? (
                <SelectItem value="__loading__" disabled>
                  Loading...
                </SelectItem>
              ) : companies.length === 0 ? (
                <SelectItem value="__none__" disabled>
                  No companies found
                </SelectItem>
              ) : (
                companies.map((company) => (
                  <SelectItem key={company._id} value={company._id}>
                    {company.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Name Field */}
          <Label htmlFor="address">
            Address
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="address"
            type="text"
            value={formData["address"] || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="enter you address"
            required={true}
            className="mt-1"
          />

          {/* Name Field */}
          <Label htmlFor="email">
            Email
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData["email"] || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="email (e.g. example@gmail.com) "
            required={true}
            className="mt-1"
            disabled={editingSupplier}
          />

          <Label htmlFor="phoneNo">
            Phone Number<span className="text-red-500 ml-1">*</span>
          </Label>

          <PhoneInput
            id="phoneNo"
            international
            defaultCountry="NP"
            countries={["IN", "BD", "NP", "CN", "BT", "US"]} // Only these countries
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

          <Label htmlFor="companyID">
            Status
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={
              formData.status === "true"
                ? "true"
                : formData.status === "false"
                ? "false"
                : ""
            }
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger id="status" className="mt-1">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="true" value="true">
                Active
              </SelectItem>
              <SelectItem key="false" value="false">
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>

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
            {editingSupplier ? (
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Processing..." : "Update"}
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Processing..." : "Create"}
              </Button>
            )}
          </div>

          {/* //   {fields
        //     .filter((field) => !(editingSupplier && field.name === "password")) // Hide password when editing
        //     .map((field) => {
        //       const isDisabled =
        //         editingSupplier &&
        //         (field.name === "email" || field.name === "companyID");
        //       return (
        //         <div key={field.name}>
        //           <Label htmlFor={field.name}>
        //             {field.label}
        //             {field.required && (
        //               <span className="text-red-500 ml-1">*</span>
        //             )}
        //           </Label>

        //           {field.type === "select" ? (
        //             // Get options dynamically or use static options
        //             (() => {
        //               const options = field.dynamicOptions 
        //                 ? getDynamicOptions(field.name)
        //                 : field.options || [];

        //               return (
        //                 <Select
        //                   value={
        //                     field.name === "status"
        //                       ? formData.status === true
        //                         ? "true"
        //                         : formData.status === false
        //                         ? "false"
        //                         : formData.status || ""
        //                       : formData[field.name] || ""
        //                   }
        //                   onValueChange={(value) => handleInputChange(field.name, value)}
        //                   disabled={isDisabled || (field.dynamicOptions && loadingCompanies)}
        //                 >
        //                   <SelectTrigger id={field.name} className="mt-1">
        //                     <SelectValue
        //                       placeholder={
        //                         field.dynamicOptions && loadingCompanies 
        //                           ? "Loading..." 
        //                           : (field.placeholder || "Select...")
        //                       }
        //                     />
        //                   </SelectTrigger>
        //                   <SelectContent>
        //                     {options.length === 0 && field.dynamicOptions && !loadingCompanies ? (
        //                       <SelectItem value="" disabled>
        //                         No companies found
        //                       </SelectItem>
        //                     ) : (
        //                       options.map((option) => (
        //                         <SelectItem key={option.value} value={option.value}>
        //                           {option.label}
        //                         </SelectItem>
        //                       ))
        //                     )}
        //                   </SelectContent>
        //                 </Select>
        //               );
        //             })()
        //           ) : (
        //           <Input
        //             id={field.name}
        //             type={field.type}
        //             value={formData[field.name] || ""}
        //             onChange={(e) =>
        //               handleInputChange(field.name, e.target.value)
        //             }
        //             placeholder={field.placeholder}
        //             required={field.required}
        //             className="mt-1"
        //             disabled={isDisabled}
        //           />
        //           )}
        //         </div>
        //       );
        //     })}

        //   <div>
        //     <Label htmlFor="phoneNo">
        //       Phone Number<span className="text-red-500 ml-1">*</span>
        //     </Label>

        //     <PhoneInput
        //       id="phoneNo"
        //       international
        //       defaultCountry="NP"
        //       countries={["IN", "BD", "NP", "CN", "BT", "US"]} // Only these countries
        //       value={formData.phoneNo || ""}
        //       onChange={(value) => handleInputChange("phoneNo", value)}
        //       inputComponent={Input}
        //       className="mt-1"
        //       required
        //       error={
        //         formData.phoneNo && !isValidPhoneNumber(formData.phoneNo)
        //           ? "Invalid phone number"
        //           : undefined
        //       }
        //     />

        //     {formData.phoneNo && !isValidPhoneNumber(formData.phoneNo) && (
        //       <p style={{ color: "red" }}>Invalid phone number</p>
        //     )}
            
        //   </div>

        //   <div className="flex space-x-3 pt-4">
        //     <Button
        //       type="button"
        //       variant="outline"
        //       // TODO: Close the popup
        //       onClick={() => setIsModalOpen(false)}
        //       className="flex-1"
        //       disabled={loading}
        //     >
        //       Cancel
        //     </Button>
        //     {editingSupplier ? (
        //       <Button
        //         type="submit"
        //         className="flex-1 bg-blue-600 hover:bg-blue-700"
        //         disabled={loading}
        //       >
        //         {loading ? "Processing..." : "Update"}
        //       </Button>
        //     ) : (
        //       <Button
        //         type="submit"
        //         className="flex-1 bg-blue-600 hover:bg-blue-700"
        //         disabled={loading}
        //       >
        //         {loading ? "Processing..." : "Create"}
        //       </Button>
        //     )}
        //   </div> */}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierFormModal;
