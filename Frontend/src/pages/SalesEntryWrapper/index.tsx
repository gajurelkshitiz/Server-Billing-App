import React from 'react';
import { useProfile } from '@/context/ProfileContext';
import SalesEntryPage from '../SalesEntry/index';
import ComputerizedSalesEntryPage from '../ComputerizedSalesEntry/index';

const SalesEntryWrapper = () => {
  const { profile } = useProfile();
  
  // Get admin mode from profile
  const adminMode = profile?.mode;
  
  // Render appropriate component based on mode
  if (adminMode === 'computerized') {
    return <ComputerizedSalesEntryPage />;
  }
  
  // Default to manual mode
  return <SalesEntryPage />;
};

export default SalesEntryWrapper;