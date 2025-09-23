import React from 'react';
import { Outlet, NavLink, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { BarChart2, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';



const HomeLayout: React.FC = () => {
    const location = useLocation();

    const navItems = [
        {
            path: 'dashboard',
            label: 'Dashboard',
            icon: BarChart2,
            description: 'View business overview and quick stats',
        },
        {
            path: 'analytics',
            label: 'Analytics',
            icon: PieChart,
            description: 'Detailed analytics and reports',
        },
    ];

    const isActive = (path: string) => {
    const currentPath = location.pathname;
    return currentPath.includes(`/home/${path}`) || 
        (path === "dashboard" && currentPath === "/home");
    };

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header Section */}
        {/* <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Home</h1>
          <p className="text-gray-600 mt-1">Your business hub: dashboard & analytics</p>
        </div> */}

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 px-6">
          <nav className="flex space-x-1 py-4" aria-label="Home navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      // Base styles - Browser tab-like appearance
                    "relative flex items-center gap-3 px-6 py-3 rounded-lg border transition-all duration-200",
                    "text-sm font-medium min-w-fit",
                    // Default state - Light blue shade
                    "bg-blue-50 border-blue-200 text-blue-700",
                    // Hover state - Increased color intensity
                    "hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 hover:shadow-sm",
                    // Active state - Darker blue with emphasis
                    active && "bg-blue-600 border-blue-600 text-white shadow-md",
                    // Focus state for accessibility
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    )
                  }
                  title={item.description}
                >
                  <Icon className={cn('w-5 h-5 transition-colors duration-200', active ? 'text-white' : 'text-blue-600')} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white rounded-full" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>Home Module - Your business overview and analytics</div>
            <div>Need help? contact us: +9779844644186 (kshitiz Gajurel - Developer)</div>
          </div>
        </div>
      </div>
  );
};

export default HomeLayout;
