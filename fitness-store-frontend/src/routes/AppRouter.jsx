import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyTokenAsync, setStore } from '../app/slices/authSlice';
import { useStore } from 'react-redux';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';
import MemberSidebarLayout from '../layouts/MemberLayout';
import AdminSidebarLayout from '../layouts/AdminLayout';
import GymOwnerSidebarLayout from '../layouts/GymOwnerLayout';
import ErrorBoundary from '../components/error/ErrorBoundary';
import LoadingFallback from '../components/loading/LoadingFallback';
import GlobalLoadingBar from '../components/loading/GlobalLoadingBar';

// Lightweight inline spinner for route transitions (avoids full-page skeleton flash)
const RouteSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent/30 border-t-accent" />
  </div>
);

// Route content wrapper that ensures fresh re-renders on route change
const RouteContent = ({ children }) => {
  const { pathname, search } = useLocation();
  return (
    <div key={`${pathname}${search}`} className="w-full">
      <Suspense fallback={<RouteSpinner />}>
        {children}
      </Suspense>
    </div>
  );
};

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

// Shared Public Layout — Navbar and Footer stay mounted across route changes
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-dark-navy dark:bg-gray-900">
    <Navbar />
    <main id="main-content" className="flex-grow">
      <RouteContent>
        <Outlet />
      </RouteContent>
    </main>
    <Footer />
  </div>
);

// Member Layout (with sidebar, protected)
const MemberLayoutRoute = () => (
  <MemberSidebarLayout>
    <RouteContent>
      <Outlet />
    </RouteContent>
  </MemberSidebarLayout>
);

// Admin Layout (protected)
const AdminLayoutRoute = () => (
  <AdminSidebarLayout>
    <RouteContent>
      <Outlet />
    </RouteContent>
  </AdminSidebarLayout>
);

// Gym Owner Layout (protected)
const GymOwnerLayoutRoute = () => (
  <GymOwnerSidebarLayout>
    <RouteContent>
      <Outlet />
    </RouteContent>
  </GymOwnerSidebarLayout>
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
        <ScrollToTop />
        <GlobalLoadingBar />
        <Routes>
          {/* ────────── Public Routes (shared Navbar + Footer) ────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/training" element={<Training />} />
            <Route path="/crunch-plus" element={<CrunchPlus />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/about" element={<About />} />
            <Route path="/free-trial" element={<FreeTrial />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/join" element={<RegisterPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Member Onboarding Routes (public layout, protected) */}
            <Route
              path="/member/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingFlow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/profile-setup"
              element={
                <ProtectedRoute>
                  <ProfileSetupPage />
                </ProtectedRoute>
              }
            />

            {/* Shop / E-Commerce (public layout) */}
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ────────── Member Routes (no public navbar — standalone) ────────── */}
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

          {/* Member Routes with sidebar layout */}
          <Route
            element={
              <ProtectedRoute>
                <MemberLayoutRoute />
              </ProtectedRoute>
            }
          >
            <Route path="/member/profile" element={<MemberProfile />} />
            <Route path="/member/nutrition" element={<NutritionPage />} />
            <Route path="/member/challenges" element={<ChallengesPage />} />
            <Route
              path="/member/community"
              element={<CommunityPage userId={user?.id} currentUser={user} />}
            />
            <Route path="/member/settings" element={<MemberSettingsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>

          {/* ────────── Admin Routes ────────── */}
          <Route
            element={
              <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                <AdminLayoutRoute />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/members" element={<AdminMembersPage />} />
            <Route path="/admin/gyms" element={<AdminGymsPage />} />
            <Route path="/admin/classes" element={<AdminClassesPage />} />
            <Route path="/admin/trainers" element={<AdminTrainersPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/content" element={<AdminContentPage />} />
            <Route path="/admin/contents" element={<AdminContentPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
          </Route>

          {/* ────────── Gym Owner Routes ────────── */}
          <Route
            element={
              <ProtectedRoute requiredRole="gym_owner">
                <GymOwnerLayoutRoute />
              </ProtectedRoute>
            }
          >
            <Route path="/gym-owner/dashboard" element={<GymOwnerDashboard />} />
          </Route>

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
