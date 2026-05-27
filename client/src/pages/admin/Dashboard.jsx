"use client";

import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  AlertCircle,
  Bell,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { usersAPI, productsAPI, ordersAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const AdminDashboard = () => {
  const { data: userStats, isLoading: userStatsLoading } = useQuery(
    "userStats",
    () =>
      usersAPI.getUsers().then((res) => ({
        total: res.data.length,
        admins: res.data.filter((user) => user.role === "admin").length,
        users: res.data.filter((user) => user.role === "user").length,
        newThisMonth: res.data.filter((user) => {
          const userDate = new Date(user.createdAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return userDate >= thirtyDaysAgo;
        }).length,
      }))
  );

  const { data: productStats, isLoading: productStatsLoading } = useQuery(
    "productStats",
    () =>
      productsAPI.getProducts({ limit: 1000 }).then((res) => ({
        total: res.data.totalProducts,
        inStock: res.data.products.filter((product) => product.stock > 0)
          .length,
        outOfStock: res.data.products.filter((product) => product.stock === 0)
          .length,
        featured: res.data.products.filter((product) => product.featured)
          .length,
        lowStock: res.data.products.filter(
          (product) => product.stock > 0 && product.stock <= 10
        ).length,
      }))
  );

  const { data: orderStats, isLoading: orderStatsLoading } = useQuery(
    "orderStats",
    () =>
      ordersAPI.getAllOrders().then((res) => {
        const orders = res.data;
        const totalRevenue = orders.reduce(
          (sum, order) => sum + order.totalPrice,
          0
        );
        const pendingOrders = orders.filter(
          (order) => order.status === "Pending"
        ).length;
        const completedOrders = orders.filter(
          (order) => order.status === "Delivered"
        ).length;
        const processingOrders = orders.filter(
          (order) => order.status === "Processing"
        ).length;
        const shippedOrders = orders.filter(
          (order) => order.status === "Shipped"
        ).length;

        // Calculate monthly revenue
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = orders
          .filter((order) => {
            const orderDate = new Date(order.createdAt);
            return (
              orderDate.getMonth() === currentMonth &&
              orderDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, order) => sum + order.totalPrice, 0);

        return {
          total: orders.length,
          totalRevenue,
          monthlyRevenue,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          completed: completedOrders,
          averageOrderValue:
            orders.length > 0 ? totalRevenue / orders.length : 0,
          recentOrders: orders.slice(0, 5), // Get 5 most recent orders
        };
      })
  );

  const isLoading =
    userStatsLoading || productStatsLoading || orderStatsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: "Total Users",
      value: userStats?.total || 0,
      change: `+${userStats?.newThisMonth || 0} this month`,
      changeType: "positive",
      icon: Users,
      color: "bg-blue-500",
      description: `${userStats?.admins || 0} admins, ${
        userStats?.users || 0
      } customers`,
    },
    {
      name: "Total Products",
      value: productStats?.total || 0,
      change: `${productStats?.inStock || 0} in stock`,
      changeType: "neutral",
      icon: Package,
      color: "bg-emerald-500",
      description: `${productStats?.lowStock || 0} low stock alerts`,
    },
    {
      name: "Total Orders",
      value: orderStats?.total || 0,
      change: `${orderStats?.pending || 0} pending`,
      changeType: "neutral",
      icon: ShoppingCart,
      color: "bg-purple-500",
      description: `${orderStats?.processing || 0} processing, ${
        orderStats?.shipped || 0
      } shipped`,
    },
    {
      name: "Total Revenue",
      value: `₹${orderStats?.totalRevenue?.toFixed(2) || "0.00"}`,
      change: `₹${orderStats?.monthlyRevenue?.toFixed(2) || "0.00"} this month`,
      changeType: "positive",
      icon: IndianRupee,
      color: "bg-yellow-500",
      description: `Avg: ₹${
        orderStats?.averageOrderValue?.toFixed(2) || "0.00"
      } per order`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-300 mt-2">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>

        {/* Quick notifications */}
        {orderStats?.pending > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 flex items-center space-x-3">
            <Bell className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-yellow-200">
                {orderStats.pending} new orders need attention
              </p>
              <Link
                to="/admin/orders"
                className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center"
              >
                View orders <ArrowUpRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-slate-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                ) : stat.changeType === "negative" ? (
                  <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                ) : null}
                <span
                  className={`text-sm ${
                    stat.changeType === "positive"
                      ? "text-emerald-400"
                      : stat.changeType === "negative"
                      ? "text-red-400"
                      : "text-slate-300"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Order Status Breakdown */}
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Order Status Overview
            </h2>
            <PieChart className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {[
              {
                status: "Pending",
                count: orderStats?.pending || 0,
                color: "bg-yellow-500",
              },
              {
                status: "Processing",
                count: orderStats?.processing || 0,
                color: "bg-blue-500",
              },
              {
                status: "Shipped",
                count: orderStats?.shipped || 0,
                color: "bg-purple-500",
              },
              {
                status: "Delivered",
                count: orderStats?.completed || 0,
                color: "bg-emerald-500",
              },
            ].map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-slate-200 font-medium">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-semibold">{item.count}</span>
                  <span className="text-slate-400 text-sm">
                    (
                    {orderStats?.total > 0
                      ? ((item.count / orderStats.total) * 100).toFixed(1)
                      : 0}
                    %)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Inventory Status
            </h2>
            <AlertCircle className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-200 font-medium">In Stock</span>
              </div>
              <span className="text-white font-semibold">
                {productStats?.inStock || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-slate-200 font-medium">Low Stock</span>
              </div>
              <span className="text-white font-semibold">
                {productStats?.lowStock || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-slate-200 font-medium">Out of Stock</span>
              </div>
              <span className="text-white font-semibold">
                {productStats?.outOfStock || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-slate-200 font-medium">Featured</span>
              </div>
              <span className="text-white font-semibold">
                {productStats?.featured || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            <a
              href="/admin/products"
              className="flex items-center p-4 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors group"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-4">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white group-hover:text-emerald-400">
                  Manage Products
                </p>
                <p className="text-sm text-slate-400">
                  Add, edit, or remove products
                </p>
              </div>
            </a>
            <Link
              to="/admin/orders"
              className="flex items-center p-4 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white group-hover:text-purple-400">
                  Manage Orders
                </p>
                <p className="text-sm text-slate-400">
                  View and update order status
                </p>
              </div>
            </Link>
            <a
              href="/admin/users"
              className="flex items-center p-4 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white group-hover:text-blue-400">
                  Manage Users
                </p>
                <p className="text-sm text-slate-400">
                  View and manage user accounts
                </p>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-400">Latest orders</span>
            </div>
          </div>
          <div className="space-y-4">
            {orderStats?.recentOrders?.length > 0 ? (
              orderStats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      Order #{order._id.slice(-8)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {order.user?.name} • ₹{order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Pending"
                          ? "bg-yellow-900/30 text-yellow-300 border border-yellow-700"
                          : order.status === "Processing"
                          ? "bg-blue-900/30 text-blue-300 border border-blue-700"
                          : order.status === "Shipped"
                          ? "bg-purple-900/30 text-purple-300 border border-purple-700"
                          : order.status === "Delivered"
                          ? "bg-emerald-900/30 text-emerald-300 border border-emerald-700"
                          : "bg-slate-700 text-slate-300 border border-slate-600"
                      }`}
                    >
                      {order.status}
                    </span>
                    <Link
                      to={`/admin/orders?highlight=${order._id}`}
                      className="text-slate-400 hover:text-slate-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No recent orders</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
