"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Store,
  ArrowRight,
  Shield,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [searchParams] = useSearchParams();

  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailTrimmed = (formData.email || "").trim();
    if (!emailTrimmed) {
      toast.error("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required.");
      return;
    }

    try {
      await login(emailTrimmed, formData.password, rememberMe);
      navigate(redirect);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg"></div>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
              <Store className="h-10 w-10 text-white" />
            </div>
            <h1
              className="text-4xl font-bold mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Welcome Back to ShopEase
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Your premium shopping destination with thousands of products and
              unbeatable prices.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-blue-100">
                <Shield className="h-5 w-5 mr-3" />
                <span>Secure & encrypted transactions</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Users className="h-5 w-5 mr-3" />
                <span>Join 50,000+ happy customers</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-orange-400 bg-opacity-20 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 sm:p-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="lg:hidden w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Sign in to your account
              </h2>
              <p className="text-gray-600">
                Or{" "}
                <Link
                  to={`/register${
                    redirect !== "/" ? `?redirect=${redirect}` : ""
                  }`}
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  create a new account
                </Link>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input pl-12 py-4 text-base"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input pl-12 pr-12 py-4 text-base"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="filter-checkbox"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-xs sm:text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-blue-600 hover:text-blue-500 transition-colors whitespace-nowrap"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign in
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3
                className="text-sm font-bold text-blue-900 mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Demo Credentials
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">
                    User Account:
                  </span>
                  <span className="text-blue-600 font-mono text-xs">
                    john@example.com / user123
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">
                    Admin Account:
                  </span>
                  <span className="text-blue-600 font-mono text-xs">
                    admin@shopease.com / admin123
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
