"use client";

import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Store } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const Auth = ({ defaultForm = "login" }) => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(() => {
    if (searchParams.get("tab") === "signup") return false;
    if (defaultForm === "register") return false;
    return true;
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (searchParams.get("tab") === "signup") {
      setIsLogin(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (defaultForm === "register") {
      setIsLogin(false);
    } else if (defaultForm === "login") {
      setIsLogin(true);
    }
  }, [defaultForm]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
       setError("Please enter Name and Email to receive OTP");
       return;
    }
    try {
      setOtpLoading(true);
      setError("");
      await authAPI.sendOtp(formData.email);
      setIsOtpSent(true);
      toast.success("OTP sent successfully to your email!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(formData.email, formData.password, rememberMe);
      } else {
        if (!isOtpSent) {
          setError("Please verify your email with OTP first");
          setLoading(false);
          return;
        }
        if (!formData.otp) {
          setError("OTP is required");
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        await register(formData.name, formData.email, formData.password, formData.otp);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setIsOtpSent(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-800 flex">
      {/* Left Panel - Enhanced with e-commerce imagery */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center mr-4 shadow-md">
                <Store className="text-slate-800 h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold text-yellow-400">ShopEase</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              {isLogin ? "Welcome Back!" : "Join ShopEase"}
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              {isLogin
                ? "Sign in to access your account and continue shopping amazing products at unbeatable prices."
                : "Create your account and discover thousands of products with fast shipping and secure checkout."}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-lg">Free shipping on orders over ₹500</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-lg">24/7 customer support</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-lg">Secure payment & checkout</span>
            </div>
          </div>

          <div className="mt-12 p-6 bg-slate-800 bg-opacity-60 rounded-2xl backdrop-blur-sm border border-slate-600">
            <h3 className="font-semibold mb-2 text-yellow-400">
              Demo Credentials
            </h3>
            <p className="text-sm text-slate-300">
              <strong>Admin:</strong> admin@shopease.com / admin123
              <br />
              <strong>User:</strong> john@example.com / user123
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center">
              <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center mr-3 shadow-md">
                <Store className="text-slate-800 h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-yellow-400">
                ShopEase
              </span>
            </Link>
          </div>

          <div className="bg-slate-700 rounded-2xl shadow-xl p-8 border border-slate-600">
            {/* Toggle Buttons */}
            <div className="flex bg-slate-600 rounded-xl p-1 mb-8">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  isLogin
                    ? "bg-yellow-400 text-slate-800 shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  !isLogin
                    ? "bg-yellow-400 text-slate-800 shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-slate-300">
                {isLogin
                  ? "Sign in to your account to continue shopping"
                  : "Join thousands of happy customers today"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-500 rounded-xl">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">               {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    disabled={isOtpSent}
                    className="w-full px-4 py-3 border border-slate-500 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all bg-slate-600 text-white placeholder-slate-400 disabled:opacity-50 disabled:bg-slate-700"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!isLogin && isOtpSent}
                  className="w-full px-4 py-3 border border-slate-500 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all bg-slate-600 text-white placeholder-slate-400 disabled:opacity-50 disabled:bg-slate-700"
                  placeholder="Enter your email"
                />
              </div>

              {!isLogin && !isOtpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading || !formData.name || !formData.email}
                  className="w-full bg-yellow-400 text-slate-800 py-3 px-4 rounded-xl font-medium hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {otpLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-800" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </div>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              )}

              {!isLogin && isOtpSent && (
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    OTP (Sent to email)
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 border border-slate-500 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all bg-slate-600 text-white placeholder-slate-400 tracking-widest font-mono"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
              )}

              {(isLogin || isOtpSent) && (
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pr-12 border border-slate-500 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all bg-slate-600 text-white placeholder-slate-400"
                      placeholder="Enter your password"
                    />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {!isLogin && formData.password && formData.password.length < 6 && (
                  <p className="mt-1 text-sm text-red-400">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>
              )}

              {!isLogin && isOtpSent && (
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full px-4 py-3 border border-slate-500 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all bg-slate-600 text-white placeholder-slate-400"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-500 text-yellow-400 focus:ring-yellow-400 bg-slate-600"
                    />
                    <span className="ml-2 text-sm text-slate-300">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-yellow-400 hover:text-yellow-300"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {(isLogin || isOtpSent) && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 text-slate-800 py-3 px-4 rounded-xl font-medium hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-800"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            )}
          </form>

            <div className="mt-8 text-center">
              <p className="text-slate-300">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={toggleMode}
                  className="text-yellow-400 hover:text-yellow-300 font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
