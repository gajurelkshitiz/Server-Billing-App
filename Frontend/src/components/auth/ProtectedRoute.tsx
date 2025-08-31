import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';
import { roleRoutes } from '@/routes/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = localStorage.getItem('role');
  const isCompanySelected = !!localStorage.getItem('companyID');
  const allowedRoutes = roleRoutes[role as keyof typeof roleRoutes] || [];

  const currentPath = location.pathname;

  // Extra check for purchaseEntry and salesEntry
  const requiresCompany = ['/purchaseEntry', '/salesEntry', '/purchasedueList', '/salesdueList', '/sales-configuration', '/attachments'].includes(currentPath);

  // if (!allowedRoutes.includes(currentPath) || (requiresCompany && !isCompanySelected)) {
  //   return <Navigate to="/notfound" replace />;
  // }

  if (role === 'admin') {
    if (!allowedRoutes.includes(currentPath)) {
      return <Navigate to="/notfound" replace />;
    }
    if (requiresCompany && !isCompanySelected) {
      return <Navigate to="/notfound" replace />;
    }
  } else {
    if (!allowedRoutes.includes(currentPath)) {
      return <Navigate to="/notfound" replace />;
    }
  }

  return <>{children}</>;
};


export default ProtectedRoute;
