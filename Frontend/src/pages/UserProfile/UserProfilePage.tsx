import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import UserProfileSection from "./UserProfileSection";
import UserTransactionStats from "./UserTransactionStats";
import UserActivityOverview from "./UserActivityOverview";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/context/ProfileContext";
import { getAuthHeaders } from "@/utils/auth";

const UserProfilePage: React.FC = () => {
  const { profile, setProfile, formData, setFormData } = useProfile();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [transactionStats, setTransactionStats] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const { toast } = useToast();

  // Fetch user profile and related data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        
        // Fetch profile data
        const profileRes = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/user/me/profile`,
          { headers: getAuthHeaders() }
        );
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.user || null);
          setFormData(profileData.user || {});
        }

        // Fetch user dashboard counts
        const statsRes = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/userCount`,
          { headers: getAuthHeaders() }
        );
        if (statsRes.ok) {
          const stats = await statsRes.json();
          setDashboardStats(stats);
        }

        // Calculate user-specific transaction stats
        const userStats = {
          totalSalesEntries: dashboardStats?.salesEntries || 0,
          totalPurchaseEntries: dashboardStats?.purchaseEntries || 0,
          totalCustomers: dashboardStats?.customers || 0,
          totalSuppliers: dashboardStats?.suppliers || 0,
          totalTransactions: (dashboardStats?.salesEntries || 0) + (dashboardStats?.purchaseEntries || 0)
        };
        setTransactionStats(userStats);

      } catch (err) {
        console.error("Error fetching user data:", err);
        setProfile(null);
        setFormData({});
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setProfile, setFormData, dashboardStats?.salesEntries, dashboardStats?.purchaseEntries, dashboardStats?.customers, dashboardStats?.suppliers]);

  // Check if any field has changed
  const isChanged = profile && JSON.stringify(formData) !== JSON.stringify(profile);


  console.log('After fetching user: ', profile);

  // Handlers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    },
    [setFormData]
  );

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setFormData((prev: any) => ({ ...prev, profileImage: file }));
    }
  }, [setFormData]);

  // Save only changed fields
  const handleSave = useCallback(async () => {
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
        "X-Role": "user",
      };

      if (changedFields.profileImage instanceof File) {
        body = new FormData();
        Object.entries(changedFields).forEach(([key, value]) => {
          body.append(key, value as any);
        });
      } else {
        body = JSON.stringify(changedFields);
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/user/me/update`,
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

      setProfile(updated.user || null);
      setFormData(updated.user || {});
      setPreviewImage(null);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
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
  }, [formData, profile, toast, setProfile, setFormData]);

  const handleCancel = () => {
    setFormData(profile || {});
    setPreviewImage(null);
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: "#fafbfc", minHeight: "100vh", p: 3 }}>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Box>
    );
  }

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
        <Typography variant="h4" fontWeight={600} className="text-gray-900">
          My Profile
        </Typography>
        <Box>
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !isChanged || saving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={!isChanged || saving}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </Box>
      </Box>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <UserProfileSection
            profile={profile}
            formData={formData}
            onInputChange={handleInputChange}
            onImageChange={handleImageChange}
            previewImage={previewImage}
          />
          
          {/* Activity Overview */}
          <UserActivityOverview 
            profile={profile}
            dashboardStats={dashboardStats}
          />
        </div>


        {/* Transaction Statistics Sidebar */}
        <div className="space-y-6">
          <UserTransactionStats 
            profile={profile}
            transactionStats={transactionStats}
            dashboardStats={dashboardStats}
          />
        </div>
      </div>
    </Box>
  );
};

export default UserProfilePage;
