import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { FileText, Users, ClipboardList, CreditCard } from 'lucide-react';
import { cn } from "@/lib/utils";

/**
 * SalesLayout Component
 * 
 * This is the main layout component for the Sales module that provides
 * navigation between different sales-related functionalities.
 * 
 * Features:
 * - Four main navigation tabs with modern browser-tab styling
 * - Light blue theme with hover effects
 * - Icons for better visual identification
 * - Active state highlighting
 * - Responsive design
 * 
 * Navigation Structure:
 * 1. Sales Entry - Main sales entry functionality
 * 2. Customer - Customer management
 * 3. Sales Due List - Customer due management with search
 * 4. Sales Payment List - Payment history with search
 * 
 * Styling:
 * - Rectangular rounded boxes with light blue shade
 * - Hover effects with increased color intensity
 * - Active state with darker blue and underline
 * - Smooth transitions for better UX
 */

const SalesLayout: React.FC = () => {
  const location = useLocation();

  // Navigation items configuration
  const navItems = [
    {
      path: "entry",
      label: "Sales Entry",
      icon: FileText,
      description: "Create and manage sales entries"
    },
    {
      path: "customer",
      label: "Customer",
      icon: Users,
      description: "Manage customer information"
    },
    {
      path: "due-list",
      label: "Sales Due List",
      icon: ClipboardList,
      description: "Track customer dues and payments"
    },
    {
      path: "payment-list",
      label: "Sales Payment List",
      icon: CreditCard,
      description: "View payment history and transactions"
    }
  ];

  /**
   * Determines if a navigation item is currently active
   * @param path - The path to check
   * @returns boolean indicating if the path is active
   */
  const isActive = (path: string) => {
    const currentPath = location.pathname;
    return currentPath.includes(`/sales/${path}`) || 
           (path === "entry" && currentPath === "/sales");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
            <p className="text-gray-600 mt-1">Manage your sales operations, customers, and transactions</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-1 py-4" aria-label="Sales navigation">
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
                {/* Icon */}
                <Icon 
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    active ? "text-white" : "text-blue-600"
                  )} 
                />
                
                {/* Label */}
                <span className="whitespace-nowrap">
                  {item.label}
                </span>
                
                {/* Active indicator line */}
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
          {/* Content rendered by child routes */}
          <Outlet />
        </div>
      </div>

      {/* Footer Section (Optional) */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            Sales Module - Manage your business sales operations efficiently
          </div>
          <div>
            Need help? Check our documentation
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesLayout;
