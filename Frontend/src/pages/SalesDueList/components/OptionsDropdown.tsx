import React, { useState } from 'react';
import { ChevronDown, DollarSign, UserCheck } from 'lucide-react';

interface OptionsDropdownProps {
  onPay: () => void;
  onFollowUp: () => void;
  rowData: any;
}

const OptionsDropdown: React.FC<OptionsDropdownProps> = ({ onPay, onFollowUp, rowData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePay = () => {
    onPay();
    setIsOpen(false);
  };

  const handleFollowUp = () => {
    onFollowUp();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-expanded="true"
        aria-haspopup="true"
      >
        Options
        <ChevronDown className="w-4 h-4 ml-2 -mr-1" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 z-20 w-48 mt-2 origin-top-right bg-white rounded-lg shadow-xl border border-gray-200 focus:outline-none">
            <div className="p-3 space-y-2" role="menu" aria-orientation="vertical">
              <button
                onClick={handlePay}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg border border-blue-700 shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105"
                role="menuitem"
              >
                <DollarSign className="w-4 h-4 mr-3" />
                Pay
              </button>
              
              <button
                onClick={handleFollowUp}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg border border-green-700 shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105"
                role="menuitem"
              >
                <UserCheck className="w-4 h-4 mr-3" />
                Follow Up
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OptionsDropdown;