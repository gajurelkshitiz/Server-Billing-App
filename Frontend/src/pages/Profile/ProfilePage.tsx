import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import AdminProfileSection from "./AdminProfileSection";
import UserProfileSection from "./UserProfileSection";
import { useToast } from "@/hooks/use-toast"; // Add this import
import { useProfile } from "@/context/ProfileContext";

const ProfilePage: React.FC = () => {
  const role = localStorage.getItem("role");
  const { profile, setProfile, formData, setFormData } = useProfile();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast(); // Add this line

  // Fetch profile data on mount or when role changes
  // useEffect(() => {
  //   setProfile(null); // Always reset before fetching
  //   const fetchProfile = async () => {
  //     setLoading(true);
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await fetch(
  //         `${import.meta.env.REACT_APP_API_URL}/${role}/me/profile`,
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       if (!res.ok) throw new Error("Failed to fetch profile");
  //       const data = await res.json();
  //       setProfile(data[role] || null); // Set context
  //       setFormData(data[role] || {});
  //     } catch (err) {
  //       setProfile(null);
  //       setFormData({});
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProfile();
  // }, [role, setProfile]);

  // Check if any field has changed
  const isChanged =
    profile && JSON.stringify(formData) !== JSON.stringify(profile);

  // Handlers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setFormData((prev: any) => ({ ...prev, profileImage: file }));
    }
  }, []);

  // Save only changed fields
  const handleSave = useCallback(async () => {
    console.log("Saving profile with formData:", formData);
    const changedFields: any = {};
    Object.keys(formData).forEach((key) => {
      if (
        formData[key] !== undefined &&
        formData[key] !== "" &&
        formData[key] !== (profile[key] || "")
      ) {
        changedFields[key] = formData[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      console.log("No changes to save.");
      toast({
        title: "No Changes",
        description: "There are no changes to save.",
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      let body;
      let headers: any = {
        Authorization: `Bearer ${token}`,
        "X-Role": role || "",
      };

      if (changedFields.profileImage instanceof File) {
        body = new FormData();
        Object.entries(changedFields).forEach(([key, value]) => {
          body.append(key, value as any);
        });
        // Remove profileImage from context until backend confirms
      } else {
        body = JSON.stringify(changedFields);
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/${role}/me/update`,
        {
          method: "PATCH",
          headers,
          body,
        }
      );
      const updated = await res.json();

      if (!res.ok) {
        console.error("Failed to update profile:", updated);
        toast({
          title: "Error",
          description: updated?.msg || "Failed to update profile",
          variant: "destructive",
        });
        return;
      }

      setProfile(updated[role] || null); // Update context with backend data
      setFormData(updated[role] || {});
      setPreviewImage(null);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      console.log("Profile updated successfully:", updated[role]);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [formData, profile, role, toast, setProfile]);

  if (loading) return <div>Loading...</div>;

  return (
    <Box sx={{ bgcolor: "#fafbfc", minHeight: "100vh", p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Profile
        </Typography>
        <Box>
          <Button
            variant="text"
            sx={{ mr: 2 }}
            onClick={() => setFormData(profile)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!isChanged || saving}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
      {/* Profile Section for admin */}
      {role === "admin" && (
        <AdminProfileSection
          profile={profile}
          formData={formData}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
          previewImage={previewImage}
        />
      )}

      {/* Profile Section for user */}
      {role === "user" && (
        <UserProfileSection
          profile={profile}
          formData={formData}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
          previewImage={previewImage}
        />
      )}
    </Box>
  );
};

export default ProfilePage;