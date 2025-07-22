export const roleRoutes = {
  superadmin: [
    '/dashboard', '/admin', '/subscription', '/subscription-available', '/fiscalyear', '/permission', '/settings'
  ],
  admin: [
    '/dashboard', '/user', '/company', '/customer', '/supplier', '/purchaseEntry', 
    '/salesEntry', '/purchasedueList', '/salesdueList', '/salespaymentList', '/purchasepaymentList', 
    '/paymentList', 'customerInfo', '/fiscalYear', '/subscription-available', '/permission', '/settings', '/admin-profile',
    '/user-profile'
  ],
  user: [
    '/dashboard', '/purchaseEntry', '/salesEntry', '/customer', '/supplier', '/purchasedueList', 
    '/salesdueList', '/salespaymentList', '/purchasepaymentList', 'paymentList', 'customerInfo', '/permission', 
    '/settings', '/user-profile'
  ]
};