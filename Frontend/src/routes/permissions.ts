export const roleRoutes = {
  superadmin: [
    '/home/dashboard', '/admin', '/subscription', '/subscription-available', '/fiscalyear', '/permission','/notifications', '/settings'
  ],
  admin: [
    '/home/dashboard', '/user', '/company', '/customer', '/supplier', '/purchaseEntry', 
    '/salesEntry', '/purchasedueList', '/salesdueList', '/salespaymentList', '/purchasepaymentList', 
    '/paymentList', 'customerInfo', 'supplierInfo' ,'/fiscalYear', '/subscription-available', '/permission', '/notifications', '/settings', 
    '/admin-profile', '/download-templates', '/attachments', '/configuration', '/home/analytics'
  ],
  user: [
    '/home/dashboard', '/purchaseEntry', '/salesEntry', '/customer', '/supplier', '/purchasedueList', 
    '/salesdueList', '/salespaymentList', '/purchasepaymentList', 'paymentList', 'customerInfo', 'supplierInfo', '/permission', '/notifications',
    '/settings', '/user-profile', '/download-templates', '/home/analytics'
  ]
};