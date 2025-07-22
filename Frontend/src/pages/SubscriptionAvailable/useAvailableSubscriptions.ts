import { useState, useEffect } from 'react';
import { AvailableSubscription } from './types';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/utils/auth';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const useAvailableSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<AvailableSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAvailableSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/subscription/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('subscription Available: ', result);
      
      if (result.success && result.subscriptions) {
        console.log('Subscriptions: ', result.subscriptions);
        setSubscriptions(result.subscriptions);
      } else {
        throw new Error(result.message || 'Failed to fetch subscriptions');
      }
    } catch (err: any) {
      console.error('Error fetching available subscriptions:', err);
      setError(err.message || 'Failed to load subscriptions');
      toast({
        title: "Error",
        description: "Failed to load available subscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const purchaseSubscription = async (subscriptionId: string, paymentMethod: string) => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/subscription/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          subscriptionId,
          paymentMethod,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Subscription purchased successfully!",
          variant: "default",
        });
        return true;
      } else {
        throw new Error(result.message || 'Purchase failed');
      }
    } catch (err: any) {
      console.error('Error purchasing subscription:', err);
      toast({
        title: "Purchase Failed",
        description: err.message || "Failed to purchase subscription",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAvailableSubscriptions();
  }, []);

  return {
    subscriptions,
    loading,
    error,
    purchaseSubscription,
    refetch: fetchAvailableSubscriptions,
  };
};
