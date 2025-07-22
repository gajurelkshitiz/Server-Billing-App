import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  Calendar,
  Clock,
  BarChart3,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";
import { getAuthHeaders } from "@/utils/auth";

interface UserActivityOverviewProps {
  profile: any;
  dashboardStats: any;
}

interface ActivityData {
  monthlyGrowth?: number;
  weeklyActivity?: number;
  topPerformingCategory?: string;
  efficiency?: number;
  goals?: {
    completed: number;
    total: number;
  };
  recentAchievements?: string[];
}

const UserActivityOverview: React.FC<UserActivityOverviewProps> = ({
  profile,
  dashboardStats,
}) => {
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      try {
        // Calculate activity metrics from available data
        const stats = dashboardStats || {};
        const totalTransactions = (stats.salesEntries || 0) + (stats.purchaseEntries || 0);
        const totalEntities = (stats.customers || 0) + (stats.suppliers || 0);
        
        // Mock calculations for demonstration - replace with actual API calls
        const mockActivity: ActivityData = {
          monthlyGrowth: Math.floor(Math.random() * 25) + 5, // 5-30%
          weeklyActivity: Math.floor((totalTransactions / 4) * 100) / 100, // Weekly average
          topPerformingCategory: stats.salesEntries > stats.purchaseEntries ? "Sales" : "Purchases",
          efficiency: Math.min(95, Math.floor((totalTransactions / Math.max(totalEntities, 1)) * 20)), // Efficiency score
          goals: {
            completed: Math.floor(Math.random() * 8) + 3,
            total: 10
          },
          recentAchievements: [
            "Completed 50+ sales entries",
            "Added 10+ new customers",
            "Maintained 95% data accuracy"
          ]
        };

        setActivityData(mockActivity);
      } catch (error) {
        console.error("Error fetching activity data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (dashboardStats) {
      fetchActivityData();
    }
  }, [dashboardStats]);

  const stats = dashboardStats || {};
  const totalTransactions = (stats.salesEntries || 0) + (stats.purchaseEntries || 0);

  return (
    <Card className="shadow-lg border-0">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <Typography variant="h6" className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Activity Overview
        </Typography>
      </div>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <div className="space-y-4">
            <Typography variant="h6" className="text-gray-800 font-semibold mb-4">
              Performance Metrics
            </Typography>
            
            {/* Monthly Growth */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <Typography variant="body2" className="text-green-700 font-medium">
                  Monthly Growth
                </Typography>
              </div>
              <Typography variant="h4" className="text-green-800 font-bold">
                +{activityData.monthlyGrowth || 15}%
              </Typography>
              <Typography variant="caption" className="text-green-600">
                Compared to last month
              </Typography>
            </div>

            {/* Weekly Activity */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <Typography variant="body2" className="text-blue-700 font-medium">
                  Weekly Average
                </Typography>
              </div>
              <Typography variant="h4" className="text-blue-800 font-bold">
                {Math.floor(totalTransactions / 4)}
              </Typography>
              <Typography variant="caption" className="text-blue-600">
                Transactions per week
              </Typography>
            </div>

            {/* Efficiency Score */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-600" />
                <Typography variant="body2" className="text-purple-700 font-medium">
                  Efficiency Score
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <Typography variant="h4" className="text-purple-800 font-bold">
                  {activityData.efficiency || 88}%
                </Typography>
                <Chip
                  label="Excellent"
                  size="small"
                  className="bg-purple-100 text-purple-800 text-xs"
                />
              </div>
              <LinearProgress
                variant="determinate"
                value={activityData.efficiency || 88}
                className="mt-2"
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#e5e7eb",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#9333ea",
                  },
                }}
              />
            </div>
          </div>

          {/* Goals and Achievements */}
          <div className="space-y-4">
            <Typography variant="h6" className="text-gray-800 font-semibold mb-4">
              Goals & Achievements
            </Typography>

            {/* Goals Progress */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-orange-600" />
                <Typography variant="body2" className="text-orange-700 font-medium">
                  Monthly Goals
                </Typography>
              </div>
              <div className="flex items-center justify-between mb-2">
                <Typography variant="body2" className="text-gray-600">
                  Progress
                </Typography>
                <Typography variant="body2" className="text-orange-800 font-semibold">
                  {activityData.goals?.completed || 7}/{activityData.goals?.total || 10}
                </Typography>
              </div>
              <LinearProgress
                variant="determinate"
                value={((activityData.goals?.completed || 7) / (activityData.goals?.total || 10)) * 100}
                className="mb-2"
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#fed7aa",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#ea580c",
                  },
                }}
              />
              <Typography variant="caption" className="text-orange-600">
                {Math.floor(((activityData.goals?.completed || 7) / (activityData.goals?.total || 10)) * 100)}% completed
              </Typography>
            </div>

            {/* Recent Achievements */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-yellow-600" />
                <Typography variant="body2" className="text-yellow-700 font-medium">
                  Recent Achievements
                </Typography>
              </div>
              <div className="space-y-2">
                {(activityData.recentAchievements || [
                  `Recorded ${totalTransactions} transactions`,
                  `Managed ${stats.customers || 0} customers`,
                  "Maintained data consistency"
                ]).slice(0, 3).map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <Typography variant="caption" className="text-yellow-800">
                      {achievement}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Category */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <Typography variant="body2" className="text-indigo-700 font-medium">
                  Top Category
                </Typography>
              </div>
              <Typography variant="h5" className="text-indigo-800 font-bold">
                {activityData.topPerformingCategory || "Sales"}
              </Typography>
              <Typography variant="caption" className="text-indigo-600">
                Most active this month
              </Typography>
            </div>
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Typography variant="h5" className="font-bold text-gray-800">
                {totalTransactions}
              </Typography>
              <Typography variant="caption" className="text-gray-600">
                Total Transactions
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h5" className="font-bold text-gray-800">
                {stats.customers || 0}
              </Typography>
              <Typography variant="caption" className="text-gray-600">
                Customers
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h5" className="font-bold text-gray-800">
                {stats.suppliers || 0}
              </Typography>
              <Typography variant="caption" className="text-gray-600">
                Suppliers
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h5" className="font-bold text-gray-800">
                {Math.floor(totalTransactions / Math.max(new Date().getDate(), 1))}
              </Typography>
              <Typography variant="caption" className="text-gray-600">
                Daily Average
              </Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityOverview;
