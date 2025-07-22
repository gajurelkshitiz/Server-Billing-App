import React, { useRef } from "react";
import { Box, Typography, Button, TextField, MenuItem, Paper, Divider } from "@mui/material";
import { FaLock } from "react-icons/fa";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminProfileSectionProps {
  profile: any;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImage?: string | null;
}

const AdminProfileSection: React.FC<AdminProfileSectionProps> = ({
  profile,
  formData,
  onInputChange,
  onImageChange,
  previewImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => fileInputRef.current?.click();

  // List of fields that are editable in the profile section
  const editableFields = [
    "name",
    "email",
    "profileImage",
    "phoneNo",
    "address",
    "country",
    "city",
    "province",
  ];

  // Show loading if profile is not loaded yet
  if (!profile) {
    return (
      <Paper sx={{ borderRadius: 2, p: 3 }}>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Paper>
    );
  }

  return (
    <Paper sx={{ borderRadius: 2, p: 3, boxShadow: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} className="text-gray-900 mb-1">
          Basic Information
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Manage your personal details and account information
        </Typography>
      </Box>

      {/* Profile Image and Basic Info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
        {/* Profile Image and Upload */}
        <div style={{ position: "relative", cursor: "pointer" }} onClick={handlePhotoClick}>
          <Avatar style={{ width: 80, height: 80 }}>
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              />
            ) : profile.profileImage ? (
              <img
                src={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${profile.profileImage}`}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              <AvatarFallback className="bg-blue-600 text-white" style={{ fontSize: 36 }}>
                {profile.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            )}
          </Avatar>
          {/* Hidden file input for image upload */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={onImageChange}
          />
        </div>
        
        <Box sx={{ flex: 1 }}>
          {/* Name and Role */}
          <Typography variant="h6" fontWeight={600} className="text-gray-900">
            {profile.name}
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-1">
            Administrator • ID: {profile._id?.slice(-8)}
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-2">
            Member since {new Date(profile.createdAt).toLocaleDateString()}
          </Typography>
          
          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<FaLock />}
              sx={{ 
                textTransform: "none",
                borderColor: "#e5e7eb",
                color: "#6b7280",
                "&:hover": { borderColor: "#d1d5db", backgroundColor: "#f9fafb" }
              }}
            >
              Change Password
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handlePhotoClick}
              sx={{
                textTransform: "none",
                color: "#059669", 
                borderColor: "#059669",
                "&:hover": { borderColor: "#047857", backgroundColor: "#ecfdf5" }
              }}
            >
              Change Photo
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Basic Details Form */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} className="text-gray-900 mb-3">
          Personal Details
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          {/* Full Name */}
          <TextField
            label="Full Name"
            name="name"
            value={formData.name || ""}
            onChange={onInputChange}
            fullWidth
            variant="outlined"
            disabled={!editableFields.includes("name")}
          />
          
          {/* Email */}
          <TextField
            label="Email Address"
            name="email"
            value={formData.email || ""}
            onChange={onInputChange}
            fullWidth
            variant="outlined"
            disabled={!editableFields.includes("email")}
          />

          {/* Phone Number */}
          <TextField
            label="Phone Number"
            name="phoneNo"
            value={formData.phoneNo || ""}
            onChange={onInputChange}
            fullWidth
            variant="outlined"
            disabled={!editableFields.includes("phoneNo")}
          />

          {/* Subscription (Read-only) */}
          <TextField 
            label="Current Subscription" 
            value={profile.subsName || "No subscription"} 
            fullWidth 
            disabled 
            variant="outlined"
          />
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Address Information */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} className="text-gray-900 mb-3">
          Address Information
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          {/* Country */}
          <TextField
            label="Country"
            name="country"
            value={formData.country || ""}
            onChange={onInputChange}
            fullWidth
            variant="outlined"
            disabled={!editableFields.includes("country")}
          />

          {/* City */}
          <TextField
            label="City"
            name="city"
            value={formData.city || ""}
            onChange={onInputChange}
            fullWidth
            variant="outlined"
            disabled={!editableFields.includes("city")}
          />

          {/* State/Province */}
          <TextField
            label="State/Province"
            name="province"
            value={formData.province || ""}
            onChange={onInputChange}
            fullWidth
            variant="outlined"
            disabled={!editableFields.includes("province")}
          />

          {/* Status (Read-only) */}
          <TextField
            label="Account Status"
            value={profile.isVerified ? "Verified" : "Pending Verification"}
            fullWidth
            disabled
            variant="outlined"
            InputProps={{
              startAdornment: (
                <span 
                  style={{ 
                    color: profile.isVerified ? "#059669" : "#f59e0b", 
                    marginRight: 8,
                    fontSize: "12px"
                  }}
                >
                  ●
                </span>
              ),
            }}
          />

          {/* Full Address */}
          <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
            <TextField
              label="Street Address"
              name="address"
              value={formData.address || ""}
              onChange={onInputChange}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              disabled={!editableFields.includes("address")}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default AdminProfileSection;
