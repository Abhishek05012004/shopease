"use client";

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./UI/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, token } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-800">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    // Redirect to login page with return url
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
