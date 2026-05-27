"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Store,
  ArrowRight,
  Shield,
  Users,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const { register, loading, isAuthenticated } = useAuth();
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please enter Name and Email to receive OTP");
      return;
    }
    try {
      setOtpLoading(true);
      await authAPI.sendOtp(formData.email);
      setIsOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpSent) {
      toast.error("Please verify your email with OTP first");
      return;
    }

    if (!formData.otp) {
      toast.error("OTP is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.otp);
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
              Join ShopEase Today
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Create your account and start shopping from thousands of premium
              products with exclusive member benefits.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-blue-100">
                <CheckCircle className="h-5 w-5 mr-3" />
                <span>Free shipping on orders over ₹500</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Shield className="h-5 w-5 mr-3" />
                <span>Secure & encrypted transactions</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Users className="h-5 w-5 mr-3" />
                <span>24/7 customer support</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-400 bg-opacity-20 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="lg:hidden w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h2
                className="text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Create your account
              </h2>
              <p className="text-gray-600">
                Or{" "}
                <Link
                  to={`/login${
                    redirect !== "/" ? `?redirect=${redirect}` : ""
                  }`}
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  sign in to your existing account
                </Link>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    disabled={isOtpSent}
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input pl-12 py-4 text-base disabled:opacity-50 disabled:bg-gray-100"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

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
                    disabled={isOtpSent}
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input pl-12 py-4 text-base disabled:opacity-50 disabled:bg-gray-100"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {!isOtpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading || !formData.name || !formData.email}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                  {otpLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner mr-3"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              )}

              {isOtpSent && (
                <div>
                  <label htmlFor="otp" className="form-label">
                    OTP (Sent to your email)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={formData.otp}
                      onChange={handleChange}
                      className="form-input pl-12 py-4 text-base tracking-widest font-mono"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                    />
                  </div>
                </div>
              )}

              {isOtpSent && (
                <>
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
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="form-input pl-12 pr-12 py-4 text-base"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-input pl-12 pr-12 py-4 text-base"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                </>
              )}

              <div className="flex items-start">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="filter-checkbox mt-1"
                />
                <label
                  htmlFor="agree-terms"
                  className="ml-3 text-sm text-gray-700 leading-relaxed"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {isOtpSent && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl animate-fadeIn"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner mr-3"></div>
                      Creating account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Create account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </button>
              )}
            </form>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            By creating an account, you agree to our{" "}
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

export default Register;
