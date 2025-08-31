export const roleRoutes = {
  superadmin: [
    '/dashboard', '/admin', '/subscription', '/subscription-available', '/fiscalyear', '/permission','/notifications', '/settings'
  ],
  admin: [
    '/dashboard', '/user', '/company', '/customer', '/supplier', '/purchaseEntry', 
    '/salesEntry', '/purchasedueList', '/salesdueList', '/salespaymentList', '/purchasepaymentList', 
    '/paymentList', 'customerInfo', '/fiscalYear', '/subscription-available', '/permission', '/notifications', '/settings', 
    '/admin-profile', '/download-templates', '/attachments', '/configuration'
  ],
  user: [
    '/dashboard', '/purchaseEntry', '/salesEntry', '/customer', '/supplier', '/purchasedueList', 
    '/salesdueList', '/salespaymentList', '/purchasepaymentList', 'paymentList', 'customerInfo', '/permission', '/notifications',
    '/settings', '/user-profile', '/download-templates',
  ]
};