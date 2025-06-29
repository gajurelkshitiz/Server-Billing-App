import React, { useRef } from "react";
import { Box, Typography, Button, TextField, MenuItem, Paper, Divider } from "@mui/material";
import { FaLock } from "react-icons/fa";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminProfileSectionProps {
  profile: any;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImage?: string | null; // Add this prop
}

const AdminProfileSection: React.FC<AdminProfileSectionProps> = ({
  profile,
  formData,
  onInputChange,
  onImageChange,
  previewImage,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
  if (!profile) return <div>Loading...</div>;

  return (
    <Paper sx={{ borderRadius: 2, p: 3 }}>
      {/* Basic Info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
        {/* Profile Image and Upload */}
        <div style={{ position: "relative", cursor: "pointer" }} onClick={handlePhotoClick}>
          <Avatar style={{ width: 80, height: 80 }}>
            {/* Show preview image if selected, else show current profile image, else fallback */}
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              />
            ) : profile.profileImage ? (
              <img
                src={profile.profileImage}
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
        <Box>
          {/* Name and ID */}
          <Typography variant="h6" fontWeight={600}>{profile.name}</Typography>
          <Typography variant="body2" color="text.secondary">ID: {profile._id}</Typography>
          {/* Change Password and Change Photo buttons */}
          <Button variant="outlined" size="small" sx={{ mt: 1 }} startIcon={<FaLock />}>Change Password</Button>
          <Button
            variant="outlined"
            size="small"
            sx={{
              mt: 1, ml: 1, color: "#388e3c", borderColor: "#81c784",
              "&:hover": { borderColor: "#388e3c", backgroundColor: "#e8f5e9" }
            }}
            onClick={handlePhotoClick}
          >
            Change Photo
          </Button>
        </Box>
      </Box>
      {/* Editable and read-only fields */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        {/* Editable Full Name */}
        <TextField
          label="Full Name"
          name="name"
          value={formData.name || ""}
          onChange={onInputChange}
          fullWidth
          disabled={!editableFields.includes("name")}
        />
        {/* Read-only fields */}
        <TextField label="Subscription" value={profile.subsName || ""} fullWidth disabled />
        <TextField label="System Joined Date" value={profile.createdAt || ""} fullWidth disabled />
        <TextField label="Hired Date" value={profile.hiredDate || ""} type="date" fullWidth InputLabelProps={{ shrink: true }} disabled />
      </Box>
      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {/* Contact Details Section */}
        <Box
          sx={{
            flex: 1,
            minWidth: 280,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            p: 2,
            background: "#fafbfc",
          }}
        >
          <Typography variant="h6" gutterBottom>Contacts</Typography>
          <Divider sx={{ my: 1 }} />
            <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ marginRight: 8, color: "#1976d2" }}
              >
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"/>
              </svg>
              {profile.phoneNo || "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ marginRight: 8, color: "#1976d2" }}
              >
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"/>
              </svg>
              {profile.email || "-"}
            </Typography>
            </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Editable Phone */}
            <TextField
              label="Phone"
              name="phoneNo"
              value={formData.phoneNo || ""}
              onChange={onInputChange}
              fullWidth
              disabled={!editableFields.includes("phoneNo")}
            />
            {/* Editable Email */}
            <TextField
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={onInputChange}
              fullWidth
              disabled={!editableFields.includes("email")}
            />
            {/* Read-only Status */}
            <TextField
              label="Status"
              value={profile.status || ""}
              select
              fullWidth
              InputProps={{
                startAdornment: <span style={{ color: "green", marginRight: 8 }}>●</span>,
              }}
              disabled
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* Address Section */}
        <Box
          sx={{
            flex: 1,
            minWidth: 280,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            p: 2,
            background: "#fafbfc",
          }}
        >
          <Typography variant="h6" gutterBottom>Address</Typography>
          <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              <span style={{ display: "inline-flex", alignItems: "center", color: "#1976d2", marginRight: 8 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={22}
                height={22}
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ marginRight: 6 }}
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {[profile.address, profile.city, profile.province, profile.country]
                .filter(Boolean)
                .join(", ")}
              </span>
            </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            {/* Editable Country */}
            <TextField
              label="Country"
              name="country"
              value={formData.country || ""}
              onChange={onInputChange}
              fullWidth
              disabled={!editableFields.includes("country")}
            />
            {/* Editable City */}
            <TextField
              label="City"
              name="city"
              value={formData.city || ""}
              onChange={onInputChange}
              fullWidth
              disabled={!editableFields.includes("city")}
            />
          </Box>
          {/* Editable Province */}
          <TextField
            label="State/province/area"
            name="province"
            value={formData.province || ""}
            onChange={onInputChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={!editableFields.includes("province")}
          />
          {/* Editable Address */}
          <TextField
            label="Address"
            name="address"
            value={formData.address || ""}
            onChange={onInputChange}
            fullWidth
            disabled={!editableFields.includes("address")}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default AdminProfileSection;