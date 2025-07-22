import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  ShoppingCart,
  Package,
  Users,
  Truck,
  TrendingUp,
  FileText,
  DollarSign,
  Activity,
} from "lucide-react";
import { getAuthHeaders } from "@/utils/auth";

interface UserTransactionStatsProps {
  profile: any;
  transactionStats: any;
  dashboardStats: any;
}

interface TransactionData {
  salesEntries: number;
  purchaseEntries: number;
  customers: number;
  suppliers: number;
  totalRevenue?: number;
  totalExpenses?: number;
  recentTransactions?: any[];
}

const UserTransactionStats: React.FC<UserTransactionStatsProps> = ({
  profile,
  transactionStats,
  dashboardStats,
}) => {
  const [loading, setLoading] = useState(false);
  const [detailedStats, setDetailedStats] = useState<TransactionData | null>(
    null
  );
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDetailedStats = async () => {
      setLoading(true);
      try {
        // Fetch user-specific dashboard counts
        const response = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/userCount`,
          { headers: getAuthHeaders() }
        );

        if (response.ok) {
          const data = await response.json();
          setDetailedStats({
            salesEntries: data.salesEntries || 0,
            purchaseEntries: data.purchaseEntries || 0,
            customers: data.customers || 0,
            suppliers: data.suppliers || 0,
          });
        }

        // Fetch recent transactions/activities if available
        const activityResponse = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/user/recent-activity`,
          { headers: getAuthHeaders() }
        );

        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setRecentActivity(activityData.activities || []);
        }
      } catch (error) {
        console.error("Error fetching detailed stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedStats();
  }, []);

  const stats = detailedStats || dashboardStats || {};
  const totalTransactions =
    (stats.salesEntries || 0) + (stats.purchaseEntries || 0);

  const statItems = [
    {
      label: "Sales Entries",
      value: stats.salesEntries || 0,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Total sales transactions recorded",
    },
    {
      label: "Purchase Entries",
      value: stats.purchaseEntries || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Total purchase transactions recorded",
    },
    {
      label: "Customers",
      value: stats.customers || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Total customers managed",
    },
    {
      label: "Suppliers",
      value: stats.suppliers || 0,
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Total suppliers managed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Transaction Overview */}
      <Card className="shadow-lg border-0">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b px-6 py-4">
          <Typography
            variant="h6"
            className="text-lg font-semibold text-black flex items-center gap-2"
          >
            <Activity className="w-5 h-5 text-green-600" />
            Transaction Overview
          </Typography>
        </div>
        <CardContent className="p-6">
          {loading ? (
            <Box className="flex justify-center items-center py-8">
              <CircularProgress size={32} />
            </Box>
          ) : (
            <div className="space-y-6">
              {/* Total Transactions Card */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" className="opacity-90">
                      Total Transactions
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {totalTransactions.toLocaleString()}
                    </Typography>
                  </div>
                  <TrendingUp className="w-8 h-8 opacity-80" />
                </div>
              </div>

              {/* Individual Stats */}
              <div className="space-y-4">
                {statItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className={`${item.bgColor} rounded-lg p-4 border border-gray-100`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg bg-white ${item.color}`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <Typography
                              variant="body2"
                              className="text-gray-600"
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="h6"
                              className="font-semibold text-gray-800"
                            >
                              {item.value.toLocaleString()}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <Typography
                        variant="caption"
                        className="text-gray-500 mt-2 block"
                      >
                        {item.description}
                      </Typography>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Status */}
      <Card className="shadow-lg border-0">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
          <Typography
            variant="h6"
            className="text-lg font-semibold text-gray-800 flex items-center gap-2"
          >
            <FileText className="w-5 h-5 text-indigo-600" />
            Account Status
          </Typography>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-600">
                Account Type
              </Typography>
              <Chip
                label={profile?.role || "User"}
                size="small"
                className="bg-blue-100 text-blue-800 font-medium"
              />
            </div>

            <Divider />

            <div className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-600">
                Status
              </Typography>
              <Chip
                label={profile?.isActive ? "Active" : "Inactive"}
                size="small"
                className={`font-medium ${
                  profile?.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              />
            </div>

            {profile?.lastLoginAt && (
              <>
                <Divider />
                <div className="flex items-center justify-between">
                  <Typography variant="body2" className="text-gray-600">
                    Last Login
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-800 font-medium"
                  >
                    {new Date(profile.lastLoginAt).toLocaleDateString()}
                  </Typography>
                </div>
              </>
            )}

            {profile?.createdAt && (
              <>
                <Divider />
                <div className="flex items-center justify-between">
                  <Typography variant="body2" className="text-gray-600">
                    Member Since
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-800 font-medium"
                  >
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-lg border-0">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
          <Typography
            variant="h6"
            className="text-lg font-semibold text-gray-800"
          >
            Quick Actions
          </Typography>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
              <ShoppingCart className="w-4 h-4 text-green-600 mb-1" />
              <Typography
                variant="caption"
                className="text-green-700 font-medium block"
              >
                New Sale
              </Typography>
            </button>

            <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
              <Package className="w-4 h-4 text-blue-600 mb-1" />
              <Typography
                variant="caption"
                className="text-blue-700 font-medium block"
              >
                New Purchase
              </Typography>
            </button>

            <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
              <Users className="w-4 h-4 text-purple-600 mb-1" />
              <Typography
                variant="caption"
                className="text-purple-700 font-medium block"
              >
                Add Customer
              </Typography>
            </button>

            <button className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
              <Truck className="w-4 h-4 text-orange-600 mb-1" />
              <Typography
                variant="caption"
                className="text-orange-700 font-medium block"
              >
                Add Supplier
              </Typography>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTransactionStats;
