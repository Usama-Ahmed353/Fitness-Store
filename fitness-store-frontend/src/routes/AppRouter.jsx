import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyTokenAsync, setStore } from '../app/slices/authSlice';
import { useStore } from 'react-redux';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MemberSidebarLayout from '../layouts/MemberLayout';
import ErrorBoundary from '../components/error/ErrorBoundary';
import LoadingFallback from '../components/loading/LoadingFallback';
import GlobalLoadingBar from '../components/loading/GlobalLoadingBar';

// Lazy load pages for better performance
const Home = React.lazy(() => import('../pages/public/HomePage'));
const Locations = React.lazy(() => import('../pages/public/LocationsPage'));
const Classes = React.lazy(() => import('../pages/public/ClassesPage'));
const Training = React.lazy(() => import('../pages/public/TrainingPage'));
const CrunchPlus = React.lazy(() => import('../pages/public/CrunchPlusPage'));
const Membership = React.lazy(() => import('../pages/public/MembershipPage'));
const About = React.lazy(() => import('../pages/public/AboutPage'));
const FreeTrial = React.lazy(() => import('../pages/public/FreeTrialPage'));
const Contact = React.lazy(() => import('../pages/public/ContactPage'));
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('../pages/auth/ResetPasswordPage'));
const VerifyEmailPage = React.lazy(() => import('../pages/auth/VerifyEmailPage'));
const OnboardingFlow = React.lazy(() => import('../pages/member/OnboardingFlow'));
const ProfileSetupPage = React.lazy(() => import('../pages/member/ProfileSetupPage'));
const DashboardPage = React.lazy(() => import('../pages/member/DashboardPage'));
const CheckInPage = React.lazy(() => import('../pages/member/CheckInPage'));
const ProgressPage = React.lazy(() => import('../pages/member/ProgressPage'));
const NutritionPage = React.lazy(() => import('../pages/member/NutritionPage'));
const ChallengesPage = React.lazy(() => import('../pages/member/ChallengesPage'));
const CommunityPage = React.lazy(() => import('../pages/member/community/CommunityPage'));
const MemberSettingsPage = React.lazy(() => import('../pages/member/settings/SettingsPage'));
const MemberClassesPage = React.lazy(() => import('../pages/member/ClassesPage'));
const MemberBookings = React.lazy(() => import('../pages/member/Bookings'));
const MyBookingsPage = React.lazy(() => import('../pages/member/MyBookingsPage'));
const TrainersPage = React.lazy(() => import('../pages/member/TrainersPage'));
const MemberProfile = React.lazy(() => import('../pages/member/Profile'));
const AdminDashboard = React.lazy(() => import('../pages/admin/Dashboard'));
const GymOwnerDashboard = React.lazy(() => import('../pages/gym-owner/Dashboard'));
const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage'));

// Shop / E-Commerce Pages
const ShopPage = React.lazy(() => import('../pages/shop/ShopPage'));
const ProductDetailPage = React.lazy(() => import('../pages/shop/ProductDetailPage'));
const CartPage = React.lazy(() => import('../pages/shop/CartPage'));
const CheckoutPage = React.lazy(() => import('../pages/shop/CheckoutPage'));
const OrdersPage = React.lazy(() => import('../pages/shop/OrdersPage'));
const OrderDetailPage = React.lazy(() => import('../pages/shop/OrderDetailPage'));
const WishlistPage = React.lazy(() => import('../pages/shop/WishlistPage'));
const AdminProductsPage = React.lazy(() => import('../pages/admin/ProductsPage'));
const AdminOrdersPage = React.lazy(() => import('../pages/admin/OrdersPage'));
const AdminMembersPage = React.lazy(() => import('../pages/admin/MembersPage'));
const AdminGymsPage = React.lazy(() => import('../pages/admin/GymsPage'));
const AdminClassesPage = React.lazy(() => import('../pages/admin/ClassManagementPage'));
const AdminTrainersPage = React.lazy(() => import('../pages/admin/TrainerManagementPage'));
const AdminPaymentsPage = React.lazy(() => import('../pages/admin/FinancialSettlementPage'));
const AdminReportsPage = React.lazy(() => import('../pages/admin/ReportsPage'));
const AdminContentPage = React.lazy(() => import('../pages/admin/BlogPage'));
const AdminSettingsPage = React.lazy(() => import('../pages/admin/SettingsPage'));

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user?.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Public Layout (with Navbar and Footer)
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-dark-navy dark:bg-gray-900">
    <Navbar />
    <main id="main-content" className="flex-grow">
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </main>
    <Footer />
  </div>
);

// Member Layout (with Navbar and Footer, protected)
const MemberLayout = ({ children }) => (
  <MemberSidebarLayout>
    <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
  </MemberSidebarLayout>
);

// Admin Layout (protected)
const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen bg-dark-navy dark:bg-gray-900">
    {/* Admin Sidebar would go here */}
    <main id="main-content" className="flex-grow">
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </main>
  </div>
);

