import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { allMenuItems } from '@/config/menuItems';
import { roleRoutes } from '@/routes/permissions';
import { useDashboardData } from './useDashboard';


const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || '';
  const username = localStorage.getItem('name');
  const [counts, setCounts] = React.useState<Record<string, number | undefined>>({});
  // const [loading, setLoading] = React.useState(true);

  const {
    transactionalDistribution,
    netRevenue,
    fiscalYearTotalRevenue,
    receivable,
    topCustomers,
    monthlyRevenue,
    fiscalYearTotalEarning,
    salesPaymentRatio,
    loading,
    error
  } = useDashboardData();

  

  const getQuickLinks = () => {
    const allowedPaths = roleRoutes[role as keyof typeof roleRoutes] || [];
    return allMenuItems
      .filter(item => allowedPaths.includes(item.path) && item.path !== '/home/dashboard' && item.path !== '/settings')
      .slice(0, 4);
  };


  // Show loading state for the entire dashboard
  if (loading) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600">Welcome, {username}!</p>
          </div>
        </div>

        {/* Loading Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          {Array.from({ length: 2 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Table */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-12 bg-gray-200 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Your existing component code with data (rest remains the same)
  const pieData = transactionalDistribution;
  const netRevenueData = netRevenue;
  const receivableData = receivable?.receivableData || [];
  const totalReceivableAmount = receivable?.totalReceivable || 0;
  const currentAmount = receivable?.currentAmount || 0;
  const overDueAmount = receivable?.overDueAmount || 0;
  const mrrData = monthlyRevenue;
  // const salesVsPaymentsData = [
  //   { name: 'Sales', amount: 1650000, fill: '#3b82f6' },
  //   { name: 'Payments', amount: 1225000, fill: '#10b981' },
  // ];
  const salesVsPaymentsData = salesPaymentRatio.map(item => ({
    ...item, 
    amount: item.amount || 0 // Ensure amount exists, default to o if missing
  }))


  const quickLinks = getQuickLinks();

  // Show error state
  if (error) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600">Welcome, {username}!</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error loading dashboard data: {error.message}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Welcome, {username}!</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {loading
          ? Array.from({ length: quickLinks.length }).map((_, idx) => (
              <Card key={idx} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-6 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : quickLinks.map((link, index) => {
              const Icon = link.icon;
              const count = link.countKey ? counts[link.countKey] : undefined;
              return (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${link.color} flex items-center justify-center text-white text-lg sm:text-xl`}>
                        <Icon size={20} className="sm:w-7 sm:h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{link.title}</h3>
                        {/* Only show count if defined */}
                        {count !== undefined && (
                          <div className="text-xl sm:text-2xl font-bold mt-1">{count}</div>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(link.path)}
                          className="p-0 h-auto text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
                        >
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Charts and Reports */}

      {/* New Visualizations Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Transaction Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Transaction Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Net Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Net Revenue</CardTitle>
            <div className="text-gray-500 text-sm">This Year</div>
          </CardHeader>
          <CardContent>
            {/* TODO: yo eksin ma milamla */}
            <div className="text-2xl font-bold mb-2">Rs.{fiscalYearTotalRevenue.toLocaleString()}</div>
            {/* <div className="text-green-600 font-semibold mb-2">6.23% Year on Year</div> */}
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={netRevenueData}>
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#A7F3D0" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top 3 Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Customer Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Total Sales</th>
                  <th className="text-left py-3 px-4 font-semibold">Total Due</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{customer.name}</td>
                    <td className="py-3 px-4 text-green-600">Rs. {customer.totalSales.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="text-orange-600 font-semibold">Rs. {customer.totalDue}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>



      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Receivable Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Receivable Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <div>
                <div className="text-gray-500 text-sm">Total Receivables</div>
                <div className="text-xl font-bold">Rs. {totalReceivableAmount.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-blue-600">Current : Rs. {currentAmount.toLocaleString()}</div>
                <div className="text-orange-600">Overdue : Rs. {overDueAmount.toLocaleString()}</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={receivableData}>
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="value">
                  {receivableData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Recurring Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Recurring Revenue</CardTitle>
            <div className="text-gray-500 text-sm">This Year</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">Rs. {fiscalYearTotalEarning.toLocaleString()}</div>
            {/* <div className="text-green-600 font-semibold mb-2">9.75% Year on Year</div> */}
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={mrrData}>
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>


        

        {/* Total Sales vs Total Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Sales vs Payments</CardTitle>
            <div className="text-gray-500 text-sm">This Year</div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div>
                <div className="text-gray-500 text-sm">Total Sales</div>
                <div className="text-xl font-bold text-blue-600">
                  Rs. {salesVsPaymentsData[0].amount.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-sm">Total Payments</div>
                <div className="text-xl font-bold text-green-600">
                  Rs. {salesVsPaymentsData[1].amount.toLocaleString()}
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={salesVsPaymentsData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip 
                  formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {salesVsPaymentsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>


        
      </div>
    </div>
  );
};

export default Dashboard;
