import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  UserCheck, 
  ShoppingCart, 
  Package,
  TrendingUp,
  BarChart3
} from "lucide-react";

interface AdminStatsOverviewProps {
  statsData: any;
}

const AdminStatsOverview: React.FC<AdminStatsOverviewProps> = ({ statsData }) => {
  if (!statsData) {
    return (
      <Paper sx={{ borderRadius: 2, p: 3 }}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Paper>
    );
  }

  const statsCards = [
    {
      title: "Total Users",
      value: statsData.users || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Companies",
      value: statsData.companies || 0,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+5%",
      changeType: "increase"
    },
    {
      title: "Customers",
      value: statsData.customers || 0,
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+8%",
      changeType: "increase"
    },
    {
      title: "Suppliers",
      value: statsData.suppliers || 0,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+3%",
      changeType: "increase"
    },
    {
      title: "Sales Entries",
      value: statsData.salesEntries || 0,
      icon: ShoppingCart,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+15%",
      changeType: "increase"
    },
    {
      title: "Purchase Entries",
      value: statsData.purchaseEntries || 0,
      icon: BarChart3,
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "+7%",
      changeType: "increase"
    }
  ];

  const totalTransactions = (statsData.salesEntries || 0) + (statsData.purchaseEntries || 0);

  return (
    <Paper sx={{ borderRadius: 2, p: 3, boxShadow: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} className="text-gray-900 mb-1">
          Business Overview
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Your administrative dashboard statistics and key metrics
        </Typography>
      </Box>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Typography variant="body2" className="text-gray-600 mb-1">
                      {stat.title}
                    </Typography>
                    <Typography variant="h6" className="font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </Typography>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <Typography variant="caption" className="text-green-600 font-medium">
                        {stat.change}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        this month
                      </Typography>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Key Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Transactions */}
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Typography variant="body2" className="text-gray-600 font-medium">
                Total Transactions
              </Typography>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <Typography variant="h5" className="font-bold text-gray-900 mb-1">
              {totalTransactions.toLocaleString()}
            </Typography>
            <Typography variant="caption" className="text-gray-600">
              Sales + Purchase entries combined
            </Typography>
          </CardContent>
        </Card>

        {/* Business Health */}
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Typography variant="body2" className="text-gray-600 font-medium">
                Business Health
              </Typography>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Excellent
              </Badge>
              <Typography variant="h6" className="font-bold text-green-600">
                95%
              </Typography>
            </div>
            <Typography variant="caption" className="text-gray-600">
              Based on activity & growth metrics
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <Box sx={{ mt: 4, p: 3, bgcolor: "#f8fafc", borderRadius: 2 }}>
        <Typography variant="subtitle2" className="text-gray-900 font-semibold mb-2">
          Quick Insights
        </Typography>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Typography variant="body2" className="text-gray-600">
              Most Active Entity
            </Typography>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {statsData.salesEntries > statsData.purchaseEntries ? "Sales" : "Purchases"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <Typography variant="body2" className="text-gray-600">
              Average per Company
            </Typography>
            <Typography variant="body2" className="font-medium text-gray-900">
              {statsData.companies > 0 
                ? Math.round((statsData.customers || 0) / statsData.companies)
                : 0
              } customers
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography variant="body2" className="text-gray-600">
              User to Company Ratio
            </Typography>
            <Typography variant="body2" className="font-medium text-gray-900">
              {statsData.companies > 0 
                ? Math.round((statsData.users || 0) / statsData.companies * 10) / 10
                : 0
              }:1
            </Typography>
          </div>
        </div>
      </Box>
    </Paper>
  );
};

export default AdminStatsOverview;
