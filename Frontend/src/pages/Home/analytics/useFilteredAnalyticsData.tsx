
// This hook is a placeholder for future API integration.
// It provides mock data and filter logic for the analytics dashboard.
import { useState } from 'react';

export function useFilteredAnalyticsData() {
  // Example: could fetch and filter data here
  const [period, setPeriod] = useState('Monthly');
  const [view, setView] = useState('Overview');

  // Replace with API calls later
  const getMonthlyData = () => [
    { month: 'Jan', sales: 4000, purchases: 3200, profit: 800 },
    { month: 'Feb', sales: 3000, purchases: 2500, profit: 500 },
    { month: 'Mar', sales: 5000, purchases: 4200, profit: 800 },
    { month: 'Apr', sales: 6000, purchases: 4800, profit: 1200 },
    { month: 'May', sales: 7000, purchases: 5300, profit: 1700 },
    { month: 'Jun', sales: 6500, purchases: 5000, profit: 1500 },
  ];

  const getProductPerformance = () => [
    { name: 'Product A', sold: 120, revenue: 2400 },
    { name: 'Product B', sold: 80, revenue: 1600 },
    { name: 'Product C', sold: 60, revenue: 1200 },
    { name: 'Product D', sold: 40, revenue: 800 },
  ];

  const getCustomerStats = () => [
    { name: 'Customer X', purchases: 10, total: 5000 },
    { name: 'Customer Y', purchases: 7, total: 3500 },
    { name: 'Customer Z', purchases: 5, total: 2000 },
  ];

  return {
    period,
    setPeriod,
    view,
    setView,
    getMonthlyData,
    getProductPerformance,
    getCustomerStats,
  };
}