import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAvailableSubscriptions } from './useAvailableSubscriptions';
import { AvailableSubscription } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Crown, 
  Zap, 
  Clock, 
  Users, 
  Star,
  Gift,
  TrendingUp,
  Calendar,
  Shield
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SubscriptionAvailablePage: React.FC = () => {
  const { subscriptions, loading, purchaseSubscription } = useAvailableSubscriptions();
  const [selectedPlan, setSelectedPlan] = useState<AvailableSubscription | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [purchasing, setPurchasing] = useState(false);
  const isMobile = useIsMobile();

  const handlePurchase = async () => {
    if (!selectedPlan || !paymentMethod) return;
    
    setPurchasing(true);
    const success = await purchaseSubscription(selectedPlan._id, paymentMethod);
    setPurchasing(false);
    
    if (success) {
      setSelectedPlan(null);
      setPaymentMethod('');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateSavings = (originalPrice: number, currentPrice: number) => {
    return originalPrice - currentPrice;
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const timeLeft = end - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  // Show demo if no subscriptions or error
  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <span className="text-2xl font-semibold text-gray-700">No subscription created yet.</span>
        <span className="text-gray-500 text-center">
          You will see available plans here once the superadmin creates them.
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
            Choose Your Plan
          </h1>
        </div>
        <p className={`text-gray-600 max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-lg'}`}>
          Unlock powerful features and scale your business with our flexible subscription plans. 
          Choose the perfect plan that fits your needs and budget.
        </p>
      </div>

      {/* Flash Sale Banner */}
      {subscriptions.some(sub => sub.isFlashSale) && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="h-5 w-5 animate-pulse" />
            <span className="font-bold text-lg">FLASH SALE</span>
            <Zap className="h-5 w-5 animate-pulse" />
          </div>
          <p className={isMobile ? 'text-sm' : 'text-base'}>
            Limited time offer! Get up to 50% off on selected plans
          </p>
        </div>
      )}

      {/* Subscription Cards Grid */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription._id}
            subscription={subscription}
            onSelect={setSelectedPlan}
            isMobile={isMobile}
            formatPrice={formatPrice}
            calculateSavings={calculateSavings}
            getTimeRemaining={getTimeRemaining}
          />
        ))}
      </div>

      {/* Purchase Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className={`${isMobile ? 'max-w-[95vw]' : 'max-w-md'}`}>
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              You're about to purchase: {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Plan:</span>
                <span>{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Price:</span>
                <span className="text-lg font-bold text-green-600">
                  {selectedPlan && formatPrice(selectedPlan.price)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Period:</span>
                <span className="capitalize">{selectedPlan?.period}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className={isMobile ? 'h-12' : ''}>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row'}`}>
              <Button
                variant="outline"
                onClick={() => setSelectedPlan(null)}
                className={`${isMobile ? 'w-full h-12' : 'flex-1'}`}
                disabled={purchasing}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={!paymentMethod || purchasing}
                className={`${isMobile ? 'w-full h-12' : 'flex-1'} bg-blue-600 hover:bg-blue-700`}
              >
                {purchasing ? 'Processing...' : 'Purchase Now'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface SubscriptionCardProps {
  subscription: AvailableSubscription;
  onSelect: (subscription: AvailableSubscription) => void;
  isMobile: boolean;
  formatPrice: (price: number) => string;
  calculateSavings: (original: number, current: number) => number;
  getTimeRemaining: (endDate: string) => string;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onSelect,
  isMobile,
  formatPrice,
  calculateSavings,
  getTimeRemaining,
}) => {
  const hasDiscount = subscription.originalPrice && subscription.originalPrice > subscription.price;
  const savings = hasDiscount ? calculateSavings(subscription.originalPrice!, subscription.price) : 0;

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${
      subscription.isPopular ? 'ring-2 ring-blue-500 shadow-lg' : ''
    } ${subscription.isFlashSale ? 'ring-2 ring-red-500 shadow-lg' : ''}`}>
      {/* Badge Overlays */}
      <div className="absolute top-4 right-4 space-y-2">
        {subscription.isFlashSale && (
          <Badge className="bg-red-500 text-white flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>Flash Sale</span>
          </Badge>
        )}
        {subscription.isBestOffer && (
          <Badge className="bg-green-500 text-white flex items-center space-x-1">
            <Gift className="h-3 w-3" />
            <span>Best Offer</span>
          </Badge>
        )}
        {subscription.isPopular && (
          <Badge className="bg-blue-500 text-white flex items-center space-x-1">
            <Star className="h-3 w-3" />
            <span>Popular</span>
          </Badge>
        )}
      </div>

      <CardHeader className="pb-4">
        <CardTitle className={`flex items-center space-x-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          <Shield className="h-5 w-5 text-blue-600" />
          <span>{subscription.name}</span>
        </CardTitle>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
          {subscription.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Pricing Section */}
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
              {formatPrice(subscription.price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(subscription.originalPrice!)}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 capitalize">
              per {subscription.period}
            </span>
          </div>

          {hasDiscount && (
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">
                Save {formatPrice(savings)} ({subscription.discountPercentage}% off)
              </span>
            </div>
          )}

          {subscription.isFlashSale && subscription.flashSaleEndDate && (
            <div className="flex items-center space-x-2 text-red-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                Ends in: {getTimeRemaining(subscription.flashSaleEndDate)}
              </span>
            </div>
          )}
        </div>

        {/* Company Limit */}
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
          <Users className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Up to {subscription.maxCompanies} {subscription.maxCompanies === 1 ? 'Company' : 'Companies'}
          </span>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Features Include:</h4>
          <ul className="space-y-2">
            {subscription.features.slice(0, isMobile ? 4 : 6).map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
            {subscription.features.length > (isMobile ? 4 : 6) && (
              <li className="text-sm text-gray-500 italic">
                +{subscription.features.length - (isMobile ? 4 : 6)} more features...
              </li>
            )}
          </ul>
        </div>

        {/* Purchase Button */}
        <Button
          onClick={() => onSelect(subscription)}
          className={`w-full ${isMobile ? 'h-12' : 'h-11'} ${
            subscription.isFlashSale
              ? 'bg-red-600 hover:bg-red-700'
              : subscription.isPopular
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-800 hover:bg-gray-900'
          } transition-colors duration-200`}
        >
          {subscription.isFlashSale ? 'Grab Deal Now!' : 'Choose This Plan'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionAvailablePage;
