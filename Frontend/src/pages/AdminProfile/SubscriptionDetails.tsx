import React from "react";
import { Paper, Typography, Box, Chip } from "@mui/material";
import { Calendar, Clock, Crown, Shield, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscriptionDetailsProps {
  profile: any;
  subscriptionData: any;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({
  profile,
  subscriptionData,
}) => {
  // Calculate remaining days (mock calculation - you should implement actual expiry date logic)
  const calculateRemainingDays = () => {
    if (!profile?.createdAt || !subscriptionData?.periodInDays) return 0;
    
    const createdDate = new Date(profile.createdAt);
    const expiryDate = new Date(createdDate.getTime() + (subscriptionData.periodInDays * 24 * 60 * 60 * 1000));
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const remainingDays = calculateRemainingDays();
  const isExpiringSoon = remainingDays <= 7;
  const isExpired = remainingDays <= 0;

  // Loading state
  if (!profile) {
    return (
      <Paper sx={{ borderRadius: 2, p: 3 }}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Paper>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subscription Plan Card */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown className="h-5 w-5 text-blue-600" />
            Subscription Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Plan Name */}
          <div className="flex items-center justify-between">
            <Typography variant="body2" className="text-gray-600">
              Current Plan
            </Typography>
            <Badge 
              variant={subscriptionData?.isPopular ? "default" : "secondary"}
              className={subscriptionData?.isPopular ? "bg-blue-600" : ""}
            >
              {profile.subsName || "No Plan"}
              {subscriptionData?.isPopular && " ⭐"}
            </Badge>
          </div>

          {/* Plan Description */}
          {subscriptionData?.description && (
            <div>
              <Typography variant="body2" className="text-gray-600 mb-1">
                Description
              </Typography>
              <Typography variant="body2" className="text-gray-900">
                {subscriptionData.description}
              </Typography>
            </div>
          )}

          {/* Subscription Status */}
          <div className="flex items-center justify-between">
            <Typography variant="body2" className="text-gray-600">
              Status
            </Typography>
            <Badge 
              variant={isExpired ? "destructive" : isExpiringSoon ? "outline" : "default"}
              className={
                isExpired 
                  ? "bg-red-100 text-red-800 border-red-200" 
                  : isExpiringSoon 
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                  : "bg-green-100 text-green-800 border-green-200"
              }
            >
              {isExpired ? "Expired" : isExpiringSoon ? "Expiring Soon" : "Active"}
            </Badge>
          </div>

          {/* Remaining Days */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <Typography variant="body2" className="text-gray-600 font-medium">
                Time Remaining
              </Typography>
            </div>
            <Typography 
              variant="h6" 
              className={`font-bold ${
                isExpired 
                  ? "text-red-600" 
                  : isExpiringSoon 
                  ? "text-yellow-600" 
                  : "text-green-600"
              }`}
            >
              {isExpired ? "Expired" : `${remainingDays} days`}
            </Typography>
            {isExpiringSoon && !isExpired && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3 text-yellow-600" />
                <Typography variant="caption" className="text-yellow-600">
                  Renewal required soon
                </Typography>
              </div>
            )}
          </div>

          {/* Subscription Features */}
          {subscriptionData?.features && (
            <div>
              <Typography variant="body2" className="text-gray-600 mb-2 font-medium">
                Plan Features
              </Typography>
              <div className="space-y-1">
                {subscriptionData.features.slice(0, 3).map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <Typography variant="caption" className="text-gray-700">
                      {feature}
                    </Typography>
                  </div>
                ))}
                {subscriptionData.features.length > 3 && (
                  <Typography variant="caption" className="text-blue-600 ml-3">
                    +{subscriptionData.features.length - 3} more features
                  </Typography>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Limits Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-green-600" />
            Plan Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Max Companies */}
          <div className="flex items-center justify-between">
            <Typography variant="body2" className="text-gray-600">
              Max Companies
            </Typography>
            <Badge variant="outline">
              {subscriptionData?.maxCompanies || "Unlimited"}
            </Badge>
          </div>

          {/* Max Users */}
          <div className="flex items-center justify-between">
            <Typography variant="body2" className="text-gray-600">
              Max Users
            </Typography>
            <Badge variant="outline">
              {subscriptionData?.maxUsers || "Unlimited"}
            </Badge>
          </div>

          {/* Max Photos */}
          <div className="flex items-center justify-between">
            <Typography variant="body2" className="text-gray-600">
              Max Photos
            </Typography>
            <Badge variant="outline">
              {subscriptionData?.maxPhotos || "Unlimited"}
            </Badge>
          </div>

          {/* Subscription Period */}
          <div className="flex items-center justify-between">
            <Typography variant="body2" className="text-gray-600">
              Period
            </Typography>
            <Badge variant="outline">
              {subscriptionData?.periodInDays 
                ? `${subscriptionData.periodInDays} days`
                : "Unknown"
              }
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-gray-600" />
            Account Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Join Date */}
          <div>
            <Typography variant="body2" className="text-gray-600 mb-1">
              Member Since
            </Typography>
            <Typography variant="body2" className="text-gray-900">
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </div>

          {/* Last Login */}
          <div>
            <Typography variant="body2" className="text-gray-600 mb-1">
              Last Login
            </Typography>
            <Typography variant="body2" className="text-gray-900">
              {profile.lastLogin 
                ? new Date(profile.lastLogin).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : "Never"
              }
            </Typography>
          </div>

          {/* Verification Status */}
          <div>
            <Typography variant="body2" className="text-gray-600 mb-1">
              Email Verification
            </Typography>
            <Badge 
              variant={profile.isVerified ? "default" : "outline"}
              className={
                profile.isVerified 
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
              }
            >
              {profile.isVerified ? "Verified" : "Pending"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Upgrade Plan
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              View Billing History
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionDetails;
