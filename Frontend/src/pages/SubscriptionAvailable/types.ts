export interface AvailableSubscription {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  period: 'monthly' | 'yearly' | 'lifetime';
  maxCompanies: number;
  features: string[];
  isPopular?: boolean;
  isBestOffer?: boolean;
  isFlashSale?: boolean;
  flashSaleEndDate?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

export interface PurchaseSubscriptionRequest {
  subscriptionId: string;
  paymentMethod: 'card' | 'bank' | 'wallet';
  companyId?: string;
}
