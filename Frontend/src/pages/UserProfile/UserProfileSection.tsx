import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  TextField,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Edit, Camera } from "lucide-react";

interface UserProfileSectionProps {
  profile: any;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  profile,
  formData,
  onInputChange,
  onImageChange,
  previewImage,
}) => {
  // Guard clause to prevent rendering if data is not loaded
  if (!formData || !profile) {
    return null; // or a loading skeleton/spinner if you prefer
  }

  const profileImageUrl = previewImage || 
    (profile?.profileImage ? `${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${profile.profileImage}` : null);

  return (
    <Card className="shadow-lg border-0">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <Typography variant="h6" className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Edit className="w-5 h-5 text-blue-600" />
          User Information
        </Typography>
      </div>
      <CardContent className="p-6">
        {/* Profile Image Section */}
        <Box className="flex flex-col items-center mb-8">
          <Box className="relative">
            <Avatar
              src={profileImageUrl}
              sx={{
                width: 120,
                height: 120,
                fontSize: "3rem",
                bgcolor: "primary.main",
                border: "4px solid #e5e7eb",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
              }}
            >
              {profile?.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <label htmlFor="profile-image-upload">
              <IconButton
                component="span"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "primary.main",
                  color: "white",
                  width: 36,
                  height: 36,
                  border: "3px solid white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                <Camera size={16} />
              </IconButton>
            </label>
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              style={{ display: "none" }}
            />
          </Box>
          <Typography variant="body2" className="text-gray-500 mt-2 text-center">
            Click the camera icon to update your profile picture
          </Typography>
        </Box>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name || ""}
              onChange={onInputChange}
              variant="outlined"
              className="mb-4"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
              }}
            />
          </div>
          
          <div className="w-full">
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={onInputChange}
              variant="outlined"
              className="mb-4"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
              }}
            />
          </div>

          <div className="w-full">
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone || ""}
              onChange={onInputChange}
              variant="outlined"
              className="mb-4"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
              }}
            />
          </div>

          <div className="w-full">
            <TextField
              fullWidth
              label="Company/Organization"
              name="company"
              value={formData.company || ""}
              onChange={onInputChange}
              variant="outlined"
              className="mb-4"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
              }}
            />
          </div>

          <div className="col-span-1 md:col-span-2 w-full">
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address || ""}
              onChange={onInputChange}
              variant="outlined"
              multiline
              rows={2}
              className="mb-4"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
              }}
            />
          </div>

          <div className="w-full">
            <TextField
              fullWidth
              label="Position/Role"
              name="position"
              value={formData.position || ""}
              onChange={onInputChange}
              variant="outlined"
              className="mb-4"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
              }}
            />
          </div>

          <div className="w-full">
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department || ""}
              onChange={onInputChange}
              variant="outlined"
              className="mb-4"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
              }}
            />
          </div>

          {/* User Role and Status Display */}
          <div className="w-full">
            <Box className="bg-gray-50 p-3 rounded-lg">
              <Typography variant="body2" className="text-gray-600 mb-1">
                User Role
              </Typography>
              <Typography variant="body1" className="font-medium text-gray-800 capitalize">
                {profile?.role || "User"}
              </Typography>
            </Box>
          </div>

          <div className="w-full">
            <Box className="bg-gray-50 p-3 rounded-lg">
              <Typography variant="body2" className="text-gray-600 mb-1">
                Account Status
              </Typography>
              <Typography 
                variant="body1" 
                className={`font-medium ${
                  profile?.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {profile?.isActive ? "Active" : "Inactive"}
              </Typography>
            </Box>
          </div>

          {profile?.createdAt && (
            <div className="col-span-1 md:col-span-2 w-full">
              <Box className="bg-blue-50 p-3 rounded-lg">
                <Typography variant="body2" className="text-blue-600 mb-1">
                  Member Since
                </Typography>
                <Typography variant="body1" className="font-medium text-blue-800">
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileSection;
