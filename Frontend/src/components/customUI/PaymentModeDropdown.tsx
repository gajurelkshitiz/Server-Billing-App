import React, { useState, useRef, useEffect } from 'react';

interface PaymentModeDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const PaymentModeDropdown: React.FC<PaymentModeDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const paymentModes = [
    { value: 'fonepay', label: 'FonePay', logo: '/paymentDropdown/fone pay.png' },
    { value: 'esewa', label: 'eSewa', logo: '/paymentDropdown/esewa.png' },
    { value: 'khalti', label: 'Khalti', logo: '/paymentDropdown/khalti.jpeg' },
    { value: 'bank', label: 'Bank Transfer', logo: '/paymentDropdown/Bank.jpg' },
    { value: 'cash', label: 'Cash', logo: '/paymentDropdown/cash.jpeg' },
    { value: 'cheque', label: 'Cheque', logo: '/paymentDropdown/cheque.jpeg' },
    { value: 'connectIPS', label: 'ConnectIPS', logo: '/paymentDropdown/connect_IPS.png' },
    { value: 'card', label: 'Card', logo: '/paymentDropdown/card.jpeg' },
    { value: 'other', label: 'Other', logo: '/paymentDropdown/other.png' }
  ];

  const selectedMode = paymentModes.find(mode => mode.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Main Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg 
                   hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                   transition-all duration-200 ease-in-out
                   flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          {selectedMode ? (
            <>
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-50 p-1">
                <img 
                  src={selectedMode.logo} 
                  alt={selectedMode.label}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-medium text-gray-700">{selectedMode.label}</span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
              </div>
              <span className="text-gray-500 font-medium">Select payment method</span>
            </>
          )}
        </div>
        
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ease-in-out 
                     group-hover:text-blue-500 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl 
                       shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="max-h-64 overflow-y-auto py-2">
            {paymentModes.map((mode, index) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => handleSelect(mode.value)}
                className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150
                           flex items-center gap-3 group relative
                           ${value === mode.value ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
                           ${index !== paymentModes.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-50 p-1 
                               group-hover:scale-110 transition-transform duration-150">
                  <img 
                    src={mode.logo} 
                    alt={mode.label}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  {mode.label}
                </span>
                
                {/* Selected indicator */}
                {value === mode.value && (
                  <svg className="w-5 h-5 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentModeDropdown;