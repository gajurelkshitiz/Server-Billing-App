export const roleRoutes = {
  superadmin: [
    '/dashboard', '/admin', '/subscription', '/fiscalyear', '/permission', '/settings'
  ],
  admin: [
    '/dashboard', '/user', '/company', '/customer', '/supplier', '/purchaseEntry', 
    '/salesEntry', '/purchasedueList', '/salesdueList', '/salespaymentList', '/purchasepaymentList', 
    '/paymentList', '/fiscalYear', '/permission', '/settings'
  ],
  user: [
    '/dashboard', '/purchaseEntry', '/salesEntry', '/customer', '/supplier', '/purchasedueList', 
    '/salesdueList', '/salespaymentList', '/purchasepaymentList', 'paymentList', '/permission', 
    '/settings'
  ]
};