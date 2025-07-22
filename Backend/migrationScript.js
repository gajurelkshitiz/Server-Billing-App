// Migration script to update existing subscriptions to new schema
const mongoose = require('mongoose');
const Subscription = require('./models/subscription');

async function migrateSubscriptions() {
  try {
    console.log('Starting subscription migration...');
    
    // Find all existing subscriptions
    const existingSubscriptions = await Subscription.find({});
    console.log(`Found ${existingSubscriptions.length} existing subscriptions`);

    for (let sub of existingSubscriptions) {
      const updates = {};
      
      // Add missing fields with defaults
      if (!sub.description) {
        updates.description = `${sub.name} - A comprehensive subscription plan for your business needs`;
      }
      
      if (!sub.features || sub.features.length === 0) {
        updates.features = [
          "Basic invoicing and billing",
          "Customer management",
          "Email support",
          "Monthly reports",
          `Up to ${sub.maxCompanies} ${sub.maxCompanies === 1 ? 'company' : 'companies'}`
        ];
      }
      
      // Convert period from number to string if needed
      if (typeof sub.period === 'number') {
        updates.periodInDays = sub.period;
        if (sub.period <= 31) {
          updates.period = 'monthly';
        } else if (sub.period <= 366) {
          updates.period = 'yearly';
        } else {
          updates.period = 'lifetime';
        }
      }
      
      // Convert status from boolean to string if needed
      if (typeof sub.status === 'boolean') {
        updates.status = sub.status ? 'active' : 'inactive';
      }
      
      // Add promotional defaults
      if (sub.isPopular === undefined) updates.isPopular = false;
      if (sub.isBestOffer === undefined) updates.isBestOffer = false;
      if (sub.isFlashSale === undefined) updates.isFlashSale = false;
      
      // Update the subscription if there are changes
      if (Object.keys(updates).length > 0) {
        await Subscription.findByIdAndUpdate(sub._id, updates);
        console.log(`Updated subscription: ${sub.name}`);
      }
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

module.exports = migrateSubscriptions;

/*
To run this migration:

1. Save this file as migrationScript.js
2. Run: node migrationScript.js

Or integrate it into your existing migration system.
*/
