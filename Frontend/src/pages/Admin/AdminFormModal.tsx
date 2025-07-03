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
import { useToast } from "@/hooks/use-toast";
import { fetchSubscriptions } from "../DataFetchingFunctions/fetchSubscriptions"; // Adjust path as needed

interface Subscription {
  _id: string;
  name: string;
}

interface AdminFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  formData: Record<string, any>;
  handleInputChange: (name: string, value: string | File | null) => void;
  handleSubmit: (e: any) => void;
  editingAdmin: boolean;
  title: string;
  loading?: boolean;
}

const AdminFormModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  editingAdmin,
  title,
  loading = false,
}: AdminFormModalProps) => {
  const { toast } = useToast();

  // Add state for subscriptions
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  
  // --- State for image preview and dialog for full-size image ---
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  // --- Add local loading state for submit button ---
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      loadSubscriptions();
    }
  }, [isModalOpen]);

  const loadSubscriptions = async () => {
    setLoadingSubscriptions(true);
    try {
      const subsData = await fetchSubscriptions();
      setSubscriptions(
        subsData.map((sub: any) => ({
          ...sub,
          name: String(sub.name),
        }))
      );
    } catch (error) {
      console.error("Failed to load subscriptions:", error);
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  
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

  // Simple validation for required fields
  // const validateForm = () => {
  //   if (!formData.name?.trim()) return "Full Name";
  //   if (!formData.subsName?.trim()) return "Subscription";
  //   if (!formData.email?.trim()) return "Email";
  //   // if (!editingAdmin && (!formData.password || formData.password.length < 8))
  //   //   return "Password";
  //   if (!formData.phoneNo || !isValidPhoneNumber(formData.phoneNo))
  //     return "Phone Number";
  //   return null;
  // };

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

          {/* Subscription (dynamic select) */}
          <div>
            <Label htmlFor="subsName">
              Subscription<span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData["subsName"] || ""}
              onValueChange={(value) => handleInputChange("subsName", value)}
              disabled={loadingSubscriptions || editingAdmin}
              required
            >
              <SelectTrigger id="subsName">
                <SelectValue placeholder={loadingSubscriptions ? "Loading..." : "Select Subscription"} />
              </SelectTrigger>
              <SelectContent>
                {loadingSubscriptions ? (
                  <SelectItem value="__loading__" disabled>
                    Loading...
                  </SelectItem>
                ) : subscriptions.length === 0 ? (
                  <SelectItem value="__none__" disabled>
                    No subscriptions found
                  </SelectItem>
                ) : (
                  subscriptions.map((sub) => (
                    <SelectItem key={sub._id} value={sub.name}>
                      {sub.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
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
              disabled={editingAdmin}
            />
          </div>

          {/* Password (only when creating) */}
          {/* {!editingAdmin && (
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
                : editingAdmin
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Full Size Image Preview Dialog */}
      <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="p-4">
            <DialogTitle>Profile Preview</DialogTitle>
          </DialogHeader>
          <div
            className="flex justify-center items-center p-4"
            style={{ height: "60vh" }}
          >
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Full Size Photo"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default AdminFormModal;