// Gym Owner Layout (protected)
const GymOwnerLayout = ({ children }) => (
  <div className="flex min-h-screen bg-dark-navy dark:bg-gray-900">
    {/* Gym Owner Sidebar would go here */}
    <main id="main-content" className="flex-grow">
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </main>
  </div>
);

const AppRouter = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const { accessToken, isTokenVerifying, user } = useSelector((state) => state.auth);

  // Initialize store reference for interceptors
  useEffect(() => {
    setStore(store);
  }, [store]);

  // Verify token on app mount
  useEffect(() => {
    if (accessToken) {
      dispatch(verifyTokenAsync(accessToken));
    }
  }, [dispatch, accessToken]);

  if (isTokenVerifying) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <GlobalLoadingBar />
        <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/locations"
          element={
            <PublicLayout>
              <Locations />
            </PublicLayout>
          }
        />

        <Route
          path="/classes"
          element={
            <PublicLayout>
              <Classes />
            </PublicLayout>
          }
        />

        <Route
          path="/training"
          element={
            <PublicLayout>
              <Training />
            </PublicLayout>
          }
        />

        <Route
          path="/crunch-plus"
          element={
            <PublicLayout>
              <CrunchPlus />
            </PublicLayout>
          }
        />

        <Route
          path="/membership"
          element={
            <PublicLayout>
              <Membership />
            </PublicLayout>
          }
        />

        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />

        <Route
          path="/free-trial"
          element={
            <PublicLayout>
              <FreeTrial />
            </PublicLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />

        <Route
          path="/join"
          element={
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          }
        />

        <Route
          path="/register"
          element={
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicLayout>
              <ForgotPasswordPage />
            </PublicLayout>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicLayout>
              <ResetPasswordPage />
            </PublicLayout>
          }
        />

        <Route
          path="/verify-email"
          element={
            <PublicLayout>
              <VerifyEmailPage />
            </PublicLayout>
          }
        />

        {/* Member Onboarding Routes */}
        <Route
          path="/member/onboarding"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <OnboardingFlow />
              </PublicLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/profile-setup"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <ProfileSetupPage />
              </PublicLayout>
            </ProtectedRoute>
          }
        />

        {/* Member Protected Routes */}
        <Route
          path="/member/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/profile"
          element={
            <ProtectedRoute>
              <MemberLayout>
                <MemberProfile />
              </MemberLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/classes"
          element={
            <ProtectedRoute>
              <MemberClassesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/checkin"
          element={
            <ProtectedRoute>
              <CheckInPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/trainers"
          element={
            <ProtectedRoute>
              <TrainersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/nutrition"
          element={
            <ProtectedRoute>
              <MemberLayout>
                <NutritionPage />
              </MemberLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/challenges"
          element={
            <ProtectedRoute>
              <MemberLayout>
                <ChallengesPage />
              </MemberLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/community"
          element={
            <ProtectedRoute>
              <MemberLayout>
                <CommunityPage userId={user?.id} currentUser={user} />
              </MemberLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/settings"
          element={
            <ProtectedRoute>
              <MemberLayout>
                <MemberSettingsPage />
              </MemberLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/members"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminLayout>
                <AdminMembersPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/gyms"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminGymsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/classes"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminClassesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/trainers"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminTrainersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminPaymentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/content"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminContentPage />
            </ProtectedRoute>
          }
        />

        {/* Backward-compatible alias in case users navigate to /admin/contents */}
        <Route
          path="/admin/contents"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminContentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Gym Owner Protected Routes */}
        <Route
          path="/gym-owner/dashboard"
          element={
            <ProtectedRoute requiredRole="gym_owner">
              <GymOwnerLayout>
                <GymOwnerDashboard />
              </GymOwnerLayout>
            </ProtectedRoute>
          }
        />

        {/* Shop / E-Commerce Routes */}
        <Route
          path="/shop"
          element={
            <PublicLayout>
              <ShopPage />
            </PublicLayout>
          }
        />

        <Route
          path="/product/:slug"
          element={
            <PublicLayout>
              <ProductDetailPage />
            </PublicLayout>
          }
        />

        <Route
          path="/cart"
          element={
            <PublicLayout>
              <CartPage />
            </PublicLayout>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <CheckoutPage />
              </PublicLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MemberLayout>
                <OrdersPage />
              </MemberLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <MemberLayout>
                <OrderDetailPage />
              </MemberLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <MemberLayout>
                <WishlistPage />
              </MemberLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin E-Commerce Routes */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminLayout>
                <AdminProductsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole={['admin', 'super_admin']}>
              <AdminLayout>
                <AdminOrdersPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <React.Suspense fallback={<LoadingFallback />}>
              <NotFoundPage />
            </React.Suspense>
          }
        />
      </Routes>
    </Router>
    </ErrorBoundary>
  );
};

export default AppRouter;
