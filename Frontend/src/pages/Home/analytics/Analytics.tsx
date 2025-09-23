
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useFilteredAnalyticsData } from './useFilteredAnalyticsData';

const FILTERS = {
  period: ['Monthly', 'Quarterly', 'Yearly'],
  view: ['Overview', 'Sales', 'Purchases', 'Products', 'Customers'],
};

const COLORS = ['#3b82f6', '#10b981', '#f59e42', '#ef4444', '#6366f1', '#eab308'];

// Chart option selectors for customization
function ChartOptions({ options, selected, onChange }) {
  return (
    <select value={selected} onChange={e => onChange(e.target.value)} className="border rounded px-2 py-1 text-xs bg-white shadow focus:ring-2 focus:ring-blue-400">
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  );
}

// Customizable chart card
function ChartCard({ title, badge, children, options, selectedOption, onOptionChange, sizeClass, bgClass }) {
  return (
    <div className={`rounded-xl shadow-lg border ${bgClass} ${sizeClass} p-4 flex flex-col`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base md:text-lg">{title}</span>
          {badge && <span className={`px-2 py-1 rounded-full text-xs text-white ${badge.bg}`}>{badge.text}</span>}
        </div>
        {options && <ChartOptions options={options} selected={selectedOption} onChange={onOptionChange} />}
      </div>
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
}
function Analytics() {
  // Filters for demonstration
  const [period, setPeriod] = useState('Monthly');
  const [view, setView] = useState('Overview');

  // Chart customization state
  const [salesBarType, setSalesBarType] = useState('Grouped');
  const [pieType, setPieType] = useState('Pie');
  const [profitLineType, setProfitLineType] = useState('Line');
  const [areaType, setAreaType] = useState('Area');
  const [productBarType, setProductBarType] = useState('Horizontal');
  const [radarType, setRadarType] = useState('Radar');

  // Dummy/mock data for demonstration
  const monthlyData = [
    { month: 'Jan', sales: 4000, purchases: 3200, profit: 800 },
    { month: 'Feb', sales: 3000, purchases: 2500, profit: 500 },
    { month: 'Mar', sales: 5000, purchases: 4200, profit: 800 },
    { month: 'Apr', sales: 6000, purchases: 4800, profit: 1200 },
    { month: 'May', sales: 7000, purchases: 5300, profit: 1700 },
    { month: 'Jun', sales: 6500, purchases: 5000, profit: 1500 },
  ];

  const productPerformance = [
    { name: 'Product A', sold: 120, revenue: 2400 },
    { name: 'Product B', sold: 80, revenue: 1600 },
    { name: 'Product C', sold: 60, revenue: 1200 },
    { name: 'Product D', sold: 40, revenue: 800 },
  ];

  const customerStats = [
    { name: 'Customer X', purchases: 10, total: 5000 },
    { name: 'Customer Y', purchases: 7, total: 3500 },
    { name: 'Customer Z', purchases: 5, total: 2000 },
  ];

  const salesTrend = monthlyData.map(d => ({ month: d.month, sales: d.sales }));
  const purchaseTrend = monthlyData.map(d => ({ month: d.month, purchases: d.purchases }));

  // Drill-down handler (for demonstration)
  const handleBarClick = (data, index) => {
    alert(`Drill-down: ${data.month} - Sales: ${data.sales}, Purchases: ${data.purchases}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Business Analytics</h1>
      <p className="text-gray-600 mb-6">A clear, interactive overview of your billing system's performance. Impress your boss with beautiful, actionable insights!</p>
      {/* Filters */}
      {/* Analytics Grid with customizable charts and dynamic sizing */}
      {/* Custom grid layout: top row (2 left stacked, 1 right tall), bottom row (3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Sales vs Purchases & Profit Trend stacked */}
        <div className="flex flex-col gap-0 flex-1 justify-between" style={{height: '540px'}}>
          <ChartCard
            title="Sales vs Purchases"
            badge={{ text: 'Main KPI', bg: 'bg-blue-500' }}
            options={[ 'Grouped', 'Stacked' ]}
            selectedOption={salesBarType}
            onOptionChange={setSalesBarType}
            sizeClass="h-[260px]"
            bgClass="bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200"
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} stackOffset={salesBarType === 'Stacked' ? 'sign' : undefined}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill={COLORS[0]} barSize={40} radius={[8,8,0,0]} stackId={salesBarType === 'Stacked' ? 'a' : undefined} />
                <Bar dataKey="purchases" fill={COLORS[1]} barSize={40} radius={[8,8,0,0]} stackId={salesBarType === 'Stacked' ? 'a' : undefined} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Profit Trend"
            badge={{ text: profitLineType, bg: 'bg-yellow-500' }}
            options={[ 'Line', 'Step', 'Dot' ]}
            selectedOption={profitLineType}
            onOptionChange={setProfitLineType}
            sizeClass="h-[260px]"
            bgClass="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200"
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type={profitLineType === 'Step' ? 'step' : 'monotone'} dataKey="profit" stroke={COLORS[2]} strokeWidth={3} dot={profitLineType === 'Dot' ? { r: 6 } : false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        {/* Right: Product Performance tall card */}
        <div className="flex flex-col h-full justify-between">
          <ChartCard
            title="Product Performance"
            badge={{ text: pieType, bg: 'bg-purple-500' }}
            options={[ 'Pie', 'Donut' ]}
            selectedOption={pieType}
            onOptionChange={setPieType}
            sizeClass="h-[540px]"
            bgClass="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
          >
            <ResponsiveContainer width="100%" height={420}>
              <PieChart>
                <Pie
                  data={productPerformance}
                  dataKey="sold"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={productPerformance[0].sold > 100 ? 180 : 140}
                  innerRadius={pieType === 'Donut' ? 80 : 0}
                  label
                >
                  {productPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
      {/* Bottom row: 3 cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <ChartCard
          title="Cumulative Sales"
          badge={{ text: areaType, bg: 'bg-blue-500' }}
          options={[ 'Area', 'Stacked', 'Spline' ]}
          selectedOption={areaType}
          onOptionChange={setAreaType}
          sizeClass="h-[220px]"
          bgClass="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
        >
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyData} stackOffset={areaType === 'Stacked' ? 'expand' : undefined}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type={areaType === 'Spline' ? 'basis' : 'monotone'} dataKey="sales" stroke={COLORS[0]} fill={COLORS[0]} stackId={areaType === 'Stacked' ? 'a' : undefined} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Product Sales"
          badge={{ text: productBarType, bg: 'bg-green-500' }}
          options={[ 'Horizontal', 'Vertical' ]}
          selectedOption={productBarType}
          onOptionChange={setProductBarType}
          sizeClass="h-[220px]"
          bgClass="bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart layout={productBarType === 'Horizontal' ? 'vertical' : 'horizontal'} data={productPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              {productBarType === 'Horizontal' ? <XAxis type="number" /> : <XAxis dataKey="name" />}
              {productBarType === 'Horizontal' ? <YAxis dataKey="name" type="category" /> : <YAxis />}
              <Tooltip />
              <Bar dataKey="sold" fill={COLORS[3]} barSize={18} radius={[8,8,8,8]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Customer Comparison"
          badge={{ text: radarType, bg: 'bg-pink-500' }}
          options={[ 'Radar', 'Polygon' ]}
          selectedOption={radarType}
          onOptionChange={setRadarType}
          sizeClass="h-[220px]"
          bgClass="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200"
        >
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart cx="50%" cy="50%" outerRadius={customerStats.length > 2 ? 80 : 60} data={customerStats}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar name="Purchases" dataKey="purchases" stroke={COLORS[4]} fill={COLORS[4]} fillOpacity={radarType === 'Polygon' ? 0.3 : 0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

export default Analytics;