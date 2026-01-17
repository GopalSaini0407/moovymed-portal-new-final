import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* =======================
   Lazy Loaded Components
======================= */

// Auth
const Login = lazy(() => import("../features/auth/LoginForm"));
const Register = lazy(() => import("../features/auth/RegisterForm"));
const ForgotPassword = lazy(() => import("../features/auth/ForgetPasswordForm"));
const VerifyOTP = lazy(() => import("../features/auth/VerifyOTPForm"));
const ResetPassword = lazy(() => import("../features/auth/ResetPasswordForm"));

// Pages
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Settings = lazy(() => import("../pages/Settings"));
const SettingsTags = lazy(() => import("../pages/SettingsTags"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const CategoryDetails = lazy(() => import("../pages/CategoryDetails"));
const ContentDetail = lazy(() => import("../pages/ContentDetails"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Static Pages
const Privacy = lazy(() => import("../components/Privacy"));
const LegalNotice = lazy(() => import("../components/LegalNotice"));
const MembershipPlan = lazy(() => import("../components/MembershipPlan"));

/* =======================
   Route Guards
======================= */

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
}

/* =======================
   App Router
======================= */

const AppRouter = () => {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOTP /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/settings/tags" element={<ProtectedRoute><SettingsTags /></ProtectedRoute>} />
        <Route path="/settings/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/category/:id" element={<ProtectedRoute><CategoryDetails /></ProtectedRoute>} />
        <Route path="/category/:cat_id/content/:id" element={<ProtectedRoute><ContentDetail /></ProtectedRoute>} />

        {/* Static Pages */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/legal-notice" element={<LegalNotice />} />
        <Route path="/membership" element={<MembershipPlan />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
