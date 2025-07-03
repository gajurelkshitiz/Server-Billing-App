import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerSearch from '../SalesDueList/components/CustomerSearch';

/**
 * WithSearchLayout Component
 * 
 * This layout component provides a shared customer search functionality 
 * for both Sales Due List and Sales Payment List pages.
 * 
 * Features:
 * - Displays CustomerSearch component for customer selection
 * - Uses Outlet to render child components (Sales Due List or Sales Payment List)
 * - Maintains consistent search UI across related pages
 * 
 * Usage:
 * - Used as parent layout for pages that require customer search functionality
 * - Child components can access customer selection through props or context
 */
const WithSearchLayout: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Customer Search Component - Shared across Due List and Payment List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Search</h2>
        <p className="text-sm text-gray-600 mb-4">
          Search and select a customer to view their due list or payment history.
        </p>
        {/* CustomerSearch will be integrated at the individual page level for better control */}
      </div>
      
      {/* Render child components (Sales Due List or Sales Payment List) */}
      <Outlet />
    </div>
  );
};

export default WithSearchLayout;
