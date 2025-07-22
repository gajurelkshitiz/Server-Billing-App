// Sample subscription data for testing
// You can run this in your MongoDB database or use it as a reference

const sampleSubscriptions = [
  {
    name: "Basic Plan",
    description: "Perfect for small businesses getting started with essential features",
    maxCompanies: 1,
    maxPhotos: 100,
    maxUsers: 5,
    period: "monthly",
    periodInDays: 30,
    price: 29.99,
    originalPrice: 39.99,
    discountPercentage: 25,
    features: [
      "1 Company Management",
      "Basic Invoicing & Billing",
      "Customer Management",
      "5GB Cloud Storage",
      "Email Support",
      "Monthly Reports"
    ],
    isPopular: false,
    isBestOffer: false,
    isFlashSale: true,
    flashSaleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: "active"
  },
  {
    name: "Professional Plan",
    description: "Advanced features for growing businesses with multiple operations",
    maxCompanies: 5,
    maxPhotos: 1000,
    maxUsers: 25,
    period: "monthly",
    periodInDays: 30,
    price: 79.99,
    originalPrice: 99.99,
    discountPercentage: 20,
    features: [
      "Up to 5 Companies",
      "Advanced Invoicing & Billing",
      "Customer & Supplier Management",
      "Purchase & Sales Tracking",
      "Inventory Management",
      "50GB Cloud Storage",
      "Priority Email Support",
      "Custom Reports & Analytics",
      "API Access",
      "Mobile App Access"
    ],
    isPopular: true,
    isBestOffer: true,
    isFlashSale: false,
    flashSaleEndDate: null,
    status: "active"
  },
  {
    name: "Enterprise Plan",
    description: "Complete solution for large organizations with unlimited access",
    maxCompanies: 999,
    maxPhotos: 10000,
    maxUsers: 100,
    period: "monthly",
    periodInDays: 30,
    price: 199.99,
    originalPrice: null,
    discountPercentage: null,
    features: [
      "Unlimited Companies",
      "All Premium Features",
      "Advanced Analytics & Insights",
      "Custom Integrations",
      "Unlimited Cloud Storage",
      "24/7 Phone Support",
      "Dedicated Account Manager",
      "Custom Training Sessions",
      "SLA Guarantee",
      "White-label Options",
      "Advanced Security Features",
      "Custom Reporting"
    ],
    isPopular: false,
    isBestOffer: false,
    isFlashSale: false,
    flashSaleEndDate: null,
    status: "active"
  },
  {
    name: "Yearly Basic",
    description: "Basic plan with yearly billing for maximum savings",
    maxCompanies: 1,
    maxPhotos: 1200,
    maxUsers: 5,
    period: "yearly",
    periodInDays: 365,
    price: 299.99,
    originalPrice: 359.88, // 12 months * 29.99
    discountPercentage: 17,
    features: [
      "1 Company Management",
      "Basic Invoicing & Billing",
      "Customer Management",
      "5GB Cloud Storage",
      "Email Support",
      "Monthly Reports",
      "2 Months Free (Yearly Billing)"
    ],
    isPopular: false,
    isBestOffer: false,
    isFlashSale: false,
    flashSaleEndDate: null,
    status: "active"
  },
  {
    name: "Lifetime Pro",
    description: "One-time payment for lifetime access to professional features",
    maxCompanies: 3,
    maxPhotos: 5000,
    maxUsers: 15,
    period: "lifetime",
    periodInDays: 36500, // 100 years
    price: 999.99,
    originalPrice: 1499.99,
    discountPercentage: 33,
    features: [
      "Up to 3 Companies",
      "Lifetime Access",
      "All Professional Features",
      "Priority Support",
      "100GB Cloud Storage",
      "No Monthly Fees",
      "Future Updates Included",
      "Transfer License"
    ],
    isPopular: false,
    isBestOffer: true,
    isFlashSale: true,
    flashSaleEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: "active"
  }
];

module.exports = sampleSubscriptions;

/*
To seed this data in your database, you can:

1. Use MongoDB Compass and import this as JSON
2. Create a seeder script:

const mongoose = require('mongoose');
const Subscription = require('./models/subscription');
const sampleSubscriptions = require('./sampleSubscriptions');

async function seedSubscriptions() {
  try {
    await mongoose.connect('your-mongodb-connection-string');
    
    // Clear existing subscriptions (optional)
    await Subscription.deleteMany({});
    
    // Insert sample data
    const result = await Subscription.insertMany(sampleSubscriptions);
    console.log(`Seeded ${result.length} subscriptions`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding subscriptions:', error);
    process.exit(1);
  }
}

seedSubscriptions();

3. Or use the admin panel to create subscriptions with these values
*/
