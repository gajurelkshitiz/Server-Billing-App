export interface Subscription {
  _id: string;
  name: string;
  description?: string;
  maxCompanies: number;
  period: "monthly" | "quarterly" | "yearly";
  originalPrice: number;
  discountPercentage?: number;
  price?: number; // Keep for backward compatibility, calculated from originalPrice and discount
  features: string[];
  isPopular?: boolean;
  isBestOffer?: boolean;
  isFlashSale?: boolean;
  flashSaleEndDate?: string;
  status: boolean;
}