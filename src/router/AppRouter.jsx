import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Auth Forms
import Login from "../features/auth/LoginForm";
import Register from "../features/auth/RegisterForm";
import ForgotPassword from "../features/auth/ForgetPasswordForm";
import VerifyOTP from "../features/auth/VerifyOTPForm";
import ResetPassword from "../features/auth/ResetPasswordForm";

// Pages
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import SettingsTags from "../pages/SettingsTags";
import UserProfile from "../pages/UserProfile";
import CategoryDetails from "../pages/CategoryDetails";
import ContentDetail from "../pages/ContentDetails";

// 🔒 Protected route wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// 🌐 Public route wrapper
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  // If already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const AppRouter = () => {
  return (
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
      <Route path="/content/:id" element={<ProtectedRoute><ContentDetail /></ProtectedRoute>} />

      {/* Optional: 404 route */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRouter;
