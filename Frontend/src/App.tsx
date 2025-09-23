import AttachmentsPage from "./pages/Attachments";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./components/auth/Login";
import HomeLayout from "./pages/Home/HomeLayout";
import Dashboard from "./pages/Home/dashboard/Dashboard";
import Analytics from "./pages/Home/analytics/Analytics";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";
import { NotificationProvider } from '@/context/NotificationContext';

// importing admin
import AdminPage from "./pages/Admin";
import SubscriptionPage from "./pages/Subscription";
import SubscriptionAvailablePage from "./pages/SubscriptionAvailable";
import { Sub } from "@radix-ui/react-dropdown-menu";
import UserPage from "./pages/User";
import CompanyPage from "./pages/Company";
import SupplierPage from "./pages/Supplier"
import SalesEntryPage from "./pages/SalesEntry";
import CutomerPage from "./pages/Customer";
import FiscalYearPage from "./pages/FiscalYear"
import PermissionsMatrix from "./components/common/PermissionsMatrix";
import VerifyEmail from "./components/auth/VerifyEmail";
import SetPassword from "@/components/auth/SetPassword";
import { ProfilePage } from "./pages/Profile";
import { ProfileProvider } from "@/context/ProfileContext"; // <-- import
import { CompanyProvider } from "@/context/CompanyContext"; // <-- import
// import PurchaseDueListPage from "./pages/PurchaseDueList";
import SalesDueListPage from "./pages/SalesDueList";
import PurchaseDueListPage from "./pages/PurchaseDueList";
import { CompanyStateProvider } from "./provider/companyState";
import DropdownComponent from "./DropdownText";
// import SalesPaymentListPage from "./pages/SalesPaymentList";

// Routes for testing only
import SalesLayout from './pages/Sales/SalesLayout';
import SalesEntry from './pages/Sales/SalesEntry';
import Customer from './pages/Sales/Customer';
import WithSearchLayout from './pages/Sales/WithSearchLayout';
// import SalesDueList from './pages/Sales/SalesDueList';
// import SalesPaymentList from './pages/Sales/SalesPaymentList';
// import PurchasePaymentListPage from "./pages/PurchasePaymentList";


import { FiscalYearProvider } from "./context/FiscalYearContext";
import CustomerInfoPage from "./pages/CustomerProfileInfo/CustomerInfoPage";
import SupplierInfoPage from "./pages/SupplierProfileInfo/SupplierInfoPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import { AdminProfilePage } from "./pages/AdminProfile";
import { UserProfilePage } from "./pages/UserProfile";
import  TemplateDownloadPage  from "./pages/Templates/TemplateDownloadPage";
// import './styles/payment-slip-print.css';

import SalesEntryWrapper from "./pages/SalesEntryWrapper";
import PurchaseEntryWrapper from "./pages/PurchaseEntryWrapper";
import NotificationsPage from './pages/Notifications';
import SalesConfiguration from "./pages/ItemConfiguration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationProvider>
      <Toaster />
      <Sonner />
      <ProfileProvider> {/* <-- wrap here */}
        <FiscalYearProvider>
        <CompanyProvider>
        <CompanyStateProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/verify-Email/:token/:role" element={<VerifyEmail />} /> */}
            <Route path="/set-password" element={<SetPassword />} />

            
            <Route 
              path="/attachments"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AttachmentsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HomeLayout />
                  </Layout>
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
            </Route>

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HomeLayout />
                  </Layout>
                </ProtectedRoute>
              }
            >
              <Route index element={<Analytics />} />
            </Route> */}


             {/* This is for testing of nested route of  Home */}
            <Route path="home" element={<Layout><HomeLayout /></Layout>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/subscription"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SubscriptionPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/subscription-available"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SubscriptionAvailablePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/company"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CompanyPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/supplier"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SupplierPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/customer"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CutomerPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/purchaseEntry"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PurchaseEntryWrapper />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/SalesEntry"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SalesEntryWrapper />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* <Route 
              path="/SalesEntry"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SalesEntryPage />
                  </Layout>
                </ProtectedRoute>
              }
            /> */}
            <Route 
              path="/purchasedueList"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PurchaseDueListPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/salesdueList"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SalesDueListPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/configuration"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SalesConfiguration />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* <Route 
              path="/salespaymentList"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SalesPaymentListPage />
                  </Layout>
                </ProtectedRoute>
              }
            /> */}
            {/* <Route 
              path="/purchasepaymentList"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PurchasePaymentListPage />
                  </Layout>
                </ProtectedRoute>
              }
            /> */}
            <Route 
              path="/fiscalyear"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FiscalYearPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route 
              path="/profile"
              element={
                  <Layout>
                    <ProfilePage />
                  </Layout>
              }
            />

            <Route 
              path="/admin-profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route 
              path="/user-profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route 
              path="/download-templates"
              element={
                // <ProtectedRoute>
                  <Layout>
                    <TemplateDownloadPage />
                  </Layout>
                // </ProtectedRoute>
              }
            />

            <Route 
              path="/customerInfo/:companyID/:customerID"
              element={
                  <Layout>
                    <CustomerInfoPage />
                  </Layout>
              }
            />

            <Route 
              path="/supplierInfo/:companyID/:supplierID"
              element={
                  <Layout>
                    <SupplierInfoPage />
                  </Layout>
              }
            />



            <Route
              path="/test"
              element={
                <DropdownComponent /> 
              }
            />
            {/* <Route
              path="/test"
              element={
                <PermissionsMatrix /> 
              }
            /> */}

            {/* This is for testing of nested route of sales module */}
            <Route path="sales" element={<Layout><SalesLayout /></Layout>}>
              <Route path="entry" element={<SalesEntry />} />
              <Route path="customer" element={<Customer />} />

              {/* Nested Layout With Search Bar */}
              <Route element={<WithSearchLayout />}>
                {/* <Route path="due-list" element={<SalesDueList />} />
                <Route path="payment-list" element={<SalesPaymentList />} /> */}
              </Route>
            </Route>



            {/* Add more protected routes here for other pages like:
                /user, /company, /customer, /supplier, /salesEntry, /purchaseEntry, etc.
                Follow the same pattern as AdminPage */}
            <Route 
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/notifications" 
              element={
               <Layout>
              <NotificationsPage />
              </Layout> } 
            />
            <Route 
              path="*" 
              element={
                <Layout>
                  <NotFound />
                </Layout>
              } 
            />
          </Routes>
        </BrowserRouter>
        </CompanyStateProvider>
        </CompanyProvider>
        </FiscalYearProvider>
      </ProfileProvider>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
