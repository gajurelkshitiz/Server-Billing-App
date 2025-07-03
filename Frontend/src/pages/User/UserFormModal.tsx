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
import { useToast } from "@/hooks/use-toast";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Company } from "src/pages/Company/types";
import { fetchCompanies } from "../DataFetchingFunctions/fetchCompanies";

interface UserFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  formData: Record<string, any>;
  handleInputChange: (name: string, value: string | File | null) => void;
  handleSubmit: (e: any) => void;
  addNewUserHandler?: () => Promise<boolean>;
  updateUserHandler?: () => Promise<boolean>;
  editingUser: boolean;
  title: string;
  loading?: boolean;
}

const UserFormModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  addNewUserHandler,
  updateUserHandler,
  editingUser,
  title,
  loading = false,
}: UserFormModalProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // --- State for image preview and dialog for full-size image ---
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  // --- Add local loading state for submit button ---
  const [localLoading, setLocalLoading] = useState(false);
  
  useEffect(() => {
    if (isModalOpen) {
      loadCompanies();
    }
  }, [isModalOpen]);

  const loadCompanies = async () => {
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

  // const validateForm = () => {
  //   if (!formData.name || formData.name.trim() === "") return "Full Name";
  //   if (!formData.companyID || formData.companyID.trim() === "") return "Company";
  //   if (!formData.departmentNo || formData.departmentNo.trim() === "") return "Department";
  //   if (!formData.email || formData.email.trim() === "") return "Email";
  //   // if (!editingUser && (!formData.password || formData.password.trim() === "")) return "Password";
  //   if (!formData.phoneNo || !isValidPhoneNumber(formData.phoneNo)) return "Phone Number";
  //   return null;
  // };

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
    
    console.log('after the form field of admin is filled')
    console.log(formData)

    try {
      await handleSubmit(e);
      setImagePreview(null);
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
              Full Name<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData["name"] || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Full Name"
              required
              className="mt-1"
            />
          </div>

          {/* Profile Image Upload */}
          <div>
            <Label htmlFor="profileImage">
              Profile Image<span className="text-red-500 ml-1"> (optional)</span>
            </Label>
            <Input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageFileChange(
                  "profileImage", 
                  e.target.files?.[0] || null
                )
              }
              className="mt-1"
            />
            {imagePreview && (
              <div className="mt-2">
                <span className="text-sm font-medium">Preview:</span>
                <img
                  src={imagePreview}
                  alt="Profile Preview"
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

          {/* Company (dynamic select) */}
          <div>
            <Label htmlFor="companyID">
              Company<span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData["companyID"] || ""}
              onValueChange={(value) => handleInputChange("companyID", value)}
              disabled={loadingCompanies || editingUser}
              required
            >
              <SelectTrigger id="companyID" className="mt-1">
                <SelectValue placeholder={loadingCompanies ? "Loading..." : "Select Company"} />
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
          </div>

          {/* Department */}
          <div>
            <Label htmlFor="departmentNo">
              Department<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="departmentNo"
              type="text"
              value={formData["departmentNo"] || ""}
              onChange={(e) => handleInputChange("departmentNo", e.target.value)}
              placeholder="Department"
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
              placeholder="Enter email (eg. example@gmail.com)"
              required
              className="mt-1"
              disabled={editingUser}
            />
          </div>

          {/* Password (hide when editing) */}
          {/* {!editingUser && (
            <div>
              <Label htmlFor="password">
                Password<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData["password"] || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter password (min 8 Character)"
                required
                className="mt-1"
              />
            </div>
          )} */}

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
                : editingUser
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormModal;
