import React from 'react';
import { useProfile } from '@/context/ProfileContext';
import PurchaseEntryPage from '../PurchaseEntry/index';
import ComputerizedPurchaseEntryPage from '../ComputerizedPurchaseEntry';

const PurchaseEntryWrapper = () => {
  const { profile } = useProfile();
  
  // Get admin mode from profile
  const adminMode = profile?.mode;
  
  // Render appropriate component based on mode
  if (adminMode === 'computerized') {
    return <ComputerizedPurchaseEntryPage />;
  }
  
  // Default to manual mode
  return <PurchaseEntryPage />;
};

export default PurchaseEntryWrapper;