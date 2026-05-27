"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import AdminLayout from "./components/Layout/AdminLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import PaymentFailed from "./pages/PaymentFailed";
import CheckoutVerify from "./pages/CheckoutVerify";

const AdminRedirect = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Customer Routes with regular Layout */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              {/* Public Routes - Redirect admins to dashboard */}
              <Route
                path="/"
                element={
                  <AdminRedirect>
                    <Home />
                  </AdminRedirect>
                }
              />
              <Route
                path="/products"
                element={
                  <AdminRedirect>
                    <Products />
                  </AdminRedirect>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <AdminRedirect>
                    <ProductDetail />
                  </AdminRedirect>
                }
              />
              <Route
                path="/cart"
                element={
                  <AdminRedirect>
                    <Cart />
                  </AdminRedirect>
                }
              />
              <Route path="/login" element={<Auth defaultForm="login" />} />
              <Route
                path="/register"
                element={<Auth defaultForm="register" />}
              />
              <Route
                path="/forgot-password"
                element={<ForgotPassword />}
              />

              {/* Protected Routes - Redirect admins to dashboard */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <AdminRedirect>
                      <Checkout />
                    </AdminRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/verify"
                element={
                  <ProtectedRoute>
                    <AdminRedirect>
                      <CheckoutVerify />
                    </AdminRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-failed"
                element={
                  <ProtectedRoute>
                    <AdminRedirect>
                      <PaymentFailed />
                    </AdminRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AdminRedirect>
                      <Profile />
                    </AdminRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <AdminRedirect>
                      <Orders />
                    </AdminRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <AdminRedirect>
                      <OrderDetail />
                    </AdminRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <AdminRedirect>
                      <Wishlist />
                    </AdminRedirect>
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        }
      />

      <Route
        path="/admin/*"
        element={
          <AdminLayout>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              {/* Redirect /admin to /admin/dashboard */}
              <Route
                path="/"
                element={<Navigate to="/admin/dashboard" replace />}
              />
            </Routes>
          </AdminLayout>
        }
      />
    </Routes>
  );
}

export default App;
