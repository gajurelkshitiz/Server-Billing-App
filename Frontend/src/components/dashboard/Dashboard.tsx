import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { allMenuItems } from '@/config/menuItems';
import { roleRoutes } from '@/routes/permissions';

const endpointMap: Record<string, string> = {
  admin: '/adminCount',
  user: '/userCount',
  superadmin: '/superadminCount',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || '';
  const username = localStorage.getItem('name');
  const [counts, setCounts] = React.useState<Record<string, number | undefined>>({});
  const [loading, setLoading] = React.useState(true);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    "X-Role": role,
  });

  React.useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const endpoint = endpointMap[role];
        if (!endpoint) {
          setCounts({});
          setLoading(false);
          return;
        }

        const url = `${import.meta.env.REACT_APP_API_URL}${endpoint}`;

        const res = await fetch(url, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        setCounts(data || {});
      } catch {
        setCounts({});
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
    // eslint-disable-next-line
  }, [role]);

  const getQuickLinks = () => {
    const allowedPaths = roleRoutes[role as keyof typeof roleRoutes] || [];
    return allMenuItems
      .filter(item => allowedPaths.includes(item.path) && item.path !== '/dashboard' && item.path !== '/settings')
      .slice(0, 4);
  };

  // Sample data for charts
  const salesData = [
    { month: 'Jan', sales: 4000, purchases: 2400 },
    { month: 'Feb', sales: 3000, purchases: 1398 },
    { month: 'Mar', sales: 2000, purchases: 9800 },
    { month: 'Apr', sales: 2780, purchases: 3908 },
    { month: 'May', sales: 1890, purchases: 4800 },
    { month: 'Jun', sales: 2390, purchases: 3800 },
  ];

  const pieData = [
    { name: 'Sales', value: 400, color: '#0088FE' },
    { name: 'Purchases', value: 300, color: '#00C49F' },
    { name: 'Returns', value: 100, color: '#FFBB28' },
    { name: 'Pending', value: 50, color: '#FF8042' },
  ];

  const topCustomers = [
    { name: 'ABC Corp', amount: 15000, growth: '+12%' },
    { name: 'XYZ Ltd', amount: 12000, growth: '+8%' },
    { name: 'Tech Solutions', amount: 9500, growth: '+15%' },
  ];

  const quickLinks = getQuickLinks();

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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Sales vs Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" />
                <Bar dataKey="purchases" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Transaction Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  className="sm:outerRadius-[100px]"
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
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{customer.name}</td>
                    <td className="py-3 px-4">${customer.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 font-semibold">{customer.growth}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
