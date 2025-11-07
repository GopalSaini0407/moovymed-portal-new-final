// src/router/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute component
 * @param {ReactNode} children - The component(s) to render if authenticated
 */
const ProtectedRoute = ({ children }) => {
 
  const user=localStorage.getItem('token')

  // // Show nothing or loader while checking auth
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <p className="text-gray-500">Loading...</p>
  //     </div>
  //   );
  // }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render children
  return children;
};

export default ProtectedRoute;
