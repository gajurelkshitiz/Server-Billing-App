# Subscription Available Page - Backend Integration Guide

## Overview
This document outlines the backend endpoints required for the "Subscription Available" page functionality.

## Required Endpoints

### 1. GET /subscription/available
**Purpose**: Fetch all active subscription plans for purchase

**Request Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response Format**:
```json
{
  "success": true,
  "message": "Subscriptions fetched successfully",
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789abcdef0",
      "name": "Basic Plan",
      "description": "Perfect for small businesses getting started",
      "price": 29.99,
      "originalPrice": 39.99,
      "discountPercentage": 25,
      "period": "monthly",
      "maxCompanies": 1,
      "features": [
        "1 Company Management",
        "Basic Invoicing",
        "Customer Management",
        "5GB Storage",
        "Email Support"
      ],
      "isPopular": false,
      "isBestOffer": false,
      "isFlashSale": true,
      "flashSaleEndDate": "2025-07-28T23:59:59.000Z",
      "status": "active",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-07-21T12:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6789abcdef1",
      "name": "Professional Plan",
      "description": "Advanced features for growing businesses",
      "price": 79.99,
      "originalPrice": 99.99,
      "discountPercentage": 20,
      "period": "monthly",
      "maxCompanies": 5,
      "features": [
        "Up to 5 Companies",
        "Advanced Invoicing",
        "Customer & Supplier Management",
        "Purchase & Sales Tracking",
        "50GB Storage",
        "Priority Email Support",
        "Custom Reports",
        "API Access"
      ],
      "isPopular": true,
      "isBestOffer": true,
      "isFlashSale": false,
      "flashSaleEndDate": null,
      "status": "active",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-07-21T12:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6789abcdef2",
      "name": "Enterprise Plan",
      "description": "Complete solution for large organizations",
      "price": 199.99,
      "originalPrice": null,
      "discountPercentage": null,
      "period": "monthly",
      "maxCompanies": 999,
      "features": [
        "Unlimited Companies",
        "All Premium Features",
        "Advanced Analytics",
        "Custom Integrations",
        "Unlimited Storage",
        "24/7 Phone Support",
        "Dedicated Account Manager",
        "Custom Training",
        "SLA Guarantee"
      ],
      "isPopular": false,
      "isBestOffer": false,
      "isFlashSale": false,
      "flashSaleEndDate": null,
      "status": "active",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-07-21T12:00:00.000Z"
    }
  ]
}
```

### 2. POST /subscription/purchase
**Purpose**: Process subscription purchase

**Request Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "subscriptionId": "64a1b2c3d4e5f6789abcdef1",
  "paymentMethod": "card"
}
```

**Response Format**:
```json
{
  "success": true,
  "message": "Subscription purchased successfully",
  "data": {
    "purchaseId": "64a1b2c3d4e5f6789abcdef3",
    "subscriptionId": "64a1b2c3d4e5f6789abcdef1",
    "userId": "64a1b2c3d4e5f6789abcdef4",
    "amount": 79.99,
    "paymentMethod": "card",
    "status": "completed",
    "purchaseDate": "2025-07-21T14:30:00.000Z",
    "expiryDate": "2025-08-21T14:30:00.000Z"
  }
}
```

## Data Model Schema

### Subscription Model
```javascript
const subscriptionSchema = {
  _id: ObjectId,
  name: String,           // Required: Plan name
  description: String,    // Required: Plan description
  price: Number,          // Required: Current price
  originalPrice: Number,  // Optional: Original price (for discounts)
  discountPercentage: Number, // Optional: Discount percentage
  period: String,         // Required: 'monthly', 'yearly', 'lifetime'
  maxCompanies: Number,   // Required: Maximum companies allowed
  features: [String],     // Required: Array of feature strings
  isPopular: Boolean,     // Optional: Mark as popular plan
  isBestOffer: Boolean,   // Optional: Mark as best offer
  isFlashSale: Boolean,   // Optional: Mark as flash sale
  flashSaleEndDate: Date, // Optional: Flash sale end date
  status: String,         // Required: 'active', 'inactive'
  createdAt: Date,
  updatedAt: Date
};
```

### Purchase Model
```javascript
const purchaseSchema = {
  _id: ObjectId,
  subscriptionId: ObjectId,  // Reference to subscription
  userId: ObjectId,          // Reference to user making purchase
  amount: Number,            // Amount paid
  paymentMethod: String,     // 'card', 'bank', 'wallet'
  status: String,            // 'pending', 'completed', 'failed'
  purchaseDate: Date,
  expiryDate: Date,         // When subscription expires
  createdAt: Date,
  updatedAt: Date
};
```

## Implementation Notes

### Frontend Features
- ✅ Responsive design (mobile & desktop)
- ✅ Flash sale countdown timers
- ✅ Discount calculations and displays
- ✅ Feature comparison lists
- ✅ Purchase flow with payment method selection
- ✅ Loading states and error handling
- ✅ Toast notifications for success/error states
- ✅ Popular/Best Offer/Flash Sale badges

### Backend Requirements
1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Only admin users should access purchase functionality
3. **Payment Integration**: Integrate with payment gateway for actual processing
4. **Email Notifications**: Send confirmation emails after purchase
5. **Subscription Management**: Track user subscriptions and expiry dates
6. **Error Handling**: Proper error responses for failed purchases

### Security Considerations
- Validate subscription IDs to prevent tampering
- Implement rate limiting for purchase attempts
- Log all purchase transactions for audit
- Verify payment method availability before processing
- Handle payment failures gracefully

### Testing
- Test with various subscription configurations
- Test flash sale timer functionality
- Test purchase flow with different payment methods
- Test error scenarios (invalid subscription, payment failures)
- Test mobile responsiveness across devices
