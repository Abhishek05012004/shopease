"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  MapPin,
  Clock,
  User,
  Mail,
  X,
} from "lucide-react";
import { ordersAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery(
    "adminOrders",
    ordersAPI.getAllOrders
  );

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const highlightId = queryParams.get("highlight");
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (highlightId && orders?.data && !hasScrolled) {
      const element = document.getElementById(`order-${highlightId}`);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          setHasScrolled(true);
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [highlightId, orders, hasScrolled]);

  const updateOrderStatusMutation = useMutation(
    ({ orderId, status }) => ordersAPI.updateOrderStatus(orderId, status),
    {
      onSuccess: (data, variables) => {
        if (variables.status === "Cancelled") {
          toast.success("Order cancelled. Notification email sent to the user.");
        } else {
          toast.success("Order status updated successfully!");
        }
        queryClient.invalidateQueries("adminOrders");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to update order status"
        );
      },
    }
  );

  const handleStatusUpdate = (orderId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;

    if (currentStatus === "Pending") {
      if (newStatus !== "Processing" && newStatus !== "Cancelled") {
        toast.error("Order needs to be moved to Processing first");
        return;
      }
    } else if (currentStatus === "Processing") {
      if (newStatus !== "Shipped" && newStatus !== "Cancelled") {
        if (newStatus === "Pending") {
          toast.error("Order status cannot be moved backward");
        } else {
          toast.error("Order needs to be moved to Shipped first");
        }
        return;
      }
    } else if (currentStatus === "Shipped") {
      if (newStatus !== "Delivered" && newStatus !== "Cancelled") {
        toast.error("Order status cannot be moved backward");
        return;
      }
    }

    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Processing":
        return <Package className="h-4 w-4" />;
      case "Shipped":
        return <Truck className="h-4 w-4" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      Pending: "Processing",
      Processing: "Shipped",
      Shipped: "Delivered",
    };
    return statusFlow[currentStatus];
  };

  const getAllowedStatuses = (currentStatus) => {
    if (currentStatus === "Delivered" || currentStatus === "Cancelled") {
      return [currentStatus];
    }
    const allowed = [currentStatus];
    if (currentStatus === "Pending") {
      allowed.push("Processing");
    } else if (currentStatus === "Processing") {
      allowed.push("Shipped");
    } else if (currentStatus === "Shipped") {
      allowed.push("Delivered");
    }
    if (currentStatus !== "Delivered" && currentStatus !== "Cancelled") {
      if (!allowed.includes("Cancelled")) {
        allowed.push("Cancelled");
      }
    }
    return allowed;
  };

  const filteredOrders = orders?.data?.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Order Management</h1>
        <p className="text-slate-300 text-xs sm:text-sm mt-1 sm:mt-2">
          Track and manage all customer orders with delivery status
        </p>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile-friendly Cards (Visible on mobile/tablet, hidden on desktop) */}
      <div className="md:hidden space-y-4 mb-6">
        {filteredOrders?.map((order) => {
          const isHighlighted = order._id === highlightId;
          return (
            <div
              key={order._id}
              id={`order-${order._id}`}
              className={`bg-slate-800 rounded-lg p-4 border transition-all duration-500 shadow-md space-y-4 ${
                isHighlighted
                  ? "ring-2 ring-yellow-500 border-transparent shadow-lg shadow-yellow-500/10"
                  : "border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white">#{order._id.slice(-8)}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{formatDate(order.createdAt)}</span>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  <span className="ml-1 text-[10px]">{order.status}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Customer</span>
                  <span className="text-white font-medium block break-words">{order.user?.name}</span>
                  <span className="text-slate-400 block break-all text-[10px]">{order.user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Items & Total</span>
                  <span className="text-slate-300 block">{order.orderItems.length} items</span>
                  <span className="text-white font-semibold">₹{order.totalPrice.toFixed(2)}</span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    <span className="block">Mode: {order.paymentMethod}</span>
                    <span className={`block font-semibold ${order.isPaid ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      Status: {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </div>
              </div>

              {order.trackingNumber && (
                <div className="bg-slate-700/50 p-2 rounded text-[10px] text-slate-400 border border-slate-600/50">
                  Tracking Number: <span className="text-slate-200">{order.trackingNumber}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-700">
                <button
                  onClick={() => handleViewOrder(order)}
                  className="text-blue-400 hover:text-blue-300 p-2 rounded bg-slate-700/50 hover:bg-slate-700 transition-colors flex items-center justify-center flex-1 text-xs font-semibold"
                  title="View Details"
                >
                  <Eye className="h-4 w-4 mr-1" /> Details
                </button>
                {getNextStatus(order.status) && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        order._id,
                        order.status,
                        getNextStatus(order.status)
                      )
                    }
                    className="text-green-400 hover:text-green-300 p-2 rounded bg-slate-700/50 hover:bg-slate-700 border border-green-600/30 hover:border-green-600 transition-colors flex items-center justify-center flex-1 text-xs font-semibold"
                    disabled={updateOrderStatusMutation.isLoading}
                  >
                    {getNextStatus(order.status)}
                  </button>
                )}
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusUpdate(order._id, order.status, e.target.value)
                  }
                  className="text-xs bg-slate-700 border border-slate-600 rounded p-2 text-white hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  disabled={updateOrderStatusMutation.isLoading || order.status === "Delivered" || order.status === "Cancelled"}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Orders Table (Visible on Desktop) */}
      <div className="hidden md:block bg-slate-800 rounded-lg shadow-sm border border-slate-700 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Items & Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status & Tracking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {filteredOrders?.map((order) => {
                const isHighlighted = order._id === highlightId;
                return (
                  <tr
                    key={order._id}
                    id={`order-${order._id}`}
                    className={`transition-all duration-500 ${
                      isHighlighted
                        ? "bg-slate-700/90 ring-2 ring-yellow-500 ring-inset shadow-lg shadow-yellow-500/10"
                        : "hover:bg-slate-700"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          #{order._id.slice(-8)}
                        </div>
                        <div className="text-sm text-slate-400">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-slate-900" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {order.user?.name}
                          </div>
                          <div className="text-sm text-slate-400">
                            {order.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-slate-300">
                          {order.orderItems.length} item
                          {order.orderItems.length !== 1 ? "s" : ""}
                        </div>
                        <div className="text-sm font-semibold text-white">
                          ₹{order.totalPrice.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Mode: {order.paymentMethod}
                        </div>
                        <div className={`text-xs font-semibold mt-0.5 ${order.isPaid ? 'text-emerald-400' : 'text-yellow-400'}`}>
                          Status: {order.isPaid ? 'Paid' : 'Unpaid'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                        {order.trackingNumber && (
                          <div className="text-xs text-slate-400">
                            Tracking: {order.trackingNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-slate-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {getNextStatus(order.status) && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                order._id,
                                order.status,
                                getNextStatus(order.status)
                              )
                            }
                            className="text-green-400 hover:text-green-300 text-xs px-2 py-1 border border-green-600 rounded hover:bg-green-900/20 transition-colors"
                            disabled={updateOrderStatusMutation.isLoading}
                            title={`Mark as ${getNextStatus(order.status)}`}
                          >
                            {getNextStatus(order.status)}
                          </button>
                        )}
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order._id, order.status, e.target.value)
                          }
                          className="text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={updateOrderStatusMutation.isLoading || order.status === "Delivered" || order.status === "Cancelled"}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders?.length === 0 && (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">
            No orders found matching your criteria.
          </p>
        </div>
      )}

      {/* Enhanced Summary Stats */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
          (status) => {
            const count =
              orders?.data?.filter((order) => order.status === status).length ||
              0;
            const revenue =
              orders?.data
                ?.filter((order) => order.status === status)
                ?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;

            return (
              <div
                key={status}
                className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-4 sm:p-6 hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm sm:text-base font-semibold text-white">{status}</h3>
                  <div className="text-slate-400">{getStatusIcon(status)}</div>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{count}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                  ₹{revenue.toFixed(2)}
                </p>
              </div>
            );
          }
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-4 sm:p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Order #{selectedOrder._id.slice(-8)}
                </h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-slate-400 hover:text-slate-300 p-1"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* Customer Info */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-300 truncate">
                      {selectedOrder.user?.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-300 truncate">
                      {selectedOrder.user?.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Shipping Address
                </h3>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>
                      {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.state && `${selectedOrder.shippingAddress.state}, `}
                      {selectedOrder.shippingAddress?.postalCode}
                    </p>
                    <p>{selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={
                            item.image ||
                            `/placeholder.svg?height=50&width=50&query=${item.name}`
                          }
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded shrink-0 border border-slate-600"
                        />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-white truncate">{item.name}</p>
                          <p className="text-[10px] sm:text-xs text-slate-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-white shrink-0 ml-2">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-400">Subtotal:</span>
                    <span className="text-slate-300">
                      ₹{selectedOrder.itemsPrice?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-400">Shipping:</span>
                    <span className="text-slate-300">
                      ₹{selectedOrder.shippingPrice?.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-slate-600 pt-2">
                    <div className="flex justify-between font-semibold text-xs sm:text-sm">
                      <span className="text-white">Total:</span>
                      <span className="text-white">
                        ₹{selectedOrder.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Payment Method / Mode:</span>
                    <span className="text-white font-medium">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Payment Status:</span>
                    <span className={`font-semibold ${selectedOrder.isPaid ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {selectedOrder.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800">
                <h3 className="text-sm font-semibold text-white mb-3">Update Status</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const current = selectedOrder.status;
                      const target = e.target.value;
                      let isValid = true;
                      
                      if (current === "Pending" && target !== "Processing" && target !== "Cancelled") isValid = false;
                      if (current === "Processing" && target !== "Shipped" && target !== "Cancelled") isValid = false;
                      if (current === "Shipped" && target !== "Delivered" && target !== "Cancelled") isValid = false;
                      
                      handleStatusUpdate(selectedOrder._id, current, target);
                      
                      if (isValid) {
                        setSelectedOrder({
                          ...selectedOrder,
                          status: target,
                        });
                      }
                    }}
                    className="px-3.5 py-2 bg-slate-700 border border-slate-600 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    disabled={updateOrderStatusMutation.isLoading || selectedOrder.status === "Delivered" || selectedOrder.status === "Cancelled"}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1">{selectedOrder.status}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
